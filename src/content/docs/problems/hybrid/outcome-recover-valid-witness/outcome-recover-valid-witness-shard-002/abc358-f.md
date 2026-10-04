---
title: "ABC358-F — Easiest Maze"
draft: true
authoringUnit: {"problemId":"abc358-f","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-002/abc358-f.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness"],"sourceRevisionIds":["source-abc358-editorial-10222-fe9e7381e43a0e97ee4abbc7649ef7e3ff6d224a4a46e7d042ab685e16ba82d5","source-abc358-f-problem-10dc7b1dbf735ed686b12077ee24559ce712c76dcfaee3b541cd3d97cd9e510b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"指定端点間の距離と二部彩色からK≥N,K≡N (mod 2)が必要である。二行ブロックはdistinctな2w個のcellを通り、前後のブロックとの接続も隣接している。w=1,…,Mにより0,2,…,2(M−1)の全増分を得られる。N偶数ではN/2ブロックで最大NMまでの全許容Kを作れる。\n\nN奇数の最後三行は、低extra分岐で0,…,2(M−1)の偶数増分を、高extra分岐でさらに0,…,2floor((M−1)/2)の偶数増分を実現する。各四cell迂回は中段の二cellを四cellへ替えるので+2、使用する二列は互いに素で最後の下段右端にも触れない。最後三行の最大増分は2(M−1)+2floor((M−1)/2)。通常ブロックと合計すれば、M奇数でNM、M偶数でNM−1までの全許容Kを覆う。後者はN奇数の必要parityからKも奇数なので入力上の最大許容値である。よってextraは必ず0へ至り、K個のdistinctなcellが指定端点へ隣接順につながる。\n\n全cell間の壁を閉じてからこの経路の辺だけ開くため、入口から出口へつながる通路成分はちょうど作った一本の経路となり、通過cell数Kと分岐がない条件を満たす。","sourceRevisionIds":["source-abc358-editorial-10222-fe9e7381e43a0e97ee4abbc7649ef7e3ff6d224a4a46e7d042ab685e16ba82d5","source-abc358-f-problem-10dc7b1dbf735ed686b12077ee24559ce712c76dcfaee3b541cd3d97cd9e510b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

この解説で扱わないこと:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

0-indexで入口cellを(0,M−1)、出口を(N−1,M−1)とする。最短経路のcell数はNなのでK≥N、二部彩色によりK≡N (mod 2)が必要。K≤NMは入力制約である。この条件を満たす全Kに対し、distinctなK個のcellからなる経路を先に作り、全壁のうち連続pairの壁だけを開く。

extra=K−Nは増やすcell数で、常に偶数。通常の二行ブロックi,i+1は、上段を右端から幅wだけ左へ進み、下段を左から右へ戻る。w=1+min(M−1,extra/2)を選べば、基準の二cellに対し2(w−1)個を増やせる。各ブロックは上段右端から下段右端で終わるため、そのまま次へ連結できる。

Nが偶数なら全行を二行ずつ処理する。Nが奇数なら最後の三行を別処理する。三行の残extraが2(M−1)以下なら、上二行を同じ構成にして最後の右端cellへ進む。それを超えるなら上段を右から左へ全部通り、中段を左から右へ戻る途中で、二列ごとに下段へ回る四cellの迂回を挿入する。具体的には次の手順になる。

```text
path = []; extra = K-N; i = 0
while i+1 < N:
    if N is even or i < N-3:
        w = 1 + min(M-1, extra/2)
        append (i,j) for j = M-1 down to M-w
        append (i+1,j) for j = M-w up to M-1
        extra -= 2*(w-1); i += 2
    else:
        if extra <= 2*(M-1):
            w = 1 + extra/2
            append (i,j) for j = M-1 down to M-w
            append (i+1,j) for j = M-w up to M-1
            append (i+2,M-1)
            extra = 0
        else:
            append (i,j) for j = M-1 down to 0
            extra -= 2*(M-1); j = 0
            while j < M:
                if extra > 0:
                    append (i+1,j), (i+2,j), (i+2,j+1), (i+1,j+1)
                    extra -= 2; j += 2
                else:
                    append (i+1,j); j += 1
            append (i+2,M-1)
        break
```

奇数Nの高extra分岐で最後の下段右端を先に使わないことが肝心である。通常ブロックを最大幅にしてからここへ来るので、この分岐のextraは最大2floor((M−1)/2)。従って迂回は左端から高々floor((M−1)/2)組の二列を使い、右端の下段cellは最後に残る。M=1ならextra=0で、二行と最後一行の縦経路だけとなる。

出力は(2N+1)×(2M+1)。偶数行・偶数列の交点を+、cell中心をo、cell間を横壁−・縦壁|で閉じる。連続cell pairの中心座標(2r+1,2c+1)の中点を.にし、上辺(0,2M−1)をS、下辺(2N,2M−1)をGとする。経路以外は閉じたままなので枝もshortcutも生じない。

## 典型の発動条件

### 二部graphのpath parity

発動条件: grid上で指定端点間のpath頂点数に制約がある構成問題。

checkerboard色からpath長の必要parityを得る。

### path-first constructive output

発動条件: 壁配置など表現が複雑だが、望む通路graphは単純な形のとき。

先に頂点列を構成し、出力表現を後から機械的に生成する。

## 問題固有の要素

長さを一マスずつでなく2マス単位のdetourで増やすことが、parity必要条件とそのまま対応して十分性を示す。

別の問題へ持ち帰る視点: 構成問題では必要条件の差分単位を実現する局所gadgetを作り、最小構成から積み上げる。

## 正当性

指定端点間の距離と二部彩色からK≥N,K≡N (mod 2)が必要である。二行ブロックはdistinctな2w個のcellを通り、前後のブロックとの接続も隣接している。w=1,…,Mにより0,2,…,2(M−1)の全増分を得られる。N偶数ではN/2ブロックで最大NMまでの全許容Kを作れる。

N奇数の最後三行は、低extra分岐で0,…,2(M−1)の偶数増分を、高extra分岐でさらに0,…,2floor((M−1)/2)の偶数増分を実現する。各四cell迂回は中段の二cellを四cellへ替えるので+2、使用する二列は互いに素で最後の下段右端にも触れない。最後三行の最大増分は2(M−1)+2floor((M−1)/2)。通常ブロックと合計すれば、M奇数でNM、M偶数でNM−1までの全許容Kを覆う。後者はN奇数の必要parityからKも奇数なので入力上の最大許容値である。よってextraは必ず0へ至り、K個のdistinctなcellが指定端点へ隣接順につながる。

全cell間の壁を閉じてからこの経路の辺だけ開くため、入口から出口へつながる通路成分はちょうど作った一本の経路となり、通過cell数Kと分岐がない条件を満たす。

## 実装上の注意

- extraは迂回回数でなく追加cell数K−N。本手順では2ずつ消費する。
- 奇数Nの最後三行を通常二行と一行で済ませると、最大付近のKを作れない。高extra分岐の四cell列を具体的に使う。
- 壁中点は二cellの中心座標の平均で求める。文字はASCIIの'-'を使い、交点・外周・S/Gの位置を仕様通りに出す。
- 構成を確認する時は長さ、重複、隣接、両端に加えて、開いた壁の通路graphも検査する。

## 復習の核

- 条件判定、path頂点列、壁への変換を三段に分ける。小さい2×M・3×Mで全許容Kを描いてconstructionの端処理を確認する。

## 計算量と制約

### 時間

O(NM)、pathと壁出力。

### 空間

O(NM)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 100; 1\leq M \leq 100; 1\leq K\leq NM; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc358/editorial/10222) — source-abc358-editorial-10222-fe9e7381e43a0e97ee4abbc7649ef7e3ff6d224a4a46e7d042ab685e16ba82d5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc358/tasks/abc358_f) — source-abc358-f-problem-10dc7b1dbf735ed686b12077ee24559ce712c76dcfaee3b541cd3d97cd9e510b
