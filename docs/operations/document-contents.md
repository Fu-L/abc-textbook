# 本文のページ内目次

[Issue #117](https://github.com/Fu-L/abc-textbook/issues/117)、背景は[Study UX #107](https://github.com/Fu-L/abc-textbook/issues/107)。

## 配置と操作

問題解説と単元本文で、読む順にh2〜h6の見出しを参照する。3個未満なら目次を出さない。分類・前提・執筆情報などの開閉欄は既存の導線から参照し、本文の目次に重ねない。小節は字下げする。原稿や分類を変更せず、表示後の見出しを共通の`DocumentReading.astro`で読む。試作だけの目次は削除し、通常・試作の両方で同じ表示を使う。

80rem以上の画面では本文右の余白へ目次を置く。長い目次は枠内でスクロールできる。章と単元の目次は左に残り、役割と名前を区別する。本文を細くする代わりに単元ページの外枠を広げ、本文の最大44remは保つ。画面が狭いときは左右の目次を開閉式にして本文幅を優先する。

狭い画面では「このページの目次」の一行だけが本文とともに残る。深い節からも一度開いて移動先を選べる。JSが使える場合は選択後に閉じる。JS無効時もnative
detailsをTab・Enter・Spaceで開閉でき、開いた目次はスクロールで画面外へ退くため、移動先の本文を覆わない。同一ページ内で目次が開いたままになるので、再選択にはブラウザの戻る、または冒頭へ戻って操作する。PCのJS無効時も目次は手で開く。

見出しの`#`から節へのリンクを取得できる。PCではhover・focus時、タッチ画面では常時表示し、通常の読書で主張しすぎないようにする。リンクと目次には名前を付け、リンク先の見出しはキーボードfocusを受け取れる。URLは既存のAstroのslugを使い、重複見出しのsuffixも維持する。クリックの履歴・戻る/進む・直接リンクはブラウザに任せ、スクロール監視・URL書換え・永続状態・依存パッケージは加えない。

## 代表画面とトレードオフ

Beforeはmain `50dc4239`、Afterは今回の通常build。macOS arm64・Chromium・JS有効・device scale factor
1、公開subpath `/abc-textbook/`、同じ画面幅・配色・開始位置で比較する。

| 条件                                   | Before                                                       | After                                                            |
| -------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| ABC391 F、1440×1000・light・冒頭       | [本文のみ](document-contents/before-problem-desktop.png)     | [本文と右目次](document-contents/after-problem-desktop.png)      |
| ABC391 F、390×844・light・冒頭         | [旧冒頭](document-contents/before-problem-mobile.png)        | [一行の目次](document-contents/after-problem-mobile.png)         |
| 区間monoid要約、1440×1000・light・冒頭 | [章目次と本文](document-contents/before-unit-desktop.png)    | [章・本文・ページ目次](document-contents/after-unit-desktop.png) |
| 同単元、390×844・dark・`#考え方`       | [見出しへ直接移動](document-contents/before-unit-mobile.png) | [目次を再び開ける位置](document-contents/after-unit-mobile.png)  |

PCでは移動先と本文を同時に見られる一方、ページ全体の横幅は増える。小節の多い解説では目次自体も長くなるので、高さを制限して独立にスクロールする。スマホでは一行とその余白が増えるが、ABC391
Fの導入文は最初の画面内に収まる。目次を開く間は本文開始位置が下がるため、読むときは閉じる。本文の見出しを目次の直下へ横一列で再掲せず、単一の目次を画面幅に合わせて配置する。

これはCodexによる表示・操作確認であり、読者の学習効率を測定した結果ではない。教材の意味・問題順・ID・既存URLとanchor・学習記録を保持する。

## 検証と再撮影

`tests/unit/document-contents.test.ts`は見出しの順・階層、重複slug、数式・コードを含む見出し、折り畳んだ情報の除外を確認する。`tests/e2e/document-contents.spec.ts`は直接リンク、戻る/進む、Tab・Enter・Space、明暗・JS有無、320/390/720/1440
CSS
pxでの表示とfocusの重なりを確認する。720pxは1440pxの200%ズーム相当のレイアウト幅であり、実ズーム設定とは区別する。関連する既存の問題・単元・章目次・アクセシビリティ・検索と数式/コードのE2Eも同じ本番subpathのbuildで確認する。

```sh
npm run check
npm run schema:check
npm test -- tests/unit/document-contents.test.ts tests/unit/public-document.test.ts tests/unit/problem-reading.test.ts tests/unit/unit-reading.test.ts tests/unit/study-preview.test.ts tests/contract/verify-fast.test.ts tests/contract/ui-routes.test.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build:checked
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/document-contents.spec.ts tests/e2e/problem-reading.spec.ts tests/e2e/unit-reading.spec.ts tests/e2e/textbook-navigation.spec.ts tests/e2e/accessibility.spec.ts
```

画像を撮り直す場合だけ、上表の条件で各Git版を別々にbuildして撮影する。既存比較画像を全件更新する必要はない。本文・URL/anchorの保持は変更前後のbuild集合比較と内部リンク検証を使い、実行結果・未実施範囲はPR本文へまとめる。
