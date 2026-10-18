/** @param {string} file */
export const isComparisonImage = (file) =>
  /^docs\/operations\/(?:content-readability|content-widths|document-contents|explanation-writing|problem-lists|problem-reading|study-entry-points|study-indexes|study-ux-baseline|study-ux-math|study-ux-prototype|textbook-navigation|typography|unit-reading)\/[^/]+\.png$/u.test(
    file,
  );

/** Shared by the runner and the standalone documentation checker. @param {string} file */
export const documentationPath = (file) =>
  [
    'AGENTS.md',
    'README.md',
    '.specify/feature.json',
    '.specify/memory/constitution.md',
    'docs/README.md',
  ].includes(file) ||
  /^\.specify\/templates\/[^/]+\.md$/u.test(file) ||
  /^docs\/operations\/[^/]+\.md$/u.test(file) ||
  /^specs\/\d{3}-[^/]+\/(?:[^/]+\/)*[^/]+\.md$/u.test(file) ||
  isComparisonImage(file);
