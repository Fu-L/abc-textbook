# Data Model: ABC上級問題体系化教科書

**Updated**: 2026-07-19

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

### PreviewCohortCandidatePool

`initial-v1`のcohortを選ぶために、候補範囲の公式metadataから作る軽量な選定入力である。`staging/previews/<preview-id>/candidate-pool.json`に保存し、previewのTechnique Inventoryや公開taxonomyとは別のnamespaceで管理する。

| Field | Rule |
|---|---|
| `problemId` / `contestNumber` / `officialTaskOrder` | 公式metadataから取得した安定識別子と公式順 |
| `advancedLabel` | Dより後の公式task label |
| `sourceRevisionIds` | 問題の存在、順序、label、分類候補の根拠 |
| `candidateDomains` / `candidateOutcomeIds` | 公式根拠から作った軽量な分野・成果候補。完全なTechniqueInventoryではない |
| `selectionEligible` / `exclusionReason` | cohort選定に使えるかと、使えない場合の具体的理由 |
| `fixtureId` | fixture由来なら実データと区別するID、実データならnull |
| `candidatePoolDigest` | 全候補とSource Revisionを含む不変digest |

候補分類は主解法・証明・計算量を確定する完全棚卸しではなく、選定規則を機械的に評価するためのsource-backedな入力に限る。Tag、LearningUnit、canonical Problemの分類を作成してはならず、T037のcohort manifestはこのpoolのdigestを固定した後にだけ生成できる。

### PreviewSnapshot

全コーパス完成前に設計を実データで検証するprivate previewの不変snapshotである。公開Catalogのentityではなく、唯一の正本を`staging/previews/<preview-id>/snapshots/<joinDigest>.json`に保存する。同じpreviewを再検証しても既存snapshotを上書きせず、新しいjoin digestのsnapshotを追加する。

| Field | Rule |
|---|---|
| `previewId` | `initial-v1`などの版付き安定ID |
| `manifestDigest` | T037でfreezeしたcohort manifestの不変digest |
| `candidatePoolDigest` | cohort選定に使ったPreviewCohortCandidatePoolのdigest |
| `problemIds` | 4分野、8 Problem以上、3 Contest以上、2 advanced label以上を満たす選定集合 |
| `sourceRevisionIds` | 選定根拠のSource Revision集合。fixture使用時はfixture IDを別記録 |
| `provisionalTaxonomyDigest` | 仮Tag/Outcome/Unit/DAG/Placementのdigest。canonical taxonomyのdigestとは別物 |
| `componentDigests` | metadata、inventory、content、UI/search、LearningRecord、update simulationの各digest |
| `authoringSkillVersion` / `authoringSkillDigest` | preview content/updateが使用したT064の版付きskill。component subjectと一致しなければならない |
| `checkResultIds` | joinで再確認した全適用checkの結果ID集合。欠落・失敗・stale subjectを許可しない |
| `reviewEvidenceIds` | componentとjoinのcurrent-subject self/third-party review evidence集合。review policyとmodeが一致しなければならない |
| `joinDigest` | frozen manifest、component digest、check結果、review evidenceを含む不変のjoin digest |
| `holdReason` | 条件未達または検証失敗時の具体的理由。PASS時はnull |
| `status` | `draft`, `on_hold`, `passed`。`passed`でも公開Releaseへ昇格しない |

Previewはcanonical `Problem.id`、`SourceRevision.id`、`LearningRecord.problemId`を再採番してはならない。previewのcontentと仮taxonomyはnamespace付きpathに隔離し、公開catalog loaderとPagefindから除外する。

### PreviewSnapshotReference

監査・検索用の派生参照であり、`PreviewSnapshot`の複製ではない。`docs/verification/previews/<preview-id>/preview-join/<joinDigest>.json`に保存し、合否の正本は常にcanonical snapshotへ解決する。

| Field | Rule |
|---|---|
| `previewId` / `joinDigest` | 参照対象のpreviewとcanonical snapshotを識別する |
| `canonicalSnapshotPath` | `staging/previews/<preview-id>/snapshots/<joinDigest>.json`の固定path |
| `canonicalSnapshotDigest` | 参照作成時に読み取ったcanonical snapshotのdigest |
| `status` | canonical snapshotから再計算した表示用status |
| `transactionId` | PreviewSnapshotCommitのID |

参照はcanonical snapshotが存在し、path上の内容が`joinDigest`と一致した後にだけ作成する。参照の欠落・古さはcanonical snapshotの再作成を意味せず、再実行で参照だけを修復できる。参照単体を`passed`の証拠として扱ってはならない。

### PreviewSnapshotCommit

canonical snapshotと派生参照を異なるdirectoryへ書く処理を追跡するtransaction manifestである。`staging/previews/<preview-id>/transactions/<joinDigest>.json`に保存し、phase更新自体も同じdirectory内の一時ファイルからrenameして行う。

| Field | Rule |
|---|---|
| `transactionId` / `joinDigest` | 一回のjoin結果に対する安定ID |
| `canonicalSnapshotPath` / `referencePath` | 二つの保存先を明示する |
| `phase` | `prepared`、`snapshot_committed`、`reference_committed`、`verified`、`recovery_required`の単調な状態 |
| `canonicalSnapshotDigest` | commit後に検証したcanonical snapshotのdigest |
| `recoveryReason` | 中断・I/O失敗・stale参照などの具体的理由。正常時はnull |

canonical snapshotは同じdirectory内の一時ファイルから一回だけrenameしてcommitし、既存pathを上書きしない。参照はその後に別の一時ファイルからrenameする。二つのdirectoryをまたぐ処理全体を一つのfilesystem atomic operationとはみなさず、途中停止時はtransaction manifestを読み、canonical snapshotを正本として参照を再生成または保留する。

### TaxonomyIntegrationMap

Previewの仮taxonomyを全コーパスから再生成したfinal taxonomyへ統合する監査正本である。`docs/verification/previews/<preview-id>/taxonomy-integration.json`へ保存する。

| Field | Rule |
|---|---|
| `previewEntityId` / `previewEntityKind` | 仮Tag、Outcome、Unitのnamespace付きID |
| `action` | `promote`, `merge`, `split`, `retire`のいずれか一つ |
| `finalEntityIds` | `promote`/`merge`は一つ、`split`は二つ以上、`retire`は空 |
| `affectedProblemIds` | 仮entityが参照した全Problem。split時は各final entityへの再分類結果も保持 |
| `rationale` / `evidenceIds` | 定義、前提、成果、代表性、全inventoryとの比較根拠 |
| `aliasOrRedirects` | merge/retire時の旧名称・旧IDの検索/参照移行 |
| `reviewMode` / `reviewEvidenceId` | major classification changeを含む場合は`third_party`、それ以外は固定policyに従う |
| `status` | `proposed`, `accepted`, `rejected`。未acceptedはcanonicalへmaterialize不可 |

Integration mapは仮DAGをfinalへコピーする記録ではない。final Inventory全件からTag/Outcome/UnitのDAG、標準順、ProblemPlacementを再計算した結果と照合し、未知参照、循環、未分類Problem、影響未列挙が0件の場合だけ`accepted`にできる。

### FinalTaxonomyBuild

全コーパスのTechnique Inventoryとpreview統合結果から一度だけ生成し、T047–T050がcanonical entityへmaterializeする前のfinal taxonomy受理単位である。候補は`staging/taxonomy/`に置き、未`accepted`の候補を`src/content/`や公開catalogへ読み込んではならない。

| Field | Rule |
|---|---|
| `inventoryDigest` | T044で完全一致を確認した全Problem/TechniqueInventory集合のdigest |
| `previewSnapshotDigest` | T154の`passed` snapshot。preview成功を全件coverageの代替にしない |
| `integrationMapDigest` | 仮Tag/Outcome/Unit全件の`promote`/`merge`/`split`/`retire`対応表 |
| `taxonomyDigest` | final Tag/Outcome/LearningUnit候補、定義、成果、代表問題のdigest |
| `tagDagDigest` / `learningUnitDagDigest` | 別々に再計算した前提DAGと未知参照・循環なしの証跡 |
| `orderDigest` / `placementDigest` | 決定的標準順と全ProblemPlacementのdigest |
| `correctionImpactDigest` | taxonomy再編が本文、例、演習、解答、順序、索引へ与える影響の全件digest |
| `sourceRevisionIds` | 候補と分類判断の根拠。staleまたは矛盾した根拠は受理不可 |
| `reviewEvidenceIds` | 固定policyに従ったcurrent-subject self/third-party evidence |
| `status` / `acceptedAt` | `proposed`, `accepted`, `rejected`。`accepted`のみT047–T050がmaterialize可能 |

`FinalTaxonomyBuild`は同じ`inventoryDigest`、`previewSnapshotDigest`、policy、入力bytesから同じ結果を得られなければならない。preview候補の名称一致だけでfinal entityを作ること、integration mapの未対応・影響未列挙、final DAGの再計算を省略することを拒否する。

### OutcomeProblemShardManifest

最終ProblemPlacementから決定生成される、解説作業の最小追跡単位である。Contest batchやdomainの進捗表ではなく、各shardを単独でbuild・review・previewできるwork manifestとして扱う。

| Field | Rule |
|---|---|
| `shardId` | `outcomeId`と安定ordinalから導出し、Problemの表示名変更で変えない |
| `primaryOutcomeId` | ちょうど一つ。Problemのprimary outcomeと一致する |
| `problemIds` | 1〜8件、canonical official orderの連続chunk、shard間で重複なし |
| `problemIds` | 所有するProblem authoring unitの完全な集合。本文内blockへ独立entity IDを付けない |
| `paths` | shard専有のcanonical/staging path集合。別shard・共有Unit/Tag pathとの重複を拒否 |
| `dependencyShardIds` | 前提を満たすために必要なshardの集合。循環不可 |
| `checkIds` / `evidencePaths` | source、structure、example、answer、link、accessibility、review、previewの適用checkと出力先 |
| `status` | `generated`, `in_progress`, `on_hold`, `reviewed`, `joined` |

shard indexのProblem ID集合は、final Catalogの全対象Problem集合と完全一致しなければならない。生成順やshard境界の変更は、同じ入力からindexを再生成し、旧indexとの差分と影響するLearningRecord以外のCorrectionImpactを残して行う。

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
AssessmentはProblem authoring unitのExercise内にco-locateし、Outcomeへ直接紐付ける。

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
| `authoringUnit` | Problem単位本文参照 |
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
| `primaryProblemId` | similar/supplementで必須。参照先はfull authoring unitを持つProblem |
| `sharedOutcomeIds` | similar/supplementで一つ以上 |
| `comparison` | 解法、証明、計算量、制約、前提、実装差 |
| `additionalElement` | supplementではちょうど一つ、similarではnone明示 |
| `rationale` / `evidenceIds` | 判定根拠 |

`full`が既定である。新しい主成果、前提、主解法、証明着眼点、漸近計算量があれば`full`以外を拒否する。

## 4. Problem authoring unit and evidence

### Entity化の判断基準

独立entityは「所有者と別のライフサイクルを持つ」または「複数ownerから参照される」対象に限定する。Problem、Technique Tag、Learning Outcome、Learning Unit、Source Revision、Correction Impactは独立entityとする。Claim、Example、Exercise、Assessment、AnswerはProblem本文と同時に変更されるため独立entityにしない。

### ProblemAuthoringUnit

一問分の本文、frontmatter、Claim、Example、Exercise、Assessment、Answerを一つのMarkdown authoring unitへco-locateする。`full`では独立本文、`similar`/`supplement`では`primaryProblemId`と差分本文を持つ。Catalog上のidentityは既存`problemId`であり、別のExplanation IDを作らない。

必須参照はProblem、Learning Outcome、baseline、追加前提、excludedTopics、Technique Tag、Source Revision、authoring skill version/digestである。完全解説は考察、典型、問題固有要素、復習助言、正当性、時間・空間計算量、制約整合、実装注意を明示する。

文書内のClaim、Example、Exerciseはdocument-localな`key`を持つ。このkeyは実行manifestやreview evidenceから`(problemId, key)`で対象を特定するためのlocatorであり、Catalog entity IDや別artifactへの参照ではない。

### AuthoringSkillRevision

解説とupdate authoringが参照する、版付きで自己完結した執筆契約である。T064で作成し、preview componentと全ProblemAuthoringUnitから同じ版・digestへ追跡できなければならない。

| Field | Rule |
|---|---|
| `version` / `digest` | skill本文、references、templates、input/output contractのcanonical digest |
| `inputRequirements` | source revision、制約、確認日、利用条件、Problem/Outcome前提の必須入力 |
| `outputContract` | ProblemAuthoringUnitと内包blockの必須構造、不足時の状態 |
| `referencePaths` / `templatePaths` | skillから直接解決できるrepo-relative path。root promptへの暗黙依存を許可しない |
| `sourceNormalizationVersion` | 公式根拠の正規化規則の版 |
| `status` | `frozen`のみpreview/full authoringの入力として使用可能 |

### Co-located blocks

- Claimは正確な文、Source Revision、author、検証状態を持つ。根拠なし・stale・矛盾状態は公開不可。
- ExampleはLearning Outcome、任意のLearning Unit、種類、言語、省略範囲、環境、入力、手順、期待結果、検証結果を持つ。`executable`だけを実行manifestの必須対象とし、疑似コード・図示例は`not_applicable`とする。
- ExerciseはOutcome、前提、到達条件、観察可能なAssessment、理由または検証方法を含むAnswerを一つのblockに持つ。Answerの検証成功前は公開不可。

### SourceRecord / SourceRevision / CorrectionImpact

SourceRecordは公式URLと訂正系列、SourceRevisionは特定確認版のfingerprint、確認日時、利用条件を持つ。CorrectionImpactは本文と別の訂正ライフサイクルを持つため独立entityとし、影響するauthoring unitのProblem ID、文書内section key、Unit順、派生indexを完全列挙する。

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

- `authoring_unit_draft`: 完成本文と全必須metadataがあり検証対象にできる。
- `authoring_required`: 完全な入力packetと手動templateがあるが本文未完成。
- `blocked`: 根拠不足、deadline、policy変更等の具体的理由と再試行条件がある。

後二者をProblemAuthoringUnit件数へ含めない。

### PublicationUpdate

| Field | Rule |
|---|---|
| `id` / `kind` | 追加、訂正、taxonomy、bootstrap |
| `baseReleaseVersion` | initialではnull |
| `contestId` | Contest追加時に必須 |
| `advancedSlotLabels` | Dより後の全label。固定4枠不可 |
| `targetProblemIds` | 変更種別にかかわらず影響を受けるProblem集合の正本。Problem operationの集合を必ず含む |
| `operations` | pathごとのcanonical file transition。`entityType`/`entityId`はpath所有を検証するanchor、`action`/digestはfile transitionを表す。各operationは、そのpathに対応する実Catalog projection差分を`affectedEntities`へ完全列挙し、base/currentでpathを所有する全entityから導出した`affectedProblemIds`を明示する。全operationのProblem集合は`targetProblemIds`と一致させる |
| `authoringResults` | 全対象Problemへ一つ |
| `correctionImpacts` | 該当時に全件 |
| `validationSummary` | check結果とProblem別理由 |
| `state` | PREPARING/ON_HOLD/ELIGIBLE_FOR_BATCH |

全AuthoringResultが`authoring_unit_draft`かつblocking 0件の場合だけELIGIBLE_FOR_BATCHへ進む。

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

実装・content変更前に作るversion-controlled scopeである。top-levelにtask ID、scope digest、required requirement IDs、learning outcome IDs、固定したreview policy、review units、stateを持つ。review policyは`self`または`third_party`の必須modeと、公式根拠との矛盾・独自証明・重大な分類変更から選ぶrisk reasonを持つ。各review unitは重複しないpaths、item IDs、requirements、outcomes、依存unit、checks、evidence role、owner、statusを持つ。

content review unitはContest batchではなくOutcome/Problem shardまたはProblem authoring unitを対象にする。文書内blockを別review unitへ分割しない。Outcome/Problem shardは一つのprimary Learning Outcomeに属するProblem IDを公式順に最大8件ずつ分割し、paths、Problem IDs、dependency unit、checks、evidenceを単独で解決できなければならない。tooling/abstractionには具体的なmaintenance benefitを必須にする。

### HumanContentReviewEvidence

同じlogical change subjectについて、次を保持する。通常更新の`self` modeではmanifest ownerがreviewerを兼ね、外部person IDを要求しない。固定policyが高リスクを示す場合だけ`third_party` modeを使い、`self` reviewに代えてauthor集合と分離したreviewerが確認する。

- 明示file inventoryとsubject digest
- Outcome coverage reviewとreview mode、reviewer ID
- reviewer自身が実行した全適用check、command、result path/digest、時刻
- 自動化不能な新規・変更Claim/Exampleの完全inventory
- 各itemのauthor IDs、reviewer ID、根拠、判定、finding、解消結果
- aggregate resultと未解決blocking count

### MergeReviewEvidence

Work Manifest、subject digest、HumanContentReviewEvidence、適用check集合、非適用理由、現行constitution version/digest、dependent template inventory、merge可否を結ぶ。self-reviewとthird-party reviewのmodeを保持するが、owner approvalを品質reviewの代用にしない。LLM panelや独立auditorを通常更新の必須roleとして追加しない。

### LearnerOutcomeEvidence

SC-009/SC-010の運用者self-studyを一つのschemaで扱う。protocolはrelease digest、対象item、選定理由、提示順、期待要素、rubric、blocking項目、集計式を回答前に固定する。resultはraw回答、項目別採点、根拠、分子分母、aggregateを同じprotocol digestへ結び付ける。

### UserTimingEvidence

SC-012について、全公開Problem routeが共有LearningRecord component/action contractを使うinventoryと、事前固定した代表Problemの表示完了から二操作・reload確認までのraw timingを持つ。

## 8. Derived indexes

正本から次を決定生成する。

- Contest × AdvancedSlotRegistry matrixと同内容のlist alternative
- Problem detail、authoring unit anchor、Learning Unit、Tag、similar problem route
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
7. 全ProblemAuthoringUnitと内包blockがOutcomeとSourceへ追跡できる。
8. 全実行可能ExampleとAnswerの検証が成功する。
9. 全内部link、用語、代替text、navigationが有効である。
10. 全適用checkとreview policyに応じたselfまたはthird-party reviewがcurrent subjectで成功する。
11. owner approval後にcandidate bytesが変化していない。
12. contest matrix、search、simple local learning managementが公開Problemで利用可能である。
13. private preview、仮taxonomy、未結合shard、preview-only evidenceが公開content treeへ入っていない。
14. `FR-001`/`SC-001`に対応するABC 212〜cutoffの連続性とDより後のProblem 100% coverageを、previewとは独立したfinal candidateから再計算できる。
