# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: `/speckit-plan`が使うテンプレート。憲章と
`docs/operations/update-manual.md`を先に読む。小さな教材修正には新しい計画書を要求しない。

## Summary

[改善する教材・読者の操作と、そのための変更を簡潔に記載]

## Technical Context

**Language/Version**: [package.json・lockfile・.nvmrcの既存環境を参照]

**Primary Dependencies**: [Astro/Starlight等、今回変更する依存だけ記載]

**Storage**: [教材ファイル、ブラウザー内の学習記録。影響がなければその旨を記載]

**Testing**: [schema検証・対象テスト・build・リンク・必要なE2Eの実行方法]

**Target Platform**: [GitHub Pagesの既存originとbase pathを維持する静的サイト]

**Project Type**: [個人用の静的教材／ローカル検証CLI]

**Performance Goals**: [今回必要な表示性能・検証時間の目標。不要なら該当なし]

**Constraints**: [既存教材・URL・ID・学習記録・公開環境の互換性]

**Scale/Scope**: [変更する教材・機能と影響範囲]

## Constitution Check

_Codexが計画時と設計後に確認する。対象外は理由を一言で記し、承認者を設けない。_

- **教材品質**: 学習成果、前提、読書順、文章、表示の改善を説明できる。
- **正確性**: 公式根拠と解法・独自論証・境界条件・計算量の確認方法がある。
- **マニュアル**: 更新マニュアルを参照し、手順変更があれば同時に更新する。
- **検証**: 変更に効くschema・テスト・build等を選び、不要な重複を追加しない。
- **簡素さ**: 人間・第三者承認、別台帳、独自release/deploy機構を追加しない。
- **互換性**: 教材、URL、Problem ID、IndexedDB、backup、公開originを保持する。

未解決の不適合は設計を修正する。旧実装からの移行が必要な場合は対象と残作業をComplexity
Trackingへ記し、失敗を成功扱いしない。

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── spec.md
├── plan.md
├── research.md       # 調査事項。なければ該当なし
├── data-model.md     # データ変更。なければ該当なし
├── quickstart.md     # 今回の実行・検証方法
├── contracts/        # 必要な契約のみ。既存schemaは参照する
└── tasks.md          # /speckit-tasksの出力
```

### Source Code (repository root)

```text
src/content/          # 公開教材・構造化データの正本
src/components/       # 表示
src/pages/            # 公開導線
src/lib/              # schema・共通処理・学習記録
scripts/              # 既存CLI
tests/                # 既存unit/contract/integration/e2e
docs/operations/      # Codexの更新マニュアル
.github/workflows/    # 標準のCI・Pages公開
```

**Structure Decision**: [変更する実在pathだけ示す。新しい層は必要性を説明]

## Complexity Tracking

> 必要な場合だけ記載。別manifest、risk-owner台帳、承認証跡を作らない。

| Constraint or migration | Why needed | Affected paths | Completion check     |
| ----------------------- | ---------- | -------------- | -------------------- |
| [現行実装の制約]        | [残す理由] | [実在path]     | [解消を確認する方法] |
