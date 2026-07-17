# Offline fixture inventory

fixtureは公式ページ本文や解説を複製せず、parserとdomain
ruleの検証に必要な最小の架空・要約データだけを保持します。各fixtureは `manifest.json`
のcategoryに登録し、入力版、期待結果、network禁止、再現用seedを明示します。

- `official-source/`: archive/task list/task/editorial取得境界とsource fingerprint
- `future-label/`: Dより後にI、Exなどを含む動的slot
- `corrections/`: source revisionとCorrectionImpact
- `failure-injection/`: timeout、parser drift、書込失敗、rollback
- `design-limits/`: 1,500 Problem・500 Tag・1,000 Unitなどの決定的生成入力

実在する個人情報、credential、提出code、生HTMLをfixtureへ追加してはいけません。
