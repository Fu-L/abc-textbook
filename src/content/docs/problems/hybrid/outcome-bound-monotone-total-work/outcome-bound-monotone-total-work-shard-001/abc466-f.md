---
title: "ABC466-F — Many Mod Calculation"
draft: true
authoringUnit: {"problemId":"abc466-f","docPath":"src/content/docs/problems/hybrid/outcome-bound-monotone-total-work/outcome-bound-monotone-total-work-shard-001/abc466-f.md","learningOutcomeIds":["outcome-bound-monotone-total-work"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-amortized-monotone-progress"],"sourceRevisionIds":["source-abc466-editorial-22630-cbfbf9767fbe0e56fedfe2f8f125beafc77a919ae8c72f58beb9e1a131f58b16","source-abc466-f-problem-61f5d40f1844a22aebc97da6336d8c31093ba6eda92e3f506f3545f90be057a5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"初期 [0,X+1) は元の0を一個加えた対象集合に一致する。各 prefix の剰余分布は完全周回と余りの分解式に一致し、同じ終端の係数を足しても多重集合の頻度は変わらない。e≤M ではすべての値が M 未満なので処理を省ける。従って全操作後も表現は正確で、非空 prefix ごとに0は一個だから係数和が0の総数になる。追加した0は常に0なので Σc−1 が対象 1≤x≤X の答えである。処理する e>M の余りは0または e/2 未満であり、新規起点は各操作で高々一個なので総変換数は O(N log(X+1))。","sourceRevisionIds":["source-abc466-editorial-22630-cbfbf9767fbe0e56fedfe2f8f125beafc77a919ae8c72f58beb9e1a131f58b16","source-abc466-f-problem-61f5d40f1844a22aebc97da6336d8c31093ba6eda92e3f506f3545f90be057a5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)

- 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

対象は 1≤x≤X の各値へ A_1,…,A_N の順に mod を作用させ、最後に0になる値の個数である。X≤10^18 の全整数を列挙する方法は使えない。まず0も加えて [0,X+1) とすれば、mod が連続区間に作る頻度分布を扱いやすくなる。

整数 prefix [0,e) の各値を M で割った余りは、[0,M) が floor(e/M) 周と、[0,e mod M) が1周未満になる。よって係数 c の prefix は

```text
c·[0,e) → c·floor(e/M)·[0,M) + c·[0,e mod M)
```

と分解できる。空 prefix は入れない。この形の重み付き和は操作に対して閉じるので、終端 e と係数 c だけを保持すればよい。係数は区間の重複数であり、同じ終端の係数を足してまとめる。

最大heap と end→coefficient の map を使い、初期状態は end=X+1, coefficient=1 の一項とする。M=A_i の操作では最大終端 e>M の間だけ取り出す。各項の c·floor(e/M) を共通終端 M の係数へ加え、余り r=e mod M>0 なら終端 r へ c を加える。生成する M,r はいずれも M 以下なので、この操作では再び処理しない。e≤M の項は値が変わらないため走査しない。

N 回後、すべての非空 prefix は0をちょうど1個含む。最終的な0の個数は係数和 Σc である。追加した元の0はすべての操作後も0なので、求める答えは Σc−1。X=7,A=(5,2,3) なら [0,8)→[0,5)+[0,3)→3[0,2)+2[0,1) となり、最後の mod 3 は何も変えない。係数和5から元の0を引いて4。

償却解析では「保持している項数」と「変換の総回数」を分ける。各操作で新しく作る共通終端 M を一つの起点とみなすと、起点は初期項を含め高々 N+1 個。既存の一項は余りの一項だけへ引き継がれる。e>M で余りが正なら e mod M<e/2：M≤e/2 なら余り<M≤e/2、M>e/2 なら余り=e−M<e/2。したがって一系列が変換されるのは O(log(X+1)) 回。併合は系列数を増やさない。変化しない項を毎回走査しないことと、この半減を合わせて総変換数 O(N log(X+1)) を得る。

## 典型の発動条件

### 値multisetのprefix interval表現

発動条件: 連続整数集合へmod操作を繰り返し適用するとき。

剰余frequencyを[0,x)の重み付き和として保持する。

### 終端別の同類項merge

発動条件: 各変換で同じ標準objectが多数生成されるとき。

mapで係数をまとめ、priority queueにはdistinct終端だけを載せる。

## 問題固有の要素

各値を追う代わりに、modが連続区間へ作る剰余分布の形をbasis objectとして持つ。

別の問題へ持ち帰る視点: 変換で毎回生まれる共通項と縮小する残余項を分けると、object数を償却解析できる。

## 正当性

初期 [0,X+1) は元の0を一個加えた対象集合に一致する。各 prefix の剰余分布は完全周回と余りの分解式に一致し、同じ終端の係数を足しても多重集合の頻度は変わらない。e≤M ではすべての値が M 未満なので処理を省ける。従って全操作後も表現は正確で、非空 prefix ごとに0は一個だから係数和が0の総数になる。追加した0は常に0なので Σc−1 が対象 1≤x≤X の答えである。処理する e>M の余りは0または e/2 未満であり、新規起点は各操作で高々一個なので総変換数は O(N log(X+1))。

## 実装上の注意

- end=X+1 から始め、最後は係数和から1を引く。end=X では上端 X を落とす。
- heap は最大 end>M の間だけ処理する。map で0から正になった end をheapへ追加し、取り出す際に対応係数を削除する方式なら同じ end の重複を防げる。
- end mod M=0 は空 prefix なので登録しない。係数は答えの法で丸めず、正確な64bit整数で扱う。総要素数は常に X+1 なので個々の係数や生成係数もその範囲に収まる。
- 各テストの heap/map を初期化する。N は mod 操作数であり、別の Q は存在しない。

## 復習の核

- 変換で閉じる区間分布を基底として持ち、最後にどの値の頻度を読むかまで定義する。
- 償却解析では、保持数の上界だけでなく同じ項が再処理される回数を数える。
- 変化しない項を走査から外し、残余の半減へ処理費用を課金する。

## 計算量と制約

### 時間

各case O(N log(N+1) log(X+1))。共通終端を作る起点は高々 N+1 個で、各系列の正の残余は変換のたび半減するため O(N log(X+1)) 回変換する。保持する終端数は O(N)、各heap操作は O(log(N+1))。全caseの N の和は2×10^5。

### 空間

各case O(N)。一操作は各項を高々一つの残余に置き換え、共通終端を高々一つだけ追加するので保持数は高々 N+1。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 2\times 10^5; 1\le N\le 2\times 10^5; The sum of N over all test cases is at most 2\times 10^5.; 1\le X\le 10^{18}; 1\le A_i\le 10^{18}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc466/editorial/22630) — source-abc466-editorial-22630-cbfbf9767fbe0e56fedfe2f8f125beafc77a919ae8c72f58beb9e1a131f58b16
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc466/tasks/abc466_f) — source-abc466-f-problem-61f5d40f1844a22aebc97da6336d8c31093ba6eda92e3f506f3545f90be057a5
