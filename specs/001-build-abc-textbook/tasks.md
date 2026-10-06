# Tasks: ABC上級問題体系化教科書

**Input**: Design documents from `/specs/001-build-abc-textbook/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Validation**: 自動化可能な検査は Vitest/Playwright/Ajv/build CLI で先に失敗を確認してから実装する。通常更新はmanifest ownerのself-reviewで完結し、高リスク項目は原則として作成者外のthird-party reviewへ送る。solo maintainerでは全risk reasonと`solo_maintainer`理由を固定したhigh-risk self-reviewを許可する。private previewはstaging/public分離を検証し、Outcome/Problem shardはshard単位でbuild・review・previewした後に全件joinを行う。T094/T111/T126はpreview専用のcomponent evidenceを固定し、production/full-corpus evidenceはT154後の別taskで作成する。PreviewSnapshotはcanonical snapshot一箇所を正本とし、別directoryの派生referenceとtransaction recoveryを検証する。

**Organization**: User Story ごとに独立検証可能な phase を置く。Foundational完了後に、複数分野・複数Contest・複数labelのprivate vertical previewを同じ実装経路で一周させる。その後に全コーパスのInventoryとfinal taxonomyをjoinし、US1の解説はOutcome/Problem shard単位で生成・追跡する。P1のUS2を設計上先行させるのは、final taxonomyの所有権を確定するためであり、previewを全件完了まで遅延させる理由にはしない。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 未完了taskへ依存せず、別fileで並行実行できる
- **[Story]**: 対応する User Story
- すべての task は実行対象の正確な file または directory path を含む

## Delivery Contracts: Preview, Taxonomy Integration, and Shards

### Private vertical preview milestone (`initial-v1`)

`initial-v1`は公開Releaseではなく、`staging/previews/initial-v1/`と`docs/verification/previews/initial-v1/`だけに保存する設計検証用snapshotである。T028–T031でcohortの選定規則と失敗テストをfreezeし、T032で候補範囲の公式metadataとsource-backedな軽量候補分類poolを取得・検証した後、T037で実際のcohort manifestをfreezeする。preview componentは全コーパスbatchを待たずに同じcohortを入力として通し、次の完了証跡を出す。

- metadata/inventory/provisional taxonomy: `docs/verification/previews/initial-v1/components/metadata-inventory-taxonomy.json` (T045)
- four-domain learning content: `docs/verification/previews/initial-v1/components/content/<domain>.json` (T051–T054)
- local LearningRecord: `docs/verification/previews/initial-v1/components/learning-records.json` (T094)
- static UI/search: `docs/verification/previews/initial-v1/components/ui-search.json` (T111)
- update/release simulation: `docs/verification/previews/initial-v1/components/update-simulation.json` (T126)

T154は上記の固定artifact、T064がfreezeした`docs/verification/authoring-skill/initial-v1/skill-manifest.json`、および`staging/previews/initial-v1/preview-manifest.json`だけをjoinする。T127–T153のcanonical full route、production release validation/deploy、initial-release reviewはpreviewの入力にしてはならない。preview専用の別catalog、UI、LearningRecord、update実装は作らない。snapshotの正本は`staging/previews/initial-v1/snapshots/`だけに置き、`docs/verification/previews/initial-v1/preview-join/`にはcanonical pathとdigestを持つ`PreviewSnapshotReference`だけを置く。

同じtaskを二度手書きで複製しないため、preview scopeとfull scopeは共通実装へ別々のfixture/catalogを渡す。previewの依存列は`T028–T032 (rules/tests, candidate pool, and metadata) → T037 (cohort freeze) → T038 (preview inventory) → T045/T046 (provisional taxonomy) + T064 (versioned authoring skill) → T051–T054 (four-domain preview content only) → T083–T094 (LearningRecord preview) / T099–T111 (UI/search preview) / T116–T126 (update simulation preview) → T154 (join gate)`とする。fullの依存列は`T032–T044(full inventory) + T154 PASS → T159 (full-corpus taxonomy synthesis and acceptance) → T047–T050 (canonical materialization)`とし、T055–T056/T155–T158(full LearningUnit content)はT050後に、T064(authoring/source prerequisites)はT061–T063後に進める。T065(frozen shard index)はT049、T064、T154の完了後に実行し、T066–T071はそのindexへ依存する。T160(full public route/search projection)はT057/T075/T076/T078完了後に一度だけpreview sourceからcanonical full-corpus sourceへ切り替える。US3/US4/US5のcanonical full workはT154後も継続する。T154はpreview component artifactだけを入力にし、preview scopeはfull scopeの完了を待たない。

cohortの完了条件は次の通りである。

- graph/search、dynamic-programming、data-structures/algorithm-design、mathematics/combinatoricsの4分野、8 Problem以上、3 Contest以上、2種類以上のadvanced labelを含む。実データだけで条件を満たせない場合は、使用fixtureと実データをmanifestで分離する。
- `official metadata → Technique Inventory → provisional taxonomy/placement → ProblemAuthoringUnit/LearningUnit inline content → static UI/search → local LearningRecord → update/release simulation`を同一preview digestで完走する。
- source、claim、example、answer、link、accessibility、schema、rollback、idempotencyの適用checkがすべて成功し、問題ごとに到達先とhold reasonが存在する。
- review policyに応じたself/third-party evidenceがcurrent preview digestへ結び付く。preview成功はFR-001/SC-001の全件coverageを意味せず、preview artifactは公開candidateへ入らない。

### Provisional taxonomy integration

`staging/previews/initial-v1/taxonomy/`の仮Tag/Outcome/Unitは、全Problem Inventoryが揃うまでcanonical contentへmaterializeしない。T045–T046はpreview候補と仮entityの証跡だけを作り、T159がT044の全InventoryとT154のPASSを入力に、final Tag/Outcome/Unit候補、三つの直接前提DAG、全ProblemPlacement、全仮entityの`promote`、`merge`、`split`、`retire`対応を一つの`FinalTaxonomyBuild`として決定生成する。T159はpreview ID、final ID、影響Problem ID、根拠、review mode、alias/redirect、CorrectionImpactを`docs/verification/previews/initial-v1/taxonomy-integration.json`へ固定し、policy-selected review後にacceptする。仮DAGをコピーせず、全Inventoryからfinal結果を再計算する。未対応entity、未列挙影響、未知参照、循環、未分類Problemが一つでもあればacceptをholdする。T047–T050はaccepted `FinalTaxonomyBuild`をcanonical entityへmaterializeするだけで、previewだけからTag/Unitを作ってはならない。

### Generated Outcome/Problem shard contract

T065はfinal taxonomy/placementとT154の`passed` snapshotを入力に、`docs/work-manifests/initial/problem-authoring-units/index.json`を一度だけ生成・freezeする専用taskである。T066–T071はこの固定indexからOutcome/Problem shard work itemを生成・ディスパッチする6つの独立taskであり、生成単位は`primaryOutcomeId`ごとにProblem IDを公式順で並べた最大8件の連続chunkとする。各domain manifestは同じ`indexDigest`を記録し、join時に再計算して一致を検証する。

- `shardId`、明示的なProblem IDとClaim・任意のExampleのdocument-local locator、前提shard、所有path、required checks、evidence path、review policy、preview status、固定`indexDigest`
- 一問分の本文とClaim（Example、Exercise、Assessment、Answerは任意）を含む`src/content/docs/problems/<outcome>/<shardId>/`と`docs/work-manifests/initial/problem-authoring-units/<outcome>/<shardId>/`の非重複path
- shard単独のsource/structure/link/accessibility検証と、含まれるexample/answerの検証（不在はnot_applicable）、current-subject review evidence、private preview snapshot

一つのshardが別shardのcanonical file、共有LearningUnit、共有Tagを編集してはならない。shard ID集合とProblem ID集合の全件join、重複0件、未割当0件はT075/T078とfinal release gateで再計算する。Problem数やOutcome数が変わっても、手書きの一括taskを追加せずindex generatorを再実行してshard work itemを生成する。

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 追加費用なしの静的教材、local CLI、検証環境を固定する。

- [X] T001 Initialize the Node.js 24/TypeScript 6 project, pin all production and validation dependencies, and define npm scripts in `package.json`, `package-lock.json`, `.nvmrc`, and `.npmrc`
- [X] T002 [P] Configure strict ESM TypeScript, linting, formatting, and repository text normalization in `tsconfig.json`, `eslint.config.js`, `prettier.config.mjs`, and `.gitattributes`
- [X] T003 [P] Configure Astro 7, Starlight, project-base-aware static output, CSP, and Pagefind in `astro.config.mjs` and `src/styles/global.css`
- [X] T004 Define all structured content collections and loader boundaries in `src/content.config.ts`
- [X] T005 [P] Configure Vitest, Playwright Chromium/Firefox/WebKit, axe, and deterministic test clocks in `vitest.config.ts`, `playwright.config.ts`, and `tests/setup/fixed-clock.ts`
- [X] T006 Create the planned source, staging, evidence, and test directory skeleton with ownership notes in `src/README.md`, `staging/README.md`, `docs/README.md`, and `tests/README.md`
- [X] T007 [P] Create offline official-source, future-label, correction, failure-injection, and design-limit fixture inventories in `tests/fixtures/README.md` and `tests/fixtures/manifest.json`
- [X] T008 Document local-only setup, exact tool versions, zero-cost assumptions, and command conventions in `docs/operations/development.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: すべての story が共有する正本 schema、公式順、安定ID、検証・review gateを実装する。

**⚠️ CRITICAL**: この phase が完了するまで corpus data や公開 content を作らない。

- [X] T009 [P] Add failing Zod-to-JSON-Schema parity and unknown-field rejection tests for every contract in `tests/contract/schema-parity.test.ts`
- [X] T010 [P] Add failing official task-order tests covering missing H, future I/Ex labels, duplicate labels, and order conflicts in `tests/unit/advanced-slot-registry.test.ts`
- [X] T011 [P] Add failing stable-ID, RFC 3339 offset, digest, DAG-cycle, and deterministic-topological-order tests in `tests/unit/domain-invariants.test.ts`
- [X] T012 [P] Add failing PublicationUpdate and review-completeness gate tests in `tests/unit/publication-update.test.ts`
- [X] T013 Define Contest, AdvancedSlotRegistry, ContestSlotRecord, Problem, TechniqueInventoryItem, TechniqueTag, LearningOutcome, LearningUnit, ProblemPlacement, source, ProblemAuthoringUnit, co-located content block, and owner-qualified evidence/correction locator Zod shapes in `src/lib/domain/schema-parts/catalog.ts` and `src/lib/domain/schema-parts/authoring-unit.ts`
- [X] T014 [P] Define LearningRecord and versioned backup/preview/merge Zod shapes without account or sync fields in `src/lib/domain/schema-parts/learning.ts`
- [X] T015 [P] Define PublicationUpdate, AuthoringResult, and Git-based ReleaseMetadata Zod shapes in `src/lib/domain/schema-parts/release.ts`
- [X] T016 [P] Define ContentWorkManifest review policy, self/third-party HumanContentReviewEvidence, MergeReviewEvidence, LearnerOutcomeEvidence, and UserTimingEvidence Zod shapes in `src/lib/domain/schema-parts/review-evidence.ts`
- [X] T017 [P] Define performance, executable-example, answer-material, instruction-quality, and client-bundle evidence Zod shapes in `src/lib/domain/schema-parts/verification-evidence.ts`
- [X] T018 Re-export schema-part definitions without redefining shapes in `src/lib/domain/schemas.ts` and expose the domain public API in `src/lib/domain/index.ts`
- [X] T019 Generate every `specs/001-build-abc-textbook/contracts/*.schema.json` from the canonical Zod shapes and fail on drift in `scripts/generate-json-schemas.ts`
- [X] T020 [P] Implement stable entity IDs, canonical JSON, SHA-256 digests, and offset-preserving date-time helpers in `src/lib/domain/identity.ts`, `src/lib/domain/canonical-json.ts`, and `src/lib/domain/date-time.ts`
- [X] T021 [P] Implement the official task-list parser with source fingerprinting, D-position detection, and no statement/editorial copying in `src/lib/catalog/official-task-list.ts`
- [X] T022 Implement official-order stable union, absent/unknown/withdrawn states, and order-conflict holds in `src/lib/catalog/advanced-slot-registry.ts`
- [X] T023 [P] Create the unique prerequisite baseline, placement decision table, and terminology sources in `src/content/policies/prerequisite-baseline.json`, `src/content/policies/problem-placement.json`, and `src/content/glossary/terms.json`
- [X] T024 [P] Implement pre-change work-manifest creation and learning-outcome scope validation in `src/lib/validation/content-work-manifest.ts`
- [X] T025 [P] Implement fixed review-risk policy, self/third-party mode, reviewer-run check inventory, subject digest, finding resolution, and current-constitution checks in `src/lib/validation/human-content-review.ts`
- [X] T026 Implement public/staging separation and the canonical catalog assembly pipeline in `src/lib/catalog/build-catalog.ts` and `scripts/catalog-build.ts`
- [X] T027 Implement the shared fail-closed validation orchestrator and stable diagnostic codes in `src/lib/validation/validate.ts` and `scripts/catalog-validate.ts`

**Checkpoint**: Schema ownership is singular, future labels are accepted, and all T009–T012 tests pass.

---

## Phase 3: User Story 2 - 典型テクニックを体系的にたどる (Priority: P1)

**Goal**: 全対象問題の技法棚卸しから重複のない典型体系と3種の直接前提DAGを作り、意味階層・前提関係・目次表示順を独立に保つ。対象色と前提リンクから読む範囲を選べるようにする。

**分類・前提・掲載表示の分離**: canonical home Unitはprimary Outcomeの唯一のownerとする。additional-primary Outcomeは追加で学ぶ技能、supporting Outcomeは既習技能として表示し、homeを変えない。3つの前提DAGは直接辺としてmaterializeし、全体履修順や前後リンクは生成しない。分野別目次とsidebar順は`src/lib/taxonomy/textbook-order.ts`、対象色と説明は`unit-learning-targets.ts`を正本にする。掲載順は意味階層・DAGから独立し、親子subtreeの連続性を要求しない。Unit内Problemの読む順は受理済みの配列を後続の本文執筆・公開projectionへ引き継ぐ。canonical文書はT160までdraftのままとし、公開projectionを切り替えない。

**Independent Test**: 全 TechniqueInventoryItem を入力に taxonomy を再生成し、正式タグの成果・代表問題、三つの非循環前提DAG、唯一homeと全Problemの到達可能性を確認し、分野別目次・前提表示・問題役割の区別を確認する。

### Tests for User Story 2

- [X] T028 [US2] Freeze the US2 learning-outcome review units and the `initial-v1` cohort-selection rules before story changes, but do not select Problem IDs or Source Revisions yet; add failing seed-range continuity, D-after scope, dynamic registry, official-state completeness, cohort diversity, and staging/public-separation tests in `docs/work-manifests/initial/us2/manifest.json`, `staging/previews/initial-v1/preview-manifest.json`, `src/lib/preview/cohort-selection.ts`, and `tests/contract/catalog-scope.test.ts`
- [X] T029 [P] [US2] Add failing one-inventory-per-problem, source traceability, preview digest-chain, and no-temporary-tag/unit-publication tests in `src/lib/preview/preview-chain.ts`, `src/lib/preview/preview-scope.ts`, `tests/contract/technique-inventory.test.ts`, and `tests/contract/preview-scope.test.ts`
- [X] T030 [P] [US2] Add failing provisional taxonomy mapping, promote/merge/split/retire, final re-generation, deduplication, tag/unit DAG, deterministic order, representative problem, and placement reachability tests in `src/lib/preview/taxonomy-integration.ts`, `tests/contract/taxonomy.test.ts`, and `tests/contract/taxonomy-integration.test.ts`
- [X] T031 [P] [US2] Add failing LearningUnit outcome, prerequisite, example, exercise, answer, assessment, navigation, same-cohort vertical preview, component-digest join, `PreviewSnapshot` status/hold, current-subject review, stale-artifact, canonical-snapshot no-overwrite, derived-reference recovery, and interrupted-transaction tests in `src/lib/preview/preview-snapshot.ts`, `src/lib/preview/preview-snapshot-repository.ts`, `tests/fixtures/in-memory-preview-snapshot-repository.ts`, `tests/integration/learning-path.test.ts`, and `tests/integration/vertical-preview.test.ts`

### Corpus inventory for User Story 2

- [X] T032 [US2] Acquire and verify the official metadata needed to select the `initial-v1` preview cohort, retain the same official-source parser and metadata shape for the ABC 212–263 range, record each Problem ID, official order, and Source Revision, and create a source-backed lightweight candidate-domain/outcome pool without freezing the cohort or creating Tag/Unit entities in `staging/previews/initial-v1/candidate-pool.json`, `src/content/contests/abc212-abc263/`, `src/content/problem-slots/abc212-abc263/`, `src/content/problems/abc212-abc263/`, and `src/content/sources/abc212-abc263/`
- [X] T033 [P] [US2] Import and verify only official metadata for ABC 264–315 after T032 metadata acquisition; this task may run in parallel with T037 because it does not select or mutate the preview cohort in `src/content/contests/abc264-abc315/`, `src/content/problem-slots/abc264-abc315/`, `src/content/problems/abc264-abc315/`, and `src/content/sources/abc264-abc315/`
- [X] T034 [P] [US2] Import and verify only official metadata for ABC 316–367 after T032 metadata acquisition; this task may run in parallel with T037 because it does not select or mutate the preview cohort in `src/content/contests/abc316-abc367/`, `src/content/problem-slots/abc316-abc367/`, `src/content/problems/abc316-abc367/`, and `src/content/sources/abc316-abc367/`
- [X] T035 [P] [US2] Import and verify only official metadata for ABC 368–419 after T032 metadata acquisition; this task may run in parallel with T037 because it does not select or mutate the preview cohort in `src/content/contests/abc368-abc419/`, `src/content/problem-slots/abc368-abc419/`, `src/content/problems/abc368-abc419/`, and `src/content/sources/abc368-abc419/`
- [X] T036 [P] [US2] Import and verify only official metadata for ABC 420–466 after T032 metadata acquisition; this task may run in parallel with T037 because it does not select or mutate the preview cohort in `src/content/contests/abc420-abc466/`, `src/content/problem-slots/abc420-abc466/`, `src/content/problems/abc420-abc466/`, and `src/content/sources/abc420-abc466/`
- [X] T037 [US2] After T032 has verified the official metadata and candidate-domain/outcome pool, deterministically select and freeze the `initial-v1` cohort by contest number, official task order, Problem ID, four-domain coverage, contest diversity, advanced-label diversity, Source Revisions, candidate-pool digest, fixture boundaries, and excluded Problems in `staging/previews/initial-v1/preview-manifest.json` and `docs/verification/previews/initial-v1/cohort-selection.json`; reject missing or contradictory metadata or classification evidence instead of guessing
- [X] T038 [P] [US2] Create source-backed TechniqueInventoryItem records for the preview cohort and deterministic problem-ID shard 00 without creating Tag or Unit entities, write the preview inventory digest under `docs/verification/previews/initial-v1/components/`, and keep preview records only under `staging/previews/initial-v1/technique-inventory/` until the full-corpus join in `src/content/technique-inventory/shard-00/`
- [X] T039 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 01 without creating Tag or Unit entities in `src/content/technique-inventory/shard-01/`
- [X] T040 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 02 without creating Tag or Unit entities in `src/content/technique-inventory/shard-02/`
- [X] T041 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 03 without creating Tag or Unit entities in `src/content/technique-inventory/shard-03/`
- [X] T042 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 04 without creating Tag or Unit entities in `src/content/technique-inventory/shard-04/`
- [X] T043 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 05 without creating Tag or Unit entities in `src/content/technique-inventory/shard-05/`
- [X] T044 [US2] Validate one source-bound inventory record per scoped Problem without promoting term-detected drafts to reviewed, prove ABC 212–466 number continuity through held Contests plus official gap evidence and prove official task-order coverage with zero dropped advanced labels, compare the fully reviewed frozen preview cohort against the full Problem-ID set, reject preview-only leakage into canonical content, and freeze the corpus digest plus reviewed/draft counts in `docs/verification/bootstrap/technique-inventory.json` without accepting a partial join; T159 must reject any unresolved draft before accepting final taxonomy

### Taxonomy and textbook implementation for User Story 2

- [X] T045 [US2] Generate only the `initial-v1` provisional taxonomy and integration candidates from the preview Inventory, freeze their digest without mutating canonical taxonomy, and write the metadata/inventory/provisional-taxonomy component evidence to `staging/previews/initial-v1/taxonomy/`, `docs/verification/previews/initial-v1/taxonomy-integration.json`, and `docs/verification/previews/initial-v1/components/metadata-inventory-taxonomy.json`; this task ends at the preview component and does not perform all-corpus synthesis
- [X] T046 [US2] In preview scope, freeze non-overlapping candidate taxonomy review units and the provisional `promote`/`merge`/`split`/`retire` evidence needed by the four preview content tasks in `docs/work-manifests/initial/us2/taxonomy/` and `docs/verification/previews/initial-v1/taxonomy-integration.json`; do not materialize canonical entities
- [X] T047 [US2] After the accepted T159 FinalTaxonomyBuild, materialize canonical TechniqueTag entities from its full-corpus mapping, including definitions, outcomes, parents, curriculum prerequisites, semantic signatures, typed non-prerequisite relations with rationales, aliases, old names, and representative Problems; reject preview-only or ad-hoc one-Problem tags that merely restate problem-specific insights, while allowing explicitly reviewed canonical singleton Tags recorded in `SINGLE_PROBLEM_TAG_IDS`, in `src/content/tags/`
- [X] T048 [US2] After the accepted T159 FinalTaxonomyBuild, materialize every canonical LearningOutcome candidate whose contract declares `materializationTask: T048`, including its curriculum prerequisite Outcome references, in `src/content/learning-outcomes/`; materialize and validate the Tag, Outcome, and LearningUnit prerequisite DAGs as separate direct-edge graphs in `src/content/policies/learning-prerequisites.json`, and require every primary/additional-primary/supporting Outcome reference in ProblemPlacements to resolve within the materialized canonical LearningOutcome ID set
- [X] T049 [US2] After the accepted T159 FinalTaxonomyBuild, materialize its canonical placement decision for every Problem with primary/supporting tags, unique primary outcome review unit, and full/similar/supplement evidence; enumerate preview taxonomy changes through `CorrectionImpact` in `src/content/policies/problem-placements.json` and `docs/verification/bootstrap/problem-placements.json`
- [X] T050 [US2] Materialize the accepted FinalTaxonomyBuild into canonical Tag / Outcome metadata, LearningUnit hierarchy, and direct prerequisite DAGs. Derive each Problem's unique home Unit from its primary Outcome owner; keep additional-primary and supporting Outcomes as separate roles, derive problemIds as home plus descendant coverage, and derive relatedProblemIds from referenced Outcomes owned outside the home subtree. Generate concise Unit prose and problem links using the accepted Unit-internal problem order, and preserve that sequence through subsequent authoring and publication instead of replacing it with shard work order. Keep canonical_skeleton JSON and draft Markdown until full_authoring handoff and T160 publication; preserve authored bytes after handoff while checking taxonomy and source alignment. Record deterministic materialization evidence. Do not generate fixed guides, transfer tasks, assessments, or self-evaluation criteria.
- [X] T051 [P] [US2] After T046 and T064, freeze one work manifest per preview candidate Outcome and author only the graph/search/modeling `initial-v1` learning path before T154 using the fixed authoring-skill/source packet; write the preview component digest, `authoringSkillVersion`, `authoringSkillDigest`, and all preview-only items under `staging/previews/initial-v1/learning/graph-search/`, `docs/work-manifests/initial/us2/preview-content/graph-search/`, and `docs/verification/previews/initial-v1/components/content/graph-search.json`
- [X] T052 [P] [US2] After T046 and T064, freeze one work manifest per preview candidate Outcome and author only the dynamic-programming `initial-v1` learning path before T154 using the fixed authoring-skill/source packet; write the preview component digest, `authoringSkillVersion`, `authoringSkillDigest`, and all preview-only items under `staging/previews/initial-v1/learning/dynamic-programming/`, `docs/work-manifests/initial/us2/preview-content/dynamic-programming/`, and `docs/verification/previews/initial-v1/components/content/dynamic-programming.json`
- [X] T053 [P] [US2] After T046 and T064, freeze one work manifest per preview candidate Outcome and author only the data-structure/algorithm-design `initial-v1` learning path before T154 using the fixed authoring-skill/source packet; write the preview component digest, `authoringSkillVersion`, `authoringSkillDigest`, and all preview-only items under `staging/previews/initial-v1/learning/data-structures/`, `docs/work-manifests/initial/us2/preview-content/data-structures/`, and `docs/verification/previews/initial-v1/components/content/data-structures.json`
- [X] T054 [P] [US2] After T046 and T064, freeze one work manifest per preview candidate Outcome and author only the mathematics/combinatorics `initial-v1` learning path before T154 using the fixed authoring-skill/source packet; write the preview component digest, `authoringSkillVersion`, `authoringSkillDigest`, and all preview-only items under `staging/previews/initial-v1/learning/mathematics/`, `docs/work-manifests/initial/us2/preview-content/mathematics/`, and `docs/verification/previews/initial-v1/components/content/mathematics.json`
- [X] T055 [P] [US2] After T050 and passed T154, author concise Unit concepts and navigation for the complete unit-chapter-string and unit-chapter-geometry-optimization subtrees. Freeze one manifest per Unit at `docs/work-manifests/initial/us2/full-learning-units/<learningUnitId>/manifest.json`, preserve classification metadata and accepted Problem placement/order, and claim full_authoring before editing the canonical JSON/Markdown in place. These task worksets must be disjoint and cover every Unit. Each Problem retains its own full explanation authoring unit; do not duplicate explanations into Outcome-owned teaching blocks.
- [X] T056 [P] [US2] After T050 and passed T154, author concise Unit concepts and navigation for the complete unit-chapter-modeling subtrees. Freeze one manifest per Unit at `docs/work-manifests/initial/us2/full-learning-units/<learningUnitId>/manifest.json`, preserve classification metadata and accepted Problem placement/order, and claim full_authoring before editing the canonical JSON/Markdown in place. These task worksets must be disjoint and cover every Unit. Each Problem retains its own full explanation authoring unit; do not duplicate explanations into Outcome-owned teaching blocks.
- [X] T057 [US2] After Unit authoring, verify the three direct prerequisite DAGs and accepted Problem order/placement separately from editorial textbook order. Require every Unit exactly once, chapter membership consistent with the semantic hierarchy, conceptual-parent links for Units not directly under their chapter, target-color labels and reasons, later-section/chapter prerequisite links, unique home placement, coverage and related references, and navigation in `src/lib/catalog/build-learning-path.ts` against the accepted taxonomy and the editorial data in `src/lib/taxonomy/textbook-order.ts` and `unit-learning-targets.ts`. Do not require contiguous parent subtrees or a topological textbook order.
- [X] T058 [US2] After Unit authoring, verify ordinary conceptual prose, algorithms, assumptions, complexity and mathematical claims against sources; record evidence in `docs/verification/bootstrap/learning-unit-content.json`. Fixed Outcome assessment blocks are not required. Problem explanations retain their separate authoring and verification workflow.
- [ ] T059 [US2] After T057–T058, have the policy-selected reviewer confirm outcome coverage and run the taxonomy/DAG/placement/reachability/learning-path/terminology/cross-reference suites (`self` for normal changes, `third_party` instead of `self` for fixed high-risk classification changes), and record mode-labeled current-subject MergeReviewEvidence in `docs/verification/bootstrap/us2.json` and `docs/reviews/human-content/bootstrap/us2/merge-review.json`
  - Issue #46 implementation: full-corpus authoring, automated checks, and Codex technical inspection are recorded. The explicit maintainer outcome-coverage review is pending in the PR; `mergeApproved` remains false until that review. T060's retired questionnaire is not part of this review.
- [X] T060 [US2] Removed by the owner during Issue #46 implementation: no five-position operator self-study, questionnaire, or scoring artifact is required. Record the decision in `docs/operations/full-learning-units.md`; verify navigation through T057 instead.

**Checkpoint**: Full-corpus taxonomy and textbook order are stable; no contest-batch Tag/Unit or unreachable Problem remains.

---

## Phase 4: User Story 1 - 問題を理解して再現可能な解法を学ぶ (Priority: P1) 🎯 MVP

**Goal**: 体系確定後、全対象問題を学習成果単位で執筆し、自然な考察、証明、計算量、制約、実装、検証、復習助言を提供する。

**Independent Test**: 任意の5問を含む全公開Explanationの品質契約と出典を検査し、事前固定した5問で解説なしに着眼点・典型・正当性・計算量と制約整合を80%以上説明できる。

### Tests for User Story 1

- [X] T061 [US1] Freeze the US1 learning-outcome review units before story changes and add failing authoring-skill input/output, insufficient-input hold, required-section, source, and skill-version tests in `docs/work-manifests/initial/us1/manifest.json` and `tests/contract/explanation-authoring-skill.test.ts`
- [X] T062 [P] [US1] Add failing full/similar/supplement decision, source revision, technical claim, reproducible example, and explanation completeness tests in `tests/contract/explanation-quality.test.ts`
- [X] T063 [P] [US1] Add three fixed good-input and incomplete-input skill fixtures in `tests/fixtures/authoring-skill/manifest.json`

### Implementation for User Story 1

- [X] T064 [US1] After T061–T063, create the self-contained versioned explanation authoring skill, references, and templates, normalize the official source revisions, verification dates, constraints, and allowed-use metadata needed by all explanations, and freeze its input/output contract, version, and digest in `.agents/skills/abc-explanation-author/SKILL.md`, `.agents/skills/abc-explanation-author/references/`, `.agents/skills/abc-explanation-author/templates/`, `src/content/sources/`, and `docs/verification/authoring-skill/initial-v1/skill-manifest.json`
- [X] T065 [US1] After T049 has accepted the final taxonomy/placements, T064 has fixed the authoring/source prerequisites, and T154 has passed, generate, validate, and freeze the deterministic Outcome/Problem shard index with official Problem order, maximum-8 contiguous chunks, non-overlapping ProblemAuthoringUnit ownership paths, required checks, and a single `indexDigest` in `docs/work-manifests/initial/problem-authoring-units/index.json`
- [X] T066 [P] [US1] After T065, dispatch and author the graph/search/modeling Outcome/Problem shard from the frozen index; record the same `indexDigest` and independently build/review/preview each maximum-8-Problem shard as one co-located document per Problem in `src/content/docs/problems/graph-search/` and `docs/work-manifests/initial/problem-authoring-units/graph-search/`
- [X] T067 [P] [US1] After T065, dispatch and author the dynamic-programming Outcome/Problem shard from the frozen index; record the same `indexDigest` and independently build/review/preview each generated co-located ProblemAuthoringUnit shard with its own evidence and hold state in `src/content/docs/problems/dynamic-programming/` and `docs/work-manifests/initial/problem-authoring-units/dynamic-programming/`
- [X] T068 [P] [US1] After T065, dispatch and author the data-structure/algorithm-design Outcome/Problem shard from the frozen index; record the same `indexDigest` and independently build/review/preview each co-located ProblemAuthoringUnit shard with no shared canonical-file writes in `src/content/docs/problems/data-structures/` and `docs/work-manifests/initial/problem-authoring-units/data-structures/`
- [X] T069 [P] [US1] After T065, dispatch and author the mathematics/combinatorics Outcome/Problem shard from the frozen index; record the same `indexDigest` and independently build/review/preview each co-located ProblemAuthoringUnit shard with source and cross-reference evidence, plus example/answer evidence when included (otherwise not_applicable) in `src/content/docs/problems/mathematics/` and `docs/work-manifests/initial/problem-authoring-units/mathematics/`
- [X] T070 [P] [US1] After T065, dispatch and author the string/geometry Outcome/Problem shard from the frozen index; record the same `indexDigest` and independently build/review/preview each co-located ProblemAuthoringUnit shard with explicit primary Outcome ownership in `src/content/docs/problems/string-geometry/` and `docs/work-manifests/initial/problem-authoring-units/string-geometry/`
- [X] T071 [P] [US1] After T065, dispatch and author the hybrid/advanced-modeling Outcome/Problem shard from the frozen index; record the same `indexDigest` and independently build/review/preview each co-located ProblemAuthoringUnit shard with all shard-local evidence before the global join in `src/content/docs/problems/hybrid/` and `docs/work-manifests/initial/problem-authoring-units/hybrid/`
- [X] T072 [US1] Execute every runnable example in its declared environment and record input, procedure, expected, observed, and digest evidence in `docs/verification/bootstrap/examples.json`
- [X] T073 [US1] Re-evaluate every non-full placement against algorithm, proof, complexity, constraints, prerequisites, implementation differences, and learning outcomes in `docs/verification/bootstrap/problem-placement-reassessment.json`; retain T049's `problem-placements.json` as taxonomy evidence
- [X] T074 [US1] Under the explicit owner instruction in Issue #48, review existing source-bound co-located technical claims and included examples in `agent_quality_review` mode, preserving risk reasons, source rechecks, tracked prose reviews and independent mathematical checks in `docs/reviews/agent-content/bootstrap/problem-corpus-quality.json` and `docs/reviews/human-content/bootstrap/problem-authoring-units/`; do not synthesize human approval
- [X] T075 [US1] After T055–T056, T066–T074, and T155–T158 have completed the full-corpus LearningUnit and ProblemAuthoringUnit work, validate every generated shard independently and then join the full Outcome/Problem shard index for 100% authoring-unit structure, source traceability, skill version, terminology, copyright-safe quotation, example reproducibility, non-overlapping paths, zero orphan/duplicate Problem IDs, and zero unresolved review findings in `docs/verification/bootstrap/problem-authoring-units.json` and `docs/verification/bootstrap/problem-authoring-unit-shards.json`
- [X] T076 [US1] Generate the public Problem-to-authoring-unit projection without duplicating canonical tag/unit data in `src/lib/catalog/build-problem-content.ts`
- [X] T077 [US1] Record SC-009 as `not_required_by_owner` with the Issue #48 owner instruction and replacement corpus-quality evidence in `docs/verification/learner-outcomes/bootstrap/sc-009.json`; preserve actual old self-study evidence without generating answers or scores
- [X] T078 [US1] Under the Issue #48 owner instruction, confirm each shard's and joined US1 outcome coverage in `agent_quality_review` mode, run every applicable US1 check, resolve all findings, and store the current-subject acceptance matrix in `docs/verification/bootstrap/us1.json` and its content-acceptance reference in `docs/reviews/human-content/bootstrap/us1/merge-review.json`; this reference is not legacy human MergeReviewEvidence or production merge approval

**Checkpoint**: Every scoped Problem has either a complete independent explanation or a fully evidenced similar/supplement placement, and full-corpus quality and mapping acceptance pass. The owner-retired SC-009/human approval gates do not require synthetic evidence.

---

## Phase 5: User Story 3 - 解答状況と要復習を管理する (Priority: P1)

**Goal**: 一人の学習者が端末内で status と要復習を独立管理し、絞り込み・バックアップ・原子的復元を行えるようにする。

**Independent Test**: 任意Problemで修了と要復習を30秒以内に設定してreload後も独立日時を保持し、100件以上のbackupをpreview後に100%復元し、失敗注入時の部分反映を0件にする。

### Tests for User Story 3

- [X] T079 [US3] Freeze the US3 learning-outcome review units before story changes and add failing IndexedDB schema, migration, default-state, and catalog-update preservation tests in `docs/work-manifests/initial/us3/manifest.json` and `tests/unit/learning-record-store.test.ts`
- [X] T080 [P] [US3] Add failing status/needsReview independent-transaction, timestamp, reload, and error-feedback component tests in `tests/integration/learning-record-control.test.ts`
- [X] T081 [P] [US3] Add failing five-class preview, component-wise newer-wins, tie, invalid-item, rollback, unknown-ID, and 100-record restore tests in `tests/integration/learning-record-backup.test.ts`
- [X] T082 [P] [US3] Add failing Chromium/Firefox/WebKit shared-contract E2E and 30-second operator-flow tests in `tests/e2e/learning-records.spec.ts`

### Implementation for User Story 3

- [X] T083 [US3] Implement versioned IndexedDB opening, migrations, and catalog-independent Problem-ID records, and first run the same contract against the `initial-v1` preview catalog without changing Problem IDs in `src/lib/learning-records/database.ts` and `staging/previews/initial-v1/`; apply the full-corpus catalog only after T154
- [X] T084 [US3] Implement independent atomic status and needsReview actions with offset timestamps in `src/lib/learning-records/store.ts`
- [X] T085 [US3] Build the shared accessible learning-record control and no-JavaScript/IndexedDB-unavailable states in `src/components/LearningRecordControl.tsx`
- [X] T086 [US3] Implement stable localized date/time/timezone display and `更新記録なし` handling in `src/components/LearningRecordTimestamp.astro`
- [X] T087 [US3] Implement Problem-ID joins and combined contest/slot/tag/unit/status/needsReview filters in `src/lib/learning-records/filter.ts`
- [X] T088 [US3] Implement versioned privacy-minimal JSON export in `src/lib/learning-records/export.ts`
- [X] T089 [US3] Implement schema-first five-class import preview with component-level source/reason/result details in `src/lib/learning-records/import-preview.ts`
- [X] T090 [US3] Implement `newer-wins`, `backup-wins`, `cancel`, tie handling, and one-transaction rollback in `src/lib/learning-records/import-apply.ts`
- [X] T091 [US3] Build backup selection, preview, conflict-policy confirmation, apply result, and storage status UI in `src/pages/settings/learning-records.astro`
- [X] T092 [US3] Build the initial `needsReview=1` page with extra filters and no external state transmission in `src/pages/review/index.astro`
- [X] T093 [US3] Run the shared-contract E2E, representative raw timing, reload, and 100+ record restore checks against the frozen `initial-v1` catalog and record preview-only evidence in `docs/verification/previews/initial-v1/learning-records/`
- [X] T094 [US3] Have the policy-selected reviewer confirm the `initial-v1` LearningRecord component coverage, resolve preview findings, and write current-subject mode-labeled evidence plus the component digest to `docs/verification/previews/initial-v1/components/learning-records.json` and `docs/reviews/human-content/previews/initial-v1/us3/`; full-corpus validation remains a T139/T146 concern

**Checkpoint**: Status and review state are independent, local-only, recoverable, and preserved across content changes.

---

## Phase 6: User Story 4 - 問題やコンテストから逆引きする (Priority: P2)

**Goal**: 動的contest表、問題・タグ・学習単位索引、検索、相互参照から全対象問題へ迷わず到達できるようにする。

**Independent Test**: future I fixtureを含む表で全状態と列を確認し、収録済み各cellから全destinationへ一操作、各検索語から正規routeへ到達し、未公開候補と端末状態が検索へ混入しないことを検証する。

### Tests for User Story 4

- [X] T095 [US4] Freeze the US4 learning-outcome review units before story changes and add failing route, base-path, static-content-without-JavaScript, and canonical navigation tests in `docs/work-manifests/initial/us4/manifest.json` and `tests/contract/ui-routes.test.ts`
- [X] T096 [P] [US4] Add failing dynamic-column, non-empty state, direct-link, alternative-list, future-I, and reflow tests in `tests/e2e/contest-matrix.spec.ts`
- [X] T097 [P] [US4] Add failing Pagefind entity/alias/hierarchy/contest search, zero-result, and unpublished/local-state exclusion tests in `tests/e2e/search.spec.ts`
- [X] T098 [P] [US4] Add failing keyboard, landmark, heading, table-header, accessible-name, text-alternative, and color-independence tests in `tests/e2e/accessibility.spec.ts`

### Implementation for User Story 4

- [X] T099 [US4] Implement the shared layout, breadcrumbs, section navigation, previous/next links, skip link, and external-link labeling against the `initial-v1` preview catalog while keeping the catalog source injectable for the post-preview full-catalog projection in `src/layouts/TextbookLayout.astro`
- [X] T100 [P] [US4] Build preview-capable home, learning-path, and LearningUnit route foundations without assuming full-corpus content in `src/pages/index.astro`, `src/pages/learn/index.astro`, and `src/pages/learn/[...slug].astro`
- [X] T101 [P] [US4] Build preview-capable TechniqueTag and Problem index/detail route foundations from stable IDs in `src/pages/tags/index.astro`, `src/pages/tags/[slug].astro`, `src/pages/problems/index.astro`, and `src/pages/problems/[problemId].astro`
- [X] T102 [P] [US4] Build preview-capable release-history list/detail route foundations with immutable fields and evidence references in `src/pages/updates/index.astro` and `src/pages/updates/[version].astro`
- [X] T103 [US4] Build the AdvancedSlotRegistry-driven matrix and same-result alternative list for the frozen preview catalog in `src/components/ContestMatrix.astro` and `src/pages/contests/index.astro`
- [X] T104 [US4] Add distinguishable one-operation links from every preview cell to Problem, explanation anchor, LearningUnit, primary/supporting TechniqueTags, and similar Problems in `src/components/ContestProblemCell.astro`
- [X] T105 [US4] Build combined visible-label filters, URL query serialization, result counts, reset, and zero-result guidance for the preview catalog in `src/components/ProblemFilters.tsx`
- [X] T106 [US4] Configure preview Pagefind documents and entity-kind metadata while excluding controls, staging, obsolete routes, and local state in `src/lib/catalog/search-documents.ts`
- [X] T107 [US4] Generate the schema-valid preview catalog endpoint solely from frozen preview content; the post-preview switch and full-catalog regeneration are owned by T160 in `src/pages/data/catalog.json.ts`
- [X] T108 [US4] Implement the shared narrow-screen reflow, two-dimensional-table-only scrolling, focus visibility, and non-color states used by preview and final routes in `src/styles/accessibility.css`
- [X] T109 [US4] Run the future-label, direct-navigation, search, no-JavaScript, axe, keyboard, and reflow checks against `initial-v1` and store preview evidence in `docs/verification/previews/initial-v1/ui-search/`
- [X] T110 [US4] Verify internal links, cross-references, preview canonical routes, base paths, Pagefind entries, sitemap, and feed without reading unpublished full-catalog content in `docs/verification/previews/initial-v1/ui-search/`
- [X] T111 [US4] Have the policy-selected reviewer confirm the `initial-v1` UI/search component coverage, resolve preview findings, and write current-subject mode-labeled evidence plus the component digest to `docs/verification/previews/initial-v1/components/ui-search.json` and `docs/reviews/human-content/previews/initial-v1/us4/`; full route/search closure is implemented by T160 and validated by T138/T140/T146

**Checkpoint**: Every advanced Problem is visible under its official label and reachable from both the learning system and reverse indexes.

---

## Phase 7: User Story 5 - 新しいABCを一操作で追加準備する (Priority: P2)

**Goal**: 終了済み未収録ABCを一操作で安全に更新準備し、検証・限定review・protected mainへのmerge・静的デプロイへ進める。

**Independent Test**: offline fixtureで一回の開始操作から15分以内に全対象Problemを完成草案/要執筆/具体的保留へ分類し、再実行で重複0件、required check失敗commitの公開0件、未知commitのdeploy 0件、既知release commitの再deploy rollback成功を確認する。

### Tests for User Story 5

- [X] T112 [US5] Freeze the US5 learning-outcome review units before story changes and add failing ended-contest discovery, D-after scope, future-label, source-failure, and single-start-operation tests in `docs/work-manifests/initial/us5/manifest.json` and `tests/integration/update-discovery.test.ts`
- [X] T113 [P] [US5] Add failing complete-draft/authoring-required/blocked, authoring-skill integration, and idempotent rerun tests in `tests/integration/update-prepare.test.ts`
- [X] T114 [P] [US5] Add failing correction-impact, taxonomy-cycle, reachability, index, and hold/resume tests in `tests/integration/update-validation.test.ts`
- [X] T115 [P] [US5] Add failing minimal release metadata, known-commit validation, serialized deployment, rollback-by-redeploy, and unknown-commit tests in `tests/integration/git-deployment-adapter.test.ts`

### Implementation for User Story 5

- [X] T116 [US5] Implement latest-ended and explicit-range discovery with offline-fixture mode and no in-progress Contest ingestion, then run only the `initial-v1` update preparation before T154 without publishing preview state in `scripts/update-abc/discover.ts` and `staging/previews/initial-v1/`; full-corpus discovery remains post-T154
- [X] T117 [US5] Implement the shared official metadata acquisition, fingerprinting, dynamic advanced slots, and source-failure holds, and exercise them against the frozen preview fixture before T154 in `scripts/update-abc/acquire.ts`
- [X] T118 [US5] Implement staging-only diff operations and deterministic update IDs for the preview fixture before T154; production update state remains post-T154 in `scripts/update-abc/stage.ts`
- [X] T119 [US5] After T064, integrate the fixed versioned authoring skill for the preview fixture so each target Problem becomes `authoring_unit_draft`, `authoring_required` with complete inputs/template, or `blocked` with a concrete reason; record the same `authoringSkillVersion` and `authoringSkillDigest` in `scripts/update-abc/author.ts` and the preview component evidence before T154
- [X] T120 [US5] Implement existing-taxonomy mapping and preview-only impact proposals for unmatched techniques without publishing temporary Tag/Unit entities before T154 in `scripts/update-abc/classify.ts`; full-corpus classification follows T047–T050
- [X] T121 [US5] Implement source, explanation, example, placement, DAG, order, catalog, index, cross-reference, and per-Problem diagnostics needed by the preview fixture before T154 in `scripts/update-abc/validate.ts`
- [X] T122 [US5] Implement one-command orchestration, resumable state, 15-minute timing, stable output, and documented exit codes for the preview fixture before T154 in `scripts/update-abc/index.ts`
- [X] T123 [US5] Implement correction-impact enumeration for the preview fixture across content, examples, exercises, answers, order, and indexes before T154 in `scripts/update-abc/correction-impact.ts`
- [X] T124 [US5] Implement the preview-only seed bootstrap through the shared manifest/state machine before T154 in `scripts/update-abc/bootstrap.ts`; normal full-corpus catch-up remains post-T154
- [X] T125 [US5] After T119–T124, run the fixture-only update/release simulation for `initial-v1`, including staging/public closure, immutable preview digest, validation inventory, and no production release metadata or deployment writes in `scripts/verify-release.ts` and `staging/previews/initial-v1/release-simulation/`
- [X] T126 [US5] After T125 and T064, for the fixture-only preview simulation, apply the fixed risk policy, run applicable checks, resolve findings, and write current-subject self/third-party component evidence plus the digest and exact authoring-skill subject to `scripts/review-update.ts`, `docs/verification/previews/initial-v1/components/update-simulation.json`, and `docs/reviews/human-content/previews/initial-v1/us5/`; production merge and deploy are explicitly out of scope
- [X] T127 [US5] Replace candidate/approval/receipt contracts with minimal version/cutoff/commit/change-summary/validation-URL ReleaseMetadata in `src/lib/domain/schema-parts/release.ts` and `specs/001-build-abc-textbook/contracts/release-metadata.schema.json`
- [X] T128 [US5] After T154, implement read-only release validation against the protected-base diff and the exact merge commit in `scripts/verify-release.ts`
- [X] T129 [US5] Isolate deployment serialization and rollback-by-known-commit redeploy in `src/lib/deployment/git-deployment-adapter.ts`; leave filesystem temp→rename behavior to an optional separate adapter
- [X] T130 [US5] After T154, generate public immutable Release history and separate administrator-only hold summaries for the full catalog in `src/lib/catalog/build-release-history.ts`
- [X] T131 [US5] After T154, confirm full-corpus outcome coverage and run idempotency/failure-injection/correction/required-check/deploy-simulation checks, resolve findings, and record current-subject implementation acceptance in `docs/verification/bootstrap/us5.json` and `docs/reviews/human-content/bootstrap/us5/merge-review.json`. Issue #49 owner instruction selects `agent_quality_review` for this implementation acceptance, without synthetic human approval or production merge/deploy approval. Preserve and test production `self` / `third_party` review selection for normal and fixed high-risk correction/classification cases.
- [X] T132 [US5] After T154, document the full-catalog weekly prepare/review/validate/merge/deploy/backup workflow and deployment-adapter recovery in `docs/operations/weekly-update.md`; preserve authored Unit bytes, semantic ownership, the three direct prerequisite DAGs and independent editorial order, and update `src/content/problem-metrics/atcoder-problems.json` whenever the canonical Problem set changes so its Problem IDs and official task identities match exactly, with unavailable auxiliary metrics kept null

**Checkpoint**: The complete update pipeline works offline and in simulation; no production deploy has occurred.

---

## Phase 8: Polish & Cross-Cutting Initial Release

**Purpose**: T154のpreview PASS後に全storyのfull-corpus成果を初版release commitへ統合し、目的・憲章・品質・費用・性能を最終確認してから初めて実公開する。preview component evidence、仮taxonomy、未結合shard、未検証updateはこのphaseへ直接持ち込まない。

- [X] T133 [P] Run Zod/JSON Schema parity, contract schema validation, unknown-field rejection, and generated-file drift checks in `docs/verification/initial-release/schema-contracts.json`
- [X] T134 [P] Recompute the authoritative final-release gate independently of preview artifacts: ABC continuity, official D-after slots, dynamic registry, public Problem coverage, classification, reachability, and direct-link coverage must prove FR-001/SC-001 100% coverage in `docs/verification/initial-release/corpus-completeness.json`
- [X] T135 [P] Recompute inventory-to-final-taxonomy coverage, preview integration-map acceptance, duplicate concepts, Tag/Outcome/Unit direct prerequisite DAG validity, semantic hierarchy, unique Outcome ownership and Problem home/coverage, placement decisions, and learning-outcome traceability. Validate that independent editorial order contains every Unit exactly once with matching chapter membership, conceptual-parent links, target colors and later-prerequisite labels, while preserving accepted Unit-internal Problem order; do not require contiguous parent subtrees or topological textbook order. Reject provisional or unjoined shards in `docs/verification/initial-release/taxonomy.json` and `docs/verification/previews/initial-v1/taxonomy-integration.json`
- [X] T136 [P] Verify authoritative sources, version-dependent claims, confirmation dates, source corrections, allowed-use metadata, and quotation limits in `docs/verification/initial-release/sources-and-claims.json`
- [X] T137 [P] Execute all runnable examples and verify every existing exercise, assessment, and answer block against its outcome in `docs/verification/initial-release/examples-and-answers.json`; Unit examples/exercises are optional ordinary prose, and absence of fixed per-Outcome guide/transfer/assessment blocks is not a completeness failure
- [X] T138 [P] After T160, run build, axe, keyboard, 320-CSS-pixel reflow, terminology, text-alternative, no-JavaScript, and internal-link suites against the canonical full-corpus projections in `docs/verification/initial-release/accessibility-and-links.json`
- [X] T139 [P] Run full-route learning-control equivalence, independent timestamps, migration, filter, and 100+ record backup/rollback suites in `docs/verification/initial-release/learning-records.json`
- [X] T140 [P] After T160, run public search/index/catalog/sitemap/feed closure checks and prove staging and local state exclusion in `docs/verification/initial-release/public-projections.json`
- [X] T141 [P] Benchmark seed, release-cutoff, and 1,500-Problem/500-Tag/1,000-Unit fixtures plus filter p95 against SC-019 in `docs/verification/initial-release/performance.json`
- [X] T142 [P] Audit client bundles, external dependencies, telemetry, accounts, paid services, and a deterministic 52-week update simulation for zero additional required cost in `docs/verification/initial-release/zero-cost-52-weeks.json`
- [X] T143 Freeze an offset-qualified initial `cutoffAt`, discover all ended ABCs after 466, and process every missing Contest through normal updates in `staging/updates/initial-catch-up/`; update canonical metadata, placements, authoring units, Unit navigation and auxiliary metrics snapshot identities for the expanded corpus while preserving accepted ownership and authored Unit content
- [X] T144 Re-run all T133–T142 validators and the AtCoder Problems metrics snapshot validator against the expanded corpus after catch-up, and reject any unresolved Problem, temporary/provisional taxonomy, unjoined Outcome/Problem shard, missing review, preview artifact leakage, stale metrics Problem/task identities, or changed learner record in `docs/verification/initial-release/post-catch-up.json`; bootstrap counts are not the final-release coverage boundary
- [X] T145 After T160, assemble the initial release change summary from bootstrap and all catch-up update IDs in the Catalog release history
- [X] T146 After T160, complete the policy-selected review check inventory for the exact release commit subject (`self` for normal changes, `third_party` instead of `self` for every fixed high-risk claim/example scope) in `docs/reviews/human-content/initial-release/`
- [X] T147 Re-run SC-012 representative timing against the exact release commit in `docs/verification/learner-outcomes/initial-release/` and retain the owner-retired SC-009 disposition; no manual SC-009 answers or scores are required
- [ ] T148 Configure build, link, schema, content-completeness, and policy-selected review checks as protected-main merge requirements
- [ ] T149 Execute read-only final validation, dependency-closure comparison, deploy simulation, and known-commit rollback rehearsal without regenerating content in `docs/verification/initial-release/final-validation.json`
- [ ] T150 Finalize the exact production deploy adapter, static-host history, retry, rollback, and verification steps in `docs/operations/initial-release-runbook.md`
- [ ] T151 Audit the final release commit against the original goal, all FR/CQ/SC requirements including FR-001/SC-001, the private-preview exclusion, Outcome/Problem shard join evidence, Constitution 3.0.0, self/third-party review policy, one-user scope, and zero-cost boundary in `docs/verification/initial-release/goal-and-constitution.json`
- [ ] T152 Merge the fully validated tree to protected main and deploy that exact full commit hash without content changes by following `docs/operations/initial-release-runbook.md`
- [ ] T153 Verify static-host deployment history, immutable Git Release history, route/search availability, known-commit rollback, and learning-record compatibility in `docs/verification/deployments/initial-release.json`

---

## Cross-cutting checkpoint: Private preview join

T154 is defined after the original task list so task IDs remain sequential, but it executes after the preview components and T064 skill freeze, and before the post-preview final-taxonomy, full LearningUnit continuation, full public projection, and T066–T071 bulk-authoring tasks. It is a delivery gate, not a test-only placeholder.

- [X] T154 [US2] Join the `initial-v1` preview from only these fixed inputs: `staging/previews/initial-v1/preview-manifest.json` (T037), `docs/verification/authoring-skill/initial-v1/skill-manifest.json` (T064), `docs/verification/previews/initial-v1/components/metadata-inventory-taxonomy.json` (T045), `docs/verification/previews/initial-v1/components/content/{graph-search,dynamic-programming,data-structures,mathematics}.json` (T051–T054), `docs/verification/previews/initial-v1/components/learning-records.json` (T094), `docs/verification/previews/initial-v1/components/ui-search.json` (T111), and `docs/verification/previews/initial-v1/components/update-simulation.json` (T126); wire `preview:verify` in `package.json`, run it from `scripts/preview-verify.ts` as `npm run preview:verify -- --fixture tests/fixtures/previews/initial-v1` against the frozen manifest without reselecting or regenerating inputs, recompute each component digest, require every applicable check and current-subject self/third-party review evidence, require T051–T054 and T119/T126 evidence to carry the exact T064 `authoringSkillVersion` and `authoringSkillDigest`, reject incomplete source/input packets, and write one immutable `PreviewSnapshot` named by `joinDigest` to `staging/previews/initial-v1/snapshots/` by same-directory temp-file rename with no overwrite; record the phases in `staging/previews/initial-v1/transactions/<joinDigest>.json`, then write only a derived `PreviewSnapshotReference` to `docs/verification/previews/initial-v1/preview-join/<joinDigest>.json` by its own temp-file rename after verifying the canonical snapshot. The two directory writes are not one cross-directory atomic operation: recovery must use the transaction manifest, keep the canonical snapshot as the sole truth, recreate a missing reference, and leave an unresolvable/stale reference on hold. It must not read any artifact outside this list, especially the full-catalog outputs of T047–T050/T055–T078 or the production/full-release outputs of T127–T153, and a missing, stale, failed, incomplete, or skill-mismatched component leaves the new canonical snapshot `on_hold`

- [X] T155 [P] [US2] After T050 and passed T154, author concise Unit concepts and navigation for the complete unit-chapter-graph and unit-chapter-tree subtrees. Freeze one manifest per Unit at `docs/work-manifests/initial/us2/full-learning-units/<learningUnitId>/manifest.json`, preserve classification metadata and accepted Problem placement/order, and claim full_authoring before editing the canonical JSON/Markdown in place. These task worksets must be disjoint and cover every Unit. Each Problem retains its own full explanation authoring unit; do not duplicate explanations into Outcome-owned teaching blocks.
- [X] T156 [P] [US2] After T050 and passed T154, author concise Unit concepts and navigation for the complete unit-chapter-dynamic-programming subtrees. Freeze one manifest per Unit at `docs/work-manifests/initial/us2/full-learning-units/<learningUnitId>/manifest.json`, preserve classification metadata and accepted Problem placement/order, and claim full_authoring before editing the canonical JSON/Markdown in place. These task worksets must be disjoint and cover every Unit. Each Problem retains its own full explanation authoring unit; do not duplicate explanations into Outcome-owned teaching blocks.
- [X] T157 [P] [US2] After T050 and passed T154, author concise Unit concepts and navigation for the complete unit-chapter-query subtrees. Freeze one manifest per Unit at `docs/work-manifests/initial/us2/full-learning-units/<learningUnitId>/manifest.json`, preserve classification metadata and accepted Problem placement/order, and claim full_authoring before editing the canonical JSON/Markdown in place. These task worksets must be disjoint and cover every Unit. Each Problem retains its own full explanation authoring unit; do not duplicate explanations into Outcome-owned teaching blocks.
- [X] T158 [P] [US2] After T050 and passed T154, author concise Unit concepts and navigation for the complete unit-chapter-number-theory and unit-chapter-combinatorics-algebra subtrees. Freeze one manifest per Unit at `docs/work-manifests/initial/us2/full-learning-units/<learningUnitId>/manifest.json`, preserve classification metadata and accepted Problem placement/order, and claim full_authoring before editing the canonical JSON/Markdown in place. These task worksets must be disjoint and cover every Unit. Each Problem retains its own full explanation authoring unit; do not duplicate explanations into Outcome-owned teaching blocks.
- [X] T159 [US2] After T044 has frozen the complete full-corpus Technique Inventory and T154 has `status=passed`, define or extend the canonical `FinalTaxonomyBuild`/`TaxonomyIntegrationMap` contract and generate the full-corpus build without reading preview-only entities as canonical input: determine final Tag/Outcome/Unit candidates with unique direct ownership, preserve every Tag's machine-readable recognition semantic signature, express contrast/analogy/specialization/extension/reduction/often_combined/implementation_substrate relations outside the curriculum-prerequisite DAG, determine separate Tag/Outcome/LearningUnit direct prerequisite DAGs, every ProblemPlacement, and a complete `promote`/`merge`/`split`/`retire` map without generating global curriculum order; enumerate every affected Problem and `CorrectionImpact`, require source-backed evidence and the policy-selected current-subject self/third-party review, then freeze one accepted build digest for T047–T050 in `src/lib/domain/schema-parts/catalog.ts`, `specs/001-build-abc-textbook/contracts/catalog.schema.json`, `staging/taxonomy/initial/final-taxonomy-build.json`, `docs/verification/previews/initial-v1/taxonomy-integration.json`, `docs/verification/bootstrap/final-taxonomy.json`, and `docs/reviews/human-content/bootstrap/us2/final-taxonomy-review.json`
- [X] T160 [US4] After T057, T075–T076, and T078 have accepted the full-corpus content and mapping, and T154 has passed, rebind the shared catalog assembly and projection pipeline once from the frozen `initial-v1` fixture to canonical full-corpus content without forking preview routes or maintaining a second implementation. Publish only accepted full_authoring Unit documents by coordinating their draft transition with materialization validation, preserving authored bytes and accepted metadata. Project the independent textbook order, conceptual-parent links, target-color reasons, later-prerequisite labels, unique Problem homes and accepted Unit-internal Problem order without deriving navigation from the prerequisite DAG. Regenerate all canonical Problem/Tag/LearningUnit/Contest/release-history routes, dynamic contest matrix, catalog endpoint, Pagefind documents/index, sitemap, and feed with staging, preview, unpublished candidates, and local state excluded; resolve pending CorrectionImpact targets against accepted content and generated indexes, then freeze the full-projection digest before T138/T140/T145/T146 in `src/lib/catalog/`, `src/pages/`, `src/layouts/`, and `docs/verification/bootstrap/us4/full-projections.json`
- [X] T161 [US1] Migrate the learner, reasoning-roadmap, typical/problem-specific decomposition, review-advice, and Japanese coaching policies from root `prompt.md` into the self-contained `abc-explanation-author` skill; define their full/similar/supplement application in the referenced policy and templates, update the representative fixture and contract tests, and refreeze the skill version/digest without adding a runtime dependency on `prompt.md`

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependency.
- **Foundational (Phase 2)**: depends on Phase 1 and blocks all stories.
- **Preview milestone**: starts after Phase 2. T028 freezes only selection rules and failing-contract scope; T032 acquires candidate official metadata and a source-backed candidate-domain/outcome pool; T037 freezes the actual cohort manifest; T029–T031 freeze the remaining preview contracts; T064 freezes the authoring skill before preview content or update authoring. T038/T045/T046, T051–T054, T083–T094, T099–T111, and T116–T126 produce only the explicitly listed preview artifacts. T154 is the explicit join barrier: it must pass before T159 final taxonomy acceptance, full LearningUnit continuation, full public projections, and bulk authoring are treated as design-stable, but it never satisfies the final corpus gate.
- **US2 (Phase 3, P1)**: starts after Phase 2 and T037; preview inventory/taxonomy is staging-only, while T032–T044 perform the full metadata and TechniqueInventory join independently. T045/T046 produce only the preview taxonomy, T051–T054 complete only the preview content component after T064, T159 synthesizes and accepts the final taxonomy from the complete inventory after T154, T047–T050 materialize only that accepted build, and T055–T056/T155–T158 produce the full LearningUnit content after that materialization.
- **US1 (Phase 4, P1)**: depends on the accepted final US2 taxonomy/placements, T064, and T154. T065 freezes the shard index, then T066–T071 generate and execute six independent Outcome/Problem shard work streams; no per-contest temporary taxonomy is permitted. T065 owns the shared index and no domain task may generate or mutate it.
- **US3 (Phase 5, P1)**: starts after Phase 2 with the preview fixture and completes T094's component evidence before T154; full-corpus learning-record validation is performed by T139/T146 after stable public Problem IDs are available.
- **US4 (Phase 6, P2)**: starts with the preview fixture and completes T111's component evidence before T154; T160 is the post-preview implementation that binds canonical full content to routes, indexes, search, catalog, sitemap, and feed, and T138/T140/T146 validate that fixed projection.
- **US5 (Phase 7, P2)**: starts with the T112 manifest and completes the fixture-only T116–T126 update simulation before T154; protected-main validation and the initial release metadata/deploy tasks are post-T154 full-catalog work.
- **Initial Release (Phase 8)**: depends on all user stories. T152 is forbidden until T145–T151 are complete in order.

### User Story Dependency Graph

```text
Setup → Foundational ─┬→ candidate pool/cohort ─→ preview components ─→ T154 preview PASS ─→ T159 final taxonomy ─→ T047–T050 materialize ─┬→ full content ─→ T065 index ─→ T066–T071 shards ─┐
                      ├→ full US2 inventory ──────────────────────────────────────────────┘                                             │                  ├→ T160 full routes/index/search ───┤
                      ├→ US3 preview → T154 → full learning records ───────────────────────────────────────────────────────────────────┤                  │
                      ├→ US4 preview → T154 ────────────────────────────────────────────────────────────────────────────────────────────┘                  │→ Initial release
                      └→ US5 preview simulation → T154 → review/merge/deploy ─────────────────────────────────────────────────────────────────────────────┘
```

- **Preview** is independently testable as a private, digest-bound vertical slice; it cannot be promoted or counted as final coverage. Its canonical snapshot lives only under staging; the verification tree contains a recoverable reference.
- **US2** is the corpus-first final learning-system base and is independently testable from full inventory, DAG, units, and automated navigation checks.
- **US1** consumes only accepted final US2 taxonomy; it never creates Tag/Unit while processing a Problem, and each Problem explanation belongs to exactly one generated primary-Outcome shard.
- **US3** remains independent of taxonomy revisions because records key only by stable Problem ID.
- **US4** is the integrated reverse-index view: preview uses the fixture, while T160 performs the one-way switch to canonical full-corpus projections before release validation.
- **US5** reuses the same ingestion, taxonomy, authoring, validation, and release rules used by bootstrap.

### Within Each User Story

- Contract/unit/E2E tests are written first and observed failing before implementation.
- Canonical data precedes derived pages and indexes.
- Preview paths use the same canonical implementation and are rejected from public projections; provisional taxonomy is replaced by final taxonomy through the integration map.
- Automated checks precede the policy-selected self/third-party review; high-risk solo self-review must preserve its risk reasons and explicit exception reason, and findings must be resolved before merge.
- Final validation is read-only; protected-main merge fixes the release commit, and deployment publishes that exact commit without content changes.

## Parallel Opportunities

- T002–T003 and T005–T007 can proceed on different setup files.
- T009–T012, T013–T017, and T020–T025 can proceed in their marked groups.
- T032 acquires and verifies the candidate 212–263 metadata plus the source-backed candidate-domain/outcome pool without selecting a cohort; T037 freezes the cohort from that pool and its verified Source Revisions. T033–T036 may collect the remaining metadata ranges in parallel after T032 and independently of T037 because their directories do not overlap and they do not create taxonomy.
- T038–T043 may inventory deterministic Problem-ID shards in parallel after the preview inventory contract; T044 is the full-corpus join barrier.
- T064 must finish before T051–T054 and T119; the four preview content tasks may then proceed with disjoint staging-only work manifests and end at component digests carrying the same authoring-skill digest. T055–T056 and T155–T158 own disjoint chapter subtrees after T050 and passed T154, with one manifest per canonical Unit; T047–T050 wait for the accepted T159 FinalTaxonomyBuild. T154 joins only the fixed preview component manifests plus the T064 skill manifest. After T044 and T154, T159 is the sole full-corpus taxonomy synthesis/acceptance gate; after T049, T064, and T154, T065 freezes one `indexDigest`; T066–T071 may then proceed in parallel with disjoint Problem authoring-unit paths and must copy and verify that digest. Their six work domains are separate from the nine reader chapters, and co-located Claim/Example keys do not create independent entity IDs or review units. T160 runs only after full content and explanation acceptance and owns the preview-to-canonical public projection switch.
- All test-authoring groups and T133–T142 final read-only audits may run in parallel as marked.

## Parallel Example: User Story 2

```text
Task T038: preview cohort plus deterministic inventory shard 00 in staging/ and src/content/technique-inventory/shard-00/
Task T039: generated inventory shard 01 in src/content/technique-inventory/shard-01/
Task T040: generated inventory shard 02 in src/content/technique-inventory/shard-02/
Task T041: generated inventory shard 03 in src/content/technique-inventory/shard-03/
Task T042: generated inventory shard 04 in src/content/technique-inventory/shard-04/
Task T043: generated inventory shard 05 in src/content/technique-inventory/shard-05/
```

The join task T044 proves complete corpus coverage for the eventual final taxonomy; T045/T046 synthesize and review only the staging provisional taxonomy before T154. T159 then generates and accepts the full-corpus FinalTaxonomyBuild and its complete integration map. T047–T050 materialize only that accepted build, and T055–T056/T155–T158 are separate full-corpus content tasks after that materialization.

## Parallel Example: User Story 1

```text
Task T065: frozen Outcome/Problem shard index and shared indexDigest
Task T066: generated graph/search/modeling shards, each with its own work manifest, evidence, review, and private preview
Task T067: generated dynamic-programming shards, each with its own work manifest, evidence, review, and private preview
Task T068: generated data-structure/algorithm-design shards, each with its own work manifest, evidence, review, and private preview
Task T069: generated mathematics/combinatorics shards, each with its own work manifest, evidence, review, and private preview
Task T070: generated string/geometry shards, each with its own work manifest, evidence, review, and private preview
Task T071: generated hybrid/advanced-modeling shards, each with its own work manifest, evidence, review, and private preview
```

Each T066–T071 task owns disjoint ProblemAuthoringUnit paths and records the `indexDigest` frozen by T065; Claim/Example blocks remain co-located with their Problem. The six work domains do not determine the nine reader chapters or accepted Unit-internal Problem order, and no domain task generates or mutates the shared index.

## Implementation Strategy

### Goal-Preserving MVP

1. Complete Setup and Foundational phases.
2. Acquire candidate official metadata and source-backed classification, freeze the representative cohort, freeze the versioned authoring skill, and build the private vertical preview through the shared metadata, taxonomy, content, UI, learning-record, and update paths.
3. Run the explicit T154 join gate, resolve its hold findings, and keep preview data unpublished.
4. Run T159 to synthesize and accept the final taxonomy from the complete Inventory, materialize it through T047–T050, and then expand full-corpus LearningUnit content through T055–T056/T155–T158.
5. Generate and review the Outcome/Problem shards, join the explanations, and run T160 to switch the shared public projections from preview to canonical full-corpus content.
6. Validate the final projections, shard join, and final US1/US2 independently before the initial release commit.

The private preview is an early feedback milestone, not a reduced public MVP. The public MVP remains subject to the full-corpus FR-001/SC-001 gate.

### Incremental Delivery

1. Private vertical preview → independently validate the complete dependency chain and record holds.
2. Full corpus inventory and T159 final taxonomy integration → independently validate learning order and 100% inventory coverage.
3. Generated Outcome/Problem shards → independently validate each explanation unit, then run the all-shard join.
4. Local learning records → validate progress tracking and backup against stable Problem IDs.
5. T160 preview-to-canonical route/search projection switch → validate one-operation reachability and dynamic labels against the full corpus.
6. Weekly update pipeline → validate idempotent maintenance and correction handling.
7. Integrate, review, final-validate, merge, runbook-audit, and deploy only after the independent final coverage gate passes.

## Notes

- `[P]` never authorizes concurrent edits to the same canonical file.
- Contest-number batches are allowed only for official metadata and progress accounting.
- Preview inventory/taxonomy is staging-only. The final Technique Inventory join is complete before T159 final taxonomy synthesis; only the accepted T159 build may be materialized by T047–T050 or consumed by full explanation authoring.
- T064 is the single versioned authoring-skill/source prerequisite for T051–T054 and T119; preview content and update evidence must carry its exact version and digest, and T154 rejects missing, stale, or mismatched skill subjects.
- T154 is the preview join barrier, not a test-only placeholder: it consumes fixed component artifacts, persists one canonical immutable preview result plus a derived reference/recovery record, and blocks T055–T056/T155–T158 and T066–T071 unless `status=passed`.
- T159 is the only task that synthesizes and accepts final taxonomy from the complete Inventory and a passed preview; T047–T050 only materialize its accepted digest, so no task may silently promote preview entities or recreate final taxonomy by hand.
- T160 is the only post-preview task that switches shared public projections from the frozen fixture to the canonical full-corpus catalog; T138/T140/T145/T146 consume its fixed projection digest and do not perform that switch implicitly.
- A generated shard is independently buildable, reviewable, previewable, and path-disjoint; its success never replaces the all-shard join or the final FR-001/SC-001 gate.
- Optional tools may assist, but no paid service, specific model, external cohort, separate auditor, multi-user account, or always-on backend is a required task.
- No production deploy occurs in US5 simulation. T152 is the only production deployment task and is gated by protected-main checks, the runbook, and goal audit.

## PR #65レビュー対応（T065–T071の本文品質補修）

- [X] 全868問の考察・証明・計算量・境界条件を横断点検し、レビュー指摘と同種の説明不足・誤りを問題本文で修正する。
- [X] 全Problemから具体例・確認問題・確認する観点・解答と理由の独立節と不要なlocal blockを除去する。スキーマ・生成処理・検証記録も空配列とnot_applicableに対応させる。
- [X] 教材の目的と本文の再現可能性をspec/plan/data-model/quickstart/運用文書およびIssue #47/#48の受入条件へ反映する。
- [X] 更新本文の独立した小入力照合、全248 shardの証跡再生成、Node 24.18.0のverify:fastを完了する。PRのCI結果はPRのChecksへ記録し、T072–T078や公開切替の本人受入とは分ける。
