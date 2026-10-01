# PR #63 Unit粒度と章構成の再整理

対象: https://github.com/Fu-L/abc-textbook/pull/63#issuecomment-5829273673

Fu-Lの追加レビューと修正・push指示を受け、Inventoryの採用解法から分類を再検討した。Codexによる修正と検証の記録であり、人間による独立再査読を表すものではない。

## DPの二つの状態軸

`unit-dp-subset-resource`を資源・容量DPに狭めた。0/1選択と無制限選択の更新方向を教え、その子にはeventual
unbounded
knapsackだけを置く。`unit-dp-subset-state`はDP章直下へ移した。資源量の値を状態にする場合と、使った要素の集合を状態にする場合は、どちらも状態設計から直接進む兄弟技能である。

## 単一サイクルと寄与の数え上げ

ABC226 Eのhomeをgraph coreへ移した。各連結成分でE=Vを調べるとcycle
rankは1になり、木部分の向きは強制、cycleの向きだけ二通り残る。葉刈りはこの構造を可視化する手段であり、EとVによる判定には不要である。DSUによる成分管理と法上の計算は既習技能に残した。

主客転倒のOutcomeは「対象を一意に固定して、その対象を含む選択数や指示変数の期待値を先に求める」と定めた。本文では要素、pair・endpoint、値・区間、期待値の認識パターンを並べ、単なる独立成分の積を範囲から外した。

## ABC254 Exと組合せ章

ABC254
Ex専用のTag・Outcome・Unitを削除し、交換論Unitの複合例へ置いた。二進操作を木の祖先移動へ写し、深い一致を先に確定する説明を残した。専用語を独立技能へ昇格させず、変換と貪欲選択の正当化を再利用点にした。

組合せ・代数章はround 5時点で、二項係数・包除・反射原理、Möbius反転・部分集合変換・subset
convolution、Prüfer・Burnside・Dilworth・RSK・削除縮約の順へ並べ直した。後続レビュー (issuecomment-5893837694)で冒頭の5
Unitを、組合せ係数・包除・約数反転・subset変換・反射原理の順に再調整した。それ以降の相対順と前提DAGは維持し、目次とsidebarだけを更新する。

生成後の分類は204 Tag・224 Outcome・229 Unit、配置は868問。canonical教材・配置・目次を同期した。
