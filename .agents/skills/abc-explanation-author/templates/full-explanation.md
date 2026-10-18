# fullの執筆テンプレート

まず[執筆方針と比較例](../references/writing-policy.md)を読む。これは完成Markdownの雛形ではなく、`ProblemAuthoringUnit.sections`へ執筆するための案内である。

入力packetのProblem・学習成果・baseline・前提・Tag・Source
Revisionを引き継ぎ、`kind: full`、`primaryProblemId: null`、`differenceSummary: null`とする。Claimは同じunitの`claims`へ置く。`examples`・`exercises`は必要なければ`[]`。完成unitを`validateAuthoringOutput`で検証し、`renderProblemAuthoringDocument`で本文にする。

以下の外側の節名は互換readerのため維持する。各節内の小見出しは任意であり、問題に合うものだけを付ける。生成される「学習の位置」「出典」は本文へ重ねない。コメントは執筆指示であり、完成原稿に残さない。

## 考察

<!-- sections.reasoning
冒頭に、未定義の記号を使わず核心と必要な理由を短く書く。
問題文・制約・小例の観察から、なぜ次の一手を選ぶかを説明する。
必要な箇所で初めて記号・状態・保持する量を定義し、初期化・遷移・処理順・答えの取り出しまでつなぐ。
具体例・図表・数式は疑問を解く最小限にする。全問へ定型の小見出しや別解比較を課さない。
数式は $$…$$ または独立した $$ 行。変数の初出と添字の範囲を説明する。
-->

## 典型の発動条件

<!-- sections.technique
名前の列挙ではなく、どの要求・観察で候補に上がり、何を確認すれば使えるかを書く。
考察の再掲はせず、他の問題へ持ち帰る条件を短く示す。
-->

## 問題固有の要素

<!-- sections.problemSpecificElements
今回特有の性質と、それを見抜く着目点を書く。
独立した要素がなければ理由を一文で示し、架空のひらめきを増やさない。
-->

## 正当性

<!-- sections.correctness
手順が答えを返す理由を、必要十分な論証で示す。
漏れ・重複・不変条件・終了条件と、関係する境界を確認する。
単純な議論を定型の補題・帰納法へ分割せず、考察の全文も繰り返さない。
同じtextをclaimsへ対応付け、確認したsourceを参照する。
-->

## 実装上の注意

<!-- sections.implementationNotes
境界・同値・整数幅など、この手順で誤りやすい点と理由に絞る。
実行可能コードを載せる場合だけ、環境・入力・実行方法・期待結果を示して実行する。
-->

## 復習の核

<!-- sections.reviewAdvice
次の未知問で思い出す着目点、発動条件、誤用条件を短く残す。
「同様の問題を練習する」だけで終えず、何を再現できればよいかを書く。
-->

## 計算量と制約

### 時間

<!-- sections.complexity.time: 前処理・全状態・全遷移・出力を含む全体評価と理由。 -->

### 空間

<!-- sections.complexity.space: 入力を含む保持データと個数、評価の前提。 -->

### 制約との対応

<!-- sections.constraintConsistency: 評価を実際の上限へ対応付け、成立に使う仮定も確認する。 -->
