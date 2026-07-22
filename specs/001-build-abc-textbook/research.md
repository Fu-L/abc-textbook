# Research: ABC上級問題体系化教科書

**Updated**: 2026-07-19

## 1. 公開範囲と実行環境

**Decision**: 2026-07-12時点で終了済みのABC 212〜466を初期制作seedにし、初版直前に`cutoffAt`を固定してその時点の最新終了済みABCまで追随する。実行環境はNode.js 24 LTS（`>=24.18.0 <25.0.0`）とnpm 11（`>=11.16.0 <12.0.0`）を対応範囲とする。`.nvmrc`と`packageManager`にはリリース基準版のNode.js 24.18.0/npm 11.16.0を残し、TypeScript 6.xと全依存はlockfileで完全版を固定する。

**Rationale**: [ABC 466公式ページ](https://atcoder.jp/contests/abc466?lang=ja)は2026-07-11に終了しており、調査時点の最新終了済みABCである。公開までに新しいABCが終了し得るため、制作seedと公開上限を分ける必要がある。[Node.js release一覧](https://nodejs.org/en/about/previous-releases)ではNode 24がLTSであり、長期保守に適する。patch完全一致を`npm run`の条件にすると、同じLTS major内の更新で通常開発が止まるため、対応範囲内のpatch更新を許可する。一方、依存木とリリース証跡の再現性は、基準版CIと`npm ci`によるlockfile検査で維持する。

**Alternatives considered**:

- ABC 466を恒久的な公開上限にする: 「ABC212以降」の継続範囲を満たさないため不採用。
- Current版Nodeを基準にする: 更新頻度が高く再現性が落ちるため不採用。Node 24 LTSの対応範囲を明示し、CIでは基準版とローリング版を分ける。
- 開発環境もpatch完全一致にする: 同じLTS major内のセキュリティ・保守更新を妨げるため不採用。リリース基準版と対応範囲を別々に記録する。

## 2. 「E問題以上」の判定

**Decision**: 対象問題をE/F/G/Hの固定enumで判定せず、各ABCの公式問題一覧におけるtask orderでDの後に並ぶすべての競技問題と定義する。Contestは公式problem labelと順序を保存し、公開版は対象Contestのadvanced labelを安定統合したslot registryを持つ。

**Rationale**: 現在のABCは回によってGまで、Hまでなど問題数が異なり、将来の記号体系も固定できない。ユーザーの「E問題以上」は難易度帯の境界を表しており、4文字の列挙に縮めるべきではない。公式task orderなら`I`その他の新labelや非単純なlabelにも対応できる。

**Alternatives considered**:

- E〜Hを固定する: 将来I以降が出た場合に中核要件の全問題収録を破るため不採用。
- labelの辞書順でE以上を判定する: `Ex`等の複数文字labelや将来形式を誤分類し得るため不採用。
- 点数やdifficulty値で判定する: 公式slotの意味と一致せず、値が未確定の回もあるため不採用。

## 3. 静的教材と表示基盤

**Decision**: Astro 7.xとStarlight 0.41.xを完全版固定で採用し、静的出力を使う。本文、章ナビゲーション、目次、コード表示、全文検索はStarlightを基盤にし、contest表、タグ索引、問題一覧、要復習一覧は同じレイアウト上のcustom pageにする。学習記録と絞り込みだけを小さなclient-side TypeScriptで段階的に有効化する。

**Rationale**: 教材本文は静的生成と相性がよく、常時backendやhosting契約を不要にできる。Starlightはdocumentation向けの標準navigation、i18n、accessibleな基本構造を提供する。静的本文はJavaScriptが無効でも読める。

**Alternatives considered**:

- SSR/常時backend: 1人用のlocal-first要件に対して費用と運用が増えるため不採用。
- 全面client framework: 学習記録以外の本文閲覧までJavaScriptへ依存させる利益がないため不採用。
- 素のHTMLを全て手作りする: navigationとaccessibilityの保守範囲が増えるため不採用。

## 4. 正本データとschema ownership

**Decision**: 構造化entityは決定的なJSON、本文はMarkdown、必要箇所だけallowlist制限付きMDXとする。Zod shapeは`src/lib/domain/schema-parts/`のcatalog、learning、release、review-evidence、verification-evidenceだけが定義し、`schemas.ts`と`index.ts`は再exportに限定する。JSON Schemaはこのshapeから生成する。

**Rationale**: JSONは更新CLIの安定出力と差分reviewに向き、Markdownは教材本文の編集に向く。domain別にshape fileを分割すると巨大な単一fileを避けられる一方、owner directoryとpublic aggregatorを固定すれば二重正本にならない。

**Alternatives considered**:

- `schemas.ts`一fileへ全shapeを置く: 所有者は明確だが規模拡大でreviewが困難になるため不採用。
- JSON SchemaとZodを別々に手書きする: driftを生むため不採用。
- 本文frontmatterへTag/Outcome objectを複製する: taxonomy訂正時に不整合を生むため不採用。

## 5. 全コーパス横断の典型体系

**Decision**: 初期content制作は、Foundational完了後に小さなprivate vertical previewを先に一周させ、その後に全公式metadata、全ProblemのTechnique Inventory、corpus-wide taxonomy、Problem Placement、Outcome/Problem shard単位の解説、Learning Unit本文を進める。previewのTag/Outcome/Unitはstaging namespaceの仮taxonomyに限り、公開正本へ直接昇格させない。Technique Inventoryは主解法、証明着眼点、計算量、必要前提、実装注意、候補成果をProblemごとに保持し、最終TagとUnitは全inventoryを比較して統合・分割する。

**Rationale**: 全コーパスを完成させる前に代表的な複数分野・複数Contest・複数labelの経路を実データで検証すれば、schema、前提、UI、学習記録、更新CLIの設計欠陥を早期に発見できる。一方、Contest番号batchごとに仮Tag/Unitを公開正本へ作って後から統合すると、同義Tag、問題一問だけのUnit、重複説明が残る。previewはstagingに閉じ、最終TagとUnitは全inventoryから再計算し、promote/merge/split/retireの対応表と影響範囲をレビューすることで、早期検証とcorpus-wide体系化を両立する。

**Alternatives considered**:

- Problem解説を全て`full`で先に書き、後でtaxonomy化する: 大量の重複執筆と再配置を生むため不採用。
- Contest範囲を章境界にする: 年代と学習依存が一致しないため不採用。
- AI clusteringだけで正式化する: 根拠、前提、教育的順序を検証できないため不採用。
- previewの仮taxonomyをそのまま公開taxonomyへコピーする: 全コーパスでの同義・分割・前提検証を飛ばし、final releaseの網羅性と保守性を損なうため不採用。

## 6. 学習記録

**Decision**: IndexedDBにproblem IDを主keyとして、status、needsReview、各更新日時を保存する。教材正本とは分離し、schema migration、transaction、versioned JSON export/importを用意する。本文閲覧はstorage失敗時も維持する。

**Rationale**: 1,500問題規模の構造化recordと原子的更新に適し、server/accountを不要にできる。Problem IDへ結び付ければTagや章の再編後も記録が残る。browser storage消去へは利用者主導backupで備える。

**Alternatives considered**:

- localStorage: transactionと大量recordの構造化管理が弱いため不採用。
- Git管理の進捗file: browser利用のたびにrepository操作が必要になるため不採用。
- remote database: account、backend、同期、費用がscope外のため不採用。

## 7. 公式情報の取得

**Decision**: Nodeの`fetch`とCheerioを使うlocal CLIで、AtCoder公式hostのarchive、contest task list、task page、editorial pageだけを直列取得する。User-Agent、1接続、開始間隔、retry、deadline、robots・利用規約・生成AI ruleの確認fingerprintを持ち、policy変更やparser driftでは保留する。生HTMLは正本へ保存しない。

**Rationale**: 公式情報を第一根拠にしながら、過負荷と無断転載を避けられる。取得とparsingをinterface分離すれば、offline fixtureで同じ処理を検証できる。

**Alternatives considered**:

- unofficial APIだけへ依存する: 欠落・規約・継続性を制御できないため不採用。
- browser automationで大量取得する: 負荷と保守が増えるため不採用。
- 公式本文HTMLをrepositoryへ保存する: 転載範囲が広がるため不採用。

## 8. 解説生成skill

**Decision**: root `prompt.md`は移行元に限定し、`.agents/skills/abc-explanation-author/SKILL.md`を唯一の正本にする。skillはversion、digest、対象学習者、入力、必須出力、転載禁止、品質確認、templateを自己完結して定義する。生成器は任意であり、利用不能ならpacketと手動templateを作って`authoring_required`で保留する。

**Rationale**: 取得・執筆・検証を分離し、特定AI runtimeや有料APIへ必須依存しない。skill版とinput fingerprintを残せば、文章のbyte一致ではなく品質contractへの適合を再検証できる。

**Alternatives considered**:

- root promptを直接読む: 再利用性、版管理、入力契約が弱いため不採用。
- 特定model APIを必須化する: 追加費用0円を満たさないため不採用。
- packetだけで完成扱いする: 教材価値を持つ本文がないため不採用。

## 9. Gitベースの更新と公開

**Decision**: `abc:update`は終了確認、advanced slot抽出、source、差分、分類候補、authoring result、fast validationを一操作で実行し、15分以内に完成、要執筆、保留をProblemごとに返す。全Problem完成かつblocking 0のupdateだけをreleaseへ入れる。自動検査と必要な人間reviewをprotected mainのmerge条件へ集約し、merge済みのfull Git commitを唯一のrelease snapshot IDとして静的hostへdeployする。rollbackは既知のrelease commitの再deployとする。

**Rationale**: 一操作を「無人公開」ではなく「更新準備開始」と定義すると、週次の操作量を減らしつつ憲章のreview gateを守れる。Git commit/tree、required checks、静的hostのdeploy履歴を再利用すれば、独自candidate state、複数digest、自己承認、receipt transactionを保守せずに同じ安全性を得られる。

**Alternatives considered**:

- Problemごとに即時公開する: taxonomy・indexの部分不整合を生むため不採用。
- owner approval artifactだけで品質検査を代替する: 憲章違反かつ単一管理者のmerge操作と重複するため不採用。
- local filesystem上の独自atomic switchを必須化する: 現行の静的hostと責務が重複するため不採用。必要になった場合だけdeployment adapterとして追加する。
- 必須LLM judge panelや独立auditorを追加する: 統治中の憲章が要求せず、1人運用の負担を過度に増やすため不採用。

## 10. Review evidence

**Decision**: 一つのlogical changeを明示file inventory、Learning Outcome、review risk policyで固定する。通常更新は管理者がoutcome coverageをself-reviewし、全適用自動checkを自ら実行する。公式根拠との矛盾・独自証明・重大な分類変更を含む高リスク更新だけはself-reviewに代えて`third_party` modeとし、author外reviewerを要求する。check result、review mode、review item、finding解消を同じsubject digestへ結び付ける。

**Rationale**: 一人の運用者が通常更新を追加調整なしで完結できる一方、事前定義した高リスク条件では第三者の異なる視点を強制できる。modeとrisk policyをdigestへ束ねることで、自己reviewを第三者reviewと誤表示せず、複数の重複panelやrole registryを増やさずに正確性と成果被覆を監査できる。

**Alternatives considered**:

- CI結果の追認だけをreviewer実行とする: reviewer本人のcheck実行とならず、self/third-partyいずれのmodeでも不採用。
- 通常更新も外部reviewer必須とする: 一人用の週次更新へ第三者可用性を持ち込み、Issue #10のSLA要件に反するため不採用。
- 高リスク条件を自由記述だけで判定する: 条件が再現不能になり、third-party gateを回避できるため不採用。
- external learner cohortをpublication gateにする: 1人用の初期製品に継続的な外部調整を持ち込むため不採用。

## 11. Accessibilityとbrowser検証

**Decision**: semantic HTML、skip link、landmark、caption、header、keyboard/focus、320 CSS px reflow、200/400% zoom、reduced motion、contrast、text badge、代替一覧を検証する。自動E2Eはlockfile固定のPlaywright Chromium/Firefox/WebKitを使い、実browser名との同一性は主張しない。

**Rationale**: 追加費用なく主要engine差を再現できる。静的教材なので標準準拠とprogressive enhancementを優先し、特定時点の8 browser/OS組合せを必須証跡にするより持続可能である。

**Alternatives considered**:

- axeだけで完了とする: keyboard、reflow、内容明瞭性を十分に検査できないため不採用。
- Chrome/Edge/Firefox/Safariの最新・一つ前を毎release手動検証する: 単独運用の必須負担として過大なため不採用。
- JavaScript必須表示: 本文閲覧までstorage/client障害へ巻き込むため不採用。

## 12. 性能と追加費用0円

**Decision**: fixed seedの255 Contest fixture、実release snapshot、1,500 Problem・500 Tag・1,000 Unit fixtureを同じ基準環境で測定する。必須外部依存をinventory化し、有料API、従量課金、常時backend、credential、account、remote syncを必須経路から拒否する。52週fixtureで更新からbackupまでを模擬する。

**Rationale**: 現在規模だけでなく継続追加後の余裕を測れ、無料という要件をサービス名ではなく必須依存の性質で検査できる。

**Alternatives considered**:

- 実データ一回だけの測定: 回帰と設計上限を示せないため不採用。
- 無料tierのhost/APIを必須にする: 料金改定やquotaで必須経路が壊れるため不採用。
- 3 OSのnative publish証跡を毎release必須にする: 個人所有の実行機器というscopeを越えるため不採用。
