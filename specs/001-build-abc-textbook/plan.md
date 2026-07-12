# Implementation Plan: ABC上級問題体系化教科書

**Branch**: `001-build-abc-textbook` | **Date**: 2026-07-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-build-abc-textbook/spec.md`

## Summary

ABC 212から計画基準日時点で終了済みのABC 466までに公式に存在するE〜H問題を、依存関係に沿った日本語教科書、タグ別問題集、コンテスト表索引として提供する。実装はAstro/Starlightの静的サイトを中心にし、Git管理するJSONとMarkdown/限定MDXを単一の正本とする。学習記録だけはブラウザーのIndexedDBへ問題ID単位で保存し、版付きJSONのエクスポート・インポートでバックアップ可能にする。

週次更新はNode.js/TypeScript製CLIの単一開始コマンドで、終了確認、公式ページ取得、差分作成、解説生成用パケット、分類・配置候補、検証報告を一つのステージング更新へまとめる。解説は版管理されたプロジェクト専用skillで作成し、リポジトリのスクリプトから有料・従量課金APIを呼ばない。公式根拠、再現性、自動検証、作成者以外のレビュー、管理者承認が揃った更新だけを原子的に公開する。

## Technical Context

**Language/Version**: Node.js 24 LTS、TypeScript 6.x（strict、ESM）、HTML/CSS、Markdown。依存関係はlockfileで正確な版を固定する。

**Primary Dependencies**: Astro 7.x（static output、content collections）、Starlight 0.41.x（日本語教材UI、Pagefind検索）、Zod 4（`astro/zod`）、`idb`（IndexedDBラッパー）、Cheerio（公式HTMLの限定的な構造解析）、npm 11.x。契約検査にAjv 8、テストにVitest 4.x、Playwright、`@axe-core/playwright`、リンク検査にLinkinatorを使う。実装時は調査済み版を`package-lock.json`で完全固定する。

**Storage**: Git管理されたJSONメタデータとMarkdown/allowlist制限付きMDX本文を教材の正本にする。生成索引とPagefind索引はビルド成果物であり正本にしない。個人の学習記録はIndexedDBへ保存し、版付きJSONでバックアップ・復元する。更新候補と検証報告は`staging/updates/`へ置く。サーバーDBは使わない。

**Testing**: `astro check`と`tsc --noEmit`、Zod/Ajvによるスキーマ契約、VitestによるDAG・差分・状態遷移・日時独立性の単体テスト、fixtureを使う更新統合テスト、Playwrightによる主要経路・永続化・キーボード操作・レスポンシブ表示のE2E、axeによる自動アクセシビリティ検査、Linkinatorと独自検証器による内部リンク・出典・例・対象範囲の公開前検証、手動アクセシビリティ確認と独立内容レビュー。

**Target Platform**: Node.js 24を実行できるmacOS/Linux/Windows上のローカル運用と、現行主要ブラウザー。公開物は任意の静的HTTPサーバーで閲覧できる。GitHub Pagesは公開リポジトリで利用可能な場合だけ任意経路とし、必須経路はローカルに保つ。

**Project Type**: 静的Webアプリケーション + ローカルCLI型コンテンツパイプライン。

**Performance Goals**: 255コンテスト・最大1,020セルの初期カタログを通常の個人PCで5分以内に検証・静的ビルドする。問題・タグ・章・状態の複合絞り込みは1,500問題規模で操作後100ms以内を目標とする。終了済み1コンテストの更新開始から、各対象問題の候補または具体的な保留理由を15分以内に生成する。静的ページは必要な画面以外へ学習記録用JavaScriptを配信しない。

**Constraints**: 必須経路の継続費用0円、単一利用者、アカウント/常時稼働バックエンド/有料APIなし。開催中コンテストを取得しない。AtCoderの利用条件を尊重し、問題文・公式解説本文を正本へ転載せず公式URL、検証メタデータ、必要最小限の引用、独自説明を保持する。公開には全ゲート通過、作成者以外のレビュー記録、管理者承認が必要。WCAG 2.2 AAを設計目標にし、色や配置だけで意味を伝えない。

**Scale/Scope**: 初期範囲はABC 212〜466の255コンテスト、E〜Hの最大1,020セル、1人分の学習記録。少なくとも1,500問題、500タグ、1,000学習単位までサーバーなしで拡張できる設計とし、週あたり最大4問題程度の継続追加を想定する。

## Constitution Check

*GATE: Phase 0開始前に評価し、Phase 1設計後に再評価する。*

### Phase 0事前ゲート

- **Learning outcomes — PASS**: 仕様に対象学習者、ABC D相当までの前提、6つの学習成果、対象/対象外、SC-001〜SC-017がある。実装と検証は、解説理解、依存順学習、タグ横断、逆引き、学習記録、週次更新という独立成果ごとに分ける。
- **Accuracy and traceability — PASS**: 公式コンテスト、問題、解説、訂正、利用規約を第一根拠とし、URL、対象コンテスト/版、確認日時、取得指紋、訂正履歴を`SourceRecord`へ残す。公開対象の技術的主張は自動検証または作成者以外のレビューに結び付ける。
- **Progression and accessibility — PASS**: タグDAGと学習単位DAGを別々に検証し、安定した規則で一本道の全体順を生成する。用語は初出定義し、意味のある見出し、ランドマーク、表caption、代替テキスト、キーボード操作、テキスト付き状態バッジ、表の代替一覧を要求する。
- **Reproducibility — PASS**: 実行可能な例は環境、入力、手順、期待結果、検証状態を必須フィールドにする。Node/npmの版と`package-lock.json`を固定し、fixtureベースの更新、説明例、リンク、ビルドを公開前に再実行する。
- **Consistency and maintainability — PASS**: Zodスキーマ、安定ID、用語集、専用skillを正本とし、索引・JSON契約・章順は生成する。`npm run verify:fast`と`npm run verify:release`にスキーマ、網羅性、循環、参照、説明構成、レビュー、アクセシビリティ、ビルドの各ゲートを集約する。

### Phase 1設計後の再評価

- **Learning outcomes — PASS**: `data-model.md`で各教材単位・解説・演習から学習成果への参照を必須化し、`quickstart.md`のシナリオ1〜7で主要成果を独立検証できる。
- **Accuracy and traceability — PASS**: 出典、解説、レビュー、公開更新を別エンティティにし、契約上、根拠不足・矛盾・未レビューの候補は公開状態へ遷移できない。
- **Progression and accessibility — PASS**: タグ階層、タグ前提DAG、学習単位階層、学習単位前提DAGを分離し、循環経路を報告する。UI契約に表と代替一覧、状態テキスト、フォーカス、日時表記を含めた。
- **Reproducibility — PASS**: 例の検証契約、CLI fixture、lockfile、ローカル静的サーバー、観察可能な期待結果をquickstartに定義した。
- **Consistency and maintainability — PASS**: Git上の正本から表示索引と公開カタログを生成し、学習記録は安定した問題IDだけに結び付ける。タグや章の再編で個人記録を移動させない。

**Gate result**: 憲章違反および未正当化の例外はない。Phase 0/1を進められる。

## Project Structure

### Documentation (this feature)

```text
specs/001-build-abc-textbook/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── catalog.schema.json
│   ├── learning-record.schema.json
│   ├── update-manifest.schema.json
│   ├── cli.md
│   └── ui-routes.md
└── tasks.md                 # /speckit-tasksで後続生成。今回は作成しない
```

### Source Code (repository root)

```text
.agents/skills/abc-explanation-author/
├── SKILL.md                 # 解説生成方針の唯一の正本と版
├── references/
└── templates/

src/
├── content.config.ts        # Starlight docsと全コレクションのZodスキーマ入口
├── content/
│   ├── docs/                # 学習単位・問題解説のMarkdown/限定MDX
│   ├── contests/
│   ├── problems/
│   ├── tags/
│   ├── learning-units/
│   ├── sources/
│   └── releases/
├── components/              # 状態バッジ、索引表、フィルター、学習記録UI
├── layouts/                 # 教材・問題・索引の共通構造
├── pages/                   # 静的ルートと公開JSONエンドポイント
├── lib/
│   ├── domain/              # スキーマ、安定ID、DAG、状態遷移
│   ├── catalog/             # 読み込み、派生索引、検索
│   ├── learning-records/    # IndexedDB、移行、export/import
│   └── validation/          # 公開ゲートと診断
└── styles/

scripts/
├── update-abc/              # 公式情報取得、正規化、差分、候補生成
├── validate/                # 網羅性、DAG、出典、リンク、例、レビュー
├── approve-update.ts
└── publish-update.ts

staging/updates/             # 未公開の更新単位、候補、検証報告
tests/
├── contract/                # JSON/CLI/静的データ契約
├── integration/             # fixture更新、冪等性、公開トランザクション
├── unit/                    # スキーマ、DAG、日時、フィルター
├── e2e/                     # 閲覧、索引、永続化、アクセシビリティ
└── fixtures/                # 取得済み最小fixtureと失敗ケース

.github/workflows/           # 任意の無料CI/Pages経路。ローカル実行を代替しない
```

**Structure Decision**: Astro/Starlight単一プロジェクト内に教材表示、共有ドメイン、更新CLIを置く。Starlightは章ナビゲーション、目次、コード表示、Pagefindを担当し、表索引・タグ索引・復習一覧は同じレイアウト上のカスタムAstroページにする。サイトとCLIが同じZodスキーマ・DAG・安定ID実装を共有するため、別パッケージや別DBを設けない。未公開候補は`staging/`へ隔離し、承認済みデータだけを`src/content/`へ原子的に反映する。

## Phase 0: Outline & Research

調査結果は[research.md](./research.md)へ集約する。解決対象は、静的構成とブラウザー永続化、公式情報の安全な取得、解説skillの実行境界、冪等更新、品質ゲート、無料公開経路、現行ツール版である。すべての技術的不明点をDecision / Rationale / Alternatives considered形式で解消済みである。

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md): 教材の正本、派生索引、個人学習記録、更新・レビュー・公開の状態遷移と検証規則を定義する。
- `contracts/*.schema.json`: 公開カタログ、ブラウザー学習記録、ステージング更新の機械可読契約を定義する。実装時はZodから生成して差分検査する。
- [contracts/cli.md](./contracts/cli.md): 単一開始操作、検証、承認、公開、終了コード、冪等性、ネットワーク失敗時の契約を定義する。
- [contracts/ui-routes.md](./contracts/ui-routes.md): 静的ルート、索引、フィルター、状態変更、バックアップ、アクセシビリティの利用者契約を定義する。
- [quickstart.md](./quickstart.md): fixtureだけで再現できる主要シナリオと、任意の公式ネットワーク確認を分離して記載する。

## Verification Strategy

| 成果 | 自動検証 | 必須の手動確認 |
|---|---|---|
| 再現可能な解説 | 必須見出し、出典、計算量、例メタデータ、skill版、内部参照 | 技術的主張、考察の自然さ、例の妥当性を作成者以外が確認 |
| 依存順の教科書 | タグ/学習単位DAG、全体順、到達可能性、循環経路 | 前提と難易度の教育的な自然さ |
| 学習記録 | スキーマ移行、独立日時、再読込、export/import、未知ID保持 | 日時と状態表示の理解しやすさ |
| コンテスト逆引き | 連続範囲、全E〜Hセル、参照、フィルター、E2E | 表と代替一覧の操作性 |
| 週次更新 | 終了判定、fixture差分、冪等性、保留理由、原子的公開 | 出典利用条件、分類、レビュー、承認 |
| 公開品質 | static build、内部リンク、axe、キーボードE2E | スクリーンリーダー、リフロー、内容アクセシビリティ |

## Complexity Tracking

憲章違反はなく、例外の追跡は不要。
