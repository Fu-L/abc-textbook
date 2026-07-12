# CLI Contract

**Version**: 1.0.0

**Scope**: 終了済みABCの候補作成、検証、レビュー取込、承認、公開

## 1. 共通契約

- Node.js 24 LTSと`package-lock.json`で固定された依存を使う。
- 全コマンドはrepository rootから実行する。
- 既定で有料・従量課金APIを呼ばない。設定がなくても手動執筆テンプレートまで生成できる。
- AtCoderへのアクセス前にrobots、規約指紋、対象contest終了を確認する。
- AtCoder向けHTTP同時実行は1、開始間隔は1秒以上、限定retryとdeadlineを守る。
- stdoutの最後の行は機械可読JSON、進捗と診断はstderrへ出す。
- stderr、manifest、fixtureへAtCoder問題文・解説本文・認証情報を出さない。
- 同じupdateへの同時writerをlockで拒否する。
- `src/content/`を変更するのはpublishだけ。update/validate/review/approveは`staging/`内に限定する。

### 共通終了コード

| Code | Meaning |
|---:|---|
| `0` | コマンド目的を完了。updateでは候補/差分レポート作成済み |
| `2` | 有効な保留レポートを作成して`ON_HOLD`で終了。再試行可能な業務結果 |
| `64` | CLI引数または入力形式が不正 |
| `65` | JSON/Markdown/schema/参照が不正で、有効な更新結果を作れない |
| `73` | writer lock取得不可、または許可されない書込先 |
| `78` | policy/設定が不正。安全な保留manifestも作れない |
| `70` | 予期しない内部エラー。既存公開物は変更しない |

`2`は公開成功ではないが、SC-006の「具体的な保留理由を確認できる」正常な観察結果として扱う。CIは`0`以外を明示的に判定する。

## 2. 単一開始操作: `abc:update`

```bash
npm run abc:update -- --contest abcNNN
```

### Inputs

| Option | Required | Contract |
|---|---:|---|
| `--contest abcNNN` | yes unless `--latest` | ABC 212以上。終了済みでなければ保留 |
| `--latest` | alternative | archiveから最新の終了済み未収録ABCを1件選ぶ |
| `--deadline-seconds N` | no | 既定840秒、最大900秒。候補/保留レポートまでのdeadline |
| `--offline-fixture PATH` | no | ネットワークを一切使わず、テストfixtureを公式応答として読む |
| `--regenerate` | no | source/taxonomy/skillが同じでもExplanation candidateを新revisionとして明示再生成 |
| `--resume UPDATE_ID` | no | `ON_HOLD`更新を`resumeStage`から再開 |

- `--contest`と`--latest`は排他。
- `--offline-fixture`使用時は出力へ`fixtureMode: true`を記録し、publish不可にする。
- `--regenerate`はProblem/Indexの重複を許可せず、解説revisionだけを増やす。

### Processing stages

1. writer lockと入力検証
2. robots/利用規約/生成AIルール指紋の確認
3. archive/contestから終了確認
4. tasksからE〜Hの存在と公式URLを抽出
5. 問題/公式editorialから最小メタデータ・SourceRevisionを作成
6. 既存releaseとの差分とidempotency keyを計算
7. AuthoringPacket、手動テンプレート、タグ/前提/配置候補を作成
8. schema、参照、DAG、網羅性、必須構成、内部リンクのfast検証
9. 問題別候補またはhold reason、stage timing、総時間をmanifest/reportへ保存

公式HTMLはstage 5の抽出・指紋計算後に破棄する。

### Outputs

```text
staging/updates/<updateId>/
├── manifest.json
├── report.md
├── sources/                 # URL、指紋、確認日時だけ
├── authoring-packets/
├── candidates/
├── validation/
└── reviews/
```

stdout最終行:

```json
{
  "command": "abc:update",
  "updateId": "upd-abc999-0123456789ab",
  "state": "VALIDATED",
  "reportPath": "staging/updates/upd-abc999-0123456789ab/report.md",
  "elapsedMs": 12345,
  "changedEntities": 4,
  "blockingFindings": 0
}
```

保留時は`state: "ON_HOLD"`、`holdCode`、`problemIds`、`retryCondition`を追加し、exit 2とする。

### Idempotency

- idempotency keyはcontest slugとsource-set fingerprintから決定する。
- 入力指紋が同じ再実行では同じupdate directoryを再利用し、順序・時刻以外の候補差分を増やさない。
- 既に公開済みで差分がない場合はexit 0、`changedEntities: 0`、状態を`VALIDATED`として監査レポートだけ更新する。
- source/taxonomy/skillのいずれかが変われば新revisionと差分を明示する。

### Hold codes

最低限、次を安定コードとして扱う。

`CONTEST_NOT_ENDED`, `ROBOTS_UNREACHABLE`, `POLICY_CHANGED`, `SOURCE_UNAVAILABLE`, `OFFICIAL_EDITORIAL_PENDING`, `PARSER_DRIFT`, `GENERATOR_UNAVAILABLE`, `AUTHORING_REQUIRED`, `SOURCE_CONTRADICTION`, `EXAMPLE_NOT_REPRODUCIBLE`, `DEPENDENCY_CYCLE`, `REVIEW_CHANGES_REQUESTED`, `DEADLINE_REACHED`。

## 3. 検証: `abc:validate`

```bash
npm run abc:validate -- --update <updateId> [--level fast|release]
```

- 既定levelは`fast`。
- `release`は全ブラウザーE2E、全ルートaxe、外部リンク、二重build digest、レビュー/承認を含む。
- 検証は候補を書き換えず、`validation/run-<timestamp>.json`とmanifestのfinding参照だけを更新する。
- blocking findingがあればexit 2、updateを`ON_HOLD`へ移し、元のstageを`resumeStage`へ残す。
- 循環は経路、欠落参照は参照元/先、リンク失敗はproblem/source IDと結果を出す。

stdout最終行:

```json
{
  "command": "abc:validate",
  "updateId": "upd-abc999-0123456789ab",
  "level": "release",
  "state": "AWAITING_EXTERNAL_REVIEW",
  "blockingFindings": 0,
  "reportPath": "staging/updates/upd-abc999-0123456789ab/validation/run.json"
}
```

## 4. 外部レビュー取込: `abc:review`

```bash
npm run abc:review -- --update <updateId> --record <review-record.json>
```

- [update-manifest.schema.json](./update-manifest.schema.json)のReviewRecord契約を検証する。
- `reviewerId === authorId`を意味検証で拒否する。
- review対象digest、source revision集合、skill版が現在候補と一致しなければstale reviewとして拒否する。
- `changes_requested/rejected`は`ON_HOLD`へ移し、findingを作る。
- 全必須scopeが`approved`なら`AWAITING_OWNER_APPROVAL`へ進める。
- レビュー担当者に利用者アカウントやGit権限を要求しない。版付きJSON記録だけを取り込める。

## 5. 管理者承認: `abc:approve`

```bash
npm run abc:approve -- --update <updateId> --owner <owner-id>
```

Preconditions:

- fixture modeでない。
- release検証が現在candidate digestに対して成功している。
- blocking findingが0。
- 必須Explanation/Claim/Example/Update scopeにauthorと異なるreviewerの承認がある。
- ownerへ表示したmanifest digestが承認対象と一致する。

承認記録はowner ID、manifest digest、offset付き時刻を持つ。内容が1 byteでも変わると承認を無効化する。成功後の状態は`READY_TO_PUBLISH`。

## 6. 原子的公開: `abc:publish`

```bash
npm run abc:publish -- --update <updateId>
```

Preconditions:

- stateが`READY_TO_PUBLISH`。
- 現在候補digestに対するreview/approval/release検証がすべて有効。
- base releaseが現在公開releaseと一致する。
- `src/content/`と公開manifestに未コミットの競合変更がない。

Behavior:

1. 一時worktreeへ候補を適用
2. `npm run verify:release`を再実行
3. Release/変更履歴/派生索引を生成
4. 一時成果物のdigestを承認digestと照合
5. 公開manifestと正本を同じfilesystem transaction境界で切替
6. updateを`PUBLISHED`へ移す

失敗時は公開中releaseを維持し、部分適用しない。publish済みupdateへの再実行は同じreleaseを返すno-opとする。

## 7. 読取専用コマンド

```bash
npm run abc:status -- --update <updateId>
npm run catalog:validate -- [--fixture PATH]
npm run catalog:build
npm run verify:fast
npm run verify:release
```

- `abc:status`は更新状態、候補数、hold、findings、review、approval、timingsを表示する。
- `catalog:validate`は公開正本またはfixtureを変更せず検証する。
- `catalog:build`は正本から公開JSON、学習順、索引を決定的に生成する。
- verify scriptsはローカル必須経路であり、GitHub Actions専用ロジックを持たない。

## 8. ネットワークと安全性

- AtCoder以外へ問題データを送信しない。AtCoderからは公開GETだけを行う。
- 認証cookieを使わず、開催中や認証必須の情報を取得しない。
- `User-Agent`にtool versionとproject/contact URLを含める。
- robots取得不能時はAtCoderへの残りのアクセスを拒否する。
- 429/503/一時ネットワーク障害だけをretryし、`Retry-After`を優先する。
- policy fingerprint変更時は`POLICY_CHANGED`で停止し、人が方針を確認する。
- fixtureには明確に架空のcontest/problemを使い、公式本文を保存しない。
