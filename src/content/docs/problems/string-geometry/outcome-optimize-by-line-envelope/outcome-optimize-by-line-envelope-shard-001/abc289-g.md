---
title: "ABC289-G — Shopping in AtCoder store"
draft: true
authoringUnit: {"problemId":"abc289-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-line-envelope/outcome-optimize-by-line-envelope-shard-001/abc289-g.md","learningOutcomeIds":["outcome-optimize-by-line-envelope"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["Convex Hull Trick・直線包絡の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-hull-trick"],"sourceRevisionIds":["source-abc289-editorial-5700-410d2e4623c79e1995161a9ccb1d275c45990e767b73a0e1696d943ab2f890c6","source-abc289-g-problem-b7ee1bbc7276eb9ccede098cfc6c5a5282530091237383e3761cac876e290d63"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"B降順で買う人数が一定なprice区間では上端B_i+Cへ上げても人数を減らさず売上を増やす。従って最大売上はmax_i i(C+B_i)。これを傾きiの直線へ写した上側包絡線は全候補の最大値と同じで、cross積による無効線除去はどのxでも最大にならない線だけを落とす。query位置の有効線を選べば最適値になる。","sourceRevisionIds":["source-abc289-editorial-5700-410d2e4623c79e1995161a9ccb1d275c45990e767b73a0e1696d943ab2f890c6","source-abc289-g-problem-b7ee1bbc7276eb9ccede098cfc6c5a5282530091237383e3761cac876e290d63"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Convex Hull Trick・直線包絡](src/content/docs/learn/geometry-optimization/line-envelope.md)

- 一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。

## 考察

customer motivationをB_1≥…≥B_Nにsortすると、ちょうど上位i人が買う最適price候補はB_i+C_jであり、売上はi(B_i+C_j)になる。

各item値x=C_jの答えはf(x)=max_{1≤i≤N}{i·x+iB_i}で、傾きi・切片iB_iの直線群の上側包絡線queryに一致する。

傾きはi=1..Nで単調増加し、全query xも事前に分かるのでstatic Convex Hull Trickを使える。

採用する候補: 傾き順に直線をupper hullへ追加し、各C_jで最大値をqueryするConvex Hull Trick。

N×Mの候補評価を、不要直線の除去と包絡線上の探索へ圧縮できる。

棄却する候補: itemごとにi=1..Nを全走査してi(B_i+C_j)の最大を取る。

N,Mとも2×10^5で積が大きすぎる。

棄却する候補: motivation最大のcustomerに合わせたprice B_1+C_jだけを選ぶ。

priceを下げて購入人数を増やす方が売上が大きい場合があり、iのtrade-offを無視する。

買う人数が変わらないprice区間ではpriceを上端まで上げられるため、候補priceを各customerの購買限界B_i+C_jへ離散化できる。

直線の傾きが追加順に増えるので、新直線との交点が前の有効開始点以前なら末尾直線をpopするstack型hullを作れる。

Bを降順sortし、i=1..Nについてline y=i·x+iB_iを傾き順に追加する。末尾2本と新線の交点順が非増加なら中央線を削除し、各線が最大になるx区間の左端を保持する。各C_jでは左端をbinary searchして該当lineを選び、i(C_j+B_i)を64bitで評価して入力順に出力する。queryをC順にsortしてpointer走査する実装でもよい。

## 典型の発動条件

### Convex Hull Trick

発動条件: max/min of affine functionsを多数のxで求めるとき。

売上候補を直線へ変換し、upper envelopeだけを保持する。

### 候補priceの閾値化

発動条件: 需要がpriceのthresholdで段階的に変わる収益最大化。

需要人数が変わる購買限界までpriceを上げ、人数iごとに1候補へする。

### 単調傾きのstack hull

発動条件: 直線をslope順に追加できるstatic CHT。

交点順が壊れる末尾線をpopする。

## 問題固有の要素

itemごとの差はx=C_jというquery座標だけで、customer側の直線群は全itemに共通するため、一度作った包絡線をM回再利用できる。

別の問題へ持ち帰る視点: 多数のparameter付き最適化では、候補をparameterのaffine関数へ書き、共通envelopeとqueryに分離する。

## 正当性

B降順で買う人数が一定なprice区間では上端B_i+Cへ上げても人数を減らさず売上を増やす。従って最大売上はmax_i i(C+B_i)。これを傾きiの直線へ写した上側包絡線は全候補の最大値と同じで、cross積による無効線除去はどのxでも最大にならない線だけを落とす。query位置の有効線を選べば最適値になる。

## 実装上の注意

- 交点比較は除算せずcross multiplicationし、積が64bit範囲を越え得る中間では128bit整数を使う。
- 売上自体も最大約4×10^14なので64bit整数で出力する。
- 同じ有効開始点や境界xではどちらのlineを選んでも最大値になるよう、pop・binary searchの不等号を統一する。

## 復習の核

- Bを降順にした小例でiごとの直線を描き、途中で一度も最大にならない線がpopされることと、交点ちょうどのCで売上が一致することを確認する。

## 計算量と制約

### 時間

O(N log N+M log N)。B sort、単調傾きhull、二分query。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10^5; 1\leq M\leq2\times10^5; 0\leq B _ i\leq10^9\quad(1\leq i\leq N); 0\leq C _ i\leq10^9\quad(1\leq i\leq M); All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/editorial/5700) — source-abc289-editorial-5700-410d2e4623c79e1995161a9ccb1d275c45990e767b73a0e1696d943ab2f890c6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/tasks/abc289_g) — source-abc289-g-problem-b7ee1bbc7276eb9ccede098cfc6c5a5282530091237383e3761cac876e290d63
