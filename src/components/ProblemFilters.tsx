import { useEffect, useMemo, useState } from 'react';

import type { PreviewProblem } from '../lib/catalog/preview-ui-catalog.js';

interface Props {
  readonly base: string;
  readonly problems: readonly PreviewProblem[];
  readonly tagNames: Readonly<Record<string, string>>;
  readonly unitTitles: Readonly<Record<string, string>>;
}

export default function ProblemFilters({ base, problems, tagNames, unitTitles }: Props) {
  const [name, setName] = useState('');
  const [contest, setContest] = useState('');
  const [slot, setSlot] = useState('');
  const [tag, setTag] = useState('');
  const [unit, setUnit] = useState('');
  const [applied, setApplied] = useState({ name: '', contest: '', slot: '', tag: '', unit: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const next = {
      name: params.get('q') ?? '',
      contest: params.get('contest') ?? '',
      slot: params.get('slot') ?? '',
      tag: params.get('tag') ?? '',
      unit: params.get('unit') ?? '',
    };
    setName(next.name);
    setContest(next.contest);
    setSlot(next.slot);
    setTag(next.tag);
    setUnit(next.unit);
    setApplied(next);
  }, []);
  const filtered = useMemo(
    () =>
      problems.filter(
        (problem) =>
          (!applied.name ||
            `${problem.id} ${problem.title}`
              .toLocaleLowerCase('ja')
              .includes(applied.name.toLocaleLowerCase('ja'))) &&
          (!applied.contest || problem.contestId === applied.contest) &&
          (!applied.slot || problem.label === applied.slot) &&
          (!applied.tag || problem.tagIds.includes(applied.tag)) &&
          (!applied.unit || problem.learningUnitId === applied.unit),
      ),
    [applied, problems],
  );

  const apply = () => {
    const next = { name, contest, slot, tag, unit };
    setApplied(next);
    const params = new URLSearchParams();
    if (name) params.set('q', name);
    if (contest) params.set('contest', contest);
    if (slot) params.set('slot', slot);
    if (tag) params.set('tag', tag);
    if (unit) params.set('unit', unit);
    history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}`);
  };
  const reset = () => {
    setName('');
    setContest('');
    setSlot('');
    setTag('');
    setUnit('');
    setApplied({ name: '', contest: '', slot: '', tag: '', unit: '' });
    history.replaceState(null, '', location.pathname);
  };

  return (
    <section>
      <form
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
        <div>
          <button type="submit">適用</button>
          <button type="button" onClick={reset}>
            すべて解除
          </button>
        </div>
      </form>
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
