import { z } from 'zod';

export const EntityIdSchema = z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u);
/** Stable only inside its owning authoring document; never a Catalog entity ID. */
export const ContentBlockKeyPattern = '[a-z][a-z0-9]*(?:-[a-z0-9]+)*';
export const ContentBlockKeySchema = z
  .string()
  .regex(new RegExp(`^${ContentBlockKeyPattern}$`, 'u'));
export const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
export const ContentReviewModeSchema = z.enum(['self', 'third_party']);
export const ContentReviewRiskReasonSchema = z.enum([
  'official_source_conflict',
  'original_proof',
  'major_classification_change',
]);
export const OffsetDateTimeSchema = z.iso.datetime({ offset: true });
export const SafePathSchema = z
  .string()
  .regex(
    /^(?!\/)(?!.*\/$)(?!.*\/\/)(?!^(?:\.{1,2})(?:\/|$))(?!.*\/(?:\.{1,2})(?:\/|$))[A-Za-z0-9._/-]+$/u,
  );
export const ProblemLabelSchema = z
  .string()
  .regex(/^[A-Za-z][A-Za-z0-9+_-]*$/u)
  .max(16);
export const ContestIdSchema = z.string().regex(/^abc[0-9]{3,}$/u);
export const ProblemIdSchema = z.string().regex(/^abc[0-9]{3,}-[a-z][a-z0-9+_-]*$/u);
