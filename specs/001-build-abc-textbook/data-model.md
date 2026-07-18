# Data Model: ABC上級問題体系化教科書

**Updated**: 2026-07-14

## 1. Canonical conventions

- IDはentity種別を含む安定した文字列とし、表示名・章位置・タグ名の変更で変えない。
- 日時はoffset付きRFC 3339で保存し、比較時はUTC instantへ正規化する。
- JSON digestはUnicode NFC検証後のRFC 8785 JCS bytesに対するSHA-256とする。
- repo内pathはslash区切りのrelative pathだけを許し、空segment、`.`、`..`、symlinkを拒否する。
- schema fieldは`src/lib/domain/schema-parts/*.ts`だけが定義し、`schemas.ts`と`index.ts`は再exportに限定する。

## 2. Scope and catalog entities

### Contest

| Field | Rule |
|---|---|
| `id` | `abcNNN`形式の安定ID |
| `number` | 212以上の整数 |
| `title` | 公式名称 |
| `startedAt` / `endedAt` | 公式日時。開催中は対象外 |
| `officialUrl` | AtCoder公式URL |
| `officialTaskOrder` | 公式problem labelを表示順に並べた非空配列 |
| `taskOrderSourceRevisionId` | 順序を確認したSource Revision |
| `checkedAt` | 最終確認日時 |

`officialTaskOrder`内で`D`の位置より後にあるlabelを、そのContestのadvanced labelsとする。Dが見つからない、順序が重複する、取得源同士で順序が矛盾する場合はContest全体を公開保留にする。

### AdvancedSlotRegistry

公開版ごとに一つ持つ、対象範囲内のadvanced problem labelの安定順序である。

| Field | Rule |
|---|---|
| `version` | registry契約版 |
| `labels` | 重複しないlabel配列 |
| `firstSeenContestByLabel` | labelをkey、初出Contest IDをvalueとするmap |
| `orderEvidence` | 公式順を示すSource Revision集合 |
| `digest` | labelsと根拠のcanonical digest |

生成規則:

1. 既存Releaseがある場合は既存registry順を維持する。
2. 各Contestのadvanced labelsをContest番号順に走査する。
3. 未知labelを、そのContestで直前・直後にある既知labelとの順序制約を満たす位置へ追加する。
4. 制約が循環または矛盾する場合は推測せず公開保留にする。

E/F/G/Hは固定enumではない。現在存在する通常labelとしてregistryへ現れるだけで、I、Exその他の新labelも同じ規則で追加する。

### ContestSlotRecord

| Field | Rule |
|---|---|
| `contestId` / `label` | 複合一意key |
| `officialOrder` | Contest内の0以上の順序。公式問題なしではnull |
| `availability` | `exists`, `official_absent`, `unknown`, `withdrawn` |
| `catalogStatus` | `uncollected`, `drafting`, `on_hold`, `published`, `correction_pending` |
| `holdReason` | `unknown`または`on_hold`で必須 |
| `problemId` | `exists`のとき必須 |
| `sourceRevisionId` | 状態根拠 |
| `checkedAt` | 最終確認日時 |

表示状態はavailabilityを優先する。`official_absent`は「公式問題なし」、`unknown`は理由付き「公開保留」、`withdrawn`は「公式取り下げ」、`exists`だけがcatalogStatusの5表示を使う。

### Problem

| Field | Rule |
|---|---|
| `id` | Contest IDと公式labelから導出する安定ID |
| `contestId` / `slotLabel` | 対応slotへ一意に解決 |
| `title` | 公式問題名 |
| `officialUrl` | 公式問題page |
| `constraintsSummary` | 転載を避けた構造化要約 |
| `difficultyEvidence` | 公式情報、前提、対象学習者の段階 |
| `sourceRevisionIds` | 一つ以上 |
| `checkedAt` | 最終確認日時 |
| `publicationStatus` | staging/publication状態 |
| `primaryTagIds` | 一つ以上。正式化後 |
| `secondaryTagIds` | 0件以上 |
| `adHocElements` | 0件以上の問題固有要素 |
| `placementId` | 一つ |

## 3. Corpus-first learning model

### TechniqueInventoryItem

taxonomy作成前に全Problemへちょうど一件作る分析正本である。

| Field | Rule |
|---|---|
| `problemId` | 全対象Problemを一回だけ所有 |
| `sourceRevisionIds` | 判断根拠 |
| `coreMethod` | 主たる解法の短い正規化記述 |
| `proofIdeas` | 証明上の着眼点 |
| `asymptoticComplexity` | 時間・空間計算量 |
| `prerequisiteCandidates` | 必要知識候補 |
| `implementationConcerns` | 実装上の注意 |
| `outcomeCandidates` | 観察可能な学習成果候補 |
| `adHocElements` | 一般化しない要素 |
| `authorId` / `reviewStatus` | 棚卸しの責任と確認状態 |

公開taxonomyを作る前に、対象Problem ID集合とInventoryのProblem ID集合が完全一致しなければならない。

### TechniqueTag

| Field | Rule |
|---|---|
| `id` | 安定Tag ID |
| `name` / `definition` | 正式名と短い定義 |
| `parentId` | Tagまたはnull root |
| `prerequisiteTagIds` | 親関係とは別のDAG |
| `learningOutcomeIds` | 一つ以上 |
| `representativeProblemIds` | 一つ以上 |
| `aliases` / `formerNames` | 全Tagで一意 |
| `lifecycle` | active/deprecated |
| `replacementTagIds` | deprecated時に一つ以上 |

同義Tag、Problem一問だけを言い換えたTag、ad-hoc要素だけのTagを正式化してはならない。

### LearningOutcome

| Field | Rule |
|---|---|
| `id` | 安定Outcome ID |
| `statement` | 学習者が観察可能な動詞で表す |
| `prerequisiteOutcomeIds` | 循環のない集合 |
| `scope` | 対象Tag/Unit/Problem |
| `assessmentIds` | 一つ以上 |

### LearningUnit

| Field | Rule |
|---|---|
| `id` / `kind` | chapter, section, subsection |
| `parentId` | 階層上の親またはnull |
| `baselineId` / `baselineVersion` | 共通前提 |
| `additionalPrerequisiteUnitIds` | 追加前提または空配列 |
| `excludedTopics` | 意図的対象外 |
| `sourceRevisionIds` | 単位本文と所有例の根拠 |
| `tagIds` / `learningOutcomeIds` | 各一つ以上 |
| `explanation` | 単位本文参照 |
| `exampleIds` | 一つ以上 |
| `problemIds` | 一つ以上 |
| `assessmentIds` | 一つ以上 |
| `stageRank` / `difficultyRank` / `representativeRank` | 0以上の整数 |
| `globalIndex` / `orderReason` | 生成順と説明 |

親子関係と前提関係は別に検証する。標準順は前提DAGをhard constraintとし、入次数0の候補だけを3 rank、最後にUnit IDのUTF-8 byte順で比較する。

### ProblemPlacement

| Field | Rule |
|---|---|
| `id` / `problemId` | Problemごとに一つ |
| `policyVersion` | 判定policy版 |
| `kind` | full/similar/supplement |
| `primaryExplanationId` | similar/supplementで必須 |
| `sharedOutcomeIds` | similar/supplementで一つ以上 |
| `comparison` | 解法、証明、計算量、制約、前提、実装差 |
| `additionalElement` | supplementではちょうど一つ、similarではnone明示 |
| `rationale` / `evidenceIds` | 判定根拠 |

`full`が既定である。新しい主成果、前提、主解法、証明着眼点、漸近計算量があれば`full`以外を拒否する。

## 4. Explanation and evidence entities

### Explanation

Problemに対応する学習用本文で、`full`では独立本文、`similar`/`supplement`では主要解説への参照と差分本文を持つ。

必須参照はProblem、Learning Outcome、baseline、追加前提、excludedTopics、Technique Tag、Source Revision、Technical Claim、Reproducible Example、authoring skill version/digestである。完全解説は考察、学ぶべき典型・ad-hoc要素、助言、正当性、計算量、制約整合、実装注意、例または検証手順を持つ。

### TechnicalClaim

検証可能な主張を安定ID、正確な文、Source Revision、author、検証状態、Correction Impactで表す。根拠なし・stale・矛盾状態は公開不可。

### ReproducibleExample

ExplanationまたはLearning Unitの少なくとも一方に所有され、Learning Outcome、環境、入力、手順、期待結果、検証方法、結果を持つ。疑似コード・省略は種類と範囲を直近でlabelする。

### Exercise / Assessment / AnswerMaterial

- ExerciseはProblem（null不可）、Outcome、前提、到達条件、Assessment、AnswerMaterialを結ぶ。
- Assessmentは観察可能な成功条件を持つ。
- AnswerMaterialは最終答案だけでなく理由または検証方法、procedure、期待結果、検証結果を持つ。

### SourceRecord / SourceRevision / CorrectionImpact

SourceRecordは公式URLと訂正系列、SourceRevisionは特定確認版のfingerprint、確認日時、利用条件を持つ。CorrectionImpactは変更による本文、Claim、Example、Exercise、AnswerMaterial、Unit順、派生indexの影響を完全列挙する。

## 5. Learning records

### LearningRecord

| Field | Rule |
|---|---|
| `problemId` | 主key |
| `status` | not_started/in_progress/completed |
| `statusUpdatedAt` | 未変更ならnull |
| `needsReview` | boolean |
| `needsReviewUpdatedAt` | 未変更ならnull |

status操作はstatus組だけ、needsReview操作はneedsReview組だけを更新する。Catalogへ新Problemが増えてもrecordを先行作成せず、join時に未着手・要復習なし・更新記録なしを表示する。

### LearningRecordBackup

schema version、createdAt、targetReleaseVersion、全record、不明Problem IDを持つ。import previewはnew、updated、same、unknown、invalidをitemと件数で返す。適用policyはcomponentごとのnewer-wins、backup-wins、cancelを明示し、一transactionで適用する。

## 6. Update and release entities

### AuthoringResult

- `explanation_draft`: 完成本文と全必須metadataがあり検証対象にできる。
- `authoring_required`: 完全な入力packetと手動templateがあるが本文未完成。
- `blocked`: 根拠不足、deadline、policy変更等の具体的理由と再試行条件がある。

後二者をExplanation件数へ含めない。

### PublicationUpdate

| Field | Rule |
|---|---|
| `id` / `kind` | 追加、訂正、taxonomy、bootstrap |
| `baseReleaseVersion` | initialではnull |
| `contestId` | Contest追加時に必須 |
| `advancedSlotLabels` | Dより後の全label。固定4枠不可 |
| `targetProblemIds` | 変更種別にかかわらず影響を受けるProblem集合の正本。Problem operationの集合を必ず含む |
| `operations` | canonical entity差分。各operationは`affectedProblemIds`で所有・影響Problem集合を明示し、全operationの和集合を`targetProblemIds`と一致させる |
| `authoringResults` | 全対象Problemへ一つ |
| `correctionImpacts` | 該当時に全件 |
| `validationSummary` | check結果とProblem別理由 |
| `state` | PREPARING/ON_HOLD/ELIGIBLE_FOR_BATCH |

全AuthoringResultが`explanation_draft`かつblocking 0件の場合だけELIGIBLE_FOR_BATCHへ進む。

### ReleaseCandidate

状態遷移（release versionは全契約で`YYYY.MM.DD`形式）:

```text
DRAFTED
  -> VALIDATING
  -> AWAITING_REVIEW
  -> AWAITING_OWNER_APPROVAL
  -> AWAITING_FINAL_VALIDATION
  -> READY_TO_PUBLISH
  -> PUBLISHED
```

どの状態からも未完成、stale、expiry、検証失敗でON_HOLDへ移れる。candidateは一つ以上のELIGIBLE update、cutoff、AdvancedSlotRegistry、固定content tree、実ファイルinventory digest、論理catalog snapshot digest、work manifest digest、check refs、HumanContentReviewEvidence、owner approval、publication windowを持つ。owner approvalのapprovable digestは実ファイル、論理snapshot、manifestをすべて束縛する。reviewやapprovalは個別Updateではなくcandidateが所有する。

### Release

release version、cutoff、AdvancedSlotRegistry、実ファイルinventory digest、論理catalog snapshot digest、取り込んだupdate IDs、追加・変更・取り下げ問題、taxonomy変更、検証要約、review evidence refs、履歴を持つimmutable record。両digestは対象が異なるため同値を要求しない。未公開ON_HOLD試行は含めず、staging statusから参照する。

### PublishReceipt

candidate ID、release version、approved digest、公開前後tree digest、切替日時、結果を持つ。Release contentからは参照せず、公開transactionの外部append-only記録とする。

## 7. Review entities

### ContentWorkManifest

実装・content変更前に作るversion-controlled scopeである。top-levelにtask ID、scope digest、required requirement IDs、learning outcome IDs、review units、stateを持つ。各review unitは重複しないpaths、item IDs、requirements、outcomes、依存unit、checks、evidence role、owner、statusを持つ。

content review unitはContest batchではなくLearning Outcome、Problem、Claim、Example、Exercise等の独立対象にする。tooling/abstractionには具体的なmaintenance benefitを必須にする。

### HumanContentReviewEvidence

同じlogical change subjectについて、次を保持する。

- 明示file inventoryとsubject digest
- Outcome coverage reviewとgate reviewer ID
- gate reviewer自身が実行した全適用check、command、result、raw path/digest、時刻
- 自動化不能な新規・変更Claim/Exampleの完全inventory
- 各itemのauthor IDs、author外reviewer ID、根拠、判定、finding、解消結果
- aggregate resultと未解決blocking count

### MergeReviewEvidence

Work Manifest、subject digest、HumanContentReviewEvidence、適用check集合、非適用理由、現行constitution version/digest、dependent template inventory、merge可否を結ぶ。LLM panel、独立auditor、owner approvalを別の必須review roleとして追加しない。

### LearnerOutcomeEvidence

SC-009/SC-010の運用者self-studyを一つのschemaで扱う。protocolはrelease digest、対象item、選定理由、提示順、期待要素、rubric、blocking項目、集計式を回答前に固定する。resultはraw回答、項目別採点、根拠、分子分母、aggregateを同じprotocol digestへ結び付ける。

### UserTimingEvidence

SC-012について、全公開Problem routeが共有LearningRecord component/action contractを使うinventoryと、事前固定した代表Problemの表示完了から二操作・reload確認までのraw timingを持つ。

## 8. Derived indexes

正本から次を決定生成する。

- Contest × AdvancedSlotRegistry matrixと同内容のlist alternative
- Problem detail、Explanation anchor、Learning Unit、Tag、similar problem route
- Problem/Tag/Learning Unit/Contest種別付きsearch document
- standard learning sequenceと前後navigation
- Tag treeとTag別problem collection
- static attributesとlocal LearningRecordをjoinするproblem/review list
- Release historyとstaging status summary

検索documentへstaging、非公開entity、deprecated route、LearningRecordを混入させない。

## 9. Publication invariants

公開前に少なくとも次を全件検査する。

1. ABC 212からcutoffまでContest番号が連続する。
2. 各ContestのDより後の全公式ProblemがCatalogに存在する。
3. AdvancedSlotRegistryが全Contest orderと矛盾せず、新labelを欠落させない。
4. Problem集合とTechnique Inventory集合が一致する。
5. 全ProblemがTagとLearning UnitまたはTag collectionから到達可能である。
6. Tag/Unit/Outcome prerequisite graphに循環・未知参照がない。
7. 全Explanation/Example/Exercise/AnswerMaterialがOutcomeとSourceへ追跡できる。
8. 全実行可能Example/AnswerMaterialの検証が成功する。
9. 全内部link、用語、代替text、navigationが有効である。
10. 全適用checkと必要なauthor外human reviewがcurrent subjectで成功する。
11. owner approval後にcandidate bytesが変化していない。
12. contest matrix、search、simple local learning managementが公開Problemで利用可能である。
