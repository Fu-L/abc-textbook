# Data Model: ABC上級問題体系化教科書

**対象仕様**: [spec.md](./spec.md)

**技術判断**: [research.md](./research.md)

## 1. モデル境界

データを次の3境界に分ける。

1. **教材の正本**: `src/content/`のJSONとMarkdown/限定MDX。Gitでレビュー・版管理する。
2. **未公開更新**: `staging/updates/<updateId>/`の候補、検証結果、レビュー、承認。公開サイトからは読まない。
3. **個人学習記録**: ブラウザーのIndexedDB。教材の問題IDだけを参照し、Gitや公開成果物へ含めない。

索引表、タグ索引、全体学習順、Pagefind索引、`problem-catalog.json`は正本から生成する派生データであり、手編集しない。

## 2. 共通規則

### 2.1 安定ID

| 対象 | 形式例 | 規則 |
|---|---|---|
| Contest | `abc212` | 公式contest slug。公開後は不変 |
| Problem | `abc212-e` | `contestId` + 小文字slot。章・題名変更の影響を受けない |
| Technique Tag | `tag-shortest-path-dijkstra` | 意味を表すkebab-case。名称変更時もIDを維持 |
| Learning Unit | `unit-dijkstra-basic` | 学習内容を表すkebab-case。表示順・章番号を含めない |
| Explanation | `exp-abc212-e-v1` | problem ID + 単調revision |
| Source | `src-abc212-e-task` | 正規URLに対応する安定ID |
| Source Revision | `srcrev-<sha256-prefix>` | 正規URLと正規化指紋から決定 |
| Publication Update | `upd-abc467-<sha256-prefix>` | 対象とsource-set指紋から決定 |
| Release | `2026.07.0` | CalVer。公開済み版は不変 |

- IDはASCII小文字、数字、ハイフンだけを使う。
- 公開済みIDを再利用・意味変更しない。統合/廃止時はaliasまたはreplacementを残す。
- 配列の順序が意味を持たない箇所はID順に正規化し、決定的な差分を作る。

### 2.2 日時

- 正本・更新・契約ではRFC 3339のoffset付き日時を使う。
- ブラウザー学習記録はUTCの`YYYY-MM-DDTHH:mm:ss.sssZ`で保存する。
- 画面は`<time datetime>`に保存値を置き、ローカル日時、UTC offset、IANA timezoneを人間可読で示す。
- 「更新記録なし」は`null`であり、読込時刻を補わない。

### 2.3 指紋とrevision

- SHA-256は正規化済み抽出データ、source集合、taxonomy、skill本文、公開manifestに使う。
- 生のAtCoder HTMLは指紋計算後に破棄し、Gitへ保存しない。
- revisionは同じIDの内容変更を表し、公開済みrevisionを上書きしない。

## 3. 教材エンティティ

### 3.1 Contest

一つのABC開催回。

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | ContestId | yes | 例: `abc212` |
| `number` | integer | yes | 212以上 |
| `title` | string | yes | 公式名称 |
| `officialUrl` | HTTPS URL | yes | AtCoder公式contest URL |
| `startsAt` / `endsAt` | RFC3339 | yes | 公式開催期間 |
| `endedVerifiedAt` | RFC3339 | yes for ingestion | 終了を再確認した時刻 |
| `slotRecords` | map E/F/G/H | yes | 各スロットの存在・収録状態 |
| `sourceRevisionIds` | SourceRevisionId[] | yes | contest/task list根拠 |
| `lastVerifiedAt` | RFC3339 | yes | 最終公式確認 |

#### ContestSlotRecord

| Field | Type | Description |
|---|---|---|
| `slot` | `E \| F \| G \| H` | 固定4枠 |
| `availability` | `exists \| official_absent \| unknown \| withdrawn` | 公式上の存在状態 |
| `catalogStatus` | `unrecorded \| drafting \| on_hold \| published \| correction_pending` | 教材側の状態 |
| `problemId` | ProblemId or null | `exists`/`withdrawn`なら安定ID |
| `holdCode` | string or null | 保留理由コード |
| `evidenceSourceRevisionIds` | SourceRevisionId[] | `official_absent`にも必須 |

画面表示は次の優先順で導出する。

1. `official_absent` → 「公式問題なし」
2. `unknown` → 「公開保留（公式状態未確認）」
3. `withdrawn` → 「公式取り下げ」
4. `unrecorded` → 「未収録」
5. `drafting` → 「作成中」
6. `on_hold`/`correction_pending` → 「公開保留」
7. `published` → 「収録済み」

### 3.2 Problem

公式問題の識別情報と独自に構造化したメタデータ。問題文本文は保持しない。

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | ProblemId | yes | 例: `abc212-e` |
| `contestId` | ContestId | yes | Contest参照 |
| `slot` | E/F/G/H | yes | contest内で一意 |
| `title` | string | yes | 公式題名 |
| `officialTaskUrl` | HTTPS URL | yes | task listから取得したURL |
| `summary` | string | yes for publish | 独自の短い問題概要 |
| `constraints` | ConstraintFact[] | yes | 数値・型・関係として独自構造化 |
| `difficultyEvidence` | DifficultyEvidence[] | yes for publish | 根拠と対象学習者上の段階 |
| `sourceRevisionIds` | SourceRevisionId[] | yes | task/editorial根拠 |
| `lastVerifiedAt` | RFC3339 | yes | 公式確認日時 |
| `publicationStatus` | enum | yes | `draft/on_hold/validated/approved/published/correction_pending/withdrawn` |
| `currentExplanationId` | ExplanationId or null | conditional | 公開済み完全/差分解説 |
| `revision` | positive integer | yes | 内容revision |

Validation:

- `(contestId, slot)`と`officialTaskUrl`は一意。
- `officialTaskUrl`はタスク一覧から得たHTTPS AtCoder URLである。
- 公開問題には1件以上のSource、Technique Tag、Problem Placementが必要。
- `summary`と制約は公式本文の長い逐語コピーを含まない。

### 3.3 Explanation

問題に対する独自教材本文と検証メタデータ。本文は`docPath`のMarkdown/限定MDXに置く。

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | ExplanationId | yes | revisionを含む |
| `problemId` | ProblemId | yes | 対象問題 |
| `mode` | `full \| similar \| supplement` | yes | 掲載形態 |
| `docPath` | repository path | yes | `src/content/docs/...` |
| `authoringSkill` | SkillRef | yes | name/version/digest |
| `inputFingerprint` | SHA-256 | yes | source/taxonomy/skill入力 |
| `learningOutcomeIds` | OutcomeId[] | yes | 1件以上 |
| `claimIds` | ClaimId[] | yes | 技術的主張と出典を結ぶ |
| `complexity` | ComplexityRecord | yes for full | 時間・空間・制約整合 |
| `exampleIds` | ExampleId[] | yes for full | 再現可能な例または検証 |
| `implementationNotes` | string[] | yes for full | 実装上の注意 |
| `sourceRevisionIds` | SourceRevisionId[] | yes | 根拠集合 |
| `reviewRecordIds` | ReviewRecordId[] | conditional | 公開には独立レビューが必要 |
| `status` | enum | yes | `draft/validated/awaiting_review/approved/published/on_hold/superseded` |
| `revision` | integer | yes | 同問題内の単調revision |

`full`本文の必須見出し:

1. 自然な考察手順
2. 学ぶべきパーツの分解
   - 典型パーツ（存在する場合）
   - アドホックパーツ（存在する場合）
3. 正当性
4. 計算量と制約整合
5. 実装上の注意
6. 例または検証手順
7. コーチからのワンポイントアドバイス
8. 出典と確認日

`similar`/`supplement`には主要解説ID、簡略化理由、制約/解法差分、追加で学ぶ点が必須。

### 3.4 TechnicalClaim

レビュー・訂正影響を細かく追跡する技術的主張。

| Field | Type | Description |
|---|---|---|
| `id` | ClaimId | 解説内で安定 |
| `explanationId` | ExplanationId | 所属解説 |
| `statementSummary` | string | 独自の短い主張概要 |
| `sourceRevisionIds` | SourceRevisionId[] | 根拠 |
| `verificationMethod` | `automated \| external_review \| both` | 確認方法 |
| `verifiedAt` | RFC3339 or null | 確認時刻 |

Source指紋変更時はClaimから本文・例・演習への影響を列挙する。

### 3.5 TechniqueTag

深さ可変の典型知識・考察法。

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | TagId | yes | 安定ID |
| `name` | string | yes | 表示名 |
| `definition` | string | yes for formal | 初出で使える短い定義 |
| `learningOutcomeIds` | OutcomeId[] | yes for formal | 1件以上 |
| `parentId` | TagId or null | yes | 階層木。深さ固定なし |
| `prerequisiteTagIds` | TagId[] | yes | 学習DAGの入辺 |
| `aliases` | string[] | yes | 同義語・旧名称 |
| `representativeProblemIds` | ProblemId[] | yes for formal | 1件以上または成果で代替 |
| `lifecycle` | `draft \| formal \| deprecated` | yes | 仮/正式/廃止 |
| `replacementTagIds` | TagId[] | conditional | deprecated時の追跡先 |

Validation:

- 親関係は木で、自己親・循環・不要な空中間タグを許さない。
- prerequisite関係は別DAGで、親子関係と混同しない。
- aliasは全Tagで一意。名称変更時は旧名称をaliasへ残す。

### 3.6 LearningOutcome

章・解説・例・演習を結ぶ測定可能な成果。

| Field | Type | Description |
|---|---|---|
| `id` | OutcomeId | 安定ID |
| `statement` | string | 学習者が行える観察可能な行動 |
| `prerequisiteOutcomeIds` | OutcomeId[] | 必要成果 |
| `assessmentIds` | AssessmentId[] | 到達確認 |
| `scope` | `global \| unit \| explanation` | 適用範囲 |

### 3.7 LearningUnit

chapter/section/subsectionを統一して扱う教材単位。

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | UnitId | yes | 表示順を含めない安定ID |
| `kind` | `chapter \| section \| subsection` | yes | 3種 |
| `title` | string | yes | 表示名 |
| `docPath` | repository path | yes | 導入・説明本文 |
| `parentId` | UnitId or null | yes | chapter=null、section=chapter、subsection=section |
| `prerequisiteUnitIds` | UnitId[] | yes | 明示前提 |
| `tagIds` | TagId[] | yes | 対象典型 |
| `learningOutcomeIds` | OutcomeId[] | yes | 1件以上 |
| `termDefinitions` | TermDefinition[] | yes | 新用語の初出定義 |
| `problemPlacementIds` | PlacementId[] | yes | 基本・発展・類題 |
| `assessmentIds` | AssessmentId[] | yes | 到達確認 |
| `ordering` | OrderingHints | yes | stage/difficulty/representativeness/rationale |
| `status` | `draft \| reviewed \| published` | yes | 公開状態 |

#### 全体学習順の生成

1. prerequisiteをancestor単位へ畳み込み、chapter間を安定トポロジカルソートする。
2. 各chapter内でsection、各section内でsubsectionを同様にソートする。
3. 同順位は`stageRank`、`difficultyRank`、`representativeRank`、安定IDで決める。
4. parent導入は最初のchildより前に置く。
5. cross-parent前提がこの連続階層順で満たせない場合は公開を失敗させ、循環/違反経路を報告する。

この方式により同じ分野を基礎編・複合編として別Unit/Chapterに再登場させつつ、一つのchapter subtreeは連続表示できる。

### 3.8 ProblemPlacement

問題、学習単位、典型タグの教育上の位置付け。

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | PlacementId | yes | 安定ID |
| `problemId` | ProblemId | yes | 対象問題 |
| `unitId` | UnitId | yes | 掲載単位 |
| `tagRoles` | `{tagId, role}[]` | yes | role=`primary/secondary`。primaryは1件以上 |
| `mode` | `full \| similar \| supplement` | yes | 掲載形態 |
| `primaryExplanationProblemId` | ProblemId or null | conditional | similar/supplement時 |
| `simplificationReason` | string or null | conditional | 簡略化理由 |
| `differences` | string[] | conditional | 主要解説との差分 |
| `additionalLearning` | string[] | conditional | 追加要素 |
| `difficultyBand` | integer | yes | 教材内の相対段階 |

同一問題を複数Unitから参照できるが、完全解説本文の正本は1つだけにする。

### 3.9 ReproducibleExample / Exercise / Assessment

#### ReproducibleExample

- `id`, `learningOutcomeIds`, `environment`, `input`, `steps`, `expectedObservableResult`
- `kind`: `executable/manual/pseudocode`
- `validationCommand`と`validatedAt`（自動化できる場合は必須）
- `sourceRevisionIds`, `reviewRecordIds`
- 省略、疑似コード、出力短縮は明示する。

#### Exercise

- `id`, `unitId`, `learningOutcomeIds`, `promptDocPath`, `answerDocPath`
- `answerReasoning`または`verificationMethod`
- `difficultyBand`, `prerequisiteUnitIds`

#### Assessment

- `id`, `outcomeId`, `method`, `successCondition`, `evidencePath`

### 3.10 SourceRecord / SourceRevision

#### SourceRecord

| Field | Type | Description |
|---|---|---|
| `id` | SourceId | 正規URLに対応 |
| `canonicalUrl` | HTTPS URL | 公式参照先 |
| `kind` | `contest/tasks/task/editorial/correction/policy` | 種別 |
| `authority` | `official/secondary` | 第一根拠か補助か |
| `language` | string | 例: `ja` |
| `currentRevisionId` | SourceRevisionId | 現在確認版 |

#### SourceRevision

- `id`, `sourceId`, `normalizedFingerprint`, `checkedAt`, `httpStatus`
- `contestOrVersion`, `supersedesRevisionId`, `changeSummary`
- `robotsPolicyFingerprint`, `termsPolicyFingerprint`
- 生HTMLや公式本文は含めない。

### 3.11 AuthoringSkill

| Field | Type | Description |
|---|---|---|
| `name` | string | `abc-explanation-author` |
| `version` | semver | skill契約版 |
| `digest` | SHA-256 | `SKILL.md`と必須参照の内容指紋 |
| `path` | repository path | `.agents/skills/.../SKILL.md` |
| `inputSchemaVersion` | semver | AuthoringPacket契約 |
| `outputSchemaVersion` | semver | Explanation契約 |
| `requiredSections` | string[] | 必須構成 |

### 3.12 ReviewRecord

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | ReviewRecordId | yes | 安定ID |
| `scopeType` / `scopeId` | enum/id | yes | explanation/update/release/claim/example |
| `subjectDigest` | SHA-256 | yes | 実際に確認した候補内容。変更時はreview無効 |
| `authorId` | string | yes | 作成者識別子 |
| `reviewerId` | string | yes | authorと異なること |
| `sourceRevisionIds` | SourceRevisionId[] | yes | 確認根拠 |
| `skill` | SkillRef or null | conditional | 解説時 |
| `decision` | `approved \| changes_requested \| rejected` | yes | 判定 |
| `findings` | string[] | yes | 指摘または確認内容 |
| `reviewedAt` | RFC3339 | yes | 時刻 |

単一利用者の製品でも、公開する技術的主張・自動保証不能な例には別人のレビュー記録が必要。

### 3.13 ValidationFinding

| Field | Type | Description |
|---|---|---|
| `code` | stable string | 例: `DEPENDENCY_CYCLE` |
| `severity` | `info/warning/error` | errorは公開block |
| `entityType` / `entityId` | string | 問題単位へ追跡 |
| `message` | string | 人間可読説明 |
| `path` | string[] | 循環・参照経路等 |
| `evidence` | string[] | 根拠ID/ファイル |
| `blocking` | boolean | 公開可否 |
| `createdAt` | RFC3339 | 検査時刻 |

### 3.14 PublicationUpdate / Release

#### PublicationUpdate

- `id`, `kind` (`weekly/correction/taxonomy/content`), `contestId`
- `fixtureMode`（trueの更新は公開不可）
- `idempotencyKey`, `baseReleaseVersion`, `sourceSetFingerprint`
- `taxonomyVersion`, `authoringSkill`
- `state`, `resumeStage`, `holdReason`
- `candidateChanges`, `validationFindings`, `reviewRecordIds`, `ownerApproval`
- `timings`, `createdAt`, `updatedAt`, `publishedReleaseVersion`

主状態:

```text
DISCOVERED
  -> SOURCES_VERIFIED
  -> DRAFTED
  -> VALIDATED
  -> AWAITING_EXTERNAL_REVIEW
  -> AWAITING_OWNER_APPROVAL
  -> READY_TO_PUBLISH
  -> PUBLISHED
  -> SUPERSEDED
```

- 任意の未公開状態 → `ON_HOLD`。`resumeStage`、理由、詳細、再試行条件が必要。
- `ON_HOLD` → `resumeStage`は入力変化または明示再開時だけ。
- `PUBLISHED`は不変。変更は新Updateで行う。
- blocking finding、未レビュー、未承認、根拠矛盾がある状態から`READY_TO_PUBLISH`へ進めない。

#### Release

- `version`, `cutoffAt`, `publishedAt`, `updateIds`, `manifestDigest`
- `coverage`（first/last contest、contest/problem/cell counts）
- `added/changed/held/withdrawnProblemIds`, `taxonomyChanges`
- `validationSummary`, `reviewRecordIds`, `changelogDocPath`

Releaseは公開manifestの唯一の入口で、部分的な候補を参照しない。

## 4. 個人学習エンティティ

### 4.1 LearningRecord

IndexedDBだけに存在する。

| Field | Type | Required | Description |
|---|---|---:|---|
| `problemId` | ProblemId | yes | primary key |
| `status` | `unstarted \| attempting \| completed` | yes | 排他的1値 |
| `statusUpdatedAt` | UTC RFC3339 or null | yes | statusだけの最終変更 |
| `needsReview` | boolean | yes | statusと独立 |
| `needsReviewUpdatedAt` | UTC RFC3339 or null | yes | tagだけの最終変更 |
| `recordVersion` | positive integer | yes | optimistic migration用 |

State rules:

- レコード不在 → 読取時だけ既定値を合成し、日時は両方`null`。
- statusは利用者が3値の間を任意に修正できる。status操作だけが`statusUpdatedAt`を更新する。
- needsReviewは任意にtoggleできる。toggleだけが`needsReviewUpdatedAt`を更新する。
- 「completedかつneedsReview=true」は有効。
- 教材更新はLearningRecordを一括更新しない。
- 未知/withdrawn problem IDのrecordも削除せず、backup/importと「過去の記録」に保持する。

### 4.2 LearningRecordExport

- `schemaVersion`, `exportedAt`, `catalogVersionAtExport`
- `records[]`, `orphanedProblemIds[]`
- import前にJSON Schema、重複ID、日時、versionを検証する。
- 既存値とのmergeは利用者に`newer-wins/backup-wins/cancel`を明示し、結果件数を表示する。
- exportにアカウント、氏名、外部tracking IDを含めない。

## 5. 関係

```text
Contest 1 ── 4 ContestSlotRecord
Contest 1 ── 0..4 Problem
Problem 1 ── 1..* SourceRevision
Problem 1 ── 1..* ProblemPlacement
Problem 1 ── 0..* Explanation revisions ── 1 AuthoringSkill version
Problem 1 ── 0..1 LearningRecord (端末内のみ)

TechniqueTag 0..1 ── parent TechniqueTag
TechniqueTag * ── prerequisite TechniqueTag (DAG)
LearningUnit 0..1 ── parent LearningUnit
LearningUnit * ── prerequisite LearningUnit (DAG)
ProblemPlacement * ── 1 Problem + 1 LearningUnit + 1..* TechniqueTag

SourceRecord 1 ── 1..* SourceRevision
SourceRevision * ── * TechnicalClaim / Example / Problem
PublicationUpdate * ── * candidate entities / ValidationFinding / ReviewRecord
Release 1 ── 1..* PublicationUpdate
```

## 6. 公開前の全体検証

公開可能なReleaseは次をすべて満たす。

1. ABC 212からcutoffの最新終了済みABCまでContest番号が連続する。
2. 各ContestにE〜Hの4 SlotRecordがあり、空欄の意味がない。
3. `exists`の全Problemが出典、タグ、Unit、Placement、解説または差分解説へ到達できる。
4. Tag親木、Tag前提DAG、Unit親木、Unit前提DAGに循環・自己辺・重複辺がない。
5. 生成順で全前提が依存先より前にあり、順序理由を表示できる。
6. 全full Explanationがskill必須区分、正当性、計算量、制約整合、注意、例、出典を持つ。
7. 実行例が宣言環境で期待結果を再現し、手動例は独立レビュー済みである。
8. authorと異なるreviewerの承認、およびownerの明示承認がある。
9. blocking finding、壊れた内部リンク、未確定の必須外部リンク、axe違反、必須代替テキスト欠落が0件である。
10. `npm run verify:release`と二重buildのmanifest digestが一致する。
11. 公開候補がAtCoder本文・公式解説・公式コードの不必要な逐語転載を含まない。
12. 既存LearningRecord fixtureが教材更新前後で同一で、新規問題はrecord不在の既定値になる。
