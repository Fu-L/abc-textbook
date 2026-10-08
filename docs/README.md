# 運用文書と過去の記録

現行の作業方針は[Constitution 4.0.0](../.specify/memory/constitution.md)、Codexの作業入口は[更新マニュアル](operations/update-manual.md)です。教材の体系・文章・見やすさを優先し、必要な自動テストとschema
validationで確認します。通常更新はCodexのみで完結し、人間の承認・第三者レビューを要求しません。

- `operations/update-manual.md`: 毎回読む更新・確認・公開・復旧手順
- `operations/development.md`: 既存の開発環境とコマンドの説明
- `operations/initial-release-runbook.md`: 現行公開実装の制約と初版の公開実績
- `work-manifests/`, `reviews/`, `verification/`: 旧実装が参照する証跡と過去の記録

変更・検証・公開の記録はGit、GitHub
Actions、Pagesの履歴を優先し、PR本文または完了報告へまとめます。通常更新ごとに別のreview
evidence、manifest、digest台帳を追加しません。出典と既存データの参照に必要な記録は保持します。

初期構築のspec・提案・旧runbook・skillの運用記述に残るself/third-party
review、人間承認、全件監査の要求は、現行憲章に置き換わっています。過去の受入記録を新しい承認条件として使いません。既存CI・schema・release処理の依存は文書改訂だけでは消えないため、具体的な移行対象を更新マニュアルの「既存実装からの移行」に記載しています。

現在の公開先は[GitHub Pages](https://fu-l.github.io/abc-textbook/)です。初版公開前の手順とlive更新の未実装事項を、現在の公開状態や機能の完成と混同しません。
