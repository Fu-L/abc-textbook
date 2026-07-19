# Problem authoring unit

教材本文の正本は、横断参照される
`Problem`、`TechniqueTag`、`LearningOutcome`、`LearningUnit`、`SourceRevision`
と、Problem ごとの Markdown authoring unit に分ける。

独立 entity にする条件は、次のいずれかを満たすことに限定する。

1. 所有者とは別のライフサイクルで追加・廃止・訂正される。
2. 複数の authoring unit または複数の owner から参照される。

Claim、Example、Exercise、Assessment、Answer はいずれも本文と同時に執筆・訂正されるため、`ProblemAuthoringUnit`
内に置く。文書内の `key` は検証結果を特定する locator であり、Catalog entity
ID ではない。Problem本文の実行可能例は `{ ownerType: "problem", problemId, exampleKey }`、Learning
Unit本文の実行可能例は `{ ownerType: "learning_unit", learningUnitId, exampleKey }`
で対象を固定する。

`similar` と `supplement` は Explanation ID ではなく安定した `primaryProblemId` を参照する。Source
Revision と Correction
Impact は、本文と別の確認・訂正ライフサイクルを持ち、複数の正本へ影響し得るため独立 entity のまま残す。

## 代表 fixture の削減効果

比較対象は `tests/fixtures/trusted-catalog.ts`
の一問分である。旧 v2 では Explanation、Claim、Example、Exercise、Assessment、AnswerMaterial の 6
artifact が必要だった。v3 では Markdown frontmatter と本文からなる 1 authoring
unit だけを正本とするため、artifact は 6 から 1（83%削減）になった。

手入力する調整 field は「独立 ID」と「別 artifact への参照 field」を数える。旧 v2 は独立 ID
6 個と相互参照 10 field の計16、新 v3 は既存 `problemId` 1 field と文書内 key 3 field の計4で、12
field（75%）削減した。学習成果、出典、前提への横断参照は品質要件のため削減対象に含めない。

Catalog v3 と検証証跡 v2 は破壊的変更であり、v2
document を暗黙変換しない。移行時は一問単位で内容を authoring
unit へまとめ、検証を再実行してから公開 Catalog を再生成する。
