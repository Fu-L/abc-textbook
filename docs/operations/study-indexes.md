# 問題検索・タグ・コンテスト索引

[Issue #119](https://github.com/Fu-L/abc-textbook/issues/119)、背景は[Study UX #107](https://github.com/Fu-L/abc-textbook/issues/107)。問題を探して比較し、解説へ進むための表示改善。

## 表示の判断

- 問題検索は問題の条件をまとめ、コンテストと問題記号を横に並べる。狭い画面では長いタグ名・単元名に一行を使う。学習記録の条件は開閉式とし、URLで学習状況・要復習を指定した場合は初めから開く。編集途中の条件をまだ適用していないことを明示する。結果は出題番号と題名の2列とし、番号を括弧内で繰り返さない。既存のquery値・条件の意味・適用と解除の操作は維持する。
- タグ索引は題名・定義の間隔を詰め、213件の定義を省略せず読めるようにした。タグ詳細は定義・扱う単元・未知問からの手掛かりを先に置く。分類・直接の前提・学習成果は問題一覧の前のnative
  detailsに保持する。代表問題と関連問題の表示は#115の共通部品を使う。
- コンテスト表は題名を解説へのリンクとし、掲載状態を控えめな文字で残す。各問題の「学習のつながり」に解説本文anchor・単元・全主タグ・補助タグ・類題のリンクを保持する。同じ分類ラベルをリンクごとに繰り返さず、役割ごとにまとめる。公式問題なしの理由はcaptionと読み上げ用テキストに残す。未収録・確認不能・取り下げなどの理由は従来どおり表示する。
- 公式コンテストへのリンクは短い番号とし、列幅を確保して一文字ずつ折り返される状態を解消した。動的な列順・公式の欠番・掲載状態は既存catalogを使う。表と同じ全問題・リンクを持つ縦の代替表示は下部で開ける。既存の表・代替表示のanchorは維持する。

学習記録・分類・類題を比較するときは開く操作が増える。未展開の表と縦リストを続けて全件表示する重複は減るが、全問題とリンクはHTML内に保持するためDOM全体が小さくなる方式ではない。追加の依存・仮想リスト・ページ分割は導入していない。

## 代表画面の比較

確認日:
2026-10-18。Beforeは`3e69e15ef56db71f6f0bbfb2ee9b1b095abe4926`と同じ内容の作業開始時build。両版とも本番subpath
`/abc-textbook/`、macOS arm64、Playwright Chromium、`locale=ja-JP`、`timezoneId=Asia/Tokyo`、device
scale factor 1、reduced
motion。空の使い捨てcontextで先頭・未展開、フォントと検索フォームの初期化を待って撮影した。

| 画面                             | Before                                            | After                                            |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| 問題検索・1440×1000・light       | [画像](study-indexes/before-problems-desktop.png) | [画像](study-indexes/after-problems-desktop.png) |
| 問題検索・390×844・dark          | [画像](study-indexes/before-problems-mobile.png)  | [画像](study-indexes/after-problems-mobile.png)  |
| タグ索引・1440×1000・light       | [画像](study-indexes/before-tags-desktop.png)     | [画像](study-indexes/after-tags-desktop.png)     |
| タグ索引・390×844・dark          | [画像](study-indexes/before-tags-mobile.png)      | [画像](study-indexes/after-tags-mobile.png)      |
| コンテスト索引・1440×1000・light | [画像](study-indexes/before-contests-desktop.png) | [画像](study-indexes/after-contests-desktop.png) |
| コンテスト索引・390×844・dark    | [画像](study-indexes/before-contests-mobile.png)  | [画像](study-indexes/after-contests-mobile.png)  |

変更前の主要3索引のリンク先・ID集合を一時領域に取り出し、変更後にも含まれることを比較した。教材Markdown・構造化データ・学習記録の保存形式には変更を加えていない。

## 操作・表示と性能の確認

E2Eは複合条件を適用し、reload後のURL復元、編集と適用の区別、0件、全解除、Enterで問題へ移る操作を確認する。使い捨ての学習記録で修了・要復習の絞り込みを確認し、JS無効では全868問の静的リンク・213タグの定義と開閉・縦の代替表示を確認する。320・390・720・1440
CSS
px、light/dark、検索・タグ索引のaxe検査、既存Pagefind・コンテスト・学習導線のE2Eを使う。720pxは200%相当のレイアウト幅であり、実ブラウザーのズームや実機スマホの試験ではない。

性能はローカルpreviewのDOM数・HTML量・表示の高さと、検索の適用時間を観測する。コンテスト表のcell参照は繰り返しの全件検索をMap参照へ変更し、検索フォームへ渡す単元のデータはID・題名・coverageだけに絞る。開閉で見えなくした本文もDOMに存在する。配信回線や低速端末の性能、読者本人の主観・学習効率は測定していない。

| PCの観測値                               |    Before |     After |
| ---------------------------------------- | --------: | --------: |
| 問題検索のDOM要素数                      |     2,535 |     4,277 |
| 問題検索のHTML bytes                     | 2,444,625 | 2,263,185 |
| タグ索引の高さ（CSS px）                 |    33,484 |    25,787 |
| コンテスト索引のDOM要素数                |    32,209 |    31,524 |
| コンテスト索引のHTML bytes               | 1,468,565 | 1,967,848 |
| コンテスト索引の未展開時の高さ（CSS px） |   471,692 |    34,280 |

検索結果は出題番号と題名を分けるspanが増え、行間と区切りを取った結果、全件表示の高さは33,855→46,546
CSS
pxへ増えた。比較のしやすさと密度のトレードオフである。コンテスト索引のDOM数はほぼ同じで、開閉要素・識別できるリンク名などにより非圧縮HTML量は増えた。見える量の削減を通信量・DOM削減と同一視しない。

最終buildで各索引を5回開いた`domContentLoadedEventEnd`の中央値は、検索49.9ms、タグ12.9ms、コンテスト93.3ms。検索868件から「Power
Pair」1件を適用したイベントから次の描画frameまでの5回の中央値は7.7msだった。ローカルの観測値であり、変更前後の速度改善や実配信での上限の主張には使わない。

型・lint・書式・schema、対象67件のunit/contract/integration、Chromiumの対象30件、本番subpathのbuildと内部リンク4,658件を確認した。追加batch専用と旧build指定時だけのE2E計2件は今回の条件ではskipする。
