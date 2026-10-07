# 公開後のキャッチアップと旧PR #70の受入記録

## 現行方針（2026-10-07）

ABC212〜466の検証済み868問を#53 →
#54で先に公開し、#52のcatch-up機能は実公開・事後検証後に実装する。次の実装エージェントは[先行公開の手順](deploy-before-catch-up.md)から開始する。PR
#70と未commitの原稿・taxonomy・実装修正は保存し、初版へmergeしない。

#52はT163 → T143 → T144 → T164を担当する。公開済みCatalog/Release
Metadata/host履歴をbaseとして、`baseReleaseVersion`、`releaseKind=incremental`、初回専用path/cutoffの一般化、既収録Contestの除外、1
Contestまたは小batchの処理、今回の差分だけのsummaryを実装する。最初の候補はABC467。旧原稿・source・review・receiptは実際の公開baseと新subjectへ照合してから再利用する。未完成batchを公開せず、後続の未着手候補は現在の公開版を妨げない。

公開後の実command/引数と証跡pathはT163で確定する。以下は旧「初版前にABC478まで一括追随」の実装・証跡記録であり、現在の初版公開runbookや完成済みlive更新機能の案内ではない。以下の固定cutoff・904問・初版summary・受入結果は当時のsubjectに限る。公開後の新証跡は`docs/verification/releases/`と`docs/verification/deployments/`へ置き、旧記録を上書きしない。

## 旧方針の実装記録

旧「初版前にABC478まで一括追随」のコード・原稿・受入証跡は[PR #70](https://github.com/Fu-L/abc-textbook/pull/70)のbranchへ保存する。このmainには追加36問やcatch-up実装を含めず、旧904問向け結果を初版868問の公開証跡へ流用しない。公開後の再実装時は、そのbranchの当時のcommitと未commit素材を確認し、実際の公開済みbaseに対して再検証する。
