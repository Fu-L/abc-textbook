# Implementation Plan: ABC上級問題体系化教科書

**Branch**: `main` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-build-abc-textbook/spec.md`

## Summary

ABC 212から公開基準日時点の最新終了済みABCまでについて、公式問題一覧でDより後に並ぶ全問題を収録し、全コーパスを横断した典型・学習成果・前提関係で教科書と問題集を構成する。固定のE〜H列ではなく、各公開範囲で確認した上級問題記号の和集合を公式順に扱う。

実装は静的Web教材とローカル更新CLIを一つのTypeScriptプロジェクトに置く。教材正本はGit管理の構造化データとMarkdown、学習記録はブラウザー内、更新候補は公開正本と分離したstagingに保存する。初期制作では、Foundational完了後に複数分野・複数Contestを含む小さなprivate previewを一周させ、設計上の問題を早期に検出する。そのpreviewで使う仮taxonomyはstagingだけに置き、全対象問題の公式メタデータ、全ProblemのTechnique Inventory、コーパス横断の正式taxonomyを揃えた後に、明示的な統合表を通して最終正本を生成する。

## Technical Context

**Language/Version**: Node.js 24 LTS（通常開発は`>=24.18.0 <25.0.0`、リリース基準版は24.18.0）、TypeScript 6.x strict/ESM。Node/npmの対応範囲とリリース基準版を分離し、依存はlockfileで完全版を固定する。

**Primary Dependencies**: Astro 7、Starlight 0.41、Zod 4、idb、Cheerio、Ajv 8、Vitest 4、Playwright、axe、Linkinator。すべてlockfileで完全版を固定する。

**Storage**: 教材正本と公開履歴はGit管理のJSON/Markdown、更新候補はrepo内staging、個人学習記録はブラウザーのIndexedDB、バックアップは版付きJSONファイル。

**Testing**: Vitestのunit/contract/integration、PlaywrightのChromium/Firefox/WebKit E2E、axe、静的build、内部リンク検査、schema parity、固定fixtureによる更新・rollback・性能検査。CIではリリース基準版と対応範囲の別patch版で同じ`verify:fast`を実行する。

**Target Platform**: Node.js 24を実行できる個人所有PCと、静的HTTP配信された標準的なデスクトップ/モバイルブラウザー。必須経路はローカルで完結し、特定ホスティングを要求しない。

**Project Type**: 静的Webアプリケーション + ローカルCLI型コンテンツパイプライン。

**Performance Goals**: 255コンテストの初期規模、公開版の実対象範囲、1,500問題・500タグ・1,000学習単位の設計上限を、記録済みの同一基準環境で各5分以内に検証・生成する。設計上限での複合絞り込みは10回の事前実行後30回測定し、95パーセンタイル100ms以内とする。終了済み1コンテストの更新準備は、完成、要執筆、保留の各fixtureで15分以内に結果を確定する。

**Constraints**: 必須経路の追加費用0円、継続利用者1人、アカウント・常時稼働backend・有料APIなし。開催中コンテストを取得しない。公式問題文・解説を正本へ転載せず、公式URL、確認情報、必要最小限の引用、独自説明を保持する。公開には全自動検査、必要な作成者外レビュー、protected mainへのmergeを要求し、merge済みGit commitを静的hostへ渡す。特定LLM、外部参加者cohort、全OS・全実browserの手動証跡は必須経路にしない。

**Scale/Scope**: 初期制作シードはABC 212〜466の255コンテスト。E〜Hは初期の基準列として認識するが、対象problem slotは文字列かつ公式順として扱い、Dより後の新しい記号を上限なく追加できる。1人分の学習記録を少なくとも1,500問題まで扱う。

## Constitution Check

*GATE: Phase 0開始前に評価し、Phase 1設計後に再評価する。*

**Gate status — PASS (Constitution 2.0.0)**: 統治中の正本は`.specify/memory/constitution.md` 2.0.0である。旧`constitution-v2-proposal.md`は履歴上の参考資料であり、本計画の義務を変更しない。

- **Learning outcomes — PASS**: 仕様は対象学習者、観察可能な共通前提、6つの学習成果、対象/対象外、SC-001〜SC-020を定義する。コンテンツ制作はコンテストbatchではなく学習成果と典型のreview unitで行い、章・解説・例・演習から成果へ追跡する。
- **Accuracy and traceability — PASS**: 公式コンテスト情報と公式解説を第一根拠とし、URL、対象コンテスト、確認日時、取得指紋、訂正系列を保持する。通常更新は管理者の明示self-reviewで完結し、公式根拠との矛盾・独自証明・重大な分類変更の高リスク更新だけをself-reviewに代えてthird-party reviewへ送る。
- **Progression and accessibility — PASS**: 全コーパス横断のTechnique Inventoryからタグと学習単位を作り、タグDAGと学習単位DAGを別々に検証する。用語初出、見出し、ランドマーク、表caption、代替テキスト、キーボード操作、色に依存しない状態表示、狭い画面での代替一覧を要求する。
- **Reproducibility — PASS**: 実行可能例と解答資料は環境、入力、手順、期待結果を持ち、公開前に記載手順で検証する。依存版、fixture seed/digest、実行結果を固定する。
- **Consistency and maintainability — PASS**: schema、前提baseline、placement policy、glossary、authoring skillを正本化し、表示索引と公開データは正本から生成する。Zod shapeは`schema-parts/*`だけが定義し、`schemas.ts`は公開集約に限定する。追加toolingはwork manifestへ保守上の利益を記録する。
- **Review gate — PASS**: 一つの論理変更を学習成果単位に固定し、リスク理由のない変更は管理者が成果被覆をself-reviewして適用可能な全自動検査を自ら実行する。manifestへ固定した高リスク理由がある変更だけはself-reviewに代えてthird-party reviewerを必須とし、review modeとactorを証跡で区別する。既知失敗が残る変更をmerge・公開しない。
- **Preview and shard join — PASS**: private previewはstagingへ隔離し、同じ実装経路を複数分野・Contest・labelで一周させる。final taxonomyは全Inventoryから再生成し、Outcome/Problem shardはpath非重複・shard別review後に全件joinする。preview成功や個別shard成功をFR-001/SC-001の代替にしない。

### Phase 1設計後の再評価

- `data-model.md`は全教材単位と成果・前提・出典の参照、Advanced Problem Slotの動的順序、学習記録、更新・公開状態を定義する。
- `contracts/`は固定4枠ではなくslot registryと公式順を契約化し、学習記録、更新、最小release metadata、レビュー、前提、placement、glossaryを機械検証できる。
- `quickstart.md`は新しい問題記号を含むfixture、`initial-v1` private vertical preview、仮taxonomy統合、Outcome/Problem shard join、全コーパスtaxonomy、解説、学習管理、更新、公開rollbackを別々に検証する。
- 全設計成果物に未解消の憲章違反はない。Gate resultは**PASS**である。

## Project Structure

### Documentation (this feature)

```text
specs/001-build-abc-textbook/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── catalog.schema.json
│   ├── learning-record.schema.json
│   ├── update-manifest.schema.json
│   ├── release-metadata.schema.json
│   ├── content-work-manifest.schema.json
│   ├── merge-review.schema.json
│   ├── human-content-review-evidence.schema.json
│   ├── prerequisite-baseline.schema.json
│   ├── problem-placement-decision-table.schema.json
│   ├── glossary.schema.json
│   ├── learner-outcome-evidence.schema.json
│   ├── user-timing-evidence.schema.json
│   ├── learning-record-e2e-evidence.schema.json
│   ├── performance-evidence.schema.json
│   ├── answer-material-evidence.schema.json
│   ├── instruction-quality-evidence.schema.json
│   ├── client-bundle-evidence.schema.json
│   ├── cli.md
│   └── ui-routes.md
└── tasks.md
```

### Source Code (repository root)

```text
package.json
package-lock.json
.nvmrc
.npmrc
.gitattributes

.agents/skills/abc-explanation-author/
├── SKILL.md
├── references/
└── templates/

src/
├── content.config.ts
├── content/
│   ├── docs/problems/
│   ├── docs/learn/
│   ├── contests/
│   ├── problem-slots/
│   ├── problems/
│   ├── technique-inventory/
│   ├── tags/
│   ├── learning-outcomes/
│   ├── learning-units/
│   ├── sources/
│   ├── glossary/terms.json
│   ├── policies/
│   └── releases/
├── components/
├── layouts/
├── pages/
├── lib/
│   ├── domain/
│   │   ├── schema-parts/
│   │   ├── schemas.ts
│   │   └── index.ts
│   ├── catalog/
│   ├── learning-records/
│   └── validation/
└── styles/

scripts/
├── update-abc/
├── validate/
├── preview-verify.ts
├── catalog-build.ts
├── catalog-validate.ts
├── verify-release.ts
└── deploy-release.ts

staging/
├── previews/
│   └── initial-v1/
└── updates/

tests/
├── contract/
├── integration/
├── unit/
├── e2e/
├── performance/
└── fixtures/

docs/
├── work-manifests/
│   └── initial/problem-authoring-units/
│       ├── index.json
│       └── shards/
├── reviews/human-content/
├── operations/
└── verification/
    └── previews/
        └── initial-v1/
```

**Structure Decision**: Astro/Starlight単一プロジェクトに教材表示、共有domain、更新CLIを置く。サイトとCLIは同じZod shape、安定ID、slot ordering、DAG、前提baseline、placement policy、glossaryを共有する。shape定義は`src/lib/domain/schema-parts/*.ts`、公開集約は`schemas.ts`/`index.ts`に限定し、JSON Schemaはそこから生成する。private preview、未公開更新、仮taxonomyは`staging/`または`docs/verification/previews/`に隔離し、`src/content/`へ直接書き込まない。protected mainのrequired checksを通ったGit commitだけをdeployment adapterへ渡す。

## Phase 0: Outline & Research

調査結果は[research.md](./research.md)へ集約する。解決対象は、公式問題一覧からDより後を動的に抽出する規則、静的教材と端末内保存、公式情報の安全な取得、authoring skillの境界、全コーパスtaxonomy、冪等更新、追加費用0円の公開経路、現行ツール版である。すべてDecision / Rationale / Alternatives considered形式で解消する。

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md): 教材正本、動的problem slot registry、Technique Inventory、タグ/学習単位DAG、個人学習記録、更新・公開状態を定義する。
- `contracts/*.schema.json`: catalog、学習記録、更新、最小release metadata、work manifest、review、前提、placement、glossary、検証証跡を定義する。Zod shapeから生成し、手書きの二重正本を残さない。
- [contracts/cli.md](./contracts/cli.md): 単一開始操作、merge前検証、Git commitデプロイ、終了code、冪等性、失敗時の契約を定義する。
- [contracts/ui-routes.md](./contracts/ui-routes.md): 静的route、動的slot表、検索、学習状態、バックアップ、accessibilityを定義する。
- [quickstart.md](./quickstart.md): offline fixtureだけで主要シナリオを再現し、任意の公式network確認を分離する。

### Canonical Schema Ownership

`src/lib/domain/schema-parts/catalog.ts`、`learning.ts`、`release.ts`、`review-evidence.ts`、`verification-evidence.ts`だけがZod shapeを定義する。`schemas.ts`はpartの再export、`index.ts`はdomain public APIの再exportに限定する。JSON Schema生成器、意味検証器、UI、CLIはこれらをimportし、field、enum、requirednessを再定義しない。

### Dynamic Advanced Problem Slots

各Contestは公式問題一覧の順序を保存する。対象判定はラベルの固定enumではなく「Dの位置より後」によって行う。公開版は対象Contestのadvanced slot labelを公式順に安定統合した`AdvancedSlotRegistry`を持ち、E〜Hは存在する限り通常列として扱うが、Iその他の新しいlabelも同じ経路へ入れる。各Contestについてregistry上のlabelが存在しない場合は公式問題なし、確認不能なら理由付き保留とする。

slot labelの比較は表示文字列の辞書順では行わない。Contest内は公式task order、release全体は最初に確認された公式順と既存registry順を安定維持し、矛盾する順序が出た場合は公開を保留して人間確認する。

### Preview-First Vertical Milestone

Foundational phaseの完了後、全コーパス制作を待たずに`initial-v1` private previewを作る。これは実ユーザーへ公開するReleaseではなく、設計を実データで検証するstaging snapshotである。previewの不完全な件数を公開版の達成率へ算入してはならず、FR-001/SC-001を満たしたと主張してはならない。

preview cohortは、選定規則をT028で固定し、候補範囲の公式metadataとsource-backedな軽量分野・成果候補poolをT032で取得・検証した後、T037で次の決定的な規則によりfreezeする。T028ではProblem IDやSource Revisionを先に固定せず、T032の候補poolは完全なTechnique Inventoryやtaxonomyを代替しない。

1. graph/search、dynamic-programming、data-structures/algorithm-design、mathematics/combinatoricsの4分野から、候補Learning Outcomeごとに2 Problem以上を選ぶ。
2. 合計8 Problem以上、3 Contest以上、2種類以上のadvanced slot labelを含める。seedで条件を満たせない場合は、同じ規則を固定したfuture-label fixtureを併用し、実データとfixtureの範囲をmanifestで分ける。
3. 各候補は`(contest number, official task order, problem ID)`の順で安定選択し、選定漏れや条件不足は推測で補わずpreviewを保留する。
4. 選定Problem、Source Revision、候補Outcome、必要check、生成物path、対象外の全Problemを`staging/previews/initial-v1/preview-manifest.json`へ固定する。

previewは次の縦切りを同一cohortで通す。

`official metadata → Technique Inventory → provisional Tag/Outcome/DAG/Placement → ProblemAuthoringUnit/LearningUnit inline content → static UI/search → local LearningRecord → update preparation/release simulation`

各段階はpreview digestを引き継ぎ、失敗時は次段へ進めず具体的なhold reasonを残す。T064で版付きのauthoring skill、入力packet、source normalization、template、version、digestをfreezeし、T051–T054/T119はそのskill manifestを必須入力として同じ`authoringSkillVersion`/`authoringSkillDigest`をcomponent evidenceへ記録する。最小限のUI・学習記録・更新処理は本番用の共通実装をfixtureへ接続して検証し、preview専用の別実装を作らない。T094/T111/T126が固定する`docs/verification/previews/initial-v1/components/learning-records.json`、`ui-search.json`、`update-simulation.json`と、T045/T051–T054のmetadata/taxonomy/content component manifest、T064の`docs/verification/authoring-skill/initial-v1/skill-manifest.json`をT154の明示的な入力にする。T154の`preview:verify`は固定manifestとこれらのartifact digestだけを読み、同一cohort・同一current subject・同一authoring skill subjectで再計算する。全Problemが一つのpreview catalogから問題、解説、Learning Unit、Tag、learning record、update statusへ到達でき、source/claim/example/answer/link/accessibility/rollbackの全適用checkとpolicyに応じたreview evidenceがcurrent digestへ結び付いたときだけ、`staging/previews/<preview-id>/snapshots/<joinDigest>.json`へ不変の`PreviewSnapshot.status=passed`を作成する。canonical snapshotは同一directory内の一時ファイルからrenameして一度だけcommitし、`docs/verification/previews/<preview-id>/preview-join/<joinDigest>.json`には`PreviewSnapshotReference`だけを別途作成する。この二つのdirectoryへの書き込み全体を一つのatomic operationとはみなさず、`staging/previews/<preview-id>/transactions/<joinDigest>.json`のphaseとrecovery手順で、途中停止時はcanonical snapshotを正本に参照だけを再生成する。欠落、stale digest、skill mismatch、失敗check、review不在は新しい`on_hold` snapshotとして保存し、既存snapshotを上書きせず、T159のfinal taxonomy、T065のshard index、T127以降のproduction release validation/deployをpreviewの前提にしてはならない。

### Corpus-First Final Taxonomy and Authoring

preview後も、公開taxonomyは全コーパスから再計算する。初期制作は次の順序を守る。

1. ABC 212〜466の全ContestとDより後の全slot/problem metadataを収集し、欠落・公式状態を確定する。
2. 全Problemについて、公式根拠から主たる解法、証明着眼点、必要前提、実装上の注意、候補成果を`TechniqueInventoryItem`として棚卸しする。問題単位で主解法を確認した項目だけ`reviewed`とし、公式解説の用語検出による候補は`draft`のまま保持してT159のfinal taxonomy受理前に確認する。計算量解析自体が解法選択や実現可能性の本質となる特殊な場合に限り、公式解説または問題固有の解析で確定した解法全体の計算量を任意欄へ記録する。通常の計算量と、部分テクニックの汎用fallback計算量は生成しない。
3. 全inventoryを横断して、正式Tag、Learning Outcome、Tag前提DAG、Learning Unit前提DAG、標準学習順、Problem Placementを設計する。同義の仮Tagや一問専用Unitを正本へ残さない。
4. T154のpreview PASS後に、T159がT044でfreezeした全Inventoryからfinal Tag/Outcome/Unit候補、二つのDAG、標準順、全ProblemPlacement、完全なTaxonomyIntegrationMapを決定生成し、policy-selected review後に一つの`FinalTaxonomyBuild` digestとして受理する。T047–T050はそのaccepted digestをcanonical entityへmaterializeするだけで、preview候補を直接正本にしない。preview用のT051–T054はcomponent digestを固定した時点で完了し、canonicalな全コーパス展開はT055–T056とT155–T158の別taskで行う。その後T065で`outcomeId`ごとにProblem IDを公式順で並べ、最大8 Problemの連続したOutcome/Problem shardへ分割し、shardごとに独立したwork manifest、paths、checks、review evidenceと同一`indexDigest`を生成する。
5. 各Problemを主たるLearning Outcomeのshardへ一意に割り当て、完全解説または根拠付きの類題/補充問題を執筆する。
6. domain別のLearning Unit本文、例、演習、解答、到達確認を作り、全Problemが教科書順またはTag問題集から到達できることを検証する。
7. T057/T075–T076/T078のfull-corpus content・explanation・mapping acceptance後にT160を実行し、preview fixtureへ接続していた共有catalog、route、matrix、search、Pagefind、sitemap/feedをcanonical full-corpus sourceへ一度だけ切り替えてdigestをfreezeする。T138/T140/T145/T146はこの固定projectionを検証・消費し、切替を暗黙に実行しない。

previewの仮taxonomyから最終taxonomyへの統合は、T159の`FinalTaxonomyBuild`で全Inventoryを入力に一度だけ決定・review・acceptし、T047–T050がaccepted digestをmaterializeする。次の規則を必ず適用する。

- 仮Tag/Outcome/Unitは`staging/previews/`のnamespaceにのみ存在し、`src/content/tags/`、`learning-outcomes/`、`learning-units/`、公開catalogへ直接コピーしない。
- 全ProblemのInventory digestを入力に、各仮entityを`promote`、既存entityへの`merge`、複数entityへの`split`、`retire`のいずれかへ一度だけ対応付ける。対応表にはpreview ID、final ID、影響Problem ID、根拠、review policy、旧IDのalias/redirectを記録する。
- `merge`は定義・前提・成果が包含関係にあり、重複Tagを一つへ縮約できる場合だけ許す。`split`は全コーパスの該当Problemを再分類し、各分割先に定義・成果・代表問題・前提を満たす証拠がある場合だけ許す。単純な名称一致で昇格させない。
- 仮DAGのedgeをそのまま最終DAGへ持ち込まず、final Inventory全件からTag/Outcome/Unitの各DAGと標準順を再生成し、循環・未知参照・前提違反が0件であることを確認する。
- Problem ID、Source Revision、LearningRecordのkeyは変更せず、taxonomy再編で影響する本文、例、演習、解答、placement、索引を`CorrectionImpact`へ完全列挙する。対応未確定の仮entityまたは影響未確認Problemが一つでもあればfinal taxonomyを受理しない。
- final taxonomyの受理後にのみcanonical contentへmaterializeし、preview snapshotはimmutableな検証証跡として残す。previewの成果物を公開Releaseへ混在させない。

コンテスト番号batchは公式metadata取得と進捗管理にだけ使い、taxonomyや章構成の境界には使わない。content work manifestはOutcome/Problem shardを一問単位の`ProblemAuthoringUnit`集合としてreview unitにし、scope、paths、前提、checks、review evidenceをcontent変更前に固定する。Claim、Example、Exercise、Assessment、Answerを独立review unitや別保存先へ分割しない。shardは他shardのcanonical fileを編集せず、共有LearningUnit/TagはUS2のfinal taxonomy joinだけが所有する。

### Prerequisites, Placement, and Terminology

共通前提baseline、problem placement decision table、glossaryを別々の唯一の正本にする。全LearningUnitとProblemAuthoringUnitはbaseline、追加前提または追加前提なし、対象外を直接参照する。placementは`full`既定で、主要解説と主成果・前提・解法・証明・漸近計算量が同じ場合だけ`similar`、単一の副次的技能だけを追加する場合だけ`supplement`を許す。どの行にも一意に一致しない場合は保留する。

学習順は前提DAGをhard constraintとし、同時に配置可能なUnitの安定rankとUnit IDで決定する。表示上は前提、難易度、代表性による順序理由を確認できるようにする。

### Initial Release Cutoff and Catch-up

ABC 212〜466はbootstrap seedであり公開上限ではない。初版candidate直前にoffset付き`cutoffAt`を固定し、終了済み最新ABCまでの未収録Contestを昇順に通常updateへ通す。各ContestではDより後の全公式problemを列挙し、未完成解説、未解消分類、仮taxonomy、検証失敗、保留updateが一件でもあれば初版candidateを作らない。private previewはこのgateの対象範囲外であり、previewの成功を全件収録の代替にしない。

bootstrapと全catch-up updateをCatalogのrelease change summaryへ束ねる。自動検査とpolicyに応じたself-reviewまたは高リスク時のthird-party reviewをprotected mainのmerge条件にし、成功したfull Git commitだけを静的hostへdeployする。cutoff後に終了したContestは次回対象とし、rollbackは既知release commitを再deployする。

## Verification Strategy

| 成果 | 自動検証 | 人間確認 |
|---|---|---|
| Preview vertical slice | T045/T051–T054/T094/T111/T126が固定したpreview component manifestとT154の`preview:verify`による固定cohortの分野/Contest/label条件、metadata→inventory→仮taxonomy→content→UI/search→LearningRecord→updateのdigest join、全Problem到達性、rollback、staging/public分離、current-subject review evidence、canonical snapshotと派生referenceのrecovery | previewを公開Releaseと誤認しないこと、full taxonomy・production release・deployをjoinへ混入させないこと、二重保存をPreviewSnapshotと誤認しないこと、欠落/stale/hold理由 |
| 対象範囲 | 開催済みContestと公式欠番証跡による番号連続性、公式task order、Dより後の全slot/problem、動的registry、将来label fixture | 公式一覧の順序矛盾・取得不能・欠番assertion変更時だけ確認 |
| 解説 | 必須構成、出典、前提、成果、計算量、例、skill版、内部参照、self/third-party mode | 通常は管理者self-review。公式根拠との矛盾・独自証明・重大な分類変更だけself-reviewに代えてauthor外third-party reviewerが確認 |
| 典型体系 | inventory全件対応、Tag/Unit DAG、同義語、代表問題、到達可能性、安定順 | 通常は管理者self-review。重大なtaxonomy/classification変更だけself-reviewに代えてthird-party reviewerが確認 |
| Preview→final taxonomy | 仮entityの全件mapping、promote/merge/split/retireの根拠、Problem/Source/Record ID不変、全影響列挙、final DAG再計算 | split/major classification changeはthird-party policyを適用 |
| Outcome/Problem shards | `outcomeId`単位、公式順、最大8 Problem、path非重複、shard別check/review/preview、全shard joinの欠落0件 | shard scope外の変更を混入させていないこと |
| 演習・解答 | Outcome参照、理由または検証方法、実行可能部分の結果、全件inventory | 自動実行不能な解答の妥当性を確認 |
| 学習記録 | schema移行、独立日時、再読込、filter、100件backup/restore、rollback | SC-012の代表操作とSC-009/010の事前固定自己評価 |
| 逆引き・検索 | previewではT099–T111、full-corpusではT160がcanonical catalog、動的slot表、代替一覧、全destination link、検索種別、0件結果、未公開除外を生成し、T138/T140/T146が固定digestを検証 | 表・検索・学習順が迷わず使えるか確認 |
| 週次更新 | 終了判定、差分、3種結果、冪等性、訂正影響、hold/resume、15分 | 保留理由、分類候補、公開差分を管理者が確認 |
| 公開 | protected mainのfull Git commit、全check、selfまたはrequired third-party review evidence、最小metadata、既知commitの再deploy rollback | 管理者がmerge前に変更履歴・検証URL・review modeを確認 |
| 品質 | build、link、axe、keyboard、reflow、用語、AnswerMaterial、性能、client bundle | 自動化不能項目だけを限定確認 |
| 無料運用 | 必須外部依存inventoryと52週fixture | 有料経路が必須化していないことを管理者が確認 |

`verify:release`は証跡数だけで成功させず、merge対象のGit treeから、FR-001/SC-001に対応するABC 212〜cutoffの連続性とDより後の全Problemの100%収録、全Problemの学習到達性、dynamic contest matrix、検索、簡易学習管理を直接再計算する。preview artifact、仮taxonomy、未結合shard、未解決holdはrelease commitのcontent treeへ入れない。いずれかが欠ければrequired checkを失敗させる。

## Complexity Tracking

憲章違反はないため例外登録はない。次の設計複雑性は元目的を直接守る範囲に限定する。

| 設計境界 | 必要性 | 制御 |
|---|---|---|
| 動的AdvancedSlotRegistry | E以上の将来labelを固定4枠で落とさない | 公式task orderを正本とし、順序矛盾を保留する |
| corpus-wide Technique Inventory | 問題別仮Tagを後から継ぎ接ぎせず体系化する | 全Problem coverageと重複Tag検査をtaxonomy前に通す |
| private vertical preview | 全コーパス完了前にschema・依存・UI・学習記録・更新の設計欠陥を検出する | staging namespace、preview digest、final gate除外、仮taxonomy統合表を固定する |
| Outcome/Problem shards | 巨大なdomain taskを独立review可能な作業単位へ分解する | final placement後に決定的生成し、最大8 Problem、path非重複、join gateを強制する |
| baseline・placement・glossaryの3正本 | 前提、掲載形態、用語の責務を混同しない | 各正本を一つにし、loaderとdigestで複製を拒否する |
| Git releaseとdeployment adapter | 検証済みsnapshotだけを公開しrollback可能にする | protected main、full commit hash、静的hostのdeploy履歴、既知commitの再deployを使う |

追加LLM panel、独立constitution auditor、外部learner cohort、実browser 8組合せ、3 OS必須証跡は採用しない。これらは統治中の憲章が要求せず、1人用の教材・簡易学習管理という目的に対して保守負担が大きいためである。
