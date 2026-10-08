<!--
Sync Impact Report
- Version change: 3.0.0 → 4.0.0 (MAJOR: incompatible governance and gate redefinition)
- Modified principles:
  - I. Learning-Outcome Alignment → I. Textbook Quality First
  - II. Accuracy and Traceability → II. Correct and Explainable Content
  - III. Progressive and Accessible Learning → integrated into I and II
  - IV. Reproducible Reasoning and Optional Examples → integrated into II and IV
  - V. Consistency and Maintainability → V. Simple Operations and Minimal Evidence
- Added principles:
  - III. Codex-Only Work Guided by a Manual
  - IV. Focused Automated Validation
  - VI. Compatibility of Content, URLs, and Learning Records
- Added sections: none (existing heading hierarchy retained)
- Removed obligations:
  - Human approval, self/third-party review modes, reviewer identity, solo-maintainer exceptions
  - Issue #48/#49/#53 scoped exceptions and item-by-item approval evidence
  - Mandatory full-spec workflow and separate review/work-manifest/digest ledgers per update
  - Blanket full-corpus, release, browser-matrix, and publication-readiness audits
- Templates:
  - ✅ updated: .specify/templates/constitution-template.md
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
  - ✅ updated: .specify/templates/checklist-template.md
  - .specify/templates/commands/*.md: absent; no command templates to update
- Runtime guidance:
  - ✅ added: AGENTS.md; docs/operations/update-manual.md
  - ✅ updated: docs/README.md; docs/operations/development.md
  - ✅ updated: docs/operations/weekly-update.md; docs/operations/initial-release-runbook.md
  - ✅ updated: specs/001-build-abc-textbook/quickstart.md (historical contract notice)
  - Other historical specs, proposals, reviews, and acceptance records are retained;
    their obsolete policy is superseded, not new completion criteria.
- Deferred placeholders: none
- Implementation follow-up (outside this documentation-only amendment):
  - ⚠ CI/release/deploy simplification and required-check settings remain unchanged.
  - ⚠ Existing evidence schemas/consumers, authoring skill contracts, and initial-feature
    design artifacts require coordinated migration before obsolete machinery is removed.
  - Concrete affected paths and compatibility checks: docs/operations/update-manual.md,
    section “既存実装からの移行”. These are future implementation work, not approval gates.
-->

# ABC Textbook Constitution

このプロジェクトは、個人が使う競技プログラミングの教科書をAstroの静的サイトとしてGitHub
Pagesへ公開する。人間は自然言語で目的を指示し、教材の執筆・修正・検証・実装と更新作業はCodexが担当する。以下のMUSTは必須、MUST
NOTは禁止、MAYは任意を表す。

## Core Principles

### I. Textbook Quality First

教科書の体系、文章、サイトの見やすさを最優先する（MUST）。教材は学習成果と前提知識へ結び付け、概念から問題へ無理なく進める読書順を保つ（MUST）。分類や掲載順は学ぶ能力に基づき、開催順やdifficultyだけから決めてはならない（MUST
NOT）。新しい用語・記号は初出で説明し、本文・数式・導線は一貫した表現にする（MUST）。必要な図には文章による説明を添え、色だけに依存しない表示、キーボード操作、狭い画面での読みやすさを変更に応じて確認する（MUST）。形式的な網羅率や証跡の量を文章・体系の品質の代用にしてはならない（MUST
NOT）。

### II. Correct and Explainable Content

問題条件、制約、解法と外部依存の技術的主張は公式問題文・公式解説などの信頼できる出典で確認し、教材から根拠を参照できるようにする（MUST）。変化する情報には適用版または確認日を添える（MUST）。出典と異なる説明や独自の証明はCodexが仮定・論証・境界条件を確認し、未解決の矛盾や未検証の主張を確定事項として公開してはならない（MUST
NOT）。完全解説は、着想から具体的なアルゴリズム、正当性、必要な状態や遷移、境界条件、全体の時間・空間計算量まで接続する（MUST）。訂正時は関連する本文、分類、前提、参照先も更新する（MUST）。

実行可能なコードを掲載する場合は環境・入力・実行方法・期待結果を明示し、実行して確認する（MUST）。擬似コードや省略は明記する（MUST）。補助的な短い例や反例は必要に応じて本文へ組み込める（MAY）。独立した例題・演習・評価・解答セクションを一律に追加してはならない（MUST
NOT）。

### III. Codex-Only Work Guided by a Manual

Codexは作業開始時に本憲章と
`docs/operations/update-manual.md`を読み、変更に関係する手順を参照する（MUST）。更新方法や検証方法を変える場合は同じ変更でマニュアルを更新する（MUST）。事故の予防は具体的な手順・注意点・復旧方法の共有を基本とし、手順で対処できる問題へ独自の承認機構や多段の状態管理を追加してはならない（MUST
NOT）。

Codexは執筆、実装、自動検証、文章・表示の確認を完了まで担当する（MUST）。人間の承認、人間によるself-review、第三者レビュー、独立した別エージェントの判定を完了・merge・公開の必須条件にしてはならない（MUST
NOT）。大きな分類変更や独自証明にもこの原則を適用し、影響確認と検算を厚くする（MUST）。目的の不明点や実際の権限・接続不足は必要な情報だけ確認できる（MAY）。人間が検査や承認を行ったという記録を捏造してはならない（MUST
NOT）。

### IV. Focused Automated Validation

自動テストとschema
validationを品質確認の中心に置く（MUST）。構造化データ・schemaの変更は型、必須項目、IDと参照整合性、変更した不変条件を既存の検証で確認する（MUST）。挙動の追加・修正には、その挙動や回帰を検出する自動テストを用いる（MUST）。schema通過を数学的正しさや文章の良さの保証として扱ってはならない（MUST
NOT）。

検証範囲は変更の影響に合わせる（MUST）。教材・表示を公開する変更では静的buildと内部リンクの確認を行い、UI・学習記録の挙動を変える場合は該当するブラウザーテストを行う（MUST）。運用文書だけの変更は整合性・リンク・書式の確認で完了できる（MAY）。変更と無関係な全教材の再審査、複数の実行環境や全ブラウザーの総当たり、性能・外部サイト・release証跡の重複検査を毎回の必須条件にしてはならない（MUST
NOT）。広範囲の検証は共通処理・schema・依存更新など影響が広い変更に限定する（MUST）。軽微な文章修正に新しいテストを作る義務はない。

CIは単一の基準環境と必要な検証を基本とし、同じbuildや判定を重複させない（MUST）。検証を追加・維持するときは検出する不具合と所要時間を評価し、同等の確認を重ねるだけの検査は統合・削除する（MUST）。必須検査の失敗や未解決の教材誤りを隠して更新完了としてはならない（MUST
NOT）。

### V. Simple Operations and Minimal Evidence

正本は教材ファイル・schema・Git履歴とし、検証結果と公開状態はGitHub Actionsのログ・チェック、GitHub
Pagesの履歴を優先する（MUST）。変更概要、実施した検証、未解決事項はPR本文または作業の完了報告へ簡潔にまとめる（MUST）。別のreview
evidence、work
manifest、digest台帳を通常更新ごとに重複して作成・保管する義務を設けてはならない（MUST
NOT）。公式出典の識別や既存データの参照に必要な情報は保持する（MUST）。一時的な作業メモや検算結果は必要なときだけ残せる（MAY）。

merge・deploy・再実行・復旧にはGit、GitHub Actions、GitHub
Pagesの標準機能を優先する（MUST）。独自のrelease台帳、deploy
adapter、承認receipt、多段のdigest連鎖を新たに増やしてはならない（MUST
NOT）。小さな更新に毎回一式のspec・plan・tasksや初回公開の再検証を要求してはならない（MUST
NOT）。個人用の静的教材では悪意ある攻撃への対策を通常更新の前提にしない。秘密情報・私的な学習記録の誤公開防止と標準の権限設定は維持する（MUST）。独自の認証・監査・攻撃シミュレーションを追加する義務はない。

### VI. Compatibility of Content, URLs, and Learning Records

既存教材、Problem
ID、公開URL、内部導線、学習記録とbackup形式の互換性を維持する（MUST）。正本の再生成で執筆済み本文を雛形へ戻してはならない（MUST
NOT）。運用の簡素化を理由に教材を削除・巻き戻ししてはならない（MUST NOT）。公開先のoriginとbase
path、IndexedDBの識別・保存形式を保持する（MUST）。互換性へ影響する変更が必要な場合は、既存URLの継続方法と記録の移行・復旧手順を先に定め、影響する既存データで検証する（MUST）。

## Content Standards

- 新規教材・大きな再構成では対象学習者、前提、学習成果、範囲を明確にする（MUST）。既存本文の小さな修正では既存の定義を参照し、別の仕様書へ複写しない。
- 本文、問題の主配置、関連問題、前提関係、読書順を一緒に確認する（MUST）。一つの事実に複数の正本を作ってはならない（MUST
  NOT）。
- 出典とコードは公開可能なものを使い、例に実際の秘密情報や個人情報を含めない（MUST）。
- 必要な説明・導線を読めない状態、既知のリンク切れ、矛盾した解法、失敗する掲載コードを残して公開してはならない（MUST
  NOT）。

## Authoring Workflow and Quality Gates

1. Codexは憲章・更新マニュアルを読み、依頼とGit差分から対象と影響を確認する。
2. 小さな更新は直接作業する。設計が必要な変更やSpec
   Kitを指定された作業ではspec・plan・tasksを用い、該当するConstitution Checkだけを記録する。
3. 正本を修正し、出典、論証、体系、文章、表示と互換性を影響範囲で確認する。
4. マニュアルに従って必要なschema検証・自動テスト・build等を実行する。失敗は修正し、修正した範囲を再検証する。
5. 変更と検証結果を短く報告する。公開を含む依頼では成功したチェックを持つGitの変更を標準の公開手順で反映し、公開状態と代表的な導線を確認する。未実行のmerge・deployを完了したとは報告しない。

既存実装が旧証跡を要求する間は、マニュアルに記した現行の制約を扱う。検証失敗を無視する、架空の承認を作る、参照済み証跡を先に削除する方法で簡素化してはならない（MUST
NOT）。移行は互換性を確かめる別の実装変更として行う。

## Governance

本憲章はプロジェクト内の最上位規則であり、利用者の明示指示に従って改訂する。旧spec、提案、skillの運用記述、レビュー証跡に残る人間承認や多重管理の要求は、新しい更新の必須条件として復活させない（MUST
NOT）。過去の記録は履歴として残し、現行の作業手順は更新マニュアルを参照する（MUST）。

改訂時はCodexが目的、変更原則、互換性への影響を記載し、Constitution、関連テンプレートと現行の運用入口を同じ変更で整合させる（MUST）。自然言語による改訂指示を受けた後に、別の人間承認を要求してはならない（MUST
NOT）。文書だけで解消できない実装との差は、具体的な対象と移行内容をSync Impact
Reportと更新マニュアルへ記録する（MUST）。

版はsemantic
versioningに従う。原則・統治規則の互換性を壊す削除や再定義はMAJOR、原則や義務の追加はMINOR、要求を変えない明確化はPATCHとする。採択日は保持し、改訂日とSync
Impact
Reportの版を本文末尾へ一致させる（MUST）。Codexは各変更で該当原則への適合を確認し、通常更新の確認は完了報告へ集約する（MUST）。計画を作る場合はConstitution
Checkを用いる。別の定期監査や独立レビューは不要とする。

**Version**: 4.0.0 | **Ratified**: 2026-07-19 | **Last Amended**: 2026-10-08
