# Issue #49の実装品質レビュー

受入modeは運用者の明示指示に基づく`agent_quality_review`。通常・高リスクのproduction
self/third-party review契約は変更していない。人間によるcheck実行やapproval、protected
mainへのmerge、production deployを主張しない。

レビュー対象はT128 / T130 / T131 / T132。current
subjectと実行結果は`docs/verification/bootstrap/us5.json`、実装受入は同directoryの`merge-review.json`へ結び付く。

## 確認した結果

- 指定commitの一時cloneを検証するため、dirty fileや未追跡fileで判定を変えられない。source
  repositoryのrefとworktreeを変更せず、成功・失敗とも一時cloneを除去する。protected-base差分とcurrent-subject
  reviewは既存の独立検証へ接続する。
- protected mainのexact pushではfirst parentを使う。remote
  mainとHEADが同じという理由で空差分を検証しない。required
  checksはCI、直列化と既知commitのrollbackはdeployment adapterという既存の責務を維持した。
- 各公開履歴は自身のcommitのCatalogを読む。後続Catalogやdirty
  fileで過去の版を再構築せず、既存履歴の変更・削除、commit重複、summary不一致を拒否する。保留試行は別のstaging
  projectionへ分離する。
- 全canonical Problemの配置と全Outcomeの唯一のownerを確認した。homeはsemantic
  primaryから決まり、追加で学ぶ成果・既習技能はhomeを変えない。3つの直接前提DAGと意味階層を分離し、掲載順にtopological
  orderを要求しない。全Unit・所属章の掲載を確認した。
- 訂正は旧・新Source Revisionとowner付きlocatorを保持する。不存在local
  block、空本文、欠落配置、欠落Source Revision、古いindexを検出する。optional
  blockの不存在を理由に教材を生成しない。写像を作っただけでverifiedにせず、実targetのreportを別途要求する。
- `sections.reviewAdvice`等の実在するcamelCase keyが旧locator
  regexに拒否されていた。Problem本文schemaのキーからlocator regexを生成して修正し、JSON
  Schemaも同時生成した。存在しないsectionは引き続き拒否する。
- 対象Problem IDが増減したときのmetrics更新を週次手順へ固定した。今回の868問のID/task
  identityは検証済みで、補助数値を教材の分類や掲載順に利用する変更はない。
- adapterの失敗後retry、check失敗時にhostを呼ばないこと、未知commit拒否、既知commitrollback、通常/高リスクreview
  policy、入力同一性・resumeの回帰を確認した。

## 解決したレビューfinding

| Finding                                                      | 対応                                                                        |
| ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| current working treeをrelease inputへ混ぜる危険              | exact commitを一時cloneへ展開して検証する                                   |
| 過去のCatalogをcurrent Catalogで投影して履歴を書き換える危険 | commit別にCatalogを読んでappend-only一致を検査する                          |
| 実在する本文section keyとlocator schemaの不一致              | 本文schemaからkeyを導出し、生成schemaとの一致を確認する                     |
| mainへのpushで`GITHUB_BASE_REF`が空になる場合                | 空文字をmainへ解決し、同じcommitをbaseにしない                              |
| 掲載順が検証実行側のcheckoutへ依存する場合                   | 指定commit内の掲載順正本を読む                                              |
| full releaseの引数検査がpreviewの監視を妨げる場合            | 引数検査をfull CLI入口へ限定し、preview引数付きの書込検出を回帰テストで確認 |
| 必要なhuman reviewをagentの実行結果で偽装する危険            | scoped owner instructionによる実装受入とproductionのreviewを分ける          |

未解消の実装findingは0。全公開カタログや初回catch-upの欠落を、このIssueで完了したと数えない。公開Catalog未生成のbootstrapは`verify:release`で失敗することが正しい。派生index未生成・廃止したpreview-only
locatorを持つ初期CorrectionImpactもpendingのまま残る。

## 検証の限界と引継ぎ

ブラウザーの99テストは現行previewのUIに対する回帰であり、full public
projectionの成果を主張しない。全868本文・232 Unitの正本を使った成果被覆、canonical
graph/home/orderの検証は別に行った。fixtureのdeploy simulationはproduction
deploymentの証拠ではない。

T160はfull public Catalog・route/search・taxonomy
indexを生成し、廃止blockのlocatorを再bindしてからこのrelease
validatorへ渡す。productionのMergeReviewEvidenceは実reviewer・current
subject・全check・現行憲章/template digestへ結び付ける。host選定と実公開は初版runbookが所有する。
