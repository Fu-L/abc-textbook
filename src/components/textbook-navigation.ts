import type { UiCatalog } from '../lib/catalog/ui-catalog.js';
import { requireCatalogEntity } from '../lib/catalog/ui-catalog.js';
import { TEXTBOOK_CHAPTERS } from '../lib/taxonomy/textbook-order.js';

// Editorial reading order is independent of the conceptual parent and prerequisite DAG.
export function textbookNavigation(units: UiCatalog['learningUnits'], currentRoute: string) {
  const byId = new Map(units.map((unit) => [unit.id, unit]));
  const chapters = TEXTBOOK_CHAPTERS.map((chapter, index) => {
    const root = requireCatalogEntity(byId.get(chapter.id), chapter.id);
    const children = chapter.unitIds.map((id) => requireCatalogEntity(byId.get(id), id));
    return {
      root,
      units: children,
      number: index + 1,
      current: [root, ...children].some((unit) => unit.route === currentRoute),
    };
  });
  const pages = chapters.flatMap(({ root, units }) => [root, ...units]);
  const index = pages.findIndex((unit) => unit.route === currentRoute);
  return {
    chapters,
    current: index < 0 ? undefined : pages[index],
    chapter: chapters.find((chapter) => chapter.current),
    previous: index > 0 ? pages[index - 1] : undefined,
    next: index < 0 ? undefined : pages[index + 1],
  };
}
