---
title: "ABC279-G — At Most 2 Colors"
draft: true
authoringUnit: {"problemId":"abc279-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-002/abc279-g.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-transition-optimization"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc279-editorial-5285-60c40c2102ebbe99f94ec9139e99cf092a9f12cfd859d5c5fbe878d1c1671b60","source-abc279-g-problem-cc853b7c4b00211cc7d49167491f5722ffaf3f56422c2cc4d834a52034cb8df3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"直近Kマスで現れる色が高々二つという条件には、直前色と、もう一色の最後の出現位置だけが必要である。直前色を続ける時は位置が変わらず、第二色を使う時は役割が交換されて旧直前色の位置が新しい第二色位置になる。第二色が窓から消えれば単色状態となり、新しい色をC−1通りから選べる。二色が窓内にある間は第三色を禁止するので全ての遷移が条件を保つ。この状態へ各合法彩色が一意に移り、色名の対称な選択数を掛けることで全彩色数を保存できる。","sourceRevisionIds":["source-abc279-editorial-5285-60c40c2102ebbe99f94ec9139e99cf092a9f12cfd859d5c5fbe878d1c1671b60","source-abc279-g-problem-cc853b7c4b00211cc7d49167491f5722ffaf3f56422c2cc4d834a52034cb8df3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

直前Kマスの具体的な色列を状態にするとC^Kだが、合法列ではactiveな色は高々2色で、色名の対称性も大きい。

2色がactiveなら片方は必ず直前マスの色であり、もう片方について必要なのは最後に現れた位置だけである。

採用する候補: 直近が単色の列数singと、直前色以外のactive色が最後に現れた位置p別のdp[p]を持ち、sliding window和で遷移する。

色名と片方の位置を捨て、dp区間和をprefix sumで求めてN≤10^6を線形に処理できる。

棄却する候補: 直前Kマスの色patternを正規化してDPする。

色名を同型化してもset partition型のpattern数がKとともに急増し、K≤10^6には使えない。

単色suffixから異色を選ぶとC-1通りで、旧直前色の最終位置i-1をsecond color位置とするdp[i-1]へ入る。

二色状態でsecond colorを次に塗ると二色の役割が交換され、新しいsecond color最終位置もi-1になる。直前色を続ける場合は状態がそのまま残る。

second color位置がi-Kまで古くなると直近Kマスから消え、列はsing状態へ移る。

位置1でsing=C、dp=0とする。i=2…Nでsingへdp[i-K]を加え、dp[i-1]=sing(C-1)+Σ_{p=i-K+1}^{i-2}dp[p]を作る。区間和はdp prefixで求め、最後はsingとactive範囲のdpを合計する。

## 典型の発動条件

### 色名対称性による状態圧縮

発動条件: 制約が色の一致/不一致だけに依存し、実際のlabelを区別する必要がないとき。

active色の役割と新色選択数C-1だけを残す。

### last occurrence DP

発動条件: sliding window内にカテゴリが残っているかが最終出現位置で決まるとき。

second colorのlast positionを状態にし、window外へ出る時に単色状態へ移す。

## 問題固有の要素

active 2色のうち直前色は位置情報不要なので、『もう一色の最終位置』という1次元だけでwindowの色数制約を記述できる。

別の問題へ持ち帰る視点: 複数last occurrence状態では、最新要素が固定するカテゴリを除き、残りのranked last positionだけを持てないか考える。

## 正当性

直近Kマスで現れる色が高々二つという条件には、直前色と、もう一色の最後の出現位置だけが必要である。直前色を続ける時は位置が変わらず、第二色を使う時は役割が交換されて旧直前色の位置が新しい第二色位置になる。第二色が窓から消えれば単色状態となり、新しい色をC−1通りから選べる。二色が窓内にある間は第三色を禁止するので全ての遷移が条件を保つ。この状態へ各合法彩色が一意に移り、色名の対称な選択数を掛けることで全彩色数を保存できる。

## 実装上の注意

- dp[i-K]をsingへ移した後、active区間和の左端はi-K+1とし、古いdp値を配列から消さず参照範囲だけで除外する。
- Cは10^9でも法上のC,C-1として扱い、最終active dp範囲の端をN,Kに合わせる。

## 復習の核

- K=3で列AAB→ABB→BBBと進む時、second color位置の更新とwindow外へ出てsingになる瞬間を図示する。

## 計算量と制約

### 時間

O(N)、second-color最終位置DPとprefix和。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in the input are integers.; 2 \le K \le N \le 10^6; 1 \le C \le 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc279/editorial/5285) — source-abc279-editorial-5285-60c40c2102ebbe99f94ec9139e99cf092a9f12cfd859d5c5fbe878d1c1671b60
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc279/tasks/abc279_g) — source-abc279-g-problem-cc853b7c4b00211cc7d49167491f5722ffaf3f56422c2cc4d834a52034cb8df3
