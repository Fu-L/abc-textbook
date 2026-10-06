---
title: "ABC478 F — Min-First Search"
draft: true
authoringUnit: {"problemId":"abc478-f","docPath":"src/content/docs/problems/updates/abc478-f.md","learningOutcomeIds":["outcome-prune-dominated-candidates-once"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-monotone-stack-queue"],"sourceRevisionIds":["source-abc478-f-problem-bdf75970cbf3991d2648af45f0486a7f36e17d437084e35d2614fa5746f1a44e","source-abc478-editorial-26540-e79777ceb79ee0b436192fab3946c2681caef0fae3002826a1343c47ca364b23"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"親が最後の先行大値より前なら最小候補の選択に反するため必要である。逆に全親が許容区間にあれば、最初の探索順逸脱で本来より小さい後続頂点が候補に入ることは上の矛盾により起きない。親位置が狭義に減少するため全選択は根付き木を作り、異なる親選択は異なる木に対応する。従って独立な選択肢数の積が求める木数。","sourceRevisionIds":["source-abc478-f-problem-bdf75970cbf3991d2648af45f0486a7f36e17d437084e35d2614fa5746f1a44e","source-abc478-editorial-26540-e79777ceb79ee0b436192fab3946c2681caef0fae3002826a1343c47ca364b23"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md)

- 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

## 考察

探索順Qの各頂点に、どの先行頂点を親として選べるかを考える。頂点1を根とすると、Q_iの親はQでiより前の位置jにある。もしjより後かつiより前にQ_iより大きい値が選ばれたら、その時点でQ_iは既に候補集合へ入っているため、その大きい値を先に取り出せず矛盾する。

m_iをiより前にあるQ_iより大きい値の最後の位置、存在しなければ0とする。親の位置に必要な条件はmax(1,m_i)≤j<i。m_iそのものを親にする場合は、Q_{m_i}を取り出した後で初めてQ_iが候補へ入るので許される。選択肢数はi−max(1,m_i)である。m_i=0のとき存在しないQ_0を選択肢へ含めてはいけない。

この条件は十分でもある。探索が初めてQから外れる位置を考えると、本来のQ_iは親が先に処理されているので候補にあり、それより小さい後続Q_kが候補なら、その親位置j_k<iに対してm_k≥iとなり条件j_k≥m_kと矛盾する。よって必ずQ_iが最小候補になる。

各頂点はより早い位置を親に選ぶので閉路はできず、全て最後には位置1へ至って木になる。選択は独立だから答えは上の個数の積。m_iは値が降順になるstackを保ち、Q_i以下をpopして残った末尾から求める。各要素は一度push・一度popされるので線形時間。

公式解説の積の表示には、m_i=0で存在しない添字0を含める境界上の不整合がある。ここでは根の位置1を下限にした式を採用する。N=2,Q=(1,2)で親が1通りであることと、小規模の木の全列挙で境界を独立に確認する。

## 典型の発動条件

最小値優先の探索順から親の許容区間を逆算する。その左境界を直前の大きい要素として単調stackで求める。

## 問題固有の要素

親が探索済みであることと、後の小さい頂点が早く公開されないことの両方が必要。不存在の直前大値には根の添字を境界として使う。

## 正当性

親が最後の先行大値より前なら最小候補の選択に反するため必要である。逆に全親が許容区間にあれば、最初の探索順逸脱で本来より小さい後続頂点が候補に入ることは上の矛盾により起きない。親位置が狭義に減少するため全選択は根付き木を作り、異なる親選択は異なる木に対応する。従って独立な選択肢数の積が求める木数。

## 実装上の注意

1-basedならi−max(1,m_i)、0-basedならi−max(0,m_i)とする。入力値は相異なる。積は毎回998244353で剰余を取る。

## 復習の核

公式の式でも境界の不存在要素を数えていないか確認する。探索順から構成を数えるときは、親選択の独立性と木になる条件を証明する。

## 計算量と制約

### 時間

各頂点のstack操作を合計して O(N)。

### 空間

単調stackに O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le2\times10 ^ 5; 1\le Q _ i\le N\ (1\le i\le N); Q _ i\ne Q _ j\ (1\le i\lt j\le N); Q _ 1=1; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc478/tasks/abc478_f)
- [公式解説](https://atcoder.jp/contests/abc478/editorial/26540)
