import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import GithubSlugger from 'github-slugger';

const documentationPath = (file) =>
  [
    'AGENTS.md',
    'README.md',
    '.specify/feature.json',
    '.specify/memory/constitution.md',
    'docs/README.md',
  ].includes(file) ||
  /^\.specify\/templates\/[^/]+\.md$/u.test(file) ||
  /^docs\/operations\/[^/]+\.md$/u.test(file) ||
  /^specs\/\d{3}-[^/]+\/(?:[^/]+\/)*[^/]+\.md$/u.test(file);

export const isDocumentationDiff = (changes) =>
  changes.length > 0 &&
  changes.every(({ status, file }) => ['A', 'M'].includes(status) && documentationPath(file));

export const readChanges = (
  env = process.env,
  git = (args) => execFileSync('git', args, { encoding: 'utf8' }).trim(),
) => {
  try {
    const event = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
    const base =
      env.GITHUB_EVENT_NAME === 'pull_request'
        ? event.pull_request.base.sha
        : env.GITHUB_EVENT_NAME === 'push'
          ? event.before
          : '';
    const head = git(['rev-parse', 'HEAD']);
    if (!/^[a-f0-9]{40}$/u.test(base) || /^0+$/u.test(base) || head !== env.GITHUB_SHA) return [];
    git(['rev-parse', '--verify', `${base}^{commit}`]);
    const comparison =
      env.GITHUB_EVENT_NAME === 'pull_request' ? git(['merge-base', base, head]) : base;
    const fields = git(['diff', '--name-status', '--no-renames', '-z', comparison, head]).split(
      '\0',
    );
    if (fields.at(-1) === '') fields.pop();
    if (fields.length % 2 !== 0) return [];
    return Array.from({ length: fields.length / 2 }, (_, i) => ({
      status: fields[2 * i],
      file: fields[2 * i + 1],
    }));
  } catch {
    return [];
  }
};

const parser = unified().use(remarkParse).use(remarkGfm);
const walk = (node, visit) => {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
};
const plainText = (node) =>
  node.type === 'html' ? '' : (node.value ?? (node.children ?? []).map(plainText).join(''));

export const validateLinks = (files, root = process.cwd()) => {
  const anchors = new Map();
  let checked = 0;
  for (const file of files.filter(
    (file) => file.endsWith('.md') && !file.startsWith('.specify/templates/'),
  )) {
    walk(parser.parse(readFileSync(path.join(root, file), 'utf8')), (node) => {
      if (
        !['link', 'definition'].includes(node.type) ||
        /^[a-z][a-z0-9+.-]*:/iu.test(node.url) ||
        node.url.startsWith('//')
      )
        return;
      const [target, fragment] = node.url.split('#');
      const destination = target
        ? path.resolve(root, path.dirname(file), decodeURIComponent(target))
        : path.join(root, file);
      checked++;
      if (!existsSync(destination)) throw Error(`${file}: missing local target ${node.url}`);
      if (!fragment || !destination.endsWith('.md')) return;
      if (!anchors.has(destination)) {
        const slugger = new GithubSlugger();
        const ids = new Set();
        walk(parser.parse(readFileSync(destination, 'utf8')), (heading) => {
          if (heading.type === 'heading') ids.add(slugger.slug(plainText(heading)));
          if (heading.type === 'html')
            for (const match of heading.value.matchAll(/(?:id|name)=["']([^"']+)["']/gu))
              ids.add(match[1]);
        });
        anchors.set(destination, ids);
      }
      if (!anchors.get(destination).has(decodeURIComponent(fragment)))
        throw Error(`${file}: missing local anchor ${node.url}`);
    });
  }
  return checked;
};

export const checkDocumentation = (changes, root = process.cwd()) => {
  const files = changes.map(({ file }) => file);
  execFileSync(
    process.execPath,
    [
      path.join(root, 'node_modules/prettier/bin/prettier.cjs'),
      '--check',
      '--ignore-path',
      '/dev/null',
      ...files,
    ],
    { cwd: root, stdio: 'inherit' },
  );
  if (files.includes('.specify/feature.json')) {
    const feature = JSON.parse(
      readFileSync(path.join(root, '.specify/feature.json'), 'utf8'),
    ).feature_directory;
    if (
      typeof feature !== 'string' ||
      !/^specs\/\d{3}-[^/]+$/u.test(feature) ||
      !existsSync(path.join(root, feature, 'spec.md'))
    )
      throw Error('Invalid feature directory');
  }
  const count = validateLinks(files, root);
  console.log(`Documentation validation passed: ${files.length} files, ${count} local references.`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const changes = readChanges();
  const docsOnly = isDocumentationDiff(changes);
  if (docsOnly) checkDocumentation(changes);
  else
    console.log('Substantive, empty, deleted/renamed, or unknown diff: retain full verification.');
  appendFileSync(process.env.GITHUB_OUTPUT, `docs-only=${docsOnly}\n`);
}
