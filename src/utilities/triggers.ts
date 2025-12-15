import { TriggerConstraint, MessageData, ConstraintMode, TriggerType, Behavior } from '../models/behaviors';
import { BehaviorsModule } from '../modules/behaviors';
import { assertNever } from './other';

type TriggerConstraintHandlers = {
  [K in keyof TriggerConstraint]: (
    rule: NonNullable<TriggerConstraint[K]>,
    data: MessageData
  ) => boolean;
};

const triggerExecutionMap: Map<string, number> = new Map();

const triggerConstraints: TriggerConstraintHandlers = {
  arousalMax: (value) => Player.ArousalSettings.Progress >= value,
  arousalMin: (value) => Player.ArousalSettings.Progress <= value,
  inRoomNamed: (rule) => rule.mode === 'include' ? rule.content.includes(ChatRoomData?.Name ?? '') : !rule.content.includes(ChatRoomData?.Name ?? ''),
  inRoomWithMembers: (rule) => {
    const members = ChatRoomData?.Character?.map(c => c.MemberNumber) ?? [];

    return rule.mode === 'include'
      ? rule.content.some(id => members.includes(id))
      : rule.content.every(id => !members.includes(id));
  },
  source: (rule, data) => rule.mode === 'include' ? rule.content.includes(data.source?.MemberNumber ?? -1) : !rule.content.includes(data.source?.MemberNumber ?? -1),
  target: (rule, data) => rule.mode === 'include' ? rule.content.includes(data.target?.MemberNumber ?? -1) : !rule.content.includes(data.target?.MemberNumber ?? -1)
};

export function processTrigger(type: TriggerType, messageData: MessageData): Behavior | undefined {
  return Object.values(BehaviorsModule.instance.settings.behaviors)
    .filter(b => b.enabled)
    .find(b => {
      const triggers = b.triggers.map(t => BehaviorsModule.instance.getTrigger(t))
        .filter(t => t?.type === type)
        .filter(t => {
          const last = triggerExecutionMap.get(`${b.id}-${t?.id}`);
          
          if (!last) return true;

          return CommonTime() - last >= (t?.cooldownSec ?? 0) * 1000;
        })
        .filter(t => t !== undefined);

      return triggers.find(t => {
        let isConstraintMet = false;

        isConstraintMet = processTriggerConstraint(t.constraints, t.constraintMode, messageData);

        if (!isConstraintMet) return false;

        const isTriggerMet = (() => {
          switch (t.type) {
            case 'emote':
            case 'speech':
            case 'action':
              return t.content.some(c => {
                if (!messageData.message) return false;
                switch (t.matchMode) {
                  case 'startsWith': return messageData.message.startsWith(c);
                  case 'endsWith': return messageData.message.endsWith(c);
                  case 'contains': return messageData.message.includes(c);
                  case 'exact': return c === messageData.message;
                  case 'regex': return new RegExp(c, 'i').test(messageData.message);
                  default:
                    assertNever(t.matchMode);
                }
              });
            case 'activity':
              if (messageData.activityName && messageData.groupName) {
                return t.activityName.includes(messageData.activityName) && t.groupName.includes(messageData.groupName);
              }
              break;
            case 'orgasm':
              if (t.orgasmType === 'any') return true;
              return t.orgasmType === messageData.orgasmType;

            case 'roomPresence':
              if (t.event === messageData.roomPrecenseEvent) return true;
              break;

            default:
              assertNever(t);
          }
        })();

        if (isTriggerMet && t.cooldownSec) {
          triggerExecutionMap.set(`${b.id}-${t?.id}`, CommonTime());
        }

        return isTriggerMet;
      });
    });
}

export function processTriggerConstraint(triggerConstraint: TriggerConstraint, mode: ConstraintMode, messageData: MessageData): boolean {
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