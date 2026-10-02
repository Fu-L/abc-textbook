---
title: "ABC395-F — Smooth Occlusion"
draft: true
authoringUnit: {"problemId":"abc395-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-003/abc395-f.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc395-editorial-12344-2eb8137f8829c1e0b7a623f2ec4e13324710e3793f7e853d5497c8205592d1d5","source-abc395-f-problem-df822de6d2bbd93a79019da4bb858e300849ca17a277929a897ccf9206036c48"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"前位置で可能な値が連続区間[l,r]なら、次位置へ差X以内で移れる値全体も[l-X,r+X]という区間である。 Hが実現できれば適切に上下歯を追加で削って任意の小さいHも実現でき、binary searchの単調性が成立する。 Hの可否は下方向に単調で、各位置の可能区間を前区間±XとのintersectionでO(N)更新できるためO(N log maxHeight)で解ける。","sourceRevisionIds":["source-abc395-editorial-12344-2eb8137f8829c1e0b7a623f2ec4e13324710e3793f7e853d5497c8205592d1d5","source-abc395-f-problem-df822de6d2bbd93a79019da4bb858e300849ca17a277929a897ccf9206036c48"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-and-search-threshold"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"U=(3,1),D=(1,3),X=0。","procedure":["各合計初期4。H=2では上歯範囲[1,2]と[0,1]が1で交わる。","H=3は[2,3]と[0,1]で不交差。"],"executionTarget":null,"expectedResult":"最大H2、削除数8−2·2=4。","verificationStatus":"not_applicable","learningUnitIds":["unit-monotone-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-and-search-threshold"],"prerequisiteIds":[],"attainmentCondition":"可能上歯値を一点だけgreedy固定すると安全か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"将来歯の制約と交差する候補を失うので連続区間全体を保存する。"},"answer":{"reasoningOrVerification":"将来歯の制約と交差する候補を失うので連続区間全体を保存する。","procedure":["具体例の各状態・寄与を再計算する。","将来歯の制約と交差する候補を失うので連続区間全体を保存する。"],"expectedResult":"将来歯の制約と交差する候補を失うので連続区間全体を保存する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

最終sum Hを固定すると削る総量はΣ(U_i+D_i)-NHで構成によらないため、cost最小化は実現可能なH最大化と同値である。

各上歯a_iは0≤a_i≤U_iかつ0≤H-a_i≤D_iより区間[max(0,H-D_i),min(U_i,H)]に入り、隣接差≤Xを満たす列の存在判定になる。

採用する候補: Hを二分探索し、左から到達可能なa_iの区間を伝播して可否判定する

Hの可否は下方向に単調で、各位置の可能区間を前区間±XとのintersectionでO(N)更新できるためO(N log maxHeight)で解ける。

棄却する候補: 各歯の最終上長を個別にgreedyで最大化する

隣接差制約が連鎖するため局所最大選択は将来区間を空にし得て、共通Hも保証しない。

前位置で可能な値が連続区間[l,r]なら、次位置へ差X以内で移れる値全体も[l-X,r+X]という区間である。

Hが実現できれば適切に上下歯を追加で削って任意の小さいHも実現でき、binary searchの単調性が成立する。

H候補ごとにpossible=[max(0,H-D_1),min(U_1,H)]から始め、iを進めてpossibleを[possible.low-X,possible.high+X]と歯iの許容区間で交差する。空ならNo。最大Yes Hから総和-NHを出す。

## 典型の発動条件

### 区間到達可能性DP

発動条件: 一次元列で各値が区間制約と隣接Lipschitz制約を満たすか判定するとき。

到達値集合を一つのintervalとして伝播する。

### 実現可能値最大化の二分探索

発動条件: 目的が共通parameter Hの単調可否と線形に結び付くとき。

最大feasible Hを探す。

## 問題固有の要素

削り方のcostを直接最適化せず、上下和Hを固定すると目的が消え、上歯だけの区間列feasibilityへ変わる。

別の問題へ持ち帰る視点: 総量削減問題では最終総和parameterを固定し、局所変数の可到達区間を調べる。

## 正当性

前位置で可能な値が連続区間[l,r]なら、次位置へ差X以内で移れる値全体も[l-X,r+X]という区間である。 Hが実現できれば適切に上下歯を追加で削って任意の小さいHも実現でき、binary searchの単調性が成立する。 Hの可否は下方向に単調で、各位置の可能区間を前区間±XとのintersectionでO(N)更新できるためO(N log maxHeight)で解ける。

## 実装上の注意

- 許容区間下端max(0,H-D_i)、上端min(U_i,H)を使い、交差空判定を等号込みで行う。Σ(U+D)-NHは64 bit整数。

## 復習の核

- N≤7、小heightで全最終U'_iを列挙し、H=0、区間が一点、差がXちょうどのcaseを二分探索判定と比較する。

## 計算量と制約

### 時間

O(N log Hmax)、歯一つごとの可能値区間伝播はO(1)。

### 空間

O(N)、判定自体O(1)補助。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq U _ i \leq 10^9 \ (1 \leq i \leq N); 1 \leq D _ i \leq 10^9 \ (1 \leq i \leq N); 1 \leq X \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

U=(3,1),D=(1,3),X=0。

1. 各合計初期4。H=2では上歯範囲[1,2]と[0,1]が1で交わる。
2. H=3は[2,3]と[0,1]で不交差。

期待される結果: 最大H2、削除数8−2·2=4。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

可能上歯値を一点だけgreedy固定すると安全か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

将来歯の制約と交差する候補を失うので連続区間全体を保存する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc395/editorial/12344) — source-abc395-editorial-12344-2eb8137f8829c1e0b7a623f2ec4e13324710e3793f7e853d5497c8205592d1d5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc395/tasks/abc395_f) — source-abc395-f-problem-df822de6d2bbd93a79019da4bb858e300849ca17a277929a897ccf9206036c48
