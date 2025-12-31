import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processTrigger, processTriggerConstraint } from '@/utilities/triggers';
import type { Behavior, Trigger, MessageData, TriggerConstraint } from '@/models/behaviors';
import { BehaviorsModule } from '@/modules/behaviors';
import * as gg from '../mocks/game-globals';
import { setMockTime, advanceMockTime } from '../mocks/game-globals';

vi.mock('@/modules/behaviors', () => {
  return {
    BehaviorsModule: {
      instance: {
        settings: {
          behaviors: {},
          triggers: {},
          reactions: {},
        },
        getTrigger: vi.fn(),
        getReaction: vi.fn(),
      },
    },
  };
});

vi.mock('bc-deeplib/deeplib', () => ({
  modLogger: {
    error: vi.fn(),
  },
}));

describe('processTrigger', () => {
  let mockBehaviors: Record<string, Behavior>;
  let mockTriggers: Record<string, Trigger>;

  beforeEach(() => {
    mockBehaviors = {};
    mockTriggers = {};
    (BehaviorsModule.instance.getTrigger as any).mockImplementation((id: string) => mockTriggers[id]);
    BehaviorsModule.instance.settings.behaviors = mockBehaviors;
    BehaviorsModule.instance.settings.triggers = mockTriggers;
    setMockTime(1000000);
  });

  describe('speech triggers', () => {
    it('should match speech with contains mode', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'speech',
        speechType: 'any',
        content: ['hello'],
        matchMode: 'contains',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        message: 'hello world',
        messageContent: 'hello world',
      };

      const result = processTrigger('speech', messageData);
      expect(result).toEqual(behavior);
    });

    it('should match speech with startsWith mode', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'speech',
        speechType: 'any',
        content: ['hello'],
        matchMode: 'startsWith',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        message: 'hello world',
        messageContent: 'hello world',
      };

      const result = processTrigger('speech', messageData);
      expect(result).toEqual(behavior);
    });

    it('should match speech with endsWith mode', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'speech',
        speechType: 'any',
        content: ['world'],
        matchMode: 'endsWith',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        message: 'hello world',
        messageContent: 'hello world',
      };

      const result = processTrigger('speech', messageData);
      expect(result).toEqual(behavior);
    });

    it('should match speech with exact mode', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'speech',
        speechType: 'any',
        content: ['hello world'],
        matchMode: 'exact',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        message: 'hello world',
        messageContent: 'hello world',
      };

      const result = processTrigger('speech', messageData);
      expect(result).toEqual(behavior);
    });

    it('should match speech with regex mode', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'speech',
        speechType: 'any',
        content: ['he.*o'],
        matchMode: 'regex',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        message: 'hello world',
        messageContent: 'hello world',
      };

      const result = processTrigger('speech', messageData);
      expect(result).toEqual(behavior);
    });

    it('should not match when content does not match', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'speech',
        speechType: 'any',
        content: ['goodbye'],
        matchMode: 'contains',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        message: 'hello world',
        messageContent: 'hello world',
      };

      const result = processTrigger('speech', messageData);
      expect(result).toBeUndefined();
    });
  });

  describe('emote triggers', () => {
    it('should match emote with contains mode', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'emote',
        content: ['smiles'],
        matchMode: 'contains',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        message: 'smiles at you',
        messageContent: 'smiles at you',
      };

      const result = processTrigger('emote', messageData);
      expect(result).toEqual(behavior);
    });
  });

  describe('action triggers', () => {
    it('should match action with contains mode', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'action',
        content: ['hugs'],
        matchMode: 'contains',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        message: 'hugs you tightly',
        messageContent: 'hugs you tightly',
      };

      const result = processTrigger('action', messageData);
      expect(result).toEqual(behavior);
    });
  });

  describe('activity triggers', () => {
    it('should match activity when activityName and groupName match', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'activity',
        activityName: ['Kiss'],
        groupName: ['ItemMouth'],
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        activityName: 'Kiss',
        groupName: 'ItemMouth',
      };

      const result = processTrigger('activity', messageData);
      expect(result).toEqual(behavior);
    });

    it('should not match activity when activityName does not match', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'activity',
        activityName: ['Activity1'],
        groupName: ['Group1'],
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        activityName: 'Kiss',
        groupName: 'ItemMouth',
      };

      const result = processTrigger('activity', messageData);
      expect(result).toBeUndefined();
    });
  });

  describe('orgasm triggers', () => {
    it('should match orgasm when type is any', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'orgasm',
        orgasmType: 'any',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        orgasmType: 'normal',
      };

      const result = processTrigger('orgasm', messageData);
      expect(result).toEqual(behavior);
    });

    it('should match orgasm when type matches', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'orgasm',
        orgasmType: 'normal',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        orgasmType: 'normal',
      };

      const result = processTrigger('orgasm', messageData);
      expect(result).toEqual(behavior);
    });

    it('should not match orgasm when type does not match', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'orgasm',
        orgasmType: 'normal',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        orgasmType: 'resisted',
      };

      const result = processTrigger('orgasm', messageData);
      expect(result).toBeUndefined();
    });
  });

  describe('roomPresence triggers', () => {
    it('should match roomPresence when event matches', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'roomPresence',
        event: 'join',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        roomPrecenseEvent: 'join',
      };

      const result = processTrigger('roomPresence', messageData);
      expect(result).toEqual(behavior);
    });

    it('should not match roomPresence when event does not match', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'roomPresence',
        event: 'join',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        roomPrecenseEvent: 'leave',
      };

      const result = processTrigger('roomPresence', messageData);
      expect(result).toBeUndefined();
    });
  });

  describe('cooldown functionality', () => {
    it('should respect cooldown period', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'speech',
        speechType: 'any',
        content: ['hello'],
        matchMode: 'contains',
        cooldownSec: 5,
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: true,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        message: 'hello world',
        messageContent: 'hello world',
      };

      const result1 = processTrigger('speech', messageData);
      expect(result1).toEqual(behavior);

      advanceMockTime(3000);

      const result2 = processTrigger('speech', messageData);
      expect(result2).toBeUndefined();

      advanceMockTime(3000);

      const result3 = processTrigger('speech', messageData);
      expect(result3).toEqual(behavior);
    });
  });

  describe('disabled behaviors', () => {
    it('should not match when behavior is disabled', () => {
      const trigger: Trigger = {
        id: 'trigger1',
        name: 'Test Trigger',
        type: 'speech',
        speechType: 'any',
        content: ['hello'],
        matchMode: 'contains',
      };

      const behavior: Behavior = {
        id: 'behavior1',
        name: 'Test Behavior',
        enabled: false,
        triggers: ['trigger1'],
        reactions: [],
        reactionMode: 'random',
      };

      mockTriggers['trigger1'] = trigger;
      mockBehaviors['behavior1'] = behavior;

      const messageData: MessageData = {
        message: 'hello world',
        messageContent: 'hello world',
      };

      const result = processTrigger('speech', messageData);
      expect(result).toBeUndefined();
    });
  });
});

describe('processTriggerConstraint', () => {
  beforeEach(() => {
    gg.Player.ArousalSettings.Progress = 50;
    gg.ChatRoomData.Name = 'Test Room';
    gg.ChatRoomData.Character = [
      { MemberNumber: 1 },
      { MemberNumber: 2 },
    ];
  });

  describe('constraint mode: all', () => {
    it('should pass when all constraints are met', () => {
      // Note: The constraint logic checks:
      // arousalMax: progress >= value (progress is at/above the max threshold)
      // arousalMin: progress <= value (progress is at/below the min threshold)
      // For progress = 50, we need: arousalMin >= 50 and arousalMax <= 50
      const constraint: TriggerConstraint = {
        arousalMin: 50, // Progress (50) <= 50 = true
        arousalMax: 50, // Progress (50) >= 50 = true
      };

      gg.Player.ArousalSettings.Progress = 50;

      const messageData: MessageData = {};

      const result = processTriggerConstraint(constraint, 'all', messageData);
      expect(result).toBe(true);
    });

    it('should fail when any constraint is not met', () => {
      const constraint: TriggerConstraint = {
        arousalMin: 40, // Progress (50) <= 40 = false
        arousalMax: 60, // Progress (50) >= 60 = false
      };

      gg.Player.ArousalSettings.Progress = 50;

      const messageData: MessageData = {};

      const result = processTriggerConstraint(constraint, 'all', messageData);
      expect(result).toBe(false);
    });
  });

  describe('constraint mode: any', () => {
    it('should pass when any constraint is met', () => {
      const constraint: TriggerConstraint = {
        arousalMin: 60, // Progress (50) <= 60 = true
        arousalMax: 40, // Progress (50) >= 40 = true
      };

      gg.Player.ArousalSettings.Progress = 50;

      const messageData: MessageData = {};

      const result = processTriggerConstraint(constraint, 'any', messageData);
      expect(result).toBe(true);
    });

    it('should fail when no constraints are met', () => {
      const constraint: TriggerConstraint = {
        arousalMin: 30, // Progress (50) <= 30 = false
        arousalMax: 70, // Progress (50) >= 70 = false
      };

      gg.Player.ArousalSettings.Progress = 50;

      const messageData: MessageData = {};

      const result = processTriggerConstraint(constraint, 'any', messageData);
      expect(result).toBe(false);
    });
  });

  describe('source constraint', () => {
    it('should pass when source matches include rule', () => {
      const constraint: TriggerConstraint = {
        source: {
          entries: [
            { value: '1', mode: 'include' },
          ],
        },
      };

      const messageData: MessageData = {
        source: { MemberNumber: 1 } as any,
      };

      const result = processTriggerConstraint(constraint, 'all', messageData);
      expect(result).toBe(true);
    });

    it('should fail when source matches exclude rule', () => {
      const constraint: TriggerConstraint = {
        source: {
          entries: [
            { value: '1', mode: 'exclude' },
          ],
        },
      };

      const messageData: MessageData = {
        source: { MemberNumber: 1 } as any,
      };

      const result = processTriggerConstraint(constraint, 'all', messageData);
      expect(result).toBe(false);
    });
  });

  describe('target constraint', () => {
    it('should pass when target matches include rule', () => {
      const constraint: TriggerConstraint = {
        target: {
          entries: [
            { value: '2', mode: 'include' },
          ],
        },
      };

      const messageData: MessageData = {
        target: { MemberNumber: 2 } as any,
      };

      const result = processTriggerConstraint(constraint, 'all', messageData);
      expect(result).toBe(true);
    });
  });

  describe('inRoomNamed constraint', () => {
    it('should pass when room name matches include rule', () => {
      const constraint: TriggerConstraint = {
        inRoomNamed: {
          entries: [
            { value: 'Test Room', mode: 'include' },
          ],
        },
      };

      const messageData: MessageData = {};

      const result = processTriggerConstraint(constraint, 'all', messageData);
      expect(result).toBe(true);
    });

    it('should fail when room name matches exclude rule', () => {
      const constraint: TriggerConstraint = {
        inRoomNamed: {
          entries: [
            { value: 'Test Room', mode: 'exclude' },
          ],
        },
      };

      const messageData: MessageData = {};

      const result = processTriggerConstraint(constraint, 'all', messageData);
      expect(result).toBe(false);
    });
  });

  describe('inRoomWithMembers constraint', () => {
    it('should pass when member is in room (include rule)', () => {
      const constraint: TriggerConstraint = {
        inRoomWithMembers: {
          entries: [
            { value: '1', mode: 'include' },
          ],
        },
      };

      const messageData: MessageData = {};

      const result = processTriggerConstraint(constraint, 'all', messageData);
      expect(result).toBe(true);
    });

    it('should fail when member is not in room (include rule)', () => {
      const constraint: TriggerConstraint = {
        inRoomWithMembers: {
          entries: [
            { value: '999', mode: 'include' },
          ],
        },
      };

      const messageData: MessageData = {};

      const result = processTriggerConstraint(constraint, 'all', messageData);
      expect(result).toBe(false);
    });
  });

  describe('empty constraints', () => {
    it('should pass when no constraints are defined', () => {
      const constraint: TriggerConstraint = {};

      const messageData: MessageData = {};

      const result = processTriggerConstraint(constraint, 'all', messageData);
      expect(result).toBe(true);
    });
  });
});

