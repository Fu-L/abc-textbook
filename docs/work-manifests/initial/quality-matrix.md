# T133–T142 検証処理の保守範囲

Issue #51の対象は受理済みfull
corpusの検証と証跡である。新規toolingは`verify:initial-release`と、そのsource／classification／public
artifact／performance／zero-cost検査、回帰テスト、証跡driftを確認するCI
jobに限定する。10項目を同じ入力digestで再実行でき、未実行のブラウザー結果やpreview成功の取り違えを防げることを保守上の利益とする。

本文、典型・Outcome・Unitの正本、既存のshard/本文受入は変更しない。監査で検出した長いselectとfile
inputのreflowは表示用CSSで補修する。T160の`full-projections.json`は全scriptsを実装subjectへ含むため、新規検証scripts追加と320pxフォームのreflow補修後に、`--write-evidence`で実装digestとbuild
artifact証跡だけを更新する。受理済みsourceProjectionDigest・mapping・counts・routes・search・訂正targetは維持し、現buildを独立に確認する。これは教材・taxonomyの再生成ではない。

新規のaudit出力は`docs/verification/initial-release/`、性能fixtureはignoredな`build/`、52週simulationは一時directoryへ置く。引用・実行例・演習を新設せず、一般証明と既存の有限モデル回帰の役割を区別する。production
review/merge/deployの承認は作らない。
