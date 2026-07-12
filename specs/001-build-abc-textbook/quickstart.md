# Quickstart Validation Guide

この文書は実装完了後、[spec.md](./spec.md)の主要成果をローカルで端から端まで検証するための実行ガイドである。実装コードや完全なテストsuiteはここへ記載しない。

関連契約:

- [データモデル](./data-model.md)
- [公開カタログ契約](./contracts/catalog.schema.json)
- [学習記録契約](./contracts/learning-record.schema.json)
- [更新manifest契約](./contracts/update-manifest.schema.json)
- [CLI契約](./contracts/cli.md)
- [UI/route契約](./contracts/ui-routes.md)

## 1. Prerequisites

- Git
- Node.js 24 LTS（実装時に`.nvmrc`/`engines`へ固定された版）
- Node同梱のnpm 11
- Chromium/Firefox/WebKitをインストールできるローカル環境
- release検証時だけ、公式外部リンクへ通常のHTTPS接続

必須検証は既存PC上でローカル実行でき、GitHub、有料API、ホスト型DB、カスタムドメインを必要としない。

```bash
node --version
npm --version
npm ci
npm exec playwright install
```

Expected:

- Node/npmがrepositoryで固定した版と一致する。
- `npm ci`が`package-lock.json`を書き換えず成功する。
- Playwrightの3 browserを使用可能になる。

## 2. Fast baseline

```bash
npm run verify:fast
```

Expected:

- TypeScript/Astro診断0件。
- ZodとJSON Schema契約違反0件。
- ID/参照/Tag DAG/Learning Unit DAG/到達可能性のerror 0件。
- unit/integration test成功。
- static build、内部link/fragment、Chromium主要E2E、変更routeのaxe検査成功。
- 終了コード0。

失敗時は公開作業へ進まず、診断にentity ID、ファイル、循環/参照経路が含まれることを確認する。

## 3. Scenario A — 初期カタログの網羅性

```bash
npm run catalog:validate -- --cutoff 2026-07-12T00:00:00+09:00 --first abc212 --last abc466
npm run catalog:build
```

Expected:

- ABC 212〜466の255 Contestが連続する。
- すべてのContestにE/F/G/Hの4 SlotRecord、合計1,020 cellがある。
- 各cellが「収録済み」「未収録」「作成中」「公開保留」「公式問題なし」「公式取り下げ」のいずれかへ明示的に導出される。
- `exists`の全Problemに公式URL、確認日時、1件以上のTag、Learning Unit、Placementがある。
- 公開する全Problemが完全解説、類題、補充問題のいずれかとして到達可能。
- 同じ入力から2回生成した`catalog.json`のSHA-256が一致する。

## 4. Scenario B — 解説契約と専用skillの独立性

```bash
npm run test:contract -- explanation
npm run test:contract -- authoring-skill
```

Expected:

- full Explanation fixtureに「自然な考察手順」「学ぶべきパーツの分解」「正当性」「計算量と制約整合」「実装上の注意」「例または検証手順」「ワンポイント」「出典」がある。
- SourceRevision、学習成果、skill name/version/digest、input fingerprint、独立reviewを追跡できる。
- similar/supplement fixtureに主要解説、簡略化理由、差分、追加学習要素がある。
- 解説生成・検証コードがroot `prompt.md`を参照せず、`.agents/skills/abc-explanation-author/SKILL.md`だけを正本として使う。
- 必須見出し欠落、未検証例、source矛盾、skill digest不一致のnegative fixtureが具体的codeで失敗する。

## 5. Scenario C — 学習順と循環診断

```bash
npm run test:unit -- graph-order
npm run catalog:validate -- --fixture tests/fixtures/catalog/tag-cycle.json
npm run catalog:validate -- --fixture tests/fixtures/catalog/unit-order-violation.json
```

Expected:

- valid fixtureはchapter/section/subsectionの親構造を保った決定的な全体順を返す。
- すべての前提Unitが依存Unitより前にある。
- 同分野の基礎と複合編を別Unitとして非連続に配置できる。
- cycle fixtureは非0で失敗し、例として`tag-a -> tag-b -> tag-a`のような閉路を報告する。
- order violationは参照元、満たしていない前提、影響するchapterを報告する。
- 検証は公開正本を書き換えない。

## 6. Scenario D — 一操作の週次更新と冪等性

架空の終了済みcontest fixtureを使い、AtCoderへアクセスせずに検証する。

```bash
npm run abc:update -- --contest abc999 --offline-fixture tests/fixtures/atcoder/abc999-complete
npm run abc:status -- --update upd-abc999-<reported-digest>
npm run abc:update -- --contest abc999 --offline-fixture tests/fixtures/atcoder/abc999-complete
```

Expected first run:

- 一つの開始commandでContest、実在E〜H、SourceRevision、AuthoringPacket、Tag/前提/配置候補、validation reportが同じupdate directoryへ作られる。
- stdout最終JSONにupdate ID、state、report path、elapsed milliseconds、changed entity countがある。
- 生HTMLや公式本文が`staging/`へ残らない。
- fixture modeが記録され、publish不可になる。
- 15分以内に候補または問題別hold reasonへ到達する。

Expected second run:

- idempotency keyとupdate IDが同じ。
- Problem/Explanation/Indexの重複0件。
- source/taxonomy/skillが同じなら候補差分0件。

### Official editorial pending

```bash
npm run abc:update -- --contest abc998 --offline-fixture tests/fixtures/atcoder/abc998-editorial-pending
```

Expected:

- 終了コード2。
- 有効なmanifest/reportを作り、state=`ON_HOLD`、code=`OFFICIAL_EDITORIAL_PENDING`、対象problem、再試行条件を示す。
- 不完全なExplanationを公開候補扱いしない。

### Parser drift / robots unavailable / deadline

```bash
npm run test:integration -- updater-holds
```

Expected:

- 各fixtureが`PARSER_DRIFT`, `ROBOTS_UNREACHABLE`, `DEADLINE_REACHED`を区別する。
- robots失敗後にAtCoder相当fixtureへの残りのrequestを行わない。
- `official_absent`と取得失敗の`unknown`を混同しない。

## 7. Scenario E — 教材を読む

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

ブラウザーで次を確認する。

1. `/learn/`から標準学習順の最初のUnitを開く。
2. 前提、成果、用語、導入、例、基本/発展問題、到達確認を見る。
3. Problemへ移り、自然な考察から正当性、計算量、例、助言まで読む。
4. 主/補助Tagへ移り、親、子、前提、代表問題を見る。
5. `/contests/`へ移り、同じProblemをABC番号×slotから逆引きする。

Expected:

- 公式問題本文を転載せず、公式URLと最終確認日時がある。
- 新用語は初出定義され、未定義の必須語や説明の飛躍がない。
- 内部移動が2xxで、browser back/forwardとbase pathでも参照を失わない。
- JavaScriptを無効にしても本文、目次、章/Tag/Problemリンク、cell状態を読める。

## 8. Scenario F — 学習記録の独立日時と永続化

```bash
npm run test:e2e -- learning-records
```

E2Eが行う観察:

1. recordのないProblemを開き、`未着手`、要復習なし、両方`更新記録なし`を確認。
2. statusを`挑戦中`へ変更し、status日時だけが付くことを確認。
3. 別時刻に要復習を付け、statusとstatus日時が変わらないことを確認。
4. statusを`修了`にし、要復習と要復習日時が変わらないことを確認。
5. reloadと別route往復後も4値を保持することを確認。
6. JSON export、DB clear、importで同じ値・日時を復元。
7. catalog fixtureを新versionへ切替え、既存recordが不変、新Problemがrecordなしの既定値になることを確認。

Expected:

- FR-029〜FR-035をすべて満たす。
- 保存失敗fixtureでは成功通知を出さず、画面値をrollbackしてテキストエラーを示す。
- `修了`かつ`要復習`を矛盾扱いしない。
- 日時表示から日付、時刻、UTC offset、IANA timezoneを判別できる。
- 通常の問題画面で`修了`と`要復習`を記録する利用者操作が30秒以内に完了する。

## 9. Scenario G — コンテスト表・要復習filter・アクセシビリティ

```bash
npm run test:e2e -- contest-index review-filter accessibility
```

Expected:

- Contest表にcaption、row/column headerがあり、全cellをkeyboardとscreen readerで識別できる。
- 問題cellに識別可能なlink名、解答状況、`要復習`の可視テキストがある。
- `公式問題なし`、`未収録`、`作成中`、`公開保留`を空欄や色だけで表さない。
- 表と同じfilter結果の代替listがある。
- ProblemまたはContest表から2操作以内で`/review/`へ到達する。
- `/review/`へ要復習なしProblemが混入しない。
- contest、slot、Tag、Unit、statusの追加filterがAND条件で働き、件数と0件理由を示す。
- axe自動違反0件。keyboard、focus、320 CSS px相当のreflow、200〜400% zoom、reduced motionの手動checklistも完了する。

## 10. Scenario H — Review、approval、原子的publish

```bash
npm run test:integration -- publication-gates
```

Expected negative cases:

- authorと同じreviewerを拒否。
- stale digest/source/skill版へのreviewを拒否。
- blocking finding、未review、未approval、fixture mode、base release競合のpublishを拒否。
- 失敗後も現在公開releaseと`src/content/`が部分変更されない。

Expected positive case:

- 別reviewerのapproved recordを取り込み、ownerが表示されたmanifest digestを承認できる。
- release検証後だけ`READY_TO_PUBLISH`になる。
- publishでContent、Tag、Unit、Problem、Index、Release/変更履歴が同じ版へ切り替わる。
- publish再実行は同じreleaseを返すno-op。
- 既存LearningRecord fixtureの値と日時が一切変化しない。

## 11. Scenario I — 学習成果の利用者評価

自動テストで代替できないSC-009/SC-010を、対象学習者に該当する5人以上の協力者で確認する。製品が1人用であることは、教材品質の評価協力者を複数にすることと矛盾しない。

### 初見問題の理解

1. 事前に解いたことがない代表的なE以降の問題を各協力者へ提示する。
2. 前提を満たすことを確認し、教材の該当解説を通常どおり読んでもらう。
3. 解説を閉じた後、「主要な着眼点」「使う典型」「計算量と制約整合」を自分の言葉で説明してもらう。
4. 3項目のrubricと判定根拠を、氏名等の個人情報を含めず記録する。

Expected:

- 協力者の80%以上が3項目をすべて説明できる。
- 失敗した項目は対応するExplanation/Unit/用語/例のfindingへ結び付く。

### 次に学ぶ章の特定

1. グラフ、DP、データ構造、数学から代表的な現在地を提示する。
2. `/learn/`とTagページを使い、次のUnit、その前提、順序理由、開始する基本問題を選んでもらう。
3. 迷わず正しい対象を選べたかを同じrubricで判定する。

Expected:

- 協力者の80%以上が次のUnit、前提と理由、基本問題を特定できる。
- 結果をreleaseのAssessment evidenceへ保存し、80%未満なら公開を保留する。

## 12. Scenario J — 継続費用0円の運用監査

```bash
npm run test:integration -- yearly-zero-cost-operation
npm run audit:external-services
```

Expected:

- 52週分のupdate fixtureを、ローカルNode/npm scripts、手動Authoring template、local previewだけで処理できる。
- 必須commandがOpenAI API等の従量課金endpoint、ホストDB、外部検索、解析、Web font、有料domainを要求しない。
- credential未設定でも候補または`AUTHORING_REQUIRED`保留まで到達し、課金経路へ自動fallbackしない。
- 既存PC、電気、通常通信を除く必須支出の年次試算が0円。
- GitHub Actions/Pagesは任意項目として別計上され、private有料機能や無料枠超過を必須経路の根拠にしない。
- 依存先の料金/規約変更が検出された場合、代替ローカル経路を確認するまでreleaseを保留する。

## 13. Full release verification

```bash
npm run verify:release
```

Expected:

- fast gate一式が成功。
- 全生成routeのaxe違反0件。
- Chromium/Firefox/WebKitの主要flow成功。
- 内部link/fragmentの失敗0件。
- 必須外部公式linkが成功、または人の確認記録付き。403/timeoutを成功扱いしない。
- 実行可能な全例が宣言手順で期待結果を再現。
- source、skill、review、owner approval、change logが現在manifest digestへ一致。
- clean environmentで2回buildしたfile listとSHA-256が一致。
- `dist/`が任意GitHub Pages制限の安全余裕内、deploy testが10分未満。

既知の失敗、理由のない除外、未検証の必須根拠が1件でもあればrelease失敗とする。

## 14. Optional live-source smoke test

実際の週次運用時だけ、終了済みcontestに対して行う。

```bash
npm run abc:update -- --contest abcNNN
```

実行前確認:

- contestが終了している。
- 通常の個人通信環境である。
- robots/規約を確認できない場合に取得を停止する設計が有効。
- 同じcontestのupdateが実行中でない。

Expected:

- AtCoder向け同時接続1、1秒以上のrequest間隔、`Retry-After`優先。
- archive/tasks/task/editorial以外の禁止routeへアクセスしない。
- 生HTMLを永続保存しない。
- 候補または構造化hold reportを15分以内に返す。
- 有料APIのcredentialや契約を要求しない。

## 15. Optional GitHub mirror

公開repositoryを選択した場合だけ、同じscriptsをGitHub Actionsで実行し、GitHub Pagesへ静的成果物をmirrorできる。これはローカル必須経路の代替ではない。

確認事項:

- workflow actionをfull commit SHAで固定。
- token permissionを最小化。
- public repositoryのstandard runnerだけを利用。
- Pagesのproject base pathでE2Eを通す。
- site size/deploy durationの上限を監視。
- Pages利用時の公開性とvisitor IP取扱いを案内する。
