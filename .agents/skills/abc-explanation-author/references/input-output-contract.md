# Input / output contract

## Required input

`problemId`、`learningOutcomeIds`、`baseline`、`additionalPrerequisiteUnitIds`、`excludedTopics`、`tagIds`、`constraints`、`placementCandidate`、`technicalClaims`、`sources`、`skill`を必須とする。空の必須値、未解決source、manifestと異なるskill version/digestはholdであり、一般知識や推測で補完しない。

各technical claimは入力packet内のSource Revisionを一つ以上参照し、そのsourceのallowed useに `technical_claim` が含まれなければならない。対象Problemと同じofficial taskを持つ公式問題文revisionを必須とする。

## Required output

正本は `src/lib/domain/schema-parts/authoring-unit.ts` の `ProblemAuthoringUnitSchema` である。skill内に別schemaを複製しない。

full解説は、考察、典型、問題固有要素、復習助言、正当性、時間・空間計算量、制約整合、実装注意をすべて含む。similar/supplementはprimary Problem、差分、実装注意を含む。全種類でsource-backed Claim、再現可能なExample、Assessmentと検証方法を含むAnswerを同じ文書へ置く。

公開候補に進めるには、出力のskill subjectがmanifestと一致し、参照sourceが入力packetに含まれ、Claimがverified、実行可能ExampleとAnswerがpassedであることを要する。
