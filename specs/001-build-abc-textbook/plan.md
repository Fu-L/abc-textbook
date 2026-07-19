# Implementation Plan: ABC上級問題体系化教科書

**Branch**: `main` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-build-abc-textbook/spec.md`

## Summary

ABC 212から公開基準日時点の最新終了済みABCまでについて、公式問題一覧でDより後に並ぶ全問題を収録し、全コーパスを横断した典型・学習成果・前提関係で教科書と問題集を構成する。固定のE〜H列ではなく、各公開範囲で確認した上級問題記号の和集合を公式順に扱う。

実装は静的Web教材とローカル更新CLIを一つのTypeScriptプロジェクトに置く。教材正本はGit管理の構造化データとMarkdown、学習記録はブラウザー内、更新候補は公開正本と分離したstagingに保存する。初期制作では、まず全対象問題の公式メタデータを揃え、次にコーパス横断の技法棚卸しと典型体系を固定し、その後に学習成果単位で解説・章・演習を執筆する。

## Technical Context

**Language/Version**: Node.js 24 LTS（通常開発は`>=24.18.0 <25.0.0`、リリース基準版は24.18.0）、TypeScript 6.x strict/ESM。Node/npmの対応範囲とリリース基準版を分離し、依存はlockfileで完全版を固定する。

**Primary Dependencies**: Astro 7、Starlight 0.41、Zod 4、idb、Cheerio、Ajv 8、Vitest 4、Playwright、axe、Linkinator。すべてlockfileで完全版を固定する。

**Storage**: 教材正本と公開履歴はGit管理のJSON/Markdown、更新候補はrepo内staging、個人学習記録はブラウザーのIndexedDB、バックアップは版付きJSONファイル。

**Testing**: Vitestのunit/contract/integration、PlaywrightのChromium/Firefox/WebKit E2E、axe、静的build、内部リンク検査、schema parity、固定fixtureによる更新・rollback・性能検査。CIではリリース基準版と対応範囲の別patch版で同じ`verify:fast`を実行する。

**Target Platform**: Node.js 24を実行できる個人所有PCと、静的HTTP配信された標準的なデスクトップ/モバイルブラウザー。必須経路はローカルで完結し、特定ホスティングを要求しない。

**Project Type**: 静的Webアプリケーション + ローカルCLI型コンテンツパイプライン。

**Performance Goals**: 255コンテストの初期規模、公開版の実対象範囲、1,500問題・500タグ・1,000学習単位の設計上限を、記録済みの同一基準環境で各5分以内に検証・生成する。設計上限での複合絞り込みは10回の事前実行後30回測定し、95パーセンタイル100ms以内とする。終了済み1コンテストの更新準備は、完成、要執筆、保留の各fixtureで15分以内に結果を確定する。

**Constraints**: 必須経路の追加費用0円、継続利用者1人、アカウント・常時稼働backend・有料APIなし。開催中コンテストを取得しない。公式問題文・解説を正本へ転載せず、公式URL、確認情報、必要最小限の引用、独自説明を保持する。公開には全自動検査、必要な作成者外レビュー、固定候補への管理者承認を要求する。特定LLM、外部参加者cohort、全OS・全実browserの手動証跡は必須経路にしない。

**Scale/Scope**: 初期制作シードはABC 212〜466の255コンテスト。E〜Hは初期の基準列として認識するが、対象problem slotは文字列かつ公式順として扱い、Dより後の新しい記号を上限なく追加できる。1人分の学習記録を少なくとも1,500問題まで扱う。

## Constitution Check

*GATE: Phase 0開始前に評価し、Phase 1設計後に再評価する。*

**Gate status — PASS (Constitution 1.0.0)**: 統治中の正本は`.specify/memory/constitution.md` 1.0.0である。未承認の`constitution-v2-proposal.md`は本計画の義務を変更しない。

- **Learning outcomes — PASS**: 仕様は対象学習者、観察可能な共通前提、6つの学習成果、対象/対象外、SC-001〜SC-020を定義する。コンテンツ制作はコンテストbatchではなく学習成果と典型のreview unitで行い、章・解説・例・演習から成果へ追跡する。
- **Accuracy and traceability — PASS**: 公式コンテスト情報と公式解説を第一根拠とし、URL、対象コンテスト、確認日時、取得指紋、訂正系列を保持する。完全自動判定できない新規・変更主張と例は作成者以外の人間が確認する。
- **Progression and accessibility — PASS**: 全コーパス横断のTechnique Inventoryからタグと学習単位を作り、タグDAGと学習単位DAGを別々に検証する。用語初出、見出し、ランドマーク、表caption、代替テキスト、キーボード操作、色に依存しない状態表示、狭い画面での代替一覧を要求する。
- **Reproducibility — PASS**: 実行可能例と解答資料は環境、入力、手順、期待結果を持ち、公開前に記載手順で検証する。依存版、fixture seed/digest、実行結果を固定する。
- **Consistency and maintainability — PASS**: schema、前提baseline、placement policy、glossary、authoring skillを正本化し、表示索引と公開データは正本から生成する。Zod shapeは`schema-parts/*`だけが定義し、`schemas.ts`は公開集約に限定する。追加toolingはwork manifestへ保守上の利益を記録する。
- **Review gate — PASS**: 一つの論理変更を学習成果単位に固定し、一人のgate reviewerが成果被覆を確認して適用可能な全自動検査を自ら実行する。完全自動化できない主張・例はitem author以外の人間が確認し、既知失敗が残る変更をmerge・公開しない。

### Phase 1設計後の再評価

- `data-model.md`は全教材単位と成果・前提・出典の参照、Advanced Problem Slotの動的順序、学習記録、更新・公開状態を定義する。
- `contracts/`は固定4枠ではなくslot registryと公式順を契約化し、学習記録、更新、公開候補、レビュー、前提、placement、glossaryを機械検証できる。
- `quickstart.md`は新しい問題記号を含むfixture、全コーパスtaxonomy、解説、学習管理、更新、公開rollbackを別々に検証する。
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
│   ├── release-candidate.schema.json
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
│   ├── filesystem-publish-evidence.schema.json
│   ├── publish-receipt.schema.json
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
│   ├── claims/
│   ├── examples/
│   ├── exercises/
│   ├── assessments/
│   ├── answer-materials/
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
├── catalog-build.ts
├── catalog-validate.ts
├── prepare-release-candidate.ts
├── verify-release.ts
├── approve-update.ts
└── publish-update.ts

staging/
├── updates/
└── release-candidates/

tests/
├── contract/
├── integration/
├── unit/
├── e2e/
├── performance/
└── fixtures/

docs/
├── work-manifests/
├── reviews/human-content/
├── operations/
└── verification/
```

**Structure Decision**: Astro/Starlight単一プロジェクトに教材表示、共有domain、更新CLIを置く。サイトとCLIは同じZod shape、安定ID、slot ordering、DAG、前提baseline、placement policy、glossaryを共有する。shape定義は`src/lib/domain/schema-parts/*.ts`、公開集約は`schemas.ts`/`index.ts`に限定し、JSON Schemaはそこから生成する。未公開候補は`staging/`に隔離し、承認済みcandidateだけを公開正本へ原子的に反映する。

## Phase 0: Outline & Research

調査結果は[research.md](./research.md)へ集約する。解決対象は、公式問題一覧からDより後を動的に抽出する規則、静的教材と端末内保存、公式情報の安全な取得、authoring skillの境界、全コーパスtaxonomy、冪等更新、追加費用0円の公開経路、現行ツール版である。すべてDecision / Rationale / Alternatives considered形式で解消する。

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md): 教材正本、動的problem slot registry、Technique Inventory、タグ/学習単位DAG、個人学習記録、更新・公開状態を定義する。
- `contracts/*.schema.json`: catalog、学習記録、更新、公開候補、work manifest、review、前提、placement、glossary、検証証跡を定義する。Zod shapeから生成し、手書きの二重正本を残さない。
- [contracts/cli.md](./contracts/cli.md): 単一開始操作、検証、承認、公開、終了code、冪等性、失敗時の契約を定義する。
- [contracts/ui-routes.md](./contracts/ui-routes.md): 静的route、動的slot表、検索、学習状態、バックアップ、accessibilityを定義する。
- [quickstart.md](./quickstart.md): offline fixtureだけで主要シナリオを再現し、任意の公式network確認を分離する。

### Canonical Schema Ownership

`src/lib/domain/schema-parts/catalog.ts`、`learning.ts`、`release.ts`、`review-evidence.ts`、`verification-evidence.ts`だけがZod shapeを定義する。`schemas.ts`はpartの再export、`index.ts`はdomain public APIの再exportに限定する。JSON Schema生成器、意味検証器、UI、CLIはこれらをimportし、field、enum、requirednessを再定義しない。

### Dynamic Advanced Problem Slots

各Contestは公式問題一覧の順序を保存する。対象判定はラベルの固定enumではなく「Dの位置より後」によって行う。公開版は対象Contestのadvanced slot labelを公式順に安定統合した`AdvancedSlotRegistry`を持ち、E〜Hは存在する限り通常列として扱うが、Iその他の新しいlabelも同じ経路へ入れる。各Contestについてregistry上のlabelが存在しない場合は公式問題なし、確認不能なら理由付き保留とする。

slot labelの比較は表示文字列の辞書順では行わない。Contest内は公式task order、release全体は最初に確認された公式順と既存registry順を安定維持し、矛盾する順序が出た場合は公開を保留して人間確認する。

### Corpus-First Taxonomy and Authoring

初期制作は次の順序を守る。

1. ABC 212〜466の全ContestとDより後の全slot/problem metadataを収集し、欠落・公式状態を確定する。
2. 全Problemについて、公式根拠から主たる解法、証明着眼点、計算量、必要前提、実装上の注意、候補成果を`TechniqueInventoryItem`として棚卸しする。
3. 全inventoryを横断して、正式Tag、Learning Outcome、Tag前提DAG、Learning Unit前提DAG、標準学習順、Problem Placementを設計する。同義の仮Tagや一問専用Unitを正本へ残さない。
4. 各Problemを主たるLearning Outcomeのreview unitへ一意に割り当て、完全解説または根拠付きの類題/補充問題を執筆する。
5. domain別のLearning Unit本文、例、演習、解答、到達確認を作り、全Problemが教科書順またはTag問題集から到達できることを検証する。

コンテスト番号batchは公式metadata取得と進捗管理にだけ使い、taxonomyや章構成の境界には使わない。content work manifestは各学習成果・Problem・Example・Exerciseを独立review unitにし、scope、paths、前提、checks、review evidenceをcontent変更前に固定する。

### Prerequisites, Placement, and Terminology

共通前提baseline、problem placement decision table、glossaryを別々の唯一の正本にする。全Learning UnitとExplanationはbaseline、追加前提または追加前提なし、対象外を直接参照する。placementは`full`既定で、主要解説と主成果・前提・解法・証明・漸近計算量が同じ場合だけ`similar`、単一の副次的技能だけを追加する場合だけ`supplement`を許す。どの行にも一意に一致しない場合は保留する。

学習順は前提DAGをhard constraintとし、同時に配置可能なUnitの安定rankとUnit IDで決定する。表示上は前提、難易度、代表性による順序理由を確認できるようにする。

### Initial Release Cutoff and Catch-up

ABC 212〜466はbootstrap seedであり公開上限ではない。初版candidate直前にoffset付き`cutoffAt`を固定し、終了済み最新ABCまでの未収録Contestを昇順に通常updateへ通す。各ContestではDより後の全公式problemを列挙し、未完成解説、未解消分類、検証失敗、保留updateが一件でもあれば初版candidateを作らない。

bootstrapと全catch-up updateを一つのcandidateへ束ね、content digestを固定する。自動検査と必要な人間reviewの後、管理者が同じdigestを承認し、read-only final検証に成功したtreeだけを一回原子的に切り替える。cutoff後に終了したContestは次回対象とする。

## Verification Strategy

| 成果 | 自動検証 | 人間確認 |
|---|---|---|
| 対象範囲 | Contest連続性、公式task order、Dより後の全slot/problem、動的registry、将来label fixture | 公式一覧の順序矛盾・取得不能時だけ確認 |
| 解説 | 必須構成、出典、前提、成果、計算量、例、skill版、内部参照 | 完全自動化できない新規・変更主張と例をauthor外reviewerが確認 |
| 典型体系 | inventory全件対応、Tag/Unit DAG、同義語、代表問題、到達可能性、安定順 | taxonomy統合・分割と教育的順序を学習成果単位でreview |
| 演習・解答 | Outcome参照、理由または検証方法、実行可能部分の結果、全件inventory | 自動実行不能な解答の妥当性を確認 |
| 学習記録 | schema移行、独立日時、再読込、filter、100件backup/restore、rollback | SC-012の代表操作とSC-009/010の事前固定自己評価 |
| 逆引き・検索 | 動的slot表、代替一覧、全destination link、検索種別、0件結果、未公開除外 | 表・検索・学習順が迷わず使えるか確認 |
| 週次更新 | 終了判定、差分、3種結果、冪等性、訂正影響、hold/resume、15分 | 保留理由、分類候補、公開差分を管理者が確認 |
| 公開 | fixed candidate、全check、review evidence、owner digest、lock、rollback、receipt | 管理者が同じdigestを承認し変更履歴を確認 |
| 品質 | build、link、axe、keyboard、reflow、用語、AnswerMaterial、性能、client bundle | 自動化不能項目だけを限定確認 |
| 無料運用 | 必須外部依存inventoryと52週fixture | 有料経路が必須化していないことを管理者が確認 |

`verify:release`は証跡数だけで成功させず、公開candidateの正本から、対象問題の100%収録、全Problemの学習到達性、動的contest matrix、検索、簡易学習管理を直接再計算する。いずれかが欠ければ他の検査が成功しても公開を拒否する。

## Complexity Tracking

憲章違反はないため例外登録はない。次の設計複雑性は元目的を直接守る範囲に限定する。

| 設計境界 | 必要性 | 制御 |
|---|---|---|
| 動的AdvancedSlotRegistry | E以上の将来labelを固定4枠で落とさない | 公式task orderを正本とし、順序矛盾を保留する |
| corpus-wide Technique Inventory | 問題別仮Tagを後から継ぎ接ぎせず体系化する | 全Problem coverageと重複Tag検査をtaxonomy前に通す |
| baseline・placement・glossaryの3正本 | 前提、掲載形態、用語の責務を混同しない | 各正本を一つにし、loaderとdigestで複製を拒否する |
| candidate stagingと原子的切替 | 部分公開と承認後変更を防ぐ | fixed digest、read-only final検証、lock、rollbackを使う |

追加LLM panel、独立constitution auditor、外部learner cohort、実browser 8組合せ、3 OS必須証跡は採用しない。これらは統治中の憲章が要求せず、1人用の教材・簡易学習管理という目的に対して保守負担が大きいためである。
