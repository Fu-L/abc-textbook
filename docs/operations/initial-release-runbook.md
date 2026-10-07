# ABC212〜466 初版公開手順

初版は868問・213タグ・232 Unit、254開催とABC316の公式欠番を収録する。収録cutoffは
`2026-07-12T00:00:00+09:00`。公開準備日・検証日・配信日は別の情報である。本文、taxonomy、配置、読書順、Problem
IDとIndexedDB契約を維持する。#53で用意するのは公開入力、検査、レビューpacketとdeploy入口であり、mainへのmergeと実配信は#54で行う。

## 公開準備

Node 24.18.0 / npm 11.16.0とlockfileの依存を使う。

```sh
npm ci
npm run release:bootstrap -- --first 212 --last 466 --mode inputs --review-policy solo-maintainer
npm run build
node --import tsx scripts/corpus/verify-full-projections.ts --write-evidence
npm run verify:initial-release -- --write
npm run verify:initial-release -- --check
npm run release:bootstrap -- --first 212 --last 466 --mode evidence --review-policy solo-maintainer
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

`docs/reviews/human-content/initial-release/inventory.json`には232 Unitと868
Problemの全本文、全Outcome、必要check、content file
inventoryのdigest、既存agent品質受入のlineageがある。
`docs/reviews/human-content/releases/merge-review.json`は未承認packetである。未承認状態のproduction
`verify:release`は終了2となり、`Production review` checkは通らない。

2026-10-07のowner指示により、この初版は`self`と`solo_maintainer`を選択する。original proofとmajor
classificationのrisk reasonを残し、bootstrapの`--mode inputs`と`--mode evidence`の両方へ
`--review-policy solo-maintainer`を付ける。変更したmanifestで検査を再実行する。これはConstitution
3.0.0のhigh-risk
self-reviewであり、リスク理由の除去やagent品質受入から人間approvalへの読み替えではない。

reviewerは実際に適用checkを実行し、各inventory itemへreview basisと明示approval、Outcome
coverage確認を記録する。正本schemaは
`human-content-review-evidence.schema.json`と`merge-review.schema.json`。checkの生結果、current-subjectの全content
file、憲章とdependent templatesをmerge
evidenceへ結び付ける。完成済みの人間証跡だけを次でimportする。入力JSONやperson
IDをagentが捏造してはならない。

```sh
npm run release:accept-review -- --human /tmp/signed-human-review.json --merge /tmp/signed-merge-review.json
```

human evidenceの保存先は `docs/reviews/human-content/releases/human-review.json`。署名済みmerge
evidenceも同pathとhumanの実byte
digestを指す必要がある。importは証跡bytesをそのまま保存する。commit後に通常のexact-commit検査を実行する。

```sh
npm run verify:release -- --commit HEAD
```

## protected main

build、link、schema、content
completenessは二環境の`Verify`と`Initial corpus audit`が検査し、実差分・公開scopeは`Release validation`、人間reviewは`Production review`が検査する。設定payloadは[protected-main.json](protected-main.json)。strict
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

Cloudflare Pages Free / Direct Uploadを選定する。private
repositoryのままビルド成果物を渡せる。読者はアカウント不要で、backend、生成API、analyticsは使わない。追加必須費用は0円。Freeの20,000ファイル・1ファイル25
MiB以内をdeploy adapterが確認する。
[Direct Uploadの公式手順](https://developers.cloudflare.com/pages/get-started/direct-upload/)、
[Freeの制限](https://developers.cloudflare.com/pages/platform/limits/)

#54の開始時にownerのCloudflare accountでDirect Upload projectを作成する。project名の第一候補は
`fu-l-abc-textbook`、production branchは`main`、base
pathは`/`。希望originは`https://fu-l-abc-textbook.pages.dev`だが、projectは未作成で名前の空きは未確認である。作成APIが返した実HTTPS
originを`SITE_URL`へ設定し、それ以降は同じoriginを維持する。Cloudflareの無料管理アカウントは運用者の認証だけに使い、教科書利用者のアカウントにはしない。

```sh
npm exec --yes --package=wrangler@4.148.0 -- wrangler login
npm exec --yes --package=wrangler@4.148.0 -- wrangler pages project create fu-l-abc-textbook --production-branch main
npm exec --yes --package=wrangler@4.148.0 -- wrangler pages project list --json
```

GitHub Actionsの`production` environmentへaccount IDとPagesの編集が可能なAPI
tokenをsecretとして設定する。tokenを文書・証跡へ書かない。secret名は`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_API_TOKEN`。variable名は`CLOUDFLARE_PAGES_PROJECT`、`SITE_URL`。この設定と実originの確認は#54の開始条件である。

同じenvironmentの`RELEASE_GATE_TOKEN`には、このrepositoryのAdministration readとChecks
readを持つ運用者のfine-grained tokenを設定する。branch protectionのGETはAdministration
readを要求するため、workflowの`contents: read` / `checks: read`の標準
`GITHUB_TOKEN`だけでは代用しない。このtokenは保護設定とcheck結果の読み取りstepだけで使い、設定変更やmerge権限は要求しない。
[GitHubのbranch protection API権限](https://docs.github.com/en/rest/branches/branch-protection#get-branch-protection)

## exact commitの初回deployとretry

#54で、全required checksが成功したPRをprotected mainへmergeする。merge後のfull SHAに対するrequired
checksの成功を確認し、`Production deploy`
workflowを手動起動する。branch名、PR番号、短縮SHAを公開snapshot IDにしない。

```sh
gh workflow run production-deploy.yml --ref main -f commit=FULL_MERGED_COMMIT -f rollback=false
gh run list --workflow production-deploy.yml
```

workflowはmain所属、実branch protection、全required
checksを確認し、read-only最終検証を実行する。最小Release MetadataはそのCI
runで確定SHAと検証URLから生成する。自分自身を指すSHAをcommitへ書き込まない。adapterは隔離したexact
checkoutでlocked install・build・link検査を行い、 `dist/release-metadata.json`だけをCI
provenanceとして追加し、Wranglerでproductionへuploadする。hostのproduction / deploy-success / exact
SHAと配信metadataの一致を確認したときだけ成功する。失敗時は新しいSHAを作らず、同じworkflow・同じSHAをretryする。

host成功履歴はCloudflare deployments APIが正本であり、prepared Catalogは公開履歴ではない。
`release-metadata.json`の配信URLとCloudflare deployment ID / status / commitを#54の
`docs/verification/deployments/initial-release.json`へ記録する。取得例は次のとおり。

```sh
npm exec --yes --package=wrangler@4.148.0 -- wrangler pages deployment list --project-name fu-l-abc-textbook
```

成功deploymentから取得した最小metadataの配列を`/tmp/host-history.json`へ保存し、bootstrap
manifestを配列にした`/tmp/update-list.json`とともに、Git snapshotの履歴を照合する。
`--host cloudflare-pages`は各prepared
Catalogについて実host成功と配信metadataの一致を必須にする。Git内のprepared
recordをpublishedへ書き換えず、初版の履歴出力はverification directoryへ保存する。

```sh
npm run release:history -- --host cloudflare-pages --releases /tmp/host-history.json --updates /tmp/update-list.json --public-output docs/verification/deployments/initial-history.json --hold-output staging/deployment-holds.json
```

公開後にhomeの868問・232
Unit、ABC212/ABC466/ABC316の表、代表Problem/Tag/Unitへの内部導線、Pagefindの`abc315-ex`と`abc466-g`検索、sitemap/feedとcatalog閉包、スマートフォン幅を確認する。配信metadataのSHA/cutoffが一致すること、Problem
ID・DB名/version、修了・復習値と独立日時、120件backup/restoreが同originで保持されることを確認する。

## 初回失敗とrollback

初回には旧production版がない。52週simulationのknown-commit
rollback、初回公開SHAのredeploy、二つの実公開版間のrollbackは別の結果として記録する。旧版がない状態で本番rollback成功を主張しない。初回失敗はretryし、公開内容に問題があれば配信を停止して修正を通常reviewへ戻す。

二版目以降は、host成功履歴にある既知commitへ次で戻す。

```sh
gh workflow run production-deploy.yml --ref main -f commit=KNOWN_PUBLISHED_COMMIT -f rollback=true
```

adapterはhost履歴からそのcommitのmetadataを取得して同じadapterで再deployする。任意のrollback用metadataを受け取らず、previewや失敗uploadを旧公開版に数えない。同一originと安定Problem
IDを保つ。origin変更が必要なら、旧originでbackup
export後、新originでimportして値と両日時の一致を確認する。

US5のlive受入、FR-022〜FR-025、SC-006/SC-007、SC-014のlive更新は#54完了後の#52へ引き継ぐ。既存の数学回帰、更新・訂正回帰、52週simulationは初版でも維持する。
