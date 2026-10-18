# 既存教材の読みにくさと最初の修正

[Issue #121](https://github.com/Fu-L/abc-textbook/issues/121)、背景は[Study UX #107](https://github.com/Fu-L/abc-textbook/issues/107)。2026-10-18に代表原稿と現在の生成・表示経路を確認し、3問を修正した。比較元は
`2c129519`（#120 merge後）。全868問の文章品質を審査した記録ではない。

## 症状から修正先を決める

最優先は、条件・状態・順位を誤って理解するおそれや、式を読めない箇所。その次に、発想を再現するための導出・小例の不足を直す。単なる英単語の数や文章の長さで一律に順位を付けない。

| 優先度・状態 | 対象                           | 症状と原因                                                                                                                 | 修正・次の作業                                                                                                                |
| ------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 高・今回修正 | ABC391 F                       | 1始まりと0始まりが混在。「frontierがある」で証明を終え、単調性とキューの必要性を読者に委ねていた                           | 添字を0始まりに統一し、一座標を動かした差・以前の候補を残す小例・経路上の最初の未出力状態による証明を記す                     |
| 高・今回修正 | ABC297 E                       | 「0を含む順位補正」が曖昧。同額の扱いと、なぜ金額へ状態をまとめられるかが薄い。制約のTeXが未区切り                         | 0円を順位から外す手順、同額では候補も再生成しない理由、価格2・3の小例、正の価格を使う証明と整数幅を記す。制約を明示数式にする |
| 高・今回修正 | ABC212 E                       | 同じ観察を採否・考察で反復する一方、DPの定義・初期値・式がない。「完全graph」「禁止neighbor」などの要約と未区切りTeXが残る | 状態→素朴な費用→全体和からの減算式→4都市の例→二配列の手順へつなぐ。自己遷移禁止と両方向の減算を説明する                       |
| 次・未修正   | ABC321 G                       | 冒頭の核心はあるが、その後に未定義の英語・記号を詰めた記述が続く。集合内配線数から連結配線数を引く最小例がない             | 端子数・部分集合・固定頂点を順に定義し、成分を一意に切り出す小例と空端子の境界を確認して改稿する                              |
| 次・未修正   | ABC330 G                       | 転倒数の二次モーメントを追うための記号が多く、主要式がテキスト枠にある。表記だけ直しても依存関係を読み取りにくい           | 定数・未確定同士・割当費用の三分解を小例で示し、条件付き期待値と行列集計を別々に導く。独自論証の検算を伴う別batchにする       |
| 次・未修正   | DP遷移高速化Unit               | 区間・例外・共通作用などの区別はあるが、旧layerやaffine作用の式が密な文章に続く                                            | まず基本の一つの式変形から読み、必要な発展へ進む文章へ整理する。単元の問題順や所属を変更せず、代表問題と往復して確認する      |
| 継続確認     | best-first・区間monoid要約Unit | #114の概念説明・小例と#115の一覧表示は導入済み。正本には分類用の反復や空の見出しも残る                                     | 現在は概念本文を先に読める。全一覧の再生成はせず、本文を改稿する機会に、旧anchorと補助情報を保って重複を整理する              |

数式候補の全体検索は既存の `notation:report`
を使った。変更前は1101原稿（868問題・233学習文書）中849原稿に7233件の候補、明示数式のエラーは0件。うち848原稿は問題、1原稿は
`learn/combinatorics-algebra/subset-transforms.md`
だった。エスケープされた集合記号なども拾うため、候補数は表示不具合の件数ではない。今回、ABC297
Eの7件とABC212
Eの12件を文脈・公式制約と照合して直した。残る候補と上表の未修正箇所は、解法を読んで小batchの対象を決める。一括で数式区切りを付けない。

## 正本と生成器の境界

今回の原因は既存Markdownの説明と記法にある。公開loaderは執筆済みMarkdownを読み、rendererは明示した数式を静的MathMLへ変換している。#120の執筆方針とテンプレートは既に更新済みで、生成関数が解法を自動執筆する経路ではない。ABC391
Fは#120の未公開執筆例を公式根拠と再照合して採用し、既存の節anchorを残した。他の2問も
`ProblemAuthoringUnit` の本文を執筆し、検証・生成・readerでの往復を確認した。

変更する正本は3問のMarkdownだけであり、正当性節と同居するclaimのtextも対応させ、revisionを一つ進めた。Source
RevisionのID・fingerprint・過去の確認日は保持する。公式問題と個別公式解説は、以下のリンクで2026-10-18に再照合した。新しい取得snapshotや過去の証跡の再生成は行わない。

- ABC391 F:
  [問題](https://atcoder.jp/contests/abc391/tasks/abc391_f)・[公式解説](https://atcoder.jp/contests/abc391/editorial/12085)
- ABC297 E:
  [問題](https://atcoder.jp/contests/abc297/tasks/abc297_e)・[公式解説](https://atcoder.jp/contests/abc297/editorial/6167)
- ABC212 E:
  [問題](https://atcoder.jp/contests/abc212/tasks/abc212_e)・[公式解説](https://atcoder.jp/contests/abc212/editorial/2357)

解法・数学的な意味・full形式・配置・前提・IDと公式出典を保ち、論証の省略を補った。ProblemAnalysisとInventoryの執筆、分類変更、既存の#56の作業は含まない。残る865問と全232単元の原稿は変更していない。

## 代表画面の変更前後

通常build、本番subpath `/abc-textbook/`、Chromium、JS無効、device scale factor
1。PCは1440×1000、スマホ相当は390×844 CSS
px。同じ節を上端32pxへ置いて撮影する。Beforeは比較元の実build、Afterは改稿後の実buildであり、DOMへ差し替えたfixtureではない。

| 読み取る箇所                      | Before                                                     | After                                                     |
| --------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| ABC391 F、考察、PC・light         | [画像](content-readability/before-abc391-f-1440-light.png) | [画像](content-readability/after-abc391-f-1440-light.png) |
| ABC391 F、考察、スマホ相当・light | [画像](content-readability/before-abc391-f-390-light.png)  | [画像](content-readability/after-abc391-f-390-light.png)  |
| ABC297 E、制約、スマホ相当・dark  | [画像](content-readability/before-abc297-e-390-dark.png)   | [画像](content-readability/after-abc297-e-390-dark.png)   |
| ABC212 E、考察、スマホ相当・light | [画像](content-readability/before-abc212-e-390-light.png)  | [画像](content-readability/after-abc212-e-390-light.png)  |

ABC391
Fでは「なぜ単調か」を差の式からたどれ、先に生成した候補を残す理由は47→31→29の小例から確認できる。ABC297
Eでは制約がTeX文字列から数式になり、本文では0円・同額・正の順位を区別できる。ABC212
Eでは冒頭の反復を減らし、現在地と日数の定義から更新式へ進める。

説明を補ったため、3問とも通読の長さは増えた。本文を短くする代わりに導出を省く判断はせず、既存の本文目次から証明・計算量・出典へ戻れるようにした。外側の節名と従来の小見出しanchorを保持しているため、典型の節には英語名も残る。実読者の主観評価・学習効率の測定は行っていない。

## 検証と再現

Node 24.18.0、npm 11.19.0で実行する。新しい検証CLIや台帳は作らず、通常の本文訂正と同じ手順を使う。

```sh
npm run check
npm run schema:check
npm test -- tests/contract/content-readability.test.ts tests/unit/problem-authoring-document.test.ts tests/contract/explanation-writing.test.ts tests/unit/problem-reading.test.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/document-math.spec.ts tests/e2e/problem-reading.spec.ts
```

追加したcontractは、3問の入力・出力schema、task固有の出典、正当性claimとの一致、生成とreaderの往復、TeX露出のない共通rendererを確認する。ABC391
Fの全8組と同値8組、ABC297 Eの価格2・3の買う個数の全列挙を独立に検算する。ABC212
Eの式は2～4都市の全74グラフ、各6日について直接の移動列挙と比較し、壊れた道路なし・全道路禁止・剰余の負値補正を含める。

検証結果は、上記4ファイル27テスト、Chromium回帰22テスト、型検査・schema一致・書式・変更テストのlint、1578ページのbuild、内部リンク4658件が成功。変更前buildの全1578
HTMLについて、既存anchor
22809件とリンク180505件の保持も確認した。構造化データ・対象外865原稿はGit差分で不変、3問も本文・claimのtext・revision以外のmetadata、学習の位置と出典を保持している。

表示は3問を320・390・720・1440px、明暗、JS無効で確認し、本文目次へのキーボード操作、式の組版と文書全体の横はみ出し、2件ずつの公式出典を確認した。別の使い捨てChromiumではブラウザーの設定から200%ズームにし、3問とも
`innerWidth=720`、`devicePixelRatio=2`、文書幅720pxで本文・数式・正当性節への移動を確認した。720pxのviewport試験とは区別する。実機スマホと全ブラウザーの総当たりは行っていない。
