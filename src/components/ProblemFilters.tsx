import { useEffect, useMemo, useState } from 'react';

import type { UiProblem } from '../lib/catalog/ui-catalog.js';
import { openLearningRecordDatabase } from '../lib/learning-records/database.js';
import { joinAndFilterLearningRecords } from '../lib/learning-records/filter.js';
import { listLearningRecords } from '../lib/learning-records/store.js';
import type { LearningRecord, LearningStatus } from '../lib/learning-records/types.js';

interface Props {
  readonly base: string;
  readonly problems: readonly UiProblem[];
  readonly tagNames: Readonly<Record<string, string>>;
  readonly unitTitles: Readonly<Record<string, string>>;
}

export default function ProblemFilters({ base, problems, tagNames, unitTitles }: Props) {
  const [name, setName] = useState('');
  const [contest, setContest] = useState('');
  const [slot, setSlot] = useState('');
  const [tag, setTag] = useState('');
  const [unit, setUnit] = useState('');
  const [status, setStatus] = useState<LearningStatus | ''>('');
  const [needsReview, setNeedsReview] = useState<'' | 'yes' | 'no'>('');
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [storageMessage, setStorageMessage] = useState('端末内の学習状態を読み込んでいます。');
  const [applied, setApplied] = useState({
    name: '',
    contest: '',
    slot: '',
    tag: '',
    unit: '',
    status: '' as LearningStatus | '',
    needsReview: '' as '' | 'yes' | 'no',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParameter = params.get('status');
    const parsedStatus: LearningStatus | '' =
      statusParameter === 'unstarted' ||
      statusParameter === 'in_progress' ||
      statusParameter === 'completed'
        ? statusParameter
        : '';
    const reviewParameter = params.get('needsReview');
    const parsedReview: '' | 'yes' | 'no' =
      reviewParameter === 'yes' || reviewParameter === 'no' ? reviewParameter : '';
    const next = {
      name: params.get('q') ?? '',
      contest: params.get('contest') ?? '',
      slot: params.get('slot') ?? '',
      tag: params.get('tag') ?? '',
      unit: params.get('unit') ?? '',
      status: parsedStatus,
      needsReview: parsedReview,
    };
    setName(next.name);
    setContest(next.contest);
    setSlot(next.slot);
    setTag(next.tag);
    setUnit(next.unit);
    setStatus(next.status);
    setNeedsReview(next.needsReview);
    setApplied(next);
  }, []);
  useEffect(() => {
    let active = true;
    let database: Awaited<ReturnType<typeof openLearningRecordDatabase>> | null = null;
    void openLearningRecordDatabase()
      .then(async (opened) => {
        database = opened;
        const saved = await listLearningRecords(opened);
        if (active) {
          setRecords(saved);
          setStorageMessage('学習状態はこの端末内だけで絞り込みます。');
        }
      })
      .catch(() => {
        if (active) setStorageMessage('端末内保存を利用できないため、静的条件だけで絞り込みます。');
      });
    return () => {
      active = false;
      database?.close();
    };
  }, []);
  const filtered = useMemo(
    () =>
      joinAndFilterLearningRecords(problems, records, {
        contest: applied.contest,
        slot: applied.slot,
        tag: applied.tag,
        unit: applied.unit,
        status: applied.status,
        needsReview: applied.needsReview === '' ? null : applied.needsReview === 'yes',
      })
        .map(({ problem }) => problem)
        .filter(
          (problem) =>
            !applied.name ||
            `${problem.id} ${problem.title}`
              .toLocaleLowerCase('ja')
              .includes(applied.name.toLocaleLowerCase('ja')),
        ),
    [applied, problems, records],
  );

  const apply = () => {
    const next = { name, contest, slot, tag, unit, status, needsReview };
    setApplied(next);
    const params = new URLSearchParams();
    if (name) params.set('q', name);
    if (contest) params.set('contest', contest);
    if (slot) params.set('slot', slot);
    if (tag) params.set('tag', tag);
    if (unit) params.set('unit', unit);
    if (status) params.set('status', status);
    if (needsReview) params.set('needsReview', needsReview);
    history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}`);
  };
  const reset = () => {
    setName('');
    setContest('');
    setSlot('');
    setTag('');
    setUnit('');
    setStatus('');
    setNeedsReview('');
    setApplied({ name: '', contest: '', slot: '', tag: '', unit: '', status: '', needsReview: '' });
    history.replaceState(null, '', location.pathname);
  };

  return (
    <section>
      <form
        data-pagefind-ignore
        role="search"
        aria-label="問題を絞り込む"
        onSubmit={(event) => {
          event.preventDefault();
          apply();
        }}
      >
        <label>
          問題名
          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </label>
        <label>
          コンテスト
          <select
            value={contest}
            onChange={(event) => {
              setContest(event.target.value);
            }}
          >
            <option value="">すべて</option>
            {[...new Set(problems.map(({ contestId }) => contestId))].map((value) => (
              <option key={value}>{value}</option>
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
            {[...new Set(problems.map(({ label }) => label))].map((value) => (
              <option key={value}>{value}</option>
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
            {Object.entries(tagNames).map(([id, title]) => (
              <option key={id} value={id}>
                {title}
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
            {Object.entries(unitTitles).map(([id, title]) => (
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
          要復習
          <select
            value={needsReview}
            onChange={(event) => {
              setNeedsReview(event.target.value as '' | 'yes' | 'no');
            }}
          >
            <option value="">すべて</option>
            <option value="yes">要復習のみ</option>
            <option value="no">要復習でないもの</option>
          </select>
        </label>
        <div>
          <button type="submit">適用</button>
          <button type="button" onClick={reset}>
            すべて解除
          </button>
        </div>
      </form>
      <p>{storageMessage}</p>
      <p aria-live="polite">
        {filtered.length > 0
          ? `${String(filtered.length)}件の問題が該当します。`
          : '0件です。検索語や条件を変更するか、すべて解除してください。'}
      </p>
      <ul>
        {filtered.map((problem) => (
          <li key={problem.id}>
            <a href={`${base === '/' ? '' : base.replace(/\/$/u, '')}${problem.route}`}>
              {problem.id.toUpperCase()} — {problem.title}
            </a>
            （ABC {problem.contestNumber} {problem.label}）
          </li>
        ))}
      </ul>
    </section>
  );
}
