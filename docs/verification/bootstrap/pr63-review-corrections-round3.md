# PR #63 学習順・分類の修正

対象レビュー:

- https://github.com/Fu-L/abc-textbook/pull/63#issuecomment-5613333410
- https://github.com/Fu-L/abc-textbook/pull/63#issuecomment-5613536039

Fu-Lの修正・push指示に基づきCodexが修正・検証した記録。Inventoryを正とし、採用解法の記述から教材への配置を再検討した。人間による独立再査読や、全問題の解説本文執筆を表すものではない。既存のsolo-maintainer運用に沿って生成物を更新する。round2の学習順規則は本記録で置き換える。

## 学習順の規則

- `parentId`は目次の包含関係だけを表す。Unitの前提は明示的なcurriculum
  prerequisiteとOutcome前提から導く。
- 章・構造節を`standardOrder`から除外する。教えるUnitの`globalIndex`は標準順の位置、構造節の表示位置は最初の学習子孫から導く。目次のDFSと教科書全体の学習順は区別する。
- 見出しの深さによるstageRankを廃止。状態探索、DSU、heap、ordered set、doubling、Fenwick
  Tree、区間monoidを基礎、Min_25・RSK・線形matroid intersection・FPS compositionを発展とする。
- 問題は、想定解法の再構成・実装に必須な全Outcomeの最遅Unitへ置く。最後に学ぶ技能をprimaryとし、従来の主技能はco-primaryとしてclaim単位の根拠を保持する。Inventoryの補助技能欄に記載されていることだけで掲載を早めない。
- 技能集合の真部分集合関係を問題間の強制的な前提にしない。基本的な定式化から複合・発展的な定式化へ進む編集順位を優先する。

## 指摘ごとの対応

1. ABC450 F・327 Fを区間作用、ABC370 Fをdoublingへ移動。ABC265
   Exも畳み込み・XOR変換・数ゲームのすべてを学んだ位置へ移動。全868問の必須Unitが主配置より後にならないことを検証する。
2. 367 Eをdoublingの先頭にし、216 F→321 F、314 F→235 Ex、294 G→298 Ex、354 E→255 G、275 E・298 E→226
   Hを固定。ゲームの集合状態は部分集合状態の後に学ぶ。
3. 基礎技能と専門的な発展技能の順序を、前提DAGを満たしたうえで内容に基づくrankで決める。
4. 列・区間DPを案内節にし、列DP、LIS、prefix分割、区間合成・領域分割、区間拡張へ分割。339 E・369
   F・393 F・354 FをLIS、262 Gを区間合成、273 F→219
   Hを区間拡張へ配置する。LIS節はtailsと値域最大の比較を扱うため、区間monoidも先行させる。
5. ABC244
   Fを状態グラフ探索へ変更。maskの反転による閉路、単位重みの多始点BFS、空walkの扱いを記述し、部分集合DPとの違いを示す。
6. ABC435 GをDP遷移高速化へ移動。全体affine変換と対称差への疎な更新を、372 Fの添字移動・457
   Fの全体倍率と比較する。不要な区間作用の技能を外す。
7. ABC374 FはInventoryにある順序保存のbatch
   DPに従いprefix分割DPへ移動。最適時刻をT_i+kXへ絞る証明を先に行い、その後で添字化する。座標圧縮の基礎節では元座標・間隔の保持を明記する。
8. 母関数の符号化と高度な係数抽出を分離。同じ発展節の中にLagrange反転、微分による係数漸化式、Euler積の疎展開という別Outcomeを設ける。222
   Hの反転・係数漸化式、230 Hの対数微分、279 Exの五角数定理を接続し、Lucasは組合せ係数の節で扱う。
9. ABC236 E・294 Fに比率parametric
   searchを接続。平均値のA_i−x、経路の利得−x·費用、濃度の砂糖量−x·総重量を比較し、236
   Eの中央値側の±1変換を区別する。
10. ABC260
    Fを有界探索へ移動。候補総数を界す探索と成功前の失敗回数を界す探索を区別し、端点対の衝突による早期終了の計算量を説明する。

201 Tag・211 Outcome・226 Unit、うち標準学習順は192
Unit。問題数は868のまま。生成元から配置表、Unit本文、canonical
metadata、目次順、schema、検証記録を同期する。

## 検証

レビューで指定された配置・先行関係、全868問のreadiness、基礎技能→発展技能、構造節の標準順からの除外を回帰検証に追加した。技能集合の小さい連続確率問題が基本的な離散確率DPに先行する旧挙動も検出する。既存の分類検証では、主・共主の交代後も採用技能とclaim単位の根拠を失わないことを確認する。

受理処理の各check結果は`final-taxonomy-check-results.json`に記録する。全体検証の結果は作業完了時に報告する。
