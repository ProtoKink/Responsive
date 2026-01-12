import { modLogger } from 'bc-deeplib/deeplib';
import { TriggerConstraint, MessageData, ConstraintMode, TriggerType, Behavior, TriggerTypeSchema, MessageDataSchema, TriggerConstraintSchema, ConstraintModeSchema, Trigger, TriggerSpeech, TriggerEmote, TriggerAction, MatchMode } from '../models/behaviors';
import { BehaviorsModule } from '../modules/behaviors';
import { assertNever } from './other';
import { replaceTemplate } from './chat_messages';

type TriggerConstraintHandlers = {
  [K in keyof TriggerConstraint]: (
    rule: NonNullable<TriggerConstraint[K]>,
    data: MessageData
  ) => boolean;
};

type TriggerPredicate = (trigger: Trigger, data: MessageData) => boolean;

type TriggerPredicatesMap = Map<TriggerType, TriggerPredicate[]>;

function matchText(text: string, pattern: string, matchMode: MatchMode): boolean {
  switch (matchMode) {
    case 'startsWith': return text.startsWith(pattern);
    case 'endsWith': return text.endsWith(pattern);
    case 'contains': return text.includes(pattern);
    case 'exact': return pattern === text;
    case 'regex': return new RegExp(pattern, 'i').test(text);
    default:
      assertNever(matchMode);
  }
}

function registerPredicate(types: TriggerType[], predicate: TriggerPredicate): void {
  types.forEach(type => {
    if (!triggerPredicates.has(type)) {
      triggerPredicates.set(type, []);
    }
    triggerPredicates.get(type)!.push(predicate);
  });
}

const messageContentPredicate: TriggerPredicate = (trigger, data) => {
  if (trigger.type !== 'emote' && trigger.type !== 'speech' && trigger.type !== 'action') {
    return false;
  }

  const typedTrigger = trigger;

  if (!data.message) return false;

  return typedTrigger.content.some(entry => {
    const templatedMessage = replaceTemplate(entry.value, data.target, data.source);
    if (!data.message) return false;
    return matchText(data.message, templatedMessage, entry.matchMode);
  });
};

const speechTypePredicate: TriggerPredicate = (trigger, data) => {
  if (trigger.type !== 'speech') return true;

  const typedTrigger = trigger as TriggerSpeech;

  if (typedTrigger.speechType === 'any') return true;

  return typedTrigger.speechType === data.speechType;
};

const activityPredicate: TriggerPredicate = (trigger, data) => {
  if (trigger.type !== 'activity') return false;

  if (!data.activityName || !data.groupName) return false;

  return trigger.activityName.includes(data.activityName) &&
    trigger.groupName.includes(data.groupName);
};

const orgasmPredicate: TriggerPredicate = (trigger, data) => {
  if (trigger.type !== 'orgasm') return false;

  if (trigger.orgasmType === 'any') return true;

  return trigger.orgasmType === data.orgasmType;
};

const roomPresencePredicate: TriggerPredicate = (trigger, data) => {
  if (trigger.type !== 'roomPresence') return false;

  return trigger.event === data.roomPrecenseEvent;
};

const triggerPredicates: TriggerPredicatesMap = new Map();

registerPredicate(['emote', 'speech', 'action'], messageContentPredicate);

registerPredicate(['speech'], speechTypePredicate);

registerPredicate(['activity'], activityPredicate);
registerPredicate(['orgasm'], orgasmPredicate);
registerPredicate(['roomPresence'], roomPresencePredicate);

function checkTriggerPredicates(trigger: Trigger, data: MessageData): boolean {
  const predicates = triggerPredicates.get(trigger.type);

  if (!predicates || predicates.length === 0) {
    modLogger.warn(`No predicates registered for trigger type: ${trigger.type}`);
    return false;
  }

  return predicates.every(predicate => predicate(trigger, data));
}

const triggerConstraints: TriggerConstraintHandlers = {
  arousalMax: (value) => Player.ArousalSettings.Progress >= value,
  arousalMin: (value) => Player.ArousalSettings.Progress <= value,
  inRoomNamed: (rule) => {
    const roomName = ChatRoomData?.Name ?? '';
    return rule.entries.some(entry => {
      const matches = entry.value === roomName;
      return entry.mode === 'include' ? matches : !matches;
    });
  },
  inRoomWithMembers: (rule) => {
    const members = ChatRoomData?.Character?.map(c => c.MemberNumber) ?? [];
    return rule.entries.some(entry => {
      const memberId = parseInt(entry.value, 10);
      const matches = members.includes(memberId);
      return entry.mode === 'include' ? matches : !matches;
    });
  },
  source: (rule, data) => {
    const sourceId = (data.source?.MemberNumber ?? -1).toString();
    return rule.entries.some(entry => {
      const matches = entry.value === sourceId;
      return entry.mode === 'include' ? matches : !matches;
    });
  },
  target: (rule, data) => {
    const targetId = (data.target?.MemberNumber ?? -1).toString();
    return rule.entries.some(entry => {
      const matches = entry.value === targetId;
      return entry.mode === 'include' ? matches : !matches;
    });
  }
};

export function processTrigger(type: TriggerType, messageData: MessageData): Behavior | undefined {
  try {
    type = TriggerTypeSchema.parse(type);
    messageData = MessageDataSchema.parse(messageData) as MessageData;
  } catch (e) {
    modLogger.error(e);
    return undefined;
  }

  const enabledBehaviors = Object.values(BehaviorsModule.instance.settings.behaviors)
    .filter(b => b.enabled);

  if (enabledBehaviors.length === 0) return undefined;

  return enabledBehaviors
    .filter(behavior => {
      const last = BehaviorsModule.instance.behaviorExecutionMap.get(behavior.id);

      if (!last) return true;

      return CommonTime() - last >= (behavior.cooldownSec ?? 0) * 1000;
    })
    .find(behavior => {
      const triggers = behavior.triggers.map(t => BehaviorsModule.instance.getTrigger(t));
      const triggersOfType = triggers.filter(t => t?.type === type).filter(t => t !== undefined);

      const metTrigger = triggersOfType.find(trigger => {
        let isConstraintMet = true;

        if (trigger.constraints && trigger.constraintMode) {
          isConstraintMet = processTriggerConstraint(trigger.constraints, trigger.constraintMode, messageData);
        };

        if (!isConstraintMet) return false;

        return checkTriggerPredicates(trigger, messageData);
      });

      return metTrigger;
    });
}

export function processTriggerConstraint(triggerConstraint: TriggerConstraint, mode: ConstraintMode, messageData: MessageData): boolean {
  try {
    triggerConstraint = TriggerConstraintSchema.parse(triggerConstraint ?? {});
    mode = ConstraintModeSchema.parse(mode);
    messageData = MessageDataSchema.parse(messageData) as MessageData;
  } catch (e) {
    modLogger.error(e);
    return false;
  }

  const triggerConstraintEntries = CommonKeys(triggerConstraint);

  if (triggerConstraintEntries.length === 0) return true;

  const predicate = <K extends keyof TriggerConstraint>(key: K) => {
    const value = triggerConstraint[key];
    if (value === null || value === undefined) return true;

    return triggerConstraints[key]?.(value, messageData) ?? true;
  };

  if (mode === 'any') {
    return triggerConstraintEntries.some(key => predicate(key));
  } else if (mode === 'all') {
    return triggerConstraintEntries.every(key => predicate(key));
  }

  return true;
}

export function triggerHasAnyConstraints(trigger: Trigger): boolean {
  if (!trigger.constraints) return false;

  for (const key in trigger.constraints) {
    const typedKey = key as keyof TriggerConstraint;
    let hasConstraint = false;
    switch (typedKey) {
      case 'source':
      case 'target':
      case 'arousalMin':
      case 'arousalMax':
      case 'inRoomWithMembers':
      case 'inRoomNamed':
      case 'restrained':
      case 'gagged':
      case 'blinded':
      case 'deafened':
        hasConstraint = triggerHasConstraint(trigger, typedKey);
        break;
      default:
        assertNever(typedKey);
    }
    if (hasConstraint) return true;
  }
  return false;
}

export function triggerHasConstraint<K extends keyof TriggerConstraint>(trigger: Trigger, key: K): boolean {
  if (!trigger.constraints) return false;
  const value = trigger.constraints[key] as TriggerConstraint[K];
  if (value === null || value === undefined) return false;

  switch (typeof value) {
    case 'number':
      return true;
    case 'object':
      if ('entries' in value) {
        return !!value.entries;
      }
      return false;
    case 'boolean':
      return true;
    default:
      return assertNever(value);
  }
}