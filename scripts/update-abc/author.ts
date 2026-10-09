import type { AuthoringSkillSubject } from '../../src/lib/authoring/explanation-authoring-skill.js';

interface AuthoringTarget {
  readonly problemId: string;
  readonly slotLabel: string;
  readonly draftPath?: string;
  readonly packetPath?: string;
  readonly templatePath?: string;
  readonly block?: {
    readonly code: string;
    readonly reason: string;
    readonly retryCondition: string;
  };
}

export interface AuthoringResult {
  readonly problemId: string;
  readonly slotLabel: string;
  readonly resultType: 'authoring_unit_draft' | 'authoring_required' | 'blocked';
  readonly draftPath: string | null;
  readonly packetPath: string | null;
  readonly templatePath: string | null;
  readonly reasonCode: string | null;
  readonly reason: string | null;
  readonly retryCondition: string | null;
  readonly authoringSkillVersion?: string;
  readonly authoringSkillDigest?: string;
}

export const prepareAuthoringResults = (input: {
  readonly skill?: AuthoringSkillSubject;
  readonly targets: readonly AuthoringTarget[];
}): AuthoringResult[] =>
  input.targets.map((target) => {
    const shared = {
      problemId: target.problemId,
      slotLabel: target.slotLabel,
      ...(input.skill
        ? { authoringSkillVersion: input.skill.version, authoringSkillDigest: input.skill.digest }
        : {}),
    };
    if (target.draftPath)
      return {
        ...shared,
        resultType: 'authoring_unit_draft' as const,
        draftPath: target.draftPath,
        packetPath: null,
        templatePath: null,
        reasonCode: null,
        reason: null,
        retryCondition: null,
      };
    if (target.packetPath && target.templatePath)
      return {
        ...shared,
        resultType: 'authoring_required' as const,
        draftPath: null,
        packetPath: target.packetPath,
        templatePath: target.templatePath,
        reasonCode: 'AUTHORING_REQUIRED',
        reason: 'Complete authoring inputs are ready for explanation authoring.',
        retryCondition: null,
      };
    const block = target.block ?? {
      code: 'GENERATOR_UNAVAILABLE',
      reason: 'No complete draft or authoring packet is available.',
      retryCondition: 'Provide a complete packet or draft and resume.',
    };
    return {
      ...shared,
      resultType: 'blocked' as const,
      draftPath: null,
      packetPath: target.packetPath ?? null,
      templatePath: target.templatePath ?? null,
      reasonCode: block.code,
      reason: block.reason,
      retryCondition: block.retryCondition,
    };
  });
