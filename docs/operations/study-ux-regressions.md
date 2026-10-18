# 読書表示の回帰検査

Issue [#122](https://github.com/Fu-L/abc-textbook/issues/122)
の検査は、既存の代表画面検査へ不足分を足す。全868問のブラウザー撮影や画像snapshotの更新は行わない。教材・分類・URL・学習記録の正本は変更しない。

## 検出する退行

| 対象                            | 検査                                                                                                      | 担当するテスト                                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 問題・単元・長い単元            | 200%の文字拡大、720 CSS pxでのreflow、両配色の実際のコントラスト、目次のキーボード操作・移動先、数式      | `study-readability.spec.ts`                                                     |
| 既存の代表原稿と幅のfixture     | MathML、未変換TeX、重複anchor、内部リンクの公開path、code fenceの全行保持                                 | `study-ux-documents.test.ts`                                                    |
| 新Unit・新Problem               | 生成・執筆→公開投影→共通renderer→通常ページの静的build→本文・出典・学習位置・内部リンク・学習記録への移動 | `new-material.spec.ts`                                                          |
| 320/390/720px、PC、明暗、JS無効 | 文字組み・横溢れ・本文・native details・基本導線                                                          | 既存の `accessibility.spec.ts`、`document-math.spec.ts`、`unit-reading.spec.ts` |
| 長いコード・表・数式            | 局所スクロール、Tab・矢印キー、文字保持                                                                   | 既存の `document-widths.spec.ts`                                                |

拡大検査は、1440pxを200%にしたときの720 CSS
pxの幅と、rootの文字サイズ200%を組み合わせる。本文の算出文字サイズが実際に約2倍になるまで待つ。CDPのpinch
zoomはレイアウトを変えないため使わない。ブラウザーのメニュー操作そのものやOSの表示倍率の検査とは区別する。

TeX検査はMathMLの`annotation`とコードを除いて行う。これらには原文を残す必要がある。代表原稿はABC391
F・ABC213 G、priority
queue・best-first列挙、区間モノイド集約と幅のfixtureに限定する。未改稿の全教材に未変換TeXがないと保証する検査ではない。数学的内容の検算は既存の`problem-editorial-mathematics.test.ts`が担当し、表示検査のために重複実行しない。

## 新教材fixture

`tests/fixtures/study-ux/build.ts`は、既存のオフライン小batch
fixtureで架空のABC467問題をprepare・執筆・validateし、一時コピーへ新しいUnitを登録する。新Unitは既存の`renderLearningUnitDocument`からdraftを作り、概念・成立条件・計算量をMarkdownで執筆する。問題の擬似コードと新Unitへの前提リンクも正本Markdownへ置く。

一時コピーの読書順と対象色へfixture
IDを登録し、通常の`loadFullPublicProjection`、問題/単元ページ、CSS、Astro設定を使う。出力routeだけを代表2ページへ限定する。ページ本体・CSS・生成HTMLをfixture用に補修しない。ビルドしたHTMLと同じビルドのassetsをブラウザーへ配信し、PCのライト・JS有効とスマホのダーク・JS無効で確認する。fixtureの出力は本番`dist`・catalog・Pagefindへ入らず、成功/失敗後に一時領域を削除する。

小batch契約の検証には既存corpusを一度読むため、通常ページのE2Eより時間がかかる。別の全件buildやブラウザー別の新教材buildを毎回重ねず、一つの検査内でbuildを再利用する。UI・教材・構造化データ・執筆skillの変更では`verify:fast`が新教材検査を選ぶ。共通生成器など未分類の変更では従来どおり広い検証になる。

## 実行と比較

通常のbuildを一度行い、同じ出力でリンク・既存画面・追加テストを確認する。

```sh
npm test -- tests/unit/study-ux-documents.test.ts tests/contract/verify-fast.test.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/study-readability.spec.ts tests/e2e/new-material.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/document-math.spec.ts tests/e2e/document-widths.spec.ts
```

比較対象は[既存の代表画面](study-ux-prototype.md)と同じ単元・長い単元・ABC391
Fである。この変更の前後で通常画面の文字組み・情報順は同一で、追加した検査条件だけが変わる。200%拡大のABC391
Fと新教材のPC/スマホ画像をPlaywright
reportへ添付する。固定画像との画素単位の比較は採用せず、検出対象をDOM・算出スタイル・操作結果で表す。フォント描画差で画像更新が必要になる負担を避ける一方、余白の微妙な変化や文章そのものの良さは画像と本文を読んで確認する。学習効率が向上したという主観評価や未計測の効果をテスト成功から主張しない。

失敗時は、テスト名・期待値・Playwrightのtrace/失敗画像を確認する。未実行や失敗をPRへ明記し、snapshot更新や検査除外で完了扱いにしない。
