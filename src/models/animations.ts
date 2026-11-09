import { BaseSettingsModel } from 'bc-deeplib/deeplib';
import { v4 as uuidv4 } from 'uuid';

export const keyframeTypes = ['expression', 'pose', 'restraint', 'appearance'] as const;
export type KeyframeType = (typeof keyframeTypes)[number];

type KeyframeBase = {
  id: string;
  durationMs: number;
};

type KeyframeAsset = {
  name: string;
  color?: ItemColor;
  property?: Record<string, any>;
};

export type ExpressionKeyframe = KeyframeBase & {
  type: 'expression';
  group: string;
  expression?: string | null;
  color?: ItemColor;
};

export type PoseKeyframe = KeyframeBase & {
  type: 'pose';
  poseName: string;
};

export type RestraintKeyframe = KeyframeBase & {
  type: 'restraint';
  group: string;
  asset: KeyframeAsset;
};

export type AppearanceKeyframe = KeyframeBase & {
  type: 'appearance';
  group: string;
  asset: KeyframeAsset;
};

export type Keyframe = ExpressionKeyframe | PoseKeyframe | RestraintKeyframe | AppearanceKeyframe;

export type Animation = {
  id: string;
  name: string;
  keyframes: Keyframe[];
  tags: string[];
  loopCount: number;
};

export type AnimationInput = Omit<Animation, 'id' | 'name'> & {
  id?: string;
  name?: string;
};

export function applyAnimationDefaults(input: AnimationInput): Animation {
  return {
    id: input.id ?? uuidv4(),
    name: input.name ?? 'New Animation',
    keyframes: (input.keyframes ?? []).map(keyframe => ({
      ...keyframe,
      id: keyframe.id ?? uuidv4(),
      durationMs: keyframe.durationMs ?? 500,
    })),
    tags: input.tags ?? [],
    loopCount: input.loopCount ?? 1,
  };
}

export type AnimatronikkaSettingsModel = BaseSettingsModel & {
  animations: Record<string, Animation>;
};
