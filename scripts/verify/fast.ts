import { runVerification } from './runner.js';

process.exitCode = await runVerification({
  args: process.argv.slice(2),
  env: process.env,
});
