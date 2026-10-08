# Quickstart: ABC上級問題体系化教科書

> **初期構築の検証契約**: 現行作業では [Constitution 4.0.0](../../.specify/memory/constitution.md)と
> [更新マニュアル](../../docs/operations/update-manual.md)を先に読む。旧review
> mode・全件証跡・初回公開手順は通常更新の承認条件ではない。以下は既存機能の技術的な検証シナリオとして保持する。廃止する証跡契約と実装の移行は、マニュアルの移行欄に従って同時に行う。

**Purpose**: 実装後に、元目的である全対象問題の体系化、逆引き、簡易学習管理、週次更新をoffline
fixture中心で検証する。

## 公開順（2026-10-07更新）

初版はABC212〜466の検証済み868問・213タグ・232 Unit、cutoff
`2026-07-12T00:00:00+09:00`で先に公開する。#53がT162/T145〜T151、#54がT152〜T153を担当し、#52/T163/T143/T144/T164のlive
catch-upは実公開・事後検証後に実施する。開始branch・必要な公開入力・実装不足は[先行公開の引継ぎ](../../docs/operations/deploy-before-catch-up.md)を参照する。

以下のfixtureとsimulationは既存機能の回帰検査として維持する。Scenario
Iとlive-sourceのproduction受入は公開後の段階であり、fixture合格をlive機能完成へ読み替えない。初版の公開前検証は既存US1〜US4の全件検査とScenario
L/M、current-subject review、host/runbookを対象とする。初版範囲内の品質要件は縮小しない。

## Prerequisites

- 対応範囲（Node.js `>=24.18.0 <25.0.0`、npm `>=11.16.0 <12.0.0`）内のNode.js/npm
- リリース基準を再現する場合は`.nvmrc`と`packageManager`に一致するNode.js/npm
- repository rootで`npm ci`が成功していること
- 実networkを使う手順以外は`tests/fixtures/`だけで実行できること

```bash
npm ci
npm run verify:fast
```

`verify:fast`は型、schema parity、unit/contract/integration
test、静的build、内部link、主要E2Eを実行し、成功0、検証失敗2、使用法違反64を共通規則にする。

対応範囲内のpatch差を含むCI検証は`.github/workflows/ci.yml`で行い、リリース基準版では`npm ci`によるmanifest/lockfile整合性も確認する。

## Scenario A — 動的なE問題以上の範囲

```bash
npm run catalog:validate -- --fixture tests/fixtures/catalog/dynamic-slots
```

fixtureには次を含める。

- E/F/Gだけが存在するContest
- E/F/G/Hが存在するContest
- E/F/G/H/Iが存在する将来形式Contest
- Dが欠落、公式順が重複、順序根拠が矛盾するnegative case

期待結果:

- Dより後の全labelが対象になる。
- IがCatalog、matrix列、検索、update対象、completenessへ入る。
- Hがない回は未収録ではなく公式問題なしになる。
- 固定E〜H enumへ切り捨てるfixtureは失敗する。

## Scenario B — `initial-v1` private vertical preview

```bash
npm run preview:verify -- --fixture tests/fixtures/previews/initial-v1
```

fixtureには、graph/search、dynamic-programming、data-structures/algorithm-design、mathematics/combinatoricsの4分野、8
Problem以上、3 Contest以上、2種類以上のadvanced labelを含める。実データとfuture-label
fixtureを併用する場合は、`preview-manifest.json`で両者を区別する。

`preview:verify`はcohortを選び直す処理ではなく、T032で取得したcandidate
poolを根拠にT037でfreezeした`preview-manifest.json`と、T045/T051–T054/T094/T111/T126が固定した次のcomponent
manifest/digestだけを結合するT154のjoin
taskである。入力は`metadata-inventory-taxonomy.json`、`content/{graph-search,dynamic-programming,data-structures,mathematics}.json`、`learning-records.json`、`ui-search.json`、`update-simulation.json`として`docs/verification/previews/initial-v1/components/`に固定する。metadata、Technique
Inventory、仮taxonomy/placement、content、UI/search、local LearningRecord、update/release
simulationの全component digestが同じcohort・同じcurrent
subjectに対応することを再計算して確認した後、`staging/previews/initial-v1/snapshots/<joinDigest>.json`へ同一directory内の一時ファイルをrenameして新しいcanonical
snapshotを一度だけcommitする。commit
phaseは`staging/previews/initial-v1/transactions/<joinDigest>.json`へ記録し、canonical
snapshotの存在とdigestを検証してから、`docs/verification/previews/initial-v1/preview-join/<joinDigest>.json`へ`PreviewSnapshotReference`を別の一時ファイルからrenameする。これは二つのdirectoryをまたぐ一つのatomic
operationではない。途中停止時はtransaction phaseを読み、canonical
snapshotがあればreferenceだけを再生成し、canonical snapshotがなければreferenceを作らずholdする。full
taxonomy、production release validation/deploy、initial-release
reviewはT154の入力にせず、既存のsnapshotは再実行で上書きしない。

期待結果:

- 同じpreview digestで、公式metadata、Technique
  Inventory、仮taxonomy/placement、ProblemAuthoringUnit/LearningUnit inline content、static
  UI/search、local LearningRecord、update/release simulationを一周し、そのcomponent
  digestをjoinする。
- preview content/update
  componentはT064の`authoringSkillVersion`と`authoringSkillDigest`を同じcurrent
  subjectとして持ち、skill manifestの欠落・不一致や入力不足は完成扱いされない。
- 仮taxonomy、preview-only content、端末状態は`src/content/`、公開catalog、Pagefind、release
  commitへ混入しない。
- source、claim、example、answer、link、accessibility、schema、rollback、idempotencyの適用checkとcurrent-subject
  review evidenceが一つでも欠ける、失敗する、またはstale digestを参照する場合は、canonical
  `PreviewSnapshot.status=on_hold`と具体的な`holdReason`を保存し、T047–T050のfinal
  taxonomy、T055–T056/T155–T158のfull LearningUnit、T065のshard index freeze、T066–T071のbulk
  explanation shardへ進まない。
- 全component digest、check結果、review
  evidenceを結合した`joinDigest`と`PreviewSnapshot.status=passed`をcanonical
  `staging/previews/initial-v1/snapshots/<joinDigest>.json`へ不変保存し、`docs/verification/previews/initial-v1/preview-join/<joinDigest>.json`にはそのpath・digest・transaction
  IDを持つ派生`PreviewSnapshotReference`だけを保存する。referenceの欠落はcanonical
  snapshotを無効にせず、recoveryで再生成する。`passed`でもFR-001/SC-001の全件coverageを満たした扱いにせず、preview
  snapshotを公開Releaseから隔離する。

## Scenario C — 全コーパスTechnique Inventory

公式ページの検証済みprivate cacheから執筆用review
packetを再生成する場合は、cacheと出力先をrepository外に置く。metadataには検証済みbatch
artifactのpathを指定できる。出力先はまだ存在しない絶対pathを指定し、packet自体はcommitしない。

```bash
npm run corpus:export-inventory-review-packets -- \
  --metadata-dir /absolute/private/metadata \
  --cache-scope-dir /absolute/private/cache/CACHE_SCOPE_DIGEST \
  --output-dir /absolute/private/new-review-packets
```

```bash
npm run catalog:validate -- --fixture tests/fixtures/catalog/technique-inventory
npm run corpus:verify-authoring
```

期待結果:

- 対象Problem ID集合とTechniqueInventoryItemのProblem ID集合が完全一致する。
- 全itemが問題単位の公式Source Revisionとwriting
  policyに結び付いた`reviewed`であり、`draft`、`changes_requested`、未解決finding、既知のbootstrap
  scaffoldを残さない。authoring evidenceは使用skillと各recordのcontent
  digestまで再計算して一致する。
- 主解法、証明着眼点、前提、実装注意、成果候補が欠けるitemを拒否する。計算量は解析自体が解法の本質となる特殊な場合に、解法全体について根拠から確定できた値だけを受理する。通常の計算量と部分テクニック由来の汎用fallback値を拒否する。
- Contestごとの同義仮Tag、Problem一問の言い換えTag、ad-hocだけのTagを正式化できない。
- 同じ典型を持つ別ContestのProblemが共通Outcome/Tagへまとまる。

## Scenario D — 学習順と問題配置

```bash
npm run test:contract -- final-taxonomy
npm run test:contract -- canonical-taxonomy-materialization
```

期待結果:

- Tag/Outcome/Unitの前提DAGと、Tag・Unitの意味階層を独立に検証する。
- primary Outcomeの唯一のowner
  Unitが各Problemのhomeとなる。additional-primaryは追加で学ぶ技能、supportingは既習技能として保持し、homeが別subtreeの問題をrelated参照へ含める。いずれもhomeを変えない。
- sidebar/目次順で全Unitが一度ずつ現れ、Unit文書は直接前提と直接の依存先を複数件表示する。全体履修順や前後リンクを生成しない。
- 目次順とUnit prerequisite DAGの編集でProblem配置は変わらない。
- cycle、自己辺、未知参照、掲載順のUnit重複・欠落と所属章の不整合を拒否する。掲載順に親子subtreeの連続性やDAGのtopological
  orderを要求せず、概念上の親リンクと後にある前提へのリンクを確認する。
- 新しい主成果・前提・解法・証明着眼点・漸近計算量を持つ問題をsimilar/supplementにできない。
- preview
  taxonomyは直接canonicalへコピーせず、T159が全Inventoryから`FinalTaxonomyBuild`と全件`TaxonomyIntegrationMap`を生成し、review後にacceptしたdigestだけがT047–T050でmaterializeされる。

## Scenario E — 解説生成skillと本文

```bash
npm run test:integration -- explanation-authoring
npm run catalog:validate -- --fixture tests/fixtures/catalog/problem-authoring-units
```

期待結果:

- root
  `prompt.md`を参照不能にしても、専用skillと事前固定した3件以上のinputだけで品質contractを検査できる。
- 完全解説は考察、典型/ad-hoc、助言、正当性、計算量、制約、実装注意、例、出典、skill版を持つ。
- 入力不足は`authoring_required`になり完成Explanationへ数えない。
- 疑似コード・省略出力のlabel欠落、根拠矛盾、再現不能例を拒否する。

## Scenario F — 教科書と逆引き

```bash
npm run build
npm run test:e2e -- learning-path contest-index search
```

期待結果:

- 分野別の教科書目次、Tag tree、Tag別問題集、Problem
  detailが相互参照できる（canonical目次の公開反映はT160）。
- Contest表はAdvancedSlotRegistryの全labelを公式順に表示し、同内容のlist alternativeを持つ。
- 収録済みcellからProblem、Explanation、Learning Unit、primary/secondary Tag、similar
  problemsへ各一操作で到達する。
- Problem/Tag/Learning Unit/Contestの検索結果と明瞭な0件結果がある。
- staging、非公開candidate、端末状態は検索に入らない。
- previewのroute/search検証だけではfull coverageとみなさず、T160がaccepted full-corpus
  catalogへ一度だけ切り替えた後に全route、matrix、catalog
  endpoint、Pagefind、sitemap/feedを再生成する。

## Scenario G — 学習記録

```bash
npm run test:e2e -- learning-records review-list
```

期待結果:

- statusとneedsReviewを別々に変更し、他方の値・日時を変えない。
- 未変更日時は更新記録なしと表示する。
- reload後に値、日時、timezone表示が一致する。
- 要復習一覧へ2操作以内で到達し、Contest、slot、Tag、Unit、statusで絞り込める。
- IndexedDBが利用不能でも本文と通常navigationは読め、controlだけが理由付きで無効になる。

## Scenario H — Backup/restore

```bash
npm run test:integration -- learning-record-backup
```

期待結果:

- 100件以上のrecordをnew、updated、same、unknown、invalidへ分類する。
- previewで件数、item、競合policy、採用予定値を確認できる。
- status組とneedsReview組を独立比較する。
- 成功時は値・日時が100%一致し、失敗注入時は部分反映0件になる。

## Scenario I — 一操作の週次更新（live受入は公開後）

```bash
npm run abc:update -- --fixture tests/fixtures/updates/dynamic-slot-contest
```

上記は設計契約のfixture例であり、現在の実装済み入口は`abc:update --fixture initial-v1`のpreview
simulation。任意のfixture
pathや公開後baseのlive処理が使えるとは案内せず、T163で確定した入口に合わせてこの例を更新する。

期待結果:

- 一回の開始操作で終了確認、Dより後の全Problem、source、差分、Technique候補、Tag/Unit配置候補、index
  previewを作る。
- Problemごとに`authoring_unit_draft`、`authoring_required`、`blocked`のいずれかを返す。
- 同じinputの再実行で同じupdateを再利用し、重複を作らない。
- 15分deadline fixtureで全Problem resultと最終summaryを返す。
- 未完成resultが一件でもあればupdateはON_HOLDになりrelease inputへ進まない。

## Scenario J — Correction impact

```bash
npm run test:integration -- correction-update
```

期待結果:

- Source Revision変更からProblem本文・local block・配置、LearningUnit本文・任意のlocal
  block、前提policy、派生indexへの影響をowner付きlocatorで列挙し、全Source
  Revisionを保持する。Unit全順序を独立ownerにしない。
- materializationでの写像完全性と実targetの検証を区別し、後続の本文執筆・前提/導線検証・数学的検証・公開index投影が未完了の影響は`pending`のまま保持する。
- 一部だけ更新、古いsource参照、影響ID/path欠落を拒否する。
- Problem IDが同じLearningRecordは変更しない。

## Scenario K — Reviewとmerge gate

```bash
npm run verify:merge -- --fixture tests/fixtures/reviews/logical-change
```

期待結果:

- Problem authoringのWork ManifestはOutcome/Problem shardを非重複review
  unitとし、各shardに明示的なProblem
  ID、path、check、evidenceと同じ`indexDigest`を持たせる。Claim、Example、ExerciseはProblem本文にco-locateし、document-local
  keyを独立entity IDやreview unitにしない。
- LearningUnit本文にはcanonical
  Unitごとに一件の別manifestを置き、章・構造Unitを含む全Unitを非重複に覆う。`full_authoring`への引継ぎ後も受理済みmetadata・配置・Unit内問題順を維持する。
- 各shardを独立にbuild・review・previewでき、全shard joinで重複Problem、未割当Problem、path
  overlapが0件になる。
- previewの仮entityはpromote、merge、split、retireのいずれかへ一度だけ対応付けられ、final
  taxonomyは全Inventoryから再計算される。
- 通常fixtureは外部person IDなしで、manifest ownerのself-review、outcome
  coverage、全適用checkを記録して完了する。
- manifestのreview policyが公式根拠との矛盾・独自証明・重大な分類変更を示すfixtureは原則third-party
  modeとし、author外のperson
  IDを要求する。`highRiskSelfReviewReason: solo_maintainer`を明示するfixtureではrisk
  reasonを保持したowner self-reviewを許可する。
- self/third-party modeやsolo-maintainer理由の取り違え、missing
  check、他者実行結果の追認、selfでのowner不一致、第三者reviewでのauthor/reviewer一致、stale
  digest、未解消findingを拒否する。
- LLM、owner approval、外部cohortをHumanContentReviewEvidenceの代用として受理しない。

## Scenario L — Git releaseとrollback

実装済みのfull
release検証は`npm run verify:release -- --commit HEAD`、履歴生成は`npm run release:history`。全Catalogの既定pathと週次の手順・例外は`docs/operations/weekly-update.md`を参照する。下記の`abc:deploy`はT150でhost選定後に固定する予定の入口であり、現在は`GitDeploymentAdapter`のoffline
testを使う。Catalog未生成のbootstrap commitはrelease検証で終了2となる。

```bash
npm run verify:release -- --commit HEAD
npm run abc:deploy -- --metadata tests/fixtures/releases/initial/release-metadata.json
npm run abc:deploy -- --rollback-to KNOWN_RELEASE_COMMIT
```

期待結果:

- ABC212から宣言した収録上限までの連続性、Dより後の全Problem 100%
  coverage、AdvancedSlotRegistry、final Technique
  Inventory、到達可能性をpreviewとは独立したmerge対象treeから再計算する。初版はABC466までの868問で、公開日の最新回まで収録する条件はない。
- preview artifact、仮taxonomy、未結合shard、未解決holdがrelease
  commitへ混入していないことを確認する。
- 自動checkとcurrent HumanContentReviewEvidence（selfまたはrisk
  policyに応じたthird-party）が揃うまでprotected mainへmergeできない。
- Release Metadataがversion、cutoff、full commit、更新概要、検証結果URL以外のtransaction
  stateを持たない。
- rollbackは既知release commitの再deployで成功し、未知commitは副作用なしで拒否する。
- fixtureをproduction deployしようとすると副作用なしで拒否する。

## Scenario M — 目的保存と公開品質

```bash
npm run verify:release -- --commit HEAD
```

期待結果:

- 全対象ProblemのCatalog収録、教科書またはTag問題集からの到達性、動的contest matrix、検索、local
  learning managementを直接検査する。
- evidence fileの存在だけで空の教材を成功扱いしない。
- link、axe、keyboard、reflow、用語、Example、AnswerMaterial、build再現性、性能、追加費用inventoryを検査する。
- SC-009はIssue #48の運用者指示に基づく廃止記録を確認する。SC-012の代表操作証跡はcurrent release
  digestへ照合する。

## Full Problem corpus acceptance — T072–T078

```bash
npm run corpus:verify-problem-corpus
```

全248 shardと232
Unitを独立検証し、868本文とindexをjoinする。20本の独立数学回帰、Claim/本文、出典・skill・任意block
inventory、唯一のhome・coverage/related・読む順、訂正targetを再検査する。T074/T078は運用者指示に基づく`agent_quality_review`、SC-009は`not_required_by_owner`。公開切替・派生index・CorrectionImpactはT160までpending。手順と証跡は`docs/operations/problem-corpus-acceptance.md`に記載する。

## Optional live-source check（公開後の実装で入口を確定）

初版公開・事後検証とT163のlive入力実装後、offline
Scenarioの成功を確認してAtCoder公式hostへの限定確認を行う。実commandは`docs/operations/initial-catch-up.md`に確定した入口を使う。現在の初回専用`abc:update --contest`を任意のlive取得や未実装の`--dry-run`として案内しない。

期待結果:

- 開催中Contestを拒否する。
- project/contactを含むUser-Agent、直列request、開始間隔、限定retryを守る。
- robots、利用規約、生成AI ruleのfingerprint変化やparser driftで保留し、成功扱いしない。
- 生HTMLをrepositoryへ保存しない。

## Completion record

全Scenarioのcommand、fixture digest、開始・終了時刻、exit code、result
path/digestを`docs/verification/quickstart-results.md`へ記録する。実network手順の未実行はoffline合格と混同せず、理由と次回条件を明記する。

### Problem本文の品質確認

完全解説では、アルゴリズム名だけでなく状態・遷移・境界条件・正当性・計算量の導出を読む。具体例・確認問題・確認する観点・解答と理由の独立節は使わない。必要な追跡は考察へ含める。例・演習がないProblemのexamples/exercisesは空配列、対応checkはnot_applicableでよい。本文を修正したら所有shardの証跡を再生成し、corpus:verify-problem-shardsとverify:fastを実行する。

## #53 fixed-seed release acceptance

初版公開準備は `docs/operations/initial-release-runbook.md`
に従う。ownerが人間承認を不要としたため、bootstrapのinputs/evidence両方へ`--review-policy solo-maintainer --acceptance agent-quality-review`を付ける。current-subject全監査の成功後、agent品質受入を生成し、commit済みsnapshotへの通常の`verify:release -- --commit HEAD`を通す。232
itemの根拠と242 Outcome、全risk
reason、全checkが揃わなければ公開検証は失敗する。人間reviewや実published履歴は作らない。
