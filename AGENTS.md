# Codexの作業入口

このリポジトリは個人用の競技プログラミング教科書です。教材の体系、文章、静的サイトの読みやすさを優先してください。

ABCの過去問を通して典型知識を網羅的に身につけ、ARC・AGC・CF Div.
1・UCUPなどの難関コンテストへ進むための教科書です。Unit内の問題は総合的な難易度の易しい順です。問題追加時は、配点・保存済みdifficulty（欠測や実験値も確認）・出題位置・解法概要のすべてを読み、着想、証明、状態や式の導出、前提知識、実装負担を既存問題・同時追加問題と比較して挿入位置を個別に決めてください。単一指標、重み付きスコア、辞書式キーなどの1次元的な比較関数に圧縮したソート、開催順や末尾への自動追加は禁止です。小batchでは既存問題同士の相対順・所属を保ち、対象Unitの`directProblemIds`・`relatedProblemIds`へ新問の位置を明示します。詳しくは[問題の挿入順](docs/operations/update-manual.md#unit内の問題の挿入順)を参照してください。

作業開始時に必ず次を読み、今回の変更に関係する手順を参照してください。

1. [.specify/memory/constitution.md](.specify/memory/constitution.md)
2. [docs/operations/update-manual.md](docs/operations/update-manual.md)

実作業・検証・文章と表示の確認はCodexが担当し、人間の承認や第三者レビューを完了条件にしません。小さな変更に新しいspec・manifest・review
evidence・digest台帳を要求しないでください。挙動とデータの変更には必要な自動テストとschema検証を使ってください。更新方法を変えた場合はマニュアルも同じ変更で修正してください。

過去のspec・skill・runbookにある旧承認規則は新しい憲章に従います。既存CLIやCIに残る技術的な証跡依存はマニュアルの移行欄を参照し、未実装の簡素化を実装済みとして扱わないでください。既存教材、URL、Problem
ID、学習記録、公開originとbase pathを維持してください。
