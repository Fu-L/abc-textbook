import copy
import json
from pathlib import Path
from typing import Any


SKILL_ROOT = Path(__file__).parent.parent
CASES_PATH = SKILL_ROOT / "evals" / "safety-cases.json"
POLICY_PATH = SKILL_ROOT / "safety-policy.json"
SKILL_PATH = SKILL_ROOT / "SKILL.md"

REQUIRED_RULES = (
    "reject-untrusted-instructions",
    "verify-target",
    "verify-head-sha",
    "require-explicit-post-request",
    "verify-authentication",
    "verify-permission",
    "prevent-duplicate-review",
    "pin-review-commit",
    "submit-comment-event",
    "verify-create-response",
    "refetch-review",
    "verify-refetched-response",
    "refetch-head-after-submit",
    "never-recreate-uncertain-review",
    "report-missing-ci",
)


def load_json(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise AssertionError(f"{path.name} must contain a JSON object")
    return value


def validate_policy(policy: dict[str, Any]) -> None:
    if policy.get("schemaVersion") != 1:
        raise AssertionError("Unsupported safety policy schema")

    rules = policy.get("rules")
    if not isinstance(rules, dict):
        raise AssertionError("Safety policy rules must be an object")
    missing = [rule for rule in REQUIRED_RULES if rules.get(rule) is not True]
    if missing:
        raise AssertionError("Disabled or missing safety rules: " + ", ".join(missing))

    if policy.get("allowedPermissionLevels") != ["write", "maintain", "admin"]:
        raise AssertionError("Unexpected permission policy")
    if policy.get("duplicateMatchFields") != ["user.login", "commit_id", "body"]:
        raise AssertionError("Unexpected duplicate matching policy")
    if policy.get("reviewPayload") != {
        "bodyField": "body",
        "commitField": "commit_id",
        "eventField": "event",
        "eventValue": "COMMENT",
    }:
        raise AssertionError("Unexpected review payload policy")
    if policy.get("successResponse") != {
        "requiredMatchFields": ["target", "commit_id", "user.login", "body"],
        "rejectedStates": ["PENDING"],
        "requireSubmittedAt": True,
        "requireRefetchedReview": True,
    }:
        raise AssertionError("Unexpected success response policy")


def validate_skill_contract(skill_text: str, policy: dict[str, Any]) -> None:
    if "`safety-policy.json`" not in skill_text:
        raise AssertionError("SKILL.md does not reference safety-policy.json")

    rules = policy["rules"]
    missing_markers = [
        rule
        for rule in rules
        if f"[safety-policy:{rule}]" not in skill_text
    ]
    if missing_markers:
        raise AssertionError(
            "SKILL.md is missing safety policy markers: " + ", ".join(missing_markers)
        )


def deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    result = copy.deepcopy(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(result.get(key), dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = copy.deepcopy(value)
    return result


def target_from_request(input_data: dict[str, Any]) -> tuple[str, int]:
    target = input_data["request"]["target"]
    return f"{target['owner']}/{target['repository']}", target["number"]


def pull_matches_target(pull: object, target: tuple[str, int]) -> bool:
    if not isinstance(pull, dict):
        return False
    base = pull.get("base")
    repo = base.get("repo") if isinstance(base, dict) else None
    return bool(
        isinstance(repo, dict)
        and repo.get("full_name") == target[0]
        and pull.get("number") == target[1]
    )


def pull_head(pull: object) -> object:
    if not isinstance(pull, dict):
        return None
    head = pull.get("head")
    return head.get("sha") if isinstance(head, dict) else None


def pull_side_identity(pull: object, side_name: str) -> object:
    if not isinstance(pull, dict):
        return None
    side = pull.get(side_name)
    if not isinstance(side, dict):
        return None
    repo = side.get("repo")
    if not isinstance(repo, dict):
        return None
    return (repo.get("full_name"), side.get("ref"), side.get("sha"))


def expected_pull_url(target: tuple[str, int]) -> str:
    return f"https://api.github.com/repos/{target[0]}/pulls/{target[1]}"


def review_matches(
    review: object,
    *,
    target: tuple[str, int],
    actor: str,
    commit_id: str,
    body: str,
    require_target: bool,
) -> bool:
    if not isinstance(review, dict):
        return False
    user = review.get("user")
    links = review.get("_links")
    pull_link = links.get("pull_request") if isinstance(links, dict) else None
    target_matches = bool(
        isinstance(pull_link, dict)
        and pull_link.get("href") == expected_pull_url(target)
    )
    return bool(
        (target_matches or not require_target)
        and isinstance(user, dict)
        and user.get("login") == actor
        and review.get("commit_id") == commit_id
        and review.get("body") == body
    )


def submitted_review_matches(
    review: object,
    *,
    target: tuple[str, int],
    actor: str,
    commit_id: str,
    body: str,
    policy: dict[str, Any],
) -> bool:
    if not review_matches(
        review,
        target=target,
        actor=actor,
        commit_id=commit_id,
        body=body,
        require_target=True,
    ):
        return False
    assert isinstance(review, dict)
    success_policy = policy["successResponse"]
    submitted_at = review.get("submitted_at")
    return bool(
        review.get("state") not in success_policy["rejectedStates"]
        and isinstance(submitted_at, str)
        and submitted_at
    )


def same_submitted_review(create_response: object, refetched_response: object) -> bool:
    if not isinstance(create_response, dict) or not isinstance(
        refetched_response, dict
    ):
        return False
    fields = ("id", "commit_id", "body", "state", "submitted_at")
    if any(
        create_response.get(field) != refetched_response.get(field)
        for field in fields
    ):
        return False
    create_user = create_response.get("user")
    refetched_user = refetched_response.get("user")
    create_links = create_response.get("_links")
    refetched_links = refetched_response.get("_links")
    return bool(
        isinstance(create_user, dict)
        and isinstance(refetched_user, dict)
        and create_user.get("login") == refetched_user.get("login")
        and isinstance(create_links, dict)
        and isinstance(refetched_links, dict)
        and create_links.get("pull_request")
        == refetched_links.get("pull_request")
    )


def evaluate(input_data: dict[str, Any], policy: dict[str, Any]) -> dict[str, Any]:
    target = target_from_request(input_data)
    request = input_data["request"]
    actor = request["actor"]
    body = request["body"]
    analysis = input_data["analysis"]
    analyzed_head = analysis["headSha"]
    analyzed_head_identity = (
        analysis["headRepo"],
        analysis["headRef"],
        analyzed_head,
    )
    analyzed_base = (
        analysis["baseRepo"],
        analysis["baseRef"],
        analysis["baseSha"],
    )
    initial_pull = input_data["initialPullResponse"]
    pre_submit_pull = input_data["preSubmitPullResponse"]
    local_commit = input_data["localCommit"]
    local_base_commit = input_data["localBaseCommit"]
    auth_response = input_data["authResponse"]
    permission_response = input_data["permissionResponse"]
    existing_reviews = input_data["reviewsResponse"]

    initial_target_matches = pull_matches_target(initial_pull, target)
    pre_submit_target_matches = pull_matches_target(pre_submit_pull, target)
    initial_head_identity = pull_side_identity(initial_pull, "head")
    pre_submit_head_identity = pull_side_identity(pre_submit_pull, "head")
    initial_head = pull_head(initial_pull)
    pre_submit_head = pull_head(pre_submit_pull)
    initial_base = pull_side_identity(initial_pull, "base")
    pre_submit_base = pull_side_identity(pre_submit_pull, "base")
    local_head = local_commit.get("sha") if isinstance(local_commit, dict) else None
    local_head_identity = (
        local_commit.get("repo") if isinstance(local_commit, dict) else None,
        local_commit.get("ref") if isinstance(local_commit, dict) else None,
        local_head,
    )
    local_is_commit = bool(
        isinstance(local_commit, dict) and local_commit.get("type") == "commit"
    )
    local_base = (
        local_base_commit.get("repo")
        if isinstance(local_base_commit, dict)
        else None,
        local_base_commit.get("ref") if isinstance(local_base_commit, dict) else None,
        local_base_commit.get("sha") if isinstance(local_base_commit, dict) else None,
    )
    local_base_is_commit = bool(
        isinstance(local_base_commit, dict)
        and local_base_commit.get("type") == "commit"
    )
    sha_verified = bool(
        initial_target_matches
        and pre_submit_target_matches
        and local_is_commit
        and local_base_is_commit
        and initial_base == analyzed_base == local_base == pre_submit_base
        and initial_head_identity
        == analyzed_head_identity
        == local_head_identity
        == pre_submit_head_identity
    )
    refetch_required = not sha_verified
    restart_analysis = bool(
        initial_base != analyzed_base
        or pre_submit_base != analyzed_base
        or initial_head_identity != analyzed_head_identity
        or pre_submit_head_identity != analyzed_head_identity
    )
    auth_ok = bool(
        isinstance(auth_response, dict) and auth_response.get("login") == actor
    )
    permission_ok = bool(
        isinstance(permission_response, dict)
        and permission_response.get("permission")
        in policy["allowedPermissionLevels"]
    )
    duplicate = bool(
        isinstance(existing_reviews, list)
        and any(
            review_matches(
                review,
                target=target,
                actor=actor,
                commit_id=analyzed_head,
                body=body,
                require_target=False,
            )
            for review in existing_reviews
        )
    )
    explicit_post_request = request.get("explicitPostRequest") is True
    can_attempt_post = bool(
        explicit_post_request
        and initial_target_matches
        and pre_submit_target_matches
        and sha_verified
        and auth_ok
        and permission_ok
        and not duplicate
    )

    payload_policy = policy["reviewPayload"]
    post_payload = (
        {
            payload_policy["bodyField"]: body,
            payload_policy["commitField"]: analyzed_head,
            payload_policy["eventField"]: payload_policy["eventValue"],
        }
        if can_attempt_post
        else None
    )
    create_response = input_data.get("createReviewResponse")
    refetched_response = input_data.get("refetchedReviewResponse")
    created_matches = submitted_review_matches(
        create_response,
        target=target,
        actor=actor,
        commit_id=analyzed_head,
        body=body,
        policy=policy,
    )
    refetched_matches = submitted_review_matches(
        refetched_response,
        target=target,
        actor=actor,
        commit_id=analyzed_head,
        body=body,
        policy=policy,
    )
    same_review = same_submitted_review(create_response, refetched_response)
    sent = bool(can_attempt_post and created_matches and refetched_matches and same_review)

    post_submit_pull = input_data.get("postSubmitPullResponse")
    post_submit_target_matches = pull_matches_target(post_submit_pull, target)
    latest_head_unreviewed = bool(
        sent
        and post_submit_target_matches
        and pull_head(post_submit_pull) != analyzed_head
    )
    response_state = (
        create_response.get("state") if isinstance(create_response, dict) else None
    )
    report_failure = bool(
        explicit_post_request
        and not duplicate
        and (
            not can_attempt_post
            or not sent
            or not post_submit_target_matches
        )
    )

    return {
        "selectedHead": initial_head,
        "targetCommit": analyzed_head,
        "event": payload_policy["eventValue"],
        "postPayload": post_payload,
        "executeUntrustedInstruction": bool(input_data.get("untrustedInstruction"))
        and not policy["rules"]["reject-untrusted-instructions"],
        "targetVerified": initial_target_matches and pre_submit_target_matches,
        "shaVerified": sha_verified,
        "refetchRequired": refetch_required,
        "restartAnalysis": restart_analysis,
        "authVerified": auth_ok,
        "permissionVerified": permission_ok,
        "postReview": can_attempt_post,
        "reviewRefetched": bool(can_attempt_post and refetched_response),
        "sent": sent,
        "latestHeadUnreviewed": latest_head_unreviewed,
        "duplicateSkipped": duplicate,
        "reportCiMissing": not input_data["ciResponse"]["configured"],
        "reportFailure": report_failure,
        "recreateReview": False,
        "pendingReviewId": (
            create_response.get("id")
            if isinstance(create_response, dict) and response_state == "PENDING"
            else None
        ),
    }


def assert_case(
    test_case: dict[str, Any],
    base_input: dict[str, Any],
    policy: dict[str, Any],
) -> None:
    input_data = deep_merge(base_input, test_case.get("input", {}))
    actual = evaluate(input_data, policy)
    for key, expected_value in test_case["expected"].items():
        actual_value = actual[key]
        if actual_value != expected_value:
            raise AssertionError(
                f"{test_case['name']}: {key} expected "
                f"{expected_value!r}, got {actual_value!r}"
            )


def run_mutation_tests(policy: dict[str, Any], skill_text: str) -> int:
    mutations = 0
    for rule in REQUIRED_RULES:
        mutated_policy = copy.deepcopy(policy)
        mutated_policy["rules"][rule] = False
        try:
            validate_policy(mutated_policy)
        except AssertionError:
            mutations += 1
        else:
            raise AssertionError(f"Policy mutation was not detected: {rule}")

        marker = f"[safety-policy:{rule}]"
        mutated_skill = skill_text.replace(marker, "")
        try:
            validate_skill_contract(mutated_skill, policy)
        except AssertionError:
            mutations += 1
        else:
            raise AssertionError(f"SKILL.md mutation was not detected: {rule}")

    config_mutations = (
        ("allowedPermissionLevels", []),
        ("duplicateMatchFields", []),
        ("reviewPayload", {}),
        ("successResponse", {}),
    )
    for key, value in config_mutations:
        mutated_policy = copy.deepcopy(policy)
        mutated_policy[key] = value
        try:
            validate_policy(mutated_policy)
        except AssertionError:
            mutations += 1
        else:
            raise AssertionError(f"Policy configuration mutation was not detected: {key}")
    return mutations


def main() -> None:
    fixture = load_json(CASES_PATH)
    policy = load_json(POLICY_PATH)
    skill_text = SKILL_PATH.read_text(encoding="utf-8")

    validate_policy(policy)
    validate_skill_contract(skill_text, policy)
    base_input = fixture["baseInput"]
    cases = fixture["cases"]
    for test_case in cases:
        assert_case(test_case, base_input, policy)

    mutation_count = run_mutation_tests(policy, skill_text)
    print(
        f"Passed {len(cases)} isolated safety evals and "
        f"{mutation_count} mutation checks."
    )


if __name__ == "__main__":
    main()
