const input = process.argv[2];
const p = input === undefined ? Number.NaN : Number(input);

const isPrime = (value: number): boolean => {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
};

if (!isPrime(p) || p > 10_000) {
  throw new Error('This executable example accepts a small prime P only.');
}

let pairCount = 0;
for (let x = 0; x < p; x += 1) {
  const reachable = new Set<number>();
  let power = 1;
  // For a non-zero x modulo a prime P, the powers repeat within P-1 steps.
  // The same loop also covers x = 0, whose only reachable value is 0.
  for (let exponent = 1; exponent <= p; exponent += 1) {
    power = (power * x) % p;
    reachable.add(power);
  }
  pairCount += reachable.size;
}

process.stdout.write(`${String(pairCount)}\n`);

export {};
