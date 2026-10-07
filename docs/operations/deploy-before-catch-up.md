# 検証済み教材の先行公開と公開後のキャッチアップ

2026-10-07のowner指示で、ABC212〜466の検証済み教材を先にデプロイし、その後にキャッチアップ機能を追加する。これは実装・公開順の変更であり、既存教材の品質検査や公開reviewの免除ではない。仕様の正本は[spec.md](../../specs/001-build-abc-textbook/spec.md)、設計は[plan.md](../../specs/001-build-abc-textbook/plan.md)、実装順は[tasks.md](../../specs/001-build-abc-textbook/tasks.md)。

## 固定する初版

| 項目                    | 初版の契約                                                                 |
| ----------------------- | -------------------------------------------------------------------------- |
| 収録範囲                | ABC212〜466、公式順でDより後の全868問                                      |
| Contest被覆             | 255番号 = 254開催 + ABC316の公式欠番                                       |
| 体系                    | 受理済み213タグ・232 Unit、既存Outcome・配置・三つの直接前提DAG・掲載順    |
| 収録基準日時            | `2026-07-12T00:00:00+09:00`                                                |
| 公開機能                | 教科書・問題解説・タグ・コンテスト表・検索・端末内学習記録・backup/restore |
| 公開summary             | 初版bootstrapのみ。ABC467以降の未公開update IDを含めない                   |
| 公開日・検証日・version | 実際の公開準備・検証・配信に基づく値。古い収録cutoffとは別に扱う           |
| 後続機能                | live catch-up、新Contestの取得・執筆・適用、一操作の更新準備と一括化       |

初版の公開が遅れても収録上限を動かさない。ホーム、コンテスト表、更新ページ、Catalog、Release
Metadataは同じ実範囲を示す。未収録の最新回を「収録済み」や「公式問題なし」と表示しない。対象外の候補はstagingへ置き、初版の索引・Pagefind・sitemap/feedへ含めない。

## Issueと実装順

| 順序 | Issue                                                 | 対象task・完了条件                                                                                               |
| ---- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1    | [#53](https://github.com/Fu-L/abc-textbook/issues/53) | T162 → T145〜T147 → T148〜T151。seed用公開入力、current-subject review/検証、host・runbook、final gateを用意する |
| 2    | [#54](https://github.com/Fu-L/abc-textbook/issues/54) | T152〜T153。検証済みexact commitの実デプロイと事後検証を完了する                                                 |
| 3    | [#52](https://github.com/Fu-L/abc-textbook/issues/52) | T163 → T143 → T144 → T164。公開済み版をbaseにcatch-upを実装し、小さな連続batchで更新する                         |

#53は#51の検証基盤と#49/#50の既存契約を使う。#52を待たない。#52は#54の完了を待ち、#53/#54をブロックしない。T145〜T147の旧904問向け受入は初版868問向けの完了条件ではないため、現行subjectで再確認する。T133〜T142は既存検証実装を再利用し、変更された入力の証跡をT149で更新する。

## 次の実装エージェントの開始点

この方針変更時点の`main`はPR
#69を統合した`27f96837dc1aafce893c5564de09d3319f63582c`。868問の受入結果と検証基盤を持つ。このSHAは出発点の記録であり、最終公開commitではない。実装開始時にはremote
mainと変更内容を読み、公開準備用の別branch/worktreeを作る。

現在の`codex/issue-52-initial-catch-up`と[PR #70](https://github.com/Fu-L/abc-textbook/pull/70)には、ABC467〜478の追加原稿・metadata・receipt・taxonomy変更と未commitの修正がある。初版を作るためにこのbranchをresetしたり、原稿を削除したりしない。PR
#70全体をmainへmergeしない。この方針変更の仕様・運用文書だけを公開準備branchへ持ち込む。必要なbootstrap/helperがmainに不足していれば、T162で既存実装から必要部分だけ移植して検証する。

初版向けに変更する責務は次のとおり。

1. `src/lib/catalog/full-public-projection.ts`とbootstrap処理で、seed-onlyの対象・固定cutoff・bootstrap-only
   summaryを明示する。sourceの受理日や最新Contest取得結果から初版上限を広げない。既存本文・taxonomyを再生成しない。
2. `docs/verification/releases/catalog.json`、`evidence-inventory.json`、`docs/reviews/human-content/releases/merge-review.json`など、`verify:release`の実入力を用意する。既存canonical
   fileを初公開するという理由だけで架空のadd operationを作らず、保護済みGit
   base/currentの実差分と公開scopeをそれぞれ検証する。
3. prepared
   Catalogと実hostの公開履歴を分ける。存在しないpublished履歴や人間reviewを作らない。bootstrap
   summaryには実際の初版全868問を記録する。
4. T150で無償のstatic host、HTTPS origin、base path、認証、exact-commit
   build/deploy、成功履歴、retry、検証手順を選定する。現時点ではhost未選定であり、実行可能なproduction
   deploy CLI/runbookは未完成である。
5. ホーム・範囲表示・履歴と公開導線を検証し、実装や契約変更でdigestが変わる証跡を正しいsubjectで更新する。904問版の証跡を868問版へ貼り替えない。

`SITE_URL`と`BASE_PATH`は選定hostに合わせて設定する。IndexedDBのDB名・version・Problem
IDを維持し、継続公開は同じHTTPS
originを使う。ドメインを変える場合は、学習記録をexport/importする移行手順を用意する。

## 初版の検証と公開

T162で公開入力を用意した後、適用可能な検査とreviewを実施する。利用可能な入口は次である。

```bash
npm run verify:fast
npm run verify:initial-release -- --write
npm run verify:initial-release -- --check
npm run verify:release -- --commit HEAD
```

全件検証は868問・232 Unit・公式欠番・dynamic
slots、出典・本文・配置、routes/search/index閉包、学習記録の独立日時・backup/restore、性能・無料経路を対象とする。既存の数学回帰と更新・訂正・52週simulationを維持する。live
US5/FR-022〜FR-025/SC-006/SC-007とSC-014のlive更新受入はPhase
9へ追跡する。simulation成功をlive更新の完成に数えず、未提供機能を公開UIで案内しない。必要reviewはFR-026とConstitution
3.0.0に従い、既存のagent品質受入と人間approvalを混同しない。SC-009/SC-010の廃止指示は保持する。

表示・検証実装の変更でT160のbuild証跡が変わる場合は、[初期教材の品質検証](initial-release-verification.md)に従ってbuild証跡を更新する。実commitが変わればexact
treeを再検証し、required checkを通ったprotected mainのfull
SHAだけをdeployする。deploy時に本文を修正・再生成しない。

T153では実host履歴、公開範囲、route/search、学習記録互換性を記録する。初回公開では旧production版が存在しないため、known-commit
rollback
simulation、同じ公開SHAのredeploy、二つの実公開版間のrollbackを区別する。存在しない旧版への本番rollbackを成功扱いしない。runbookに初回失敗時のretry/公開停止と、二版目以降の実rollback手順を記載する。

## 公開後catch-upの設計差分

PR
#70の処理は固定`INITIAL_CUTOFF`、`CATCH_UP_ROOT`、`baseReleaseVersion: null`、`releaseKind: initial`、bootstrapを毎回束ねるsummaryを前提とする。現在の`release:catch-up`は固定discoveryを使い、実際の公開済みContest集合から欠けた回を選ぶlive運用には未対応である。そのまま初版公開後へ流用しない。

T163では次を実装し、実際に使えるcommand/引数を[キャッチアップ手順](initial-catch-up.md)へ確定する。

- 公開済みCatalog、Release
  Metadata、host成功履歴をbaseとして読む。`baseReleaseVersion`はその版を指す。protected-mainの差分基準は既存のtrusted
  Git baseを使い、公開済み版と混同しない。
- bootstrapは初版だけ。更新は既存schemaの`releaseKind=incremental`を使い、今回取り込む差分だけをsummaryへ記録する。旧公開版のhistoryを上書きしない。
- 入力path/cutoffを初回専用directory/日時へ固定しない。既収録Contestは追加候補から除外し、同じ入力の再実行は同じupdate、入力変更は新しいupdateとして扱う。
- 最初はABC467だけ、以後も連続する1
  Contestまたは小batchを選べる。cutoffは選んだ上限Contestの終了後、次の未収録Contestの終了前に固定する。取得、執筆、review、適用、公開判断は手動でもよい。
- 一つのbatch内の全D-after問題、Source Revision、Inventory、配置、receipt、Unit導線、metrics
  identity、三つのDAGと全影響を揃える。batch内の未完成・保留はbatch全体を止め、後続の未着手候補は現在の公開を止めない。
- 既存本文・semantic ownership・読書順・Problem
  IDを維持する。追加taxonomyが必要なら数学的内容と所有関係を通常review/correctionへ通す。PR
  #70の原稿・taxonomy・証跡は新しいbase/source/subjectで再検証してから再利用する。
- 拡張後の全公開scopeに対して検証し、既存学習記録の値・独立日時・backup/restoreを確認する。新版を既存host/runbookで公開し、実履歴と既知公開commitへのrollbackを確認する。

この文書更新は公開順と実装計画の変更であり、production deploy、PR
merge、既存教材の巻き戻しは実行していない。
