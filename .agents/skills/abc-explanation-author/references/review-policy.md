# Review policy

通常のsource-backedな新規解説・軽微な修正はmanifest ownerによる `self` reviewとする。

次のいずれかを含む場合だけ、作成者以外による `third_party` reviewへ切り替える。

- `official_source_conflict`: 公式根拠間の矛盾、訂正、既存説明との重大な不整合
- `independent_proof`: 公式根拠だけでは自動判定できない独自証明または新規正当化
- `major_classification_change`: 学習成果、Technique Tag、前提、Problem配置の重大変更

risk reasonと選択したreview modeをwork manifestおよびreview evidenceへ同じsubjectで記録する。高リスクでない変更に第三者reviewを常設要件として追加しない。
