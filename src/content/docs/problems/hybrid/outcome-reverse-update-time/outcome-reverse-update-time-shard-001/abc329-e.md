---
title: "ABC329-E — Stamp"
draft: true
authoringUnit: {"problemId":"abc329-e","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc329-e.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress"],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline","tag-amortized-monotone-progress"],"sourceRevisionIds":["source-abc329-e-problem-08b77404997243d3c43a9cdd8e62a6b077cdb9a32d67f7f1dfbfbc31f15343a0","source-abc329-editorial-7724-b6c3d4eacfc178c8ae6a1c4b47a0f4f371762ce09d782ddfdf1650f19e7b9c61"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"window iがgoodとは全jでcurrent[i+j]=='#'またはT[j]であることで、これはそのstampが最後に押されたとみなせる必要十分条件である。 各windowは一度処理すれば全#になり、再度処理しても変化しないのでused flagでqueue重複を無害化できる。 上書き履歴をmonotoneな削除過程へ変え、局所更新だけで全候補を伝播できる。","sourceRevisionIds":["source-abc329-e-problem-08b77404997243d3c43a9cdd8e62a6b077cdb9a32d67f7f1dfbfbc31f15343a0","source-abc329-editorial-7724-b6c3d4eacfc178c8ae6a1c4b47a0f4f371762ce09d782ddfdf1650f19e7b9c61"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)

対象外:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

forwardの上書き順を逆に見ると、現在文字列のwindowが各位置でTと一致するか既に消した#なら、そのwindowを全て#へ戻せる。

#化はwindowの一致条件を緩めるだけなので、現在使えるwindowを今消しても将来の可能性を損なわない。

1つのwindowを#化して新たにgoodになり得るのは、そのM文字と重なる開始位置だけである。

採用する候補: reverse操作でgood windowをqueue管理し、使えるwindowを単調に#化して全消去できるか判定する。

棄却する候補: forwardに#列からstamp位置をgreedyに選ぶ。

後のstampが前の文字を上書きするため、途中状態と最終Sの局所一致だけでは安全な選択を決めにくい。

棄却する候補: 現在Tと完全一致するsubstringだけをreverse消去する。

既に#になった位置は以前のstampで上書き済みとしてwildcardにでき、完全一致だけでは必要なoverlapを見落とす。

current=Sとし、全start 0..N-Mでgoodならqueueへ入れる。queueからiをpopし未使用ならusedにしてwindow内の文字を#へ変える。各変更位置pについてstart∈[p-M+1,p]を範囲clipしてgoodか再検査し、成立windowをenqueueする。終了後currentが全#ならYes、そうでなければNo。

## 典型の発動条件

### 操作の逆転

発動条件: forward操作が上書きで履歴依存だが、最終状態から戻すと削除になるとき。

stampを最後に押したwindowからwildcard #へ戻す。

### monotone queue propagation

発動条件: 状態変更が条件を緩和し、新たに可能になった局所操作を処理するとき。

good windowをqueueへ追加して固定点まで回す。

### 局所影響範囲の再検査

発動条件: 長さM window操作で条件が変わる候補がoverlap範囲だけのとき。

変更文字を含むO(M)個のstartだけを見る。

## 問題固有の要素

reverse状態の#は文字が決まっていないのではなく、「より後のforward stampに上書きされたので何文字でもよい」というワイルドカードを表す。

別の問題へ持ち帰る視点: 上書き構成問題では、逆向きに消した位置をwildcard化すると操作可否が単調になることがある。

## 正当性

window iがgoodとは全jでcurrent[i+j]=='#'またはT[j]であることで、これはそのstampが最後に押されたとみなせる必要十分条件である。 各windowは一度処理すれば全#になり、再度処理しても変化しないのでused flagでqueue重複を無害化できる。 上書き履歴をmonotoneな削除過程へ変え、局所更新だけで全候補を伝播できる。

## 実装上の注意

- window startを0..N-Mへclipし、M≤5を利用してgood判定を直接O(M)で行う。
- 既に#の文字を再変更せず、used windowを二重処理しないことで無駄なqueue増殖を防ぐ。

## 復習の核

- 完全一致windowを消した後、#とのoverlapによって別windowがgoodになる例を作り、再検査start範囲とwildcard条件を確認する。

## 計算量と制約

### 時間

O(NM²)、各文字は一回#へ変わり、影響する最大M windowをO(M)で再検査。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 1 \leq M \leq \min(N, 5); S is a string consisting of uppercase English letters with length N.; T is a string consisting of uppercase English letters with length M.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc329/tasks/abc329_e) — source-abc329-e-problem-08b77404997243d3c43a9cdd8e62a6b077cdb9a32d67f7f1dfbfbc31f15343a0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc329/editorial/7724) — source-abc329-editorial-7724-b6c3d4eacfc178c8ae6a1c4b47a0f4f371762ce09d782ddfdf1650f19e7b9c61
