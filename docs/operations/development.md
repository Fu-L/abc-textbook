# Local development

現行の更新方針と検証範囲は[Codexの更新マニュアル](update-manual.md)と
[Constitution 4.0.0](../../.specify/memory/constitution.md)を参照する。以下は既存環境・実装の説明であり、全コマンド・全ブラウザーの実行を通常更新の必須条件としない。CIの変更選択は以下の分類で確認する。

## 変更範囲に応じたCI検証

`Verify (release baseline)`はNode 26.12.1/npm 11.21.1の単一環境で、PRのmerge-base、main
pushの前回SHAとの差から検査を選ぶ。文書だけでもjobを起動し、書式・ローカルリンク・見出し参照・feature選択を検証する。

| 変更                                                                       | 検査                                                                                                                 |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| AGENTS/README、憲章・テンプレート・feature選択、operations/specsのMarkdown | 変更文書の書式・ローカル参照のみ                                                                                     |
| 既知のoperations比較画像（限定ディレクトリ内のPNG）                        | 画像の存在と非公開文書からの画像参照。PNGはPrettierへ渡さず、build・E2E・配信は不要                                  |
| 公開本文                                                                   | 本文parser・実projection・内部参照・代表原稿のテスト、build、内部リンク、Chromiumのprojection・新教材・ページ目次E2E |
| `src/content/`のデータ、教科書順                                           | schema、実データのID/参照/3DAG/配置/順序/metrics/履歴・訂正テスト、build、リンク、projection/search/記録・新教材E2E  |
| UI/学習記録                                                                | lint・型、対象挙動のテスト、build、リンク、Chromiumの対象E2E。UI変更は読書表示・拡大・新教材も確認                   |
| 解説執筆skill                                                              | lint・型、skill/本文/執筆例/実行コードのcontractと利用側テスト、build、リンク、新教材E2E                             |
| 下表の既知の本文・読書表示テスト（追加・修正）                             | lint・型、変更テスト自身と対応する本文/表示検証、build・リンク、対象Chromium E2E                                     |
| 共通コード・schema・依存・workflow・未知path、差分取得不能                 | schema・lint・型、既存Vitest全体、build、リンク、Chromium全体                                                        |

複数分類は検査の和集合を実行する。renameは削除と追加に分解し、両pathを判定する。本文・データの削除も検査対象にする。非公開文書・比較PNGの削除、空差分、不正なGit出力は広い検査へ戻る。削除・renameでも文書の比較PNG参照を確認する。検査の失敗・signalは非zeroで後続を止め、cancelを成功へ置き換えない。

`src/content/docs/learn/`の本文変更では`tests/integration/full-learning-path.test.ts`も選ぶ。「問題一覧」「関連問題」のリンクの所属・順序を補足文の改稿と区別して検査する。問題本文だけの変更の検証範囲は維持する。

比較PNGの許可配置は[更新マニュアル](update-manual.md#3-変更に必要な検証を選ぶ)を参照する。runnerと文書checkerは`.github/actions/nonpublic-docs/paths.mjs`の分類を共用し、未知のディレクトリ・拡張子は広い検査へ戻す。Markdownの画像記法もローカル参照検査に含め、画像だけの差分でも既知の非公開Markdownから比較PNGへの参照を調べる。mainは画像だけのpushでも未配信差分を合流するため、未配信の教材・共通変更に必要な検査と配信は残る。

この分類改善自身のPRはrunner変更により広い検査となる。文書経路の所要時間は自然に発生した画像付き文書変更のActionsで確認し、計測専用の画像変更・runは作らない。

### 既知の本文・読書表示テストの対応表

次の9ファイルの追加・修正だけを明示的に対応付ける。各行は変更したテスト自身を含み、すべての行で既存の本文検証5本（`full-public-projection.test.ts`、`public-document.test.ts`、`problem-content-projection.test.ts`、`problem-authoring-document.test.ts`、`study-ux-documents.test.ts`）も実行する。対応表は`scripts/verify/runner.ts`の`readingRegressionByPath`で管理し、任意の`tests/`を依存解析して除外する仕組みは作らない。

| 変更するテスト（repository rootからのpath）                                                                             | 共通5本へ加えるVitest                                                                                           | Chromium E2E                                                                 |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `tests/contract/content-readability.test.ts`、`tests/unit/problem-reading.test.ts`、`tests/e2e/problem-reading.spec.ts` | `tests/contract/content-readability.test.ts`、`tests/unit/problem-reading.test.ts`                              | `tests/e2e/problem-reading.spec.ts`、`tests/e2e/document-contents.spec.ts`   |
| `tests/unit/unit-reading.test.ts`、`tests/e2e/unit-reading.spec.ts`                                                     | `tests/unit/unit-reading.test.ts`                                                                               | `tests/e2e/unit-reading.spec.ts`、`tests/e2e/document-contents.spec.ts`      |
| `tests/unit/document-contents.test.ts`、`tests/e2e/document-contents.spec.ts`                                           | `tests/unit/document-contents.test.ts`、`tests/unit/problem-reading.test.ts`、`tests/unit/unit-reading.test.ts` | `tests/e2e/document-contents.spec.ts`                                        |
| `tests/unit/study-ux-documents.test.ts`、`tests/e2e/study-readability.spec.ts`                                          | 共通5本のみ                                                                                                     | `tests/e2e/study-readability.spec.ts`、`tests/e2e/document-contents.spec.ts` |

全行でlint・format・型検査を行い、同じrunの`build:checked`の成果物をリンクとE2Eへ渡す。CIではChromiumだけを準備する。本文を伴う場合は従来のprojection・新教材E2Eも和集合で残す。公開本文だけの変更でも見出しの編集を取りこぼさないよう、`document-contents.spec.ts`を選ぶ。目次と最終本文のanchor一致、JS無効・狭い画面・キーボードの既存検出は維持する。

対応済みテストの削除・renameは広い検査に戻す。renameは両pathを判定し、削除したファイルを個別実行の引数に残さない。`tests/fixtures/`、`tests/setup/`、`tests/e2e/fixtures.ts`、Playwright/Vitest設定、表にないテスト（共通検証5本のうち表の入力にないものも含む）、schema・共通処理・依存・workflowを単独または混在で変更した場合も広い検査を維持する。mainの未配信差分も合流する。

たとえば本文と`content-readability.test.ts`・`problem-reading.spec.ts`・`document-contents.spec.ts`だけの差分は、Vitest
9本とE2E 4本になる。変更前はテストpathが未知のため全量だった。PR
#137は`src/lib/study-preview/manuscripts`等の共通変更も含むため、同PR全体は今回の変更後も全量になる。実時間は自然な同種・同規模の教材更新のActionsで比較し、このrunner変更自身の全量runを選択改善の短縮実績へ流用しない。

新教材E2Eの隔離buildはPlaywrightのglobal
setupでworker開始前に一度準備し、同runのworker・retryで共有する。`--list --reporter=json`で実際の選択に新教材が含まれるときだけ準備するので、他specだけの実行では省略する。単独の`new-material.spec.ts`にも手動準備は不要。終了・失敗時は一時candidate/project/distを削除し、本番`dist`へ合成教材を入れない。準備段階の時間・成否は`New material ...`ログ、画面検査はPlaywrightの結果で確認する。実行例・cleanup・計測境界は[更新マニュアル](update-manual.md#3-変更に必要な検証を選ぶ)を参照する。

教材追加は[共通フローと3つの完了条件](update-manual.md#新しい教材を追加するときの共通フロー)に従う。既存表示を保つこと、新規原稿の内容をCodexが確認すること、新教材へ共通デザインが適用されることを混同しない。#120の`explanation-writing.test.ts`はskill変更で、#122の`new-material.spec.ts`は本文・データ・UI・skill変更で自動選択する。執筆方針・テンプレートを変更したときは`explanation-writing.spec.ts`も手動で加える。各テストの範囲と限界は[執筆例](explanation-writing.md)と[表示回帰](study-ux-regressions.md)を参照する。

学習記録の変更には保存・日時・backupのテストに加え、既存の`full-public-projection.test.ts`と`full-projection.spec.ts`を選ぶ。`src/lib/learning-records/filter.ts`だけの変更でも、葉単元・親単元・章の配下にある問題を問題一覧と復習一覧で絞り込む挙動を検証する。問題の主配置単元だけに絞る回帰を検出し、複数分類で選ばれても同じテストは重複実行しない。

CIは既存文書checkerのfixtureも確認する。変更選択のcontractはrunner・workflow等の変更で選ぶVitest全体に含め、同じrunで重複実行しない。`scripts/verify/runner.ts`が分類を担当し、非公開文書の書式・参照検査は既存`.github/actions/nonpublic-docs/check.mjs --files ...`を再利用する。通常経路にpreview凍結・全shard再join・初版監査・release/review証跡照合・一律の数学回帰は含めない。関係する教材変更ではCodexが公式根拠・証明・境界条件を確認し、既存`docs/verification/bootstrap/pr65*-mathematical-checks.py`の該当回帰を実行する。

旧4jobから単一baselineへの切替は完了している。実設定の確認結果は下の実測節、再切替と復旧順は[更新マニュアル](update-manual.md#ci必須設定の切替と復旧)を参照する。

## Actionsで検証時間を読む

`Verify changed scope`内の`verify:fast`は、比較元・比較先SHA、mainで合流した未配信差分、選択したstep
IDとコマンド・全引数をログへ出す。`Verification planned`は実行予定であり、テストの絞り込みはその`args`で確認する。Vitestのファイル指定がなければ全体、E2Eが`--project=chromium`だけならChromium全体である。`Verification broad scope reason`は`--all`、差分取得不能、空差分、非公開文書の削除、不明status、共通処理・設定または未知pathの理由を示す。差分取得不能時は直前の`Verification comparison unavailable`も確認する。

実行したstepだけに`Verification started`と`Verification finished`を出す。`at`はUTCの開始・終了日時、`elapsed_ms`は単調時計による経過時間であり、時計の補正に影響されない。終了行は`result=passed/failed/error`と、通常終了なら`native_exit_code`を示す。signal・実行不能は`error`の時間に続いて理由を出し、後続を止める。予定行だけのstepを成功と数えない。Actionsによる強制終了で終了行を残せない場合も成功とは扱わない。

比較の主指標は、Actionsの既存step時刻で**`Set up Node.js 26.12.1`の開始から`Verify changed scope`の完了まで**のwall
timeを取る。queue・checkout・run
identity取得、検証後のartifact保存・cleanup・deployは除く。runnerの処理別時間は依存準備・npm選択・`npm ci`・文書checker自身の検査を含まず、この主指標と境界が異なる。Vitest内の並列ファイル時間や処理別時間を足して全体時間や短縮量を求めない。

ログ追加自身のPRはrunner変更により広い検査となる。計測前後のオーバーヘッドは同じ検査集合・環境で区別して報告し、処理時間の変動をログの費用や高速化の効果と決めつけない。#142の28分01秒は広い検査の単独参考値であり、通常更新5件の中央値ではない。測定結果はActionsログとPR本文に記し、計測台帳を追加しない。

小batchの検証は`update-prepare.test.ts`・`update-validation.test.ts`・`full-public-projection.test.ts`を使う。実868問から作る1
Contestと連続小batchの編集・再実行差分0、索引の実ファイル照合、異常時のcandidate不変を確認する。validate成功経路の全量loaderはbaseと一時candidateの各1回で、索引書込み後は共通の派生値照合だけを行う。正本を変更しない区間での境界は[小batch手順](update-manual.md#小batchの編集と再実行002--pr-09)を参照する。fixture準備にはsuiteごとの`createSmallBatchFixture`を使い、現行base・範囲別の合成取得・執筆素材だけを再利用する。各入力の入れ子とcandidateは複製し、実CLIの読込や判定は毎回行う。`small-batch-fixture.test.ts`で入力とファイルの汚染を検出し、異常群は執筆済み開始点を`copySmallBatchCandidate`でケースごとに複製する。helperの変更時は新教材E2Eも実行する。具体的なコマンド・計測範囲は[更新マニュアル](update-manual.md#3-変更に必要な検証を選ぶ)を参照する。

処理時間を比較するときは同じfixture・ケース・並行度・環境を用い、validator改善とfixture準備の改善を区別する。ファイル別時間は並列なので合算せず、Actionsのtest
step・依存準備から検証完了までのwall timeと分けて報告する。

### 改善後の実測とSC-005（2026-10-19）

[Issue #149](https://github.com/Fu-L/abc-textbook/issues/149)、親は[CI改善 #142](https://github.com/Fu-L/abc-textbook/issues/142)。**SC-005は未達・比較母集団不足**。通常本文訂正と問題追加について、同種・同規模・同じ検査条件の成功runを前後各5件特定できていないため、中央値・短縮率は算出しない。T006の旧単独基準16分48秒、PR
#106の共通処理5件の参考中央値17分45秒、広い検査の28分01秒は過去の参考値として保持する。

2026-10-19 10:30 UTC時点のCI workflow直近100件（2026-10-09〜19）を確認した。先行改善#143〜#148はPR
#150〜#155でmainへ反映済み。#138の開始以降36件の内訳は成功15件、失敗15件、cancel
5件、進行中1件である。成功は文書のみPR 1件、共通処理PR 8件（#155の途中版1件を含む）、共通処理main
6件。失敗・cancel・途中版を正常な独立更新の数合わせに使わない。残る64件は旧運用移行・Study
UX導入期で、現行条件の通常更新との比較から除外する。#137も本文3問に比較画像・共通試作原稿・表示テストを混在させており、純粋な本文訂正に数えない。

全改善のmain反映後は#155
mainの進行中1件だけで、成功は0件。通常本文訂正・問題追加はそれぞれ、比較に使える移行前5件を特定できず、改善後も0/5件である。どちらの分類も前後各5件が欠けている。

| 分類             | 観測できた成功と比較からの除外理由                                               | 次に使う自然な更新                                                         |
| ---------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 非公開文書のみ   | #139 PRの1件。通常教材更新の時間目標から除外。#144後の画像だけの通常変更は未観測 | 運用文書・比較画像の必要な修正                                             |
| 公開本文訂正     | 上記36件で0件。移行前後各5件の組は未成立                                         | #140の本文だけ、または同じ対応済み表示テストを伴う同規模の改稿を別々に観測 |
| 問題追加         | 上記36件で0件。取得CLI・合成fixture成功は実追加ではない                          | #141の同規模の1 Contest追加同士。連続小batchとは分ける                     |
| UI               | 上記36件に単独の成功なし。以前のStudy UX導入runは通常本文訂正へ混ぜない          | 共通表示の必要な変更として別集計                                           |
| schema・共通処理 | 成功PR 8件・main 6件。採用改善自体の全量検査であり、教材更新から除外             | 必要な共通変更だけを別集計                                                 |

以下は採用改善の代表成功runであり、前後5件の比較集団ではない。全行ともubuntu-latest、Node
24.18.0/npm
11.16.0。広い検査は`docs/lint/format/schema/check/test/build/links/browsers/e2e`で、Vitestは全体、E2EはChromium全体を選択し全stepが成功した。#143〜#146は83
test file、#147は84、#148最終版は85へ増えており、同じ検査量とも扱わない。

SHAはrun APIのhead（PRのbranch先端）とログの検証SHA（PRのmerge
ref）を区別し、12桁で示す。時刻はUTC、境界はNode setup開始→Verify changed scope完了。PR
#150〜#154と時間が確定したmain行は10月18日、#155 PRと進行中mainは10月19日である。

| 改善・分類             | PR run / head → 検証SHA / 時刻 / wall time                                                                                                    | main run / SHA / 時刻 / wall time                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| #143・共通runner       | [39122172105](https://github.com/Fu-L/abc-textbook/actions/runs/39122172105) / `5914401a5b67` → `13394c4251f4` / 11:10:43→11:38:06 / 27分23秒 | [39125233176](https://github.com/Fu-L/abc-textbook/actions/runs/39125233176) / `ea7ffefac6e0` / 11:56:31→12:24:01 / 27分30秒                 |
| #144・共通文書checker  | [39127707186](https://github.com/Fu-L/abc-textbook/actions/runs/39127707186) / `e5a4e428c7d6` → `7183736683f0` / 12:32:42→12:53:45 / 21分03秒 | [39129781932](https://github.com/Fu-L/abc-textbook/actions/runs/39129781932) / `82afb0c6f56f` / 13:02:15→13:30:32 / 28分17秒                 |
| #145・共通選択処理     | [39130205000](https://github.com/Fu-L/abc-textbook/actions/runs/39130205000) / `a976c91e489f` → `ef5db373096b` / 13:08:12→13:26:22 / 18分10秒 | [39131932148](https://github.com/Fu-L/abc-textbook/actions/runs/39131932148) / `c6cca7f223ad` / 13:31:52→13:52:52 / 21分00秒                 |
| #146・共通validator    | [39133238510](https://github.com/Fu-L/abc-textbook/actions/runs/39133238510) / `12869f3ae2f3` → `366865304148` / 13:49:40→14:06:53 / 17分13秒 | [39135627434](https://github.com/Fu-L/abc-textbook/actions/runs/39135627434) / `4c1c9e2b38cd` / 14:21:46→14:48:56 / 27分10秒                 |
| #147・共有fixture      | [39137364143](https://github.com/Fu-L/abc-textbook/actions/runs/39137364143) / `8b8a475392ca` → `45a370e6b708` / 14:45:14→15:05:52 / 20分38秒 | [39141352337](https://github.com/Fu-L/abc-textbook/actions/runs/39141352337) / `92fc6333f337` / 15:38:07→16:05:44 / 27分37秒                 |
| #148・Playwright setup | [39217083282](https://github.com/Fu-L/abc-textbook/actions/runs/39217083282) / `189315356cc4` → `ac80e005f658` / 07:36:42→08:01:39 / 24分57秒 | [39237774186](https://github.com/Fu-L/abc-textbook/actions/runs/39237774186) / `bd08f810f81f` / 観測時は進行中。検証・配信成功と時間は未確定 |

文書のみの[#139 PR run 39112871961](https://github.com/Fu-L/abc-textbook/actions/runs/39112871961)はhead
`c5ac5aafe9cb`、10月18日08:48:39→08:48:56の17秒で、文書checkerだけを実行した。一方、同PRの[main run 39113203408](https://github.com/Fu-L/abc-textbook/actions/runs/39113203408)（`df812430e569`）は09:09:01→09:37:02の28分01秒である。未配信の#138共通変更を合流した広い検査なので、文書PRとmainを同一分類で比較しない。#150以降のmainもログの`includes undeployed changes since`と比較SHAを確認し、PRとの差分を区別した。

#148最終PRでは新教材のprepare/author/validate 54.313秒、copy/generate 14.251秒、隔離Astro build
32.658秒、一覧取得等を含むsetup全体103.352秒を観測した。runnerのE2E全体350.737秒にはsetup・画面検査・cleanupを含み、主計測24分57秒にも含まれる。画面検査の30秒制限だけを全体所要時間と報告しない。主計測から除くのは検証後のartifact保存・job
cleanup・deployであり、必須検証内のfixture cleanupは含む。

残る負担は、同runのVitest全体924.811秒、`update-validation.test.ts`
791.534秒、`update-prepare.test.ts` 308.502秒、`catalog-cli.test.ts`
302.710秒、`full-public-projection.test.ts`
240.257秒である。ファイル時間は並列なので加算しない。#147後mainでもVitest全体1086.876秒を要し、改善後の全量runが10分以内になったとは確認できない。次の調査候補は小batchの実validator・candidateコピーとcatalog
CLIの正本/旧版互換検証であり、fixture準備・実検証・runner差の切分けが先である。この文書PRでは追加最適化を採用せず、必要な不正入力拒否や旧版互換の検査を残す。

実branch protectionを同日に読戻し、requiredは`Verify (release baseline)`だけ、`strict=true`、Actions
app ID `15368`を確認した。有効main rulesetにstatus
checkの重複指定はなく、Pages環境にreviewer要求もない。workflowの成功baseline依存、build→同じdistでリンク/E2E→artifact保存→同じartifactの配信、保存前と配信直前のmain
SHA確認を維持している。#147 mainの成功job/logではartifact
`github-pages-92fc6333f337787760d806385eeb9e2e0f593e96-39141352337-1`（ID
`12141999505`）の保存・配信一致と両SHA確認の成功を確認した。公開origin/base
path、IndexedDB/backupの実装にこの改善群の変更はない。#148 mainの進行中状態を実配信成功で補わない。

今後は#140/#141で自然に発生した正常更新を分類し、前後各5件と同じ検査条件が揃った分類だけで中央値10分以下・50%以上短縮の両方を判定する。文書だけ、UI、schema/共通処理、PRとmain、本文のみと表示テスト混在、1
Contestと小catch-upは混ぜない。移行前5件が特定できなければ改善後5件が揃っても短縮率は未判定とする。数合わせの教材変更・再実行は行わず、#149の不足報告完了を#142や002全体の達成と扱わない。教材更新はこの計測不足で止めない。

## Toolchain policy

依存パッケージは`package-lock.json`で完全版を固定します。Node.jsとnpmは、通常開発で利用できる対応範囲と、リリース検証で再現する基準版を分けて管理します。

| Tool       | Supported development range      | Release baseline |
| ---------- | -------------------------------- | ---------------- |
| Node.js    | `>=26.12.1 <27.0.0` (26 Current) | `26.12.1`        |
| npm        | `>=11.21.1 <12.0.0`              | `11.21.1`        |
| TypeScript | lockfile exact                   | `6.0.3`          |
| Astro      | lockfile exact                   | `7.4.2`          |
| Starlight  | lockfile exact                   | `0.41.3`         |
| Zod        | lockfile exact                   | `4.4.3`          |
| Vitest     | lockfile exact                   | `4.1.12`         |
| Playwright | lockfile exact                   | `1.61.1`         |
| ESLint     | lockfile exact                   | `10.7.0`         |
| Prettier   | lockfile exact                   | `3.9.5`          |
| Pagefind   | lockfile exact                   | `1.5.2`          |

`.nvmrc`と`packageManager`はそれぞれリリース基準のNode.js/npmを示します。対応範囲内のpatch更新は通常開発で許可され、`devEngines`は範囲外の場合だけ警告します。依存版を変更するときは、通常どおりmanifestと`package-lock.json`を同じ変更で更新します。

2026-10-22にNode.jsの基準版を26.12.1へ更新しました。[公式のセキュリティリリース](https://nodejs.org/en/blog/release/v26.12.1/)で修正を確認しています。この時点の26系はCurrentです。両workflowは`node-version-file: .nvmrc`から同じ版を選びます。`@types/node`は使用中のAPIの型定義として24系を維持し、実行環境の版は`.nvmrc`で管理します。

同日の[#227](https://github.com/Fu-L/abc-textbook/issues/227)・[#228](https://github.com/Fu-L/abc-textbook/issues/228)・[#230](https://github.com/Fu-L/abc-textbook/issues/230)対応でAstroを7.4.2、markdown-remarkを7.3.4、Sharpを0.35.5、Vitestとcoverageを4.1.12、npmを11.21.1へ更新しました。Astroの汎用collection
schemaは公式`astro/zod`から構築し、フレームワーク側の型と揃えています。教材・学習記録の契約に使う直接依存のZodは4.4.3を維持します。推移依存も修正版へ解決し、Expressive
Codeは0.44.3系列へ揃えました。`micromark-extension-math`のKaTeXだけは上流の`^0.16.0`制約を限定overrideでrootの0.19.0へ揃えています。HTML拡張のAPI・非trust入力と、既存の静的MathML表示を回帰検証します。上流が修正版のKaTeXを要求するようになったら、このoverrideの撤去を検討します。

### Actionsに残る依存の追跡（#229）

2026-10-22に両workflowのcheckoutを7.0.1、setup-nodeを7.1.0、github-scriptを9.0.0へ更新しました。それぞれの`action.yml`は`runs.using: node24`です。`.nvmrc`が指定するビルド用Node.jsとは別に管理されます。PagesのActionsも下表の正式タグに固定し、artifact名、権限、environment、検証した同じ`dist`の配信契約を維持します。

更新後の正式タグのproduction lockfileをnpm security bulk
APIで再照会しました。以下は依存の版に一致した検出であり、現行workflowで攻撃経路の成立を確認したものではありません。**[#229](https://github.com/Fu-L/abc-textbook/issues/229)は未解決**です。

| Actionと確認した版                                                                                                                                                                                                                                  | 残る検出の対象                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [setup-node 7.1.0](https://github.com/actions/setup-node/blob/v7.1.0/package-lock.json)                                                                                                                                                             | smol-toml 1.7.1（Moderate）。旧版のform-dataは解消                                                               |
| [checkout 7.0.1](https://github.com/actions/checkout/blob/v7.0.1/package-lock.json)                                                                                                                                                                 | undici 6.27.0（High等）                                                                                          |
| [github-script 9.0.0](https://github.com/actions/github-script/blob/v9.0.0/package-lock.json)                                                                                                                                                       | undici 5.28.5 / 6.24.1、busboy、brace-expansion、minimatch、uuid（High等）                                       |
| [configure-pages 6.0.0](https://github.com/actions/configure-pages/blob/v6.0.0/package-lock.json)                                                                                                                                                   | undici 5.28.4、busboy、Octokit、uuid（High等）                                                                   |
| [deploy-pages 5.0.1](https://github.com/actions/deploy-pages/blob/v5.0.1/package-lock.json)                                                                                                                                                         | form-data 4.0.0（Critical）、unzip-stream、cross-spawn、undici、Octokit等（High等）                              |
| [upload-pages-artifact 5.0.0](https://github.com/actions/upload-pages-artifact/blob/v5.0.0/action.yml) → [upload-artifactの内部固定SHA](https://github.com/actions/upload-artifact/blob/bbbca2ddaa5d8feaa63e36b76fdaad77386f024f/package-lock.json) | undici 6.23.0、brace-expansion、fast-xml-builder/parser、lodash（High等）。外側の更新だけでは内部SHAは追従しない |

修正版を同梱して再bundleした上流リリースが公開されたら、lockfileと実行用`dist/*.js`の双方を確認して更新します。プロジェクトの`overrides`は外部Actionのバンドルを変更しません。特にdeploy-pagesの[form-dataのCritical](https://github.com/advisories/GHSA-fjxv-7rqg-78g4)は残るため、プロジェクトのaudit成功をActions全体の解消と扱いません。配布済み[dist/index.js](https://github.com/actions/deploy-pages/blob/v5.0.1/dist/index.js)にも、boundaryを`Math.random()`で生成する処理が残ることを確認しました。form-dataは追加の[CRLF injection](https://github.com/advisories/GHSA-hmw2-7cc7-3qxx)も含めて4.0.6以上が必要です。通常PRのCIログと、merge後のmain配信ログで同一artifactの保存・配信を確認します。PR段階の検証を実配信成功として扱いません。

## Local-only setup

```bash
nvm install
nvm use
npm install --global npm@11.21.1
node --version
npm --version
npm ci
npm run test:e2e:install
```

`nvm use`の後で、選択したNode.js環境のnpmを明示的に更新します。`packageManager`は基準版の指定であり、npm自体をインストール・更新しません。Node.js環境を新しく用意したときも、`npm ci`の前にこの更新と版の確認を行います。

リリース再現を行う場合は、Node.jsが `v26.12.1`、npmが `11.21.1`
と表示されることを確認します。通常開発では上表の対応範囲内であればpatchが異なっていても実行できます。対応範囲外のNode.js/npmでの動作は保証せず、`engine-strict=true`により依存インストールを停止します。Playwrightのbrowser
binaryはローカルcacheへ保存され、repositoryへcommitしません。

## Command conventions

repository rootから実行し、scriptへ渡す引数は `--` の後ろに置きます。

```bash
npm run dev
npm run build
npm run lint
npm run format:check
npm run check
npm run test
npm run test:unit -- domain-invariants
npm run test:e2e -- --project=chromium
npm run verify:fast
```

- 成功はexit code `0`、検証失敗は `2`、使用法違反は `64` をCLI共通規約とします。
- test/build/updateの既定入力は `tests/fixtures/` のoffline dataです。
- `BASE_PATH=/abc-textbook` でproject subpath buildを再現できます。
- `SITE_URL=https://example.invalid`
  はcredential、path、query、fragmentを含まないoriginだけを受理し、canonical
  URL生成以外の外部通信を発生させません。
- `link:check` は同じ実行内でbuildした `dist` の内部linkだけを検査します。
- `verify:fast`
  はActionsの差分から検査を選びます。ローカルは`--base REF`でtrackedの作業差分と未追跡ファイルを含め、`--all`で広い検査を明示できます。引数/差分指定なしのローカルも広い検査です。
- `check`の後は`build:checked`を使い、Astro checkを再実行しません。単独の`build`にはAstro
  checkを残しています。`build:checked`は同じ作業ツリーで`check`が成功したrun専用です。
- `test:e2e:install:ci`はChromiumだけ、`test:e2e:install`と`test:e2e:install:all:ci`は3ブラウザーの手動準備です。`test:e2e:built -- --project=firefox`等の既存入口も保持しています。
- GitHub
  Actionsの[CI workflow](../../.github/workflows/ci.yml)は公開先と同じ`SITE_URL=https://fu-l.github.io`、`BASE_PATH=/abc-textbook`を使います。ローカル再現も両変数を指定します。
- `check` は`src/client/`のbrowser source、Astro frontmatter/build、Node.js
  CLI/config、Vitest、Playwrightの型環境を分離して検査します。
- live source確認はoffline suite成功後に明示的なdry-runとして実行します。

## Zero-cost boundary

必須経路は既存PC、Git、Node.js、npm package、Playwright browser、静的file
serverだけで完結します。account、credential、常時backend、有料API、有料hosting、remote
database、telemetry、同期serviceは必須にしません。

dependency
installと任意の公式source確認には通常のinternet接続を使いますが、継続課金を要求しません。静的outputは任意のlocal
HTTP serverまたは無料で利用可能な静的配信先へ置けます。hosting固有設定はcanonical
sourceに含めません。

## Reproducibility notes

- `npm ci` はlockfileとmanifestの不一致を失敗にします。
- test clockの既定instantは `2026-07-14T12:00:00+09:00`、process timezoneはUTCです。
- 通常CIのE2EはChromiumです。他browser固有の変更では既存Firefox/WebKit projectを選んで実行します。
- Pagefindは静的build後に生成され、CSPはStarlightの既知inline script
  hash、layout用style属性、WebAssembly、同一origin workerだけを許可します。
- `.env*`、browser report、coverage、build outputはGitへ追加しません。

## 初版専用の入口と履歴資料

002 /
PR-10cで、使われなくなった`corpus:export-inventory-review-packets`と`corpus:final-taxonomy:review`を削除しました。通常の執筆は更新マニュアルの正本編集と小batch手順を使います。残す手動初版監査は`verify:initial-release`と`initial-release-audit.yml`、数学検算は既存Python、他browserは上記のPlaywright入口です。これらを通常更新の必須検査に戻しません。

過去のspec・runbookのコマンドは当時のGit版の契約です。[削除範囲と残る依存](update-manual.md#参照不要のproducerと重複生成物の整理002--pr-10c)と、初版監査の既知の失敗を確認してから使ってください。現行の通常検証が通ることと、旧固定証跡が現行実装に一致することを混同しません。
