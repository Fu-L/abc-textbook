# PR #65 第七回レビューの本文補修

対象: <https://github.com/Fu-L/abc-textbook/pull/65#pullrequestreview-5400120233>

全868問を、採用アルゴリズム・正当性・計算量の観点で横断点検した。分野別にはデータ構造94問、DP174問、グラフ・探索172問、複合202問、数学147問、文字列・幾何79問。疑わしい箇所は本文全体と公式問題・解説に戻り、指摘4問と追加11問を修正した。この横断点検と有限検算は、全868問の数学的正しさを自動証明するものではない。

## 根本原因

公式解説の言い換えと最終値の一致だけでは、誤った条件や証明の欠落を見逃す。ABC318
Exでは「最大重み」という誤条件でも対称性で総数が一致するため、各入力のAC/WA判定を元の操作から確認する必要があった。また、構成が合法という片方向の説明、定理名だけの上界、具体的に動かす対象のない交換論、局所graphやqueryの写像を省いた実装説明が残っていた。

元の条件から還元の両方向を導くこと、貪欲ではrelease・deadline・先行関係を同時に守る変形を示すこと、圧縮では物理的な整合性まで証明することを補修の基準にした。ARC・AGC・CF
Div.
1・UCUPに持ち出せる典型として、結論の暗記ではなく証明と実装を再構成できる説明にする。[執筆手順](../../operations/problem-shards.md#還元の両方向と実行手順の点検)にも基準を追加した。

## 補修範囲

| 問題      | 修正・追加した内容                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| ABC318 Ex | cycleの削除辺を操作順から特定し、最大を最小へ訂正。cycle誤差の非負性、EGFが片方AC全体を数えること、両者ACの共通分、個別判定の反例を説明        |
| ABC461 G  | 任意の合法Wをcopyへ等分し、matching両端と未匹配頂点を足す上界を証明。孤立頂点も含め、追加前提外のLP半整数性を不要にした                        |
| ABC304 Ex | deadline逆伝播後のsuccessor chain交換を具体化。各移動のrelease・deadline・辺順序、候補なしの不可能性、heapへの追加時点を説明                   |
| ABC301 Ex | 二回のDSU sweepでD=wだけを残す。union前の局所番号化とquery写像、bridge child subtreeのXOR、平行辺、batch全体の計算量を明記                     |
| ABC231 H  | 重複を含む仮の補完費用Fを定義し、実辺被覆→matchingの非増加変形とmatching→実辺被覆の両方向を証明                                                |
| ABC263 G  | 一辺容量を切るか否かのmin-cutから二直線の下包絡を導出。二回のmaxflowで全容量値を復元し、整数交点だけを比較。素数表の費用も計上                 |
| ABC302 Ex | min(V,E)の上界と、木・cycle・self-loop・平行辺での達成構成。同成分辺追加を含むrollback更新を具体化                                             |
| ABC311 F  | 対角線の実在範囲・全白境界・初期値を定義。有効範囲だけを走査するsuffix DPからO(NM)を導出                                                       |
| ABC354 G  | 重みを概念上のtwinへ展開して重みなしDilworthを適用。展開matchingと整数flowの両方向の対応、具体的なflow計算量を説明                             |
| ABC361 G  | 曖昧な境界event処理を、空の行区間と空行blockのgraphへ置換。外周連結性、区間重なりの接続、整数点数、線形状態数を証明                            |
| ABC388 F  | D=(B−1)(B−2)以上の距離の表現を構成。小距離DPの初期値、複数の短い区間を越える一歩、M=0の計算量を明記                                            |
| ABC390 E  | 目標量tに必要な最小予算b_v(t)でwater-fillingを証明。tieやplateauでも余計な予算を使わないことを示す                                             |
| ABC431 E  | 単純方向状態路と物理マスの再訪を区別。四portのmatching整合性と二度使う変更マスの短絡で両方向を証明。最後の鏡を処理して指定出口へ出る条件も明記 |
| ABC435 F  | 猫が残存区間の最大塔である不変量、極大状態への移動の実現、左右最大塔を経由する候補の支配を具体化                                               |
| ABC453 F  | 未着色葉Rに対する最大group≤ceil(R/2)の不変量を証明。新色の最後の一葉と、同色配布途中の最後の一葉を区別し、全edge cutのpartnerを示す            |

各本文のrevisionを一回増やし、correctness
Claim・入力packet・checks・review・私用HTML・snapshotを同期した。既存の分類、前提、Source
Revision、凍結indexを維持する。公式の誤記はoriginal_proofとofficial_source_conflict、補う独立証明はoriginal_proofとして追加再照合を記録し、draftと未実施のhumanApprovalを保持する。

## 独立検算

`pr65-review7-mathematical-checks.py`はPython
3.9以上・追加依存なし。本文の一般証明を、元の操作や全探索による別モデルで補助検証する。

- ABC318 Ex:
  N=1..4の全617入力で、辺削除subsetによる最適値、Alice/Bobの逐次操作、個別AC/WA、EGF総数を比較。
- ABC461 G: 5頂点以下の全単純graphを調べ、上限2の全整数割当とcopy
  matchingを比較。3頂点以下は上限4でも比較。孤立頂点を含む。
- ABC304 Ex: 1,500件のDAG・release・deadlineを全順列と比較し、実行可能な延長からsuccessor
  chain交換を実際に行って各段の合法性を検査。
- ABC301 Ex: 350件の多重graphで全辺・全端点対を検査。二回のDSU、union前の局所写像、edge
  IDを使うlowlinkとtin/toutのXORを、変更後の閾値探索と比較。
- ABC231 H・ABC263 G・ABC302 Ex・ABC354
  G: 小さい辺被覆、個体pairing、端点選択、antichainを全探索し、還元先の値と比較。
- ABC311 F: 2×3・3×2までの全強制盤面と全完成盤面を比較。1行・1列も含む。
- ABC361 G: 700件の疎な盤面を全grid flood fillと比較。
- ABC388 F: 1,800件の禁止点・step条件を全位置DPと比較。
- ABC390 E: tie・plateauを含む900件の単調予算列を全配分と比較。
- ABC431 E: 2×3・3×2までの全初期配置に対し、全固定鏡配置の光線simulationと01-BFSを比較。
- ABC435 F: N=6までの全高さ順列で、猫以外の塔の撤去も含めた全操作状態とCartesian Tree DPを比較。
- ABC453 F: 1,000件の木・容量候補を標本生成し、構成対象について色容量と全辺切断後の共通色を確認。

先行六つの検算と合わせてCIで実行する。構造検査を数学的点検の代わりに扱わず、本文とcorrectness
Claimの一致・全248 shardの証跡・build・リンク・E2Eも既存の検証経路で確認する。

## 実行結果

Node 24.18.0 / npm
11.16.0で先行六本と今回の数学回帰検算がすべて成功。`npm run verify:fast`はlint・format・型検査、57
file / 481 test、全868問 / 248 shardの証跡、232 Unitの前提と到達性、build・リンク、三ブラウザの99
E2Eを通過した。最終追記したABC431
Eのport短絡証明は、当該shardの再生成とcheckで本文・Claim・証跡の一致を再確認した。`git diff --check`も成功した。
