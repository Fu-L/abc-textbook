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

2026-10-07以降の実装開始点は[検証済み教材の先行公開](operations/deploy-before-catch-up.md)。ABC212〜466の868問を#53
→ #54で公開し、#52のcatch-upは公開後に実装します。PR
#70の904問向けprepared成果は初版の公開前提にしません。
