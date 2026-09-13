# PR #63 技能の前提・学習段階・主技法の修正

対象: https://github.com/Fu-L/abc-textbook/pull/63#issuecomment-5647419452

Fu-Lの修正・push指示に基づきCodexが修正・検証した記録。Inventoryを正として採用解法を照合した。人間による独立再査読を表すものではなく、既存のsolo-maintainer運用で生成物を同期する。round3のゲーム・LISの前提、少数Unitだけのstage補正、例外なしのprimary昇格規則を本記録で置き換える。

## 技能自体の前提と問題の必要技能

ゲームの勝敗・Grundy Outcomeから部分集合状態の前提を外した。前提はDP状態設計に限定する。ABC297
G・255 G・368 Fへ集合状態を要求せず、ABC354
Eにはゲームと集合状態の両Outcomeを残す。問題を後ろへ配置するために技能全体の前提を強めないことをpolicyに明記した。

基本LISは長さ別最小末尾の支配関係と二分探索に限定し、区間monoidの前提を外した。ABC439 E・393 F・369
Fをこの技能へ配置する。値別最良状態の区間集約は別のTag・Outcome・Unitへ分離し、ABC240 Ex・339 E・354
F・360 G・410 GをInventoryの採用実装に従って配置する。特にABC339
Eでは小さい末尾の支配関係が成り立たないこと、ABC354
Fでは最長解への所属条件とLISの計算法が別の観察であることを本文に記した。

## 全Unitの学習段階

`final-taxonomy-curriculum.ts`に全227
Unitを明示した。目次専用Unitは段階0、教えるUnitは次の5段階とし、旧rankや目次の深さへのfallbackを廃止した。

1. 状態・順序・集約の基礎、探索・貪欲・基本DP・DAGのtopological sort・基本演算。
2. 標準データ構造とDP、weighted shortest path・topological
   sort・SCC・LCA・木DP・rerooting・基本matching/flow。
3. 複合データ構造、各種変換、連分数・Stern–Brocot、基本凸最適化などの応用。
4. 発展的な木DP・flow/matching・凸最適化・数え上げ・多項式算法。
5. Min_25・RSK・線形matroid交差・FPS合成・高度な係数抽出。

prerequisite
DAGを最優先し、実際の標準順でも段階2の主要グラフ・木・flow技能が連分数・凸最適化へ先行することを検証する。Unit内の基本例→発展例の順は保つが、集合状態を使うABC354
Eを通常のゲーム全体より先行させる制約は外す。

## 掲載位置とsemantic primary

全問題の掲載位置は必須Outcome全体の最遅Unitとする。primaryは原則としてそのUnitの技能に合わせる。理由付きの`READINESS_PRIMARY_OVERRIDES`を別の入力とし、例外では元のsemantic
primaryとclaimの主・補助の役割を保存する。例外のOutcome・理由・担当者を`primaryOverride`として配置表とcanonical
metadataにも残す。

ABC354 Eは勝敗再帰をsemantic
primary、集合状態をsupportingとして保持し、掲載先を部分集合状態Unitとする。例外なしの場合には同じ必要技能から集合状態がprimaryへ昇格することも確認する。新しいstage順でABC218
Fは経路証明を踏まえた変更影響の局所化、ABC335 Gは位数を踏まえた巡回群の指数化がprimaryになる。

## IDと正規表現

Frobeniusのcanonical
Outcomeを`outcome-accelerate-iteration-by-characteristic-p-frobenius`へ改名し、旧orbit
decompositionのIDを生成元・scope・前提辺・配置・manifestから除く。

母関数のtriggerは`escapeRegexLiteral('F=xΦ(F)')`で生成し、実際の数学記法に`iu`正規表現で一致するfixtureへ追加した。

202 Tag・212 Outcome・227 Unit（標準学習順193 Unit）、868問。生成元からcanonical
metadata・Unit本文・配置・学習順・schema・検証記録を同期する。

## 検証

既存のtaxonomy検査に、全Unitのstage網羅、基本技能の先行、ゲームとLISの前提の独立性、主技法例外と掲載readinessの分離、数学記法のliteral
matchを追加した。受理処理の実行結果は`final-taxonomy-check-results.json`へ記録する。型検査・lintとcanonical
materializationの一致も確認する。
