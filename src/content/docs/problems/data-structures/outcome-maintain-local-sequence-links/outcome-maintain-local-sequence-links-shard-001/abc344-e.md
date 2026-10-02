---
title: "ABC344-E — Insert or Erase"
draft: true
authoringUnit: {"problemId":"abc344-e","docPath":"src/content/docs/problems/data-structures/outcome-maintain-local-sequence-links/outcome-maintain-local-sequence-links-shard-001/abc344-e.md","learningOutcomeIds":["outcome-maintain-local-sequence-links"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["全候補の大小順や区間集約を保つ平衡木・heap。"],"tagIds":["tag-linked-list-index"],"sourceRevisionIds":["source-abc344-e-problem-9750c819834eb24232bb9607c3292c04156a042d874f5469dbc4016bada17b13","source-abc344-editorial-9487-09db599fbdc3f6335c1e46f22db6d3a1a778659c300cb03a623af9d914d338de"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"distinct value保証によりvalue自身をnode identityとして使える。xの直後y挿入ではy.prev=x,y.next=x.nextとし両隣を繋ぎ直し、x削除ではx.prev.next=x.nextとx.next.prev=x.prevだけを更新すれば順序不変条件が保たれる。 xのnodeをO(1)期待で特定し、挿入・削除を前後pointerの定数更新で処理できる。","sourceRevisionIds":["source-abc344-e-problem-9750c819834eb24232bb9607c3292c04156a042d874f5469dbc4016bada17b13","source-abc344-editorial-9487-09db599fbdc3f6335c1e46f22db6d3a1a778659c300cb03a623af9d914d338de"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-local-sequence-links"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"初期(4,7)、4の直後へ9を挿入し7を削除。","procedure":["4→9→7へlinkを張る。","7の両隣を直結して末尾へ繋ぐ。"],"executionTarget":null,"expectedResult":"最終列(4,9)。","verificationStatus":"not_applicable","learningUnitIds":["unit-linked-list-index"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-local-sequence-links"],"prerequisiteIds":[],"attainmentCondition":"先頭4を削除する場合も同じspliceでよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"head sentinelを前ノードとして持てばhead.next=9で統一できる。"},"answer":{"reasoningOrVerification":"head sentinelを前ノードとして持てばhead.next=9で統一できる。","procedure":["具体例の各状態・寄与を再計算する。","head sentinelを前ノードとして持てばhead.next=9で統一できる。"],"expectedResult":"head sentinelを前ノードとして持てばhead.next=9で統一できる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [要素索引と連結リストで局所linkを更新する](src/content/docs/learn/query/linked-list-index.md)

- 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 全候補の大小順や区間集約を保つ平衡木・heap。

## 考察

queryは既知の値xの直後挿入またはx自身の削除であり、位置indexによるrandom accessは不要である。各valueから前後valueへ直接辿れるようにすれば、変更箇所は常に定数本のlinkだけになる。

採用する候補: valueをnode keyとするdoubly linked listをhash mapで実装する

xのnodeをO(1)期待で特定し、挿入・削除を前後pointerの定数更新で処理できる。

棄却する候補: vectorの途中へinsert/eraseする

後続要素のshiftが一query O(|A|)となり、合計二乗時間になり得る。

distinct value保証によりvalue自身をnode identityとして使える。xの直後y挿入ではy.prev=x,y.next=x.nextとし両隣を繋ぎ直し、x削除ではx.prev.next=x.nextとx.next.prev=x.prevだけを更新すれば順序不変条件が保たれる。

各valueに(prev,next)を持つ連想配列を作り、head/tail sentinelも接続する。type 1はxとそのnextの間へy nodeを挿入し、type 2はxの両隣を直結してmapからxを消す。最後にhead.nextからtailまでnextを辿り出力する。

## 典型の発動条件

### doubly linked list

発動条件: 既知node位置での挿入・削除を頻繁に行い、最後に順序走査したい。

prev/next双方を持ち、局所linkの張替えだけで操作する。

### key-to-node indexing

発動条件: 操作対象が位置でなく一意なvalueで指定される。

hash mapでvalueからlink情報へ直接accessし、linear searchを避ける。

## 問題固有の要素

通常のlist iteratorを保存する代わりに、値が全て一意という条件を利用してprev/nextをvalue同士のmapとして直接表せる。

別の問題へ持ち帰る視点: 一意key指定のlinked sequenceはnode objectなしでもkey→neighbor mapsで実装できる。

## 正当性

distinct value保証によりvalue自身をnode identityとして使える。xの直後y挿入ではy.prev=x,y.next=x.nextとし両隣を繋ぎ直し、x削除ではx.prev.next=x.nextとx.next.prev=x.prevだけを更新すれば順序不変条件が保たれる。 xのnodeをO(1)期待で特定し、挿入・削除を前後pointerの定数更新で処理できる。

## 実装上の注意

- 先頭・末尾削除をsentinelで統一し、挿入時は旧nextを保存してから4本のlinkを更新する。削除済みnode情報を後のlookupに残さない。

## 復習の核

- head/tail削除、末尾挿入、挿入直後の削除、長さ1を保つ操作列でlinkの双方向整合性を検査する。

## 計算量と制約

### 時間

hash map版は期待O(N+Q)、平衡木版はO((N+Q)log(N+Q))。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 1 \leq Q \leq 2\times 10^5; 1 \leq A_i \leq 10^9; A_i \neq A_j; For queries of the first type, 1 \leq x,y \leq 10^9.; When a query of the first type is given, x exists in A.; For queries of the second type, 1 \leq x \leq 10^9.; When a query of the second type is given, x exists in A.; After processing each query, A is not empty, and its elements are distinct.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

初期(4,7)、4の直後へ9を挿入し7を削除。

1. 4→9→7へlinkを張る。
2. 7の両隣を直結して末尾へ繋ぐ。

期待される結果: 最終列(4,9)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

先頭4を削除する場合も同じspliceでよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

head sentinelを前ノードとして持てばhead.next=9で統一できる。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc344/tasks/abc344_e) — source-abc344-e-problem-9750c819834eb24232bb9607c3292c04156a042d874f5469dbc4016bada17b13
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc344/editorial/9487) — source-abc344-editorial-9487-09db599fbdc3f6335c1e46f22db6d3a1a778659c300cb03a623af9d914d338de
