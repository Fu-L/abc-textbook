# 新規執筆・再執筆はfull、旧短縮形式は互換維持

新規執筆と今回の全面再執筆は、全問で単独で学べるfullを使う。入力packetの`placementCandidate`は`primaryProblemId: null`、`comparison: null`、`additionalElement: null`とし、正本と照合する。既存868問はすべてfullであり、所属・関連先・問題順の変更や一括変換は不要である。

以下は既存短縮形式を扱う互換規則であり、今回の再執筆で説明を省略するために適用しない。primary Problemがあり、学習成果、前提、主解法、証明着眼点、漸近計算量のすべてが同じと根拠付きで確認できる場合だけ短縮形式を検討する。

- `similar`: 上記がすべて同じで、新しい独立要素がない。
- `supplement`: 上記がすべて同じで、学習成果を補強する一つの追加要素がある。
- `full`: primary/comparisonがない、比較項目が一つでも異なる、または複数の追加要素や新しい主成果がある。

similar/supplementはprimary Problemとの差分を明記する。分類を短くする目的で比較不足を「同じ」と扱わない。

`classifyExplanationKind`・`prepareExplanationAuthoring`・`validateAuthoringOutput`はこの互換判定を維持する。全full方針は通常packetの3欄をnullにして実現し、分類器の返値をfullへ固定しない。`primaryOutcomeId`やhome Unitは解説形式とは別の分類情報であり、fullにするために所属・関連先・前提を変えない。

`src/content/policies/problem-placements.json`の`comparison`は配置理由を説明する既存の文章欄であり、packetの5項目の真偽値とは別契約である。packetのnull指定を正本へ転記せず、正本の比較理由・`sharedOutcomeIds`等を保持する。fullの`kind`・参照元と本文形式が一致することを公開loaderで確認する。
