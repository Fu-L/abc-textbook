import { useEffect, useState } from 'react';

import { previewCatalog } from '../lib/catalog/preview-ui-catalog.js';
import { openLearningRecordDatabase } from '../lib/learning-records/database.js';
import { exportLearningRecordsJson } from '../lib/learning-records/export.js';
import { applyLearningRecordImport } from '../lib/learning-records/import-apply.js';
import {
  previewLearningRecordImport,
  type LearningRecordImportPreview,
} from '../lib/learning-records/import-preview.js';
import { listLearningRecords } from '../lib/learning-records/store.js';
import type { LearningRecordDatabase } from '../lib/learning-records/types.js';

const problemIds = new Set(previewCatalog.problems.map(({ id }) => id));

export default function LearningRecordSettings() {
  const [database, setDatabase] = useState<LearningRecordDatabase | null>(null);
  const [status, setStatus] = useState('保存状態を確認しています。');
  const [preview, setPreview] = useState<LearningRecordImportPreview | null>(null);
  const [policy, setPolicy] = useState<'newer-wins' | 'backup-wins' | 'cancel'>('newer-wins');

  useEffect(() => {
    let opened: LearningRecordDatabase | null = null;
    void openLearningRecordDatabase()
      .then(async (nextDatabase) => {
        opened = nextDatabase;
        setDatabase(nextDatabase);
        const records = await listLearningRecords(nextDatabase);
        setStatus(`${String(records.length)}件を端末内に保存しています。`);
      })
      .catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : '端末内保存を利用できません。');
      });
    return () => opened?.close();
  }, []);

  const download = async () => {
    if (!database) return;
    const json = await exportLearningRecordsJson(database, {
      catalogVersion: '2026.07.1',
      catalogProblemIds: problemIds,
    });
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'abc-textbook-learning-records.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus('バックアップを作成しました。');
  };

  const selectFile = async (file: File | undefined) => {
    if (!database || !file) return;
    try {
      const input: unknown = JSON.parse(await file.text());
      const local = await listLearningRecords(database);
      setPreview(previewLearningRecordImport(input, local, problemIds));
      setStatus('復元前プレビューを作成しました。内容と競合方針を確認してください。');
    } catch {
      setPreview(
        previewLearningRecordImport({ schemaVersion: 'invalid', records: [] }, [], problemIds),
      );
      setStatus('JSONを読み込めませんでした。');
    }
  };

  const apply = async () => {
    if (!database || !preview) return;
    try {
      const result = await applyLearningRecordImport(database, preview, policy);
      setStatus(
        result.cancelled
          ? '復元をキャンセルしました。'
          : `${String(result.appliedCount)}件を復元しました。`,
      );
      setPreview(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '復元に失敗しました。');
    }
  };

  return (
    <section>
      <p role="status" aria-live="polite">
        {status}
      </p>
      <p>学習記録にはアカウント、同期先、閲覧履歴などを含めません。</p>
      <button type="button" disabled={!database} onClick={() => void download()}>
        JSONバックアップを保存
      </button>
      <label>
        JSONバックアップを選択
        <input
          type="file"
          accept="application/json,.json"
          disabled={!database}
          onChange={(event) => void selectFile(event.target.files?.[0])}
        />
      </label>
      {preview && (
        <section aria-labelledby="import-preview-heading">
          <h2 id="import-preview-heading">復元前プレビュー</h2>
          <ul>
            {Object.entries(preview.counts).map(([classification, count]) => (
              <li key={classification}>
                {classification}: {count}件
              </li>
            ))}
          </ul>
          <details>
            <summary>項目ごとの判定</summary>
            <ul>
              {preview.items.map((item, index) => (
                <li key={`${item.problemId}-${String(index)}`}>
                  {item.problemId}: {item.classification}（{item.reason}）
                </li>
              ))}
            </ul>
          </details>
          <fieldset>
            <legend>競合方針</legend>
            {(['newer-wins', 'backup-wins', 'cancel'] as const).map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="merge-policy"
                  value={value}
                  checked={policy === value}
                  onChange={() => {
                    setPolicy(value);
                  }}
                />
                {value}
              </label>
            ))}
          </fieldset>
          <button type="button" disabled={!preview.applicable} onClick={() => void apply()}>
            方針を確認して適用
          </button>
        </section>
      )}
    </section>
  );
}
