---
description: 'Codex-only task list for focused textbook changes'
---

# Tasks: [FEATURE NAME]

**Input**: `/specs/[###-feature-name]/`のspec.mdとplan.md、該当する設計資料

**Prerequisites**: 憲章と`docs/operations/update-manual.md`を読む。小さな教材修正に新しいtasks.mdや不要な設計資料を要求しない。

**Validation**: 変更に関係する出典・論証・文章・表示・互換性をCodexが確認する。構造化データにはschema検証、挙動には対象テスト、公開教材・表示にはbuildと内部リンク、UI・学習記録の挙動には該当E2Eを選ぶ。文書だけなら整合性と書式を確認する。人間・第三者承認、別エージェント判定、証跡の多重管理はタスクにしない。

**Organization**: 学習成果または独立した機能の変更ごとにまとめる。不要なsetup/foundation/storyは削除し、既存サイトの初期化を繰り返さない。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: ファイル・依存が独立し、並列実行可能な作業。複数エージェントを要求しない。
- **[Story]**: 対象story（US1等）。横断作業は省略できる。
- 実在pathと完了条件を含める。

## Path Conventions

- 教材・データ: `src/content/`
- 表示・処理: `src/components/`, `src/pages/`, `src/lib/`, `scripts/`
- 検証: `tests/unit/`, `tests/contract/`, `tests/integration/`, `tests/e2e/`
- 手順: `docs/operations/update-manual.md`

<!-- 以下はサンプル。生成時は今回必要な作業だけへ置換する。 -->

## Phase 1: Scope and Existing Procedures

- [ ] T001 憲章・更新マニュアルを読み、変更する正本・参照先・互換性条件を確認する
- [ ] T002 [必要な場合だけ] 出典・設計上の不明点を確認し、既存spec/planへ集約する

## Phase 2: Foundational Changes _(only if needed)_

- [ ] T003 [共通schemaや処理の変更が必要な場合だけ] 対象pathと参照先を一緒に更新する

## Phase 3: User Story 1 - [Title] (Priority: P1)

**Goal**: [本文・体系・表示・機能の改善]

**Independent Test**: [確認方法]

### Implementation for User Story 1

- [ ] T004 [US1] [対象path]を修正し、関連する本文・配置・前提・導線を整合させる
- [ ] T005 [US1] 出典、正当性、境界条件、計算量、用語を影響範囲で確認する

### Validation for User Story 1

- [ ] T006 [US1] 変更した挙動の自動テストを追加・修正する（本文のみなら不要）
- [ ] T007 [US1] 対象schema・テスト・build・内部リンク等を実行し、失敗を修正する
- [ ] T008 [US1] 表示・学習記録の変更に必要な確認だけ行う

**Checkpoint**: 必要な検証が成功し、対象成果をCodexが確認できる。

[必要な場合だけ同じ形式でstoryを追加する]

## Phase N: Documentation and Completion

- [ ] TXXX 手順変更があれば`docs/operations/update-manual.md`を更新する
- [ ] TXXX Git差分で既存教材・URL・記録の互換性と変更範囲を確認する
- [ ] TXXX 変更・検証結果・未解決事項をPR本文または完了報告へまとめる
- [ ] TXXX [公開を含む依頼だけ] 現行のPages手順で公開し、状態と代表導線を確認する

## Dependencies & Execution Order

- 共通schema・処理の変更がある場合だけ、その利用側より先に対応する。
- 独立した作業以外は依存順に進める。
- 挙動修正の回帰テストは、修正前の問題を検出できることを確認する。
- 一律のtest-first、全件再審査、全ブラウザー実行を要求しない。
- 失敗や新しい変更がある場合に関係する検証を再実行する。

## Implementation Strategy

独立した成果ごとに実装・確認し、必要な検証が成功したら次へ進む。setup、認証、backend、独自release機構を既定で追加しない。検証結果は既存ログと完了報告へ集約し、別manifestやdigest台帳を作らない。

## Notes

- 曖昧な作業名、同じファイルの並列変更、無関係な検査の追加を避ける。
- 検証範囲を狭める場合も、変更した挙動や必須schemaの確認を省略しない。
- 旧実装の証跡依存は更新マニュアルの移行欄へ記し、架空の承認で回避しない。
