import { describe, expect, it } from 'vitest';
import { findExplanationRepetition } from '../../src/lib/authoring/problem-authoring-document.js';

const observation =
  '全候補を一つずつ列挙する代わりに、共通の作用をまとめてから少数の例外だけを更新する。';

describe('explanation repetition review', () => {
  it('detects a repeated observation inside reasoning and across sections', () => {
    expect(findExplanationRepetition(`${observation}\n\n${observation}`, observation)).toEqual({
      withinReasoning: [observation],
      acrossSections: [observation],
    });
  });

  it('excludes code blocks and short repeated definitions', () => {
    const reasoning = `dp[0]=1。\n\ndp[0]=1。\n\n${observation}\n\n\`\`\`text\n${observation}\n\`\`\``;
    const correctness = `~~~text\n${observation}\n~~~`;
    expect(findExplanationRepetition(reasoning, correctness)).toEqual({
      withinReasoning: [],
      acrossSections: [],
    });
  });

  it('keeps distinct transitions and a separate invariant', () => {
    expect(
      findExplanationRepetition(
        '新しい状態へ旧dp[i]を加算する。次の状態へ旧dp[i+1]を加算する。',
        '各完成物には直前状態が一つだけ対応するため、遷移は重複なく候補を数える。',
      ),
    ).toEqual({ withinReasoning: [], acrossSections: [] });
  });
});
