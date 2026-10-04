---
title: "ABC313-E — Duplicate"
draft: true
authoringUnit: {"problemId":"abc313-e","docPath":"src/content/docs/problems/string-geometry/outcome-evolve-run-length-encoded-state/outcome-evolve-run-length-encoded-state-shard-001/abc313-e.md","learningOutcomeIds":["outcome-evolve-run-length-encoded-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["run-length状態の動的遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-run-length-dynamics"],"sourceRevisionIds":["source-abc313-e-problem-3a03247007965db504c9b92bf17a4d2d3a2bd83c0fa99e737a74e209f8eb5bd0","source-abc313-editorial-6911-132005a653dc06fe5dd61179f748826fd3bb3655aea08bb83fab69235e2052d5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"非1の隣接は左の非1の複製によって次列にも残るため、これを持つ列は長さ1になれない。隣接がなければ非1はsingletonであり、runの左から右への順序は保存される。右から消えるまでの間、非1の個数は一定、1-runの増分は直後数字−1で一定である。直後のrunが消える時刻tまでの増加をn+t(last−1)にまとめ、その後このrunが末尾として消える時間を足す更新は、実操作をまとめただけである。右端からの帰納法でtはそのsuffixが完全に消える厳密な時刻を与え、全てのrunが有限時間で消えることも示す。長さ1の直後に仮想的な一操作を追加しているので、求める時刻はt−1。整数上の式が正しいと分かった後で加算乗算を法へ写せば出力も正しい。","sourceRevisionIds":["source-abc313-e-problem-3a03247007965db504c9b92bf17a4d2d3a2bd83c0fa99e737a74e209f8eb5bd0","source-abc313-editorial-6911-132005a653dc06fe5dd61179f748826fd3bb3655aea08bb83fab69235e2052d5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [run-length状態の動的遷移](src/content/docs/learn/string/run-length-dynamics.md)

- 同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- run-length状態の動的遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

2以上の数字が隣接すると、その左の数字が右の数字によって二個以上に複製され、次操作にも非1同士の隣接が残る。従って長さ1へ至れず、最初にこの局所条件で−1を判定する。

それがなければ2,…,9はsingletonで、間は1-runである。末尾runは毎操作一文字減り、末尾でない非1はその右が1なので個数が変わらない。末尾でない1-runは、直後の非1数字xが存続する各操作でx−1ずつ増える。実列を展開すると、この増加が連鎖して長さも操作回数も指数的になり得る。

右側のrunを全て消すまでの時間tを既に求めたとする。今のrunが1で、元の長さn、元の直後の数字がlastなら、その直後が消えるt操作の間にnがn+t(last−1)へ増える。その後は末尾runとしてこの長さの操作で消える。非1runはsingletonで、右側が消えるまで保存され、その後一操作で消える。この寿命を右から伝播する。

計算を統一するため、長さ1から空列にする一操作も追加して考え、最後に一引く。末尾の先に数字1があると見立て、t=0,last=1から始める。

```text
if any adjacent pair consists of two digits >= 2: answer = -1
else:
    t = 0; last = 1
    scan maximal original runs (c,n) from right to left:
        if c == 1: t = t + n + t*(last-1)
        else:      t = t + 1
        last = c
    answer = (t-1) mod 998244353
```

run一覧を作って逆順に読んでもよいが、入力Sの右端から同じ文字をまとめて数えれば、t,lastと二cursorだけで同じ走査ができる。時間を法で管理しても、この走査は元のrun順に進み、法値が0だからrunを飛ばすなどの判断はしない。全1ならt=Nから答えN−1、S=12ならt=3から答え2となる。

## 典型の発動条件

### run length dynamics

発動条件: 文字列操作が同じ文字の連続区間を一様に伸縮し、展開後長が巨大になるとき。

run の文字と長さだけを持ち、消滅時刻と増分をまとめて更新する。

### 発散条件の局所不変量

発動条件: 反復操作の終了性が問われ、ある局所パターンが操作後も必ず残るとき。

2以上の隣接が再生産されることを示し、数値計算の前に無限を除外する。

## 問題固有の要素

各操作を模倣するのでなく、「末尾からいつ消えるか」という時間軸を後ろ向きに伝えると巨大な run を式で処理できる。

別の問題へ持ち帰る視点: 反復文字列操作では、文字列の時系列より各ブロックの寿命を逆算すると閉じた遷移が得られることがある。

## 正当性

非1の隣接は左の非1の複製によって次列にも残るため、これを持つ列は長さ1になれない。隣接がなければ非1はsingletonであり、runの左から右への順序は保存される。右から消えるまでの間、非1の個数は一定、1-runの増分は直後数字−1で一定である。直後のrunが消える時刻tまでの増加をn+t(last−1)にまとめ、その後このrunが末尾として消える時間を足す更新は、実操作をまとめただけである。右端からの帰納法でtはそのsuffixが完全に消える厳密な時刻を与え、全てのrunが有限時間で消えることも示す。長さ1の直後に仮想的な一操作を追加しているので、求める時刻はt−1。整数上の式が正しいと分かった後で加算乗算を法へ写せば出力も正しい。

## 実装上の注意

- 無限判定は元の文字の隣接で先に行う。run長や寿命の法値を終了判定に使わない。
- tの更新右辺は更新前のt。lastは元の直後runの数字で、今の更新後にcへ替える。
- 最後は(t−1+mod)%mod。空列へ至る仮想一操作を忘れると一多い。
- O(1)補助領域にするならrun配列を作らず入力Sを右から走査する。

## 復習の核

- 小例を何段か書き、変化するのが「末尾 run」と「非末尾の 1-run」だけだと見抜く。公式の run 不変量を保った式かを 2・1 の境界で検算する。

## 計算量と制約

### 時間

O(N)。隣接無限判定と右からの回数DP。

### 空間

入力Sを保存するO(N)に加え、元のrunを右から直接読むなら補助領域O(1)。RLE一覧を作る実装では補助領域もO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^6; S is a length-N string consisting of 1, 2, 3, 4, 5, 6, 7, 8, and 9.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc313/tasks/abc313_e) — source-abc313-e-problem-3a03247007965db504c9b92bf17a4d2d3a2bd83c0fa99e737a74e209f8eb5bd0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc313/editorial/6911) — source-abc313-editorial-6911-132005a653dc06fe5dd61179f748826fd3bb3655aea08bb83fab69235e2052d5
