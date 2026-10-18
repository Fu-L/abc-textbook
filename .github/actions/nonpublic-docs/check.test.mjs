import assert from 'node:assert/strict';
import {
  globSync,
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { checkDocumentation, isDocumentationDiff, readChanges, validateLinks } from './check.mjs';

const comparisonImage = 'docs/operations/content-readability/after.png';

test('existing comparison PNGs alone or with Markdown use the documentation route', () => {
  const images = globSync('docs/operations/**/*.png');
  assert.ok(images.length > 0);
  for (const file of [...images, comparisonImage]) {
    assert.equal(isDocumentationDiff([{ status: 'A', file }]), true, file);
    assert.equal(
      isDocumentationDiff([
        { status: 'M', file: 'docs/operations/content-readability.md' },
        { status: 'M', file },
      ]),
      true,
      file,
    );
  }
  for (const file of [
    'docs/operations/unknown/after.png',
    'docs/operations/after.png',
    'docs/operations/content-readability/nested/after.png',
    'docs/operations/content-readability/after.svg',
    'docs/operations/content-readability/after.jpg',
    'docs/operations/content-readability/after.png.js',
    'docs/operations/content-readability/after.PNG',
    'docs/operations/content-readability/script.mjs',
    'docs/other/after.png',
    'public/after.png',
    'src/content/docs/problems/a.md',
    'src/content/problems/a.json',
    'src/components/ProblemExplanation.astro',
  ]) {
    assert.equal(
      isDocumentationDiff([
        { status: 'M', file: comparisonImage },
        { status: 'M', file },
      ]),
      false,
      file,
    );
  }
  for (const changes of [
    [{ status: 'D', file: comparisonImage }],
    [{ status: 'R100', file: comparisonImage }],
    [
      { status: 'D', file: comparisonImage },
      { status: 'A', file: 'docs/operations/content-readability/renamed.png' },
    ],
  ])
    assert.equal(isDocumentationDiff(changes), false);
});

test('PNG-only checks skip Prettier but check existence and unchanged Markdown references', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'abc-docs-images-'));
  try {
    mkdirSync(path.dirname(path.join(root, comparisonImage)), { recursive: true });
    writeFileSync(path.join(root, comparisonImage), Buffer.from([137, 80, 78, 71, 0]));
    const document = path.join(root, 'docs/operations/content-readability.md');
    writeFileSync(document, '# Comparison\n\n![After](content-readability/after.png)\n');
    // There is deliberately no node_modules/Prettier in this fixture.
    checkDocumentation([{ status: 'M', file: comparisonImage }], root);
    assert.throws(
      () => checkDocumentation([{ file: comparisonImage.replace('after', 'absent') }], root),
      /Missing comparison image/u,
    );
    writeFileSync(document, '# Comparison\n\n![Missing](content-readability/absent.png)\n');
    assert.throws(
      () => checkDocumentation([{ file: comparisonImage }], root),
      /missing local target/u,
    );
    // References outside operations are checked too; an external image is ignored.
    writeFileSync(document, '# Comparison\n');
    writeFileSync(
      path.join(root, 'README.md'),
      '[Comparison][image]\n\n[image]: docs/operations/content-readability/absent.png\n',
    );
    assert.throws(
      () => checkDocumentation([{ file: comparisonImage }], root),
      /README.md: missing local target/u,
    );
  } finally {
    rmSync(root, { recursive: true });
  }
});

test('deletion and rename check old references and allow a correctly updated document', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'abc-docs-image-removal-'));
  try {
    mkdirSync(path.dirname(path.join(root, comparisonImage)), { recursive: true });
    writeFileSync(path.join(root, comparisonImage), Buffer.from([137, 80, 78, 71, 0]));
    const document = path.join(root, 'docs/operations/content-readability.md');
    writeFileSync(document, '# Comparison\n\n[After](content-readability/after.png)\n');
    const renamed = 'docs/operations/content-readability/renamed.png';
    renameSync(path.join(root, comparisonImage), path.join(root, renamed));
    const changes = [
      { status: 'D', file: comparisonImage },
      { status: 'A', file: renamed },
    ];
    assert.throws(() => checkDocumentation(changes, root), /missing local target/u);
    symlinkSync(path.resolve('node_modules'), path.join(root, 'node_modules'), 'dir');
    changes.push({ status: 'M', file: 'docs/operations/content-readability.md' });
    writeFileSync(document, '# Comparison\n\n![After](content-readability/renamed.png)\n');
    checkDocumentation(changes, root);
    writeFileSync(document, '#  Unformatted\n');
    assert.throws(() => checkDocumentation(changes, root));
    writeFileSync(document, '# Comparison\n\n![After](content-readability/renamed.png)\n');
    rmSync(path.join(root, renamed));
    assert.throws(
      () => checkDocumentation([{ status: 'D', file: renamed }], root),
      /missing local target/u,
    );
    writeFileSync(document, '# Comparison\n');
    checkDocumentation([{ status: 'D', file: renamed }], root);
  } finally {
    rmSync(root, { recursive: true });
  }
});

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
    'scripts/release/build-history.ts',
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

test('Markdown inline images and image definitions detect missing files', () => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'abc-docs-markdown-images-'));
  try {
    writeFileSync(path.join(root, 'image space.png'), Buffer.from([137, 80, 78, 71, 0]));
    const document = path.join(root, 'document.md');
    writeFileSync(
      document,
      '![inline](image%20space.png?raw=true#preview)\n\n![reference][screen]\n\n[screen]: image%20space.png\n\n![external](https://example.com/absent.png)\n',
    );
    assert.equal(validateLinks(['document.md'], root), 2);
    for (const source of [
      '![inline](absent.png)\n',
      '![reference][screen]\n\n[screen]: absent.png\n',
    ]) {
      writeFileSync(document, source);
      assert.throws(() => validateLinks(['document.md'], root), /missing local target/u);
    }
  } finally {
    rmSync(root, { recursive: true });
  }
});
