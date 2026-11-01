<!-- Quality reference extracted from https://chatgpt.com/share/6ae73798-ef3c-83ec-9369-a9f783c7064b; original ChatGPT notation retained. -->

# ABC215 H - Cabbage Master 解説

<text color="secondary" size="sm">AtCoder Beginner Contest 215 / H問題 / 600点</text>

この問題の核心は、**「どんな出荷方法でも失敗する」という条件を、品種の部分集合に対する不等式へ変換すること**です。

その後、部分集合ゼータ変換・メビウス変換を使って、最小個数とその選び方を \(O(N2^N+NM)\) 時間で求めます。

重要な典型は次の3つです。

1. **Hall の結婚定理**を利用して、割り当ての実現可能性を不等式で表す。
2. **部分集合ゼータ変換**で、集合の包含関係に基づく総和を一括計算する。
3. **メビウス反転**で、「使用する品種が集合に含まれる」と「使用する品種がちょうどその集合」を変換する。

## 1. 問題を整理する

品種 \(i\) のキャベツが \(A_i\) 個あり、会社 \(j\) は \(B_j\) 個を要求します。会社ごとに受け入れ可能な品種が決まっています。

すぬけ君は、キャベツを何個か食べることで、すべての会社の注文を満たすことが不可能になるようにしたいです。

求めるものは、食べる最小個数 \(X\) と、それを実現する食べ方の総数 \(Y\) です。

制約は

\[
N\le 20,\qquad M\le 10^4
\]

なので、品種の部分集合 \(2^N\) 個は列挙できます。一方、キャベツ自体は最大 \(2\times10^6\) 個、注文数の合計は最大 \(10^9\) 個あるため、個々のキャベツや注文を直接扱う方法は不適切です。

## 2. 考察：何が原因で出荷不可能になるのか？

### 2.1 特定の品種に注文が集中している

まず、入力例1を考えます。

| | 品種1 | 品種2 | 品種3 |
|---|---:|---:|---:|
| 在庫 | 2 | 2 | 5 |

会社1は品種1・2から3個、会社2は品種2・3から4個を要求します。

注目したいのは会社1です。会社1が受け取れるキャベツは品種1・2に限られ、その在庫は合計4個です。

したがって、品種1・2から2個食べると、残りは2個になり、会社1の要求3個を満たせなくなります。

<box border radius="lg" padding={3} gap={2}>
  <text weight="medium" size="sm">品種1・2に注目した場合</text>
  <grid columns={2} gap={3}>
    <grid-item>
      <caption>食べる前：4個</caption>
      <row gap={1}>
        {#each ["1","1","2","2"] as x,i}
          <box key={i} background="surface-secondary" radius="sm" flex="1" padding={{y:2,x:1}} align="center">
            <text weight="medium" size="xs">{x}</text>
          </box>
        {/each}
      </row>
    </grid-item>
    <grid-item>
      <caption>2個食べた後：2個</caption>
      <row gap={1}>
        <box background="surface-secondary" radius="sm" flex="1" padding={{y:2,x:1}} align="center"><text size="xs">1</text></box>
        <box background="surface-secondary" radius="sm" flex="1" padding={{y:2,x:1}} align="center"><text size="xs">2</text></box>
        <box border radius="sm" flex="1" padding={{y:2,x:1}} align="center"><text color="tertiary" size="xs">×</text></box>
        <box border radius="sm" flex="1" padding={{y:2,x:1}} align="center"><text color="tertiary" size="xs">×</text></box>
      </row>
    </grid-item>
  </grid>
  <text color="secondary" size="xs">数字は品種番号。会社1が必要とする3個を確保できません。</text>
</box>

この観察を一般化しましょう。

品種の集合 \(S\) を選び、**その集合に含まれる品種しか受け取れない会社**を考えます。

それらの会社の要求個数の合計が、\(S\) に属するキャベツの在庫より多ければ、どのように出荷しても失敗します。

では、このような在庫不足が存在することは、出荷不可能であるための必要十分条件なのでしょうか？

ここで Hall の結婚定理が登場します。
