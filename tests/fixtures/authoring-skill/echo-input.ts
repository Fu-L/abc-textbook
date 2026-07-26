const input = process.argv[2];

if (input === undefined || input.length === 0) {
  throw new Error('A command-line input is required.');
}

process.stdout.write(`${input}\n`);

export {};
