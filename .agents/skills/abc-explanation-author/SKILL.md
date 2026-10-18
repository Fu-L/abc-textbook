---
name: abc-explanation-author
description: 検証済みの公式Source RevisionからABC上級問題の解説草案または具体的な保留診断を作る。
version: 2.1.0
---

# ABC Explanation Author

ABC上級問題の `ProblemAuthoringUnit`
を、公式根拠と教材の学習成果へ追跡可能な形で執筆するためのskillである。世界トップレベルの競技プログラマー兼コーチの視点で、上位コンテストを目指す学習者が初見で解法を再現できる思考法と汎用的な典型知識を教える。入力不足を推測で補完してはならない。

## 入力

作業前に次をすべて受け取る。

- Problem ID、学習成果、baseline ID/version、追加前提、対象外、Technique Tag
- 公式問題文から確認した制約
- `references/source-policy.md` に従って正規化されたSource Revision packet
- 出典に紐づくtechnical claim
- full / similar / supplementの候補判定に必要なprimary Problemと比較結果

一項目でも不足、不一致、利用目的外のsourceがあれば執筆せず、診断code、対象field、必要な再試行条件を持つ
`blocked` とする。

## 手順

1. `references/input-output-contract.md`
   に従って入力packetを検証する。旧skill欄がある場合は型を確認して保持する。
2. sourceの公式task、確認日時、利用目的を確認する。editorial indexだけを問題固有の根拠にしない。
3. `references/placement-policy.md` に従ってfull / similar /
   supplementを決める。比較の一要素でも不一致ならfullへ戻す。
4. `references/writing-policy.md`
   を毎回読み、同文書の良い例・悪い例と照らして執筆する。冒頭は未定義の記号を使わず、解法の核心とその理由を短く伝える。問題文の観察から次の一手を選ぶ理由、必要な定義、具体的な手順へ進み、後知恵で直線化しない。
5. fullは `templates/full-explanation.md`、similar/supplementは
   `templates/abbreviated-explanation.md`
   を使う。テンプレートの節と既存の`sections`欄を対応させ、本文は`renderProblemAuthoringDocument`で生成する。説明の順序を見出しの数で代用せず、任意の小見出しは問題に合わせる。短縮形式でも差分の導出・根拠・全体計算量への接続・復習の核を残す。
6. Claimを本文と同じauthoring
   unitへ置き、sourceと学習成果を明示する。必要な短い例・反例は本文へ組み込む。掲載するコードは実行可能／擬似コード／省略を区別し、実行可能コードを実行して期待結果を確認する。
7. `references/review-policy.md`
   に従って公式根拠、独自の論証、境界と分類への影響をCodexが確認する。明示数式は`$$…$$`または独立した`$$`行で囲み、最小の具体例・図表は理解を助ける箇所だけに置く。数式の定義・文章による説明を省かず、生成Markdownと公開rendererの両方を確認する。
8. output
   contractと再現可能性を検証する。出力のProblem、学習成果、baseline、前提、対象外、Tag、placementは入力packetと一致させ、Claimのsourceは入力technical
   claimと同じsource集合を参照し、対象Problemのofficial taskと用途許可を満たすことを確認する。
9. 全診断が解消された場合だけ草案として渡す。

## 出力

- 完全な入力と未執筆template: `authoring_required`
- 完全な `ProblemAuthoringUnit`: `authoring_unit_draft`
- 入力不足、source不備、未完成解説: 具体的な理由と再試行条件を持つ `blocked`

`authoring_required` と `blocked`
を完成したProblemAuthoringUnitとして数えない。公開候補では、Claimはverified、掲載した実行可能Exampleと、演習を置いた場合のAnswerはpassedでなければならない。

毎回のmanifest/digest、review
mode、人間・第三者・別エージェント承認は要求しない。独立したExample・Exercise・Assessment・Answerの節を一律に追加しない。既存本文と出典を新しい形式へ一括変換しない。
