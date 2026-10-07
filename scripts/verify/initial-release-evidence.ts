import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalDigest } from '../../src/lib/domain/canonical-json.js';
import { assertAudit } from './initial-release-audits.js';

export const AUDIT_TASKS = [
  ['T133', 'schema-contracts'],
  ['T134', 'corpus-completeness'],
  ['T135', 'taxonomy'],
  ['T136', 'sources-and-claims'],
  ['T137', 'examples-and-answers'],
  ['T138', 'accessibility-and-links'],
  ['T139', 'learning-records'],
  ['T140', 'public-projections'],
  ['T141', 'performance'],
  ['T142', 'zero-cost-52-weeks'],
] as const;
export const AUDIT_ROOT = 'docs/verification/initial-release';
export const fileSha = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');

/** Source/implementation/acceptance inputs, not generated audit outputs or task status. */
export const auditInputSubject = async (repositoryRoot = process.cwd()) => {
  const directories = [
    'src',
    'scripts',
    'tests',
    'specs/001-build-abc-textbook/contracts',
    'docs/work-manifests',
    'docs/reviews',
    'docs/verification/bootstrap',
    'docs/verification/authoring-skill',
    'staging/taxonomy',
    '.agents/skills/abc-explanation-author',
  ];
  const files = [
    'package.json',
    'package-lock.json',
    'astro.config.mjs',
    'playwright.config.ts',
    'vitest.config.ts',
    'eslint.config.js',
    'prettier.config.mjs',
    '.prettierignore',
    '.gitignore',
    '.specify/memory/constitution.md',
  ];
  for (const directory of directories) {
    for (const file of await readdir(path.join(repositoryRoot, directory), {
      recursive: true,
      withFileTypes: true,
    }))
      if (
        file.isFile() &&
        /\.(?:[cm]?js|tsx?|astro|json|md|py|txt|ya?ml|svg|css|sh)$/u.test(file.name)
      ) {
        const relative = path.relative(repositoryRoot, `${file.parentPath}/${file.name}`);
        // Derived review packets bind this audit's result and are not audit inputs.
        if (
          !relative.startsWith('docs/reviews/human-content/initial-release/') &&
          !relative.startsWith('docs/reviews/human-content/releases/')
        )
          files.push(relative);
      }
  }
  const inventory = await Promise.all(
    files.sort().map(async (file) => ({
      path: file,
      digest: fileSha(await readFile(path.join(repositoryRoot, file))),
    })),
  );
  return { digest: canonicalDigest(inventory), fileCount: inventory.length };
};

export interface AuditCommand {
  readonly command: string;
  readonly exitCode: number;
  readonly durationMs: number;
  readonly outputDigest: string;
  readonly outputBytes: number;
  readonly observed: string;
}
export interface AuditEvidence {
  readonly schemaVersion: '1.0.0';
  readonly taskId: string;
  readonly status: 'passed';
  readonly scope: 'canonical-full-corpus';
  readonly inputSubject: { readonly digest: string; readonly fileCount: number };
  readonly sourceProjectionDigest: string;
  readonly generatedAt: string;
  readonly commands: readonly AuditCommand[];
  readonly checks: unknown;
  readonly evidenceDigest: string;
}

export const assertAuditEvidence = (
  value: unknown,
  taskId: string,
  subjectDigest: string,
  projectionDigest: string,
): AuditEvidence => {
  assertAudit(typeof value === 'object' && value !== null, `AUDIT_REPORT_MISSING:${taskId}`);
  const evidence = value as Omit<AuditEvidence, 'schemaVersion' | 'scope' | 'status'> & {
    schemaVersion: string;
    scope: string;
    status: string;
  };
  const { evidenceDigest, ...unsigned } = evidence;
  assertAudit(evidenceDigest === canonicalDigest(unsigned), `AUDIT_REPORT_DIGEST:${taskId}`);
  assertAudit(
    evidence.schemaVersion === '1.0.0' &&
      evidence.taskId === taskId &&
      evidence.status === 'passed' &&
      evidence.scope === 'canonical-full-corpus' &&
      evidence.inputSubject.digest === subjectDigest &&
      evidence.sourceProjectionDigest === projectionDigest,
    `AUDIT_REPORT_SUBJECT:${taskId}`,
  );
  assertAudit(
    evidence.commands.length > 0 && evidence.commands.every((command) => command.exitCode === 0),
    `AUDIT_REPORT_COMMAND_FAILED:${taskId}`,
  );
  return evidence as AuditEvidence;
};
