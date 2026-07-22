# Staging ownership

`staging/` は未公開の更新準備とprivate preview専用です。静的siteのcontent
loader、Pagefind、公開catalogはこのdirectoryを読みません。

- `updates/`: 取得・差分・執筆・分類・検証の途中状態と保留理由
- `previews/`: 公開releaseへ混入させないprivate preview

更新準備は再実行可能で、保留理由を保持します。production公開はrequired checksを通過してprotected
mainへmergeされたfull Git commitだけをdeployment adapterが行います。
