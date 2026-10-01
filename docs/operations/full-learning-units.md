# Full LearningUnit の編集と検証

Issue #46で、9章232単元をcanonical
skeletonから通常本文の執筆段階へ引き継いだ。本文の正本はLearningUnit JSONの `docPath`
が指すMarkdownである。

## 編集

`docs/work-manifests/initial/us2/full-learning-units/index.json`は編集前の所有範囲とmetadata
digestを記録する。各単元に一件の `manifest.json`
があり、構造単元も含む。metadata、直接所属、coverage、home、読む順は受理済みのtaxonomyを引き継ぐ。今後の本文訂正には新しい作業manifestを固定し、必要な検証記録を更新する。

canonical materializerは `full_authoring`
の文書を上書きしない。公開projectionへの切替はT160で行い、それまでは `draft: true` を保持する。

## 検証

```bash
npm run corpus:verify-learning-units
npm run verify:fast
```

検証器は実際のJSONとMarkdownを読み、accepted
taxonomy・独立した3つのDAG・意味階層・掲載順・色と理由・概念上の親・後の節や章の前提・問題順・内部導線・出典を検査する。本文の変更は
`learning-unit-content.json` のhash不一致で検出する。

本文を技術的にレビューした後、証跡を更新する。

```bash
npm run corpus:verify-learning-units:write
npm run corpus:verify-learning-units
```

`:write`は自動検査のprojectionを作る処理で、human
acceptanceを自動承認しない。数学的な主張の点検方針は
`docs/verification/bootstrap/full-learning-unit-prose-review.md`、受入状態は
`docs/verification/bootstrap/us2.json` を参照する。

SC-010の運用者本人による5位置self-studyは、Issue
#46実装中の運用者指示により対象外とした。導線は上記の全232単元の自動検査で検証する。手動回答や採点用の成果物は作成しない。
`LearnerOutcomeEvidenceSchema`もSC-010のprotocolとresultを必須にしない。過去の記録は互換性のため任意で受け入れる。
