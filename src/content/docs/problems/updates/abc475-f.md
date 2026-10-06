---
title: "ABC475 F — Rectangle Filling"
draft: true
authoringUnit: {"problemId":"abc475-f","docPath":"src/content/docs/problems/updates/abc475-f.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-state-normalization"],"sourceRevisionIds":["source-abc475-f-problem-6380d7c99e9f6617f24de46ca5fa7c920ad7e9d907bd9b2fb1d81fce8238130a","source-abc475-editorial-25541-dbce3d6c2d571dd08401368fce4f6de17bf83325d30444d992c2fce0282c2915"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非空の変化白マス集合は一意なbounding boxを持つ。その箱の各境界には変化白マスがあり、逆に四辺に白を持つ矩形を塗った状態ではその矩形がbounding boxとなるため一対一である。左右端固定後のactiveとg条件は四辺の必要十分条件を表し、suffix和が全下端を重複なく数える。","sourceRevisionIds":["source-abc475-f-problem-6380d7c99e9f6617f24de46ca5fa7c920ad7e9d907bd9b2fb1d81fce8238130a","source-abc475-editorial-25541-dbce3d6c2d571dd08401368fce4f6de17bf83325d30444d992c2fce0282c2915"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

## 考察

矩形の選び方ではなく塗り終えた状態を数えるため、既存黒マスだけを付け足した異なる矩形を重複排除する必要がある。変化した白マスが一つ以上ある状態には、それらのbounding boxを唯一の代表矩形として対応させる。この代表は上下左右の各境界に元の白マスを一つ以上含む。変化なしの状態は最後に1を足す。

W≤Hとなるよう必要なら転置し、左右端l,rを固定する。各行iで[l,r]内に白マスがあるかをactive_iとする。またg_l(u),g_r(u)を、上端候補u以上でそれぞれ列l,rに白マスが出る最初の行、なければH+1とする。上端uがactiveなら、下端dに求める条件は active_d と d≥max(g_l(u),g_r(u))。これで上・下・左・右の境界が全部白を持つ。

activeのsuffix和を作れば、各uに対する下端の数はその閾値から下のactive行数。一つの(l,r)は O(H) で数えられる。activeは行内の『l以後の最初の白列』がr以下かで求め、gは下から前計算する。全左右端を列挙するので O(HW²)、転置後は O(HW min(H,W))。

## 典型の発動条件

出力状態へ一意な最小操作領域を対応させて重複を消す。二辺を固定して残り二辺をprefix/suffix条件として集計する。

## 問題固有の要素

矩形が大きくても元が黒の余白は状態に影響しない。四辺に白という正規形がその余白を除く。

## 正当性

非空の変化白マス集合は一意なbounding boxを持つ。その箱の各境界には変化白マスがあり、逆に四辺に白を持つ矩形を塗った状態ではその矩形がbounding boxとなるため一対一である。左右端固定後のactiveとg条件は四辺の必要十分条件を表し、suffix和が全下端を重複なく数える。

## 実装上の注意

幅1・高さ1では左右や上下の境界が一致するが式はそのまま使える。全黒なら答え1。状態数は64 bit整数。

## 復習の核

操作の個数を数えない。状態から操作の正規形を一意に復元できる条件を探す。

## 計算量と制約

### 時間

O(HW min(H,W))。短辺は√(HW)以下なので最大約9×10^7の基本走査。

### 空間

前計算表 O(HW)、activeとsuffix和 O(max(H,W))。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H, W; H \times W \leq 2 \times 10^5; H and W are integers.; S_i is a string of length W consisting of . and #.

## 出典

- [公式問題](https://atcoder.jp/contests/abc475/tasks/abc475_f)
- [公式解説](https://atcoder.jp/contests/abc475/editorial/25541)
