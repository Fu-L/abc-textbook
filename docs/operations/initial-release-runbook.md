# ABC212〜466 初版公開手順

> **初版の過去手順と復旧資料**: 通常配信は[更新マニュアルの標準Pages手順](update-manual.md#5-標準pagesで公開する)に従う。PR-07aではCIの同run/SHAで一度build・検証したdistを標準Pages
> Actionsへ渡す。以下の初版監査・旧review/台帳・独自配信は通常更新の条件にしない。PR-07aの実成功・公開確認後、PR-07bで旧`production-deploy.yml`を撤去した。以下の旧起動コマンドは履歴資料であり実行できない。

標準配信の確認は、Actions/Pages成功、metadataの版/SHA/run、代表導線を照合する。配信前失敗・配信失敗・配信後確認失敗を区別する。同runの再実行は元のUTC作成日/run
IDの同版で、artifact消失時は同SHAでbaselineから再検証・buildする。古いrunで新mainを上書きせず、公開後の復旧は不具合PRのGit
revertを新runの別版として同経路へ通す。origin/baseと学習記録は保持する。実main配信の確認はmerge後に行い、fixtureやPR
buildの成功で代用しない。

現行の履歴は[実配信済み版の追記手順](update-manual.md#実配信済み版を履歴へ追記する002--pr-07b)を使う。新版は標準Pages/Actionsの実成功と同一artifactのcatalog/metadataから追記し、旧日付版のGit
readerと既存URLを保持する。artifact取得不能時には一致する公開JSONのみ利用し、双方取得不能なら追記を保留する。PR-07bの実main配信・公開確認後に、PR-07cで両先行版を成功順に追記する。履歴だけの配信自体は追記対象にしない。

初版は868問・213タグ・232 Unit、254開催とABC316の公式欠番を収録する。収録cutoffは
`2026-07-12T00:00:00+09:00`。公開準備日・検証日・配信日は別の情報である。本文、taxonomy、配置、読書順、Problem
IDとIndexedDB契約を維持する。#53で用意するのは公開入力、検査、レビューpacketとdeploy入口であり、mainへのmergeと実配信は#54で行う。

## 公開準備

Node 24.18.0 / npm 11.16.0とlockfileの依存を使う。

```sh
npm ci
npm run release:bootstrap -- --first 212 --last 466 --mode inputs --review-policy solo-maintainer --acceptance agent-quality-review
npm run build
node --import tsx scripts/corpus/verify-full-projections.ts --write-evidence
npm run verify:initial-release -- --write
npm run verify:initial-release -- --check
npm run release:bootstrap -- --first 212 --last 466 --mode evidence --review-policy solo-maintainer --acceptance agent-quality-review
```

bootstrapはproduction用のcanonical入力を読む。previewは明示した
`release:bootstrap -- --fixture initial-v1`でのみ実行する。収録済み本文を初公開することはGit上のaddではない。初版bootstrapの
`targetProblemIds`は全868問、`operations`は保護済みbaseとの差分である。この初版では本文差分0件・operation
0件と全件公開scopeをそれぞれ照合する。本文差分があれば準備は止まり、本文受入を済ませた新しいprotected
baseが必要になる。

準備対象をcommitした後、次を実行する。未commit原稿が検証対象になることはない。

```sh
npm run verify:release -- --commit HEAD --preparation
```

この検査の成功は公開承認ではない。SC-012の12観測は3ブラウザーの自動操作・独立日時・再読込保持を示す。全868routeの共有controlはT139/T140で照合する。人間の読解・操作時間を測定したとは報告しない。SC-009/SC-010はownerの廃止指示を保持する。

## 現行subjectのレビュー

2026-10-07、ownerはhigh-risk
self-reviewを指定し、その後「人間の了承は不要です。」と明示した。この固定868問の初版は、Constitutionに記録したowner例外に従い`agent_quality_review`と全適用自動検査で受け入れる。manifestの`self`、`solo_maintainer`、original
proofとmajor classificationの両risk reasonは保持する。

`--mode evidence --acceptance agent-quality-review`は全監査のcurrent-subject一致をread-onlyで確認した後、232
itemのagent decision/basisと242
Outcome被覆を`docs/reviews/agent-content/initial-release/release-review.json`へ保存する。本文品質受入lineage、公式Source
Revision、独立数学回帰、check生結果、憲章とdependent templatesのdigestを結び付ける。人間review
refsは空で、旧人間review packetはowner例外によりnot
applicableと記録する。人間がcheckを実行した、itemを承認したという証跡は作らない。

commit後、通常のexact-commit検査を実行する。

```sh
npm run verify:release -- --commit HEAD
```

公開検証は、全checkの成功、232 itemの根拠付きagent
decision、全Outcome・全本文のcoverage、受理済みcontentとの実差分0件、全リスク理由、現行subjectに結び付いた証跡を要求する。欠落・失敗・stale
evidenceは`Production review`を通らない。初版以外の更新は従来のFR-026 self/third-party
policyを維持し、今回の例外を使えない。

## protected main

build、link、schema、content
completenessは二環境の`Verify`と`Initial corpus audit`が検査し、実差分・公開scopeは`Release validation`、policyに従ったreviewは`Production review`が検査する。設定payloadは[protected-main.json](protected-main.json)。strict
checksとadminを含む保護を要求する。

2026-10-07、ownerがrepositoryをpublicに変更した後、上記payloadをAPIで設定した。GETで5つのrequired
checks、strict、enforce admins、force push禁止、削除禁止を確認した。実応答は
`docs/verification/initial-release/protected-main.json`へ保存する。private時の403は履歴として残し、現在の未設定状態とは扱わない。追加必須費用は0円で、有料upgradeは行っていない。
[GitHubの公式仕様](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

設定の再適用・確認は次を使う。

```sh
gh api --method PUT repos/Fu-L/abc-textbook/branches/main/protection --input docs/operations/protected-main.json
gh api repos/Fu-L/abc-textbook/branches/main/protection
```

## 静的hostと認証

2026-10-08、ownerは「GitHub
Pagesに変更する」を選択した。#53のCloudflare選定は過去の準備記録として保持し、#54の実配信にはGitHub
Pagesを使う。公開済みrepositoryのPagesをworkflow方式で有効化し、APIが返したURLは
`https://fu-l.github.io/abc-textbook/`
である。`SITE_URL=https://fu-l.github.io`、`BASE_PATH=/abc-textbook`
をbuildと検証で統一する。読者のログイン・追加費用・backend・analyticsは不要である。

`github-pages` environmentはprotected branch限定とし、`main`の5つのrequired
checks・strict・admin適用を維持する。実設定の確認は上記APIで行う。workflowは標準の`GITHUB_TOKEN`とOIDCを使い、追加secretやCloudflareログインを要求しない。
[GitHub Pagesのworkflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## 旧exact commitの初回deployとretry（履歴資料）

#54で全required checksが成功したPRをprotected mainへmergeする。merge後のfull SHAに対する全required
checksの成功を確認し、read-onlyの通常release検証を実行してから `Production deploy` を起動する。

```sh
gh api repos/Fu-L/abc-textbook/branches/main/protection
gh api repos/Fu-L/abc-textbook/commits/FULL_MERGED_COMMIT/check-runs
npm run verify:release -- --commit FULL_MERGED_COMMIT
gh workflow run production-deploy.yml --ref main -f commit=FULL_MERGED_COMMIT -f rollback=false
gh run list --workflow production-deploy.yml
```

workflowはmain所属と5つのcheck成功を確認し、exact checkoutでlocked
install・read-only最終検証・build・link検査を行う。最小metadataにfull SHAと検証run
URLを記録する。Pages
APIの`pages_build_version`には公開対象SHAを明示するため、workflowを起動した最新mainのSHAと旧版のredeploy
SHAを混同しない。成功statusと配信metadataを照合する。失敗時は同SHAでretryする。
[Pages deployment API](https://docs.github.com/en/rest/pages/pages#create-a-github-pages-deployment)

### 事後検証と履歴

初版の通常公開と同SHAのredeployでは `docs/operations/verify-initial-deployment.py`
を自動実行する。公開URLに対する取得と使い捨てブラウザーcontextを使う。

- Pages APIの実deployment ID・`succeed`と配信metadataのfull
  SHA・version・cutoff・868問scopeを照合する。
- Gitのexact Catalogと配信Catalogを全件比較する。1573 HTML
  route、全868問題の学習control・内部導線、254開催とABC316欠番、sitemap/feedを検査する。サブパスを含むURLを使う。
- 既存の初版E2Eを3エンジン計93件実行し、キーボード・320px幅・独立日時・reload・120件backup/restoreを確認する。Pagefindで`abc212-e`・`abc315-ex`・`abc466-g`を検索する。DB名・version
  2・Problem ID keyを確認する。
- 検証前後のmetadata一致を確認する。成功したときだけ実結果を出力する。部分的成功を公開検証完了と記録しない。

既存の`loadGitReleaseHistory`に、実host確認済みmetadataとそのSHAのCatalogを渡し、`initial-history.json`を導出する。Git内のprepared
Catalogやfeedをpublishedへ書き換えない。Pages
APIは公開完了時刻を返さないため、成功statusの実観測時刻を`publicationObservedAt`へ記録する。upload開始時刻や収録cutoffを公開日時にしない。GitHub
environmentの成功status時刻はworkflow完了後に別途記録する。

```sh
gh run download SUCCESSFUL_DEPLOY_RUN_ID --name initial-production-verification-FULL_MERGED_COMMIT --dir /tmp/initial-production-verified
cp /tmp/initial-production-verified/initial-release.json docs/verification/deployments/initial-release.json
cp /tmp/initial-production-verified/initial-history.json docs/verification/deployments/initial-history.json
```

手動再検証ではNode 24、locked
dependencies、3ブラウザー、`SITE_URL`・`BASE_PATH`・`GH_TOKEN`と、workflowが取得した実
`/tmp/pages-deployment.json`
を用意して同じPython入口を使う。suite・本文・lockfileが対象commitと一致しなければ停止する。host
receiptを手書きして公開証拠にしない。

## 旧初回失敗とrollback（履歴資料）

初回には旧production版がない。52週simulation、初回公開SHAのredeploy、異なる実公開版間のrollbackを区別する。二版間rollbackは
`not_applicable_no_prior_production_version` とする。

```sh
gh workflow run production-deploy.yml --ref main -f commit=KNOWN_PUBLISHED_COMMIT -f rollback=true
```

rollback入口はPages APIでそのSHAの公開成功を確認し、同じSHAのlive
metadata、またはGitへ保存した初版公開証跡からmetadataを復元する。任意metadataを入力させない。初版の同SHA再公開では同じmetadataを保ち、再び公開検証を行う。初版以外の公開版への対応は#52の履歴拡張で実装する。

originとProblem IDを固定する。origin変更が必要なら、旧originでbackup
export後、新originでimportし、値と両日時を照合する。

#52は事後検証JSON・immutable Git履歴・公開Catalog・metadataを実公開baseとして受け取る。US5
live受入、FR-022〜FR-025、SC-006/SC-007、SC-014のlive更新は#52で扱う。既存の数学回帰、更新・訂正回帰、52週simulationを維持する。

## #54の実公開結果（2026-10-08）

PR #73をmergeし、5必須チェックと通常のread-only release検証に成功した
`af8eca05b1612c5daddb05ddadc32b590f911146` を [GitHub Pages](https://fu-l.github.io/abc-textbook/)
へ公開した。[初回run](https://github.com/Fu-L/abc-textbook/actions/runs/37717648084)ではPages配信とmetadata照合が成功した後、事後取得でHTTP
503となった。[同SHAの再配信run](https://github.com/Fu-L/abc-textbook/actions/runs/37718434307)ではmetadataを保って再配信し、全公開導線・検索・3エンジンの学習記録検証が成功した。

実結果は `docs/verification/deployments/initial-release.json`、exact Git
Catalogから導出した公開履歴は `initial-history.json`
に保存した。firstPublicationObservedAtは最初に認証なしでmetadataを確認した実時刻であり、Pagesの正確な完了時刻ではない。workflowSuccessAtは事後検証を含む実job成功時刻である。初回のHTTP
503と初回jobのfailureを保持し、配信成功と全検証成功を区別する。初版のため、二つの公開版間rollbackは未適用。#52はこの実公開baseから開始する。
