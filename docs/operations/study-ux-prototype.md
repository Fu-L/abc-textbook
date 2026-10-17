# 代表単元・問題の読みやすさの試作

この文書と画像は #112 / PR
#128 時点の比較記録である。#113で問題ページの情報順を[共通レイアウト](problem-reading.md)、#114で単元の情報順と代表2単元の文章を[通常表示](unit-reading.md)へ採用した。単元の試作文章は正本Markdownへ統合し、重複する試作ファイルを削除した。現在の試作変数は問題の代表原稿と単元の一覧圧縮を比較するために使う。撮影テストは`build/study-ux-prototype/`へ出力し、この文書の旧Before/After画像を上書きしない。以下の比較・判断は#128時点の記録である。

[Issue #112](https://github.com/Fu-L/abc-textbook/issues/112)、背景は[Study UX #107](https://github.com/Fu-L/abc-textbook/issues/107)。確認日:
2026-10-17。[比較基準](study-ux-baseline.md)の「単元を理解する」「問題を解く」「長い単元で復習する」を、#109〜#111の文字組み・数式・横幅改善後の画面で試した。

通常のbuildは従来の本文と情報順を使う。`STUDY_UX_PREVIEW=1`を指定したbuildだけ、次の4ページを差し替える。試作原稿は`src/lib/study-preview/manuscripts/`にあり、868問・232単元の正本、生成器、分類・掲載順を変更しない。新しいURLやブラウザー用JS、依存は増やさない。

- `/learn/query/priority-queue-best-first/`
- `/learn/query/range-monoid-aggregation/`
- `/problems/abc391-f/`
- `/problems/abc213-g/`（既存の数式をそのまま読む対照）

## 試作で変えたもの

単元は、目次・分類の反復より先に学ぶ問いを置いた。優先度付き列挙は二行の和の表から探索境界を導き、区間要約は「答えだけでは結合できない」反例から必要な六つの値を導く。どちらも、具体例→操作→不変条件や結合則→計算量→復習の問いへ進む。旧本文・技能・前提・対象色・根拠は開閉できる詳細へ残した。

ABC391
Fは、公式問題へのリンク・学習記録・主題単元からすぐ考察へ進める。添字を0始まりに統一し、正の要素と降順整列から単調性を式で示した。小例で44から三候補34・36・38を作り、生成済みの候補全体をheapへ残す意味を説明する。正当性は「原点から任意の未出力状態への経路上にある、最初の未出力状態」から順序の保証へつなげた。復習はこの論証と同値の別状態の区別へ戻る。

[公式問題](https://atcoder.jp/contests/abc391/tasks/abc391_f)と[公式解説](https://atcoder.jp/contests/abc391/editorial/12085)を再確認した。解法・制約・全体計算量は変えず、導出と具体例を補った。数値例と、正の小配列400ケース（長さ1〜8、同値を含む）の全順位を全列挙と比較した。元の出典・確認日・Source
Revisionは本文に保持し、試作の説明を正本の検証済みclaimへ書き戻していない。

| 情報                                                         | 試作での扱い                                                             |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| 問い、具体例、状態・操作、証明、計算量、制約、復習、公式出典 | 展開した本文で読む                                                       |
| 問題の掲載状態・日時・Outcome・タグ・執筆版                  | 解説後の開閉欄へ移動。省略しない                                         |
| 単元の元の導入・技能・前提・対象色                           | 「単元の概要・前提と範囲」で読む                                         |
| 主配置・関連問題                                             | 既存順序のままID・題名を一覧化。元の分類・技能・補足を直下の開閉欄へ保持 |
| 教科書の章目次                                               | 単元本文の後の開閉欄へ移動。現在単元と全リンクを保持                     |
| 既存の節anchor、内部・公式リンク、学習記録・backup形式       | 維持。旧anchorが詳細内にある場合も直リンクで開く                         |

## 同じ条件での画面比較

Beforeは本PRの通常モード（基点`dd509569`と同じ本文・情報順）、Afterは同じ変更の試作モード。本番originと`/abc-textbook/`でbuildした静的HTMLを撮影した。macOS
arm64 / Node 24.18.0 / Playwright Chromium、PCは1440×1000、スマホ相当は390×844 CSS px、device scale
factor
1。明暗はOS設定相当、JS無効、空の使い捨てcontextで比較した。ページ先頭はscrollY=0、節は同じanchorを上端から32pxへ合わせ、画像の本文や余白は加工していない。

| 対象・位置                                         | Before                                                           | After                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------- |
| 優先度付き列挙、PC light、先頭                     | [画像](study-ux-prototype/before-unit-desktop-light.png)         | [画像](study-ux-prototype/after-unit-desktop-light.png)         |
| 同単元、スマホ light、先頭                         | [画像](study-ux-prototype/before-unit-mobile-light.png)          | [画像](study-ux-prototype/after-unit-mobile-light.png)          |
| 同単元、スマホ light、`#考え方`                    | [画像](study-ux-prototype/before-concept-mobile-light.png)       | [画像](study-ux-prototype/after-concept-mobile-light.png)       |
| 区間monoid要約、スマホ dark、`#考え方`             | [画像](study-ux-prototype/before-monoid-concept-mobile-dark.png) | [画像](study-ux-prototype/after-monoid-concept-mobile-dark.png) |
| 区間monoid要約、スマホ dark、`#問題一覧`           | [画像](study-ux-prototype/before-long-unit-mobile-dark.png)      | [画像](study-ux-prototype/after-long-unit-mobile-dark.png)      |
| ABC391 F、PC light、先頭                           | [画像](study-ux-prototype/before-problem-desktop-light.png)      | [画像](study-ux-prototype/after-problem-desktop-light.png)      |
| 同問題、スマホ light、先頭                         | [画像](study-ux-prototype/before-problem-mobile-light.png)       | [画像](study-ux-prototype/after-problem-mobile-light.png)       |
| 同問題、スマホ light、`#正当性`                    | [画像](study-ux-prototype/before-proof-mobile-light.png)         | [画像](study-ux-prototype/after-proof-mobile-light.png)         |
| ABC213 G、PC dark、`#計算量と制約`                 | [画像](study-ux-prototype/before-math-desktop-dark.png)          | [画像](study-ux-prototype/after-math-desktop-dark.png)          |
| similar表示用fixture、スマホ light、`#explanation` | [画像](study-ux-prototype/before-similar-mobile-light.png)       | [画像](study-ux-prototype/after-similar-mobile-light.png)       |
| ABC391 F、実200%ズーム、light、`#考察`             | [画像](study-ux-prototype/before-zoom-200-light.png)             | [画像](study-ux-prototype/after-zoom-200-light.png)             |

200%はChromium設定画面で倍率を変更し、1440pxウィンドウが720×456 CSS px・devicePixelRatio
2になったことを確認した。4ページとも横はみ出しなし。画像はブラウザーから取得したviewportであり、720px幅へ縮めた画像ではない。

## 試用結果と採用・保留

以下はCodexによる通読・表示・操作確認である。人間の主観回答、実機スマホ、長時間の学習効果測定は未取得。「学習効率が向上した」という測定結果にはしない。

| タスク                               | 観察と残る負担                                                                                                                   | 判断                                                                                 |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 単元のURLを開き、何を学ぶか知る      | スマホ先頭に題名と問いが出る。章目次の長い展開を通り過ぎる必要がなくなった。目次の常時表示は失う                                 | 本文を先に置く方針を採用。目次の最終配置は #116で検討                                |
| heapから次の値を選べる理由を説明する | 表の各行の先頭→未生成値の下界→全体の最小、の順に追える。抽象語frontierの前に具体物を読める                                       | 小さい具体例から不変条件へつなぐ文章を採用候補とする                                 |
| ABC391 Fの状態・重複・正当性を探す   | 先頭に公式問題と考察が出る。添字と単調性の根拠が揃い、未出力状態からheapの候補へ遡れる。一方、導出を増やした分だけ本文は長くなる | 情報順と導出の補完を採用候補とする。正本への反映は #113 / #120 / #121で個別に扱う    |
| 長い単元から次に解く問題を選ぶ       | 16問の主配置を短い一覧で見比べられる。技能の繰り返しは減るが、題名だけでは問題ごとの違いが分からない                             | 繰り返しの詳細化は採用候補。ID・題名だけの全体展開は保留し、#115で短い差分説明を検討 |
| 成立条件・分類・前提へ戻る           | 本文内リンクと旧anchorで到達し、詳細はEnterで開閉できる。情報を隠した分、全文を眺めるには操作が増える                            | 詳細化を採用候補とするが、学習に不可欠な条件は本文に残す                             |
| fullとsimilarを読み分ける            | fullは自ページに導出・証明・計算量がある。similarは冒頭に参照元fullへのリンクが出て、往復できる                                  | 参照元を先に示す現行方針を維持。実際の差分教材の理解度評価は保留                     |
| 学習記録を残す                       | 先頭リンクから操作欄へ移動し、保存完了を待ってreloadしても「修了」「要復習」を保持した                                           | 本文を押し下げず操作欄へ移動するリンクを採用候補とする                               |

掲載済み868問はすべてfullであり、similarの画像は未掲載の表示fixtureである。ABC213
GのHTML応答の本文だけをテスト時に差し替え、未掲載・分類判断なしと明記した。問題の実際の差分、成立条件・証明・計算量の共通性は評価していない。fixtureは公開正本・catalog・distへ保存しない。

本PRの決定は**代表ページでの試作と比較結果を採用し、全体適用は行わない**こと。#113〜#121のまとめ実装や868問の自動改稿へ進まない。採用候補の各方針を後続の個別変更で具体化する。人間の承認や別のレビュー台帳を本PRの完了条件に追加しない。

## 再現と確認範囲

通常モードのbuild→確認→試作モードのbuild→同じ確認、の順で実行する。buildの間はpreviewサーバーを止める。試作のbuildはローカル比較用で、通常の公開workflowへ環境変数を追加しない。試作ページには表示ラベル・noindex・Pagefind対象外の指定を付け、正本catalogは常に同じものを使う。

```sh
npm run check
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build:checked
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook STUDY_UX_CAPTURE=1 npm run test:e2e:built -- --project=chromium tests/e2e/study-preview.spec.ts

STUDY_UX_PREVIEW=1 SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build:checked
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
STUDY_UX_PREVIEW=1 SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook STUDY_UX_CAPTURE=1 npm run test:e2e:built -- --project=chromium tests/e2e/study-preview.spec.ts tests/e2e/document-math.spec.ts tests/e2e/document-widths.spec.ts tests/e2e/accessibility.spec.ts
```

`STUDY_UX_CAPTURE=1`を省略すれば画像は更新しない。試作を手で読むときは試作build後に`SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run preview`で上記4URLを開く。元に戻すには変数を外して通常buildする。

- 型検査・変更箇所のlintと書式、既存renderer・数式記法・UI
  routeのunit/contract、試作の対象限定・全anchor/リンク・元の単元情報・問題順保持のunit検査。
- 正本公開projectionのintegration検査で、既存データのschema・ID・参照・分類・形式を確認。
- 両モードの本番subpath
  build・全内部リンク、Chromiumの画面・明暗・JS無効・開閉・anchor移動・学習記録の保存/reload。320 /
  390 / 720pxのreflow、数式・コード・表の局所スクロールとTab・矢印キー。
- 実200%ズームで代表4ページとskip link・開閉操作を確認。
- 通常モードで検索・既存の公開導線・学習記録とbackupの対象E2Eを確認。

実施結果と未実施範囲はPRへ短くまとめる。他OS・実機スマホ・実読者評価・他ブラウザーの追加比較は未実施。
