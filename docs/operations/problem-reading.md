# 問題ページの情報順

[Issue #113](https://github.com/Fu-L/abc-textbook/issues/113)、背景は[Study UX #107](https://github.com/Fu-L/abc-textbook/issues/107)。#112の試作から問題ページの情報順を共通レイアウトへ採用する。解説本文の改稿、分類・問題順の変更、単元ページへの展開は含まない。

## 読む順と正本

タイトルの直下で完全解説・差分解説・補足解説を区別し、公式問題、学習記録、分類と前提へのリンクを示す。fullでは既存の検証済み分析の`reasoningPath.algorithmConnection.text`を「解法の核心」に使い、そのまま考察へ進む。分類用のOutcome文を要約に流用しない。分析の配列添字・積・集合差などをMarkdownとして再解釈しないため、この短い要約はテキストとして表示する。数式を含む解説本文は従来のrendererで表示する。

similarは参照元fullと共通する論証を読んでから差分へ進む。supplementも参照元fullを先に案内し、追加する要素を読むことを明示する。両形式の冒頭リンクは`authoringUnit.kind`と`primaryProblemId`から共通rendererが作る。full向けのアルゴリズム要約を短縮形式へ重複表示しない。

本文の「学習の位置」は、展開済みの考察・正当性・実装・復習・計算量・制約・出典から切り離し、末尾の「分類・前提・執筆情報」へ移す。元の段落・anchor・単元へのリンク、主題・追加技能・既習技能、タグ、確認日時、執筆version/revisionは保持する。正本Markdownは編集しない。出典とSource
Revisionは引き続き本文末尾で読む。

学習記録は本文と開閉欄の後、同じ単元の問題の前に置く。冒頭リンクから直接移動でき、記録欄から解説へ戻れる。見出しは静的HTMLに置き、JavaScriptの初期化を待たずに到達できる。進捗・復習設定、各更新日時、保存失敗時の表示、要復習一覧とbackupの導線を維持する。保存処理・IndexedDB・backup形式は変えない。

共通部品は`src/components/ProblemExplanation.astro`、本文の分類節を分ける処理は`src/components/problem-reading.ts`。問題ページは公式取得・通常の執筆と公開フローで同じ部品を使う。Problem
IDを列挙した表示分岐や、新問ごとのCSSは不要である。#112の`STUDY_UX_PREVIEW=1`による代表原稿の比較は別に残し、その原稿を通常buildへ取り込まない。

## 代表画面の比較とトレードオフ

BeforeはPR
#128の通常build（基点`d1651810`と同じ問題表示）の既存画像を再利用した。Afterは本変更の通常build。両方とも本番subpath
`/abc-textbook/`、macOS arm64 / Node 24.18.0 / Playwright Chromium、JS無効、light、device scale
factor 1、先頭位置である。PCは1440×1000、スマホ相当は390×844 CSS px。

| 対象                 | Before                                                      | After                                        |
| -------------------- | ----------------------------------------------------------- | -------------------------------------------- |
| ABC391 F、PC         | [画像](study-ux-prototype/before-problem-desktop-light.png) | [画像](problem-reading/after-1440-light.png) |
| ABC391 F、スマホ相当 | [画像](study-ux-prototype/before-problem-mobile-light.png)  | [画像](problem-reading/after-390-light.png)  |

darkでも[PC](problem-reading/after-1440-dark.png)・[スマホ相当](problem-reading/after-390-dark.png)を確認した。別途JS有効で実200%ズームをChromiumの設定から指定し、1440pxウィンドウが720×456
CSS px・devicePixelRatio
2になることを確認した。[考察の画面](problem-reading/after-zoom-200-light.png)と、ABC213
Gの数式、skip link・開閉・学習記録への移動に横はみ出しや操作不能はなかった。

初期表示にあった学習上の位置付け・タグ・確認日時の代わりに、公式問題と解法の核心が現れる。本文は既存の幅・行間を保ち、問題ページの外枠も読書幅に揃える。スマホ相当でも核心から考察へ続けて読める。巨大な固定操作欄や装飾は追加しない。

分類と前提を通覧するには開閉操作が一つ増える。補うため冒頭に「分類と前提」を残し、旧`#学習の位置`へ直接移動しても開くことを確認する。学習記録も先頭へ大きく常設する代わりにリンクで移動するため、現在の状況を知るには移動が必要になる。長いアルゴリズムの要約は短い問題より冒頭の高さを使うが、自動的に切り詰めて手順を欠落させない。

Codexによる通読・操作・表示確認であり、人間の理解度や学習効率の向上を測定した結果ではない。868問は現在すべてfullであり、similar/supplementは未掲載fixtureのschema・公開projectionと共通rendererで確認する。表示fixtureでは既存ページの応答本文を差し替えて参照元との往復を確認し、公開catalogへ問題を追加しない。実問題の分類や差分解説の教育効果の評価は含まない。

さらにcheckout外の一時Astroページから、未掲載の別IDを持つfull/similar/supplementを実際の`ProblemExplanation`でbuildし、形式のラベル・要約の有無・分類節の移動・参照元URLを検査した。確認用ページは通常の公開出力に含めない。

## 検証と再現

型検査・対象unit/contract/integration、通常buildの全内部リンク、Chromiumで問題・検索・学習記録・backupの既存テストを確認する。問題固有の数式・計算量・公式出典が読めること、明暗、狭い幅、JS無効、Tab/Enterによる開閉、旧fragment、保存とreloadを対象とする。

```sh
npm run check
npm test -- tests/unit/problem-reading.test.ts tests/unit/public-document.test.ts tests/unit/study-preview.test.ts tests/integration/full-public-projection.test.ts tests/contract/ui-routes.test.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build:checked
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook PROBLEM_READING_CAPTURE=1 npm run test:e2e:built -- --project=chromium tests/e2e/problem-reading.spec.ts tests/e2e/learning-records.spec.ts tests/e2e/search.spec.ts tests/e2e/document-math.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/full-projection.spec.ts
```

画像を更新しないときは`PROBLEM_READING_CAPTURE=1`を外す。追加の試作モード確認は[試作の手順](study-ux-prototype.md#再現と確認範囲)を参照する。実施数・未実施範囲はPRへ記す。
