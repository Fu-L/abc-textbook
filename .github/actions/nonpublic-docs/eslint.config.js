import eslint from '@eslint/js';
import globals from 'globals';

// Workflow-local JavaScript uses the existing ESLint 10 file-based config lookup.
export default [eslint.configs.recommended, { languageOptions: { globals: globals.node } }];
