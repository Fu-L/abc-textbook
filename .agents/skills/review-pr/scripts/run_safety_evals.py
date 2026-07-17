import json
from pathlib import Path


CASES_PATH = Path(__file__).parent.parent / "evals" / "safety-cases.json"


def evaluate(input_data: dict[str, object]) -> dict[str, object]:
    restart_analysis = input_data["analyzedHead"] != input_data["preSubmitHead"]
    can_attempt_post = bool(
        input_data["explicitPostRequest"]
        and input_data["authOk"]
        and input_data["permissionOk"]
        and not input_data["existingDuplicate"]
        and not restart_analysis
    )
    response = input_data.get("reviewResponse")
    response_data = response if isinstance(response, dict) else {}
    response_matches = bool(
        response_data
        and response_data.get("commitId") == input_data["analyzedHead"]
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

    return {
        "selectedHead": input_data["apiHead"],
        "targetCommit": input_data["analyzedHead"],
        "event": "COMMENT",
        "executeUntrustedInstruction": False,
        "restartAnalysis": restart_analysis,
        "postReview": can_attempt_post,
        "sent": sent,
        "latestHeadUnreviewed": sent
        and input_data["postSubmitHead"] != input_data["analyzedHead"],
        "duplicateSkipped": input_data["existingDuplicate"],
        "reportCiMissing": not input_data["ciConfigured"],
        "reportFailure": bool(
            input_data["explicitPostRequest"]
            and (not input_data["authOk"] or not input_data["permissionOk"])
        )
        or (can_attempt_post and not sent),
        "recreateReview": False,
        "pendingReviewId": response_data.get("id")
        if response_data.get("state") == "PENDING"
        else None,
    }


def main() -> None:
    cases = json.loads(CASES_PATH.read_text(encoding="utf-8"))

    for test_case in cases:
        actual = evaluate(test_case["input"])
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
