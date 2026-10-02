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

本文を技術的にレビューした後、証跡を更新する。各所有成果について、直接前提と本文だけで、用語の定義、保持する状態、初期化と更新、更新が正しい理由、値から問題の答えへ戻す規則を再構成できるか確認する。「不変量を示す」「境界を確認する」という指示だけでは、その技能を教えたことにならない。とくに縮約の最適値保存、ゲームの終了・勝敗規則、計数の同一視は、式と対応を本文で示す。構造検証やhashの更新だけで数学的な説明の完成とは判定しない。

さらに、モデルが許す頂点・重み・同一対象の扱いを先に固定し、概要・対象外・下位単元と追加本文の範囲を照合する。候補の削除や探索の停止には「これ以降必要にならない」理由を示し、双対性を所有する単元では等式だけでなく双方の解の対応と復元まで書く。約数・倍数や狭義・広義のように向きが変わる操作では、評価順と境界を一つずつ具体化する。レビューで同じ不足が見つかった場合は、その所有単元に加え直接前提・概念上の親・下位単元も読み直す。

複数成果を所有するUnitは成果を一つずつ本文の節へ対応させる。一つの代表算法の説明で他の成果まで満たしたとしない。各算法では添字と区間の規約、空状態からの初期化、全更新の具体式、停止、復元を固定し、その規則を小入力に適用できるか読み直す。とくに含意の向き、flowの収支符号、双対の更新方向、鏡像・反転の添字、重複の個数は全探索や直接計算と比較する。再利用する教材の目的はABCの解法名を覚えることではなく、より難しい未知問でも条件と証明から典型を組み立てられることである。

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
