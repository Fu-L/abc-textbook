import { afterEach, vi } from 'vitest';

export const FIXED_CLOCK_ISO = '2026-07-14T12:00:00+09:00';
export const FIXED_CLOCK_INSTANT = new Date(FIXED_CLOCK_ISO);

// 日時に依存する検証は、呼び出し側が必要なテストだけ固定時計を有効化する。
export function useFixedClock(now: Date | string = FIXED_CLOCK_INSTANT): void {
  vi.useFakeTimers({
    now: typeof now === 'string' ? new Date(now) : now,
    shouldClearNativeTimers: true,
  });
}

export function useRealClock(): void {
  if (vi.isFakeTimers()) {
    vi.clearAllTimers();
    vi.useRealTimers();
  }
}

afterEach(() => {
  // テスト間でfake timerが漏れると、後続テストの待機やタイムアウトを壊す。
  useRealClock();
});
