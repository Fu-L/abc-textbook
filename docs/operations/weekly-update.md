# 全カタログの週次更新と復旧

> **旧更新pipelineの技術資料**: 現行方針と通常更新の入口は
> [Codexの更新マニュアル](update-manual.md)と
> [Constitution 4.0.0](../../.specify/memory/constitution.md)。以下の人間承認・self/third-party選択・毎回の全件審査は新しい作業の必須条件ではない。manifest・digest・release検証への実装依存は残っているため、既存CLIを使う際の技術的制約として参照する。公開先はGitHub
> Pagesに確定済み。撤去・簡素化の対象と互換性確認は更新マニュアルの移行欄に従う。

この手順は、ABCの新しい問題や訂正を、既存の典型・学習成果・本文へ一つの更新として取り込むためのもの。ABCの回次やdifficulty順に教科書を組み替えない。終了済みContestの公式task
orderでDより後を対象にし、ARC・AGC・CF Div. 1・UCUPへ転用する能力を意味上のprimary
Outcomeとして判断する。

Issue #49で用意するのは更新の検証、履歴生成、運用手順である。全公開投影はT160 / Issue
#50。2026-10-07のowner方針により、初版868問の公開準備は#53、実デプロイと事後検証は#54、live
catch-upの実装は#54完了後の#52が所有する。実装開始点は[先行公開の手順](deploy-before-catch-up.md)。`initial-v1`のsimulationをproduction更新へ流用しない。`abc:update --fixture initial-v1`と`abc:review`はpreview用の入口であり、PR
#70の初回専用`--contest`経路も公開済みbaseからのlive更新完成とは扱わない。

## 1. Prepare：正本と差分を用意する

Node.jsは`.nvmrc`、npmは`packageManager`に記載した版で`npm ci`する。`origin/main`をfetchし、更新用branchで開始する。学習記録はブラウザーの設定画面からJSONへexportしておく。Gitの教材バックアップとIndexedDBの学習記録バックアップは別々に保管する。

更新準備には既存の`discoverContests`、`acquireOfficialMetadata`、`stagePublicationUpdate`、authoringの共有APIを使う。開催中、公式順の矛盾、source取得失敗は具体的理由を持つ保留とする。準備開始後15分以内に全Problemを`authoring_unit_draft`、`authoring_required`、`blocked`へ分類する。草案を得ただけでは公開しない。

`staging/updates/<updateId>/manifest.json`へ`PublicationUpdate`を保存する。対象Problem、Source
Revision、baseのrelease version、実ファイルのbefore/after
SHA-256、所有entity、影響Problemを列挙する。Claimや任意blockを独立entityにせず、所有Problem本文と同じfile
transitionへ含める。全resultと検査が通るまで`ON_HOLD`にする。入力が同じなら同じupdate
IDを再利用し、Source
Revisionや対象が変わったら別更新として扱う。`fixtureMode: true`はproduction検証で拒否される。

canonicalの変更は次の関係を同時に維持する。

- `full_authoring`へ引き継いだUnit本文は執筆済みの正本。metadataの再materializationで本文をskeletonへ戻さない。metadataや導線の変更と同じ更新で本文・前提・掲載順を再検証する。
- Problemのhomeはsemantic primary Outcomeの唯一のowner
  Unit。additional-primaryは追加で学ぶ能力、supportingは既習技能でありhomeを変更しない。別subtreeのProblemはrelated参照として扱う。
- Tag / Outcome / Unitの3つの直接前提DAGは独立に保持する。意味階層と前提を合成して循環判定しない。
- 掲載順の正本は`src/lib/taxonomy/textbook-order.ts`。全Unitを一度ずつ、所属章を保って掲載する。subtreeの連続性やDAGのtopological
  orderは要求しない。Unit内の受理済みProblem順も保持する。
- canonical
  Problem集合が変わったら`src/content/problem-metrics/atcoder-problems.json`も同じ変更で更新する。Problem
  IDsと公式task identityは完全一致させ、補助difficulty /
  pointの欠測は`null`のまま保持する。数値から分類・所有権・教材順を再計算しない。

metricsを取得する場合の実装済み入口は次である。network取得を行うので、取得日時を実際の日時へ置き換える。

```bash
npm run corpus:acquire-atcoder-problems-metrics -- --checked-at 2026-10-05T00:00:00+09:00
npm run corpus:verify-atcoder-problems-metrics
```

## 2. Correction：影響を実targetまで確かめる

`enumerateCanonicalCorrectionImpact`は旧・新Source Revisionを保持し、影響Problemの実在するsections /
Claim
/ 任意block、Unit本文と任意block、Problem配置、`learning-prerequisites.json`、派生indexを列挙する。存在しないexample
/ exerciseを捏造しない。`standard_order`
owner、`affectedLearningUnitOrderIds`、`learning-order.json`は使わない。

Unitの影響判定には、主配置のsubtreeを表す`problemIds`に加え、追加の主題・既習技能として参照する`relatedProblemIds`も含める。分類変更ではprotected-baseのCatalogを`previousCatalog`へ渡し、変更前後の関連先の和集合を対象にする。関連から外れた単元もcurrentの本文・例・演習を読み、古い役割説明が残っていないか確認する。

列挙直後は`pending`。`verifyCanonicalCorrectionTargets`へcurrent
Catalog、実ファイルreader、正本から再生成したindex projectionを渡す。所有者・local
key・配置のProblem
ID・前提schema・実ファイルの非空bytes・index内容を検査したreportを訂正の検証証跡へ保存する。生成途中の写像完全性と、この実targetの検証成功を混同しない。

正本policyのCorrectionImpactは`pending`を保持する。公開Catalogには実targetの検証を通した`verified`のprojectionを載せる。release検証では、このstatus以外の全フィールドを正本と照合し、指定commitのtarget
bytesと派生indexを再検証する。

T049由来のpreview-only
blockは、初期コーパスの執筆方針で既に廃止済みである。初公開のT160は、その廃止を記録してcanonical
locatorを現行本文へ再bindする。古いlocatorを残したまま`verified`へ昇格しない。派生index未生成のbootstrap
CorrectionImpactは`pending_T160`のままでよいが、production releaseは通らない。

taxonomy
indexの検証projectionは`{tags, learningOutcomes, learningUnits, placements, learningPrerequisites}`。順序を含めcanonical
JSONの内容を実`src/content/indexes/taxonomy.json`へ照合する。他のindexを追加するときは、その正本から生成するprojectionと検証を同時に追加する。

## 3. Review：現行subjectへ固定する

Work Manifestは変更前にscopeを固定し、必要check・所有path・成果被覆・review
policyを宣言する。通常更新はmanifest
ownerの`self`。公式根拠との矛盾・訂正、独自の正当化、重大な分類変更は原則`third_party`。一人maintainerの場合だけ、全risk
reasonと`highRiskSelfReviewReason: solo_maintainer`を保持したself-reviewを選べる。risk
reasonを消して通常更新へ偽装しない。

policy-selected reviewer自身が適用checkを実行し、全itemの判断と根拠、全コーパスのOutcome
coverageを記録する。agentによる品質確認とhuman
approvalは証跡上区別する。新しいcheck結果やreviewを旧subjectへ貼り替えない。技術的な検査が全成功しても、必要なhuman
reviewが未完了ならmergeしない。

T131の実装検証は`docs/verification/bootstrap/us5.json`、review状態は`docs/reviews/human-content/bootstrap/us5/merge-review.json`を参照する。Issue
#49の運用者は、今回の実装受入を`agent_quality_review`と全自動検証で完了するよう明示した。この実装受入と初期本文のT074/T078向けowner例外は、production
releaseのhuman review免除を意味しない。

## 4. Validate：protected baseとexact commitを検証する

公開用Catalog、検証inventory、MergeReviewEvidenceをそれぞれ次に用意する。初公開前にはこれらの欠落を成功扱いしない。

- `docs/verification/releases/catalog.json`
- `docs/verification/releases/evidence-inventory.json`
- `docs/reviews/human-content/releases/merge-review.json`

```bash
npm run verify:fast
npm run verify:release -- --commit HEAD
```

pathを変更した場合は`--catalog PATH --evidence-inventory PATH --merge-review PATH`を指定する。`--commit`は`HEAD`またはfull
Git commit hashのみ。成功0、検証失敗2、使用法64。最後のstdout JSONにactual commit、protected-base
commit、version、対象件数、検査結果を返す。

検証器は指定commitを一時cloneへ展開し、そのbytesを読む。working
tree、未追跡file、ローカル学習記録は入力にしない。終了・失敗とも一時cloneを除去し、教材・staging・証跡・公開先を変更しない。差分は`origin/main`（PRではCIの`GITHUB_BASE_REF`）から独立再構築する。HEAD自身をbaseにして空差分を成功させない。

protected mainへのpushではCIの`GITHUB_SHA`とremote mainが同じ場合だけ、exact commitのfirst
parentをbaseとして再検証する。PRのmerge結果が変更されたら新しいSHAでCIをやり直す。required
check名は`Release validation`と2種類の`Verify (...)`。branch
protectionの設定はrepository管理者が行う。ローカルでcheckが成功したことからbranch
protection設定済みと推測しない。

`Release validation`はカタログ未生成の間は実装回帰のみを検査し、その旨をログへ残す。T160後にCatalogが存在するcommitではexact-tree検証を必ず実行する。`verify:release`自体はCatalog欠落を終了2とし、production成功を返さない。

## 5. Merge / Deploy：確定Git commitを渡す

必要reviewとrequired checksが成功したPRをprotected mainへmergeする。merge後にもexact SHAでread-only
release検証を実行する。その成功後にCIが最小`ReleaseMetadata`を作り、静的hostの`CommitDeploymentTarget`へ渡す。metadataは自身が指すcommitの外で生成し、version、cutoff、full
commit、変更概要、HTTPS検証結果URL以外のcandidate / approval / receipt stateを増やさない。

`GitDeploymentAdapter.deploy(metadata)`はローカルGitにあるexact
commitを確認し、同一adapter内のdeploy / rollbackを直列化する。protected-main所属とrequired
checksはCIの責務。hostの認証や公開履歴はhost
adapterが所有する。現在はhost未選定であり、存在しない`abc:deploy` CLIやproduction
deployment成功を案内しない。初版のhost選定とdeploy入口はT150が固定する。

required checkに失敗したcommitではhostを呼ばない。失敗後に教材を再生成して同じrelease
commitとしてdeployすることも禁止する。

## 6. 履歴とBackup

deploy成功後、hostが記録したmetadata履歴をJSON配列として保存する。更新manifestの一覧は別JSON配列にする。次の生成器は各releaseのCatalogを、そのrelease自身のcommitから読む。

```bash
npm run release:history -- \
  --releases build/host-release-history.json \
  --updates staging/update-list.json \
  --public-output build/release-history.json \
  --hold-output staging/status/hold-summary.json
```

公開projectionはversion、cutoff、commit、実際の変更、範囲、検証日時・URL、review
refs、changelogを持つ。旧versionの書き換え、重複commit、不一致summary、保留付きCatalogを拒否する。管理者向けprojectionだけが未公開試行のProblem別理由・再開条件を持つ。`staging/status/`を公開、Pagefind、sitemap、feedへ含めない。T160はこのpublic
historyを公開routeへ接続する。

最後に学習記録を再exportし、release version付きのJSONとGit /
host履歴を保管する。taxonomy訂正でProblem
IDが同じ場合、学習記録の値・日時は変更しない。restoreは設定画面で件数と競合policyをpreviewしてから適用する。

## Deployment adapterの復旧

hostの通信失敗は公開履歴を確認し、exact
commitが既に公開済みならその結果を取得する。未公開なら同じmetadata /
commitでretryする。失敗したmetadataを成功履歴へ追加しない。adapterのqueueは例外でも解放され、次の要求へ進める。

不具合が公開済みの場合は`GitDeploymentAdapter.rollback(fullKnownCommit)`でhost履歴中の既知commitを再deployする。呼出元がrollback用metadataを作り直さない。未知commit、存在しないGit
object、履歴とcommitが違うmetadataは副作用なしで拒否する。rollback成功後はrouteと検索を確認し、ブラウザーの学習記録を維持する。

教材や分類の修正が必要なら、rollback後に新しいPublicationUpdateをprepareする。旧releaseを書き換えることで訂正しない。
