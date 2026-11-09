import { BaseSettingsModel } from 'bc-deeplib/deeplib';
import { v4 as uuidv4 } from 'uuid';

// #region Misc

export const orgasmTypes = ['any', 'normal', 'resisted', 'ruinedResisted', 'ruinedTimeout', 'ruinedSurrendered'] as const;
export type OrgasmType = (typeof orgasmTypes)[number];
export type TriggerOrgasmType = Exclude<OrgasmType, 'any'>;

export const constraintModes = ['any', 'all'] as const;
export type ConstraintMode = (typeof constraintModes)[number];

export const speechTypes = ['any', 'normal', 'whisper'] as const;
export type SpeechType = (typeof speechTypes)[number];

export const reactionModes = ['all', 'random'] as const;
export type ReactionMode = (typeof reactionModes)[number];

export const matchModes = ['startsWith', 'contains', 'endsWith', 'exact', 'regex'] as const;
export type MatchMode = (typeof matchModes)[number];

export const roomPresenceEvents = ['leave', 'join', 'leashed'] as const;
export type RoomPresenceEvent = (typeof roomPresenceEvents)[number];

export const reactionTypes = ['speech', 'emote', 'action', 'activity', 'animation'] as const;
export type ReactionType = (typeof reactionTypes)[number];

export const triggerTypes = ['speech', 'emote', 'action', 'activity', 'orgasm', 'roomPresence'] as const;
export type TriggerType = (typeof triggerTypes)[number];

export const includeExcludeModes = ['include', 'exclude'] as const;

export type IncludeExcludeEntry = {
  value: string;
  mode: (typeof includeExcludeModes)[number];
};

export type MatchContentEntry = {
  value: string;
  matchMode: MatchMode;
};

export type IncludeExcludeRule = {
  entries: IncludeExcludeEntry[];
};

export type SourceConstraint = {
  memberNumber?: IncludeExcludeRule;
  restrained?: boolean;
  gagged?: boolean;
  blinded?: boolean;
  deafened?: boolean;
  arousalMin?: number;
  arousalMax?: number;
};

export type TargetConstraint = {
  memberNumber?: IncludeExcludeRule;
  restrained?: boolean;
  gagged?: boolean;
  blinded?: boolean;
  deafened?: boolean;
  arousalMin?: number;
  arousalMax?: number;
};

export type PlayerConstraint = {
  restrained?: boolean;
  gagged?: boolean;
  blinded?: boolean;
  deafened?: boolean;
  arousalMin?: number;
  arousalMax?: number;
};

export type RoomConstraint = {
  inRoomWithMembers?: IncludeExcludeRule;
  inRoomNamed?: IncludeExcludeRule;
};

export type TriggerConstraint = {
  source?: SourceConstraint;
  target?: TargetConstraint;
  player?: PlayerConstraint;
  room?: RoomConstraint;
};

export type MessageData = {
  source?: Character;
  target?: Character;
  messageContent?: string;
  message?: string;
  activityName?: ActivityName;
  groupName?: AssetGroupItemName;
  orgasmType?: OrgasmType;
  roomPrecenseEvent?: RoomPresenceEvent;
  speechType?: SpeechType;
};

// #endregion Misc

// #region Reactions

export type BaseReaction = {
  id: string;
  name: string;
  type: ReactionType;
};

export type ReactionSpeech = BaseReaction & {
  type: 'speech';
  content: string[];
};

export type ReactionEmote = BaseReaction & {
  type: 'emote';
  content: string[];
};

export type ReactionAction = BaseReaction & {
  type: 'action';
  content: string[];
};

export type ReactionActivity = BaseReaction & {
  type: 'activity';
  activityName: string;
  groupName: string;
};

export type ReactionAnimation = BaseReaction & {
  type: 'animation';
  animationId: string;
  interrupt?: boolean;
  priority?: number;
};

export type Reaction = ReactionSpeech | ReactionEmote | ReactionAction | ReactionActivity | ReactionAnimation;

export type ReactionInput = WithOptional<Reaction, 'id' | 'name'>;

export function applyReactionDefaults(input: ReactionInput): Reaction {
  return {
    ...input,
    id: input.id ?? uuidv4(),
    name: input.name ?? 'New Reaction',
  } as Reaction;
}

// #endregion Reactions

// #region Triggers

export type BaseTrigger = {
  id: string;
  name: string;
  type: TriggerType;
  constraintMode?: ConstraintMode;
  constraints?: TriggerConstraint;
};

export type TriggerSpeech = BaseTrigger & {
  type: 'speech';
  speechType: SpeechType;
  content: MatchContentEntry[];
};

export type TriggerEmote = BaseTrigger & {
  type: 'emote';
  content: MatchContentEntry[];
};

export type TriggerAction = BaseTrigger & {
  type: 'action';
  content: MatchContentEntry[];
};

export type TriggerActivity = BaseTrigger & {
  type: 'activity';
  activityName: string[];
  groupName: string[];
};

export type TriggerOrgasm = BaseTrigger & {
  type: 'orgasm';
  orgasmType: OrgasmType;
};

export type TriggerRoomPresence = BaseTrigger & {
  type: 'roomPresence';
  event: RoomPresenceEvent;
};

export type Trigger = TriggerSpeech | TriggerEmote | TriggerAction | TriggerActivity | TriggerOrgasm | TriggerRoomPresence;

export type TriggerInput = WithOptional<Trigger, 'id' | 'name'>;

export function applyTriggerDefaults(input: TriggerInput): Trigger {
  const id = input.id ?? uuidv4();
  const name = input.name ?? 'New Trigger';

  switch (input.type) {
    case 'speech':
    case 'emote':
    case 'action':
      return {
        ...input,
        id,
        name,
        content: input.content.map(entry => ({
          ...entry,
          matchMode: entry.matchMode ?? 'contains',
        })),
      };
    case 'activity':
    case 'orgasm':
    case 'roomPresence':
      return { ...input, id, name };
  }
}

// #endregion Triggers


// #region Main

export type Behavior = {
  id: string;
  name: string;
  enabled: boolean;
  triggers: string[];
  reactionMode: ReactionMode;
  reactions: string[];
  cooldownSec?: number;
};

export type BehaviorInput = Partial<Behavior>;

export function applyBehaviorDefaults(input: BehaviorInput): Behavior {
  return {
    id: input.id ?? uuidv4(),
    name: input.name ?? 'New Behavior',
    enabled: input.enabled ?? true,
    triggers: input.triggers ?? [],
    reactionMode: input.reactionMode ?? 'random',
    reactions: input.reactions ?? [],
    cooldownSec: input.cooldownSec,
  };
}

export type BehaviorsSettingsModel = BaseSettingsModel & {
  behaviors: Record<string, Behavior>;
  triggers: Record<string, Trigger>;
  reactions: Record<string, Reaction>;
};

// #endregion Main
