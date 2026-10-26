---
title: "automaton上のDP・行列遷移"
description: "「automaton上のDP・行列遷移」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 73
---

# automaton上のDP・行列遷移

習得対象の目安: **青色（1600–1999）**。構成済みautomatonと位置の直積を使い、禁止状態と受理状態を区別して数える。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### automaton上のDP・行列遷移

有限状態automaton（オートマトン）は、読んだ接頭辞を有限個の状態へまとめ、一文字ごとの次状態を定めたものである。ここでは、構成済みのautomatonを使って文字列を数える。まず一文字ずつ進むDPを作り、最後に数える状態を決める。その後、同じ遷移を巨大回数繰り返す場合に行列累乗へつなぐ。

### 習得する技能

- 位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

### 「11」を避ける二状態から始める

`0`と`1`からなる長さ $$L$$ の文字列で、連続する部分文字列`11`を含まないものを数える。既に違反した列を捨てておけば、次の文字を置けるかは末尾が`1`かだけで決まる。そこで安全な接頭辞を、状態 $$A$$「空列または末尾`0`」と、状態 $$B$$「末尾`1`」へ分ける。

| 現在の状態 | `0`を追加 | `1`を追加              |
| ---------- | --------- | ---------------------- |
| $$A$$      | $$A$$     | $$B$$                  |
| $$B$$      | $$A$$     | `11`ができるので捨てる |

長さ $$i$$ の安全な接頭辞のうち、状態 $$A,B$$ にある個数をそれぞれ $$a_i,b_i$$ とする。長さ0では空列が一つなので初期値は $$(a_0,b_0)=(1,0)$$。表の遷移を、到着先ごとに足すと

$$
a_{i+1}=a_i+b_i,\qquad b_{i+1}=a_i
$$

となる。順に $$(a_1,b_1)=(1,1)$$、$$(a_2,b_2)=(2,1)$$、$$(a_3,b_3)=(3,2)$$ を得る。長さ2の列は`00, 01, 10`の3通り、長さ3は`000, 001, 010, 100, 101`の5通りである。

末尾が`1`でも、その時点では違反していない。従って答えは $$a_L+b_L$$ と、全ての安全状態を足す。状態 $$A$$ だけを足すと「末尾が`0`」という余計な条件が付く。長さ0も許す設定なら、答えは空列の1通りになる。

### 一文字の遷移と、最後に受理する状態

一般に、各状態と文字から次状態が一意に決まるautomatonを用意する。状態 $$s$$ に文字 $$c$$ を追加した次状態を $$\mathrm{go}(s,c)$$ とし、$$dp[i][s]$$ を「長さ $$i$$ まで作り、途中で違反せずに状態 $$s$$ へ来た文字列の個数」とする。開始状態を $$\mathrm{start}$$ とすると、初期値は $$dp[0][\mathrm{start}]=1$$、他は0である。

各長さで次の配列を0に戻し、各状態と選べる文字について

$$
dp[i+1][\mathrm{go}(s,c)]\mathrel{+}=dp[i][s]
$$

と更新する。禁止pattern（連続する部分文字列として避けたい文字列）が完成する遷移は、加算せず捨てる。禁止情報には、同時に完成する短いpatternも含める。具体的な遷移表の構築は直接前提の[有限状態automatonの構成](/learn/string/finite-pattern-automaton/)で扱う。

この更新が正しいのは、長さ $$i+1$$ の列から末尾一文字を取り除くと、直前の接頭辞と追加文字が一意に定まるためである。同じ状態の接頭辞は、同じ文字を置けて同じ次状態へ進むので、個数をまとめて更新できる。異なる文字が同じ遷移先へ進む場合も、出来上がる文字列は別物なので、それぞれ加算する。

最後に答えへ含める状態を**受理状態**と呼ぶ。禁止patternの回避だけなら、違反する遷移を全て捨てた後に残る全状態が受理状態である。末尾などの追加条件があれば、それを満たす状態だけを選ぶ。開始状態から文字列を読む経路が一意に決まることも必要であり、非決定性automatonの複数経路をそのまま足すと、同じ文字列を重複して数え得る。

### 全patternの出現には既出集合を加える

今度は、空でない $$K$$ 個のpatternを全て含む列を数えたい。末尾の一致状態だけでは、過去に現れて末尾から消えたpatternを忘れてしまう。

Aho–Corasickでは、読んだ列の接尾辞のうち、いずれかのpatternの接頭辞でもある最長のものを状態として残す。例えば必要なpatternが`0`と`10`なら、pattern全体も接頭辞に含むため、`10`が完成したときの状態は`10`である。一方、長さ3の`000`と`100`はともに状態`0`で終わるが、後者だけが既に`10`を含む。`100`では、途中の`10`で両patternが現れた後、最後の`0`を追加すると状態が`10`から`0`へ移る。このように、末尾の一致状態が同じでも、それまでに出現したpatternの集合は異なり得る。

そこで状態を $$(q,m)$$ とする。$$q$$ は元のautomatonの状態、$$m$$ は既出集合を表すbitmaskで、bit $$j$$ が1ならpattern $$j$$ は既に出現している（$$0\leq j<K$$）。状態 $$q'$$ で末尾に一致するpattern全てのmaskを $$\mathrm{out}(q')$$ とすると、一文字 $$c$$ の更新は

$$
q'=\mathrm{go}(q,c),\qquad
m'=m\mathbin{\mathrm{OR}}\mathrm{out}(q')
$$

である。初期状態は $$(\mathrm{start},0)$$。`10`を読み終えるときは、`10`とその末尾の`0`が同時に現れるので、両方のbitを立てる。こうした出力情報を[Aho–Corasick](/learn/string/aho-corasick/)などで準備してから、DPへ渡す。

長さ $$L$$ まで進めた後、$$m=2^K-1$$ の状態だけを、全ての $$q$$ について足す。全patternがまだ揃っていなくても、その接頭辞を途中で捨ててはいけない。後の文字で揃う可能性があるためである。逆に、一度全bitが立つfull maskになった後も長さ $$L$$ まで進める。途中で答えへ加えると、指定長より短い列も数えてしまう。

**禁止は出現した瞬間に遷移を捨て、全出現の要求は履歴を残して最後に選ぶ。** どちらも受理条件から必要な状態を逆算する点は同じである。元のautomatonが $$Q$$ 状態なら、maskを含む組合せは $$S=Q\cdot 2^K$$ 状態となる。以下の状態数 $$S$$ は、このような追加情報まで含めた完全な状態の個数を指す。

### 固定遷移を行列へまとめる

一文字ずつのDPが間に合わないほど $$L$$ が大きくても、全ての位置で同じ遷移を使うなら反復をまとめられる。長さ $$i$$ の各状態の個数を並べた**列ベクトル**を $$v_i$$ とし、出発元 $$s$$、到着先 $$t$$ に対する行列の要素を次の向きで定義する。

$$
T[t][s]=\left|\{c\mid s\text{から文字}c\text{で合法に}t\text{へ進む}\}\right|
$$

すなわち、行が到着先、列が出発元である。行列積の $$t$$ 成分は、各出発元の個数にそこからの文字の選び方を掛けて足したものなので、一文字のDPと一致する。

$$
v_{i+1}=Tv_i,\qquad v_L=T^L v_0
$$

`11`回避で状態を $$A,B$$ の順に並べると、

$$
\begin{aligned}
T&=\begin{pmatrix}1&1\\1&0\end{pmatrix},&
v_0&=\begin{pmatrix}1\\0\end{pmatrix},\\
v_2&=\begin{pmatrix}2\\1\end{pmatrix},&
v_3&=\begin{pmatrix}3\\2\end{pmatrix}
\end{aligned}
$$

となり、通常DPと同じ個数を得る。答えは $$v_L$$ の受理状態の成分和である。長さ0なら $$T^0$$ は単位行列なので、初期状態が受理されるかだけを調べればよい。

行列要素は「辺があるか」の0/1とは限らない。文字種を`a,b,c`とし、`aa`だけを禁止するなら、「空列または末尾が`a`以外」の状態へは`b`でも`c`でも戻る。この要素は2であり、1にすると文字列を数え落とす。行列作成時も、各文字について要素を1ずつ増やす。

必要なときは[法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)の二分累乗と同様に、指数を二進数で処理する。$$T,T^2,T^4,\ldots$$ を順に作り、$$L$$ の立っているbitに対応する行列をベクトルへ掛けると、長さを一つずつ進めずに済む。手順の一般形は[固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)で学べる。

## 成立条件と計算量

遷移表が構築済みで、一文字の遷移・maskのOR・個数の加算を定数時間で行えるとする。長さ $$L$$・完全な状態数 $$S$$・文字種数 $$\sigma$$ なら、通常DPは $$O(LS\sigma)$$ 時間。長さの軸を現在と次の二配列へ分けると作業領域は $$O(S)$$ となる。ここで $$S$$ に長さの軸は含めない。全pattern充足の $$K$$ が大きいと、$$2^K$$ の分だけ通常DPでも重くなる。

行列を密に持つ場合、初期行列の構築は $$O(S^2+S\sigma)$$ 時間、$$L\geq 2$$ の累乗は $$O(S^3\log L)$$ 時間・$$O(S^2)$$ の作業領域を使う。$$L=0$$ なら初期ベクトルをそのまま使い、$$L=1$$ なら行列とベクトルの積一回でよい。元のautomatonの遷移表を $$Q$$ 状態・$$\sigma$$ 文字で保存するなら、別に $$O(Q\sigma)$$ の領域が必要であり、表そのものの構築時間は前提単元の方法で評価する。個数を固定の法で管理する場合の評価で、整数をそのまま大きくする場合は演算自体の費用も考える。

従って、長さを一つずつ進められるなら通常DPを使い、状態数が小さく、長さが巨大で、遷移が位置によらず固定なら行列累乗を検討する。元の一文字遷移が疎でも、二乗後の行列が疎とは限らない。maskを足した後の $$S$$ で密行列の費用を見積もる。位置ごとに選べる文字が違う場合や、上限との比較が位置の数字に依存する桁DPでは、同じ $$T$$ の累乗をそのまま使えない。

[ABC305 G](/problems/abc305-g/)は、短い禁止patternを判定できる末尾を状態に残し、最大 $$10^{18}$$ の長さを行列累乗で進める接続例である。[ABC419 F](/problems/abc419-f/)は、末尾の一致状態と既出maskを持ち、長さ100以下まで通常DPを進めてfull maskを集計する例である。patternが8個以下なのでmaskを持てる一方、密行列へ変えると組合せ状態数の三乗が重くなる。以下の公式根拠と本単元の小例を対応させ、状態数と反復回数の両方を見て手法を選ぶ。

到達可能性を求める場合は個数の加算をORへ、費用最小なら候補の集約をminへ変えるなど、同じ状態と合法遷移を再利用できる。ただし、行列にも集約と経路の連結に対応する演算が必要であり、数え上げ用の通常の和・積をそのまま使うわけではない。

概念上の親: [接頭辞から更新する有限状態DP](/learn/dynamic-programming/dp-digit-string/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)、[有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（後の章）。

このUnitを直接前提とする単元: なし。

有限pattern automatonの完全遷移を構成できるようになった後、位置・長さとの直積状態で受理列を数え、桁上限がある場合だけ桁DPと組み合わせる。

### このUnitでは扱わないもの

- automaton上のDP・行列遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)（同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。
- [ABC391 G「Many LCS」](https://atcoder.jp/contests/abc391/tasks/abc391_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。

## 根拠

今回の接続の確認日: 2026-10-26。`11`回避などの小例は本単元の説明用に作ったもので、公式解説からの引用ではない。

- [ABC419 F 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_f)
- [ABC419 F 公式解説](https://atcoder.jp/contests/abc419/editorial/13623)
- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC301 F 公式解説](https://atcoder.jp/contests/abc301/editorial/6331)
- [ABC301 F 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G 公式解説](https://atcoder.jp/contests/abc305/editorial/6540)
- [ABC305 G 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-automaton-dp`
