# 日本語本文の文字組み

[Issue #109](https://github.com/Fu-L/abc-textbook/issues/109)の表示変更。確認日: 2026-10-17。
[変更前の診断と撮影条件](study-ux-baseline.md)を引き継ぎ、本文の意味・分類・順序は変更していない。

## 採用値と比較

独自の `TextbookLayout`
のbodyにシステムのサンセリフ体を適用する。フォントのダウンロードはない。本文は
`1.0625rem`（標準設定で17px）、行間1.8、文章幅の上限
`44rem`（704px、全角約41文字）。本文幅はホーム・問題の導入にも適用し、コンテスト表の広い表示領域は維持する。狭い画面では残り幅に縮み、390px画面の本文幅は変更前350pxから366pxになる。文字拡大はブラウザーの設定に従い、rootのフォントサイズは固定しない。

ABC391
Fの「考察」を1440×1000で比較した。次の数値は同じ本文に候補値を適用した観測で、可読性の点数ではない。

| 候補      | 本文サイズ | 行間 | 幅の上限      | 観察                                                                               |
| --------- | ---------- | ---- | ------------- | ---------------------------------------------------------------------------------- |
| A         | 16px       | 1.7  | 48rem / 768px | 一画面に多く入る。式と日本語が混在する長い行では、行末から次行への視線移動が大きい |
| B（採用） | 17px       | 1.8  | 44rem / 704px | 日本語の行を追いながら、考察と次の見出しを読み分けられる                           |
| C         | 18px       | 1.9  | 40rem / 640px | 字形は大きいが、同じ説明で折り返しが増え、次の節が画面外へ押し出される             |

見出しはh1が28–36px、h2が24px、h3が20px、h4が18px相当、行間1.45。見出し前の余白を後より大きくし、見出しが連続するときは詰める。段落間は1.1em、リストの項目間は0.4em。引用は左罫線と控えめな文字色、リンクは下線を持つ。区切りと表は細い罫線を使い、カードや装飾は増やさない。パンくず・章目次・フッターは15px相当で本文より控えめにする。

## 変更前後の代表画面

Beforeは #108 の保存画像（実装は `1abfe747694f3196c09220512072bd57dd226a36`）。今回の変更元
`5ea2169e`
までに実装の差分はなく、同じBeforeを使う。Afterは本変更を本番origin/baseでbuildし、同じmacOS arm64 /
Node 24.18.0 / Playwright Chromium環境で撮影した。PCは1440×1000、スマホ相当は390×844、device scale
factor
1、明暗はOS設定相当。各画像は新しい使い捨てcontextを使い、本文・余白・色を加工していない。節は同じanchorを上端から32pxに合わせる。絶対scrollYは揃えない。

| 画面・位置                               | Before                                                  | After                                            |
| ---------------------------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| ホーム・先頭、PC light                   | [画像](study-ux-baseline/home-desktop-light.png)        | [画像](typography/home-desktop-light.png)        |
| 優先度付き列挙の単元・先頭、PC light     | [画像](study-ux-baseline/unit-desktop-light.png)        | [画像](typography/unit-desktop-light.png)        |
| 同単元・`#考え方`、スマホ light          | [画像](study-ux-baseline/unit-concept-mobile-light.png) | [画像](typography/unit-concept-mobile-light.png) |
| ABC391 F・先頭、PC light                 | [画像](study-ux-baseline/problem-desktop-light.png)     | [画像](typography/problem-desktop-light.png)     |
| ABC391 F・先頭、スマホ light             | [画像](study-ux-baseline/problem-mobile-light.png)      | [画像](typography/problem-mobile-light.png)      |
| ABC391 F・`#計算量と制約`、PC dark       | [画像](study-ux-baseline/problem-math-desktop-dark.png) | [画像](typography/problem-math-desktop-dark.png) |
| 区間monoid要約・`#問題一覧`、スマホ dark | [画像](study-ux-baseline/long-unit-mobile-dark.png)     | [画像](typography/long-unit-mobile-dark.png)     |

単元の「考え方」では、段落の切れ目と次の「成立条件と計算量」を見分けながら読めた。ABC391
Fでは考察・発動条件・正当性を見出しから探せる。明暗とも本文・リンク・補助文字を読み分けられる。これはCodexによる表示確認で、実読者の主観回答や長時間学習の効果測定ではない。

トレードオフとして、本文と余白を広げたためスクロールは増える。ABC391
Fの先頭ではPCでも「解説」が最初の画面外になり、長い単元のスマホ表示も約13787pxから約16395pxへ延びる。管理情報を解説より先に並べる構造、スマホで先に展開される章目次、問題一覧での説明の反復は残る。これらは #113
/ #115 / #116 /
#117 の情報設計で扱い、今回の文字組みだけで解決したとはしない。TeX記法の露出は #110、コードの自動折り返し・表の操作性は #111 の対象として残る。

## 明暗と確認範囲

初期テーマは `color-scheme: light dark` でOSに追従し、色は `light-dark()`
で選ぶ。JSなしでも同じ配色になる。Starlightの基本CSSを読み込まない独自layoutでも、参照するフォント・背景・罫線・フォーカス・構文色を解決する。文字は背景とのコントラスト比4.5以上を確認し、リンクは色に加えて下線で識別する。

- 本番 `/abc-textbook/` で静的buildと内部リンク・anchor検査を実施。
- `tests/e2e/accessibility.spec.ts`
  に、実本文のフォント・行間・幅、JS無効の明暗配色と文字コントラスト、320 / 390 / 720 CSS
  pxのreflow、見出し・引用・リスト・表の共通表示を追加。
- ホーム、代表単元、長い単元、ABC391 F、ABC251
  F、ABC212の表で文書全体の横はみ出しなし。表は既存の領域内で横スクロールする。
- 200%ズームは使い捨てプロファイルのChromium標準設定画面から設定。1440px幅のウィンドウで本文領域が720×456
  CSS px、`devicePixelRatio=2`となることを確認した。代表単元・長い単元・ABC391 F・ABC251
  F・ABC212の表で横はみ出しなし。「本文へ移動」へのTab /
  Enterも動作。[実ズームのABC391 F「考察」](typography/zoom-200-light.png)は本文のviewportを撮影したもの。720px幅のE2Eとは別の確認である。
- 実機スマホ、他OSの字形、実読者による評価は未実施。
- 既存のキーボード・検索・コンテスト表・学習記録保持の対象E2Eと、UI
  route・本文rendererのunit/contract検査を実施。新しい依存・証跡台帳・承認工程は追加しない。

文字組みの正本と再確認の入口は[更新マニュアル](update-manual.md#3-変更に必要な検証を選ぶ)を参照する。
