import { describe, expect, it } from 'vitest';
import { publicCatalog } from '../../src/lib/catalog/public-catalog.js';
import { TEXTBOOK_CHAPTERS } from '../../src/lib/taxonomy/textbook-order.js';
import { textbookNavigation } from '../../src/components/textbook-navigation.js';

describe('textbook navigation', () => {
  it('covers every Unit exactly once and follows the existing reading order across chapters', () => {
    const ids = TEXTBOOK_CHAPTERS.flatMap((chapter) => [chapter.id, ...chapter.unitIds]);
    expect(new Set(ids).size).toBe(publicCatalog.learningUnits.length);
    const byId = new Map(publicCatalog.learningUnits.map((unit) => [unit.id, unit]));
    for (const [index, id] of ids.entries()) {
      const unit = byId.get(id);
      if (!unit) throw new Error(id);
      const navigation = textbookNavigation(publicCatalog.learningUnits, unit.route);
      expect(navigation.current?.id).toBe(id);
      expect(navigation.previous?.id).toBe(ids[index - 1]);
      expect(navigation.next?.id).toBe(ids[index + 1]);
      expect(navigation.chapters.filter((chapter) => chapter.current)).toHaveLength(1);
      expect(navigation.chapter?.root.id).toBe(
        TEXTBOOK_CHAPTERS.find((chapter) => [chapter.id, ...chapter.unitIds].includes(id))?.id,
      );
    }
  });

  it('keeps the editorial chapter distinct from the conceptual parent', () => {
    const unit = publicCatalog.learningUnits.find(
      (unit) => unit.id === 'unit-priority-queue-best-first',
    );
    if (!unit) throw new Error('Missing representative Unit');
    const navigation = textbookNavigation(publicCatalog.learningUnits, unit.route);
    expect(unit.parentId).toBe('unit-ordered-set-heap');
    expect(navigation.chapter?.root.id).toBe('unit-chapter-query');
    expect(navigation.previous?.id).toBe('unit-ordered-set-heap');
    expect(navigation.next?.id).toBe('unit-ordered-set-multiset');
  });

  it('keeps the index and non-Unit pages free of an invented current position or neighbors', () => {
    for (const route of ['/learn/', '/problems/abc391-f/', '/learn/unknown/']) {
      const navigation = textbookNavigation(publicCatalog.learningUnits, route);
      expect(navigation.current).toBeUndefined();
      expect(navigation.chapter).toBeUndefined();
      expect(navigation.previous).toBeUndefined();
      expect(navigation.next).toBeUndefined();
      expect(navigation.chapters.some((chapter) => chapter.current)).toBe(false);
    }
  });
});
