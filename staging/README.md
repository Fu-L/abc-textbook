# Staging ownership

`staging/` は未公開の更新候補とrelease candidate専用です。静的siteのcontent
loader、Pagefind、公開catalogはこのdirectoryを読みません。

- `updates/`: 取得・差分・執筆・分類・検証の途中状態
- `release-candidates/`: 固定digestを持つ公開候補

候補は再実行可能で、保留理由を保持し、承認済みdigestを変更しません。production公開は後続phaseの原子的publish処理だけが行います。
