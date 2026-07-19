# Source ownership

`src/`
は公開される静的教材、共有domain、表示部品、ローカルCLIから再利用する処理の正本です。未承認の候補データは置きません。

- `content.config.ts` はAstro/Starlightのloader境界だけを所有します。entity fieldの正本はPhase 2で
  `lib/domain/schema-parts/` に定義し、このfileへ複製しません。
- `content/docs/` は公開本文、その他の `content/` 配下は公開用の構造化JSONです。
- `lib/domain/` はschemaと不変条件、`lib/catalog/` は派生catalog、 `lib/learning-records/`
  は端末内記録、`lib/validation/` はfail-closed検証を所有します。
- `components/`, `layouts/`, `pages/`, `styles/` は表示責務だけを持ち、canonical
  dataを再定義しません。
- Publication operationはentityの状態遷移ではなく、trustedなbase/current
  inventoryから導出した実ファイル遷移をcanonical
  pathごとに1件だけ記録する。`entityType`と`entityId`はそのpathの所有権を検証するanchorであり、問題を持たないContestSlotには`contest-slot-<contest>-<lowercase-label>`を使う。Catalog
  projectionのadd/replace/removeはファイル遷移と独立に比較し、各差分が所有する変更pathへ関連付ける。共有Markdownでは1件のファイル遷移に複数のCatalog差分を関連付けられるが、本文だけの変更から無関係なentity差分を合成しない。同じentity差分に必要な複数pathは一つのPublicationUpdateへまとめる。

`staging/` から `src/content/`
への直接importは禁止です。公開候補は検証・review・承認・最終検証を経た処理だけが反映します。
