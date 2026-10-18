# 初見の次の一手を説明する執筆

[Issue #120](https://github.com/Fu-L/abc-textbook/issues/120)、背景は[Study UX #107](https://github.com/Fu-L/abc-textbook/issues/107)。通常の執筆で参照するskill・writing-policy・full/差分テンプレートを更新する。既存868問の本文・分類・URL・anchor・学習記録は変更しない。

## 方針と生成の入口

正本は[`abc-explanation-author`](../../.agents/skills/abc-explanation-author/SKILL.md)と[執筆方針](../../.agents/skills/abc-explanation-author/references/writing-policy.md)。`prepareExplanationAuthoring`は形式別の`templatePath`に加え、毎回読む`writingPolicyPath`を返す。入力を検証し、方針と比較例を読んで執筆し、完成unitを検証して`renderProblemAuthoringDocument`へ渡す。準備関数やMarkdown生成器が解法の説明を自動執筆するわけではない。

旧テンプレートの「自然な考察ロードマップ」「観察と解法候補」「鍵となる発想」などは、そのまま並べても既存readerが読む本文形式にはならなかった。新版は実際の`sections`欄と本文の節名へ対応させる。必須の着想・状態・手順・証明・境界・計算量・復習は残し、状態や遷移ごとの小見出し、候補の採用/棄却欄を一律に要求しない。必要な小見出しだけを内容に合わせて付ける。外側の節名は互換性のため維持する。

## ABC391 Fの比較

新規の[完全解説fixture](../../tests/fixtures/authoring-skill/writing-examples/generate.ts)はmetadataと既存Source
Revisionだけを引き継ぎ、本文を新しく執筆する。旧本文を差し替えて公開する変更は含まない。[公式問題](https://atcoder.jp/contests/abc391/tasks/abc391_f)・[個別公式解説](https://atcoder.jp/contests/abc391/editorial/12085)と解法・制約を2026-10-18に照合した。原稿の古いSource
Revisionの確認日は書き換えない。

| 読者が追う点         | 変更前の本文                                       | 新規の執筆例                                                                   |
| -------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| なぜ全列挙を避けるか | 単調性と採用手法を先に述べ、後から候補の採否を列挙 | 全組が多く必要な上位が少ない要求から、大きい順に作る方針へつなぐ               |
| なぜ単調か           | 「各indexについて単調非増加」と結論を提示          | 一座標を動かした差を因数分解し、降順と正の制約の役割を説明                     |
| なぜheapか           | 三近傍を追加する手順を提示                         | 小例で、直前の組の隣より以前の候補が大きいことを示し、候補全体を残す理由を説明 |
| なぜ見逃さないか     | frontierが存在するという結論                       | 任意の未出力状態までの経路で、最初の未出力状態がキューに残ることを示す         |
| 何を重複排除するか   | visitedを使う手順                                  | 同じ組への複数経路と、同値の別の組を区別し、追加時に組を登録する               |
| 次回に何を思い出すか | 全探索との比較試験を中心に記載                     | 上位だけが少ない要求、単調な向き、経路上の候補、同値と状態の違いを残す         |

文章は長くなるが、各段落が次の疑問へ答える。素朴解の反復、考察と証明の全文重複、不要な補題や独立演習は増やさない。計算量では整列・生成候補数・キューと集合の操作・入力を含む空間まで説明する。小例は独自の数値であり、全8組を列挙して結果を確認する。

## full・similar・supplement

`full`は単独で手順と成立理由を追える説明にする。`similar`は同じ学習成果・前提・主解法・証明着眼点・漸近計算量を確認し、差分を導く理由と実装への影響を説明する。`supplement`は同じ核へ一つの補強要素を加えるときに使い、その追加観察を導く。新しい主成果・前提・証明・漸近計算量が必要なら`full`へ戻す。同じデータ構造を使うことだけを短縮の根拠にしない。

未公開の差分fixtureは[ABC123 D](https://atcoder.jp/contests/abc123/tasks/abc123_d)を使う。優先値が和でも一座標ごとに単調であること、配列長ごとの境界、上位すべてを出力する差分を導き、探索境界の証明へ接続する。入力長の合計を定義して全体の時間・空間計算量を対応付け、復習の着目点を残す。ABC123
Dは収録範囲外の比較教材であり、公開catalog・taxonomyへ追加しない。対象の公式問題文から独自に論証し、sourceは既存の正規化方式でfingerprintを計算したfixture専用Source
Revisionである。

逆に和の列挙を既習としてABC391
Fへ進むなら、交差項を因数分解し、正の制約から単調性を導くことを一つの補強要素として説明できる。この`supplement`の例も執筆方針へ記載した。実問題の分類変更は別途比較して決める。

短縮形式は既存の`sections.differences`と`implementationNotes`を使う。復習や証明のために新しい管理欄を増やさず、共通の証明・計算量にどの条件で戻れるかを差分内で説明する。参照元fullへの冒頭リンクは共通rendererが生成する。

## 代表画面とトレードオフ

本番subpath `/abc-textbook/`、Chromium、light、JS無効、device scale factor
1。PCは1440×1000、スマホ相当は390×844 CSS
px。BeforeはこのPRの基点の通常本文、Afterは新規生成した未公開原稿を同じ問題レイアウトへ置いた表示fixtureである。

| 対象                       | Before                                      | 新規生成の表示                               |
| -------------------------- | ------------------------------------------- | -------------------------------------------- |
| ABC391 F、PC               | [画像](explanation-writing/before-1440.png) | [画像](explanation-writing/full-1440.png)    |
| ABC391 F、スマホ相当       | [画像](explanation-writing/before-390.png)  | [画像](explanation-writing/full-390.png)     |
| ABC123 Dの差分、PC         | 新規fixture                                 | [画像](explanation-writing/similar-1440.png) |
| ABC123 Dの差分、スマホ相当 | 新規fixture                                 | [画像](explanation-writing/similar-390.png)  |

情報階層と文字組みは#113までの共通レイアウトを使う。冒頭に核心を置き、具体的な定義・式・理由を追って読む。長い式は既存の数式rendererで局所スクロールし、必要な本文を折り畳まない。短縮形式は参照元の証明を先に読む負担があるため、冒頭リンクと差分で適用条件を示す。

ブラウザーテストは通常buildの共通HTML・CSSを使い、生成原稿・分類節・本文目次・形式ラベルをテスト応答内で差し替える。公開loaderへの追加問題登録を試すテストではなく、実在する教材への参照元リンクも確認する。既存原稿と公開catalogは変更しない。人間の理解度や学習効率を測定した結果ではない。

## 検証と再現

```sh
npm run check
npm run schema:check
npm test -- tests/contract/explanation-writing.test.ts tests/contract/explanation-authoring-skill.test.ts tests/contract/explanation-quality.test.ts tests/unit/problem-authoring-document.test.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build:checked
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/explanation-writing.spec.ts tests/e2e/document-math.spec.ts tests/e2e/problem-reading.spec.ts
```

画像を更新するときだけ最後のコマンドへ`EXPLANATION_WRITING_CAPTURE=1`を渡す。新規原稿の準備・出力検証・Markdown往復・明示数式・出典と参照元リンク、小例をcontractで確認する。E2Eは320・390・720・1440px、明暗、JS無効、Tab/Enterによる目次と参照元への移動を確認する。720pxは200%相当の読書幅の確認であり、ブラウザー設定による実200%ズームではない。実200%ズームの共通表示は[問題ページの既存確認](problem-reading.md#代表画面の比較とトレードオフ)を参照する。
