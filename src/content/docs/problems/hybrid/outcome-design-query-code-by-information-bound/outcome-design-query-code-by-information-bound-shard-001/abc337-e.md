---
title: "ABC337-E — Bad Juice"
draft: true
authoringUnit: {"problemId":"abc337-e","docPath":"src/content/docs/problems/hybrid/outcome-design-query-code-by-information-bound/outcome-design-query-code-by-information-bound-shard-001/abc337-e.md","learningOutcomeIds":["outcome-design-query-code-by-information-bound"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-interactive-protocol"],"excludedTopics":["情報量下界・query符号設計の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-information-theoretic-query-design","tag-interactive-protocol"],"sourceRevisionIds":["source-abc337-e-problem-c271f91dc94665b3ed37a649a8e7bf4c8ceee5841575043db1b115ac4ab50107","source-abc337-editorial-9140-08f8e16eb890f32d190513e81b876419b7854ca177a47d8c80c5b56ffb6c6261"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"M=ceil(log2 N)なら0,…,N-1は全てM bitで一意である。友人iへi bit目が1のbottleだけ飲ませると、腐ったbottle xによる体調列Sはxのbinary表現と完全に一致する。 各bottleに相異なるM-bit codeを割り当て、体調文字列をそのまま腐敗番号へ復号でき、情報量下界と一致する。","sourceRevisionIds":["source-abc337-e-problem-c271f91dc94665b3ed37a649a8e7bf4c8ceee5841575043db1b115ac4ab50107","source-abc337-editorial-9140-08f8e16eb890f32d190513e81b876419b7854ca177a47d8c80c5b56ffb6c6261"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [情報量下界・query符号設計](src/content/docs/learn/modeling/information-theoretic-query-design.md)

- 応答列の総数からquery数の下界を証明し、それに一致するcodeword割当と復号を構成できる。

先に読む単元:

- [対話protocolを守って情報を取得する](src/content/docs/learn/modeling/interactive-protocol.md) — 問い合わせ形式・回数上限・応答依存性・交互手番・合法な応答・flushを明示し、アルゴリズムをjudgeとの対話列として安全に実行する。

## 考察

M人の体調結果はM bitの文字列なので区別できる候補は高々2^M個である。よってN本を必ず識別するにはM≥ceil(log2 N)が必要で、各bottle番号をそのM bit符号として配れば同じ人数で達成できる。

採用する候補: 0-based bottle番号のbinary bitごとに友人へ飲ませる

棄却する候補: 各友人に一つの連続区間だけを割り当てる二分探索的質問

結果は一晩後に一括で返りadaptiveに次の質問を選べないため、固定区間だけでは一般に最小人数で全番号を符号化できない。

最小のM with 2^M≥Nを出力する。各bit iについて、(j-1)のi bit目が1であるbottle jを昇順に列挙して人数と一覧を出しflushする。長さMのSを読み、S_iをbit iとして整数xを復号しx+1を出力する。

## 典型の発動条件

### 情報量下界

発動条件: 一回の非adaptive検査で各参加者から0/1だけが返る。

結果pattern数2^Mが候補数N以上必要というpigeonhole principleで最小人数を下から抑える。

### binary incidence coding

発動条件: 各対象を、どの検査群へ含めるかのsubsetで識別したい。

対象indexのbit列をmembership vectorとして使い、観測vectorからindexを復元する。

## 問題固有の要素

友人が腹痛になる条件は腐った一本を飲んだかだけなので、複数bottleを混ぜる行為がOR混同を起こさず、唯一の腐敗bottleのmembership codeを直接観測できる。

別の問題へ持ち帰る視点: 欠陥がちょうど一つのgroup testingは、対象ごとのbinary code設計に一致する。

## 正当性

M=ceil(log2 N)なら0,…,N-1は全てM bitで一意である。友人iへi bit目が1のbottleだけ飲ませると、腐ったbottle xによる体調列Sはxのbinary表現と完全に一致する。 各bottleに相異なるM-bit codeを割り当て、体調文字列をそのまま腐敗番号へ復号でき、情報量下界と一致する。

## 実装上の注意

- editorialの0-based bottle jを出力ではj+1へ戻す。Sの先頭をbit 0として配布規則と復号のbit順を一致させ、各出力後にflushする。

## 復習の核

- Nが2の冪の場合と直後、全0のcodeに対応するbottle 1、bit順を逆に読んだ場合をlocal interactorで確認する。

## 計算量と制約

### 時間

O(N log N)、各bitの飲む集合を列挙。

### 空間

O(N)、一集合ずつ出力、復号文字列O(log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer.; 2 \leq N \leq 100

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc337/tasks/abc337_e) — source-abc337-e-problem-c271f91dc94665b3ed37a649a8e7bf4c8ceee5841575043db1b115ac4ab50107
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc337/editorial/9140) — source-abc337-editorial-9140-08f8e16eb890f32d190513e81b876419b7854ca177a47d8c80c5b56ffb6c6261
