"""Fixtures test the verifier; they are never production publication evidence."""

import copy
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "deployment", Path(__file__).with_name("verify-initial-deployment.py")
)
deployment = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deployment)


class DeploymentVerificationTests(unittest.TestCase):
    def setUp(self):
        self.catalog = json.loads(Path("docs/verification/releases/catalog.json").read_text())
        release = self.catalog["release"]
        self.commit = "a" * 40
        self.metadata = {
            "schemaVersion": "1.0.0", "commit": self.commit,
            "version": release["version"], "cutoffAt": release["cutoffAt"],
            "validationResultsUrl": "https://github.com/Fu-L/abc-textbook/actions/runs/1",
            "changeSummary": {key: release[key] for key in
                              ("updateIds", "addedProblemIds", "changedProblemIds", "withdrawnProblemIds")},
        }
        self.metadata["changeSummary"]["taxonomyChanges"] = []

    def test_metadata_must_match_the_exact_commit_and_seed_scope(self):
        deployment.verify_metadata(self.metadata, self.catalog, self.commit)
        for key, value in [("commit", "b" * 40), ("cutoffAt", "2026-10-08T00:00:00Z"),
                           ("version", "2026.10.08")]:
            wrong = copy.deepcopy(self.metadata)
            wrong[key] = value
            with self.subTest(key=key), self.assertRaises(ValueError):
                deployment.verify_metadata(wrong, self.catalog, self.commit)
        wrong = copy.deepcopy(self.metadata)
        wrong["changeSummary"]["addedProblemIds"].append("abc467-e")
        with self.assertRaisesRegex(ValueError, "SUMMARY_MISMATCH"):
            deployment.verify_metadata(wrong, self.catalog, self.commit)

    def test_preview_failed_upload_and_another_commit_are_not_published(self):
        good = {"environment": "production", "latest_stage": {"name": "deploy", "status": "success"},
                "deployment_trigger": {"metadata": {"commit_hash": self.commit}}}
        self.assertTrue(deployment.successful_production(good, self.commit))
        for field, value in [("environment", "preview"), ("latest_stage", {"name": "build", "status": "success"}),
                             ("latest_stage", {"name": "deploy", "status": "failure"})]:
            self.assertFalse(deployment.successful_production({**good, field: value}, self.commit))
        self.assertFalse(deployment.successful_production(good, "b" * 40))
        self.assertFalse(deployment.successful_production({}, self.commit))

    def test_routes_cover_every_canonical_problem_without_future_or_gap_problems(self):
        routes = deployment.canonical_routes(self.catalog, [])
        self.assertEqual(sum(route.startswith("/problems/abc") for route in routes), 868)
        self.assertIn("/problems/abc315-ex/", routes)
        self.assertIn("/contests/abc466/", routes)
        self.assertIn("/learn/graph/", routes)
        self.assertNotIn("/learn/graph/index/", routes)
        self.assertNotIn("/contests/abc316/", routes)
        self.assertFalse(any("abc467" in route or "staging" in route for route in routes))

    def test_http_success_with_a_fallback_page_does_not_prove_problem_availability(self):
        with patch.object(deployment, "fetch", return_value="<h1>Fallback</h1>"):
            with self.assertRaisesRegex(ValueError, "RECORD_CONTROL_MISSING"):
                deployment.verify_routes("https://example.test", self.catalog, [])

    def test_missing_origin_stops_before_host_or_browser_checks(self):
        with patch.dict("os.environ", {}, clear=True), patch.object(deployment, "fetch") as fetch:
            with self.assertRaisesRegex(ValueError, "HTTPS_ORIGIN_REQUIRED"):
                deployment.verify(self.commit)
            fetch.assert_not_called()

    def test_publication_time_is_successful_deploy_completion_not_upload_creation(self):
        result = deployment.publication_time({
            "created_on": "2026-10-08T00:00:00Z",
            "latest_stage": {"ended_on": "2026-10-08T00:02:00Z"},
        })
        self.assertEqual(result.isoformat(), "2026-10-08T00:02:00+00:00")
        for value in [None, "2026-10-08T00:02:00"]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                deployment.publication_time({"latest_stage": {"ended_on": value}})


if __name__ == "__main__":
    unittest.main()
