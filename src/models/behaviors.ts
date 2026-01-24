import { BaseSettingsModel } from 'bc-deeplib/deeplib';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// #region Misc

export const OrgasmTypeSchema = z.enum(['any', 'normal', 'resisted', 'ruinedResisted', 'ruinedTimeout', 'ruinedSurrendered']);
export type OrgasmType = z.infer<typeof OrgasmTypeSchema>;

export const TriggerOrgasmTypeSchema = OrgasmTypeSchema.exclude(['any']);
export type TriggerOrgasmType = z.infer<typeof TriggerOrgasmTypeSchema>;

export const ConstraintModeSchema = z.enum(['any', 'all']);
export type ConstraintMode = z.infer<typeof ConstraintModeSchema>;

export const SpeechTypeSchema = z.enum(['any', 'normal', 'whisper']);
export type SpeechType = z.infer<typeof SpeechTypeSchema>;

export const ReactionModeSchema = z.enum(['all', 'random']);
export type ReactionMode = z.infer<typeof ReactionModeSchema>;

export const MatchModeSchema = z.enum(['startsWith', 'contains', 'endsWith', 'exact', 'regex']);
export type MatchMode = z.infer<typeof MatchModeSchema>;

export const RoomPresenceEventSchema = z.enum(['leave', 'join', 'leashed']);
export type RoomPresenceEvent = z.infer<typeof RoomPresenceEventSchema>;

export const ReactionTypeSchema = z.enum(['speech', 'emote', 'action', 'activity', 'animation']);
export type ReactionType = z.infer<typeof ReactionTypeSchema>;

export const TriggerTypeSchema = z.enum(['speech', 'emote', 'action', 'activity', 'orgasm', 'roomPresence']);
export type TriggerType = z.infer<typeof TriggerTypeSchema>;

export const IncludeExcludeEntrySchema = z.object({
  value: z.coerce.string<string>(),
  mode: z.enum(['include', 'exclude'])
});
export type IncludeExcludeEntry = z.infer<typeof IncludeExcludeEntrySchema>;

export const MatchContentEntrySchema = z.object({
  value: z.coerce.string<string>(),
  matchMode: MatchModeSchema.default('contains')
});
export type MatchContentEntry = z.infer<typeof MatchContentEntrySchema>;

export const IncludeExcludeRuleSchema = z.object({
  entries: z.array(IncludeExcludeEntrySchema)
});
export type IncludeExcludeRule = z.infer<typeof IncludeExcludeRuleSchema>;

export const SourceConstraintSchema = z.object({
  memberNumber: IncludeExcludeRuleSchema.optional(),
  restrained: z.boolean().optional(),
  gagged: z.boolean().optional(),
  blinded: z.boolean().optional(),
  deafened: z.boolean().optional(),
  arousalMin: z.number().optional(),
  arousalMax: z.number().optional(),
});
export type SourceConstraint = z.infer<typeof SourceConstraintSchema>;

export const TargetConstraintSchema = z.object({
  memberNumber: IncludeExcludeRuleSchema.optional(),
  restrained: z.boolean().optional(),
  gagged: z.boolean().optional(),
  blinded: z.boolean().optional(),
  deafened: z.boolean().optional(),
  arousalMin: z.number().optional(),
  arousalMax: z.number().optional(),
});
export type TargetConstraint = z.infer<typeof TargetConstraintSchema>;

export const PlayerConstraintSchema = z.object({
  restrained: z.boolean().optional(),
  gagged: z.boolean().optional(),
  blinded: z.boolean().optional(),
  deafened: z.boolean().optional(),
  arousalMin: z.number().optional(),
  arousalMax: z.number().optional(),
});
export type PlayerConstraint = z.infer<typeof PlayerConstraintSchema>;

export const RoomConstraintSchema = z.object({
  inRoomWithMembers: IncludeExcludeRuleSchema.optional(),
  inRoomNamed: IncludeExcludeRuleSchema.optional(),
});
export type RoomConstraint = z.infer<typeof RoomConstraintSchema>;

export const TriggerConstraintSchema = z.object({
  source: SourceConstraintSchema.optional(),
  target: TargetConstraintSchema.optional(),
  player: PlayerConstraintSchema.optional(),
  room: RoomConstraintSchema.optional(),
});
export type TriggerConstraint = z.infer<typeof TriggerConstraintSchema>;

export const MessageDataSchema = z.object({
  source: z.looseObject({}).optional(),
  target: z.looseObject({}).optional(),
  messageContent: z.string().optional(),
  message: z.string().optional(),
  activityName: z.string().optional(),
  groupName: z.string().optional(),
  orgasmType: OrgasmTypeSchema.optional(),
  roomPrecenseEvent: RoomPresenceEventSchema.optional(),
  speechType: SpeechTypeSchema.optional()
});
export type MessageData = Prettify<Omit<z.infer<typeof MessageDataSchema>, 'source' | 'target' | 'activityName' | 'groupName'> & {
  source?: Character;
  target?: Character;
  activityName?: ActivityName;
  groupName?: AssetGroupItemName;
}>;

// #endregion Misc

// #region Reactions

const BaseReactionSchema = z.object({
  id: z.string().default(() => uuidv4()),
  name: z.string().default('New Reaction'),
  type: ReactionTypeSchema
});
export type BaseReaction = z.infer<typeof BaseReactionSchema>;

const ReactionSpeechSchema = BaseReactionSchema.extend({
  type: z.literal('speech'),
  content: z.array(z.string())
});
export type ReactionSpeech = z.infer<typeof ReactionSpeechSchema>;

const ReactionEmoteSchema = BaseReactionSchema.extend({
  type: z.literal('emote'),
  content: z.array(z.string())
});
export type ReactionEmote = z.infer<typeof ReactionEmoteSchema>;

const ReactionActionSchema = BaseReactionSchema.extend({
  type: z.literal('action'),
  content: z.array(z.string())
});
export type ReactionAction = z.infer<typeof ReactionActionSchema>;

const ReactionActivitySchema = BaseReactionSchema.extend({
  type: z.literal('activity'),
  activityName: z.string(),
  groupName: z.string()
});
export type ReactionActivity = Prettify<Omit<z.infer<typeof ReactionActivitySchema>, 'groupName'> & {
  groupName: AssetGroupItemName;
}>;

const ReactionAnimationSchema = BaseReactionSchema.extend({
  type: z.literal('animation'),
  animationId: z.string(),
  interrupt: z.boolean().optional(),
  priority: z.number().optional(),
});
export type ReactionAnimation = z.infer<typeof ReactionAnimationSchema>;

export const ReactionSchema = z.union([ReactionSpeechSchema, ReactionEmoteSchema, ReactionActionSchema, ReactionActivitySchema, ReactionAnimationSchema]);
export type Reaction = z.infer<typeof ReactionSchema>;

export const ReactionInputSchema = z.discriminatedUnion('type', [
  ReactionSpeechSchema.partial({ id: true, name: true }),
  ReactionEmoteSchema.partial({ id: true, name: true }),
  ReactionActionSchema.partial({ id: true, name: true }),
  ReactionActivitySchema.partial({ id: true, name: true }),
  ReactionAnimationSchema.partial({ id: true, name: true })
]);
export type ReactionInput = z.infer<typeof ReactionInputSchema>;

// #endregion Reactions

// #region Triggers

const BaseTriggerSchema = z.object({
  id: z.string().default(() => uuidv4()),
  name: z.string().default('New Trigger'),
  type: TriggerTypeSchema,
  constraintMode: ConstraintModeSchema.optional(),
  constraints: TriggerConstraintSchema.optional(),
});
export type BaseTrigger = z.infer<typeof BaseTriggerSchema>;

export const TriggerSpeechSchema = BaseTriggerSchema.extend({
  type: z.literal('speech'),
  speechType: SpeechTypeSchema,
  content: z.array(MatchContentEntrySchema)
});
export type TriggerSpeech = z.infer<typeof TriggerSpeechSchema>;

export const TriggerEmoteSchema = BaseTriggerSchema.extend({
  type: z.literal('emote'),
  content: z.array(MatchContentEntrySchema)
});
export type TriggerEmote = z.infer<typeof TriggerEmoteSchema>;

export const TriggerActionSchema = BaseTriggerSchema.extend({
  type: z.literal('action'),
  content: z.array(MatchContentEntrySchema)
});
export type TriggerAction = z.infer<typeof TriggerActionSchema>;

export const TriggerActivitySchema = BaseTriggerSchema.extend({
  type: z.literal('activity'),
  activityName: z.array(z.string()),
  groupName: z.array(z.string())
});
export type TriggerActivity = z.infer<typeof TriggerActivitySchema>;

export const TriggerOrgasmSchema = BaseTriggerSchema.extend({
  type: z.literal('orgasm'),
  orgasmType: OrgasmTypeSchema
});
export type TriggerOrgasm = z.infer<typeof TriggerOrgasmSchema>;

export const TriggerRoomPresenceSchema = BaseTriggerSchema.extend({
  type: z.literal('roomPresence'),
  event: RoomPresenceEventSchema
});
export type TriggerRoomPresence = z.infer<typeof TriggerRoomPresenceSchema>;

export const TriggerSchema = z.discriminatedUnion('type', [
  TriggerSpeechSchema,
  TriggerEmoteSchema,
  TriggerActionSchema,
  TriggerActivitySchema,
  TriggerOrgasmSchema,
  TriggerRoomPresenceSchema
]);
export type Trigger = z.infer<typeof TriggerSchema>;

export const TriggerInputSchema = z.discriminatedUnion('type', [
  TriggerSpeechSchema.partial({ id: true, name: true }),
  TriggerEmoteSchema.partial({ id: true, name: true }),
  TriggerActionSchema.partial({ id: true, name: true }),
  TriggerActivitySchema.partial({ id: true, name: true }),
  TriggerOrgasmSchema.partial({ id: true, name: true }),
  TriggerRoomPresenceSchema.partial({ id: true, name: true })
]);
export type TriggerInput = z.infer<typeof TriggerInputSchema>;

// #endregion Triggers


// #region Main

export const BehaviorSchema = z.object({
  id: z.string().default(() => uuidv4()),
  name: z.string().default('New Behavior'),
  enabled: z.boolean().default(true),
  triggers: z.array(z.string()).default([]),
  reactionMode: ReactionModeSchema.default('random'),
  reactions: z.array(z.string()).default([]),
  cooldownSec: z.number().optional(),
});
export type Behavior = z.infer<typeof BehaviorSchema>;

export const BehaviorInputSchema = BehaviorSchema.partial();
export type BehaviorInput = z.infer<typeof BehaviorInputSchema>;

export type BehaviorsSettingsModel = BaseSettingsModel & {
  behaviors: Record<string, Behavior>;
  triggers: Record<string, Trigger>;
  reactions: Record<string, Reaction>;
};

// #endregion Main