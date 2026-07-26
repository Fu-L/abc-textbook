---
name: abc-explanation-author
description: 検証済みの公式Source RevisionからABC上級問題の解説草案または具体的な保留診断を作る。
version: 1.1.0
---

# ABC Explanation Author

ABC上級問題の `ProblemAuthoringUnit` を、公式根拠と教材の学習成果へ追跡可能な形で執筆するためのskillである。世界トップレベルの競技プログラマー兼コーチの視点で、上位コンテストを目指す学習者が初見で解法を再現できる思考法と汎用的な典型知識を教える。入力不足を推測で補完してはならない。

## 入力

作業前に次をすべて受け取る。

- Problem ID、学習成果、baseline ID/version、追加前提、対象外、Technique Tag
- 公式問題文から確認した制約
- `references/source-policy.md` に従って正規化されたSource Revision packet
- 出典に紐づくtechnical claim
- full / similar / supplementの候補判定に必要なprimary Problemと比較結果
- manifestに固定されたskill name、version、digest

一項目でも不足、不一致、利用目的外のsourceがあれば執筆せず、診断code、対象field、必要な再試行条件を持つ `blocked` とする。

## 手順

1. `references/input-output-contract.md` に従って入力packetとskill subjectを検証する。
2. sourceの公式task、確認日時、利用目的を確認する。editorial indexだけを問題固有の根拠にしない。
3. `references/placement-policy.md` に従ってfull / similar / supplementを決める。比較の一要素でも不一致ならfullへ戻す。
4. `references/writing-policy.md` に従い、後知恵で直線化しない考察、典型／問題固有要素、復習助言をplacementに応じた粒度で執筆する。
5. fullは `templates/full-explanation.md`、similar/supplementは `templates/abbreviated-explanation.md` を使う。
6. Claim、Example、Exercise、Assessment、Answerを本文と同じauthoring unitへ置き、sourceと学習成果を明示する。
7. `references/review-policy.md` に従ってreview modeを決める。
8. output contractと再現可能性を検証する。出力のProblem、学習成果、baseline、前提、対象外、Tag、placementは入力packetと一致させ、Claimのsourceは入力technical claimと同じsource集合を参照し、対象Problemのofficial taskと用途許可を満たすことを確認する。
9. 全診断が解消された場合だけ草案として渡す。

## 出力

- 完全な入力と未執筆template: `authoring_required`
- 完全な `ProblemAuthoringUnit`: `authoring_unit_draft`
- 入力不足、source不備、skill不一致: 具体的な理由と再試行条件を持つ `blocked`

後二者を完成したProblemAuthoringUnitとして数えない。公開候補では、Claimはverified、実行可能ExampleとAnswerはpassedでなければならない。
