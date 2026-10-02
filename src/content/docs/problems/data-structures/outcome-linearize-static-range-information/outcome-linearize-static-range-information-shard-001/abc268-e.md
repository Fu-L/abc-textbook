---
title: "ABC268-E — Chinese Restaurant (Three-Star Version)"
draft: true
authoringUnit: {"problemId":"abc268-e","docPath":"src/content/docs/problems/data-structures/outcome-linearize-static-range-information/outcome-linearize-static-range-information-shard-001/abc268-e.md","learningOutcomeIds":["outcome-linearize-static-range-information"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。"],"tagIds":["tag-prefix-difference"],"sourceRevisionIds":["source-abc268-e-problem-ebb48085f9132fd7859792492da1d8ac110ddb24ce42343bc916a103a1221c9e","source-abc268-editorial-4777-26e9d1b6757939b74bb7bc9f6ed9067ff8db7f5ea5a842cdfbe08a3e624a510c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一次式 ax+bの区間加算はaとbを別々のimos配列へ加え、累積後にa_x x+b_xを評価すればよい。 長さNの半開区間 [t_i,t_i+N) は各rotation residue xについてxまたはx+Nのちょうど一方を含み、円環波形を二倍配列から復元できる。 mod Nをまたぐ三角波を通常の線形区間にでき、一人当たり定数回のrange affine addで全回転へ寄与を配れる。","sourceRevisionIds":["source-abc268-e-problem-ebb48085f9132fd7859792492da1d8ac110ddb24ce42343bc916a103a1221c9e","source-abc268-editorial-4777-26e9d1b6757939b74bb7bc9f6ed9067ff8db7f5ea5a842cdfbe08a3e624a510c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-linearize-static-range-information"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=5、一人の正面rotation residueが0。","procedure":["rotation0..4への不満は円環距離(0,1,2,2,1)。","奇数Nでは最大2が二箇所となる。"],"executionTarget":null,"expectedResult":"寄与列0,1,2,2,1。","verificationStatus":"not_applicable","learningUnitIds":["unit-prefix-aggregate"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-linearize-static-range-information"],"prerequisiteIds":[],"attainmentCondition":"N=4の場合の頂上はどうなるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"距離列0,1,2,1で最大は一箇所。floor/ceilの境界を同じ式で雑に扱わない。"},"answer":{"reasoningOrVerification":"距離列0,1,2,1で最大は一箇所。floor/ceilの境界を同じ式で雑に扱わない。","procedure":["具体例の各状態・寄与を再計算する。","距離列0,1,2,1で最大は一箇所。floor/ceilの境界を同じ式で雑に扱わない。"],"expectedResult":"距離列0,1,2,1で最大は一箇所。floor/ceilの境界を同じ式で雑に扱わない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

- prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。

## 考察

各人iについて料理iが正面に来る回転数t_iを中心に、不満度は円環距離 min(|x−t_i|,N−|x−t_i|) という三角波になる。

三角波は円環を切れば、傾き+1で増える区間と傾き−1で減る区間の高々二本の一次式に分かれる。

棄却する候補: 回転数x=0,…,N−1ごとに全N人の円環距離を計算する。

N^2個の距離計算になりN=20万を扱えない。

採用する候補: 回転軸を0…2N−1へ展開し、各人の一周期を区間一次式として傾き・切片の差分配列へ加え、xとx+Nをfoldして全回転の総和を得る。

mod Nをまたぐ三角波を通常の線形区間にでき、一人当たり定数回のrange affine addで全回転へ寄与を配れる。

一次式 ax+bの区間加算はaとbを別々のimos配列へ加え、累積後にa_x x+b_xを評価すればよい。

長さNの半開区間 [t_i,t_i+N) は各rotation residue xについてxまたはx+Nのちょうど一方を含み、円環波形を二倍配列から復元できる。

sum of circular absolute-distance functionsをperiod doublingでpiecewise-linear range additionsへ変え、coefficient-wise imosで全評価点を一括計算する。

## 典型の発動条件

### 区間一次式のimos法

発動条件: 多数の寄与が区間ごとにax+bで表され、全整数点で総和を求めるとき。

傾きと切片の二差分配列を持ち、累積した係数へ各xを代入する。

### 円環区間の二倍展開

発動条件: 周期境界をまたぐpiecewise関数や区間を通常の連続区間として扱いたいとき。

index範囲を2周期へ広げ、一周期分の区間をwrapなしで加算してresidueへfoldする。

## 問題固有の要素

dish d の初期正面personをpos[d]とすれば、正面一致の中心回転は t_d=(d−pos[d]) mod N である。

別の問題へ持ち帰る視点: 円環配置では対象物の現在位置から目標位置へのrotation offsetを先に逆permutationで求める。

## 正当性

一次式 ax+bの区間加算はaとbを別々のimos配列へ加え、累積後にa_x x+b_xを評価すればよい。 長さNの半開区間 [t_i,t_i+N) は各rotation residue xについてxまたはx+Nのちょうど一方を含み、円環波形を二倍配列から復元できる。 mod Nをまたぐ三角波を通常の線形区間にでき、一人当たり定数回のrange affine addで全回転へ寄与を配れる。

## 実装上の注意

- Nの偶奇で三角波の頂上が一つか二つかが変わるため、floor(N/2)とceil(N/2)で半開区間端を導く。
- 総不満度はN^2規模になり得るため64 bit整数を使い、差分配列は終端2Nまで確保する。

## 復習の核

- 円環上の距離和は、各対象の理想offsetを中心とする三角波として全候補同時評価を考える。
- 区間上で線形な寄与は値を直接足さず、傾き・切片を別々にrange addする。

## 計算量と制約

### 時間

O(N)、各人は定数個の一次式区間へ寄与。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 2 \times 10^5; 0 \leq p_i \leq N-1; p_i \neq p_j if i \neq j.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=5、一人の正面rotation residueが0。

1. rotation0..4への不満は円環距離(0,1,2,2,1)。
2. 奇数Nでは最大2が二箇所となる。

期待される結果: 寄与列0,1,2,2,1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

N=4の場合の頂上はどうなるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

距離列0,1,2,1で最大は一箇所。floor/ceilの境界を同じ式で雑に扱わない。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc268/tasks/abc268_e) — source-abc268-e-problem-ebb48085f9132fd7859792492da1d8ac110ddb24ce42343bc916a103a1221c9e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc268/editorial/4777) — source-abc268-editorial-4777-26e9d1b6757939b74bb7bc9f6ed9067ff8db7f5ea5a842cdfbe08a3e624a510c
