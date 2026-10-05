---
title: "ABC311-F — Yet Another Grid Task"
draft: true
authoringUnit: {"problemId":"abc311-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-003/abc311-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-transition-optimization"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc311-editorial-6822-96ffb790c28543d7f79fc0523feb4155ae1ba103221e11e8a1d4b6cbd3e8b05d","source-abc311-f-problem-d6a1ad02dc19a3597fe316ab786a8642371fa801c5ddddd5ce5fb8b9e8fba0b2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"入力の黒マスが強制する黒マスを追加しても、合法な完成盤面の集合は変わらない。右下への含意から各対角線は白 prefix・黒 suffix となり、境界 L_c が完成盤面を一意に表す。強制黒を保つ条件は L_c≤h_c である。\n\n黒マス (i,j) の真下は次の対角線の同じ列 j にある。したがって下への含意は L_{c+1}≤L_c と同値である。端の対角線で真下が実在しない場合も、a_c,b_c の範囲と全白境界 b_c+1 の定義により余計な制約を課さない。実際、前対角線が全白なら次の最大境界は前の全白境界以下、前の黒 suffix が下端で終わるなら次の全白境界がその最左黒列以下になる。\n\n逆に各境界が範囲・強制黒・単調性を満たせば、黒 suffix は右下への含意を、単調性は下への含意を満たす。よって合法盤面と合法境界列は一対一。DP は現在 j に接続できる全 k≥j を足すので、各合法境界列をちょうど一回数える。仮想境界 M+1 は最初の全候補を許し、初期値も正しい。","sourceRevisionIds":["source-abc311-editorial-6822-96ffb790c28543d7f79fc0523feb4155ae1ba103221e11e8a1d4b6cbd3e8b05d","source-abc311-f-problem-d6a1ad02dc19a3597fe316ab786a8642371fa801c5ddddd5ce5fb8b9e8fba0b2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

先に読む単元:

- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md) — 正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

黒マスから下・右下への含意を入力へ伝播する。その後の完成盤面では、各右下がり対角線上で白の prefix と黒の suffix に分かれる。境界だけを状態にすればよい。

1-indexed で対角線 c=i−j を c=1−M..N−1 の順に見る。その実在列は a_c=max(1,1−c) から b_c=min(M,N−c)。最左黒列を L_c とし、全白なら b_c+1 と定義する。許容範囲は a_c≤L_c≤b_c+1 である。強制黒の最小列 h_c があれば L_c≤h_c、なければ h_c=b_c+1 とする。

採用する候補: 境界列を状態にして dp_new[j]=Σ_{k≥j}dp_old[k] を suffix sum で更新する。

下への含意は隣り合う対角線の L_{c+1}≤L_c に一致する。右下への含意は同じ対角線の黒 suffix に含まれる。各対角線に O(M) 状態あり、累積和で遷移を集約できる。

棄却する候補: マスを一つずつ二色へ塗って枝刈りする。

自由な盤面数は指数的なので、局所含意を境界の単調性へまとめる必要がある。

仮想対角線 c=−M の境界を M+1 として dp[M+1]=1、ほかは 0 で初期化する。各実対角線で suffix sum を取り、a_c≤j≤min(b_c+1,h_c) だけを残す。最後の全状態を合計する。

## 典型の発動条件

### 局所制約の閉包と境界線 DP

発動条件: 二値 grid の単調な含意が、各走査線を一つの切替点へ圧縮するとき。

強制状態を先に伝播し、対角線ごとの境界位置だけを DP 状態にする。

### 単調遷移の累積和高速化

発動条件: dp の遷移元が k≥j など連続区間全体になるとき。

前段の suffix sum を一走査で作り、各 j の総和を O(1) で得る。

## 問題固有の要素

行列を行・列ではなく条件が伝播する右下がり対角線で切ると、美しさが単調な一次元境界になる。

別の問題へ持ち帰る視点: 局所条件の方向ベクトルを見て、それに直交する走査線上で frontier が低次元化しないか探す。

## 正当性

入力の黒マスが強制する黒マスを追加しても、合法な完成盤面の集合は変わらない。右下への含意から各対角線は白 prefix・黒 suffix となり、境界 L_c が完成盤面を一意に表す。強制黒を保つ条件は L_c≤h_c である。

黒マス (i,j) の真下は次の対角線の同じ列 j にある。したがって下への含意は L_{c+1}≤L_c と同値である。端の対角線で真下が実在しない場合も、a_c,b_c の範囲と全白境界 b_c+1 の定義により余計な制約を課さない。実際、前対角線が全白なら次の最大境界は前の全白境界以下、前の黒 suffix が下端で終わるなら次の全白境界がその最左黒列以下になる。

逆に各境界が範囲・強制黒・単調性を満たせば、黒 suffix は右下への含意を、単調性は下への含意を満たす。よって合法盤面と合法境界列は一対一。DP は現在 j に接続できる全 k≥j を足すので、各合法境界列をちょうど一回数える。仮想境界 M+1 は最初の全候補を許し、初期値も正しい。

## 実装上の注意

- 全白の境界は各対角線の b_c+1 とし、常に M+1 と置かない。配列には 1..M+1 を確保する。
- 前段はその有効範囲だけで suffix sum を作り、現在の a_c..min(b_c+1,h_c) だけを更新する。範囲より左の suffix 値は前段総和、右は 0 とする。rolling 配列では有効範囲を別に持ち、範囲外を読む前に判定する。毎対角線で全 M 状態を消去しない。
- 1×1 の入力が . なら答え 2、# なら 1 になる初期化を確認する。

## 復習の核

- 局所条件を見たら、まず入力をその条件で閉包しても答えが変わらないか試す。その後、小例に白黒の境界を描いて走査方向を選ぶ。

## 計算量と制約

### 時間

対角線の実在幅を w_c とすると Σw_c=NM。前段・現在の有効範囲だけを走査する DP は ΣO(w_c+1)=O(NM+N+M)=O(NM)。強制黒の閉包も O(NM)。毎対角線で全 M 幅を走査すると O((N+M)M) になるため、有効範囲を保つ。

### 空間

O(NM)、gridとrolling境界DP。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N,M \le 2000; S_i is a string of length M consisting of . and #.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/editorial/6822) — source-abc311-editorial-6822-96ffb790c28543d7f79fc0523feb4155ae1ba103221e11e8a1d4b6cbd3e8b05d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/tasks/abc311_f) — source-abc311-f-problem-d6a1ad02dc19a3597fe316ab786a8642371fa801c5ddddd5ce5fb8b9e8fba0b2
