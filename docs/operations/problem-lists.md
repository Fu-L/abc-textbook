# 問題一覧の表示

[Issue #115](https://github.com/Fu-L/abc-textbook/issues/115)、背景は[Study UX #107](https://github.com/Fu-L/abc-textbook/issues/107)。単元とタグページの問題を、題名・組合せ・行き先から見比べる。

## 表示と正本

問題名は本書の解説へ、隣の「公式問題」はAtCoderの出題元へ進む。主配置ではその単元と組み合わせる他単元の名前を示す。関連問題では主題の単元だけを表に出し、他の技能の長い列挙は詳細で読む。主題と追加技能・既習技能の厳密な区別、学習成果の全文、問題固有の補足は各行の「技能・出典」に保持する。主タグ・補助タグにもここから進める。開閉はnative
detailsで、JSなしでもリンクとキーボード操作を使える。

共通表示は`src/components/problem-list.ts`。単元本文の既存リンク・説明をbuild時に移動し、題名や説明を切り詰めたり、分類文から問題固有の要約を自動生成したりしない。組合せは元の項目にある他単元リンク、主題はcatalogの主配置から取る。元の全説明・補足・リンク・anchorを残す。正本Markdown、問題集合・掲載順、分類・前提、学習記録には変更を加えない。

`canonical-taxonomy-materialization.ts`と追加CLIは引き続きMarkdownと完全な役割説明を作る。新問にも同じ表示を適用するので、既存232単元の再生成や手作業のHTML編集は不要である。タグの代表問題は既存の`representativeProblemIds`を使い、主タグ・補助タグの表示は実際の所属がある場合に限る。上位の導入タグが選んだ代表例には、そのタグが直接付いていないことがある。代表・発展の新しい難易度ランクは付けない。

#112の試作は題名一覧と元の一覧を二重に置いていた。通常表示は各問題を一行項目にまとめ、行単位で詳細を開く。旧試作の一覧変換と専用CSSを削除し、試作モードも共通表示を使う。

## 代表画面の比較

Beforeは`506f83d5`、Afterは#115の通常build。同じ`/abc-textbook/`、Chromium、macOS
arm64、JS無効、device scale factor
1、一覧見出しの32px手前から撮影した。PCは1440×1000、スマホ幅は390×844。確認日: 2026-10-17。

| 対象                                        | Before                                                                       | After                                                                       |
| ------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 優先度付き列挙、PC、light、主配置           | [画像](problem-lists/before-priority-queue-best-first-1440-light-direct.png) | [画像](problem-lists/after-priority-queue-best-first-1440-light-direct.png) |
| 区間monoid要約、スマホ幅、light、主配置16問 | [画像](problem-lists/before-range-monoid-aggregation-390-light-direct.png)   | [画像](problem-lists/after-range-monoid-aggregation-390-light-direct.png)   |
| 同単元、スマホ幅、dark、関連問題を開く      | [画像](problem-lists/before-range-monoid-aggregation-390-dark-related.png)   | [画像](problem-lists/after-range-monoid-aggregation-390-dark-related.png)   |

繰り返していた学習成果の段落を閉じたことで、同じ画面で複数の題名・他分野との接続を見比べられる。詳細をまとめて通読する場合は、行ごとの開閉操作が増える。問題固有の短い比較文を新しく執筆したわけではなく、分類と題名だけで区別しにくい問題も残る。詳細または解説で確認する。全問題の一括改稿をせず、必要な問題の文章改善は別に進める。

Codexによる表示・操作の確認であり、実読者の理解度や学習効率を測定した結果ではない。

## 検証

既存の`tests/unit/unit-reading.test.ts`を拡張し、全232単元の主配置・関連問題の順序、主配置全868問の保持、元の説明・補足・内部リンク・数式・anchorを比較する。全タグの代表問題と関連問題もcatalogと照合し、根拠のないタグ役割を出さないことを確認する。元の段落・本文配置の検査は引き続き`arrangeUnitReading`で行う。

`tests/e2e/unit-reading.spec.ts`は代表2単元とタグで、明暗、320/390/720/1440 CSS
px、JS無効、Enterでの行詳細の開閉、内部解説・公式問題・関連技能へのリンクを検査する。720pxのreflow検査に加え、専用の一時プロファイルでChromiumの設定を200%へ変更した。1440pxのウィンドウで`innerWidth: 720`・`devicePixelRatio: 2`となること、代表2単元とタグ一覧に横はみ出しがないこと、Enterで詳細を開閉できることを確認した。型・schema、生成器の契約、検索・アクセシビリティと本番subpathのbuild・リンクも既存の検証を使う。実行結果はPRにまとめる。

```sh
npm run check
npm run schema:check
npm test -- tests/unit/unit-reading.test.ts tests/unit/study-preview.test.ts tests/contract/canonical-taxonomy-materialization.test.ts tests/contract/verify-fast.test.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build:checked
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/unit-reading.spec.ts tests/e2e/search.spec.ts tests/e2e/accessibility.spec.ts
```
