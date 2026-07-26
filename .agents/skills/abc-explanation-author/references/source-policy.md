# Source normalization and allowed use

Source Revisionは、既存の `SourceRevisionSchema` を通過した公式AtCoder resourceだけを使う。authoring packetにはrevision ID、repo内path、source kind、official task ID、確認日時、利用条件確認日時、allowed useを複製せず参照情報として記録する。

許可する利用目的は次のとおり。

- `constraint_reference`: 公式問題文から制約と入出力条件を参照する。
- `technical_claim`: 公式問題文または問題個別の公式解説を、独自の日本語説明を支える根拠として参照する。
- `example_verification`: 公式入出力または根拠から独自例の期待結果を検証する。
- `answer_verification`: 解法と演習解答を検証する。

転載を目的にせず、必要最小限の参照と独自説明に限る。公式解説indexは探索にだけ利用でき、問題固有claimの根拠には個別公式解説または公式問題文を使う。sourceが取得不能、stale、対象task不一致、利用条件未確認の場合はholdし、再取得または再確認を条件として示す。
