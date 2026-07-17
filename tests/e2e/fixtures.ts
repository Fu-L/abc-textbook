import { expect, test as base } from '@playwright/test';

import { FIXED_CLOCK_INSTANT } from '../setup/clock-constants.js';

interface FixedClock {
  advance(milliseconds: number): Promise<void>;
}

interface ClockFixtures {
  fixedClock: FixedClock;
}

export const test = base.extend<ClockFixtures>({
  fixedClock: [
    async ({ page }, use) => {
      let currentTime = FIXED_CLOCK_INSTANT.getTime();
      // navigation前に固定し、通常timerを止めずdocument初期化時から同じDateを使う。
      await page.clock.setFixedTime(currentTime);
      await use({
        advance: async (milliseconds) => {
          currentTime += milliseconds;
          await page.clock.setFixedTime(currentTime);
        },
      });
    },
    { auto: true },
  ],
});

export { expect };
