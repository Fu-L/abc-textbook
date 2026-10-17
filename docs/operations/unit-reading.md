# 単元ページの情報順

[Issue #114](https://github.com/Fu-L/abc-textbook/issues/114)、背景は[Study UX #107](https://github.com/Fu-L/abc-textbook/issues/107)。#112の試作から、概念の説明を先に読む構成を通常表示へ採用する。

以下は#114時点の文章・比較記録。#115で問題一覧を通常表示へ採用した後の仕様と画像は[問題一覧の表示](problem-lists.md)、#116で本文横と冒頭へ移した目次は[章・単元のナビゲーション](textbook-navigation.md)を参照する。現在は試作モードでも同じ一覧・目次を使う。

## 読む順と正本

単元名の後で、正本Markdownの概要、考え方、成立条件と計算量を読む。必要な仮定・操作・証明は本文に残し、問題一覧へ進む。対象色、形式的な学習成果、共通前提のID、直接前提・依存先、除外範囲、公式出典とtaxonomy識別子は「前提・学習成果・出典」に保持する。本文と同名の分類見出しもここへ移す。段落・数式・リンクと旧節anchorを捨てず、ブラウザーのnative
detailsで開閉する。

関連問題は別の主題を学ぶ際の組合せなので、「他の主題と組み合わせる問題を読む」から開く。主配置問題と関連問題の所属・順序・説明文は維持する。問題ごとの技能説明の圧縮は#115の対象とし、この変更では題名だけの一覧へ置換しない。教科書全体の目次は本文末尾から開く。冒頭には問題一覧・前提・目次へのリンクを置く。

表示処理は`src/components/unit-reading.ts`、共通の幅と目次配置は`TextbookLayout.astro`。全単元が同じ処理を通り、新しいUnitのIDを列挙しない。`renderLearningUnitDocument`は概念の定義を対象色より先に置くdraftを生成する。具体的な導入・小例・論証は正本Markdownで執筆し、共通表示で開閉・配置を整える。分類metadataから説明を自動要約せず、表示専用の本文正本も追加しない。公開loaderは既存の執筆済みMarkdownを読み、全単元を再生成しない。

## 代表2単元の文章

優先度付き列挙では、昇順二配列の和を二行の表にする。各行の未出力の先頭だけをheapへ入れる操作から、未生成値を見落とさない不変条件へ進む。同じ値の別状態、空配列、候補の尽きる場合を説明し、二配列の例の計算量と一般の多方向探索を区別する。

区間要約では、`aa`と`aa`を合わせると最長連続長が2から4になることから、答えだけでは結合できない理由を示す。境界に必要な六つの値、結合式、空区間の単位元、実列の連結に基づく結合則、一点更新・区間取得の計算量へつなぐ。両単元とも復習時の問いと主配置問題への接続を本文に置く。

この文章は試作ファイルから正本Markdownへ統合した。重複する`study-preview/manuscripts/priority-queue.md`と`monoid.md`を削除し、試作モードの単元では一覧圧縮だけを比較する。残る230単元は既存本文の情報整理を適用し、文章の全面改稿は行わない。

## 画面比較とトレードオフ

Beforeは#112 / PR
#128の通常build画像。#113は単元を変更していないため、今回の基点`91ac66b3`と同じ単元表示である。Afterは今回の通常build。ともに`/abc-textbook/`、macOS
arm64、Node 24.18.0、Chromium、JS無効、device scale factor
1。同じviewportと開始位置で撮影した。確認日: 2026-10-17。

| 対象・位置                             | Before                                                           | After                                                                |
| -------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| 優先度付き列挙、1440×1000、light、先頭 | [画像](study-ux-prototype/before-unit-desktop-light.png)         | [画像](unit-reading/priority-queue-best-first-1440-light.png)        |
| 同単元、390×844、light、先頭           | [画像](study-ux-prototype/before-unit-mobile-light.png)          | [画像](unit-reading/priority-queue-best-first-390-light.png)         |
| 同単元、390×844、light、考え方         | [画像](study-ux-prototype/before-concept-mobile-light.png)       | [画像](unit-reading/priority-queue-best-first-concept-390-light.png) |
| 区間要約、390×844、dark、考え方        | [画像](study-ux-prototype/before-monoid-concept-mobile-dark.png) | [画像](unit-reading/range-monoid-aggregation-concept-390-dark.png)   |

区間要約の先頭も[PC](unit-reading/range-monoid-aggregation-1440-light.png)・[スマホ相当](unit-reading/range-monoid-aggregation-390-light.png)で確認した。darkのスマホ相当は[優先度付き列挙](unit-reading/priority-queue-best-first-390-dark.png)と[区間要約](unit-reading/range-monoid-aggregation-390-dark.png)。

展開された章目次を通り過ぎる代わりに、スマホ相当でも最初の画面で単元名と学ぶ目的を読める。具体例と成立条件は続けて読める。一方、章全体や前提・根拠の通覧には開閉操作が増える。冒頭リンクと既存fragmentから参照でき、旧fragmentが詳細内にあればJSなしでも開く。主配置の長い説明文は残るため、長い単元での問題の選びやすさは#115に課題を残す。装飾・アニメーション・追加依存は導入しない。

Codexによる文章・画面・操作の確認である。実読者の理解度や長時間の学習効率を測定した結果として扱わない。

## 検証と再現

`unit-reading.test.ts`は全232単元の表示整理前後で、段落・数式・全anchor/リンク・主配置と関連問題の順序が一致することを確認する。新規IDと通常と異なる節名を持つfixtureでも本文・参照情報を保持する。生成器の契約テストではdraftの概念説明が対象色より先に出ることを確認する。schemaと公開projectionは既存の検証を使う。Gitとの本文bytes比較を含むintegration検査は、正本の改稿をcommitしてから実行する。

代表の数値例に加え、昇順配列400組（負値・同値・空配列を含む）の全組列挙を全探索と比較した。長さ0〜8の二文字列の全三分割18,943件では、六つの要約値による左右の結合順と実列の要約が一致した。教材へ実行コードや検算台帳は追加しない。

```sh
npm run check
npm run schema:check
npm test -- tests/unit/unit-reading.test.ts tests/unit/study-preview.test.ts tests/contract/canonical-taxonomy-materialization.test.ts tests/integration/full-public-projection.test.ts tests/contract/verify-fast.test.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build:checked
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook UNIT_READING_CAPTURE=1 npm run test:e2e:built -- --project=chromium tests/e2e/unit-reading.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/search.spec.ts tests/e2e/document-math.spec.ts tests/e2e/document-widths.spec.ts
```

画像を更新しないときは`UNIT_READING_CAPTURE=1`を外す。320/390/720/1440 CSS
px、明暗、JS無効、Tab/Enter、旧fragment、章・案内節・未改稿単元と問題詳細への移動を確認する。720pxの確認は1440px画面を200%にした際のレイアウト幅相当で、ブラウザー設定による実ズームの確認とは区別する。試作を変えた場合は[試作の手順](study-ux-prototype.md#再現と確認範囲)で対象の両モードを確認する。実行結果・未実施範囲はPRにまとめる。
