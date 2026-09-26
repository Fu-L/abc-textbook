# T159 final taxonomy self-review

Review basis for the full-corpus taxonomy proposal generated on 2026-09-26. The accepted Inventory
is treated as true, as directed. The requested third-party review is skipped; the work manifest
permits self-review for the solo maintainer, and the user explicitly authorized that route.

The three semantic refinements were checked against their reviewed Inventory reasoning and the
official problem/editorial source revisions referenced there:

- **ABC398 E:** The tree's connected bipartition fixes the legal cross-part edge pool. Each move
  consumes one fixed candidate, so the winner follows from the remaining count's parity. The
  parity-game skill owns the problem; bipartite coloring is co-primary because it determines the
  candidate pool, and interactive I/O remains supporting.
- **ABC398 G:** Bipartite components can flip orientation when merged. Their part-size parity
  classes reduce the game to a parity invariant and a finite case classification. The parity-game
  skill owns the problem; component coloring is co-primary. This is not a Grundy or minimax DP.
- **ABC451 G:** Root-to-vertex XOR potentials map weighted fundamental cycles to an XOR span. A
  reduced XOR basis gives each affine coset its minimum representative, and linearity separates
  pairwise minimization. XOR-basis coset normalization owns the problem; cycle-space mapping and
  binary-trie pair counting are supporting skills used by the solution.

The new parity-game tag and learning unit keep this reusable strategy separate from game DP. The two
ABC398 claims bind to the exact game and bipartite outcomes. ABC451 G binds the new cycle-space
mapping and coset-normalization outcomes while retaining the trie outcome. The full-corpus proposal
still covers 868 problem placements, and the review manifest includes all newly introduced learning
outcomes.
