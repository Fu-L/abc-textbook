# Problem authoring unit

教材本文の正本は、横断参照される
`Problem`、`TechniqueTag`、`LearningOutcome`、`LearningUnit`、`SourceRevision`
と、Problem ごとの Markdown authoring unit に分ける。

独立 entity にする条件は、次のいずれかを満たすことに限定する。

1. 所有者とは別のライフサイクルで追加・廃止・訂正される。
2. 複数の authoring unit または複数の owner から参照される。

Claimは`ProblemAuthoringUnit`に、任意のExampleとExercise/Assessment/Answerは所有する`ProblemAuthoringUnit`
または`LearningUnit`に置く。いずれも所有者の本文と同時に執筆・訂正される。文書内の `key`
は検証結果を特定する locator であり、Catalog entity ID ではない。Problem本文の実行可能例は
`{ ownerType: "problem", problemId, exampleKey }`、Learning Unit本文の実行可能例は
`{ ownerType: "learning_unit", learningUnitId, exampleKey }`で対象を固定する。`executable`
のExampleはリポジトリ相対の `executionTarget` を必ず持ち、`pseudocode` と `illustrative` は
`executionTarget: null` とする。これにより、実行可能と宣言した例が実行対象なしで公開されない。

LearningUnitは簡潔な概念説明と受理済みの読む順に並べた問題一覧を持つ。意味階層、3つの直接前提DAG、編集上の教科書掲載順は独立に保持する。本文執筆はcanonical
Unitごとのmanifestが所有し、`contentPhase=full_authoring`へ移して同じJSON/Markdownを引き継ぐ。ExampleとExercise/Assessment/Answerは任意の通常本文であり、Outcomeごとの例・評価課題を要求しない。全Problemは固有のauthoring
unitを持ち、full解説を原則とする。CorrectionImpactも同じowner種別を持つ判別付きlocatorを正本とし、ProblemのsectionまたはLearningUnitの本文・local
blockを実データへ解決する。document-local keyをCatalog全体のentity IDへ昇格させない。

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

Catalog v3 とowner付き検証証跡は旧v2契約からの破壊的変更であり、v2
documentを暗黙変換しない。移行時は一問単位で内容を authoring
unit へまとめ、検証を再実行してから公開 Catalog を再生成する。

## 現行Problem本文の構成

ABC過去問から上位コンテストへ転用する典型知識を教える。状態・遷移・境界条件・証明・計算量の導出を本文で再現可能にし、独立した具体例・確認問題・確認する観点・解答と理由は生成しない。Problemのexamples/exercisesは空配列を許容する。必要な短い追跡は考察・証明へ直接入れる。過去のfixtureと凍結済みskill
snapshotのblock契約は履歴として保持し、現在の本文構成・受入条件にはこの編集方針を適用する。

inventoryの分析は配置判断と執筆の出発点であり、短い解法要約をそのままfull解説の完成本文とはしない。原典の結論を写すだけでなく、読者がその結論から実装へ進めるように、状態の一単位、初期値、遷移式、回答式を接続する。たとえば「行列累乗」なら行列の各係数と初期ベクトル、「畳み込み」なら入力する二列と読む次数、「再帰構成」なら親子の所有領域と空区間を定義する。

新規・差替え原稿では `ProblemAuthoringDetails.reasoning`
を必須にし、考察全文としてそのまま使う。inventoryから考察を組み立てるfallbackは設けない。既存本文の証跡再生成ではその本文の考察を渡すため、訂正済みの境界や更新式が古いinventoryの説明で上書きされない。

本文とcorrectness
Claimは同じ意味を持つ正本であり、初期条件・偶奇・対象範囲・境界を直したときは両方を同時に修正する。計算量は保持状態数だけでなく、その状態を何回変換するか、kernelの準備、倍数更新、座標変換、配列コピーも含めて導く。数学的な修正には小規模全探索など別のモデルで検算し、構造検査の成功とは区別して結果を記録する。
