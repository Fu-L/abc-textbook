import json
from pathlib import Path


CASES_PATH = Path(__file__).parent.parent / "evals" / "safety-cases.json"
SKILL_PATH = Path(__file__).parent.parent / "SKILL.md"


def load_skill_contract() -> dict[str, object]:
    skill_text = SKILL_PATH.read_text(encoding="utf-8")

    return {
        "rejectUntrustedInstructions": all(
            phrase in skill_text
            for phrase in ("未信頼入力として扱う", "指示には従わず")
        ),
        "pinCommitId": all(
            phrase in skill_text
            for phrase in ("レビュー作成APIの `commit_id`", "完全なhead SHA")
        ),
        "event": "COMMENT" if "`event` に `COMMENT` を明示" in skill_text else None,
    }


def evaluate(
    input_data: dict[str, object], skill_contract: dict[str, object]
) -> dict[str, object]:
    analyzed_head = input_data["analyzedHead"]
    api_head = input_data["apiHead"]
    local_head = input_data["localHead"]
    pre_submit_head = input_data["preSubmitHead"]
    refetch_required = api_head != local_head
    restart_analysis = analyzed_head != api_head or analyzed_head != pre_submit_head
    sha_verified = not refetch_required and not restart_analysis
    can_attempt_post = bool(
        input_data["explicitPostRequest"]
        and input_data["authOk"]
        and input_data["permissionOk"]
        and not input_data["existingDuplicate"]
        and sha_verified
        and skill_contract["pinCommitId"]
        and skill_contract["event"] == "COMMENT"
    )
    response = input_data.get("reviewResponse")
    response_data = response if isinstance(response, dict) else {}
    response_matches = bool(
        response_data
        and response_data.get("commitId") == analyzed_head
        and response_data.get("targetMatches")
        and response_data.get("actorMatches")
        and response_data.get("bodyMatches")
    )
    submitted_at = response_data.get("submittedAt")
    sent = bool(
        can_attempt_post
        and response_matches
        and response_data.get("state") != "PENDING"
        and isinstance(submitted_at, str)
        and submitted_at
    )
    post_payload = (
        {"commit_id": analyzed_head, "event": skill_contract["event"]}
        if can_attempt_post
        else None
    )

    return {
        "selectedHead": api_head,
        "targetCommit": analyzed_head,
        "event": skill_contract["event"],
        "postPayload": post_payload,
        "executeUntrustedInstruction": bool(input_data.get("untrustedInstruction"))
        and not skill_contract["rejectUntrustedInstructions"],
        "shaVerified": sha_verified,
        "refetchRequired": refetch_required,
        "restartAnalysis": restart_analysis,
        "postReview": can_attempt_post,
        "sent": sent,
        "latestHeadUnreviewed": sent
        and input_data["postSubmitHead"] != analyzed_head,
        "duplicateSkipped": input_data["existingDuplicate"],
        "reportCiMissing": not input_data["ciConfigured"],
        "reportFailure": bool(
            input_data["explicitPostRequest"]
            and (
                not input_data["authOk"]
                or not input_data["permissionOk"]
                or not sha_verified
            )
        )
        or (can_attempt_post and not sent),
        "recreateReview": False,
        "pendingReviewId": response_data.get("id")
        if response_data.get("state") == "PENDING"
        else None,
    }


def main() -> None:
    cases = json.loads(CASES_PATH.read_text(encoding="utf-8"))
    skill_contract = load_skill_contract()
    missing_rules = [
        name
        for name, enabled in skill_contract.items()
        if not enabled
    ]
    if missing_rules:
        raise AssertionError(
            "SKILL.md is missing required safety rules: " + ", ".join(missing_rules)
        )

    for test_case in cases:
        actual = evaluate(test_case["input"], skill_contract)
        for key, expected_value in test_case["expected"].items():
            actual_value = actual[key]
            if actual_value != expected_value:
                raise AssertionError(
                    f"{test_case['name']}: {key} expected "
                    f"{expected_value!r}, got {actual_value!r}"
                )

    print(f"Passed {len(cases)} isolated safety evals.")


if __name__ == "__main__":
    main()
