# Phase 0 Research: ABC上級問題体系化教科書

**調査基準日**: 2026-07-12

**対象仕様**: [spec.md](./spec.md)

**結論**: 技術コンテキストの未解決事項はすべて解消した。

## 1. 対象範囲と再現可能な実行環境

**Decision**: 初期カタログの公開基準を2026-07-12（JST）とし、終了済みのABC 212〜466、255コンテスト、E〜Hの最大1,020セルを対象にする。実行環境はNode.js 24 LTS、TypeScript 6.x strict/ESM、npm 11.xとし、実装開始時のNode 24メンテナンス版と全npm依存を`.nvmrc`/`engines`/`package-lock.json`で固定する。ローカルとCIはともに`npm ci`を使う。

**Rationale**: [ABC 466公式ページ](https://atcoder.jp/contests/abc466?lang=ja)では終了が2026-07-11 22:40 JSTであり、計画日の最新終了済みABCである。[Node.jsのリリース一覧](https://nodejs.org/en/about/previous-releases)ではNode 24がLTS、Node 26がCurrentであり、長期運用にはLTSが適する。`package-lock.json`と[`npm ci`](https://docs.npmjs.com/cli/v11/commands/npm-ci/)は依存木を固定し、manifestとlockの不一致を失敗にできる。

**Alternatives considered**:

- Node 26 Current: 長期保守の基準にせず不採用。
- pnpm: 技術的には利用可能だが、単一プロジェクトではNode同梱のnpmより追加管理の利益が小さいため不採用。
- パッチ版を固定しない通常の`npm install`: 実行時期による差を生むため不採用。

## 2. 静的教材フロントエンド

**Decision**: Astro 7.xとStarlight 0.41.xを完全版固定で採用し、Astro既定の静的出力を使う。章・問題本文、目次、前後ナビゲーション、コード表示、全文検索はStarlightを基盤にし、コンテスト表、タグ索引、問題一覧、要復習一覧はStarlightのレイアウトを使うカスタムAstroページにする。React等の全面的クライアントフレームワークやSSRアダプターは導入せず、学習記録と絞り込みだけを素のTypeScriptで段階的に有効化する。

**Rationale**: [Astro 7の公式リリース](https://astro.build/blog/astro-7/)はMarkdown中心の大規模静的ビルドを高速化し、Astroはルートを既定でプリレンダリングする。Starlightは教材に必要な標準UI、日本語表示、カスタムページを提供する（[custom pages](https://starlight.astro.build/ja/guides/pages/)、[i18n](https://starlight.astro.build/ja/guides/i18n/)）。既存基盤を利用する方が、ナビゲーションとアクセシビリティを一から保守する範囲を減らせる。Astro/Starlightの依存更新は教材更新と分離して検証する。

**Alternatives considered**:

- 素のAstroのみ: 実現可能だが、目次、章ナビ、検索UI、コード表示の保守量が増える。
- Next.js/React SPA: 全面ハイドレーション、サーバー機能、状態管理層が本要件には過剰。
- Docusaurus: 教材用途には合うが、Astro Content Collectionsとカスタム静的索引を同じ型・生成経路で扱う構成ではAstro/Starlightが直接的。
- 常時稼働SSR: 無料・1人用・静的公開という制約に反する。

## 3. コンテンツ正本とスキーマ

**Decision**: 構造化エンティティは1項目1ファイルの決定的なJSON、本文は通常Markdown、再利用可能な教材コンポーネントが必要な箇所だけallowlist制限付きMDXとする。Astro build-time Content Collectionsを唯一の読込層にし、Starlightの`docsSchema({ extend })`、Zod 4、collection `reference()`で項目と直接参照を検証する。Zodを実装上の正本とし、JSON Schema Draft 2020-12契約を生成してAjv 8 strictによる契約テストを行う。

**Rationale**: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)はMarkdown/MDX/JSONのビルド時読込、Zod検証、TypeScript型生成を提供し、[`reference()`](https://docs.astro.build/en/guides/content-collections/#defining-collection-references)で参照先の存在も検査できる。[Starlight frontmatter schema](https://starlight.astro.build/ja/reference/frontmatter/)は教材固有フィールドを拡張できる。JSONは更新CLIの安定出力と差分レビューに向き、Markdownは生成本文を不要な実行コードから分離できる。

スキーマだけで表現できない次の制約は、共有TypeScript意味検証器で確認する。

- ID、コンテスト×スロット、別名、索引の一意性
- タグ木、タグ前提DAG、学習単位木、学習単位前提DAGの参照・非循環性
- 決定的な全体学習順と全問題の到達可能性
- E〜H全セルの存在/掲載状態
- 解説の必須区分、根拠、例、skill版、レビュー
- 更新の冪等性と内部リンク

**Alternatives considered**:

- 全ページMDX: 任意import/式が増え、機械生成、レビュー、移植性を悪化させる。
- Markdownのみ: コーチ助言、検証例、関連問題などの一貫したアクセシブル部品を再利用しにくい。
- YAML中心: 手書きしやすいが暗黙型と表記揺れが増える。
- CMS/live collection/公開SQLite: 外部サービスまたは実行時サーバーを必要とし、更新頻度に対して過剰。

## 4. 個人学習記録

**Decision**: 個人状態は`idb`を使うIndexedDBの`learningRecords` object storeへ保存し、安定した`problemId`を主キーにする。状態、状態更新日時、要復習、要復習更新日時を同じレコード内の独立フィールドにし、各操作は対応する値と日時だけを1トランザクションで更新する。レコード不在は「未着手・要復習なし・両日時なし」と解釈し、新規教材追加時に全問題分を挿入しない。

保存値はUTCのRFC 3339日時、表示は`<time datetime>`とローカル日時・UTCオフセット・IANAタイムゾーン名を併記する。DB schema versionと移行、`navigator.storage.persist()`の案内、版付きJSON export/import、保存失敗のテキスト通知を必須にする。

**Rationale**: [IndexedDB](https://www.w3.org/TR/IndexedDB/)は構造化オブジェクト、索引、schema version、read/write transactionを持つため、将来の1,500問題規模でも状態と日時を安全に扱える。章やタグではなく不変の問題IDに結び付けると、教材再編時も記録が残る。ブラウザー保存はorigin単位で消去される可能性があるため、[Storage Standard](https://storage.spec.whatwg.org/)に沿った永続化要求と利用者主導バックアップで補う。

**Alternatives considered**:

- `localStorage`: 小規模なら可能だが、同期API、文字列値、複数値のトランザクションとschema移行の弱さから不採用。
- サーバーDB: アカウント、認証、同期、継続運用が初期範囲を超える。
- Cookie/直接ファイル: 自動保存の標準経路として不適切。ファイルは明示的なバックアップ用途だけに使う。

## 5. 検索と複合絞り込み

**Decision**: 本文・問題名・タグ・章の全文検索はStarlight標準のPagefindに任せる。ビルド時に`problem-catalog.json`を正本データから生成し、コンテスト、スロット、タグ、章などの静的属性と、IndexedDBから読み出した端末固有状態を`problemId`で結合して問題一覧と要復習一覧を絞り込む。

**Rationale**: [Pagefind](https://pagefind.app/)は生成済み静的HTMLから検索索引を作り、検索サーバーなしで配信できる。[多言語検索](https://pagefind.app/docs/multilingual/)は`lang="ja"`の日本語処理に対応する。端末ごとに変化する「修了」「要復習」を静的索引へ混ぜないことで、再ビルドなしに状態を即時反映できる。

**Alternatives considered**:

- Lunr/Fuse.js: 全文データの初期転送とブラウザー内索引化が教材増加時に重くなる。
- Algolia等のホスト検索: 外部アカウントと無料枠に必須機能を依存させる。
- 自作日本語全文検索: 分かち書き、ランキング、索引分割の保守範囲が大きい。

## 6. AtCoder公式情報の取得

**Decision**: Node.js 24の`fetch`とCheerioを使うローカルCLIで、各更新前にrobots、利用規約、生成AIルールを確認し、次の公式公開HTMLだけを直列取得する。

1. [過去コンテスト一覧](https://atcoder.jp/contests/archive?lang=ja)
2. 対象コンテストの終了日時
3. 公式タスク一覧
4. 実在するE〜Hの各問題ページ
5. 公式解説一覧と公式と明示された解説

問題URLは命名規則で推測せず、タスク一覧の`href`を採用する。E〜Hにないスロットは、タスク一覧を正常解析できた場合だけ`OFFICIAL_ABSENT`と確定する。構造変更や取得失敗時は`UNKNOWN`/`PARSER_DRIFT`で保留する。開催終了前は候補生成を開始しない。

**Rationale**: [AtCoder Problemsの公式紹介](https://info.atcoder.jp/more/contents/problems)でも同サービス/APIは非公式であるため、網羅性と根拠の正本にしない。公式の[ABC 212タスク一覧](https://atcoder.jp/contests/abc212/tasks?lang=ja)と[解説一覧](https://atcoder.jp/contests/abc212/editorial?lang=ja)から、存在する問題と公式解説を判別できる。終了判定は開催中の生成AI利用を避ける独立ゲートでもある（[AtCoder生成AIルール](https://info.atcoder.jp/entry/llm-rules-ja)）。

**Alternatives considered**:

- AtCoder Problems APIを主取得元にする: 非公式依存のため不採用。将来、難易度の補助根拠に使う場合も公式情報と区別する。
- URL規則からE〜Hを生成する: 特殊構成・将来変更を誤判定する。
- ブラウザー自動化や印刷ページ一括取得: 依存・負荷・不要な転載対象を増やす。

## 7. robots、負荷制御、生HTML、著作権

**Decision**: AtCoder向け接続は同時1、開始間隔1秒以上＋小さなジッター、1リクエスト約20秒timeoutとする。429/503/一時ネットワーク障害だけを限定再試行し、`Retry-After`を優先、なければ2/4/8/16秒程度の指数バックオフを使う。robotsを取得できない、禁止される、規約指紋が変わる、または上限に達した場合は取得を停止し、構造化保留理由を出す。standings、submissions、clarifications等の禁止経路へアクセスしない。

AtCoder生HTMLはリポジトリや恒久キャッシュへ保存せず、実行中メモリで解析後に破棄する。保存するのは公式URL、種別、言語、確認日時、HTTP状態、独自に正規化した最小メタデータ、SHA-256指紋、改訂関係だけとする。公開教材は公式ページへの参照と独自説明を基本にし、問題文、公式解説、公式コードを転載しない。制約は構造化値、概要は独自要約、例は原則独自作成とする。

**Rationale**: AtCoderは[連続アクセス制限を公式告知](https://atcoder.jp/posts/1027?lang=ja)している。[RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)と[RFC 9110 Retry-After](https://www.rfc-editor.org/rfc/rfc9110.html#name-retry-after)に従い、取得不能時は安全側へ倒す。[AtCoder利用規約](https://atcoder.jp/tos?lang=ja)ではサイトの文章・画像・プログラム等の権利がAtCoderまたは権利者に帰属するため、包括的な転載許諾があると推定しない。この方針は保守的な設計判断であり、法的助言ではない。

**Alternatives considered**:

- 並列取得/毎週全履歴巡回: 小さな時間短縮に対して負荷と制限リスクが高い。
- 生HTMLをGit保存: キャッシュ指示、著作権、リポジトリ肥大化の観点で不採用。
- 公式問題文・解説の全文掲載: 教材価値を独自解説へ置き、転載しない。

## 8. 冪等更新、状態機械、原子的公開

**Decision**: 自然キーと入力指紋でupsertする。

- Problem: `(contestSlug, slot)`
- SourceRevision: `(canonicalUrl, normalizedFingerprint)`
- ExplanationCandidate: `(problemId, sourceSetFingerprint, taxonomyVersion, skillName, skillVersion, skillDigest)`
- PublicationUpdate: `(contestSlug, sourceSetFingerprint)`

同一入力の再実行では現在候補を増殖させず、出典、taxonomy、skillの変更または明示的再生成時だけ新revisionを作る。更新CLIは単一ライターロックを取り、`staging/updates/<updateId>/`へ作業し、全体検証・外部レビュー・管理者承認後だけ公開manifestと`src/content/`を一つの更新として切り替える。

PublicationUpdateの主状態は次とする。

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

任意の未公開状態から`ON_HOLD`へ移れ、`resumeStage`、理由コード、詳細、再試行条件を必須にする。公開済み根拠の変更は直接上書きせず、`CORRECTION`更新として影響範囲を列挙し、再レビュー後に置き換える。

**Rationale**: 入力指紋と安定IDが重複問題・解説・索引を防ぎ、ステージングと公開manifestが部分公開を防ぐ。保留を再開可能な状態にすると、公式解説待ち、robots/規約変更、parser drift、生成器不在を同じ監査可能な仕組みで扱える。

**Alternatives considered**:

- 実行ごとの新候補ID: 差分ノイズと重複を生む。
- `draft/published`だけの2状態: 根拠不足、レビュー差し戻し、訂正を追跡できない。
- 公開ファイルの直接上書き/部分公開: 監査証跡と索引整合性を失う。

## 9. 専用解説生成skillと無料フォールバック

**Decision**: `prompt.md`は初期移行元に限定し、`.agents/skills/abc-explanation-author/SKILL.md`を唯一の正本にする。skillはsemantic versionと内容digest、対象学習者、必須入力、必須3区分、正当性、計算量、制約整合、独自例、実装注意、主張と出典ID、転載禁止、品質チェック、出力テンプレートを自己完結して定義する。各解説はskill名・版・digest・入力指紋を記録する。

CLIは公式情報から`AuthoringPacket`と手動執筆テンプレートを生成するが、有料・従量課金APIを呼ばない。利用可能なエージェントまたは端末内モデルは任意の加速経路とし、必須の無料経路は同じskill契約に従う手動執筆とする。生成器がない/時間内に終わらない場合も、問題情報、出典、分類・配置候補、空の必須区分、`AUTHORING_REQUIRED`という具体的保留理由を一操作で出す。

**Rationale**: Node CLIと特定AIランタイムを密結合しないことで、取得・生成・検証を独立テストできる。手動経路があればSC-014の追加費用0円を実証でき、AI不在時に課金先へ自動移行しない。版とdigestにより`prompt.md`なしの再現性とskill内容の誤変更を追跡できる。

**Alternatives considered**:

- `prompt.md`をCLIから読む: FR-024/SC-015に反する。
- OpenAI等の有料API/無料クラウドAIを必須化: FR-032/SC-014と長期安定性に反する。
- ローカルLLMだけを必須化: 個人機器のメモリ・速度を保証できない。
- 生成失敗時の不完全本文公開: 憲章の公開ゲートに反する。

## 10. 品質ゲートとテスト

**Decision**: 同じnpm scriptsをローカルと任意CIから呼ぶ二段ゲートにする。

- `npm run verify:fast`: 型検査、Zod/JSON Schema、参照/DAG/網羅性、Vitest、静的build、内部リンク、主要Chromium E2E、変更ページaxe。
- `npm run verify:release`: fast一式、外部公式リンク、全生成ルートaxe、Chromium/Firefox/WebKit E2E、クリーン環境での二重build SHA-256比較、手動レビュー記録の検査。

Linkinatorは生成済み`dist/`の内部リンク/fragmentと外部リンクを分離して検査する。403、timeout、bot protection等の未確定結果を成功扱いせず、必須出典なら手動確認記録か公開保留にする。循環検出は`tag-a -> tag-b -> tag-a`のように経路を報告する。自動判定不能な技術的主張・例は、authorと異なるreviewerの記録を必須にする。

**Rationale**: 速い更新フィードバックと完全な公開検証を分けると、15分目標とconstitutionの厳格な公開禁止条件を両立できる。[Vitest](https://vitest.dev/guide/)、[Playwright webServer](https://playwright.dev/docs/test-webserver)、[Linkinator](https://github.com/JustinBeckwith/linkinator)はいずれもnpm lock内へ固定できる。production buildをE2E対象にすることで実公開URL・base path・保存状態を検証できる。

**Alternatives considered**:

- 全検査を毎編集時に実行: フィードバックが遅い。
- CIだけに検査ロジックを置く: ローカル必須経路を失う。
- Lighthouse/axeだけ: 状態操作、内容正確性、手動でしか判別できないアクセシビリティを保証しない。

## 11. アクセシビリティ基準

**Decision**: [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/)を公開基準にする。ページ言語を日本語にし、コンテスト表は`table`、`caption`、`thead`、`th scope`を保った横スクロールと代替一覧を用意する。状態操作にはラベル付き`select`/checkbox/buttonを使い、保存結果を`aria-live`で通知する。状態は色だけでなく「未着手」「挑戦中」「修了」「要復習」「公式問題なし」「公開保留」等の可視テキストで示す。

自動axe検査に加え、キーボード、focus、200〜400%リフロー、reduced motion、コントラスト、表の読み上げ、日本語スクリーンリーダー、日時の理解を手動確認する。

**Rationale**: [Playwrightのアクセシビリティ指針](https://playwright.dev/docs/accessibility-testing)も、自動検査は一部の問題しか検出できないため手動評価との併用を推奨する。ネイティブHTMLを優先すると独自ARIA grid/formを再実装せずに意味構造を保てる。

**Alternatives considered**:

- `div`仮想グリッド/独自ARIA select: この規模では読み上げ・キーボード契約を再実装する不利益が大きい。
- 自動axe違反0件だけを適合条件にする: 内容や操作の問題を見逃す。

## 12. 継続費用0円の実行・公開経路

**Decision**: 更新、検証、静的build、ローカルHTTP previewを必須経路にし、外部サービスなしで完結させる。GitHub ActionsとGitHub Pagesは、リポジトリを公開できる場合だけ任意の無料CI/公開ミラーとして使う。外部Webフォント、解析サービス、有料ドメイン、ホスト型検索を必須にしない。

**Rationale**: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)はGitHub Freeの公開リポジトリで利用でき、[公開リポジトリの標準Actions runner](https://docs.github.com/en/billing/concepts/product-billing/github-actions)は無料である。一方、private Pagesや枠超過は費用0円を保証しないため、GitHubを唯一の必須経路にしない。任意Pagesでは1GB/10分等の[公式制限](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)を監視する。

**Alternatives considered**:

- private Pages/Actions無料枠への恒久依存: 料金・枠・可視性条件を必須経路へ持ち込む。
- Cloudflare等の無料枠: 代替先にはできるが、特定事業者の無料条件を前提にしない。
- 自宅サーバー: 常時稼働と保守が必要。

## 13. 15分の週次更新目標

**Decision**: 単一開始操作を`npm run abc:update -- --contest abcNNN`に集約し、単調時計で各段階と総時間を記録する。終了/robots/規約確認、公式情報取得、指紋差分、実在問題の候補パケット、タグ/配置候補、fast検証、問題別レポートを順に行う。内部deadlineを14分前後に設定し、外部取得・生成・検証が完了しない場合も15分を越えて待たず、失敗段階、理由コード、再試行条件を持つ保留結果を出す。

レビュー、管理者承認、release検証、公開は候補準備15分に含めない。通常更新、差分0再実行、公式解説待ち、robots/通信timeout、parser driftのfixtureを基準機で計測し、すべて15分以内に候補または保留レポートへ到達することを受入条件にする。

**Rationale**: SC-006は自動公開ではなく「候補または具体的な保留理由」の確認を要求する。deadline、差分処理、限定再試行により外部障害でも一操作が無期限停止しない。

**Alternatives considered**:

- 毎週の全教材再生成/全過去ページ巡回: 低負荷と15分目標を両立しにくい。
- 無制限retry: 完了時間を保証できない。
- 自動公開: 外部レビューと管理者承認の憲章ゲートに反する。
