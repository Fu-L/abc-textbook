"""Read-only T153 checks against a real Cloudflare Pages production origin.

Run from the repository root with Node 24, locked dependencies and Playwright
browsers installed. Credentials are read from the production environment only.
The existing browser suites write records in disposable browser contexts.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
from urllib.parse import urlparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET


def require(condition, reason):
    if not condition:
        raise ValueError(reason)


def fetch(url, token=None):
    headers = {"User-Agent": "abc-textbook-deployment-verification"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    with urlopen(Request(url, headers=headers), timeout=30) as response:
        require(response.status == 200, f"HTTP_NOT_OK:{url}")
        return response.read().decode("utf-8")


def successful_production(deployment, commit):
    return (
        deployment.get("environment") == "production"
        and deployment.get("latest_stage", {}).get("name") == "deploy"
        and deployment.get("latest_stage", {}).get("status") == "success"
        and deployment.get("deployment_trigger", {}).get("metadata", {}).get("commit_hash")
        == commit
    )


def publication_time(deployment):
    value = deployment["latest_stage"].get("ended_on")
    require(value, "HOST_PUBLICATION_TIME_MISSING")
    instant = datetime.fromisoformat(value.replace("Z", "+00:00"))
    require(instant.tzinfo is not None, "HOST_PUBLICATION_TIME_INVALID")
    return instant


def verify_metadata(metadata, catalog, commit):
    release = catalog["release"]
    require(metadata["commit"] == commit, "DEPLOYED_COMMIT_MISMATCH")
    require(metadata["version"] == release["version"], "DEPLOYED_VERSION_MISMATCH")
    require(metadata["cutoffAt"] == release["cutoffAt"], "DEPLOYED_CUTOFF_MISMATCH")
    require(metadata["schemaVersion"] == "1.0.0", "METADATA_SCHEMA_MISMATCH")
    expected = {key: release[key] for key in (
        "updateIds", "addedProblemIds", "changedProblemIds", "withdrawnProblemIds"
    )}
    expected["taxonomyChanges"] = [change["summary"] for change in release["taxonomyChanges"]]
    require(metadata["changeSummary"] == expected, "DEPLOYED_SUMMARY_MISMATCH")
    require(metadata["validationResultsUrl"].startswith("https://"), "VALIDATION_URL_MISSING")


def canonical_routes(catalog, history):
    routes = {"/", "/learn/", "/tags/", "/problems/", "/contests/", "/updates/"}
    routes.update(f'/problems/{problem["id"]}/' for problem in catalog["problems"])
    routes.update(f'/tags/{tag["id"]}/' for tag in catalog["tags"])
    routes.update(f'/contests/{contest["id"]}/' for contest in catalog["contests"])
    routes.update("/" + unit["docPath"].removeprefix("src/content/docs/").removesuffix(".md").removesuffix("/index") + "/"
                  for unit in catalog["learningUnits"])
    routes.update(f'/updates/{release["version"]}/' for release in history)
    return routes


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.headings = 0
        self.controls = []
        self.links = set()
        self.rows = []
        self.text = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "h1":
            self.headings += 1
        if "data-learning-record-control" in attrs:
            self.controls.append(attrs["data-learning-record-control"])
        if tag == "a" and attrs.get("href"):
            self.links.add(attrs["href"])
        if tag == "tr" and attrs.get("id"):
            self.rows.append(attrs["id"])

    def handle_data(self, text):
        self.text.append(text)


def verify_routes(origin, catalog, history):
    routes = canonical_routes(catalog, history)
    all_problem_links = set()

    def inspect(route):
        page = Page(fetch(origin + route))
        require(page.headings == 1, f"HEADING_MISSING:{route}")
        if route.startswith("/problems/abc"):
            require(page.controls == [route.split("/")[2]], f"RECORD_CONTROL_MISSING:{route}")
        return page

    # Bound requests to avoid making the one-person verification a load test.
    with ThreadPoolExecutor(max_workers=4) as pool:
        for page in pool.map(inspect, sorted(routes)):
            all_problem_links.update(link for link in page.links if link.startswith("/problems/abc"))
    require({f'/problems/{p["id"]}/' for p in catalog["problems"]} <= all_problem_links,
            "PROBLEM_NAVIGATION_INCOMPLETE")
    sitemap = ET.fromstring(fetch(origin + "/sitemap.xml"))
    locations = [node.text for node in sitemap.findall("{*}url/{*}loc")]
    require(len(locations) == len(set(locations)), "SITEMAP_DUPLICATES")
    require(set(locations) == {origin + route for route in routes}, "SITEMAP_SCOPE_MISMATCH")
    feed = ET.fromstring(fetch(origin + "/feed.xml"))
    require(feed.findtext("{*}id").rstrip("/") == origin, "FEED_ORIGIN_MISMATCH")
    entries = feed.findall("{*}entry")
    require([entry.findtext("{*}title") for entry in entries] == [r["version"] for r in history],
            "FEED_HISTORY_MISMATCH")
    require([entry.findtext("{*}summary") for entry in entries] ==
            [f'{r["problemCount"]} problems' for r in history], "FEED_SCOPE_MISMATCH")
    home = "".join(Page(fetch(origin + "/")).text)
    for text in ["212〜466", "254コンテスト", "868問", "232単元", "316", "2026年7月12日"]:
        require(text in home, f"HOME_SCOPE_MISSING:{text}")
    contests = Page(fetch(origin + "/contests/"))
    require(set(contests.rows) == {f'matrix-title-{c["id"]}' for c in catalog["contests"]}
            and len(contests.rows) == 254, "CONTEST_MATRIX_SCOPE_MISMATCH")
    require({f'/problems/{p["id"]}/' for p in catalog["problems"]} <= contests.links,
            "CONTEST_PROBLEM_NAVIGATION_INCOMPLETE")
    require("matrix-title-abc316" not in contests.rows and
            catalog["contestGaps"][0]["status"] == "officially_unheld", "OFFICIAL_GAP_MISMATCH")
    return {"htmlRoutes": len(routes), "problemRoutes": 868, "sitemapScopeMatched": True,
            "feedScopeMatched": True, "allProblemNavigationMatched": True}


def browser_checks(root, origin, directory):
    # Reuse accepted tests. Only the local-server setting and origin change.
    config = directory / "playwright.config.mjs"
    report = directory / "browser-results.json"
    config.write_text(
        f'import config from {json.dumps(str(root / "playwright.config.ts"))};\n'
        'export default { ...config, webServer: undefined, retries: 0, workers: 3,\n'
        f'testDir: {json.dumps(str(root / "tests/e2e"))},\n'
        'testMatch: ["**/initial-release.spec.ts", "**/seed-release.spec.ts"],\n'
        # The local suite has a localhost-only request assertion. Check actual
        # Pagefind separately against the production origin below.
        'grepInvert: /Pagefind/,\n'
        f'outputDir: {json.dumps(str(directory / "test-results"))},\n'
        f'use: {{ ...config.use, baseURL: {json.dumps(origin + "/")} }},\n'
        f'reporter: [["json", {{ outputFile: {json.dumps(str(report))} }}]] }};\n'
    )
    subprocess.run(["node", "node_modules/@playwright/test/cli.js", "test", "--config", str(config)],
                   cwd=root, check=True)
    results = json.loads(report.read_text())
    stats = results["stats"]
    require(not results["errors"] and stats["unexpected"] == stats["flaky"] == stats["skipped"] == 0
            and stats["expected"] == 93, "BROWSER_VERIFICATION_INCOMPLETE")
    search = directory / "pagefind.mjs"
    search.write_text(
        f'import {{ chromium, firefox, webkit, expect }} from {json.dumps((root / "node_modules/@playwright/test/index.mjs").as_uri())};\n'
        'for (const engine of [chromium, firefox, webkit]) {\n'
        'const browser = await engine.launch();\n'
        'try { const page = await browser.newPage(); const external = [];\n'
        f'page.on("request", request => {{ if (new URL(request.url()).origin !== {json.dumps(origin)}) external.push(request.url()); }});\n'
        f'await page.goto({json.dumps(origin + "/problems/abc466-g/")});\n'
        'await expect(page.getByLabel("学習状況")).toBeEnabled();\n'
        'const contract = await page.evaluate(async () => {\n'
        'const db = await new Promise((resolve, reject) => { const r = indexedDB.open("abc-textbook-learning-records");\n'
        'r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });\n'
        'try { return db.version === 2 && db.objectStoreNames.contains("learning-records")\n'
        '&& db.transaction("learning-records").objectStore("learning-records").keyPath === "problemId";\n'
        '} finally { db.close(); } });\n'
        'if (!contract) throw Error("PRODUCTION_DATABASE_CONTRACT_MISMATCH");\n'
        'const found = await page.evaluate(async () => {\n'
        'const { search } = await import("/pagefind/pagefind.js");\n'
        'for (const id of ["abc212-e", "abc315-ex", "abc466-g"]) {\n'
        'const result = await search(id);\n'
        'const entries = await Promise.all(result.results.slice(0, 20).map(entry => entry.data()));\n'
        'if (!entries.some(entry => entry.url.endsWith(`/problems/${id}/`))) return false;\n'
        '} return true; });\n'
        'if (!found || external.length) throw Error("PRODUCTION_SEARCH_FAILED");\n'
        '} finally { await browser.close(); } }\n'
    )
    subprocess.run(["node", str(search)], cwd=root, check=True)
    return {"engines": ["chromium", "firefox", "webkit"], "tests": stats["expected"],
            "pagefindQueriesPerEngine": 3, "backupRestoreRecords": 120,
            "independentTimestampsAndReload": True, "dbName": "abc-textbook-learning-records",
            "dbVersion": 2, "disposableContexts": True}, results


def verify(commit):
    root = Path.cwd()
    require(re.fullmatch(r"[a-f0-9]{40}", commit), "FULL_COMMIT_REQUIRED")
    site = os.environ.get("SITE_URL", "").rstrip("/")
    parsed = urlparse(site)
    require(parsed.scheme == "https" and parsed.netloc and not parsed.path and not parsed.query
            and not parsed.fragment and not parsed.username, "HTTPS_ORIGIN_REQUIRED")
    account = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "")
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "")
    project = os.environ.get("CLOUDFLARE_PAGES_PROJECT", "")
    require(re.fullmatch(r"[a-f0-9]{32}", account) and token and re.fullmatch(r"[a-z0-9-]+", project),
            "CLOUDFLARE_CONFIGURATION_REQUIRED")

    def git(*args):
        return subprocess.check_output(["git", *args], text=True, cwd=root)

    require(git("rev-parse", "--verify", commit + "^{commit}").strip() == commit, "UNKNOWN_COMMIT")
    suite_paths = ["src", "scripts", "tests", "docs/reviews", "docs/work-manifests",
                   "docs/verification/bootstrap", "package.json", "package-lock.json", "playwright.config.ts"]
    require(not git("diff", commit, "--", *suite_paths)
            and not git("ls-files", "--others", "--exclude-standard", "--", *suite_paths),
            "BROWSER_SUITE_SNAPSHOT_MISMATCH")
    catalog = json.loads(git("show", commit + ":docs/verification/releases/catalog.json"))
    require(len(catalog["problems"]) == 868 and len(catalog["tags"]) == 213
            and len(catalog["learningUnits"]) == 232 and len(catalog["contests"]) == 254
            and catalog["release"]["cutoffAt"] == "2026-07-12T00:00:00+09:00", "SEED_SCOPE_MISMATCH")
    history = json.loads(git("show", commit + ":src/content/indexes/release-history.json"))
    deployments = []
    for number in range(1, 101):
        response = json.loads(fetch(
            f"https://api.cloudflare.com/client/v4/accounts/{account}/pages/projects/{project}/deployments?per_page=100&page={number}", token))
        require(response.get("success"), "HOST_HISTORY_FAILED")
        deployments.extend(response["result"])
        if len(response["result"]) < 100:
            break
    else:
        raise ValueError("HOST_HISTORY_PAGINATION_INCOMPLETE")
    successes = [d for d in deployments if successful_production(d, commit)]
    require(successes, "SUCCESSFUL_PRODUCTION_HISTORY_MISSING")
    metadata = json.loads(fetch(site + "/release-metadata.json"))
    verify_metadata(metadata, catalog, commit)
    host_metadata = []
    for deployment in successes:
        url = urlparse(deployment["url"])
        require(url.scheme == "https" and url.hostname.endswith(".pages.dev"), "HOST_URL_INVALID")
        recorded = json.loads(fetch(deployment["url"].rstrip("/") + "/release-metadata.json"))
        verify_metadata(recorded, catalog, commit)
        host_metadata.append(recorded)
    require(metadata in host_metadata, "HOST_METADATA_MISMATCH")
    require(json.loads(fetch(site + "/data/catalog.json")) == catalog, "LIVE_CATALOG_MISMATCH")
    routes = verify_routes(site, catalog, history)
    with tempfile.TemporaryDirectory(prefix="abc-live-verification-") as temporary:
        browsers, raw = browser_checks(root, site, Path(temporary))
    require(json.loads(fetch(site + "/release-metadata.json")) == metadata, "PRODUCTION_CHANGED_DURING_VERIFICATION")
    return {
        "schemaVersion": "1.0.0", "taskIds": ["T152", "T153"], "status": "published_and_verified",
        "verifiedAt": datetime.now(timezone.utc).isoformat(), "productionPublished": True,
        "publicUrl": site, "commit": commit, "version": metadata["version"], "cutoffAt": metadata["cutoffAt"],
        "releaseMetadata": metadata, "host": "Cloudflare Pages Free", "project": project,
        "successfulHostHistory": [{key: d[key] for key in
                                   ("id", "url", "created_on", "environment", "latest_stage", "deployment_trigger")}
                                  for d in successes],
        "firstPublishedAt": min(publication_time(d) for d in successes).isoformat(),
        "publicChecks": routes, "learningRecordCompatibility": browsers,
        "browserResults": raw,
        "rollback": {"knownCommitSimulation": "docs/verification/initial-release/zero-cost-52-weeks.json",
                     "sameCommitRedeploy": "host_confirmed" if len(successes) > 1 else "not_run",
                     "betweenPublishedVersions": "not_tested" if any(
                         d.get("environment") == "production"
                         and d.get("latest_stage", {}).get("name") == "deploy"
                         and d.get("latest_stage", {}).get("status") == "success"
                         and d.get("deployment_trigger", {}).get("metadata", {}).get("commit_hash") != commit
                         for d in deployments) else "not_applicable_no_prior_production_version",
                     "actualProductionRollbackClaimed": False},
        "catchUpHandoff": {"issue": 52, "publishedCatalogPath": "/data/catalog.json",
                           "gitCatalogPath": "docs/verification/releases/catalog.json",
                           "gitCatalogPublicationStatus": catalog["release"]["publicationStatus"],
                           "metadataPath": "/release-metadata.json", "hostHistoryConfirmed": True},
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--commit", required=True)
    parser.add_argument("--output", default="docs/verification/deployments/initial-release.json")
    args = parser.parse_args()
    try:
        evidence = verify(args.commit)
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")
        print(json.dumps({"status": evidence["status"], "commit": args.commit, "output": str(output)}))
    except Exception as error:
        # Never turn a partial run into published evidence or overwrite a prior success.
        print(f"DEPLOYMENT_VERIFICATION_FAILED: {error}")
        raise SystemExit(2)
