import { describe, it, expect, vi } from 'vitest';
import { BehaviorsModule } from '@/modules/behaviors';
import type { BehaviorInput, TriggerInput, ReactionInput, TriggerRoomPresence, TriggerActivity, TriggerOrgasm, TriggerAction, TriggerEmote, TriggerSpeech, ReactionEmote, ReactionSpeech, ReactionAction, ReactionActivity } from '@/models/behaviors';

vi.mock('bc-deeplib/deeplib', async () => {
  const actual = await vi.importActual('bc-deeplib/deeplib');
  return {
    ...actual,
    modLogger: {
      error: vi.fn(),
    },
    ModStorage: vi.fn().mockImplementation(() => ({
      playerStorage: {
        GlobalModule: {
          modEnabled: true,
          responsesEnabled: true,
          doPreventMessageIfBcxBlock: false,
          doMessageInterruption: false,
        },
        BehaviorsModule: {},
        ProfilesModule: [],
      },
      save: vi.fn(),
    })),
  };
});

vi.mock('@/utilities/data', () => ({
  modStorage: {
    playerStorage: {
      GlobalModule: {
        modEnabled: true,
        responsesEnabled: true,
        doPreventMessageIfBcxBlock: false,
        doMessageInterruption: false,
      },
      BehaviorsModule: {},
      ProfilesModule: [],
    },
    save: vi.fn(),
  },
}));

describe('Behavior Creation', () => {
  describe('createBehavior - positive cases', () => {
    it('should create a behavior with minimal input', () => {
      const input: BehaviorInput = {
        name: 'Test Behavior',
      };

      const result = BehaviorsModule.createBehavior(input);

      expect(result).toBeDefined();
      expect(result?.name).toBe('Test Behavior');
      expect(result?.enabled).toBe(true);
      expect(result?.triggers).toEqual([]);
      expect(result?.reactions).toEqual([]);
      expect(result?.reactionMode).toBe('random');
      expect(result?.id).toBeDefined();
    });

    it('should create a behavior with all fields', () => {
      const input: BehaviorInput = {
        name: 'Test Behavior',
        enabled: false,
        triggers: ['trigger1', 'trigger2'],
        reactions: ['reaction1'],
        reactionMode: 'all',
        cooldownSec: 10,
      };

      const result = BehaviorsModule.createBehavior(input);

      expect(result).toBeDefined();
      expect(result?.name).toBe('Test Behavior');
      expect(result?.enabled).toBe(false);
      expect(result?.triggers).toEqual(['trigger1', 'trigger2']);
      expect(result?.reactions).toEqual(['reaction1']);
      expect(result?.reactionMode).toBe('all');
      expect(result?.cooldownSec).toBe(10);
      expect(result?.id).toBeDefined();
    });
  });

  describe('createBehavior - edge cases', () => {
    it('should generate a default name when not provided', () => {
      const input: BehaviorInput = {};

      const result = BehaviorsModule.createBehavior(input);

      expect(result).toBeDefined();
      expect(result?.name).toBe('New Behavior');
    });
  });

  describe('createBehavior - negative cases', () => {
    it('should return undefined for invalid input', () => {
      const input: any = {
        enabled: 'not a boolean',
      };

      const result = BehaviorsModule.createBehavior(input);

      expect(result).toBeUndefined();
    });
  });
});

describe('Trigger Creation', () => {
  describe('createTrigger - positive cases', () => {
    it('should create a speech trigger', () => {
      const input: TriggerInput = {
        type: 'speech',
        name: 'Test Speech Trigger',
        speechType: 'any',
        content: [
          { value: 'hello', matchMode: 'contains' },
          { value: 'hi', matchMode: 'contains' }
        ],
      };

      const result = BehaviorsModule.createTrigger(input) as TriggerSpeech;

      expect(result).toBeDefined();
      expect(result?.type).toBe('speech');
      expect(result?.name).toBe('Test Speech Trigger');
      expect(result?.speechType).toBe('any');
      expect(result?.content).toEqual([
        { value: 'hello', matchMode: 'contains' },
        { value: 'hi', matchMode: 'contains' }
      ]);
      expect(result?.id).toBeDefined();
    });

    it('should create an emote trigger', () => {
      const input: TriggerInput = {
        type: 'emote',
        name: 'Test Emote Trigger',
        content: [
          { value: 'smiles', matchMode: 'contains' },
          { value: 'grins', matchMode: 'contains' }
        ],
      };

      const result = BehaviorsModule.createTrigger(input) as TriggerEmote;

      expect(result).toBeDefined();
      expect(result?.type).toBe('emote');
      expect(result?.name).toBe('Test Emote Trigger');
      expect(result?.content).toEqual([
        { value: 'smiles', matchMode: 'contains' },
        { value: 'grins', matchMode: 'contains' }
      ]);
      expect(result?.id).toBeDefined();
    });

    it('should create an action trigger', () => {
      const input: TriggerInput = {
        type: 'action',
        name: 'Test Action Trigger',
        content: [
          { value: 'hugs', matchMode: 'startsWith' },
          { value: 'kisses', matchMode: 'startsWith' }
        ],
      };

      const result = BehaviorsModule.createTrigger(input) as TriggerAction;

      expect(result).toBeDefined();
      expect(result?.type).toBe('action');
      expect(result?.name).toBe('Test Action Trigger');
      expect(result?.content).toEqual([
        { value: 'hugs', matchMode: 'startsWith' },
        { value: 'kisses', matchMode: 'startsWith' }
      ]);
      expect(result?.id).toBeDefined();
    });

    it('should create an activity trigger', () => {
      const input: TriggerInput = {
        type: 'activity',
        name: 'Test Activity Trigger',
        activityName: ['Activity1', 'Activity2'],
        groupName: ['Group1'],
      };

      const result = BehaviorsModule.createTrigger(input) as TriggerActivity;

      expect(result).toBeDefined();
      expect(result?.type).toBe('activity');
      expect(result?.name).toBe('Test Activity Trigger');
      expect(result?.activityName).toEqual(['Activity1', 'Activity2']);
      expect(result?.groupName).toEqual(['Group1']);
      expect(result?.id).toBeDefined();
    });

    it('should create an orgasm trigger', () => {
      const input: TriggerInput = {
        type: 'orgasm',
        name: 'Test Orgasm Trigger',
        orgasmType: 'normal',
      };

      const result = BehaviorsModule.createTrigger(input) as TriggerOrgasm;

      expect(result).toBeDefined();
      expect(result?.type).toBe('orgasm');
      expect(result?.name).toBe('Test Orgasm Trigger');
      expect(result?.orgasmType).toBe('normal');
      expect(result?.id).toBeDefined();
    });

    it('should create a roomPresence trigger', () => {
      const input: TriggerInput = {
        type: 'roomPresence',
        name: 'Test Room Presence Trigger',
        event: 'join',
      };

      const result = BehaviorsModule.createTrigger(input) as TriggerRoomPresence;

      expect(result).toBeDefined();
      expect(result?.type).toBe('roomPresence');
      expect(result?.name).toBe('Test Room Presence Trigger');
      expect(result?.event).toBe('join');
      expect(result?.id).toBeDefined();
    });

    it('should create a trigger with constraints', () => {
      const input: TriggerInput = {
        type: 'speech',
        name: 'Test Trigger',
        speechType: 'any',
        content: [
          { value: 'hello', matchMode: 'contains' }
        ],
        constraints: {
          player: {
            arousalMin: 30,
            arousalMax: 70,
          },
          source: {
            memberNumber: {
              entries: [
                { value: '1', mode: 'include' },
              ],
            },
          },
        },
        constraintMode: 'all',
      };

      const result = BehaviorsModule.createTrigger(input);

      expect(result).toBeDefined();
      expect(result?.constraints).toBeDefined();
      expect(result?.constraints?.player?.arousalMin).toBe(30);
      expect(result?.constraints?.player?.arousalMax).toBe(70);
      expect(result?.constraints?.source?.memberNumber).toBeDefined();
      expect(result?.constraintMode).toBe('all');
    });
  });

  describe('createTrigger - edge cases', () => {
    it('should generate a default name when not provided', () => {
      const input: TriggerInput = {
        type: 'speech',
        speechType: 'any',
        content: [
          { value: 'hello', matchMode: 'contains' }
        ],
      };

      const result = BehaviorsModule.createTrigger(input);

      expect(result).toBeDefined();
      expect(result?.name).toBe('New Trigger');
    });
  });

  describe('createTrigger - negative cases', () => {
    it('should return undefined for invalid trigger input', () => {
      const input: any = {
        type: 'speech',
        speechType: 'invalid',
      };

      const result = BehaviorsModule.createTrigger(input);

      expect(result).toBeUndefined();
    });

    it('should return undefined for missing required fields', () => {
      const input: any = {
        type: 'speech',
      };

      const result = BehaviorsModule.createTrigger(input);

      expect(result).toBeUndefined();
    });
  });
});

describe('Reaction Creation', () => {
  describe('createReaction - positive cases', () => {
    it('should create a speech reaction', () => {
      const input: ReactionInput = {
        type: 'speech',
        name: 'Test Speech Reaction',
        content: ['Hello!', 'Hi there!'],
      };

      const result = BehaviorsModule.createReaction(input) as ReactionSpeech;

      expect(result).toBeDefined();
      expect(result?.type).toBe('speech');
      expect(result?.name).toBe('Test Speech Reaction');
      expect(result?.content).toEqual(['Hello!', 'Hi there!']);
      expect(result?.id).toBeDefined();
    });

    it('should create an emote reaction', () => {
      const input: ReactionInput = {
        type: 'emote',
        name: 'Test Emote Reaction',
        content: ['smiles', 'grins'],
      };

      const result = BehaviorsModule.createReaction(input) as ReactionEmote;

      expect(result).toBeDefined();
      expect(result?.type).toBe('emote');
      expect(result?.name).toBe('Test Emote Reaction');
      expect(result?.content).toEqual(['smiles', 'grins']);
      expect(result?.id).toBeDefined();
    });

    it('should create an action reaction', () => {
      const input: ReactionInput = {
        type: 'action',
        name: 'Test Action Reaction',
        content: ['hugs', 'kisses'],
      };

      const result = BehaviorsModule.createReaction(input) as ReactionAction;

      expect(result).toBeDefined();
      expect(result?.type).toBe('action');
      expect(result?.name).toBe('Test Action Reaction');
      expect(result?.content).toEqual(['hugs', 'kisses']);
      expect(result?.id).toBeDefined();
    });

    it('should create an activity reaction', () => {
      const input: ReactionInput = {
        type: 'activity',
        name: 'Test Activity Reaction',
        activityName: 'TestActivity',
        groupName: 'TestGroup' as any,
      };

      const result = BehaviorsModule.createReaction(input) as ReactionActivity;

      expect(result).toBeDefined();
      expect(result?.type).toBe('activity');
      expect(result?.name).toBe('Test Activity Reaction');
      expect(result?.activityName).toBe('TestActivity');
      expect(result?.groupName).toBe('TestGroup');
      expect(result?.id).toBeDefined();
    });
  });

  describe('createReaction - edge cases', () => {
    it('should generate a default name when not provided', () => {
      const input: ReactionInput = {
        type: 'speech',
        content: ['hello'],
      };

      const result = BehaviorsModule.createReaction(input);

      expect(result).toBeDefined();
      expect(result?.name).toBe('New Reaction');
    });
  });

  describe('createReaction - negative cases', () => {
    it('should return undefined for invalid reaction input', () => {
      const input: any = {
        type: 'speech',
        content: 123,
      };

      const result = BehaviorsModule.createReaction(input);

      expect(result).toBeUndefined();
    });

    it('should return undefined for missing required fields', () => {
      const input: any = {
        type: 'speech',
      };

      const result = BehaviorsModule.createReaction(input);

      expect(result).toBeUndefined();
    });
  });
});

describe('ID Generation', () => {
  it('should generate unique IDs for behaviors', () => {
    const input1: BehaviorInput = { name: 'Behavior 1' };
    const input2: BehaviorInput = { name: 'Behavior 2' };

    const result1 = BehaviorsModule.createBehavior(input1);
    const result2 = BehaviorsModule.createBehavior(input2);

    expect(result1?.id).toBeDefined();
    expect(result2?.id).toBeDefined();
    expect(result1?.id).not.toBe(result2?.id);
  });

  it('should generate unique IDs for triggers', () => {
    const input1: TriggerInput = {
      type: 'speech',
      speechType: 'any',
      content: [
        { value: 'hello', matchMode: 'contains' }
      ],
    };
    const input2: TriggerInput = {
      type: 'speech',
      speechType: 'any',
      content: [
        { value: 'hi', matchMode: 'contains' }
      ],
    };

    const result1 = BehaviorsModule.createTrigger(input1);
    const result2 = BehaviorsModule.createTrigger(input2);

    expect(result1?.id).toBeDefined();
    expect(result2?.id).toBeDefined();
    expect(result1?.id).not.toBe(result2?.id);
  });

  it('should generate unique IDs for reactions', () => {
    const input1: ReactionInput = {
      type: 'speech',
      content: ['hello'],
    };
    const input2: ReactionInput = {
      type: 'speech',
      content: ['hi'],
    };

    const result1 = BehaviorsModule.createReaction(input1);
    const result2 = BehaviorsModule.createReaction(input2);

    expect(result1?.id).toBeDefined();
    expect(result2?.id).toBeDefined();
    expect(result1?.id).not.toBe(result2?.id);
  });
});

