import { BaseSettingsModel } from 'bc-deeplib/deeplib';

// #region Misc

export type OrgasmType = 'any' | 'normal' | 'resisted' | 'ruinedResisted' | 'ruinedTimeout' | 'ruinedSurrendered';
export type TriggerOrgasmType = Prettify<Exclude<OrgasmType, 'any'>>;
export type ConstraintMode = 'any' | 'all';
export type SpeechType = 'any' | 'normal' | 'whisper';
export type ReactionMode = 'all' | 'random';
export type MatchMode = 'startsWith' | 'contains' | 'endsWith' | 'exact' | 'regex';
export type RoomPresenceEvent = 'leave' | 'join' | 'leashed';

export type ReactionType = 'speech' | 'emote' | 'action' | 'activity';

export type TriggerType = 'speech' | 'emote' | 'action' | 'activity' | 'orgasm' | 'roomPresence';

export type IncludeExcludeRule<T> = {
  content: T[];
  mode: 'include' | 'exclude';
};

export interface TriggerConstraint {
  source?: Prettify<IncludeExcludeRule<number>>;
  target?: Prettify<IncludeExcludeRule<number>>;
  arousalMin?: number;
  arousalMax?: number;
  inRoomWithMembers?: Prettify<IncludeExcludeRule<number>>;
  inRoomNamed?: Prettify<IncludeExcludeRule<string>>;
}

export interface MessageData {
  source?: Character;
  target?: Character;
  messageContent?: string;
  message?: string;
  activityName?: ActivityName;
  groupName?: AssetGroupItemName;
  orgasmType?: TriggerOrgasmType;
  roomPrecenseEvent?: RoomPresenceEvent;
}

// #endregion Misc

// #region Reactions

export interface BaseReaction {
  id: string;
  name: string;
  type: ReactionType;
}

export interface ReactionSpeech extends BaseReaction {
  type: 'speech';
  content: string[];
}

export interface ReactionEmote extends BaseReaction {
  type: 'emote';
  content: string[];
}

export interface ReactionAction extends BaseReaction {
  type: 'action';
  content: string[];
}

export interface ReactionActivity extends BaseReaction {
  type: 'activity';
  activityName: ActivityName;
  groupName: AssetGroupItemName;
}

export type Reaction = ReactionSpeech | ReactionEmote | ReactionAction | ReactionActivity;

// #endregion Reactions

// #region Triggers

export interface BaseTrigger {
  id: string;
  name: string;
  type: TriggerType;
  constraintMode: ConstraintMode;
  constraints: TriggerConstraint;
  /** Cooldown in seconds before behavior can fire again */
  cooldownSec?: number;
}

export interface TriggerSpeech extends BaseTrigger {
  type: 'speech';
  speechType: SpeechType;
  content: string[];
  matchMode: MatchMode;
}

export interface TriggerEmote extends BaseTrigger {
  type: 'emote';
  content: string[];
  matchMode: MatchMode;
}

export interface TriggerAction extends BaseTrigger {
  type: 'action';
  content: string[];
  matchMode: MatchMode;
}

export interface TriggerActivity extends BaseTrigger {
  type: 'activity';
  activityName: ActivityName[];
  groupName: AssetGroupItemName[];
}

export interface TriggerOrgasm extends BaseTrigger {
  type: 'orgasm';
  orgasmType: OrgasmType;
}

export interface TriggerRoomPresence extends BaseTrigger {
  type: 'roomPresence';
  event: RoomPresenceEvent;
}

export type Trigger = TriggerSpeech | TriggerEmote | TriggerAction | TriggerActivity | TriggerOrgasm | TriggerRoomPresence;


// #endregion Triggers


// #region Main

export interface Behavior {
  id: string;
  name: string;
  enabled: boolean;
  /** Array of triggers' IDs */
  triggers: string[];
  reactionMode: ReactionMode;
  /** Array of reactions' IDs */
  reactions: string[];
  /** Cooldown in seconds before behavior can fire again */
  cooldownSec?: number;
}

export type BehaviorsSettingsModel = BaseSettingsModel & {
  behaviors: Record<string, Behavior>;
  triggers: Record<string, Trigger>;
  reactions: Record<string, Reaction>;
};

// #endregion Main