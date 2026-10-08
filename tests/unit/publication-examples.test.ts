import { describe, expect, it } from 'vitest';
import { validatePublicationExamples } from '../../src/lib/authoring/publication-examples.js';

const example = {
  key: 'run-example',
  kind: 'executable' as const,
  language: 'javascript',
  verificationStatus: 'passed' as const,
};
const validate = (
  body: string,
  examples: Parameters<typeof validatePublicationExamples>[1] = [],
) => {
  validatePublicationExamples(body, examples, (reason) => {
    throw new Error(reason);
  });
};

describe('current publication example checks', () => {
  it.each(['pending', 'failed'] as const)(
    'rejects a %s example even when its target is an external file',
    (verificationStatus) => {
      expect(() => {
        validate('Run the linked example file.', [{ ...example, verificationStatus }]);
      }).toThrow('EXAMPLE_HOLD:run-example');
    },
  );
  it.each(['```', '~~~', '````', '~~~~'])(
    'checks executable blocks with %s fences and language annotations',
    (fence) => {
      const body = `${fence}javascript title="実行例"\nconsole.log(1);\n${fence}`;
      expect(() => {
        validate(body);
      }).toThrow('UNREGISTERED_EXECUTABLE:javascript');
      expect(() => {
        validate(body, [example]);
      }).not.toThrow();
      expect(() => {
        validate(body, [{ ...example, language: 'python' }]);
      }).toThrow('UNREGISTERED_EXECUTABLE:javascript');
      expect(() => {
        validate(`${body}\n${body}`, [example]);
      }).toThrow('UNREGISTERED_EXECUTABLE:javascript');
    },
  );
  it('keeps explicitly non-executable blocks optional and ignores fences quoted inside them', () => {
    const body = [
      '````text\n```python\nassert False\n```\n````',
      '~~~pseudocode\nfor each pivot: eliminate its highest bit\n~~~',
      '```math\nA x = b\n```',
      '`console.log(1)` is an inline notation.',
    ].join('\n\n');
    expect(() => {
      validate(body);
    }).not.toThrow();
    expect(() => {
      validate(`${body}\n~~~javascript\nconsole.log(1);\n~~~`);
    }).toThrow('UNREGISTERED_EXECUTABLE:javascript');
  });
  it('requires an executable registration rather than a pseudocode example in the same language', () => {
    expect(() => {
      validate('```javascript\nconsole.log(1);\n```', [
        { ...example, kind: 'pseudocode', verificationStatus: 'not_applicable' },
      ]);
    }).toThrow('UNREGISTERED_EXECUTABLE:javascript');
  });
});
