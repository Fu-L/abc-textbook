---
title: "ABC296-EX — Unite"
draft: true
authoringUnit: {"problemId":"abc296-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-frontier-profile-dp/outcome-design-frontier-profile-dp-shard-001/abc296-ex.md","learningOutcomeIds":["outcome-design-frontier-profile-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-grid-table","unit-dp-state-design","unit-dp-subset-state"],"excludedTopics":["frontier/profile DP・境界状態圧縮の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-frontier-profile-dp","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc296-editorial-6119-ac80203d7028d704d5d765eb1d8dbd94b2cdcfd612591e482994c1f616f2edf7","source-abc296-ex-problem-3aabe946154840170c4f778727509a499ce9e5bf35356b8c3f4d141a02904475"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"走査済み領域から未処理領域へ伸びる接点はfrontierだけである。その黒白と黒接点間の連結同値関係が等しければ、将来の全継続の可否と追加費用は同じになる。黒セル追加では上・左のラベルを統合し、白なら現在接点を消す。成分が最後の接点を失ったら将来再接続できないので、他の黒成分や未処理の必須黒がある状態を捨てる。唯一の黒成分が完成した状態は完了flagを立て、以後黒を作らない。これで最終黒が一成分という条件が必要十分に保たれ、同状態の最少追加数だけを残すDPが最適値を与える。","sourceRevisionIds":["source-abc296-editorial-6119-ac80203d7028d704d5d765eb1d8dbd94b2cdcfd612591e482994c1f616f2edf7","source-abc296-ex-problem-3aabe946154840170c4f778727509a499ce9e5bf35356b8c3f4d141a02904475"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [frontier/profile DP・境界状態圧縮](src/content/docs/learn/dynamic-programming/frontier-profile-dp.md)

- 未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

対象外:

- frontier/profile DP・境界状態圧縮の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

幅Mのfrontierに黒白と黒頂点の連結同値関係を持たせる。追加cellが黒なら上と左の成分を統合し、白ならその接点を消す。成分の最後の接点が消えた時は、他の未完成成分または未処理の必須黒が残っていれば再接続不能なので破棄する。唯一の成分が完成する場合だけ完了flagを立て、以後新しい黒を作らない。同値関係はラベル名によらない正準形にし、同状態では最少追加数だけを残す。これにより最終的に全黒が一成分という条件を、走査中の局所条件へ変換できる。

## 典型の発動条件

### plug/profile DP

発動条件: 格子幅が小さく高さが大きい連結性最適化。

frontierの色と連結partitionだけを保持する。

### 状態正規化

発動条件: 連結成分ラベル名そのものは意味を持たない。

左から初出順にlabelを振り直して同型状態を統合する。

## 問題固有の要素

未来との接点を失った成分は二度と繋がらないというfrontier DPの閉成分条件が、全体連結性を保証する。

別の問題へ持ち帰る視点: 連結性profileではcomponent disappearanceを検出する。

## 正当性

走査済み領域から未処理領域へ伸びる接点はfrontierだけである。その黒白と黒接点間の連結同値関係が等しければ、将来の全継続の可否と追加費用は同じになる。黒セル追加では上・左のラベルを統合し、白なら現在接点を消す。成分が最後の接点を失ったら将来再接続できないので、他の黒成分や未処理の必須黒がある状態を捨てる。唯一の黒成分が完成した状態は完了flagを立て、以後黒を作らない。これで最終黒が一成分という条件が必要十分に保たれ、同状態の最少追加数だけを残すDPが最適値を与える。

## 実装上の注意

成分が消える判定はラベルの最後のfrontier接点が消えた時に行う。任意の成分を完成扱いにしてはいけない。他のfrontier成分・未処理の必須黒の有無を検査し、完了後の黒追加を禁止する。正準化は左から初出ラベルへ1,2,…を振り直す。

## 復習の核

- 小格子の全塗り探索と比較し、離れた#、一成分完成後の別#、M=1、ラベルmergeを確認する。

## 計算量と制約

### 時間

O(NM²K)、K≤2Σ_{k=0}^M C(M,k)Bell(k)、frontier同値関係のcanonical化O(M)。

### 空間

O(MK+NM)、rolling frontierとgrid。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 100; 1\leq M \leq 7; N and M are integers.; S_i is a string of length M consisting of # and ..; The given grid has at least one square painted black.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc296/editorial/6119) — source-abc296-editorial-6119-ac80203d7028d704d5d765eb1d8dbd94b2cdcfd612591e482994c1f616f2edf7
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc296/tasks/abc296_h) — source-abc296-ex-problem-3aabe946154840170c4f778727509a499ce9e5bf35356b8c3f4d141a02904475
