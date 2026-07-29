import { useEffect, useState } from 'react';

import { previewCatalog } from '../lib/catalog/preview-ui-catalog.js';
import { openLearningRecordDatabase } from '../lib/learning-records/database.js';
import { joinAndFilterLearningRecords } from '../lib/learning-records/filter.js';
import { listLearningRecords } from '../lib/learning-records/store.js';

interface Props {
  readonly base: string;
}

export default function ReviewProblemList({ base }: Props) {
  const [contest, setContest] = useState('');
  const [slot, setSlot] = useState('');
  const [items, setItems] = useState<ReturnType<typeof joinAndFilterLearningRecords>>([]);
  const [message, setMessage] = useState('復習対象を読み込んでいます。');

  useEffect(() => {
    let active = true;
    let database: Awaited<ReturnType<typeof openLearningRecordDatabase>> | null = null;
    void openLearningRecordDatabase()
      .then(async (opened) => {
        database = opened;
        const records = await listLearningRecords(opened);
        if (active) {
          setItems(
            joinAndFilterLearningRecords(previewCatalog.problems, records, {
              contest,
              slot,
              needsReview: true,
            }),
          );
          setMessage('復習対象は端末内の記録だけから表示しています。');
        }
      })
      .catch(() => {
        if (active) setMessage('端末内保存を利用できないため復習対象を表示できません。');
      });
    return () => {
      active = false;
      database?.close();
    };
  }, [contest, slot]);

  const prefix = base === '/' ? '' : base.replace(/\/$/u, '');
  return (
    <section>
      <p role="status">{message}</p>
      <label>
        コンテスト
        <select
          value={contest}
          onChange={(event) => {
            setContest(event.target.value);
          }}
        >
          <option value="">すべて</option>
          {[...new Set(previewCatalog.problems.map(({ contestId }) => contestId))].map((id) => (
            <option key={id}>{id}</option>
          ))}
        </select>
      </label>
      <label>
        問題記号
        <select
          value={slot}
          onChange={(event) => {
            setSlot(event.target.value);
          }}
        >
          <option value="">すべて</option>
          {[...new Set(previewCatalog.problems.map(({ label }) => label))].map((label) => (
            <option key={label}>{label}</option>
          ))}
        </select>
      </label>
      <p aria-live="polite">{String(items.length)}件の復習対象</p>
      <ul>
        {items.map(({ problem }) => (
          <li key={problem.id}>
            <a href={`${prefix}${problem.route}`}>
              {problem.id.toUpperCase()} — {problem.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
