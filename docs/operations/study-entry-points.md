# 学習を始める入口

[Issue #118](https://github.com/Fu-L/abc-textbook/issues/118)のホーム・分野別目次の改善。背景は[Study UX Epic #107](https://github.com/Fu-L/abc-textbook/issues/107)。収録情報よりも学び方の選択を先に置き、章から単元へ進むまでの説明を減らす。

## 同じ条件での画面比較

確認日:
2026-10-18。変更前は`748b314e26110a64431838f8c9c222059115e8cd`。本番設定`SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook`のbuildをローカルpreviewで確認した。Chromium、`locale=ja-JP`、`timezoneId=Asia/Tokyo`、device
scale factor 1、reduced
motion。両版とも空の使い捨てcontextでフォントを待ち、先頭・未展開の画面を撮影した。PCは1440×1000・light、スマホ相当は390×844・dark。同じ条件の列同士を比較する。

| 画面                   | 変更前                                                       | 変更後                                                      |
| ---------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| ホーム・PC             | [画像](study-entry-points/before-home-desktop-light.png)     | [画像](study-entry-points/after-home-desktop-light.png)     |
| ホーム・スマホ相当     | [画像](study-entry-points/before-home-mobile-dark.png)       | [画像](study-entry-points/after-home-mobile-dark.png)       |
| 分野別目次・PC         | [画像](study-entry-points/before-contents-desktop-light.png) | [画像](study-entry-points/after-contents-desktop-light.png) |
| 分野別目次・スマホ相当 | [画像](study-entry-points/before-contents-mobile-dark.png)   | [画像](study-entry-points/after-contents-mobile-dark.png)   |

## 表示の判断とトレードオフ

- ホームは「体系的に学ぶ」「問題から学ぶ」「復習する」を短い説明とともに縦に並べる。分野別目次・問題一覧・要復習へ直接進め、コンテスト索引も別の短い案内に残した。収録範囲・件数・初版の基準日時は末尾のnative
  detailsで開く。学び方の区別を強調する分、スマホ相当のページ全体は以前より少し長くなる。
- 分野別目次は最初の単元へのリンク、9章への移動、章の狙い、読書順の単元一覧とする。狙いは既存の章の`learningRationale`を使い、別の要約データを作らない。単元名と対象色を常時表示し、既存の長い読書案内・対象色の理由・概念上の親は章ごとに開ける。これらを比較するときは一度開く操作が必要になるが、通常の一覧では説明が繰り返されない。
- 同環境での目次全体の高さはPCで25,303→10,598 CSS px、スマホ相当で42,087→16,202 CSS
  px。これは未展開時の表示量の観測であり、学習効率の評価値ではない。
- 本文・分類・9章と全単元の掲載順・既存の章anchor・リンク先・学習記録形式は変更しない。既存本文や生成成果物をUIのために再生成せず、追加の依存や入口用のJSも導入しない。

## 読み取りと操作の確認

ホームから3用途を選び、目次から最初の単元と問題への案内へ進んだ。全章のanchor、全単元のリンク順、開閉欄に残した説明を確認した。使い捨てcontextで問題を「要復習」に保存し、ホームの入口から再び問題へ戻れた。両ページの旧リンク先・既存IDの集合も変更後に残っている。

JS無効・light/dark・390/720/1440pxで入口、キーボードによるdetailsの開閉とリンク移動、横方向のはみ出しを確認するE2Eを追加した。720pxはPCの200%相当のレイアウト幅であり、実ブラウザーのズーム操作や実機スマホの検証ではない。共通目次の既存E2Eは320pxも確認する。両ページをaxeでも検査し、本番subpathで静的build・内部リンクを確認した。読者本人の試用・主観評価、学習効果の測定は行っていない。
