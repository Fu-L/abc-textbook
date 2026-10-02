---
title: "ABC420-E — Reachability Query"
draft: true
authoringUnit: {"problemId":"abc420-e","docPath":"src/content/docs/problems/graph-search/outcome-augment-components-with-metadata/outcome-augment-components-with-metadata-shard-001/abc420-e.md","learningOutcomeIds":["outcome-augment-components-with-metadata"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-components"],"sourceRevisionIds":["source-abc420-e-problem-b6016caae15322571513fb4e8ebe0517017b69ad0aca81d2df344d8b777ab3dd","source-abc420-editorial-13740-fbc874bf93e3cbceb11245d4736f4752fe753e5b8cade0041bf7bc50fc97d2c0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"黒数を成分内の黒頂点数とする不変条件は union の加算と toggle の±1で保たれる。到達可能集合は現在の成分だから、find(v) の黒数が正であることが質問の必要十分条件。","sourceRevisionIds":["source-abc420-e-problem-b6016caae15322571513fb4e8ebe0517017b69ad0aca81d2df344d8b777ab3dd","source-abc420-editorial-13740-fbc874bf93e3cbceb11245d4736f4752fe753e5b8cade0041bf7bc50fc97d2c0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

edge追加だけの無向graphではconnected componentsはmergeするだけで分裂せず、type3の答えはvのcomponent内にblack vertexが一個以上あるかだけで決まる。 各vertexの色toggleはその時点のrootが持つblack countを±1すればよく、merge時は二componentのcountを加算できる。 toggle対象vのcomponent代表は過去のunionで変わり得るので、保存した古いrootではなく毎回find(v)してblackCountを更新する。 union by size/rankで新rootを決めた直後に二rootのblackCountを足せば、個々のblack vertexを移し替えずcomponent aggregateを保てる。

採用する候補: componentごとのblack vertex数を追加情報として持つDSU

type1はunion時にsizeとblackCountを合成、type2はcolor配列を反転してfind(v)のcountを更新、type3はroot count>0を判定する。各queryほぼ定数時間。

棄却する候補: type3ごとにvからBFSしてblack vertexを探す

Q=6×10^5で大componentを何度も走査しO(NQ)になり得る。edge削除がないためcomponentを再探索する必要はない。

toggle対象vのcomponent代表は過去のunionで変わり得るので、保存した古いrootではなく毎回find(v)してblackCountを更新する。

union by size/rankで新rootを決めた直後に二rootのblackCountを足せば、個々のblack vertexを移し替えずcomponent aggregateを保てる。

parent,size,blackCount,colorを初期化する。type1(u,v)はrootsが異なればunionしてcount和を新rootへ置く。type2(v)はr=find(v)としてwhite→blackならcount[r]++、逆なら--しcolorを反転。type3(v)はblackCount[find(v)]>0ならYes。

## 典型の発動条件

### augmented DSU

発動条件: merge-only componentに対する集計値queryとvertex属性更新があるとき。

rootにblack数を持ち、unionで加法mergeする。

### component aggregate

発動条件: queryがcomponent内の存在判定で、要素ごとのboolean和で表せるとき。

black存在をblack count>0へ置き換える。

## 問題固有の要素

DSUのconnectivityだけでなく、toggle可能な頂点属性の総数をrootへ持たせればcomponent存在queryまで同じ構造で処理できる。

別の問題へ持ち帰る視点: merge可能aggregateに加えて要素更新があるDSUでは、更新時に現在rootへ差分を入れればよい。

## 正当性

黒数を成分内の黒頂点数とする不変条件は union の加算と toggle の±1で保たれる。到達可能集合は現在の成分だから、find(v) の黒数が正であることが質問の必要十分条件。

## 実装上の注意

- 同component内へのedge追加ではcountを二重加算しない。toggle前のcolorを保持し、path compression後のrootへ±1する。

## 復習の核

- isolated vertexのtoggle、同component内edge追加、black頂点を含む二componentのmerge、最後のblackをwhiteへ戻す例を愚直component探索と比較する。

## 計算量と制約

### 時間

N 頂点、Q 操作で O((N+Q)α(N))。

### 空間

DSU、色と成分黒数で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 2 \times 10^5; 1 \le Q \le 6 \times 10^5; Type 1 queries satisfy the following constraints: 1 \le u < v \le N For each query, no edge connecting u and v has been added before that query.; 1 \le u < v \le N; For each query, no edge connecting u and v has been added before that query.; Type 2,3 queries satisfy the following constraints: 1 \le v \le N; 1 \le v \le N

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc420/tasks/abc420_e) — source-abc420-e-problem-b6016caae15322571513fb4e8ebe0517017b69ad0aca81d2df344d8b777ab3dd
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc420/editorial/13740) — source-abc420-editorial-13740-fbc874bf93e3cbceb11245d4736f4752fe753e5b8cade0041bf7bc50fc97d2c0
