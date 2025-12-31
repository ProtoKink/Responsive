import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Reaction, ReactionMode, MessageData } from '@/models/behaviors';

const mockChatRoomAutoInterceptMessage = vi.fn();
const mockRandomResponse = vi.fn((arr: string[]) => arr[0] || '');
const mockReplaceTemplate = vi.fn((msg: string, _target?: any, _source?: any) => msg);
const mockDoesBcxAllowsTalking = vi.fn(() => true);
const mockSendActionMessage = vi.fn();
const mockGetRandomInt = vi.fn((max: number) => Math.floor(Math.random() * max));

vi.mock('bc-deeplib/deeplib', () => ({
  modLogger: {
    error: vi.fn(),
  },
  sendActionMessage: () => mockSendActionMessage(),
}));

vi.mock('@/utilities/chat_messages', () => ({
  chatRoomAutoInterceptMessage: (msg: string) => mockChatRoomAutoInterceptMessage(msg),
  randomResponse: (arr: string[]) => mockRandomResponse(arr),
  replaceTemplate: (msg: string, target?: any, source?: any) => mockReplaceTemplate(msg, target, source),
}));

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

vi.mock('@/utilities/handlers', () => ({
  doesBcxAllowsTalking: () => mockDoesBcxAllowsTalking(),
  areBehaviorsEnabled: vi.fn(() => true),
}));

vi.mock('@/utilities/other', () => ({
  getRandomInt: (max: number) => mockGetRandomInt(max),
  assertNever: vi.fn((x: never) => {
    throw new Error(`Unexpected case: ${x}`);
  }),
}));

import { processReactions } from '@/utilities/reactions';

global.ChatRoomSendEmote = vi.fn();
global.AssetGetActivity = vi.fn(() => ({ Name: 'TestActivity', Group: 'TestGroup' } as any));
global.AssetGroupGet = vi.fn(() => ({ Name: 'TestGroup' } as any));
global.ActivityRun = vi.fn();
global.CharacterPronounDescription = vi.fn(() => 'She/Her');
global.CharacterNickname = vi.fn(() => 'Test Character');
global.Player = { MemberNumber: 1 } as any;

describe('processReactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('reaction mode: random', () => {
    it('should process a single random reaction', () => {
      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'speech',
          content: ['Hello!'],
        },
        {
          id: 'reaction2',
          name: 'Reaction 2',
          type: 'speech',
          content: ['Hi there!'],
        },
      ];

      const messageData: MessageData = {};

      processReactions(reactions, 'random', messageData);

      expect(mockChatRoomAutoInterceptMessage).toHaveBeenCalled();
    });
  });

  describe('reaction mode: all', () => {
    it('should process all reactions', () => {
      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'speech',
          content: ['Hello!'],
        },
        {
          id: 'reaction2',
          name: 'Reaction 2',
          type: 'speech',
          content: ['Hi there!'],
        },
      ];

      const messageData: MessageData = {};

      processReactions(reactions, 'all', messageData);

      expect(mockChatRoomAutoInterceptMessage).toHaveBeenCalledTimes(2);
    });
  });

  describe('speech reactions', () => {
    it('should process speech reaction', () => {
      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'speech',
          content: ['Hello!'],
        },
      ];

      const messageData: MessageData = {};

      processReactions(reactions, 'all', messageData);

      expect(mockChatRoomAutoInterceptMessage).toHaveBeenCalled();
    });

    it('should not process speech reaction if BCX blocks talking', () => {
      mockDoesBcxAllowsTalking.mockReturnValue(false);

      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'speech',
          content: ['Hello!'],
        },
      ];

      const messageData: MessageData = {};

      processReactions(reactions, 'all', messageData);

      expect(mockChatRoomAutoInterceptMessage).not.toHaveBeenCalled();
    });
  });

  describe('emote reactions', () => {
    it('should process emote reaction', () => {
      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'emote',
          content: ['smiles'],
        },
      ];

      const messageData: MessageData = {};

      processReactions(reactions, 'all', messageData);

      expect(global.ChatRoomSendEmote).toHaveBeenCalled();
    });
  });

  describe('action reactions', () => {
    it('should process action reaction', () => {
      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'action',
          content: ['hugs'],
        },
      ];

      const messageData: MessageData = {};

      processReactions(reactions, 'all', messageData);

      expect(mockSendActionMessage).toHaveBeenCalled();
    });
  });

  describe('activity reactions', () => {
    it('should process activity reaction when all required data is present', () => {
      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'activity',
          activityName: 'TestActivity',
          groupName: 'TestGroup' as any,
        },
      ];

      const messageData: MessageData = {
        source: { MemberNumber: 2 } as any,
      };

      processReactions(reactions, 'all', messageData);

      expect(global.ActivityRun).toHaveBeenCalled();
    });

    it('should not process activity reaction when activity is not found', () => {
      global.AssetGetActivity = vi.fn(() => null);

      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'activity',
          activityName: 'TestActivity',
          groupName: 'TestGroup' as any,
        },
      ];

      const messageData: MessageData = {
        source: { MemberNumber: 2 } as any,
      };

      processReactions(reactions, 'all', messageData);

      expect(global.ActivityRun).not.toHaveBeenCalled();
    });

    it('should not process activity reaction when group is not found', () => {
      global.AssetGetActivity = vi.fn(() => ({ Name: 'TestActivity', Group: 'TestGroup' } as any));
      global.AssetGroupGet = vi.fn(() => null);

      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'activity',
          activityName: 'TestActivity',
          groupName: 'TestGroup' as any,
        },
      ];

      const messageData: MessageData = {
        source: { MemberNumber: 2 } as any,
      };

      processReactions(reactions, 'all', messageData);

      expect(global.ActivityRun).not.toHaveBeenCalled();
    });

    it('should not process activity reaction when source is not present', () => {
      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'activity',
          activityName: 'TestActivity',
          groupName: 'TestGroup' as any,
        },
      ];

      const messageData: MessageData = {};

      processReactions(reactions, 'all', messageData);

      expect(global.ActivityRun).not.toHaveBeenCalled();
    });
  });

  describe('empty reactions array', () => {
    it('should handle empty reactions array gracefully', () => {
      const reactions: Reaction[] = [];
      const messageData: MessageData = {};

      expect(() => {
        processReactions(reactions, 'all', messageData);
      }).not.toThrow();
    });
  });

  describe('invalid reaction mode', () => {
    it('should handle invalid reaction mode gracefully', () => {
      const reactions: Reaction[] = [
        {
          id: 'reaction1',
          name: 'Reaction 1',
          type: 'speech',
          content: ['Hello!'],
        },
      ];

      const messageData: MessageData = {};

      expect(() => {
        processReactions(reactions, 'invalid' as ReactionMode, messageData);
      }).not.toThrow();
      
      expect(mockChatRoomAutoInterceptMessage).not.toHaveBeenCalled();
    });
  });
});

