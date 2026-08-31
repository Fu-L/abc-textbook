# CLI Contract: ABC上級問題体系化教科書

**Scope**: PublicationUpdateの準備、merge前検証、人間review取込、Git commit単位の静的デプロイ。

## Common rules

- 必須経路は有料API、常時backend、外部credentialを要求しない。
- machine-readable resultはstdout最終行のJSON、進捗と診断はstderrへ出す。
- 成功0、検証・保留2、使用法64、入力形式65、内部失敗70、I/O失敗73、設定失敗78を使う。
- `--fixture`を持つartifactはproduction merge/deployを拒否する。
- updateへの同時writerはupdate側で拒否し、デプロイの直列化はdeployment adapterと静的hostへ限定する。
- repo-relative pathだけを扱い、absolute、`..`、symlink escape、重複pathを拒否する。
- update identityに影響するinputが同じなら既存active artifactを冪等再利用する。

`corpus:export-inventory-review-packets`だけは、転載対象になり得る執筆用packetをrepositoryへ置かないための明示的な例外である。このcommandはcacheと新規出力先にrepository外の絶対pathを要求し、実pathを解決した後にもrepository内・repositoryを包含するpath・symlink経由の再侵入を拒否する。

## `corpus:export-inventory-review-packets` — private執筆packetの再生成

```bash
npm run corpus:export-inventory-review-packets -- \
  --metadata-dir PATH \
  --cache-scope-dir ABSOLUTE_PRIVATE_PATH \
  --output-dir ABSOLUTE_NEW_PRIVATE_PATH
```

- networkへ接続せず、検証済みmetadataと同一scopeの公式page cacheだけを読む。
- Problemと個別公式解説を再parseし、Source Revision fingerprintがmetadataと一致する場合だけ一Problem一packetを新規directoryへ書く。
- 全packetを検証・構築してから同一parentの一時directoryへ書き、最後に新規出力pathへatomic renameする。途中失敗時は一時directoryを除去し、既存出力pathは上書きしない。
- packetは参照と独自説明の執筆にだけ使い、repositoryへcommitしない。
- 成功時はProblem数、Source Revision数、cache page数、出力pathをmachine-readable JSONで返す。

## `corpus:verify-authoring` — 全Inventoryの執筆証跡検証

```bash
npm run corpus:verify-authoring
```

全Problemが`reviewed`、finding 0、source-boundであることに加え、使用skill、writing policy、全Problemの正規化Source Revision集合、各Inventory contentのdigestを再計算し、`docs/verification/bootstrap/technique-inventory-authoring.json`とbyte一致しなければ終了2とする。private review packet本文のdigestではなく、公式Source Revisionのfingerprint・URL・task bindingを固定する。更新は明示的な`npm run corpus:verify-authoring:write`だけが行う。

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
- 全catch-up updateがELIGIBLEになった場合だけ、bootstrap IDとcatch-up IDsをrelease change summaryとして返す。
- 一件でもON_HOLDなら終了2で停止し、欠落0件を報告しない。

## `verify:release` — merge前のrelease検証

```bash
npm run verify:release -- --commit HEAD
```

- 一つ以上のELIGIBLE updateがCatalogの`release.updateIds`と完全一致することを確認する。
- CIがcheckoutしたcommit/treeを唯一のsnapshotとして扱い、独自content/payload/approval digestを作らない。
- Work Manifest、Catalog、PublicationUpdate、実content inventoryを保護済みbaseから再構築した差分へ照合する。
- 少なくとも次をcommitの正本から検査する。

- ABC 212からcutoffまでのContest連続性。
- 各Contestの公式task orderとDより後の全Problem。
- AdvancedSlotRegistryの完全性・安定順・矛盾0件。
- Problem集合とTechnique Inventory集合の一致。
- 全ProblemのTag、Outcome、Placement、Learning Unit/Tag collection到達性。
- ProblemAuthoringUnit、Source、Correction Impact。Claim、Example、Exercise、Assessment、Answerはauthoring unitの同一file transitionに含める。
- Tag/Outcome/Unit DAGと生成順。
- contest matrix、list alternative、search、LearningRecord shared route contract。
- build、link、accessibility、client bundle、performance、zero-cost inventoryの適用check。

成功したcheck URLはCIがrelease metadataの`validationResultsUrl`へ設定する。失敗時はmergeを拒否し、Problem別理由をPublicationUpdateへ残す。

## `abc:review` — HumanContentReviewEvidence取込

```bash
npm run abc:review -- --update UPDATE_ID --evidence PATH
```

evidenceは次を満たさなければならない。

- Work Manifestのscope、Catalogのcurrent subject、PublicationUpdateの対象範囲が一致する。
- manifestのreview policyと同じ`reviewMode`を記録する。通常は`self`、高リスク時は原則`third_party`とし、`highRiskSelfReviewReason: solo_maintainer`が固定された場合だけ高リスクでも`self`を許可する。
- `self`ではmanifest ownerがOutcome coverageを確認し、`third_party`ではauthor外のreviewerが確認する。high-risk selfでも全適用check、明示approval、review basis、blocking finding 0件を省略しない。
- 全applicable checkの`executedByReviewerId`が証跡のreviewerと一致し、同じsubjectのresultと一致する。
- 完全自動化不能な新規・変更Claim/Exampleの全itemをreviewerが判定し、self/third-partyの表示を混同しない。
- current Constitution 3.0.0とdependent template inventoryを含むConstitution Checkが成功する。
- blocking finding 0、`aggregatePassed=true`。

他者/CI実行結果の追認、複数reviewerへのcheck分割、review policyにない第三者必須化、独自owner approval、LLM result、learner self-studyをHumanContentReviewEvidenceの代用として拒否する。必要reviewとCI checkはprotected mainのmerge条件にする。

## `abc:deploy` — Git commitの静的デプロイ

```bash
npm run abc:deploy -- --metadata release-metadata.json
npm run abc:deploy -- --rollback-to RELEASE_COMMIT
```

通常デプロイのmetadataはprotected mainへのmerge後にCIが確定commitと検証runから生成し、`version`、`cutoffAt`、full Git `commit`、更新概要、HTTPSの`validationResultsUrl`だけを持つ。protected-main所属とrequired checksはCIのmerge/deploy workflowが保証し、deployment adapterへ重複実装しない。adapterはcommitがrepository内の既知commitへ完全一致することを確認し、同一adapter内の要求を直列化して静的hostへcommitを渡す。候補state、owner approval、publication window、独自digest、append-only receiptは作らない。

rollbackはcommitだけを受け取り、静的hostの公開履歴からそのcommitに記録済みのrelease metadataを取得して同じadapterで再deployする。呼び出し元がrollback用metadataを再指定することはできない。公開履歴・実行中lock・retry・deploy結果は静的hostのdeployment adapterの責務であり、Catalogやrelease metadataへtransaction stateを複製しない。ローカルfilesystem公開が将来必要になった場合だけ、同一directoryのtemp→renameを別adapterとして追加する。

## Read-only commands

```bash
npm run abc:status -- --id UPDATE_ID
npm run catalog:validate -- --input PATH --evidence-inventory PATH
npm run catalog:build -- --input PATH --output PATH --evidence-inventory PATH
npm run verify:merge -- --evidence PATH
```

- `abc:status`はPublicationUpdateのstate、Problem別result、hold/resume、check/reviewを表示する。
- `catalog:validate`はCatalog schemaと意味制約を検査し入力を変更しない。
- `catalog:build`は確定Releaseまたはfixtureから派生indexを指定outputへ生成し、公開正本を変更しない。
- 両CLIは任意のmanifestを引数で信頼しない。Catalogのrelease recordから`docs/work-manifests/`と`staging/updates/`の正規recordを一意に解決し、CIが提供する保護済みremote-tracking base ref（`GITHUB_BASE_REF`、ローカル既定は`origin/main`）からwork manifest、Catalog、content treeの基準を読み、`src/content/`の実ファイルinventoryをmerge前に再構築する。base refはCLI引数から選択できず、任意SHAの指定、`HEAD`自身、baseからの更新を含む未固定manifest、base/current Catalogで再現できないoperationやCorrection Impactは拒否する。
- `verify:merge`はWork Manifest、logical subject、review modeに応じた同一reviewerのcheck実行、必要時のみauthor外review、Constitution Check、finding 0を検証する。
