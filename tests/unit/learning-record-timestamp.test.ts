import { describe, expect, it } from 'vitest';

import { formatLearningRecordTimestamp } from '../../src/lib/learning-records/format-timestamp.js';

describe('learning record timestamp', () => {
  it('has a stable IANA timezone and retains the stored offset', () => {
    expect(formatLearningRecordTimestamp('2026-07-29T08:00:00-04:00')).toContain('Asia/Tokyo');
    expect(formatLearningRecordTimestamp('2026-07-29T08:00:00-04:00')).toContain('-04:00');
    expect(formatLearningRecordTimestamp('2026-07-29T21:00:00+09:00')).toContain('+09:00');
  });

  it('uses the required empty state', () => {
    expect(formatLearningRecordTimestamp(null)).toBe('更新記録なし');
  });
});
