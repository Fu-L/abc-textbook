# Quickstart: ABC上級問題体系化教科書

**Purpose**: 実装後に、元目的である全対象問題の体系化、逆引き、簡易学習管理、週次更新をoffline fixture中心で検証する。

## Prerequisites

- 対応範囲（Node.js `>=24.18.0 <25.0.0`、npm `>=11.16.0 <12.0.0`）内のNode.js/npm
- リリース基準を再現する場合は`.nvmrc`と`packageManager`に一致するNode.js/npm
- repository rootで`npm ci`が成功していること
- 実networkを使う手順以外は`tests/fixtures/`だけで実行できること

```bash
npm ci
npm run verify:fast
```

`verify:fast`は型、schema parity、unit/contract/integration test、静的build、内部link、主要E2Eを実行し、成功0、検証失敗2、使用法違反64を共通規則にする。

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

## Scenario B — 全コーパスTechnique Inventory

```bash
npm run catalog:validate -- --fixture tests/fixtures/catalog/technique-inventory
```

期待結果:

- 対象Problem ID集合とTechniqueInventoryItemのProblem ID集合が完全一致する。
- 主解法、証明着眼点、計算量、前提、実装注意、成果候補が欠けるitemを拒否する。
- Contestごとの同義仮Tag、Problem一問の言い換えTag、ad-hocだけのTagを正式化できない。
- 同じ典型を持つ別ContestのProblemが共通Outcome/Tagへまとまる。

## Scenario C — 学習順と問題配置

```bash
npm run test:integration -- learning-order
npm run test:integration -- problem-placement
```

期待結果:

- Tag親関係、Tag前提DAG、Unit親関係、Unit前提DAGを別々に検証する。
- 前提が必ず先行し、同じ入力から同じ全体順と順序理由が得られる。
- cycle、自己辺、未知参照、生成順改ざんを拒否する。
- 新しい主成果・前提・解法・証明着眼点・漸近計算量を持つ問題をsimilar/supplementにできない。

## Scenario D — 解説生成skillと本文

```bash
npm run test:integration -- explanation-authoring
npm run catalog:validate -- --fixture tests/fixtures/catalog/explanations
```

期待結果:

- root `prompt.md`を参照不能にしても、専用skillと事前固定した3件以上のinputだけで品質contractを検査できる。
- 完全解説は考察、典型/ad-hoc、助言、正当性、計算量、制約、実装注意、例、出典、skill版を持つ。
- 入力不足は`authoring_required`になり完成Explanationへ数えない。
- 疑似コード・省略出力のlabel欠落、根拠矛盾、再現不能例を拒否する。

## Scenario E — 教科書と逆引き

```bash
npm run build
npm run test:e2e -- learning-path contest-index search
```

期待結果:

- 標準学習順、Tag tree、Tag別問題集、Problem detailが相互参照できる。
- Contest表はAdvancedSlotRegistryの全labelを公式順に表示し、同内容のlist alternativeを持つ。
- 収録済みcellからProblem、Explanation、Learning Unit、primary/secondary Tag、similar problemsへ各一操作で到達する。
- Problem/Tag/Learning Unit/Contestの検索結果と明瞭な0件結果がある。
- staging、非公開candidate、端末状態は検索に入らない。

## Scenario F — 学習記録

```bash
npm run test:e2e -- learning-records review-list
```

期待結果:

- statusとneedsReviewを別々に変更し、他方の値・日時を変えない。
- 未変更日時は更新記録なしと表示する。
- reload後に値、日時、timezone表示が一致する。
- 要復習一覧へ2操作以内で到達し、Contest、slot、Tag、Unit、statusで絞り込める。
- IndexedDBが利用不能でも本文と通常navigationは読め、controlだけが理由付きで無効になる。

## Scenario G — Backup/restore

```bash
npm run test:integration -- learning-record-backup
```

期待結果:

- 100件以上のrecordをnew、updated、same、unknown、invalidへ分類する。
- previewで件数、item、競合policy、採用予定値を確認できる。
- status組とneedsReview組を独立比較する。
- 成功時は値・日時が100%一致し、失敗注入時は部分反映0件になる。

## Scenario H — 一操作の週次更新

```bash
npm run abc:update -- --fixture tests/fixtures/updates/dynamic-slot-contest
```

期待結果:

- 一回の開始操作で終了確認、Dより後の全Problem、source、差分、Technique候補、Tag/Unit配置候補、index previewを作る。
- Problemごとに`explanation_draft`、`authoring_required`、`blocked`のいずれかを返す。
- 同じinputの再実行で同じupdateを再利用し、重複を作らない。
- 15分deadline fixtureで全Problem resultと最終summaryを返す。
- 未完成resultが一件でもあればupdateはON_HOLDになりrelease inputへ進まない。

## Scenario I — Correction impact

```bash
npm run test:integration -- correction-update
```

期待結果:

- Source Revision変更から本文、Claim、Example、Exercise、AnswerMaterial、Unit順、全派生indexへの影響を列挙する。
- 一部だけ更新、古いsource参照、影響ID/path欠落を拒否する。
- Problem IDが同じLearningRecordは変更しない。

## Scenario J — Reviewとmerge gate

```bash
npm run verify:merge -- --fixture tests/fixtures/reviews/logical-change
```

期待結果:

- Work ManifestがLearning Outcome単位の非重複review unitを持つ。
- 通常fixtureは外部person IDなしで、manifest ownerのself-review、outcome coverage、全適用checkを記録して完了する。
- manifestのreview policyが公式根拠との矛盾・独自証明・重大な分類変更を示すfixtureだけはthird-party modeとし、author外のperson IDを要求する。
- self/third-party modeの取り違え、missing check、他者実行結果の追認、第三者reviewでのauthor/reviewer一致、stale digest、未解消findingを拒否する。
- LLM、owner approval、外部cohortをHumanContentReviewEvidenceの代用として受理しない。

## Scenario K — Release candidateとrollback

```bash
npm run abc:prepare-release -- --fixture tests/fixtures/releases/initial
npm run abc:validate -- --candidate fixture-initial
npm run abc:approve -- --candidate fixture-initial --owner fixture-owner \
  --publication-effective-at 2026-07-14T12:00:00+09:00 \
  --expect-approvable-digest fixture-digest
npm run abc:publish -- --candidate fixture-initial --simulate
```

期待結果:

- ABC 212からcutoffまでの連続性、Dより後の全Problem、AdvancedSlotRegistry、Technique Inventory、到達可能性をcandidate正本から再計算する。
- 自動checkとcurrent HumanContentReviewEvidence（selfまたはrisk policyに応じたthird-party）が揃うまでapproveできない。
- owner承認後にcandidate bytesが変わるとfinal validationが失敗する。
- 切替前失敗は旧treeへrollbackし、成功時だけPublishReceiptを残す。
- fixtureをproduction publishしようとすると副作用なしで拒否する。

## Scenario L — 目的保存と公開品質

```bash
npm run verify:release -- --phase final --candidate fixture-initial
```

期待結果:

- 全対象ProblemのCatalog収録、教科書またはTag問題集からの到達性、動的contest matrix、検索、local learning managementを直接検査する。
- evidence fileの存在だけで空の教材を成功扱いしない。
- link、axe、keyboard、reflow、用語、Example、AnswerMaterial、build再現性、性能、追加費用inventoryを検査する。
- SC-009/SC-010の事前固定self-studyとSC-012の代表操作証跡をcurrent release digestへ照合する。

## Optional live-source check

offlineの全Scenario成功後だけ、AtCoder公式hostへの限定確認を行う。

```bash
npm run abc:update -- --contest abcNNN --dry-run
```

期待結果:

- 開催中Contestを拒否する。
- project/contactを含むUser-Agent、直列request、開始間隔、限定retryを守る。
- robots、利用規約、生成AI ruleのfingerprint変化やparser driftで保留し、成功扱いしない。
- 生HTMLをrepositoryへ保存しない。

## Completion record

全Scenarioのcommand、fixture digest、開始・終了時刻、exit code、result path/digestを`docs/verification/quickstart-results.md`へ記録する。実network手順の未実行はoffline合格と混同せず、理由と次回条件を明記する。
