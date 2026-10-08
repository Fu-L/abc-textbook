# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

<!--
憲章とdocs/operations/update-manual.mdを先に読む。
設計が必要な変更、またはSpec Kitを指定された作業に使う。
小さな教材修正には新しいspecを要求しない。不要なstoryや要件は削除する。
-->

## Learner and Scope _(mandatory)_

**Target learner**: [個人学習者の背景。既存教材と同じなら既存定義を参照]

**Prerequisites**: [必要な知識と既存の前提単元]

**Learning outcomes**: [今回改善する理解・解法・読者の操作]

**In scope**: [変更する本文・分類・表示・機能]

**Out of scope**: [変更しない隣接事項]

## User Scenarios & Testing _(mandatory)_

### User Story 1 - [Brief Title] (Priority: P1)

[読者が何を理解・実行できるようになるか]

**Why this priority**: [学習上の効果]

**Independent Test**: [Codexが対象教材・表示・挙動で確認する方法]

**Acceptance Scenarios**:

1. **Given** [前提], **When** [読む・操作する], **Then** [確認可能な結果]

[独立した成果が複数ある場合だけstoryを追加する]

### Edge Cases

- [今回関係する境界条件、欠測、空入力、既存データなど]

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: [読者に必要な具体的挙動。本文だけの変更なら該当なし]
- **FR-002**: [既存URL・Problem ID・学習記録・公開環境への互換性条件]

### Content Quality Requirements _(applicable items only)_

- **CQ-001**: 本文・分類・前提・読書順は学習成果と一貫し、用語を説明する。
- **CQ-002**: 解法と条件は公式根拠で確認し、独自論証は仮定と正当性を示す。
- **CQ-003**: 完全解説は具体的な手順・境界条件・全体の計算量へ接続する。
- **CQ-004**: 表示変更では数式・狭い画面・キーボード・色以外の説明を確認する。
- **CQ-005**: 掲載する実行可能コードだけ環境・入力・手順・期待結果を確認する。

該当する要件を具体化する。例題・演習・評価・解答セクションや人間による読解測定・承認を一律に要求しない。

### Validation and Operations

- **VO-001**: 構造化データの変更は既存schemaとID・参照・不変条件の検証を通す。
- **VO-002**: 挙動の変更は対象の自動テストを通し、検証範囲を影響に合わせる。
- **VO-003**: 更新方法が変わる場合は更新マニュアルを同じ変更で修正する。
- **VO-004**: 完了はCodexの確認と必要な自動検証で判断し、人間・第三者承認を要求しない。

別のreview
evidence・manifest・digest台帳や独自のrelease/deploy機構を新規要件にしない。既存実装の制約は移行対象として明記する。

### Key Entities _(include if feature involves data)_

- **[Entity]**: [既存正本と関係。今回変更するものだけ]

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: [対象教材・表示・挙動が満たす具体的な結果]
- **SC-002**: [既存教材・URL・学習記録が保持される確認方法]
- **SC-003**: [今回必要な自動検証が成功する条件]

人間のアンケート、自己学習時間、承認率、無関係な全コーパス監査を成功条件にしない。検証時間を改善する変更では既存Actionsログと変更後の同条件の時間を比較する。

## Assumptions

- 個人利用の静的教科書で、作業は自然言語の指示を受けたCodexが完結させる。
- 既存のAstro・GitHub Pages・端末内学習記録を維持する。
- [今回固有の仮定だけ追加。不明点が実装へ影響する場合だけ確認する]
