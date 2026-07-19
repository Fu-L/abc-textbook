<!--
SUPERSEDED: This proposal described an LLM-panel-based amendment and is retained only as
historical context. Issue #10 replaced it with the risk-based self-review/third-party-review
policy ratified in constitution.md 2.0.0. It has no governing authority.

Sync Impact Report
- Amendment status: PROPOSED — maintainer explicit acceptance is pending
- Version change: 1.0.0 → 2.0.0
- Modified principles:
  - I. Learning-Outcome Alignment: human-only review wording replaced by automated evidence
    or an independent LLM judge panel
  - Authoring Workflow and Quality Gates: single human reviewer gate replaced by an
    isolated multi-LLM majority gate; sole-maintainer digest authorization remains an
    administrative publish action and cannot replace quality evidence
- Added sections:
  - Independent LLM Judgment Standard
- Removed sections: none
- Removed obligations:
  - Mandatory human reviewer for non-automatable claims and examples
- Dependent templates and feature artifacts require synchronized migration only after acceptance.
- Follow-up TODOs:
  - BLOCKED: maintainer review and explicit acceptance of this 2.0.0 MAJOR amendment
-->
# ABC Textbook Constitution 2.0.0 Proposal (Superseded)

> **Superseded proposal:** This file is retained for historical context only. The governing
> policy is the risk-based amendment in `constitution.md` 2.0.0.

## Core Principles

### I. Learning-Outcome Alignment
Every chapter, lesson, exercise, and example MUST state or trace to a concrete learning
outcome. Content MUST include only the concepts needed to achieve its declared outcomes;
prerequisites and intentionally excluded topics MUST be explicit. A change is complete only
when automated traceability evidence or an independent LLM judge panel can connect each
substantive section to an outcome and each outcome to a measurable self-study activity or
verification method. Human participant studies are not required unless a feature specification
explicitly opts into them. This keeps the textbook focused and makes coverage verifiable for a
single learner.

### II. Accuracy and Traceability
Technical claims, definitions, commands, and results MUST be factually correct for the
documented environment. Claims that depend on external standards, research, or changing
software behavior MUST cite an authoritative source or record the verification basis and
applicable version. Unverified claims MUST NOT be presented as fact. Corrections MUST update
all affected explanations, examples, exercises, and answer material together. This protects
learner trust and prevents internally contradictory guidance.

### III. Progressive and Accessible Learning
Material MUST advance from declared prerequisites through explanation, guided example,
practice, and verification without relying on unstated knowledge. New terms MUST be defined
at first use, and diagrams, tables, and other non-text content MUST have meaningful text
alternatives where the publishing format supports them. Instructions MUST use clear,
consistent language and MUST NOT depend on color, layout, or cultural context alone to convey
meaning. This enables learners with different backgrounds and access needs to follow the same
learning path.

### IV. Reproducible Examples
Every executable example MUST declare its required environment, inputs, commands or actions,
and expected observable result. Examples and answer keys MUST be tested using the documented
procedure before publication; where automated validation is practical, it MUST be used.
Intentional omissions, pseudocode, and abbreviated output MUST be labeled explicitly. A
failing or non-reproducible example blocks release because learners use examples as an
operational contract.

### V. Consistency and Maintainability
Terminology, notation, structure, file naming, cross-references, and code style MUST follow the
project's established conventions. Shared facts or reusable material MUST have one canonical
source and be linked or generated rather than copied when practical. Each change MUST remain
as small as the learning outcome permits, and added tooling or abstraction MUST have a stated
maintenance benefit. This limits drift and keeps future corrections affordable.

## Content Standards

- Every content specification MUST identify the target learner, prerequisites, learning
  outcomes, scope boundaries, and measurable success criteria.
- Examples MUST avoid real secrets and personal data. Any sample credentials or data MUST be
  unmistakably fictional and safe to publish.
- Sources MUST be authoritative and version-aware when behavior can change. The applicable
  product, language, standard, or tool version MUST be recorded near the claim or in the
  chapter's references.
- Exercises MUST assess declared outcomes. Answer material MUST explain the reasoning or
  verification method, not merely state the final answer.
- Published navigation, internal links, code blocks, and generated output MUST pass the
  repository's available validation checks.
- Subjective content-quality gates MUST use the Independent LLM Judgment Standard below unless
  a feature specification explicitly requires a different, stricter method. They MUST NOT
  silently introduce a human-participant study or an independent human content-reviewer
  dependency. A feature specification MAY require the sole maintainer to authorize publication
  of a fully validated immutable digest. That administrative authorization is not quality
  evidence and MUST NOT replace automated checks or independent LLM judgment.

## Authoring Workflow and Quality Gates

1. Specify the learner, prerequisites, outcomes, acceptance scenarios, and exclusions before
   planning content or tooling changes.
2. During planning, complete the Constitution Check and record how accuracy, accessibility,
   reproducibility, and consistency will be verified. Any exception MUST include its rationale,
   risk, owner, and removal or review condition.
3. Organize implementation tasks by independently reviewable learning outcome. Tasks MUST
   include source verification, example or exercise validation, accessibility review, and
   cross-reference checks when relevant.
4. Before merge, all applicable automated checks MUST pass and an independent LLM judge panel
   MUST confirm outcome coverage, inspect the check evidence, and review claims, examples, and
   educational quality that cannot be fully automated.
5. A change MUST NOT be published while known broken links, unexplained validation failures,
   inaccessible required content, contradictory guidance, or non-reproducible examples remain.

## Independent LLM Judgment Standard

- Every required panel MUST contain at least three valid judge runs. Each run MUST start in a
  fresh context with no inherited conversation or private memory from the author or another
  judge. A judge MUST NOT receive another judge's output before recording its own verdict.
- All judges MUST receive the same versioned judgment packet: subject digest, applicable learning
  outcomes, rubric and judge-prompt digest, authoritative source references, and automated-check
  result digests. The packet MUST exclude the author's hidden reasoning and prior judge verdicts.
- A logical-change subject digest MUST come from an explicit, deterministically ordered file
  inventory that excludes its own judgment packet, judge-run evidence, aggregate review evidence,
  generated verification report, and mutable orchestration envelopes. Those excluded artifacts
  MUST bind the subject digest and their own artifact digests separately; they MUST NOT be included
  in the subject projection and create a self-referential digest.
- Each judge MUST return a structured verdict for every blocking rubric item: `approve`,
  `changes_requested`, or `abstain`, with evidence-linked rationale. A panel passes only when a
  strict majority of all configured judges approves every blocking item and at least three valid
  verdicts exist. Abstentions never count as approval.
- A dissent that identifies a possible source contradiction, broken reproduction, or safety or
  accessibility defect MUST become a blocking finding until the cited evidence is checked and the
  finding is resolved, even when the remaining votes form a majority.
- Judge runs SHOULD use different model families or versions when they are already available,
  but separate isolated runs of the same model are valid. Required judgment MUST NOT depend on a
  paid API or shared cross-run memory unless the governing feature specification explicitly allows
  that dependency.
- Evidence MUST record subject, rubric, prompt and automated-result digests; model identifier and
  version when available; isolated run ID; per-item verdicts; rationale; and the aggregate result.
  Any subject, rubric, prompt, source, or check-result change invalidates the panel and requires a
  new set of independent judgments.

## Governance

This constitution is the highest-authority project policy. When another project document or
local practice conflicts with it, this constitution prevails and the conflicting artifact MUST
be corrected.

Amendments MUST be proposed as a documented change that explains the motivation, affected
principles and templates, compatibility impact, and any migration work. Approval requires a
maintainer review and explicit acceptance. The amendment MUST update dependent templates and
guidance in the same change unless a named owner and tracked follow-up are recorded.

Versions follow semantic versioning: MAJOR for incompatible removal or redefinition of a
principle or governance rule, MINOR for a new principle or materially expanded obligation, and
PATCH for clarifications that do not change required behavior. The Sync Impact Report and
version line MUST agree.

Every feature plan and review MUST include a Constitution Check. Automated gates and required
LLM judge panels MUST reject unjustified violations. The maintainers MUST audit the constitution
and its dependent templates whenever an amendment is proposed and during any
publication-readiness review.

**Proposed Version**: 2.0.0 | **Based On**: 1.0.0 | **Proposed**: 2026-07-13 |
**Amendment Status**: PROPOSED—EXPLICIT ACCEPTANCE REQUIRED
