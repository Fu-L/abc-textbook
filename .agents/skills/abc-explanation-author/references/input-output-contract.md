# Input / output contract

## Required input

`problemId`、`learningOutcomeIds`、`baseline`、`additionalPrerequisiteUnitIds`、`excludedTopics`、`tagIds`、`constraints`、`placementCandidate`、`technicalClaims`、`sources`を必須とする。空の必須値、未解決sourceはholdとし、推測で補完しない。`skill`は旧入力を読むための任意欄であり、存在するときname/version/digestの型を検証して保持する。現在のskill
version/digestとの一致やmanifestは要求しない。

Source Revisionは`source-policy.md`に従い、正本のschema、fingerprint、official
task、確認日時を検証してからpacketへ渡す。対象Problemと同じofficial
taskを持つ公式問題文revisionを必須とする。Ex表示と公式`_h`の対応は同じContest内だけで正規化する。

各technical claimは入力packet内のSource Revisionを一つ以上参照し、そのsourceのallowed
useに`technical_claim`が含まれなければならない。claim sourceは対象Problemと同じofficial
taskに属し、別Problemのsourceで代用しない。公式解説indexは個別claimの根拠にしない。

## Required output

正本は`src/lib/domain/schema-parts/authoring-unit.ts`の`ProblemAuthoringUnitSchema`である。skill内に別schemaを複製しない。テンプレートは執筆の骨組みであり、空欄のまま完成出力へ渡さない。

full解説は、着想、必要な状態・保持する量、初期化・遷移・操作順・答えの取り出し方を含む具体的な手順、典型、問題固有要素、復習助言、証明、境界、全体の時間・空間計算量、制約整合、実装注意を含む。状態と手順は既存の`sections.reasoning`や`sections.implementationNotes`内で説明し、新しい管理欄に分離しない。境界は証明・制約整合・実装注意へ必要な箇所で組み込む。similar/supplementはprimary
Problem、差分の導出と実装影響、学ぶべき要素、復習助言を説明する。証明・計算量が変わるなら差分で根拠を示し、同じならprimaryの該当箇所へ結び付ける。

全種類でsource-backed
Claimを同じ文書へ置く。`examples`と`exercises`は必要な場合だけ要素を持ち、不要なら`[]`とする。独立した例題・演習・Assessment・Answerを毎問設けない。置いた場合は従来の型・学習成果・再現性を確認する。実行コードは環境・入力・手順・期待結果・execution
targetを記し、実行してpassedを確認する。擬似コード・説明例は省略を明示し`not_applicable`とする。

`validateAuthoringInput(input)`、`prepareExplanationAuthoring(input)`、`validateAuthoringOutput(unit, input)`を使う。出力のProblem、学習成果、baseline、追加前提、対象外、Tag、kind、primary
Problemは入力と一致させる。参照sourceは入力packetに含まれ、各Claimのsource集合は入力technical
claimへ対応し、対象taskと用途許可を満たす。Claimはverified、実行可能Exampleと存在する演習Answerはpassedを要する。

`skill`は出力でも任意。旧値を現在のdigestへ書き換えず、存在する旧欄は型検証する。旧`ProblemAuthoringDetails.reviewMode`は`self`/`third_party`の型で読めるが、承認要件を発生させない。

空の必須節・計算量、本文のない小見出しはfieldと理由を持つ診断で保留する。自動検証は構造的な不足を検出するものであり、論証・状態の十分性・計算量の正しさは`review-policy.md`に従ってCodexが確認する。
