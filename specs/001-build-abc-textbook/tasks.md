# Tasks: ABC上級問題体系化教科書

**Input**: Design documents from `/specs/001-build-abc-textbook/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Validation**: 自動化可能な検査は Vitest/Playwright/Ajv/build CLI で先に失敗を確認してから実装する。通常更新はmanifest ownerのself-reviewで完結し、公式根拠との矛盾・独自証明・重大な分類変更を含む高リスク項目だけはself-reviewに代えて作成者外のthird-party reviewへ送る。private previewはstaging/public分離を検証し、Outcome/Problem shardはshard単位でbuild・review・previewした後に全件joinを行う。

**Organization**: User Story ごとに独立検証可能な phase を置く。Foundational完了後に、複数分野・複数Contest・複数labelのprivate vertical previewを同じ実装経路で一周させる。その後に全コーパスのInventoryとfinal taxonomyをjoinし、US1の解説はOutcome/Problem shard単位で生成・追跡する。P1のUS2を設計上先行させるのは、final taxonomyの所有権を確定するためであり、previewを全件完了まで遅延させる理由にはしない。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 未完了taskへ依存せず、別fileで並行実行できる
- **[Story]**: 対応する User Story
- すべての task は実行対象の正確な file または directory path を含む

## Delivery Contracts: Preview, Taxonomy Integration, and Shards

### Private vertical preview milestone (`initial-v1`)

`initial-v1`は公開Releaseではなく、`staging/previews/initial-v1/`と`docs/verification/previews/initial-v1/`だけに保存する設計検証用snapshotである。T028–T031でcohortの選定規則と失敗テストをfreezeし、T032で候補範囲の公式metadataを取得・検証した後、T037で実際のcohort manifestをfreezeする。T038/T045/T051–T054/T083/T099/T116の各preview実装は、全コーパスbatchを待たずに同じcohortを入力として通せることを確認し、T154で全componentをjoinする。preview専用の別catalog、UI、LearningRecord、update実装は作らない。

同じtaskを二度手書きで複製しないため、preview scopeとfull scopeを同じ実装へ渡す。previewの依存列は`T028 (rules/tests) → T032 (official metadata) → T037 (cohort freeze) → T038 (inventory) → T045 (provisional taxonomy) → T051–T054 (four-domain content) → T083–T094/T099–T110/T116–T132 (LearningRecord/UI/update) → T154 (join gate)`、fullの依存列は`T032–T044(full) → T045(full) → T046–T050 → T055–T056 → T066–T071`とする。T154はpreview scopeのcomponentだけを入力にし、full scopeのjoinはpreview scopeの成功を待つが、preview scopeはfull scopeの完了を待たない。T066–T071にはT154を追加の前提として明示する。

cohortの完了条件は次の通りである。

- graph/search、dynamic-programming、data-structures/algorithm-design、mathematics/combinatoricsの4分野、8 Problem以上、3 Contest以上、2種類以上のadvanced labelを含む。実データだけで条件を満たせない場合は、使用fixtureと実データをmanifestで分離する。
- `official metadata → Technique Inventory → provisional taxonomy/placement → Explanation/Claim/Example/Exercise/AnswerMaterial → static UI/search → local LearningRecord → update/release simulation`を同一preview digestで完走する。
- source、claim、example、answer、link、accessibility、schema、rollback、idempotencyの適用checkがすべて成功し、問題ごとに到達先とhold reasonが存在する。
- review policyに応じたself/third-party evidenceがcurrent preview digestへ結び付く。preview成功はFR-001/SC-001の全件coverageを意味せず、preview artifactは公開candidateへ入らない。

### Provisional taxonomy integration

`staging/previews/initial-v1/taxonomy/`の仮Tag/Outcome/Unitは、全Problem Inventoryが揃うまでcanonical contentへmaterializeしない。T045–T049で各仮entityを`promote`、`merge`、`split`、`retire`のいずれかへ一度だけ対応付け、preview ID、final ID、影響Problem ID、根拠、review mode、alias/redirect、CorrectionImpactを`docs/verification/previews/initial-v1/taxonomy-integration.json`へ固定する。仮DAGをコピーせず、全Inventoryからfinal DAG・標準順・placementを再計算する。未対応entity、未列挙影響、未知参照、循環、未分類Problemが一つでもあればjoinをholdする。

### Generated Outcome/Problem shard contract

T066–T071は巨大なdomain単位の本文作業ではなく、`docs/work-manifests/initial/problem-explanations/index.json`からOutcome/Problem shard work itemを生成・ディスパッチするtaskである。生成単位は`primaryOutcomeId`ごとにProblem IDを公式順で並べた最大8件の連続chunkとし、各shardへ次を一意に割り当てる。

- `shardId`、明示的なProblem/Claim/Example ID、前提shard、所有path、required checks、evidence path、review policy、preview status
- `src/content/docs/problems/<outcome>/<shardId>/`、`src/content/claims/<outcome>/<shardId>/`、`src/content/examples/<outcome>/<shardId>/`、`docs/work-manifests/initial/problem-explanations/<outcome>/<shardId>/`の非重複path
- shard単独のsource/structure/example/answer/link/accessibility検証、current-subject review evidence、private preview snapshot

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
- [X] T012 [P] Add failing release state, immutable snapshot, approval digest, review completeness, and publish-receipt transition tests in `tests/unit/release-state.test.ts`
- [X] T013 Define Contest, AdvancedSlotRegistry, ContestSlotRecord, Problem, TechniqueInventoryItem, TechniqueTag, LearningOutcome, LearningUnit, ProblemPlacement, source, claim, example, exercise, assessment, and answer-material Zod shapes in `src/lib/domain/schema-parts/catalog.ts`
- [X] T014 [P] Define LearningRecord and versioned backup/preview/merge Zod shapes without account or sync fields in `src/lib/domain/schema-parts/learning.ts`
- [X] T015 [P] Define PublicationUpdate, AuthoringResult, ReleaseCandidate, immutable Release, and PublishReceipt Zod shapes in `src/lib/domain/schema-parts/release.ts`
- [X] T016 [P] Define ContentWorkManifest review policy, self/third-party HumanContentReviewEvidence, MergeReviewEvidence, LearnerOutcomeEvidence, and UserTimingEvidence Zod shapes in `src/lib/domain/schema-parts/review-evidence.ts`
- [X] T017 [P] Define performance, executable-example, answer-material, instruction-quality, client-bundle, and filesystem-publish evidence Zod shapes in `src/lib/domain/schema-parts/verification-evidence.ts`
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

## Phase 3: User Story 2 - 典型テクニックを学習順にたどる (Priority: P1)

**Goal**: 全対象問題の技法棚卸しから重複のない典型体系・前提DAG・標準学習順を作り、教科書と典型別問題集をたどれるようにする。

**Independent Test**: 全 TechniqueInventoryItem を入力に taxonomy を再生成し、正式タグの成果・代表問題、二つの非循環DAG、決定的順序、全Problemの到達可能性を確認し、5つの現在地から教材だけで次の単位を80%以上正しく特定する。

### Tests for User Story 2

- [ ] T028 [US2] Freeze the US2 learning-outcome review units and the `initial-v1` cohort-selection rules before story changes, but do not select Problem IDs or Source Revisions yet; add failing seed-range continuity, D-after scope, dynamic registry, official-state completeness, cohort diversity, and staging/public-separation tests in `docs/work-manifests/initial/us2/manifest.json`, `staging/previews/initial-v1/preview-manifest.json`, and `tests/contract/catalog-scope.test.ts`
- [ ] T029 [P] [US2] Add failing one-inventory-per-problem, source traceability, preview digest-chain, and no-temporary-tag/unit-publication tests in `tests/contract/technique-inventory.test.ts` and `tests/contract/preview-scope.test.ts`
- [ ] T030 [P] [US2] Add failing provisional taxonomy mapping, promote/merge/split/retire, final re-generation, deduplication, tag/unit DAG, deterministic order, representative problem, and placement reachability tests in `tests/contract/taxonomy.test.ts` and `tests/contract/taxonomy-integration.test.ts`
- [ ] T031 [P] [US2] Add failing LearningUnit outcome, prerequisite, example, exercise, answer, assessment, navigation, same-cohort vertical preview, component-digest join, `PreviewSnapshot` status/hold, current-subject review, stale-artifact, and no-overwrite tests in `tests/integration/learning-path.test.ts` and `tests/integration/vertical-preview.test.ts`

### Corpus inventory for User Story 2

- [ ] T032 [US2] Acquire and verify the official metadata needed to select the `initial-v1` preview cohort, retain the same official-source parser and metadata shape for the ABC 212–263 range, and record each Problem ID, official order, and Source Revision without freezing the cohort in `staging/previews/initial-v1/`, `src/content/contests/abc212-abc263/`, `src/content/problem-slots/abc212-abc263/`, `src/content/problems/abc212-abc263/`, and `src/content/sources/abc212-abc263/`
- [ ] T033 [P] [US2] Import and verify only official metadata for ABC 264–315 after T032 metadata acquisition; this task may run in parallel with T037 because it does not select or mutate the preview cohort in `src/content/contests/abc264-abc315/`, `src/content/problem-slots/abc264-abc315/`, `src/content/problems/abc264-abc315/`, and `src/content/sources/abc264-abc315/`
- [ ] T034 [P] [US2] Import and verify only official metadata for ABC 316–367 after T032 metadata acquisition; this task may run in parallel with T037 because it does not select or mutate the preview cohort in `src/content/contests/abc316-abc367/`, `src/content/problem-slots/abc316-abc367/`, `src/content/problems/abc316-abc367/`, and `src/content/sources/abc316-abc367/`
- [ ] T035 [P] [US2] Import and verify only official metadata for ABC 368–419 after T032 metadata acquisition; this task may run in parallel with T037 because it does not select or mutate the preview cohort in `src/content/contests/abc368-abc419/`, `src/content/problem-slots/abc368-abc419/`, `src/content/problems/abc368-abc419/`, and `src/content/sources/abc368-abc419/`
- [ ] T036 [P] [US2] Import and verify only official metadata for ABC 420–466 after T032 metadata acquisition; this task may run in parallel with T037 because it does not select or mutate the preview cohort in `src/content/contests/abc420-abc466/`, `src/content/problem-slots/abc420-abc466/`, `src/content/problems/abc420-abc466/`, and `src/content/sources/abc420-abc466/`
- [ ] T037 [US2] After T032 has verified the candidate metadata, deterministically select and freeze the `initial-v1` cohort by contest number, official task order, Problem ID, four-domain coverage, contest diversity, advanced-label diversity, Source Revisions, fixture boundaries, and excluded Problems in `staging/previews/initial-v1/preview-manifest.json` and `docs/verification/previews/initial-v1/cohort-selection.json`; reject missing or contradictory metadata instead of guessing
- [ ] T038 [P] [US2] Create source-backed TechniqueInventoryItem records for the preview cohort and deterministic problem-ID shard 00 without creating Tag or Unit entities, writing preview records only under `staging/previews/initial-v1/technique-inventory/` until the full-corpus join in `src/content/technique-inventory/shard-00/`
- [ ] T039 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 01 without creating Tag or Unit entities in `src/content/technique-inventory/shard-01/`
- [ ] T040 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 02 without creating Tag or Unit entities in `src/content/technique-inventory/shard-02/`
- [ ] T041 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 03 without creating Tag or Unit entities in `src/content/technique-inventory/shard-03/`
- [ ] T042 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 04 without creating Tag or Unit entities in `src/content/technique-inventory/shard-04/`
- [ ] T043 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 05 without creating Tag or Unit entities in `src/content/technique-inventory/shard-05/`
- [ ] T044 [US2] Validate one complete inventory record per scoped Problem, prove ABC 212–466 continuity and official task-order coverage with zero dropped advanced labels, compare the frozen preview cohort against the full Problem-ID set, reject preview-only leakage into canonical content, and freeze the corpus digest in `docs/verification/bootstrap/technique-inventory.json` without accepting a partial join

### Taxonomy and textbook implementation for User Story 2

- [ ] T045 [US2] In preview scope, generate the `initial-v1` provisional taxonomy and integration candidates immediately from the preview Inventory; in full scope, synthesize all-corpus clusters, overlaps, outliers, prerequisites, and proposed outcomes without mutating canonical taxonomy in `staging/previews/initial-v1/taxonomy/`, `docs/verification/previews/initial-v1/taxonomy-integration.json`, and `docs/verification/bootstrap/taxonomy-synthesis.md`
- [ ] T046 [US2] In preview scope, freeze non-overlapping candidate taxonomy review units; in full scope, accept each provisional `promote`/`merge`/`split`/`retire` decision with affected Problem IDs and evidence and define observable non-duplicated LearningOutcome entities in `docs/work-manifests/initial/us2/taxonomy/`, `docs/verification/previews/initial-v1/taxonomy-integration.json`, and `src/content/learning-outcomes/`
- [ ] T047 [US2] Define canonical TechniqueTag entities only from the accepted full-corpus mapping, including definitions, outcomes, parents, prerequisites, aliases, old names, and representative Problems; reject preview-only or one-Problem tags in `src/content/tags/`
- [ ] T048 [US2] Recompute and validate separate Tag and LearningUnit prerequisite DAGs plus the deterministic standard order from the full Inventory, rather than copying preview edges, in `src/content/policies/learning-order.json`
- [ ] T049 [US2] Apply the canonical placement decision table to every Problem with primary/supporting tags, unique primary outcome review unit, and full/similar/supplement evidence; enumerate preview taxonomy changes through `CorrectionImpact` in `src/content/policies/problem-placements.json` and `docs/verification/bootstrap/problem-placements.json`
- [ ] T050 [US2] Define chapter/section/subsection LearningUnit entities with baseline/additional prerequisites, outcomes, examples, Problems, and assessments in `src/content/learning-units/`
- [ ] T051 [P] [US2] Freeze one work manifest per preview candidate Outcome and author the graph/search/modeling preview learning path first, then expand it through the same accepted final taxonomy in `docs/work-manifests/initial/graph-search/`, `staging/previews/initial-v1/learning/graph-search/`, `src/content/docs/learn/graph-search/`, `src/content/examples/graph-search/`, `src/content/exercises/graph-search/`, `src/content/assessments/graph-search/`, and `src/content/answer-materials/graph-search/`
- [ ] T052 [P] [US2] Freeze one work manifest per preview candidate Outcome and author the dynamic-programming preview learning path first, then its full-corpus expansion with structured learning items in `docs/work-manifests/initial/dynamic-programming/`, `staging/previews/initial-v1/learning/dynamic-programming/`, `src/content/docs/learn/dynamic-programming/`, `src/content/examples/dynamic-programming/`, `src/content/exercises/dynamic-programming/`, `src/content/assessments/dynamic-programming/`, and `src/content/answer-materials/dynamic-programming/`
- [ ] T053 [P] [US2] Freeze one work manifest per preview candidate Outcome and author the data-structure/algorithm-design preview learning path first, then its full-corpus expansion with structured learning items in `docs/work-manifests/initial/data-structures/`, `staging/previews/initial-v1/learning/data-structures/`, `src/content/docs/learn/data-structures/`, `src/content/examples/data-structures/`, `src/content/exercises/data-structures/`, `src/content/assessments/data-structures/`, and `src/content/answer-materials/data-structures/`
- [ ] T054 [P] [US2] Freeze one work manifest per preview candidate Outcome and author the mathematics/combinatorics preview learning path first, then its full-corpus expansion with structured learning items in `docs/work-manifests/initial/mathematics/`, `staging/previews/initial-v1/learning/mathematics/`, `src/content/docs/learn/mathematics/`, `src/content/examples/mathematics/`, `src/content/exercises/mathematics/`, `src/content/assessments/mathematics/`, and `src/content/answer-materials/mathematics/`
- [ ] T055 [P] [US2] After the accepted final taxonomy, freeze one work manifest per Outcome and author string/geometry units and structured learning items in `docs/work-manifests/initial/string-geometry/`, `src/content/docs/learn/string-geometry/`, `src/content/examples/string-geometry/`, `src/content/exercises/string-geometry/`, `src/content/assessments/string-geometry/`, and `src/content/answer-materials/string-geometry/`
- [ ] T056 [P] [US2] After the accepted final taxonomy, freeze one work manifest per Outcome and author hybrid/advanced-modeling units and structured learning items in `docs/work-manifests/initial/hybrid/`, `src/content/docs/learn/hybrid/`, `src/content/examples/hybrid/`, `src/content/exercises/hybrid/`, `src/content/assessments/hybrid/`, and `src/content/answer-materials/hybrid/`
- [ ] T057 [US2] Generate learning-path navigation and order reasons exclusively from the validated DAG in `src/lib/catalog/build-learning-path.ts`
- [ ] T058 [US2] Verify every exercise and answer material against its LearningOutcome and record executable or documented-procedure evidence in `docs/verification/bootstrap/answer-materials.json`
- [ ] T059 [US2] Have the policy-selected reviewer confirm outcome coverage and run the taxonomy/DAG/placement/reachability/learning-path/terminology/cross-reference suites (`self` for normal changes, `third_party` instead of `self` for fixed high-risk classification changes), and record mode-labeled current-subject MergeReviewEvidence in `docs/verification/bootstrap/us2.json` and `docs/reviews/human-content/bootstrap/us2/merge-review.json`
- [ ] T060 [US2] Pre-fix and execute the five-position graph/DP/data-structure/mathematics learning-path self-study for SC-010 in `docs/verification/learner-outcomes/bootstrap/sc-010.json`

**Checkpoint**: Full-corpus taxonomy and textbook order are stable; no contest-batch Tag/Unit or unreachable Problem remains.

---

## Phase 4: User Story 1 - 問題を理解して再現可能な解法を学ぶ (Priority: P1) 🎯 MVP

**Goal**: 体系確定後、全対象問題を学習成果単位で執筆し、自然な考察、証明、計算量、制約、実装、検証、復習助言を提供する。

**Independent Test**: 任意の5問を含む全公開Explanationの品質契約と出典を検査し、事前固定した5問で解説なしに着眼点・典型・正当性・計算量と制約整合を80%以上説明できる。

### Tests for User Story 1

- [ ] T061 [US1] Freeze the US1 learning-outcome review units before story changes and add failing authoring-skill input/output, insufficient-input hold, required-section, source, and skill-version tests in `docs/work-manifests/initial/us1/manifest.json` and `tests/contract/explanation-authoring-skill.test.ts`
- [ ] T062 [P] [US1] Add failing full/similar/supplement decision, source revision, technical claim, reproducible example, and explanation completeness tests in `tests/contract/explanation-quality.test.ts`
- [ ] T063 [P] [US1] Add three fixed good-input and incomplete-input skill fixtures in `tests/fixtures/authoring-skill/manifest.json`

### Implementation for User Story 1

- [ ] T064 [US1] Create the self-contained versioned explanation authoring skill, references, and templates in `.agents/skills/abc-explanation-author/SKILL.md`, `.agents/skills/abc-explanation-author/references/`, and `.agents/skills/abc-explanation-author/templates/`
- [ ] T065 [US1] Normalize official source revisions, verification dates, constraints, and allowed-use metadata needed by all explanations in `src/content/sources/`
- [ ] T066 [US1] After T154 has passed and the final taxonomy, placements, authoring skill, and source revisions are available, generate and freeze the deterministic Outcome/Problem shard index, then dispatch and author the graph/search/modeling shard work items independently (maximum 8 Problem IDs, non-overlapping paths) in `docs/work-manifests/initial/problem-explanations/index.json`, `src/content/docs/problems/graph-search/`, `src/content/claims/graph-search/`, `src/content/examples/graph-search/`, and `docs/work-manifests/initial/problem-explanations/graph-search/`
- [ ] T067 [P] [US1] After T154 has passed, generate dynamic-programming Outcome/Problem shard work items from the deterministic index, then author and independently build/review/preview each generated shard with its own evidence and hold state in `src/content/docs/problems/dynamic-programming/`, `src/content/claims/dynamic-programming/`, `src/content/examples/dynamic-programming/`, and `docs/work-manifests/initial/problem-explanations/dynamic-programming/`
- [ ] T068 [P] [US1] After T154 has passed, generate data-structure/algorithm-design Outcome/Problem shard work items from the deterministic index, then author and independently build/review/preview each generated shard with no shared canonical-file writes in `src/content/docs/problems/data-structures/`, `src/content/claims/data-structures/`, `src/content/examples/data-structures/`, and `docs/work-manifests/initial/problem-explanations/data-structures/`
- [ ] T069 [P] [US1] After T154 has passed, generate mathematics/combinatorics Outcome/Problem shard work items from the deterministic index, then author and independently build/review/preview each generated shard with source, example, answer, and cross-reference evidence in `src/content/docs/problems/mathematics/`, `src/content/claims/mathematics/`, `src/content/examples/mathematics/`, and `docs/work-manifests/initial/problem-explanations/mathematics/`
- [ ] T070 [P] [US1] After T154 has passed, generate string/geometry Outcome/Problem shard work items from the deterministic index, then author and independently build/review/preview each generated shard with explicit primary Outcome ownership in `src/content/docs/problems/string-geometry/`, `src/content/claims/string-geometry/`, `src/content/examples/string-geometry/`, and `docs/work-manifests/initial/problem-explanations/string-geometry/`
- [ ] T071 [P] [US1] After T154 has passed, generate hybrid/advanced-modeling Outcome/Problem shard work items from the deterministic index, then author and independently build/review/preview each generated shard with all shard-local evidence before the global join in `src/content/docs/problems/hybrid/`, `src/content/claims/hybrid/`, `src/content/examples/hybrid/`, and `docs/work-manifests/initial/problem-explanations/hybrid/`
- [ ] T072 [US1] Execute every runnable example in its declared environment and record input, procedure, expected, observed, and digest evidence in `docs/verification/bootstrap/examples.json`
- [ ] T073 [US1] Re-evaluate every non-full placement against algorithm, proof, complexity, constraints, prerequisites, implementation differences, and learning outcomes in `docs/verification/bootstrap/problem-placements.json`
- [ ] T074 [US1] Have the policy-selected reviewer (`self` for normal changes, `third_party` instead of `self` for fixed high-risk cases) review non-automatable new or changed technical claims and examples in `docs/reviews/human-content/bootstrap/problem-explanations/`
- [ ] T075 [US1] Validate every generated shard independently and then join the full Outcome/Problem shard index for 100% explanation structure, source traceability, skill version, terminology, copyright-safe quotation, example reproducibility, non-overlapping paths, zero orphan/duplicate Problem IDs, and zero unresolved review findings in `docs/verification/bootstrap/explanations.json` and `docs/verification/bootstrap/problem-explanation-shards.json`
- [ ] T076 [US1] Generate the public Problem-to-Explanation mapping without duplicating canonical tag/unit data in `src/lib/catalog/build-problem-explanations.ts`
- [ ] T077 [US1] Pre-fix and execute the five-problem, three-genre, two-label self-study for SC-009 in `docs/verification/learner-outcomes/bootstrap/sc-009.json`
- [ ] T078 [US1] Have the policy-selected reviewer confirm each shard's outcome coverage and the joined US1 coverage, run every applicable US1 check (`self` for normal changes, `third_party` instead of `self` for the fixed high-risk policy), resolve all findings, and store the mode-labeled acceptance matrix plus current-subject MergeReviewEvidence in `docs/verification/bootstrap/us1.json` and `docs/reviews/human-content/bootstrap/us1/merge-review.json`

**Checkpoint**: Every scoped Problem has either a complete independent explanation or a fully evidenced similar/supplement placement, and SC-009 passes.

---

## Phase 5: User Story 3 - 解答状況と要復習を管理する (Priority: P1)

**Goal**: 一人の学習者が端末内で status と要復習を独立管理し、絞り込み・バックアップ・原子的復元を行えるようにする。

**Independent Test**: 任意Problemで修了と要復習を30秒以内に設定してreload後も独立日時を保持し、100件以上のbackupをpreview後に100%復元し、失敗注入時の部分反映を0件にする。

### Tests for User Story 3

- [ ] T079 [US3] Freeze the US3 learning-outcome review units before story changes and add failing IndexedDB schema, migration, default-state, and catalog-update preservation tests in `docs/work-manifests/initial/us3/manifest.json` and `tests/unit/learning-record-store.test.ts`
- [ ] T080 [P] [US3] Add failing status/needsReview independent-transaction, timestamp, reload, and error-feedback component tests in `tests/integration/learning-record-control.test.ts`
- [ ] T081 [P] [US3] Add failing five-class preview, component-wise newer-wins, tie, invalid-item, rollback, unknown-ID, and 100-record restore tests in `tests/integration/learning-record-backup.test.ts`
- [ ] T082 [P] [US3] Add failing Chromium/Firefox/WebKit shared-contract E2E and 30-second operator-flow tests in `tests/e2e/learning-records.spec.ts`

### Implementation for User Story 3

- [ ] T083 [US3] Implement versioned IndexedDB opening, migrations, and catalog-independent Problem-ID records, and run the same contract against the `initial-v1` preview catalog without changing Problem IDs in `src/lib/learning-records/database.ts` and `staging/previews/initial-v1/`
- [ ] T084 [US3] Implement independent atomic status and needsReview actions with offset timestamps in `src/lib/learning-records/store.ts`
- [ ] T085 [US3] Build the shared accessible learning-record control and no-JavaScript/IndexedDB-unavailable states in `src/components/LearningRecordControl.tsx`
- [ ] T086 [US3] Implement stable localized date/time/timezone display and `更新記録なし` handling in `src/components/LearningRecordTimestamp.astro`
- [ ] T087 [US3] Implement Problem-ID joins and combined contest/slot/tag/unit/status/needsReview filters in `src/lib/learning-records/filter.ts`
- [ ] T088 [US3] Implement versioned privacy-minimal JSON export in `src/lib/learning-records/export.ts`
- [ ] T089 [US3] Implement schema-first five-class import preview with component-level source/reason/result details in `src/lib/learning-records/import-preview.ts`
- [ ] T090 [US3] Implement `newer-wins`, `backup-wins`, `cancel`, tie handling, and one-transaction rollback in `src/lib/learning-records/import-apply.ts`
- [ ] T091 [US3] Build backup selection, preview, conflict-policy confirmation, apply result, and storage status UI in `src/pages/settings/learning-records.astro`
- [ ] T092 [US3] Build the initial `needsReview=1` page with extra filters and no external state transmission in `src/pages/review/index.astro`
- [ ] T093 [US3] Record full-route shared-contract E2E, representative raw timing, and reload evidence in `docs/verification/user-timing/bootstrap/sc-012.json`
- [ ] T094 [US3] Have the policy-selected reviewer confirm outcome coverage and run all US3 checks including 100+ record success/failure restore (`self` for normal changes, `third_party` instead of `self` when a fixed high-risk condition applies), resolve findings, and record current-subject mode-labeled MergeReviewEvidence in `docs/verification/bootstrap/learning-record-restore.json` and `docs/reviews/human-content/bootstrap/us3/merge-review.json`

**Checkpoint**: Status and review state are independent, local-only, recoverable, and preserved across content changes.

---

## Phase 6: User Story 4 - 問題やコンテストから逆引きする (Priority: P2)

**Goal**: 動的contest表、問題・タグ・学習単位索引、検索、相互参照から全対象問題へ迷わず到達できるようにする。

**Independent Test**: future I fixtureを含む表で全状態と列を確認し、収録済み各cellから全destinationへ一操作、各検索語から正規routeへ到達し、未公開候補と端末状態が検索へ混入しないことを検証する。

### Tests for User Story 4

- [ ] T095 [US4] Freeze the US4 learning-outcome review units before story changes and add failing route, base-path, static-content-without-JavaScript, and canonical navigation tests in `docs/work-manifests/initial/us4/manifest.json` and `tests/contract/ui-routes.test.ts`
- [ ] T096 [P] [US4] Add failing dynamic-column, non-empty state, direct-link, alternative-list, future-I, and reflow tests in `tests/e2e/contest-matrix.spec.ts`
- [ ] T097 [P] [US4] Add failing Pagefind entity/alias/hierarchy/contest search, zero-result, and unpublished/local-state exclusion tests in `tests/e2e/search.spec.ts`
- [ ] T098 [P] [US4] Add failing keyboard, landmark, heading, table-header, accessible-name, text-alternative, and color-independence tests in `tests/e2e/accessibility.spec.ts`

### Implementation for User Story 4

- [ ] T099 [US4] Implement the single canonical layout, breadcrumbs, section navigation, previous/next links, skip link, and external-link labeling shared by the `initial-v1` preview and final catalog in `src/layouts/TextbookLayout.astro`
- [ ] T100 [P] [US4] Build home, complete learning path, and LearningUnit routes in `src/pages/index.astro`, `src/pages/learn/index.astro`, and `src/pages/learn/[...slug].astro`
- [ ] T101 [P] [US4] Build TechniqueTag index/detail and Problem index/detail routes from canonical IDs in `src/pages/tags/index.astro`, `src/pages/tags/[slug].astro`, `src/pages/problems/index.astro`, and `src/pages/problems/[problemId].astro`
- [ ] T102 [P] [US4] Build release-history list/detail routes with complete immutable fields and evidence references in `src/pages/updates/index.astro` and `src/pages/updates/[version].astro`
- [ ] T103 [US4] Build the AdvancedSlotRegistry-driven accessible matrix and same-result alternative list in `src/components/ContestMatrix.astro` and `src/pages/contests/index.astro`
- [ ] T104 [US4] Add distinguishable one-operation links from every published cell to Problem, explanation anchor, LearningUnit, primary/supporting TechniqueTags, and similar Problems in `src/components/ContestProblemCell.astro`
- [ ] T105 [US4] Build combined visible-label filters, URL query serialization, result counts, reset, and zero-result guidance in `src/components/ProblemFilters.tsx`
- [ ] T106 [US4] Configure Pagefind documents and entity-kind metadata while excluding controls, staging, obsolete routes, and local state in `src/lib/catalog/search-documents.ts`
- [ ] T107 [US4] Generate the schema-valid public catalog endpoint solely from canonical public content in `src/pages/data/catalog.json.ts`
- [ ] T108 [US4] Implement narrow-screen reflow, two-dimensional-table-only scrolling, focus visibility, and non-color states in `src/styles/accessibility.css`
- [ ] T109 [US4] Run all future-label, direct-navigation, search, no-JavaScript, axe, keyboard, and reflow E2E tests and store results in `docs/verification/bootstrap/us4.json`
- [ ] T110 [US4] Verify all internal links, cross-references, canonical routes, base paths, Pagefind entries, sitemap, and feed in `docs/verification/bootstrap/links-and-search.json`
- [ ] T111 [US4] Have the policy-selected reviewer confirm outcome coverage and run all US4 checks including every target cell/route comparison for SC-002/005/011/017 (`self` for normal changes, `third_party` instead of `self` for fixed high-risk taxonomy changes), resolve findings, and record current-subject mode-labeled MergeReviewEvidence in `docs/verification/bootstrap/reverse-index.json` and `docs/reviews/human-content/bootstrap/us4/merge-review.json`

**Checkpoint**: Every advanced Problem is visible under its official label and reachable from both the learning system and reverse indexes.

---

## Phase 7: User Story 5 - 新しいABCを一操作で追加準備する (Priority: P2)

**Goal**: 終了済み未収録ABCを一操作で安全に候補化し、検証・限定review・承認・原子的公開へ進める。

**Independent Test**: offline fixtureで一回の開始操作から15分以内に全対象Problemを完成草案/要執筆/具体的保留へ分類し、再実行で重複0件、失敗候補の公開0件、承認digest変更0件、publish失敗時の部分切替0件を確認する。

### Tests for User Story 5

- [ ] T112 [US5] Freeze the US5 learning-outcome review units before story changes and add failing ended-contest discovery, D-after scope, future-label, source-failure, and single-start-operation tests in `docs/work-manifests/initial/us5/manifest.json` and `tests/integration/update-discovery.test.ts`
- [ ] T113 [P] [US5] Add failing complete-draft/authoring-required/blocked, authoring-skill integration, and idempotent rerun tests in `tests/integration/update-prepare.test.ts`
- [ ] T114 [P] [US5] Add failing correction-impact, taxonomy-cycle, reachability, index, and hold/resume tests in `tests/integration/update-validation.test.ts`
- [ ] T115 [P] [US5] Add failing fixed-candidate, required-review, approval digest, final-read-only validation, lock, rollback, receipt, and rerun-no-op tests in `tests/integration/release-pipeline.test.ts`

### Implementation for User Story 5

- [ ] T116 [US5] Implement latest-ended and explicit-range discovery with offline-fixture mode and no in-progress Contest ingestion, then run the same update preparation against `initial-v1` without publishing preview state in `scripts/update-abc/discover.ts` and `staging/previews/initial-v1/`
- [ ] T117 [US5] Implement official metadata acquisition, fingerprinting, dynamic advanced slots, and source-failure holds in `scripts/update-abc/acquire.ts`
- [ ] T118 [US5] Implement staging-only diff operations and deterministic update IDs in `scripts/update-abc/stage.ts`
- [ ] T119 [US5] Integrate the versioned authoring skill so each target Problem becomes explanation_draft, authoring_required with complete inputs/template, or blocked with a concrete reason in `scripts/update-abc/author.ts`
- [ ] T120 [US5] Implement existing-taxonomy mapping plus explicit full-corpus impact proposals for unmatched techniques without publishing temporary Tag/Unit entities in `scripts/update-abc/classify.ts`
- [ ] T121 [US5] Implement source, explanation, example, placement, DAG, order, catalog, index, cross-reference, and per-Problem diagnostics in `scripts/update-abc/validate.ts`
- [ ] T122 [US5] Implement one-command orchestration, resumable state, 15-minute timing, stable output, and documented exit codes in `scripts/update-abc/index.ts`
- [ ] T123 [US5] Implement correction impact enumeration across content, examples, exercises, answers, order, and indexes in `scripts/update-abc/correction-impact.ts`
- [ ] T124 [US5] Implement seed bootstrap and normal catch-up updates through the same manifest/state machine in `scripts/update-abc/bootstrap.ts`
- [ ] T125 [US5] Implement multi-update candidate preparation, public/staging closure, immutable snapshot digest, and validation inventory in `scripts/prepare-release-candidate.ts`
- [ ] T126 [US5] Implement fixed risk-policy selection, reviewer-run applicable checks, self-review or required third-party item review, finding resolution, and merge decision in `scripts/review-update.ts`
- [ ] T127 [US5] Implement explicit owner approval bound to candidate/content/review digests in `scripts/approve-update.ts`
- [ ] T128 [US5] Implement read-only final validation with dependency-closure and no post-approval regeneration in `scripts/verify-release.ts`
- [ ] T129 [US5] Implement writer/global locks, same-filesystem atomic switch, rollback-before-receipt, recovery-after-receipt, and append-only receipts in `scripts/publish-update.ts`
- [ ] T130 [US5] Generate public immutable Release history and separate administrator-only hold summaries in `src/lib/catalog/build-release-history.ts`
- [ ] T131 [US5] Have the policy-selected reviewer confirm outcome coverage and run idempotency/failure-injection/correction/approval-freeze/publish-simulation checks (`self` for normal changes, `third_party` instead of `self` for fixed high-risk correction/classification cases), resolve findings, and record current-subject mode-labeled MergeReviewEvidence in `docs/verification/bootstrap/us5.json` and `docs/reviews/human-content/bootstrap/us5/merge-review.json`
- [ ] T132 [US5] Document the weekly prepare/review/approve/validate/publish/backup workflow and every recovery state in `docs/operations/weekly-update.md`

**Checkpoint**: The complete update pipeline works offline and in simulation; no production publish has occurred.

---

## Phase 8: Polish & Cross-Cutting Initial Release

**Purpose**: 全storyを初版候補へ統合し、目的・憲章・品質・費用・性能を最終確認してから初めて実公開する。

- [ ] T133 [P] Run Zod/JSON Schema parity, contract schema validation, unknown-field rejection, and generated-file drift checks in `docs/verification/initial-release/schema-contracts.json`
- [ ] T134 [P] Recompute the authoritative final-release gate independently of preview artifacts: ABC continuity, official D-after slots, dynamic registry, public Problem coverage, classification, reachability, and direct-link coverage must prove FR-001/SC-001 100% coverage in `docs/verification/initial-release/corpus-completeness.json`
- [ ] T135 [P] Recompute inventory-to-final-taxonomy coverage, preview integration-map acceptance, duplicate concepts, Tag/Unit cycles, deterministic order, placement decisions, and learning-outcome traceability; reject provisional or unjoined shards in `docs/verification/initial-release/taxonomy.json` and `docs/verification/previews/initial-v1/taxonomy-integration.json`
- [ ] T136 [P] Verify authoritative sources, version-dependent claims, confirmation dates, source corrections, allowed-use metadata, and quotation limits in `docs/verification/initial-release/sources-and-claims.json`
- [ ] T137 [P] Execute all runnable examples and verify every exercise, assessment, and answer material against its outcome in `docs/verification/initial-release/examples-and-answers.json`
- [ ] T138 [P] Run build, axe, keyboard, 320-CSS-pixel reflow, terminology, text-alternative, no-JavaScript, and internal-link suites in `docs/verification/initial-release/accessibility-and-links.json`
- [ ] T139 [P] Run full-route learning-control equivalence, independent timestamps, migration, filter, and 100+ record backup/rollback suites in `docs/verification/initial-release/learning-records.json`
- [ ] T140 [P] Run public search/index/catalog/sitemap/feed closure checks and prove staging and local state exclusion in `docs/verification/initial-release/public-projections.json`
- [ ] T141 [P] Benchmark seed, release-cutoff, and 1,500-Problem/500-Tag/1,000-Unit fixtures plus filter p95 against SC-019 in `docs/verification/initial-release/performance.json`
- [ ] T142 [P] Audit client bundles, external dependencies, telemetry, accounts, paid services, and a deterministic 52-week update simulation for zero additional required cost in `docs/verification/initial-release/zero-cost-52-weeks.json`
- [ ] T143 Freeze an offset-qualified initial `cutoffAt`, discover all ended ABCs after 466, and process every missing Contest through normal updates in `staging/updates/initial-catch-up/`
- [ ] T144 Re-run all T133–T142 validators after catch-up and reject any unresolved Problem, temporary/provisional taxonomy, unjoined Outcome/Problem shard, missing review, preview artifact leakage, or changed learner record in `docs/verification/initial-release/post-catch-up.json`
- [ ] T145 Prepare one immutable initial ReleaseCandidate containing bootstrap and all catch-up updates in `staging/release-candidates/initial/release-candidate.json`
- [ ] T146 Complete the policy-selected review check inventory for the exact candidate digest (`self` for normal changes, `third_party` instead of `self` for every fixed high-risk claim/example scope) in `docs/reviews/human-content/initial-release/`
- [ ] T147 Re-run the pre-fixed SC-009 and SC-010 protocols plus SC-012 representative timing against the exact candidate digest in `docs/verification/learner-outcomes/initial-release/`
- [ ] T148 Bind explicit owner approval to the unchanged candidate/content/review/evidence digests in `staging/release-candidates/initial/owner-approval.json`
- [ ] T149 Execute read-only final validation, dependency-closure comparison, publish simulation, and rollback rehearsal without regenerating content in `docs/verification/initial-release/final-validation.json`
- [ ] T150 Finalize the exact production commands, locks, backup, rollback boundary, receipt recovery, and verification steps in `docs/operations/initial-release-runbook.md`
- [ ] T151 Audit the final candidate against the original goal, all FR/CQ/SC requirements including FR-001/SC-001, the private-preview exclusion, Outcome/Problem shard join evidence, Constitution 2.0.0, self/third-party review policy, one-user scope, and zero-cost boundary in `docs/verification/initial-release/goal-and-constitution.json`
- [ ] T152 Publish the already-approved and already-final-validated candidate atomically without content changes by following `docs/operations/initial-release-runbook.md`
- [ ] T153 Verify the append-only receipt, immutable Release history, public content digest, route/search availability, rollback state, and learning-record compatibility in `docs/verification/publish-receipts/initial-release.json`

---

## Cross-cutting checkpoint: Private preview join

T154 is defined after the append-only task list so task IDs remain sequential, but it executes after the preview components and before the T066–T071 bulk authoring tasks. It is a delivery gate, not a test-only placeholder.

- [ ] T154 [US2] Join the `initial-v1` preview after T032/T037/T038/T045/T051–T054/T083–T094/T099–T110/T116–T132 have produced their preview component artifacts, wire `preview:verify` in `package.json`, run it from `scripts/preview-verify.ts` as `npm run preview:verify -- --fixture tests/fixtures/previews/initial-v1` against the frozen manifest without reselecting or regenerating inputs, recompute metadata/inventory/provisional-taxonomy/content/UI-search/LearningRecord/update-simulation digests, require every applicable check and current-subject self/third-party review evidence, and atomically create an immutable `PreviewSnapshot` named by `joinDigest` under `staging/previews/initial-v1/snapshots/` and `docs/verification/previews/initial-v1/preview-join/`; a `passed` snapshot is mandatory before T066–T071 and a missing, stale, failed, or incomplete component leaves the new snapshot `on_hold`

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependency.
- **Foundational (Phase 2)**: depends on Phase 1 and blocks all stories.
- **Preview milestone**: starts after Phase 2. T028 freezes only selection rules and failing-contract scope; T032 acquires candidate official metadata; T037 freezes the actual cohort manifest; T029–T031 freeze the remaining preview contracts. The preview path may use the same fixtures and shared implementations from US2/US1/US3/US4/US5 as soon as each component is ready. T154 is the explicit join barrier: it must pass before bulk authoring is treated as design-stable, but it never satisfies the final corpus gate.
- **US2 (Phase 3, P1)**: starts after Phase 2 and T037; preview inventory/taxonomy is staging-only, while T032–T044 still perform the full metadata and TechniqueInventory join. T045 preview mode depends on T037/T038, T045 full mode cannot accept final taxonomy until T038–T044 finish, T051–T056 preview mode may start after the provisional taxonomy, and T154 waits for all preview components before T066–T071.
- **US1 (Phase 4, P1)**: depends on the accepted final US2 taxonomy, placements, and T154. T066–T071 generate and execute independent Outcome/Problem shard work items after T064–T065 and T049; no per-contest temporary taxonomy is permitted.
- **US3 (Phase 5, P1)**: can start after Phase 2 using preview/catalog fixtures once T079 freezes the story manifest; final evidence depends on stable public Problem IDs from US1/US2.
- **US4 (Phase 6, P2)**: can validate shared routes against the private preview fixture after Phase 2, then depends on US1/US2 canonical content for final indexes; learning-state integration also depends on US3.
- **US5 (Phase 7, P2)**: depends on the schemas and policies from Phase 2, begins with the T112 manifest, validates the preview update path first, and validates production candidates against all completed story outputs.
- **Initial Release (Phase 8)**: depends on all user stories. T152 is forbidden until T145–T151 are complete in order.

### User Story Dependency Graph

```text
Setup → Foundational ─┬→ preview components ─→ T154 preview PASS ───────┐
                      ├→ full US2 inventory/taxonomy ──────────────────┼→ US1 shard content ─┐
                      ├→ US3 records (preview then full) ──────────────┼→ US4 indexes/UI → US5 updates → Initial release
                      └→ shared fixture contracts ────────────────────┘
```

- **Preview** is independently testable as a private, digest-bound vertical slice; it cannot be promoted or counted as final coverage.
- **US2** is the corpus-first final learning-system base and is independently testable from full inventory, DAG, units, and SC-010.
- **US1** consumes only accepted final US2 taxonomy; it never creates Tag/Unit while processing a Problem, and each Problem explanation belongs to exactly one generated primary-Outcome shard.
- **US3** remains independent of taxonomy revisions because records key only by stable Problem ID.
- **US4** is the integrated reverse-index view and uses fixtures before full content is available.
- **US5** reuses the same ingestion, taxonomy, authoring, validation, and release rules used by bootstrap.

### Within Each User Story

- Contract/unit/E2E tests are written first and observed failing before implementation.
- Canonical data precedes derived pages and indexes.
- Preview paths use the same canonical implementation and are rejected from public projections; provisional taxonomy is replaced by final taxonomy through the integration map.
- Automated checks precede the policy-selected self-review or risk-triggered third-party review; findings must be resolved before approval.
- Approval freezes digests; final validation is read-only; production publication is the last mutating step.

## Parallel Opportunities

- T002–T003 and T005–T007 can proceed on different setup files.
- T009–T012, T013–T017, and T020–T025 can proceed in their marked groups.
- T032 acquires and verifies the candidate 212–263 metadata without selecting a cohort; T037 freezes the cohort from those verified Source Revisions. T033–T036 may collect the remaining metadata ranges in parallel after T032 and independently of T037 because their directories do not overlap and they do not create taxonomy.
- T038–T043 may inventory deterministic Problem-ID shards in parallel after the preview inventory contract; T044 is the full-corpus join barrier.
- T051–T054 may proceed by provisional preview Outcome with disjoint work manifests; T055–T056 wait for the accepted final taxonomy. T154 joins the four-domain component digests with T083–T094, T099–T110, and T116–T132 before T066 freezes the full-corpus shard index. After T066, T067–T071 may proceed in parallel with disjoint Problem/Claim/Example paths and independent evidence.
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

The join task T044 proves complete corpus coverage before T045 may synthesize the canonical final taxonomy; T045 preview mode may synthesize only the staging provisional taxonomy from the frozen preview Inventory.

## Parallel Example: User Story 1

```text
Task T066: generated graph/search/modeling shards, each with its own work manifest, evidence, review, and private preview
Task T067: generated dynamic-programming shards, each with its own work manifest, evidence, review, and private preview
Task T068: generated data-structure/algorithm-design shards, each with its own work manifest, evidence, review, and private preview
Task T069: generated mathematics/combinatorics shards, each with its own work manifest, evidence, review, and private preview
Task T070: generated string/geometry shards, each with its own work manifest, evidence, review, and private preview
Task T071: generated hybrid/advanced-modeling shards, each with its own work manifest, evidence, review, and private preview
```

Each task owns disjoint Outcome/Problem/Claim/Example paths and uses the already-frozen taxonomy.

## Implementation Strategy

### Goal-Preserving MVP

1. Complete Setup and Foundational phases.
2. Acquire candidate official metadata, freeze the representative cohort, and build the private vertical preview through the shared metadata, taxonomy, content, UI, learning-record, and update paths.
3. Run the explicit T154 join gate, resolve its hold findings, and accept the provisional-to-final taxonomy integration rules without publishing preview data.
4. Complete the full-corpus Inventory join and final taxonomy, then expand explanations through generated Outcome/Problem shards only after the preview PASS.
5. Validate the shard join and final US1/US2 independently before the initial Release candidate.

The private preview is an early feedback milestone, not a reduced public MVP. The public MVP remains subject to the full-corpus FR-001/SC-001 gate.

### Incremental Delivery

1. Private vertical preview → independently validate the complete dependency chain and record holds.
2. Full corpus inventory and final taxonomy integration → independently validate learning order and 100% inventory coverage.
3. Generated Outcome/Problem shards → independently validate each explanation unit, then run the all-shard join.
4. Local learning records → validate progress tracking and backup against stable Problem IDs.
5. Reverse indexes/search → validate one-operation reachability and dynamic labels.
6. Weekly update pipeline → validate idempotent maintenance and correction handling.
7. Integrate, freeze, review, approve, final-validate, runbook-audit, and publish only after the independent final coverage gate passes.

## Notes

- `[P]` never authorizes concurrent edits to the same canonical file.
- Contest-number batches are allowed only for official metadata and progress accounting.
- Preview inventory/taxonomy is staging-only. The final Technique Inventory join is complete before final taxonomy synthesis; final taxonomy is accepted before full explanation shard authoring.
- T154 is the preview join barrier, not a test-only placeholder: it consumes fixed component artifacts, persists the immutable preview result, and blocks T066–T071 unless `status=passed`.
- A generated shard is independently buildable, reviewable, previewable, and path-disjoint; its success never replaces the all-shard join or the final FR-001/SC-001 gate.
- Optional tools may assist, but no paid service, specific model, external cohort, separate auditor, multi-user account, or always-on backend is a required task.
- No production publish occurs in US5 simulation. T152 is the only production publication task and is gated by the runbook and goal audit.
