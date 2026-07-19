# Weekly update review policy fixture

The normal case uses the manifest owner as the `self` reviewer and deliberately has no external
reviewer person ID. The review-policy unit test covers the three fixed high-risk reasons and
verifies that each one requires `third_party` review.
