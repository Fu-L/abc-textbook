---
title: "ABC350-F — Transpose"
draft: true
authoringUnit: {"problemId":"abc350-f","docPath":"src/content/docs/problems/string-geometry/outcome-query-recursively-defined-string/outcome-query-recursively-defined-string-shard-001/abc350-f.md","learningOutcomeIds":["outcome-query-recursively-defined-string"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["明示された文字列への接尾辞索引の構築。"],"tagIds":["tag-recursive-compressed-string"],"sourceRevisionIds":["source-abc350-editorial-9820-549515ed8d09eb95e0a434d4ec275e0301e82b6916862a383d68a0842b756fd5","source-abc350-f-problem-4739078c1c1a4520eff726101b57fa7e3fd82c645cc07c657b265f658b31d0d6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"文字のcaseは各包囲括弧で一回反転するのでdepth奇偶が最終caseを決める。区間reverseは対応括弧へjumpし方向を反転すると、その内部を逆順に読む再帰と同じ順を生成する。nested括弧で方向反転が重なることも再帰と一致し、各文字を一度出力して括弧を除けば全操作後の列になる。","sourceRevisionIds":["source-abc350-editorial-9820-549515ed8d09eb95e0a434d4ec275e0301e82b6916862a383d68a0842b756fd5","source-abc350-f-problem-4739078c1c1a4520eff726101b57fa7e3fd82c645cc07c657b265f658b31d0d6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-query-recursively-defined-string"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=a(bC)d。","procedure":["内側bCをreverseしてCb、case toggleでcB。","外側a,dと繋ぐ。"],"executionTarget":null,"expectedResult":"acBd。","verificationStatus":"not_applicable","learningUnitIds":["unit-recursive-compressed-string"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-query-recursively-defined-string"],"prerequisiteIds":[],"attainmentCondition":"S=(a(bC))では。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"bCA。"},"answer":{"reasoningOrVerification":"内側はcB、外側acBをreverseしてBca、toggleしてbCA。二重包囲のb,Cはcaseが元へ戻る。","procedure":["具体例の各状態・寄与を再計算する。","内側はcB、外側acBをreverseしてBca、toggleしてbCA。二重包囲のb,Cはcaseが元へ戻る。"],"expectedResult":"bCA。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [圧縮・反復・再帰文字列へ問い合わせる](src/content/docs/learn/string/recursive-compressed-string.md)

- 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 明示された文字列への接尾辞索引の構築。

## 考察

文字のcase反転回数はその文字を囲むparenthesis depthに等しく、奇数depthだけ事前toggleできる。残る効果は各matched区間で走査方向を反転することだけである。

採用する候補: 括弧matchを前計算し、pointerと方向を反転させながら一度走査する

nested reversalを文字列の実体反転なしで表現し、各positionをO(1)回訪れて線形時間にできる。

棄却する候補: innermost pairごとにsubstringをreverseして置換する

長いnested区間を何度もcopy/reverseするとO(|S|^2)になり得る。

位置iがparenthesisなら対応位置match[i]へjumpし、directionを反転することで、その括弧内部を反対向きに読む再帰と同じ巡回順になる。括弧を跨ぐたびdirectionが戻るためnested構造も自然に処理できる。

stackで全parenthesis pair matchを求める同時にdepthを走査し、letterはdepth oddならcase toggleして保存する。i=0,dir=+1から、letterなら出力、parenthesisならi=match[i],dir=-dirとし、その後i+=dirする。範囲外へ出るまで続ける。

## 典型の発動条件

### matched delimiter jump

発動条件: properly nestedな区間ごとに内部走査方向が反転する。

open/close対応indexを持ち、delimiter到達時に相手側へjumpしてdirection符号を変える。

### depth parityによる作用合成

発動条件: 各外側括弧操作が内部文字のcaseを一回toggleする。

囲む区間数の偶奇だけを持ち、odd depthの文字を一度だけ反転する。

## 問題固有の要素

reversalとcase toggleを分離すると、caseは静的なdepth parity、順序はdirection付きwalkとなり、複雑な操作順の独立性を直接実装できる。

別の問題へ持ち帰る視点: nested区間作用は可換な属性変換と順序反転を別々のparity状態へ分解できる。

## 正当性

文字のcaseは各包囲括弧で一回反転するのでdepth奇偶が最終caseを決める。区間reverseは対応括弧へjumpし方向を反転すると、その内部を逆順に読む再帰と同じ順を生成する。nested括弧で方向反転が重なることも再帰と一致し、各文字を一度出力して括弧を除けば全操作後の列になる。

## 実装上の注意

- parenthesis自体は出力しない。jump後にdirectionを反転してから一歩進める順序を固定し、|S|=5×10^5でも再帰stackを使わない。

## 復習の核

- 括弧なし、単一(ab)、二重((ab))、連結区間(a)(b)、大小混在を手操作結果と比較する。

## 計算量と制約

### 時間

O(|S|)。括弧対応とdepth、jump走査。

### 空間

O(|S|)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le |S| \le 5 \times 10^5; S consists of uppercase and lowercase English letters, (, and ).; The parentheses in S are properly matched.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=a(bC)d。

1. 内側bCをreverseしてCb、case toggleでcB。
2. 外側a,dと繋ぐ。

期待される結果: acBd。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=(a(bC))では。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

内側はcB、外側acBをreverseしてBca、toggleしてbCA。二重包囲のb,Cはcaseが元へ戻る。

確認結果: bCA。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc350/editorial/9820) — source-abc350-editorial-9820-549515ed8d09eb95e0a434d4ec275e0301e82b6916862a383d68a0842b756fd5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc350/tasks/abc350_f) — source-abc350-f-problem-4739078c1c1a4520eff726101b57fa7e3fd82c645cc07c657b265f658b31d0d6
