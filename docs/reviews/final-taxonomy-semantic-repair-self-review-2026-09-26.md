# T159 final taxonomy semantic repair self-review

The accepted Inventory is treated as true. I reviewed the recorded observations, adopted and
rejected approaches, key insights, algorithm connections, typical techniques, and prerequisite
claims for every affected problem. The full placement scope remains 868 problems; the semantic audit
identified 15 problems requiring correction. Third-party review is skipped as requested. The T159
manifest permits self-review for the solo maintainer, and the user explicitly authorized this route.

## Primary, home, and supporting decisions

- **ABC225 H, ABC247 Ex, ABC267 Ex:** The generating-function model determines what each coefficient
  means, so it remains the home skill. NTT convolution is co-primary because the product computation
  is a separate reusable operation that determines whether the stated input size is feasible.
  Product-tree divide and conquer is supporting where it is independently used. ABC247 Ex's
  permutation-cycle observation remains problem-specific; functional-graph decomposition is removed
  because the adopted solution does not decompose a functional graph into cycles and in-trees.
- **ABC269 Ex, ABC272 Ex, ABC381 G, ABC260 Ex, ABC297 Ex, ABC318 Ex, ABC387 G, ABC439 G:** Existing
  primary outcomes remain the right descriptions of the tree DP, multipoint evaluation, field
  extension, generating-function/FPS model, labeled-component formula, composition, or power
  projection. Convolution is supporting at the claims where NTT polynomial products implement
  heavy-path products, product/remainder trees, chirp-z, binomial transforms, FPS inverse/exp/Newton
  steps, or rational-function merges. The added binding does not promote implementation
  multiplication over the mathematical model.
- **ABC304 Ex:** Earliest-deadline-first selection, justified by exchange, controls whether an
  admissible ordering exists. Reverse DAG deadline propagation and topological processing support
  that choice. The heap is an implementation detail here: the retired generic heap tag has no
  canonical supporting outcome, while the remaining best-first tag describes a different skill.
- **ABC304 G:** For a fixed threshold, the central oracle computes maximum XOR-qualified matching
  size by bit recursion over same-set and cross-set pair counts. This specialized recurrence is the
  primary skill. Monotone binary search is only the outer optimization and is supporting. The new
  Tag/Outcome is distinct from minimizing maximum XOR under a common mask and from bitwise greedy
  feasibility.
- **ABC308 F:** The exchange argument proves the maximum-discount matching greedy. Price-order
  activation is a meaningful event sweep and supports the greedy. The max heap is an implementation
  detail: best-first enumeration describes a different learner outcome, so it is not assigned as a
  supporting skill.
- **ABC458 G:** The linear-time feasibility oracle depends on preserving a concave piecewise-linear
  DP through slope-trick breakpoint updates. The concavity can be sign-reversed to use the convex
  slope-trick representation. That technique determines the problem's core reusable skill and home;
  monotone search over the number of people is supporting.

The decisions above were recorded against Inventory claim paths, not assigned by keyword matching.
The T159 review scope includes the newly added XOR-threshold matching Outcome and still covers all
868 placements.
