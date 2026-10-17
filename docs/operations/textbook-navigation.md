# 章・単元のナビゲーション

[Issue #116](https://github.com/Fu-L/abc-textbook/issues/116)、背景は[Study UX #107](https://github.com/Fu-L/abc-textbook/issues/107)。

## 配置と読む順

PCでは本文横の目次で現在章だけを開き、現在単元を太字・下線・背景・左の線で示す。章番号と字下げで章と単元を区別する。対象色は単元本文と分野別目次に残し、移動用の目次からは省く。長いタイトルは折り返す。

目次は画面内に留まり、長い章はその枠だけをスクロールする。JSが使える場合は現在単元を枠内へ戻すが、本文のスクロール位置は動かさない。前のページ・次のページには題名を添え、本文末尾から読み進められる。パンくずから掲載章と分野別目次に戻れる。分野別目次の冒頭には9章へのページ内リンクを置く。

64rem未満では目次を冒頭の一行へ折り畳み、本文の横幅を確保する。開いた枠の高さは画面の60%以内で、本文を読むときは閉じられる。native
detailsを使うため、JS無効時もTab・Enter・Spaceで開閉し、すべての章・単元へ移動できる。JS無効時のPCも最初は閉じる。PCで自動展開する小さな補助スクリプトとのトレードオフである。

掲載章・単元順・前後移動の正本は`src/lib/taxonomy/textbook-order.ts`。読書順は概念上の親や必須前提とは別であり、意味階層による入れ子や自動ソートはしない。概念上の親・直接前提は既存の単元情報で参照する。教材Markdown・分類・問題順・URL・学習記録を変更せず、`#unit-contents`も維持する。

## 代表画面とトレードオフ

Beforeはmain `57998d5e` の通常build、Afterは今回の通常build。ともにmacOS
arm64・Chromium・本番subpath `/abc-textbook/`、device scale factor
1。優先度付き列挙のページ先頭を比較する。BeforeはJS無効、AfterはJS有効だが本文は共通で、目次のPC初期展開だけが異なる。

| 条件             | Before                                                   | After                                                 |
| ---------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| 1440×1000・light | [本文末尾の目次](textbook-navigation/before-desktop.png) | [本文横の目次](textbook-navigation/after-desktop.png) |
| 390×844・light   | [旧冒頭](textbook-navigation/before-mobile.png)          | [冒頭の開閉欄](textbook-navigation/after-mobile.png)  |

[390×844・darkの展開状態](textbook-navigation/after-mobile-open.png)も確認する。PCでは本文の44remの行幅を維持して全体枠を広げるため、本文と移動先を一緒に確認できる。目次で占める横幅は増える。スマホでは開閉欄の一行が増える一方、本文末尾まで行かずに他の単元へ移れる。全章を一度に通覧するには各章の展開が必要で、分野別目次からも一覧を参照できる。装飾・アニメーション・依存パッケージ・永続状態は追加しない。

Codexによる表示・操作確認であり、実読者の学習効率を測定した結果ではない。

## 検証

```sh
npm run check
npm run schema:check
npm test -- tests/unit/textbook-navigation.test.ts tests/contract/verify-fast.test.ts tests/contract/ui-routes.test.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build:checked
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/textbook-navigation.spec.ts tests/e2e/unit-reading.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/search.spec.ts
```

画像を撮り直すときだけ`TEXTBOOK_NAV_CAPTURE=1`をE2Eへ渡す。320/390/720/1440 CSS
px・明暗・JS無効・キーボード・旧fragment・最長の章・章境界と先頭末尾を確認する。720pxは1440px画面の200%ズームに相当するレイアウト幅であり、ブラウザー設定による実ズームとは区別する。実行結果・追加確認・未実施範囲はPRへまとめる。
