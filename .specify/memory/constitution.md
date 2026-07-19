<!--
Sync Impact Report
- Version change: 1.0.0 → 2.0.0
- Modified principles:
  - Template Principle 1 → I. Learning-Outcome Alignment
  - Template Principle 2 → II. Accuracy and Traceability
  - Template Principle 3 → III. Progressive and Accessible Learning
  - Template Principle 4 → IV. Reproducible Examples
  - Template Principle 5 → V. Consistency and Maintainability
- Added sections:
  - Content Standards
  - Authoring Workflow and Quality Gates
- Changed quality gate:
  - Normal updates may complete with maintainer self-review; third-party review is mandatory
    only for the enumerated high-risk conditions.
- Added review evidence distinction:
  - Self-review and third-party review have separate modes and actor records.
- Removed sections: none (template sections were concretized)
- Templates requiring updates:
  - ✅ reviewed; no change required: .specify/templates/plan-template.md
  - ✅ reviewed; no change required: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
  - ✅ reviewed; no change required: .specify/templates/checklist-template.md
- Command templates: none present under .specify/templates/commands/
- Runtime guidance documents: none present
- Follow-up TODOs:
  - Keep the high-risk reason enum synchronized with the review contract and task guidance.
-->
# ABC Textbook Constitution

## Core Principles

### I. Learning-Outcome Alignment
Every chapter, lesson, exercise, and example MUST state or trace to a concrete learning
outcome. Content MUST include only the concepts needed to achieve its declared outcomes;
prerequisites and intentionally excluded topics MUST be explicit. A change is complete only
when the maintainer's explicit self-review, or a required third-party review, can connect each
substantive section to an outcome and each outcome to a measurable learner activity or
assessment. This keeps the textbook focused and makes coverage verifiable.

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

## Authoring Workflow and Quality Gates

1. Specify the learner, prerequisites, outcomes, acceptance scenarios, and exclusions before
   planning content or tooling changes.
2. During planning, complete the Constitution Check and record how accuracy, accessibility,
   reproducibility, and consistency will be verified. Any exception MUST include its rationale,
   risk, owner, and removal or review condition.
3. Organize implementation tasks by independently reviewable learning outcome. Tasks MUST
   include source verification, example or exercise validation, accessibility review, and
   cross-reference checks when relevant.
4. Before merge, the maintainer MUST perform an explicit self-review that confirms outcome
   coverage and run all applicable automated checks. A third-party reviewer MUST review the
   affected scope only when one or more of the following fixed high-risk conditions applies:
   an explanation conflicts with an authoritative source or correction, it introduces an
   original proof or other correctness argument not directly supported by the cited source, or
   it makes a major taxonomy/classification change to a learning outcome, technique tag,
   prerequisite, or problem placement. A normal update MUST NOT require an external person ID.
   Review evidence MUST state whether the decision is a self-review or a third-party review;
   the two modes MUST NOT be presented as interchangeable.
5. A change MUST NOT be published while known broken links, unexplained validation failures,
   inaccessible required content, contradictory guidance, or non-reproducible examples remain.

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

Every feature plan and review MUST include a Constitution Check. Reviewers MUST reject
unjustified violations. The maintainers MUST audit the constitution and its dependent templates
whenever an amendment is proposed and during any publication-readiness review.

**Version**: 2.0.0 | **Ratified**: 2026-07-19 | **Last Amended**: 2026-07-19
