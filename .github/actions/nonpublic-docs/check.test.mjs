import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { isDocumentationDiff, readChanges, validateLinks } from './check.mjs';

test('only added or modified nonpublic documentation takes the documentation route', () => {
  assert.equal(
    isDocumentationDiff([
      { status: 'M', file: '.specify/memory/constitution.md' },
      { status: 'A', file: 'specs/002-simplify-maintenance/spec.md' },
    ]),
    true,
  );
  for (const file of [
    'src/content/docs/problems/a.md',
    '.agents/skills/abc-explanation-author/SKILL.md',
    'specs/001-build-abc-textbook/contracts/catalog.schema.json',
    'docs/verification/initial-release/schema-contracts.json',
    '.github/workflows/ci.yml',
    '.github/actions/nonpublic-docs/check.mjs',
    'scripts/verify-release.ts',
    'package-lock.json',
    'unknown.md',
  ]) {
    assert.equal(isDocumentationDiff([{ status: 'M', file }]), false, file);
    assert.equal(
      isDocumentationDiff([
        { status: 'A', file: 'docs/README.md' },
        { status: 'M', file },
      ]),
      false,
      `mixed ${file}`,
    );
  }
  assert.equal(isDocumentationDiff([]), false);
  for (const status of ['D', 'R100', 'T', 'U'])
    assert.equal(isDocumentationDiff([{ status, file: 'docs/README.md' }]), false);
});

test('diff lookup uses the PR merge base or main before SHA and fails conservatively', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'abc-docs-diff-'));
  try {
    const eventPath = path.join(directory, 'event.json');
    const base = 'a'.repeat(40),
      head = 'b'.repeat(40),
      mergeBase = 'c'.repeat(40);
    writeFileSync(
      eventPath,
      JSON.stringify({ before: base, pull_request: { base: { sha: base } } }),
    );
    const calls = [];
    const git = (args) => {
      calls.push(args);
      return args[0] === 'diff'
        ? 'M\0docs/README.md\0'
        : args[0] === 'merge-base'
          ? mergeBase
          : head;
    };
    const env = {
      GITHUB_EVENT_PATH: eventPath,
      GITHUB_EVENT_NAME: 'pull_request',
      GITHUB_SHA: head,
    };
    assert.deepEqual(readChanges(env, git), [{ status: 'M', file: 'docs/README.md' }]);
    assert.deepEqual(calls.at(-1), [
      'diff',
      '--name-status',
      '--no-renames',
      '-z',
      mergeBase,
      head,
    ]);
    readChanges({ ...env, GITHUB_EVENT_NAME: 'push' }, git);
    assert.equal(calls.at(-1).at(-2), base);
    assert.deepEqual(
      readChanges(env, () => {
        throw Error('missing history');
      }),
      [],
    );
    assert.deepEqual(readChanges({ ...env, GITHUB_SHA: base }, git), []);
    writeFileSync(eventPath, JSON.stringify({ before: '0'.repeat(40) }));
    assert.deepEqual(readChanges({ ...env, GITHUB_EVENT_NAME: 'push' }, git), []);
  } finally {
    rmSync(directory, { recursive: true });
  }
});

test('local links, duplicate heading anchors, and explicit anchors are checked', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'abc-docs-links-'));
  try {
    writeFileSync(
      path.join(directory, 'target.md'),
      '# 見出し\n\n# 見出し\n\n<a id="explicit"></a>\n',
    );
    const document = path.join(directory, 'document.md');
    writeFileSync(
      document,
      '[heading](target.md#見出し-1) [explicit](target.md#explicit) [external](https://example.com/)\n',
    );
    assert.equal(validateLinks(['document.md'], directory), 2);
    writeFileSync(document, '[bad](target.md#missing)\n');
    assert.throws(() => validateLinks(['document.md'], directory), /missing local anchor/u);
    writeFileSync(document, '[bad](absent.md)\n');
    assert.throws(() => validateLinks(['document.md'], directory), /missing local target/u);
  } finally {
    rmSync(directory, { recursive: true });
  }
});
