# Documentation and evidence ownership

`docs/` は運用手順、事前固定したwork manifest、self/third-party
review、検証証跡を保存します。通常更新はmanifest ownerのself-reviewで完結し、外部person
IDを要求しません。固定した高リスク条件に該当する変更は原則third-party reviewとし、solo
maintainer理由を明示した場合だけrisk reasonを保持したself-reviewを許可します。

- `operations/`: local-only開発、週次更新、公開・rollback手順
- `work-manifests/`: 変更前に固定するscopeとlearning outcome review unit
- `reviews/human-content/`: self/third-partyのmode、reviewer、claim/example、outcome coverage、gate
  reviewの証跡
- `verification/`: command、fixture digest、raw result、aggregate result

証跡は対象digestと実行時刻を持ち、失敗結果を上書きせず新revisionとして追加します。機密情報、個人情報、生の公式HTMLは保存しません。
