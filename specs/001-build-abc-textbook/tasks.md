# Tasks: ABC上級問題体系化教科書

**Input**: Design documents from `/specs/001-build-abc-textbook/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Validation**: 自動化可能な検査は Vitest/Playwright/Ajv/build CLI で先に失敗を確認してから実装する。通常更新はmanifest ownerのself-reviewで完結し、公式根拠との矛盾・独自証明・重大な分類変更を含む高リスク項目だけはself-reviewに代えて作成者外のthird-party reviewへ送る。

**Organization**: User Story ごとに独立検証可能な phase を置く。同優先度 P1 のうち US2 を先に実行するのは、全問題の Technique Inventory とコーパス横断 taxonomy が US1 の解説執筆をブロックするためであり、製品優先度の変更ではない。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 未完了taskへ依存せず、別fileで並行実行できる
- **[Story]**: 対応する User Story
- すべての task は実行対象の正確な file または directory path を含む

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

- [ ] T028 [US2] Freeze the US2 learning-outcome review units before story changes and add failing seed-range continuity, D-after scope, dynamic registry, and official-state completeness tests in `docs/work-manifests/initial/us2/manifest.json` and `tests/contract/catalog-scope.test.ts`
- [ ] T029 [P] [US2] Add failing one-inventory-per-problem, source traceability, and no-temporary-tag/unit tests in `tests/contract/technique-inventory.test.ts`
- [ ] T030 [P] [US2] Add failing taxonomy deduplication, tag/unit DAG, deterministic order, representative problem, and placement reachability tests in `tests/contract/taxonomy.test.ts`
- [ ] T031 [P] [US2] Add failing LearningUnit outcome, prerequisite, example, exercise, answer, assessment, and navigation tests in `tests/integration/learning-path.test.ts`

### Corpus inventory for User Story 2

- [ ] T032 [P] [US2] Import and verify only official metadata for ABC 212–263 in `src/content/contests/abc212-abc263/`, `src/content/problem-slots/abc212-abc263/`, `src/content/problems/abc212-abc263/`, and `src/content/sources/abc212-abc263/`
- [ ] T033 [P] [US2] Import and verify only official metadata for ABC 264–315 in `src/content/contests/abc264-abc315/`, `src/content/problem-slots/abc264-abc315/`, `src/content/problems/abc264-abc315/`, and `src/content/sources/abc264-abc315/`
- [ ] T034 [P] [US2] Import and verify only official metadata for ABC 316–367 in `src/content/contests/abc316-abc367/`, `src/content/problem-slots/abc316-abc367/`, `src/content/problems/abc316-abc367/`, and `src/content/sources/abc316-abc367/`
- [ ] T035 [P] [US2] Import and verify only official metadata for ABC 368–419 in `src/content/contests/abc368-abc419/`, `src/content/problem-slots/abc368-abc419/`, `src/content/problems/abc368-abc419/`, and `src/content/sources/abc368-abc419/`
- [ ] T036 [P] [US2] Import and verify only official metadata for ABC 420–466 in `src/content/contests/abc420-abc466/`, `src/content/problem-slots/abc420-abc466/`, `src/content/problems/abc420-abc466/`, and `src/content/sources/abc420-abc466/`
- [ ] T037 [US2] Prove ABC 212–466 continuity, official task-order coverage, and zero dropped advanced labels in `docs/verification/bootstrap/seed-scope.json`
- [ ] T038 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 00 without creating Tag or Unit entities in `src/content/technique-inventory/shard-00/`
- [ ] T039 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 01 without creating Tag or Unit entities in `src/content/technique-inventory/shard-01/`
- [ ] T040 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 02 without creating Tag or Unit entities in `src/content/technique-inventory/shard-02/`
- [ ] T041 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 03 without creating Tag or Unit entities in `src/content/technique-inventory/shard-03/`
- [ ] T042 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 04 without creating Tag or Unit entities in `src/content/technique-inventory/shard-04/`
- [ ] T043 [P] [US2] Create source-backed TechniqueInventoryItem records for deterministic problem-ID shard 05 without creating Tag or Unit entities in `src/content/technique-inventory/shard-05/`
- [ ] T044 [US2] Validate one complete inventory record per scoped Problem and freeze its corpus digest in `docs/verification/bootstrap/technique-inventory.json`

### Taxonomy and textbook implementation for User Story 2

- [ ] T045 [US2] Synthesize the full-corpus candidate clusters, overlaps, outliers, prerequisites, and proposed outcomes without mutating canonical taxonomy in `docs/verification/bootstrap/taxonomy-synthesis.md`
- [ ] T046 [US2] Freeze one non-overlapping taxonomy review unit per accepted outcome and define observable, non-duplicated LearningOutcome entities in `docs/work-manifests/initial/us2/taxonomy/` and `src/content/learning-outcomes/`
- [ ] T047 [US2] Define canonical TechniqueTag entities with definitions, outcomes, parents, prerequisites, aliases, old names, and representative Problems in `src/content/tags/`
- [ ] T048 [US2] Materialize and validate separate Tag and LearningUnit prerequisite DAGs plus the deterministic standard order in `src/content/policies/learning-order.json`
- [ ] T049 [US2] Apply the canonical placement decision table to every Problem with primary/supporting tags, unique primary outcome review unit, and full/similar/supplement evidence in `src/content/policies/problem-placements.json`
- [ ] T050 [US2] Define chapter/section/subsection LearningUnit entities with baseline/additional prerequisites, outcomes, examples, Problems, and assessments in `src/content/learning-units/`
- [ ] T051 [P] [US2] Freeze one work manifest per accepted outcome and author graph/search/modeling units and structured learning items in `docs/work-manifests/initial/graph-search/`, `src/content/docs/learn/graph-search/`, `src/content/examples/graph-search/`, `src/content/exercises/graph-search/`, `src/content/assessments/graph-search/`, and `src/content/answer-materials/graph-search/`
- [ ] T052 [P] [US2] Freeze one work manifest per accepted outcome and author dynamic-programming units and structured learning items in `docs/work-manifests/initial/dynamic-programming/`, `src/content/docs/learn/dynamic-programming/`, `src/content/examples/dynamic-programming/`, `src/content/exercises/dynamic-programming/`, `src/content/assessments/dynamic-programming/`, and `src/content/answer-materials/dynamic-programming/`
- [ ] T053 [P] [US2] Freeze one work manifest per accepted outcome and author data-structure/algorithm-design units and structured learning items in `docs/work-manifests/initial/data-structures/`, `src/content/docs/learn/data-structures/`, `src/content/examples/data-structures/`, `src/content/exercises/data-structures/`, `src/content/assessments/data-structures/`, and `src/content/answer-materials/data-structures/`
- [ ] T054 [P] [US2] Freeze one work manifest per accepted outcome and author mathematics/combinatorics units and structured learning items in `docs/work-manifests/initial/mathematics/`, `src/content/docs/learn/mathematics/`, `src/content/examples/mathematics/`, `src/content/exercises/mathematics/`, `src/content/assessments/mathematics/`, and `src/content/answer-materials/mathematics/`
- [ ] T055 [P] [US2] Freeze one work manifest per accepted outcome and author string/geometry units and structured learning items in `docs/work-manifests/initial/string-geometry/`, `src/content/docs/learn/string-geometry/`, `src/content/examples/string-geometry/`, `src/content/exercises/string-geometry/`, `src/content/assessments/string-geometry/`, and `src/content/answer-materials/string-geometry/`
- [ ] T056 [P] [US2] Freeze one work manifest per accepted outcome and author hybrid/advanced-modeling units and structured learning items in `docs/work-manifests/initial/hybrid/`, `src/content/docs/learn/hybrid/`, `src/content/examples/hybrid/`, `src/content/exercises/hybrid/`, `src/content/assessments/hybrid/`, and `src/content/answer-materials/hybrid/`
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
- [ ] T066 [P] [US1] Author outcome-scoped graph/search/modeling explanations, claims, examples, and review manifests in `src/content/docs/problems/graph-search/`, `src/content/claims/graph-search/`, `src/content/examples/graph-search/`, and `docs/work-manifests/initial/problem-explanations/graph-search/`
- [ ] T067 [P] [US1] Author outcome-scoped dynamic-programming explanations, claims, examples, and review manifests in `src/content/docs/problems/dynamic-programming/`, `src/content/claims/dynamic-programming/`, `src/content/examples/dynamic-programming/`, and `docs/work-manifests/initial/problem-explanations/dynamic-programming/`
- [ ] T068 [P] [US1] Author outcome-scoped data-structure/algorithm-design explanations, claims, examples, and review manifests in `src/content/docs/problems/data-structures/`, `src/content/claims/data-structures/`, `src/content/examples/data-structures/`, and `docs/work-manifests/initial/problem-explanations/data-structures/`
- [ ] T069 [P] [US1] Author outcome-scoped mathematics/combinatorics explanations, claims, examples, and review manifests in `src/content/docs/problems/mathematics/`, `src/content/claims/mathematics/`, `src/content/examples/mathematics/`, and `docs/work-manifests/initial/problem-explanations/mathematics/`
- [ ] T070 [P] [US1] Author outcome-scoped string/geometry explanations, claims, examples, and review manifests in `src/content/docs/problems/string-geometry/`, `src/content/claims/string-geometry/`, `src/content/examples/string-geometry/`, and `docs/work-manifests/initial/problem-explanations/string-geometry/`
- [ ] T071 [P] [US1] Author outcome-scoped hybrid/advanced-modeling explanations, claims, examples, and review manifests in `src/content/docs/problems/hybrid/`, `src/content/claims/hybrid/`, `src/content/examples/hybrid/`, and `docs/work-manifests/initial/problem-explanations/hybrid/`
- [ ] T072 [US1] Execute every runnable example in its declared environment and record input, procedure, expected, observed, and digest evidence in `docs/verification/bootstrap/examples.json`
- [ ] T073 [US1] Re-evaluate every non-full placement against algorithm, proof, complexity, constraints, prerequisites, implementation differences, and learning outcomes in `docs/verification/bootstrap/problem-placements.json`
- [ ] T074 [US1] Have the policy-selected reviewer (`self` for normal changes, `third_party` instead of `self` for fixed high-risk cases) review non-automatable new or changed technical claims and examples in `docs/reviews/human-content/bootstrap/problem-explanations/`
- [ ] T075 [US1] Validate 100% explanation structure, source traceability, skill version, terminology, copyright-safe quotation, example reproducibility, and zero unresolved review findings in `docs/verification/bootstrap/explanations.json`
- [ ] T076 [US1] Generate the public Problem-to-Explanation mapping without duplicating canonical tag/unit data in `src/lib/catalog/build-problem-explanations.ts`
- [ ] T077 [US1] Pre-fix and execute the five-problem, three-genre, two-label self-study for SC-009 in `docs/verification/learner-outcomes/bootstrap/sc-009.json`
- [ ] T078 [US1] Have the policy-selected reviewer confirm outcome coverage and run every applicable US1 check (`self` for normal changes, `third_party` instead of `self` for the fixed high-risk policy), resolve all findings, and store the mode-labeled acceptance matrix plus current-subject MergeReviewEvidence in `docs/verification/bootstrap/us1.json` and `docs/reviews/human-content/bootstrap/us1/merge-review.json`

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

- [ ] T083 [US3] Implement versioned IndexedDB opening, migrations, and catalog-independent Problem-ID records in `src/lib/learning-records/database.ts`
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

- [ ] T099 [US4] Implement the single canonical layout, breadcrumbs, section navigation, previous/next links, skip link, and external-link labeling in `src/layouts/TextbookLayout.astro`
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

- [ ] T116 [US5] Implement latest-ended and explicit-range discovery with offline-fixture mode and no in-progress Contest ingestion in `scripts/update-abc/discover.ts`
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
- [ ] T134 [P] Recompute ABC continuity, official D-after slots, dynamic registry, public Problem coverage, classification, reachability, and direct-link coverage in `docs/verification/initial-release/corpus-completeness.json`
- [ ] T135 [P] Recompute inventory-to-taxonomy coverage, duplicate concepts, Tag/Unit cycles, deterministic order, placement decisions, and learning-outcome traceability in `docs/verification/initial-release/taxonomy.json`
- [ ] T136 [P] Verify authoritative sources, version-dependent claims, confirmation dates, source corrections, allowed-use metadata, and quotation limits in `docs/verification/initial-release/sources-and-claims.json`
- [ ] T137 [P] Execute all runnable examples and verify every exercise, assessment, and answer material against its outcome in `docs/verification/initial-release/examples-and-answers.json`
- [ ] T138 [P] Run build, axe, keyboard, 320-CSS-pixel reflow, terminology, text-alternative, no-JavaScript, and internal-link suites in `docs/verification/initial-release/accessibility-and-links.json`
- [ ] T139 [P] Run full-route learning-control equivalence, independent timestamps, migration, filter, and 100+ record backup/rollback suites in `docs/verification/initial-release/learning-records.json`
- [ ] T140 [P] Run public search/index/catalog/sitemap/feed closure checks and prove staging and local state exclusion in `docs/verification/initial-release/public-projections.json`
- [ ] T141 [P] Benchmark seed, release-cutoff, and 1,500-Problem/500-Tag/1,000-Unit fixtures plus filter p95 against SC-019 in `docs/verification/initial-release/performance.json`
- [ ] T142 [P] Audit client bundles, external dependencies, telemetry, accounts, paid services, and a deterministic 52-week update simulation for zero additional required cost in `docs/verification/initial-release/zero-cost-52-weeks.json`
- [ ] T143 Freeze an offset-qualified initial `cutoffAt`, discover all ended ABCs after 466, and process every missing Contest through normal updates in `staging/updates/initial-catch-up/`
- [ ] T144 Re-run all T133–T142 validators after catch-up and reject any unresolved Problem, temporary taxonomy, missing review, or changed learner record in `docs/verification/initial-release/post-catch-up.json`
- [ ] T145 Prepare one immutable initial ReleaseCandidate containing bootstrap and all catch-up updates in `staging/release-candidates/initial/release-candidate.json`
- [ ] T146 Complete the policy-selected review check inventory for the exact candidate digest (`self` for normal changes, `third_party` instead of `self` for every fixed high-risk claim/example scope) in `docs/reviews/human-content/initial-release/`
- [ ] T147 Re-run the pre-fixed SC-009 and SC-010 protocols plus SC-012 representative timing against the exact candidate digest in `docs/verification/learner-outcomes/initial-release/`
- [ ] T148 Bind explicit owner approval to the unchanged candidate/content/review/evidence digests in `staging/release-candidates/initial/owner-approval.json`
- [ ] T149 Execute read-only final validation, dependency-closure comparison, publish simulation, and rollback rehearsal without regenerating content in `docs/verification/initial-release/final-validation.json`
- [ ] T150 Finalize the exact production commands, locks, backup, rollback boundary, receipt recovery, and verification steps in `docs/operations/initial-release-runbook.md`
- [ ] T151 Audit the final candidate against the original goal, all FR/CQ/SC requirements, Constitution 2.0.0, self/third-party review policy, one-user scope, and zero-cost boundary in `docs/verification/initial-release/goal-and-constitution.json`
- [ ] T152 Publish the already-approved and already-final-validated candidate atomically without content changes by following `docs/operations/initial-release-runbook.md`
- [ ] T153 Verify the append-only receipt, immutable Release history, public content digest, route/search availability, rollback state, and learning-record compatibility in `docs/verification/publish-receipts/initial-release.json`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependency.
- **Foundational (Phase 2)**: depends on Phase 1 and blocks all stories.
- **US2 (Phase 3, P1)**: starts after Phase 2 and T028 freezes the story manifest; full metadata → all TechniqueInventory shards → corpus-wide synthesis → canonical taxonomy/DAG → textbook content. T029–T031 wait for T028, T045 cannot start until T038–T044 finish, and T051–T056 cannot start until T046–T050 finish.
- **US1 (Phase 4, P1)**: depends on the accepted US2 taxonomy and placements. Explanation authoring T066–T071 cannot start before T064–T065 and T049; no per-contest temporary taxonomy is permitted.
- **US3 (Phase 5, P1)**: can start after Phase 2 using catalog fixtures once T079 freezes the story manifest, but final evidence depends on stable public Problem IDs from US1/US2.
- **US4 (Phase 6, P2)**: depends on US1/US2 canonical content and begins with the T095 manifest; learning-state integration also depends on US3.
- **US5 (Phase 7, P2)**: depends on the schemas and policies from Phase 2, begins with the T112 manifest, and validates against all completed story outputs.
- **Initial Release (Phase 8)**: depends on all user stories. T152 is forbidden until T145–T151 are complete in order.

### User Story Dependency Graph

```text
Setup → Foundational → US2 taxonomy ─→ US1 explanations ─┐
                     └──────────────→ US3 records ──────┼→ US4 indexes/UI → US5 updates → Initial release
                                                       └───────────────────────────────────────────────┘
```

- **US2** is the corpus-first learning-system base and is independently testable from inventory, DAG, units, and SC-010.
- **US1** consumes only accepted US2 taxonomy; it never creates Tag/Unit while processing a Problem.
- **US3** remains independent of taxonomy revisions because records key only by stable Problem ID.
- **US4** is the integrated reverse-index view and uses fixtures before full content is available.
- **US5** reuses the same ingestion, taxonomy, authoring, validation, and release rules used by bootstrap.

### Within Each User Story

- Contract/unit/E2E tests are written first and observed failing before implementation.
- Canonical data precedes derived pages and indexes.
- Automated checks precede the policy-selected self-review or risk-triggered third-party review; findings must be resolved before approval.
- Approval freezes digests; final validation is read-only; production publication is the last mutating step.

## Parallel Opportunities

- T002–T003 and T005–T007 can proceed on different setup files.
- T009–T012, T013–T017, and T020–T025 can proceed in their marked groups.
- T032–T036 may collect metadata in parallel because their directories do not overlap; they do not create taxonomy.
- T038–T043 may inventory deterministic Problem-ID shards in parallel; T044 is the join barrier.
- T051–T056 and T066–T071 may proceed by accepted LearningOutcome domain with disjoint work manifests and content directories.
- All test-authoring groups and T133–T142 final read-only audits may run in parallel as marked.

## Parallel Example: User Story 2

```text
Task T038: inventory shard 00 in src/content/technique-inventory/shard-00/
Task T039: inventory shard 01 in src/content/technique-inventory/shard-01/
Task T040: inventory shard 02 in src/content/technique-inventory/shard-02/
Task T041: inventory shard 03 in src/content/technique-inventory/shard-03/
Task T042: inventory shard 04 in src/content/technique-inventory/shard-04/
Task T043: inventory shard 05 in src/content/technique-inventory/shard-05/
```

The join task T044 proves complete corpus coverage before T045 may synthesize any canonical taxonomy.

## Parallel Example: User Story 1

```text
Task T066: graph/search/modeling explanation review units
Task T067: dynamic-programming explanation review units
Task T068: data-structure/algorithm-design explanation review units
Task T069: mathematics/combinatorics explanation review units
Task T070: string/geometry explanation review units
Task T071: hybrid/advanced-modeling explanation review units
```

Each task owns disjoint Outcome/Problem/Claim/Example paths and uses the already-frozen taxonomy.

## Implementation Strategy

### Goal-Preserving MVP

1. Complete Setup and Foundational phases.
2. Complete US2 inventory, taxonomy, and minimum coherent textbook path.
3. Complete US1 explanations against that taxonomy.
4. Validate US1 and US2 independently before adding management or automation features.

The MVP is US2 + US1, not a sample contest slice: a contest slice would violate the requested systematic corpus-first textbook objective.

### Incremental Delivery

1. Full corpus inventory and taxonomy → independently validate learning order.
2. Full explanation corpus → independently validate reproducible understanding.
3. Local learning records → independently validate progress tracking and backup.
4. Reverse indexes/search → validate one-operation reachability and dynamic labels.
5. Weekly update pipeline → validate idempotent maintenance and correction handling.
6. Integrate, freeze, review, approve, final-validate, runbook-audit, then publish once.

## Notes

- `[P]` never authorizes concurrent edits to the same canonical file.
- Contest-number batches are allowed only for official metadata and progress accounting.
- Technique inventory is complete before taxonomy synthesis; taxonomy is accepted before explanation authoring.
- Optional tools may assist, but no paid service, specific model, external cohort, separate auditor, multi-user account, or always-on backend is a required task.
- No production publish occurs in US5 simulation. T152 is the only production publication task and is gated by the runbook and goal audit.
