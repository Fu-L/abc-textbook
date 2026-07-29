import { useEffect, useState } from 'react';

import { openLearningRecordDatabase } from '../lib/learning-records/database.js';
import {
  getLearningRecord,
  updateLearningStatus,
  updateNeedsReview,
} from '../lib/learning-records/store.js';
import type {
  LearningRecord,
  LearningRecordDatabase,
  LearningStatus,
} from '../lib/learning-records/types.js';

interface Props {
  readonly problemId: string;
}

const statusLabels: Readonly<Record<LearningStatus, string>> = {
  unstarted: '未着手',
  in_progress: '学習中',
  completed: '修了',
};

function formatTimestamp(value: string | null) {
  if (!value) return '更新記録なし';
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(value));
}

export default function LearningRecordControl({ problemId }: Props) {
  const [database, setDatabase] = useState<LearningRecordDatabase | null>(null);
  const [record, setRecord] = useState<LearningRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('端末内の保存状態を確認しています。');
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    let opened: LearningRecordDatabase | null = null;
    void openLearningRecordDatabase()
      .then(async (nextDatabase) => {
        opened = nextDatabase;
        const nextRecord = await getLearningRecord(nextDatabase, problemId);
        if (active) {
          setDatabase(nextDatabase);
          setRecord(nextRecord);
          setMessage('端末内だけに保存します。外部送信は行いません。');
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setUnavailable(true);
          setMessage(error instanceof Error ? error.message : '端末内保存を利用できません。');
        }
      });
    return () => {
      active = false;
      opened?.close();
    };
  }, [problemId]);

  const saveStatus = async (status: LearningStatus) => {
    if (!database || !record) return;
    const previous = record;
    setBusy(true);
    setRecord({ ...record, status });
    try {
      const saved = await updateLearningStatus(database, problemId, status);
      setRecord(saved);
      setMessage('進捗を保存しました。');
    } catch (error) {
      setRecord(previous);
      setMessage(
        `進捗を保存できませんでした。表示を元に戻しました。${error instanceof Error ? `（${error.message}）` : ''}`,
      );
    } finally {
      setBusy(false);
    }
  };

  const saveReview = async (needsReview: boolean) => {
    if (!database || !record) return;
    const previous = record;
    setBusy(true);
    setRecord({ ...record, needsReview });
    try {
      const saved = await updateNeedsReview(database, problemId, needsReview);
      setRecord(saved);
      setMessage('復習設定を保存しました。');
    } catch (error) {
      setRecord(previous);
      setMessage(
        `復習設定を保存できませんでした。表示を元に戻しました。${error instanceof Error ? `（${error.message}）` : ''}`,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="learning-record-heading" data-learning-record-control={problemId}>
      <h2 id="learning-record-heading">学習記録</h2>
      <p>Problem ID（{problemId}）をキーに、この端末へ保存します。</p>
      <label>
        学習状況
        <select
          aria-label="学習状況"
          disabled={!record || busy || unavailable}
          value={record?.status ?? 'unstarted'}
          onChange={(event) => void saveStatus(event.target.value as LearningStatus)}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <p>状況更新: {formatTimestamp(record?.statusUpdatedAt ?? null)}</p>
      <label>
        <input
          type="checkbox"
          disabled={!record || busy || unavailable}
          checked={record?.needsReview ?? false}
          onChange={(event) => void saveReview(event.target.checked)}
        />
        要復習
      </label>
      <p>復習設定更新: {formatTimestamp(record?.needsReviewUpdatedAt ?? null)}</p>
      <p role={unavailable ? 'alert' : 'status'} aria-live="polite">
        {message}
      </p>
    </section>
  );
}
