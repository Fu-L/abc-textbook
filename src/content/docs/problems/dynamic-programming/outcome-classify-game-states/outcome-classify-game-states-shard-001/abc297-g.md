---
title: "ABC297-G — Constrained Nim 2"
draft: true
authoringUnit: {"problemId":"abc297-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-classify-game-states/outcome-classify-game-states-shard-001/abc297-g.md","learningOutcomeIds":["outcome-classify-game-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。"],"tagIds":["tag-game-grundy-dp"],"sourceRevisionIds":["source-abc297-editorial-6172-bc1a41b391eda2ee80b27fae0e97e1f35e7b36b6ad06304ce6c9713ad4a7fd02","source-abc297-g-problem-5d7a9c2f2ffc60d29655b1e25594340a96613402eb03bbc0acfadfe94086087d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"P=L+R、r=x mod P、q=floor(r/L)と置き、候補g(x)=qを小さいxから帰納する。x<Lなら手がなく0である。一般の場合、mex=qを示すにはqへ移れないことと0..q−1へ全て移れることの二つで十分である。\n\n同じ値qの剰余zは区間[qL,min((q+1)L−1,P−1)]にある。rとzは同じ長さ高々Lの区間内なので、後向き差(r−z) mod Pは0..L−1またはP−L+1..P−1のどちらか。P−L=Rなので、合法減少量[L,R]には一致しない。従ってqを持つ状態へは移れない。\n\nq>0なら、同じ周期内の到達先剰余として[max(0,r−R),r−L]を使う。r<Pからr−R<Lなので左端は最初の値0の区間内にあり、右端は(q−1)L+(r mod L)で値q−1の区間内にある。この連続区間は全ての値0..q−1の区間に交わる。選んだzの実際の到達先はfloor(x/P)P+z≥0で、減少量r−z∈[L,R]だから、周期を越えた仮想の負状態を使ってはいない。q=0ではこの確認は不要である。\n\n全ての合法な到達先はxより小さく帰納仮定が使えるので、mexはqに等しい。これで全xの閉形式が証明できる。独立な各山のGrundy数をxorし、0ならSecond、それ以外ならFirstを出力する。","sourceRevisionIds":["source-abc297-editorial-6172-bc1a41b391eda2ee80b27fae0e97e1f35e7b36b6ad06304ce6c9713ad4a7fd02","source-abc297-g-problem-5d7a9c2f2ffc60d29655b1e25594340a96613402eb03bbc0acfadfe94086087d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)

- 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 考察

一手で減らせる石数が連続区間[L,R]なので、小さい山のGrundy数をmexで並べて、値が切り替わる位置を見る。0がL個、1がL個、…と続き、L+Rで0へ戻る形が候補になる。

そこでP=L+Rとし、山xの値を `g(x)=floor((x mod P)/L)` と予想する。幅Lの同じ値の区間には合法な減少量で戻れず、それより小さい各値の区間には届く、という二点を確かめればmexの定義から証明できる。周期を見つけただけで使わず、「自分の値はない・小さい値は全部ある」へ分けて確認するのが着眼点である。

各山の値をこの式で求めてxorする。独立な山の不偏ゲームなので、xorが0ならSecond、それ以外ならFirstを出力する。

## 典型の発動条件

### Sprague-Grundy xor

発動条件: 独立な複数山の不偏ゲーム。

各山のGrundy数をxorする。

### Grundy列の周期発見と証明

発動条件: 遷移が固定長区間で値域が巨大。

小実験から周期候補を得てmex集合で示す。

## 問題固有の要素

連続区間だけ石を取れるゲームでは、L+R周期とL幅の段階値が現れる。

別の問題へ持ち帰る視点: 区間遷移ゲームはmex列の周期性を実験・証明する。

## 正当性

P=L+R、r=x mod P、q=floor(r/L)と置き、候補g(x)=qを小さいxから帰納する。x<Lなら手がなく0である。一般の場合、mex=qを示すにはqへ移れないことと0..q−1へ全て移れることの二つで十分である。

同じ値qの剰余zは区間[qL,min((q+1)L−1,P−1)]にある。rとzは同じ長さ高々Lの区間内なので、後向き差(r−z) mod Pは0..L−1またはP−L+1..P−1のどちらか。P−L=Rなので、合法減少量[L,R]には一致しない。従ってqを持つ状態へは移れない。

q>0なら、同じ周期内の到達先剰余として[max(0,r−R),r−L]を使う。r<Pからr−R<Lなので左端は最初の値0の区間内にあり、右端は(q−1)L+(r mod L)で値q−1の区間内にある。この連続区間は全ての値0..q−1の区間に交わる。選んだzの実際の到達先はfloor(x/P)P+z≥0で、減少量r−z∈[L,R]だから、周期を越えた仮想の負状態を使ってはいない。q=0ではこの確認は不要である。

全ての合法な到達先はxより小さく帰納仮定が使えるので、mexはqに等しい。これで全xの閉形式が証明できる。独立な各山のGrundy数をxorし、0ならSecond、それ以外ならFirstを出力する。

## 実装上の注意

- L+RとA_iは64ビットで計算し、R≥Lでも式の商範囲を決め打ちしない。

## 復習の核

- 小Aまで素朴mexと比較し、周期境界L+R-1/L+R、L=Rを確認する。

## 計算量と制約

### 時間

O(N)、各山をmod(L+R)してxor。

### 空間

O(1)補助。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^5; 1\leq L \leq R \leq 10^9; 1\leq A_i \leq 10^9; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc297/editorial/6172) — source-abc297-editorial-6172-bc1a41b391eda2ee80b27fae0e97e1f35e7b36b6ad06304ce6c9713ad4a7fd02
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc297/tasks/abc297_g) — source-abc297-g-problem-5d7a9c2f2ffc60d29655b1e25594340a96613402eb03bbc0acfadfe94086087d
