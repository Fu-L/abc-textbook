# PR #63 canonical home and prerequisite review

対象: https://github.com/Fu-L/abc-textbook/pull/63#issuecomment-5826029636

Fu-Lの修正・push指示に基づくCodexの実装・照合記録。reviewerが確定済みのsemantic primary/additional-primary/supporting分類は変更せず、全Inventoryのplacementを新しいhome規則から再導出した。これは独立した人間による再査読ではなく、manifestで許可されたsolo-maintainer self-reviewである。

- Problemのhomeはprimary Outcomeの唯一のowner Unitから導出する。各Outcomeのowner数、direct Problemの完全partition、semantic subtree coverage、related cross-reference集合とcoverageの非交差はcontract testで検証する。
- additional-primaryは追加で学ぶ技能、supportingは既習技能としてProblem一覧に役割表示する。両者はhomeを変えず、Problem固有supportingからUnit prerequisite edgeを生成しない。
- Tag、Outcome、Unitの直接前提DAGをsemantic hierarchyとsidebar/目次順から分離する。canonical schema・生成JSONに全体順、order digest、presentation unit、global indexを残さない。
- ABC301 Eは部分集合DPのdirect、最短路のrelated。ABC375 Gはlowlinkのdirect、最短路のrelatedになることをproposalとmaterialized-document contractで固定する。
- 生成Unit文書は全体の「第N単元」や前後履修リンクを持たず、直接前提と直接の依存先を表示する。問題のUnit内reading orderの全面レビューはFu-Lの指示により次ターンへ分離し、今回のreview scopeに含めない。

必須のT159 source, schema, integration checkを実行し、対象digestに結び付ける。
