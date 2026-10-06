import { useEffect, useState } from 'react';

import { openLearningRecordDatabase } from '../lib/learning-records/database.js';
import { exportLearningRecordsJson } from '../lib/learning-records/export.js';
import { applyLearningRecordImport } from '../lib/learning-records/import-apply.js';
import {
  previewLearningRecordImport,
  type LearningRecordImportPreview,
} from '../lib/learning-records/import-preview.js';
import { listLearningRecords } from '../lib/learning-records/store.js';
import type { LearningRecordDatabase } from '../lib/learning-records/types.js';

interface Props {
  readonly catalogProblemIds: readonly string[];
  readonly catalogVersion: string;
}

export default function LearningRecordSettings({ catalogProblemIds, catalogVersion }: Props) {
  const problemIds = new Set(catalogProblemIds);
  const [database, setDatabase] = useState<LearningRecordDatabase | null>(null);
  const [status, setStatus] = useState('保存状態を確認しています。');
  const [preview, setPreview] = useState<LearningRecordImportPreview | null>(null);
  const [policy, setPolicy] = useState<'' | 'newer-wins' | 'backup-wins' | 'cancel'>('');

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
      catalogVersion,
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
    if (!database || !preview || !policy) return;
    try {
      const result = await applyLearningRecordImport(database, preview, policy);
      setStatus(
        result.cancelled
          ? '復元をキャンセルしました。'
          : `${String(result.appliedCount)}件を復元しました。`,
      );
      setPreview(null);
      setPolicy('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '復元に失敗しました。');
    }
  };

  return (
    <section data-pagefind-ignore>
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
                  <strong>{item.problemId}</strong>: {item.classification}（{item.reason}）
                  {item.incoming && (
                    <dl>
                      <dt>backup status</dt>
                      <dd>
                        {item.incoming.status} / {item.incoming.statusUpdatedAt ?? '更新記録なし'}
                      </dd>
                      <dt>local status</dt>
                      <dd>
                        {item.local?.status ?? '記録なし'} /{' '}
                        {item.local?.statusUpdatedAt ?? '更新記録なし'}
                      </dd>
                      <dt>backup needsReview</dt>
                      <dd>
                        {String(item.incoming.needsReview)} /{' '}
                        {item.incoming.needsReviewUpdatedAt ?? '更新記録なし'}
                      </dd>
                      <dt>local needsReview</dt>
                      <dd>
                        {item.local ? String(item.local.needsReview) : '記録なし'} /{' '}
                        {item.local?.needsReviewUpdatedAt ?? '更新記録なし'}
                      </dd>
                    </dl>
                  )}
                  {item.components.length > 0 && (
                    <ul>
                      {item.components.map((component) => (
                        <li key={component.component}>
                          {component.component}: 採用元 {component.source} / 理由 {component.reason}{' '}
                          / 結果 {String(component.result)}
                        </li>
                      ))}
                    </ul>
                  )}
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
          {policy && (
            <p role="status">
              {policy === 'newer-wins'
                ? '各componentの実時刻を比較し、新しい側を採用します。同時刻はlocalを維持します。'
                : policy === 'backup-wins'
                  ? '表示したbackupの値と日時でlocal recordを上書きします。'
                  : '変更を適用せずキャンセルします。'}
            </p>
          )}
          <button
            type="button"
            disabled={!preview.applicable || !policy}
            onClick={() => void apply()}
          >
            方針を確認して適用
          </button>
        </section>
      )}
    </section>
  );
}
