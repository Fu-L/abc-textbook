# 全Problem本文の統合受入

Issue #48（T072–T078）は、凍結済みindexの248 shard・868問をjoinし、232
Unitの受理済み体系と照合する。正本はProblemごとのMarkdownと既存のtaxonomyであり、統合証跡はその投影である。追加CLIは、本文の修正後に古い検査・配置・coverageを受け入れないために置く。

```bash
npm run corpus:verify-problem-corpus
npm run corpus:verify-problem-corpus:write
npm run verify:fast
```

通常の検証は読み取り専用。`--write`
は検証がすべて成功した後に統合証跡だけを更新する。個別shard、凍結index、taxonomy、Unit、Problem本文は編集しない。CLIは既存の個別shard検証とUnit検証を先に実行し、各shardの現在のsubjectを再計算してから全件集合をjoinする。

## 受入の根拠

本文の考察・正当性・実装注意・復習・計算量を点検したPR
#65の21回の補修記録と、20本の独立数学回帰scriptを使う。回帰scriptは毎回実行し、入力の列挙・別DP・元操作のシミュレーションとの比較結果とscript
digestを保存する。小入力での一致は一般の証明を代替しない。一般の仮定・境界・全処理の費用は各本文と追跡可能な補修記録にある。

統合時には全Problemの出典・skill、Claimと本文の一致、local
key、独立節の不在、未登録の実行コード、転載の追加、例・演習inventory、重複・孤児・所有パスを確認する。用語集の版とdigestもsubjectへ結び付ける。個別shardの検査はリンク、静的HTML構造、原典付き入力packetも再検証する。用語の説明品質・数学的な妥当性を文字列検査だけで合格と主張しない。

全Problemの配置は`full`。非fullは0件なので比較審査の実行対象はない。将来non-fullを追加した場合は、algorithm、proof、complexity、constraints、prerequisites、implementation、learning_outcomesの再評価が済むまでCLIを通さない。同じUnit/tagであることは省略の根拠にならない。

現在の本文は独立した例・演習を持たない。考察中の`text`
fenceは疑似コードであり、架空の実行結果を作らない。例・解答検査はownerごとに理由付き`not_applicable`。実行例を加える場合は、その宣言環境・入力・手順・期待結果・観測結果・digestを実測した検証経路が必要であり、空inventoryの証跡を流用しない。

## 運用者指示による受入条件の変更

Issue
#48の実装中、運用者は「個人用教材として本人の自己評価・承認ゲートを今回の要件から外し、本文の品質と全件検証で受け入れる」と指定した。SC-009の自己学習評価は`not_required_by_owner`とし、回答・採点・合格率を生成しない。T074/T078は`agent_quality_review`で記録する。これは本人のself
reviewや第三者のapprovalではない。

既存のshard
review/snapshotは当時の本人レビュー待ちを保持する。新しい受入は現在のsubjectに結び付いた別の記録であり、旧記録の状態を書き換えない。独自証明・公式との不一致のrisk
reason、原典のrevision、追加照合も新しいshard記録へ引き継ぐ。`us1/merge-review.json`はこの変更後のコンテンツ受入の参照を持ち、`humanApproval: false`、`mergeApproved: false`を保持する。旧HumanContentReviewEvidence/MergeReviewEvidenceとして読み込まない。

## 出力と次の工程

- `docs/verification/bootstrap/examples.json`：owner付き任意block inventory。
- `problem-placement-reassessment.json`：T073の全件再評価。T049の`problem-placements.json`は歴史上のtaxonomy検証として保持する。
- `problem-authoring-units.json` /
  `problem-authoring-unit-shards.json`：本文・shardの全件joinと訂正target。
- `problem-corpus-check-results.json`：実行結果、数学回帰、補修記録のdigest。
- `problem-content-projection.json`：Problem IDから本文・唯一のhome・読む順・coverage/related
  Unitへの参照。Tag/Unitデータを複製しない。
- `docs/reviews/human-content/bootstrap/problem-authoring-units/`：現在のshardごとのモード付き品質受入。
- `docs/verification/learner-outcomes/bootstrap/sc-009.json`：本人評価の廃止記録。
- `docs/verification/bootstrap/us1.json`：T072–T078の受入表。

追加主成果のownerがhomeの祖先である場合は、関連問題の重複リンクを要求しない。既存の`problemIds`によるcoverage、`relatedProblemIds`、`directProblemIds`の読む順をそのまま投影する。前提DAGから掲載順を生成しない。

CorrectionImpactの実在する本文targetを解決する。T049の`taxonomy-integration`例・演習placeholderは#47で廃止済みなので、所有本文の空配列を確認して不在を`not_applicable`で記録する。対象を架空に作らない。派生indexはT160の責任として`pending`を保ち、canonical
CorrectionImpactを`verified`にしない。T160ではこの廃止記録も消費して公開投影を切り替える。今回のPRは公開route/searchの切替とproduction
deployを含めない。
