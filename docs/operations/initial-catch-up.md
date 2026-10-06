# 初回版の追加収録と受入証跡

Issue #52の対象は、固定した `2026-10-06T00:00:00+09:00`
までに終了したABC467〜478の36問。ABC212〜466の868問をseedとして、合計904問・266開催コンテストとABC316の公式欠番を扱う。

公式archiveの発見結果、公式問題・解説の正規化メタデータ、個別に書いた考察、Inventory、配置、authoring
packetを `staging/updates/initial-catch-up/` に保存する。生HTMLは私有キャッシュにのみ置く。ABC474
Gの偶奇条件は公式補足解説もSource
Revisionへ含める。robots・利用規約の指紋は既存と一致し、生成AIルールの現行指紋を照合した記録は
`policy-review.json` にある。

```bash
npm run abc:package-update -- --contest abc478
npm run abc:update -- --contest abc478
npm run release:catch-up -- --cutoff 2026-10-06T00:00:00+09:00
npm run verify:catch-up
```

package-updateは原稿を決定的に梱包する。abc:updateの通常モードは公式メタデータ・出典・凍結skill・本文のdigest・Inventoryのreview・配置を検査し、非fixtureのPublication
Updateを準備する。catch-upも同じ準備処理を通し、全transitionを検査してからcanonicalへ適用する。同じ入力の再実行は同じupdate
IDになる。既存ファイルが別の値なら上書きせず失敗する。缺けた本文やreview、変更された根拠を成功扱いしない。

既存のUnit本文・意味上の所有者・三つの独立DAG・直接の問題順は保持する。追加分は所有Outcomeからhomeを求め、既存順の末尾へ加える。単元内の追加問題リンクは共通ページで描画する。canonicalの旧868本文のshard検証と、新36本文の更新receipt検証を両方実施し、最終的な全件境界は904問のprojectionと公式問題順から再計算する。

```bash
npm run verify:catch-up-acceptance -- --commit <40桁の確定コミット>
npm run verify:initial-release -- --check
npm run verify:catch-up-evidence
```

acceptanceは指定commitをdetachした一時cloneでT133〜T142の全検査、補助指標、36追加問題のjoinを再実行する。seed・release-cutoff・設計上限の性能fixtureは別々の範囲を使う。その後、同じcloneの静的ページでSC-012を三ブラウザにより計測し、全904経路のcontrol構造と共通実装の指紋に結び付ける。元workspaceの入力が指定commitから変わった場合は証跡をコピーしない。

SC-012は `actorRole: automated_browser`、schema
1.2.0で、表示完了後の二操作・保存通知・実際のIndexedDB値・reload後の両状態と独立日時を記録する。人の読解・判断時間を計測したとは主張しない。試験は新しいブラウザcontextのみを使い、本人の学習DBを開かない。既存120レコードの値・日時が追加問題表示とCatalog読み込みで変わらないことも三ブラウザで検査する。

レビューinventoryはownerのIssue #48方針を引き継ぐ
`agent_quality_review`。通常scopeの選択はself、高リスクscopeの選択はthird_partyとして記録するが、人間による承認を代行・捏造しない。ABC478
Fの公式式の境界不整合、ABC467 E・476 F・478 Gの解法変形にはrisk reasonを固定する。ABC478
FはN≤7の全Prüfer木による探索順の分布と式を比較する。SC-009とSC-010は既存のowner廃止指示を維持し、回答や自己採点を作らない。

change-summaryはbootstrapと全12更新のID、904追加問題、固定cutoffを含む。Catalog.releaseはpreparedのまま、更新ページには初回版の収録内容を載せる。公開履歴は実際の公開commitだけを扱うため、今回published履歴や人間承認、production
deployを作らない。これらはIssue #53の範囲である。

証跡内のreleaseCommitは実際に検査した内容commit。証跡ファイル自身を後続commitで添付しても、実装・本文・受入入力digestがその内容commitと一致することを読み取り専用checkで再確認する。
