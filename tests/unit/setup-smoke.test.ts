import { describe, expect, it } from 'vitest';

import { FIXED_CLOCK_INSTANT, FIXED_CLOCK_ISO, useFixedClock } from '../setup/fixed-clock.js';

describe('Phase 1 test setup', () => {
  it('provides an offset-qualified deterministic clock', () => {
    useFixedClock();

    expect(new Date().toISOString()).toBe(FIXED_CLOCK_INSTANT.toISOString());
    expect(FIXED_CLOCK_ISO).toMatch(/[+-]\d{2}:\d{2}$/u);
  });
});
