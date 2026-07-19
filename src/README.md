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
- Catalog entityの正規所有pathは、構造化entityでは対応する`src/content/<collection>/`配下のstable
  IDをbasenameとするJSON（shard
  directoryは許可）、Explanation/LearningUnitではentityの`docPath`、Placementでは`src/content/policies/problem-placements.json`、CorrectionImpactでは`derivedIndexPaths`とする。1ファイルを複数entityが所有することを許し、その場合は同じbefore/after
  digestを持つoperationをentityごとに記録する。同じCatalog
  entityの一つの差分に複数pathが関係する場合も、対応するoperationは一つのPublicationUpdateにまとめる。

`staging/` から `src/content/`
への直接importは禁止です。公開候補は検証・review・承認・最終検証を経た処理だけが反映します。
