# 全コーパスの公開投影（T160）

公開ページは `src/lib/catalog/public-catalog.ts` から受理済みの正本を読み込む。
`assembleCatalog`、`buildUiCatalog`、検索文書・マトリクスの生成は既存previewと共通である。previewの入力と検証は保持し、公開ページからpreview
fixtureへの依存を除く。

9章232 Unitの文書は `draft: false`
へ移行した。変更はその一行だけで、本文・分類・所有権・問題順は保持する。
`corpus:verify-learning-units`
は draft の一行を受理時の値へ戻して比較し、過去の受理subjectを維持する。公開投影は実際の公開文書のdigestも固定し、full_authoringでない文書、draftのままの文書、未受理の本文・metadataを拒否する。Problem
shardの文書は受理時のbyteを維持し、868問の正規routeだけで本文を表示する。

各問題のhomeはprimary Outcomeの唯一のownerであり、章の `problemIds`
はcoverageを表す。Unit内の問題順、追加で学ぶ技能、既習技能、関連問題の区別を引き継ぐ。同じUnitへの所属だけで類題や解説省略を主張せず、独立full解説同士は「同じ単元の問題」と表示する。掲載順と対象色は
`textbook-order.ts` と `unit-learning-targets.ts` を使い、意味階層や前提DAGから順序を生成しない。

新しい本文やmappingを受け入れた後、投影を更新する場合は次を実行する。

```sh
npm run build
npm run corpus:verify-full-projections:write
npm run corpus:verify-full-projections
npm run verify:fast
```

通常の検証は書き込みを行わない。`--write` は受理済み正本からtaxonomy
indexを生成し、実際の生成済みHTML、catalog、Pagefind、sitemap、feedのinventoryとdigestを固定する。本文、taxonomy、Outcome、ProblemAuthoringUnitを再生成しない。BASE_PATH/SITE_URLを変えて確認する場合は、その出力専用の証跡を用意し、基準の投影証跡を上書きしない。

12件のCorrectionImpactは受理済み本文・canonical policy・生成済みtaxonomy
indexへ解決する。T049のpreview専用の例・演習・解答の72
locatorは、T078で廃止が受理された記録と実際の不在を照合し、対象外として文書digest付きで記録する。受理記録のない欠落や未知locatorを対象外へ変換しない。canonical
policyはpendingの履歴を維持し、検証済み公開投影と完了証跡を別途生成する。

表示時は係数抽出の `[t^(n−2)](Φ^n)` を数式として扱い、微分の `'`
を自動的な引用符置換から保護する。受理済みMarkdownを変更せずに表示だけを補正する。内部リンク検査は大量の接続時の通信エラーを再試行するが、欠落ページ・欠落アンカーは失敗として報告する。

今回の全体検証は `docs/verification/bootstrap/us4/check-results.json`、生ログは同じディレクトリの
`verify-fast.txt`
に記録した。551テスト、20件の既存数学回帰、4,647リンク、3ブラウザーで105件のE2Eが通っている。

この投影のRelease状態は `prepared` であり、production
Releaseの承認やdeployを表さない。人間レビューを生成・代行せず、実際の公開済みcommitのRelease
historyだけを更新履歴へ載せる。初回の履歴は0件で、feedも空のentry集合となる。production検証はpreparedのカタログを拒否する。T138/T140/T145/T146は
`docs/verification/bootstrap/us4/full-projections.json` の固定digestを入力として使う。
