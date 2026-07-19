# CLI Contract: ABC上級問題体系化教科書

**Scope**: PublicationUpdateの候補作成、ReleaseCandidateの検証、人間review取込、承認、原子的公開。

## Common rules

- 必須経路は有料API、常時backend、外部credentialを要求しない。
- machine-readable resultはstdout最終行のJSON、進捗と診断はstderrへ出す。
- 成功0、検証・保留2、使用法64、入力形式65、内部失敗70、I/O失敗73、設定失敗78を使う。
- `--fixture`を持つartifactはproduction approve/publishを拒否する。
- 同じupdate/candidateへの同時writerをlockで拒否し、publishは全candidate共通lockで直列化する。
- repo-relative pathだけを扱い、absolute、`..`、symlink escape、重複pathを拒否する。
- update/candidate identityに影響するinputが同じなら既存active artifactを冪等再利用する。

## `abc:update` — 一操作の更新準備

```bash
npm run abc:update -- --contest abcNNN [--fixture PATH] [--resume UPDATE_ID]
```

実行順:

1. Contestが終了済みか確認する。
2. robots、利用規約、生成AI rule、公式source fingerprintを確認する。
3. 公式task orderを取得し、Dの位置より後の全problem labelを抽出する。
4. Contest/Slot/Problem/Source metadataを作る。
5. 公開Catalogとの差分とCorrection Impactを作る。
6. Technique Inventory候補、既存Tag/Outcome/Unitへの分類候補、Placement候補、index previewを作る。
7. ProblemごとにAuthoringPacketを作り、任意generatorが完全本文を返した場合だけ`authoring_unit_draft`にする。
8. 対象範囲、source、ProblemAuthoringUnitと内包Example、Tag、DAG、到達可能性、linkを検証する。
9. 15分以内に全Problem resultとsummaryを保存する。

最終JSONの必須field:

```json
{
  "command": "abc:update",
  "updateId": "update-...",
  "contestId": "abcNNN",
  "advancedSlotLabels": ["E", "F", "G", "H", "I"],
  "resultCounts": {
    "authoring_unit_draft": 0,
    "authoring_required": 0,
    "blocked": 0
  },
  "state": "ELIGIBLE_FOR_BATCH",
  "blockingFindingCount": 0,
  "durationMs": 0,
  "resultPath": "staging/updates/.../manifest.json"
}
```

`advancedSlotLabels`は例示でありE〜H固定ではない。公式task orderでDより後の全labelと一致しなければならない。

全resultが`authoring_unit_draft`かつblocking 0の場合だけ`ELIGIBLE_FOR_BATCH`、それ以外は理由付き`ON_HOLD`にする。`authoring_required`と`blocked`をProblemAuthoringUnit件数へ含めない。

安定hold codeには`CONTEST_NOT_ENDED`、`D_TASK_NOT_FOUND`、`TASK_ORDER_CONFLICT`、`ROBOTS_UNREACHABLE`、`POLICY_CHANGED`、`SOURCE_UNAVAILABLE`、`EDITORIAL_PENDING`、`PARSER_DRIFT`、`GENERATOR_UNAVAILABLE`、`AUTHORING_REQUIRED`、`SOURCE_CONTRADICTION`、`EXAMPLE_NOT_REPRODUCIBLE`、`DEPENDENCY_CYCLE`、`DEADLINE_REACHED`を含める。

## `release:bootstrap` — 初期seedのupdate化

```bash
npm run release:bootstrap -- --first 212 --last 466
```

- 既に検証済みのContest、Problem、Technique Inventory、taxonomy、ProblemAuthoringUnit、Learning Unitを一つのbootstrap PublicationUpdateへ固定する。
- ABC 212〜466の全Contestと各D以後Problem、Source、content pathを完全列挙する。
- 未完成・未分類・未review itemが一件でもあればELIGIBLEにしない。
- 同じsnapshot digestは同じbootstrap updateを再利用する。

## `release:catch-up` — 初版cutoff追随

```bash
npm run release:catch-up -- --cutoff 2026-07-14T00:00:00+09:00
```

- cutoffまでの最新終了済みABCを決め、seed後の未収録Contestを昇順に`abc:update`へ渡す。
- 各ContestのDより後の全Problemをmanifestへ固定する。
- 全catch-up updateがELIGIBLEになった場合だけ、bootstrap IDとcatch-up IDsをcandidate inputとして返す。
- 一件でもON_HOLDなら終了2で停止し、欠落0件を報告しない。

## `abc:prepare-release` — candidate作成

```bash
npm run abc:prepare-release -- --update UPDATE_ID [--update UPDATE_ID ...] --target YYYY.MM.DD
```

- 一つ以上のELIGIBLE updateを指定順に束ねる。
- base release、target、cutoff、fixture modeの整合を確認する。
- AdvancedSlotRegistryを既存順と全Contest official orderから決定生成する。
- candidate treeへRelease非依存content、taxonomy、index、changelogを生成する。
- state envelope、final Release record、approval、receiptをcontent subjectから除外する。
- path順file inventoryから`contentSubjectDigest`を固定し、同じidentityのactive candidateを再利用する。
- 成功時stateは`VALIDATING`。

## `abc:validate` — pre-review検証

```bash
npm run abc:validate -- --candidate CANDIDATE_ID
```

少なくとも次をcandidate正本から検査する。

- ABC 212からcutoffまでのContest連続性。
- 各Contestの公式task orderとDより後の全Problem。
- AdvancedSlotRegistryの完全性・安定順・矛盾0件。
- Problem集合とTechnique Inventory集合の一致。
- 全ProblemのTag、Outcome、Placement、Learning Unit/Tag collection到達性。
- ProblemAuthoringUnit、Source、Correction Impact。Claim、Example、Exercise、Assessment、Answerはauthoring unitの同一file transitionに含める。
- Tag/Outcome/Unit DAGと生成順。
- contest matrix、list alternative、search、LearningRecord shared route contract。
- build、link、accessibility、client bundle、performance、zero-cost inventoryの適用check。

成功時、current `contentSubjectDigest`へ適用check集合とhuman review inventoryを固定して`AWAITING_REVIEW`へ進む。失敗時は`ON_HOLD`とresume stage、Problem別理由を保存する。

## `abc:review` — HumanContentReviewEvidence取込

```bash
npm run abc:review -- --candidate CANDIDATE_ID --evidence PATH
```

evidenceは次を満たさなければならない。

- `scopeType=release_candidate`、`scopeId=CANDIDATE_ID`、同じ`contentSubjectDigest`。
- manifestのreview policyと同じ`reviewMode`（通常は`self`、高リスク時だけ`third_party`）を記録する。高リスク時の`third_party` reviewは同じscopeの`self` reviewに代わる。
- `self`ではmanifest ownerがOutcome coverageを確認し、`third_party`ではauthor外のreviewerが確認する。
- 全applicable checkの`executedByReviewerId`が証跡のreviewerと一致し、同じsubjectのresultと一致する。
- 完全自動化不能な新規・変更Claim/Exampleの全itemをreviewerが判定し、self/third-partyの表示を混同しない。
- current Constitution 2.0.0とdependent template inventoryを含むConstitution Checkが成功する。
- blocking finding 0、`aggregatePassed=true`。

他者/CI実行結果の追認、複数reviewerへのcheck分割、review policyにない第三者必須化、owner approval、LLM result、learner self-studyをHumanContentReviewEvidenceの代用として拒否する。成功時`AWAITING_OWNER_APPROVAL`へ進む。

## `abc:approve` — final payload固定と管理者承認

```bash
npm run abc:approve -- --candidate CANDIDATE_ID --owner OWNER_ID \
  --publication-effective-at RFC3339 --expect-approvable-digest SHA256
```

- blocking 0、current human review、base/target namespace、fixture禁止を再確認する。
- frozen contentとRelease metadataからpublic Catalog、release page、home、search index、sitemap/feed等のRelease依存fileを一回だけ生成する。
- Release recordと全final fileを含む`candidatePayloadDigest`を計算する。
- content subject、payload、check refs、human review refs、blocking stateから`approvableDigest`を計算する。
- operatorへupdate IDs、file list、diff、check/review summary、両digestを表示する。
- `--expect-approvable-digest`が一致する場合だけowner approvalを記録し、`AWAITING_FINAL_VALIDATION`へ進む。
- owner approvalをhuman reviewとして数えない。

## `verify:release -- --phase final`

```bash
npm run verify:release -- --phase final --candidate CANDIDATE_ID
```

- candidate fileを生成・変更しない。
- content subject、candidate payload、Release、AdvancedSlotRegistry、checks、review、owner approvalを再計算する。
- target path集合と実file集合、全route/link/search/build outputを照合する。
- SC-009/010 LearnerOutcomeEvidence、SC-012 UserTimingEvidence、SC-015、SC-019、52週cost等のrelease evidenceをcurrent release digestへ照合する。
- 元目的のCatalog completeness、体系的到達性、contest matrix/search、simple local learning managementを直接検査する。
- 成功時だけ`READY_TO_PUBLISH`へ進む。

## `abc:publish` — 原子的切替

```bash
npm run abc:publish -- --candidate CANDIDATE_ID [--simulate]
```

1. global publish lockを取得し、candidate/state/digest/base/windowを再確認する。
2. 実行hostの同一filesystem上に一時tree、receipt temp、recovery journalを作る。
3. failure injectionを含むpreflightを通す。
4. 公開treeを一回切り替え、実時刻とbytesをreceipt rawへ記録する。
5. rawとreceiptをno-overwriteでcommitしてからcandidate stateをPUBLISHEDへ更新する。

receipt commit前の失敗は旧treeへrollbackし、orphan tempを除去する。receipt commit後のstate更新失敗は次回lock取得時にstateだけを収束させ、再swapしない。`--simulate`は公開treeを変更しない。公開済みcandidateの再実行はreceiptとtree一致を確認してno-opを返す。

## Read-only commands

```bash
npm run abc:status -- --id UPDATE_OR_CANDIDATE_ID
npm run catalog:validate -- --input PATH --evidence-inventory PATH
npm run catalog:build -- --input PATH --output PATH --evidence-inventory PATH
npm run verify:merge -- --evidence PATH
```

- `abc:status`はstate、Problem別result、hold/resume、content/payload digest、check/review、approval、windowを表示する。
- `catalog:validate`はCatalog schemaと意味制約を検査し入力を変更しない。
- `catalog:build`は確定Releaseまたはfixtureから派生indexを指定outputへ生成し、公開正本を変更しない。
- 両CLIは任意のmanifest/candidateを引数で信頼しない。Catalogのrelease recordから`docs/work-manifests/`、`staging/release-candidates/`、`staging/updates/`の正規recordを一意に解決し、CIが提供する保護済みremote-tracking base ref（`GITHUB_BASE_REF`、ローカル既定は`origin/main`）からwork manifest、Catalog、content treeの基準を読み、`src/content/`の実ファイルinventoryを公開直前に再構築する。base refはCLI引数から選択できず、任意SHAの指定、`HEAD`自身、baseからの更新を含む未固定manifest、base/current Catalogで再現できないoperationやCorrection Impactは拒否する。
- `verify:merge`はWork Manifest、logical subject、review modeに応じた同一reviewerのcheck実行、必要時のみauthor外review、Constitution Check、finding 0を検証する。
