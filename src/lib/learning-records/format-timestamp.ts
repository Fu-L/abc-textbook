export function formatLearningRecordTimestamp(
  value: string | null,
  timeZone = 'Asia/Tokyo',
): string {
  if (!value) return '更新記録なし';
  const offset = /(?:Z|[+-]\d{2}:\d{2})$/u.exec(value)?.[0] ?? 'offset不明';
  const localized = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone,
  }).format(new Date(value));
  return `${localized}（${timeZone}、保存時offset ${offset}）`;
}
