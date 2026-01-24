import { BaseSettingsModel } from 'bc-deeplib/deeplib';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const KeyframeTypeSchema = z.enum(['expression', 'pose', 'restraint', 'appearance']);
export type KeyframeType = z.infer<typeof KeyframeTypeSchema>;

const KeyframeBaseSchema = z.object({
  id: z.string().default(() => uuidv4()),
  type: KeyframeTypeSchema,
  durationMs: z.number().min(0).default(500),
});

export const ExpressionKeyframeSchema = KeyframeBaseSchema.extend({
  type: z.literal('expression'),
  group: z.string(),
  expression: z.string().nullable().optional(),
  color: z.union([z.string(), z.array(z.string())]).optional(),
});
export type ExpressionKeyframe = z.infer<typeof ExpressionKeyframeSchema>;

export const PoseKeyframeSchema = KeyframeBaseSchema.extend({
  type: z.literal('pose'),
  poseName: z.string(),
});
export type PoseKeyframe = z.infer<typeof PoseKeyframeSchema>;

export const RestraintKeyframeSchema = KeyframeBaseSchema.extend({
  type: z.literal('restraint'),
  group: z.string(),
  asset: z.object({
    name: z.string(),
    color: z.union([z.string(), z.array(z.string())]).optional(),
    property: z.record(z.string(), z.any()).optional(),
  }),
});
export type RestraintKeyframe = z.infer<typeof RestraintKeyframeSchema>;

export const AppearanceKeyframeSchema = KeyframeBaseSchema.extend({
  type: z.literal('appearance'),
  group: z.string(),
  asset: z.object({
    name: z.string(),
    color: z.union([z.string(), z.array(z.string())]).optional(),
    property: z.record(z.string(), z.any()).optional(),
  })
});
export type AppearanceKeyframe = z.infer<typeof AppearanceKeyframeSchema>;

export const KeyframeSchema = z.discriminatedUnion('type', [
  ExpressionKeyframeSchema,
  PoseKeyframeSchema,
  RestraintKeyframeSchema,
  AppearanceKeyframeSchema,
]);
export type Keyframe = z.infer<typeof KeyframeSchema>;

export const AnimationSchema = z.object({
  id: z.string().default(() => uuidv4()),
  name: z.string().default('New Animation'),
  keyframes: z.array(KeyframeSchema).default([]),
  tags: z.array(z.string()).default([]),
  loopCount: z.number().int().min(0).default(1),
});
export type Animation = z.infer<typeof AnimationSchema>;

export const AnimationInputSchema = AnimationSchema.partial({ id: true, name: true });
export type AnimationInput = z.infer<typeof AnimationInputSchema>;

export type AnimatronikkaSettingsModel = BaseSettingsModel & {
  animations: Record<string, Animation>;
};
