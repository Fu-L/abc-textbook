---
title: "ABC255-G — Constrained Nim"
draft: true
authoringUnit: {"problemId":"abc255-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-classify-game-states/outcome-classify-game-states-shard-001/abc255-g.md","learningOutcomeIds":["outcome-classify-game-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。"],"tagIds":["tag-game-grundy-dp"],"sourceRevisionIds":["source-abc255-editorial-4104-288a99b8f1df078ea734326cb7131a93d2cca7735df2874eb154854207cd9132","source-abc255-g-problem-59258e001b3423159eff6cd38e7a077c6b9b40d1c3137d2e4ff4dda6aefd317a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"過去のGrundy値は常に0からその最大Hまで全て現れる。通常位置ではそのmexであるH+1を一度加える。例外では禁止先の頻度を全過去頻度から引き、頻度0になった最小値、またはH+1を取るのが合法遷移先のmexである。extraは既出値を例外で再利用した回数だけを保存し、通常位置の新最大値には基準の一回だけが対応する。従って全例外とその間の線形式を帰納的に正しく計算できる。独立な山のGrundy数のxorが勝敗を与える。","sourceRevisionIds":["source-abc255-editorial-4104-288a99b8f1df078ea734326cb7131a93d2cca7735df2874eb154854207cd9132","source-abc255-g-problem-59258e001b3423159eff6cd38e7a077c6b9b40d1c3137d2e4ff4dda6aefd317a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)

- 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 考察

山の石数nを0から調べると、通常の手では0,…,n−1の全状態へ移れる。g(n)をGrundy数、h(n)=max_{0≤j≤n}g(j)とすると、過去の値は0,…,h(n)を全て含む。この連続性が、10^18までの山サイズを列挙しないための鍵である。

例外集合S={0,X_i}を昇順に処理する。g(0)=h(0)=0。直前の処理済み例外をbとし、b<nでnが例外でなければ、g(n)=h(n)=h(b)+n−b。例外b自身にはg(b)とh(b)が異なり得るので、g(b)の保存値を返す。

全過去の各Grundy値の出現回数を、その値が一度現れるという基準からの超過分extra[v]だけで保持する。通常位置は新しい最大値を一度ずつ作るため、extraを更新しなくてよい。

例外Xの直前ではH=h(b)+X−b−1が過去の最大値になる。同じXの禁止手をまとめ、各禁止先X−Yのgを既知例外と線形式で求め、禁止される値の頻度bad[v]を数える。0≤v≤Hの過去全頻度は1+extra[v]である。

合法遷移先から消える値はbad[v]=1+extra[v]を満たす値であり、その最小値があればg(X)にする。なければg(X)=H+1。頻度がbad[v]を上回る値は合法な別の遷移先が残っており、mex候補ではない。禁止先に出てこない値も消えないので、badのキーだけを調べればよい。

h(X)=max(H,g(X))。g(X)≤Hならextra[g(X)]を1増やし、g(X)=H+1なら新しい値の初出なのでextraを増やさない。これによりextraのキーは高々例外数になる。

全例外を処理した後、各A_iの直前例外を二分探索してg(A_i)を求める。全gのxorが0ならAoki、それ以外ならTakahashi。例えば禁止手(1,1)だけならg(1)=0、h(1)=0で、g(2)=1になる。最大値と例外自身の値、消える値と残る値を区別することが重要である。

## 典型の発動条件

### Sprague-Grundy分解

発動条件: 複数の独立な山から一つを選んで動かす不偏ゲームで勝敗を求める。

各山のGrundy数を求めてxorし、0かどうかで勝者を決める。

### 疎な例外点圧縮

発動条件: 通常位置では単純な規則で状態値が増え、少数の指定位置だけ遷移が欠ける。

例外X_iのみmexを計算し、例外間を閉形式で補間する。

### mexの頻度差分

発動条件: 遷移全集合から少数の禁止先を除いたmexを求めたい。

過去全体のGrundy出現数と禁止先側の出現数を比較する。

## 問題固有の要素

自由に減らせるNimの線形なGrundy列を基準にし、禁止手が置かれたX_iだけを補正することで10^18の状態空間を疎に扱える。

別の問題へ持ち帰る視点: ほぼ完全な遷移集合から少数の辺だけが欠けるゲームでは、例外位置と値頻度の差だけを追う。

## 正当性

過去のGrundy値は常に0からその最大Hまで全て現れる。通常位置ではそのmexであるH+1を一度加える。例外では禁止先の頻度を全過去頻度から引き、頻度0になった最小値、またはH+1を取るのが合法遷移先のmexである。extraは既出値を例外で再利用した回数だけを保存し、通常位置の新最大値には基準の一回だけが対応する。従って全例外とその間の線形式を帰納的に正しく計算できる。独立な山のGrundy数のxorが勝敗を与える。

## 実装上の注意

- 同じXに複数の禁止手があるためグループ単位で処理し、禁止先Grundyの重複頻度も数える。山サイズと式の値は64ビットで持ち、例外点自身には線形式を適用しない。

## 復習の核

- 山サイズが小さい場合の素朴なmex DPと比較し、同一Xの複数禁止手、同じGrundy値を指す禁止先、A_iが例外点・例外直後にある場合を確認する。

## 計算量と制約

### 時間

O((N+M)log M)、例外sortと各禁止遷移先のGrundy照会・頻度map。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 1 \leq A_i \leq 10^{18}; 1 \leq Y_i \leq X_i \leq 10^{18}; i \neq j \Rightarrow (X_i, Y_i) \neq (X_j, Y_j); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc255/editorial/4104) — source-abc255-editorial-4104-288a99b8f1df078ea734326cb7131a93d2cca7735df2874eb154854207cd9132
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc255/tasks/abc255_g) — source-abc255-g-problem-59258e001b3423159eff6cd38e7a077c6b9b40d1c3137d2e4ff4dda6aefd317a
