# Test ownership

`tests/` は公開正本を変更せず、offline fixtureを既定入力として検証します。

- `unit/`: 純粋関数、ID、日時、digest、DAG、状態遷移
- `contract/`: Zod/JSON Schema、content completeness、route contract
- `integration/`: catalog、学習順、backup、update/release pipeline
- `e2e/`: Chromium/Firefox/WebKitの静的route、accessibility、端末内記録
- `performance/`: seed、release、設計上限fixtureの基準測定
- `fixtures/`: 公式情報を転載しない最小offline入力とfailure injection
- `setup/`: deterministic clockなど全test共通設定

networkを使う確認はoffline suite成功後の明示的な任意手順に限定します。
