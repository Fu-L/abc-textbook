import { useEffect, useState } from 'react';

import type { UiProblem } from '../lib/catalog/ui-catalog.js';
import { openLearningRecordDatabase } from '../lib/learning-records/database.js';
import {
  joinAndFilterLearningRecords,
  type FilterLearningUnit,
} from '../lib/learning-records/filter.js';
import { listLearningRecords } from '../lib/learning-records/store.js';
import type { LearningStatus } from '../lib/learning-records/types.js';

interface Props {
  readonly base: string;
  readonly learningUnits: readonly FilterLearningUnit[];
  readonly problems: readonly UiProblem[];
  readonly tags: readonly { readonly id: string; readonly name: string }[];
}

export default function ReviewProblemList({ base, learningUnits, problems, tags }: Props) {
  const [contest, setContest] = useState('');
  const [slot, setSlot] = useState('');
  const [tag, setTag] = useState('');
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState<LearningStatus | ''>('');
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
            joinAndFilterLearningRecords(
              problems,
              records,
              {
                contest,
                slot,
                tag,
                unit,
                status,
                needsReview: true,
              },
              learningUnits,
            ),
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
  }, [contest, problems, slot, status, tag, unit, learningUnits]);

  const prefix = base === '/' ? '' : base.replace(/\/$/u, '');
  return (
    <section data-pagefind-ignore>
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
          {[...new Set(problems.map(({ contestId }) => contestId))].map((id) => (
            <option key={id}>{id}</option>
          ))}
        </select>
      </label>
      <label>
        典型タグ
        <select
          value={tag}
          onChange={(event) => {
            setTag(event.target.value);
          }}
        >
          <option value="">すべて</option>
          {tags.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label>
        学習単位
        <select
          value={unit}
          onChange={(event) => {
            setUnit(event.target.value);
          }}
        >
          <option value="">すべて</option>
          {learningUnits.map(({ id, title }) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>
      </label>
      <label>
        学習状況
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as LearningStatus | '');
          }}
        >
          <option value="">すべて</option>
          <option value="unstarted">未着手</option>
          <option value="in_progress">学習中</option>
          <option value="completed">修了</option>
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
          {[...new Set(problems.map(({ label }) => label))].map((label) => (
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
