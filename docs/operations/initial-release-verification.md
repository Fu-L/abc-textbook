# 初期教材の品質検証（Issue #51 / T133–T142）

ABCの過去問から難関コンテストで再利用できる典型知識を学ぶため、受理済みの概説・問題解説・配置と、読者が利用する公開ページを一緒に検証する。対象は T160 が公開投影へ結び付けた canonical
full
corpus。現在は ABC212〜466 の868問、213タグ、232学習単位で、ABC316 は公式の欠番証跡で扱う。255個の番号を254開催分として数える。

```sh
npm run verify:initial-release -- --write
npm run verify:initial-release -- --check
```

表示用実装・検証scriptを変更した場合は、T160の実装digestも変わる。受理済み本文・分類の検証が通り、変更が表示・検証処理の範囲と確認できたら、先に現buildの証跡だけを更新する。

```sh
npm run build
node --import tsx scripts/corpus/verify-full-projections.ts --write-evidence
```

`--write-evidence`は全公開投影を再検証してT160のbuild証跡を保存するが、taxonomy
indexや本文は生成しない。本文・分類自体が受理済みsubjectと一致しなければ失敗する。今回の監査では320pxの長いselect・file
inputの横はみ出しをCSSで補修した。

Node.js 24、lockfileに従って導入した依存、Playwrightの3ブラウザーを使う。`--write`
は自動検査を実行し、全項目が成功した後で `docs/verification/initial-release/`
に今回の検証証跡を保存する。正本本文・分類・受入証跡の更新は行わない。静的buildと性能fixtureだけは生成し、性能fixtureは
`build/` に隔離する。取得・更新・配信のsimulationは一時リポジトリ内で完結する。

`--check`
は保存済み証跡のタスク、全件対象、入力digest、結果digestを照合する。ブラウザー・性能測定の再実行には
`--write`
を使う。成功は0、検証失敗は2、引数誤りは64。入力は本文・JSON正本、検証実装・テスト、契約、現在の本文受入・shard
manifest、final
taxonomyと出典skillの全ファイルから固定し、別の本文や実装へ古い成功結果を流用しない。taskのチェック欄と今回の出力は入力digestから除く。

再実行が失敗した場合は`matrix.json`を`on_hold`にし、以前の成功マトリクスが今回の結果として通らないようにする。各結果と生のbrowser/test証跡のdigestも照合する。

| Task | 確認対象                                                                                                                   | 証跡                           |
| ---- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| T133 | Zod / JSON Schema parity、strict契約、未知field拒否、生成物drift                                                           | `schema-contracts.json`        |
| T134 | 公式D-after順・task identity・欠番・dynamic registry・全Problem／本文／Inventory／配置の集合一致                           | `corpus-completeness.json`     |
| T135 | final taxonomy、3直接前提DAG、意味階層、唯一の所属とhome、direct／descendant／related、読書順、対象色、実訂正target／index | `taxonomy.json`                |
| T136 | 確認済み公式revision、taskとclaimの対応、利用条件日付・allowed use、引用追加の検知                                         | `sources-and-claims.json`      |
| T137 | 全Unit／Problem ownerの任意例・演習・解答と本文fence                                                                       | `examples-and-answers.json`    |
| T138 | 全routeの見出し・代替テキスト・リンク、3ブラウザーのaxe・keyboard・320px・no-JavaScript                                    | `accessibility-and-links.json` |
| T139 | 全868routeの同一control、非preview問題の独立日時、migration、filter、120件の実download／復元、失敗時のatomic rollback      | `learning-records.json`        |
| T140 | catalog・search documents・Pagefind・sitemap・feed・内部導線の閉包と端末情報の除外                                         | `public-projections.json`      |
| T141 | seed／現cutoff／1,500問・500タグ・1,000Unitで各3回の教材・索引生成、複合filterのDOM反映p95                                 | `performance.json`             |
| T142 | 実配信chunkの依存閉包、外部request、依存と無償必須経路、52週の更新・local Git・配信・rollback・backup                      | `zero-cost-52-weeks.json`      |

`matrix.json` が10件の証跡をまとめる。`test-results.json`
は全unit／contract／integration結果、`browser-results.json` はPlaywrightの実結果。previewのtaxonomy
integrationは移行経緯として参照し、最終の網羅性は公式taskと全canonical
ownerから再計算する。previewの過去の成功を最終証跡に代入しない。

読書順には全Unit一回・所属章・概念の親リンクを要求する。親子subtreeの連続性や前提DAGのtopological
orderは要求せず、後にある直接前提の表示を確認する。Problemのhomeはprimary
Outcomeのownerから決め、additional-primary／supportingは関連参照として保持する。受理済みUnit内問題順を維持する。

現在の本文には実行例と独立演習・解答がなく、考察中のtext
fenceは疑似コードである。不存在は欠落扱いにしない。新しいrunnable
fence・例・演習・引用を検出した場合は、実行／解答／利用条件の個別検証を追加するまで失敗させる。source
auditは保存されたrevisionと確認情報の照合であり、公式ページの再取得や任意入力の数学的正しさの再証明を主張しない。一般の正当性は受理済み本文の証明に残し、既存の独立有限モデル回帰も再実行する。

性能測定は、三つの規模で同じ隔離Astro fixtureを使い、実際のMarkdown
renderer、React絞り込み、CSS、search
documents、Pagefindで本文と索引を生成する。新しい分類を執筆したり、synthetic
metadataを正本へ昇格したりしない。productionのlayoutと導線は別にT138/T140で検証する。seedと現cutoffは現時点では同じ868問だが、それぞれ3回測定する。設計上限のfilterは実際の「適用」event直前から件数・一覧のDOM更新まで、10回のwarmup後30回測定する。基準は各build
300秒、filter p95 100ms。

52週simulationは将来の問題文の完成や外部hostの料金を保証しない。取得はoffline公式task
fixture、執筆結果はfixture、reviewはsimulationと明示する。実際の共有更新処理、Git object、deployment
adapter、JSON
backupを使い、既存機器・電気・通常通信を除いたローカル完結経路の追加必須費用を0円として検証する。有料生成APIやhost契約を必須にはしない。

これはIssue #51の実装・品質検証証跡であり、Issue #52のcatch-up後再検証、Issue #53のrelease
gate、human review、protected-main設定、production merge／deployは別の作業である。`prepared`
の投影をproduction releaseと誤認しない。
