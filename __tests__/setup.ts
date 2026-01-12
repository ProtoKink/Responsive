import * as gameGlobals from './mocks/game-globals';

export function setupGameGlobals(): void {
  (global as any).Player = gameGlobals.Player;
  (global as any).ChatRoomData = gameGlobals.ChatRoomData;
  (global as any).ChatRoomCharacter = gameGlobals.ChatRoomCharacter;
  (global as any).ChatRoomTargetMemberNumber = gameGlobals.ChatRoomTargetMemberNumber;
  (global as any).CommonTime = gameGlobals.CommonTime;
  (global as any).ChatRoomGetCharacter = gameGlobals.ChatRoomGetCharacter;
  (global as any).ChatRoomSendEmote = gameGlobals.ChatRoomSendEmote;
  (global as any).AssetGetActivity = gameGlobals.AssetGetActivity;
  (global as any).AssetGroupGet = gameGlobals.AssetGroupGet;
  (global as any).ActivityRun = gameGlobals.ActivityRun;
  (global as any).CharacterPronounDescription = gameGlobals.CharacterPronounDescription;
  (global as any).CharacterNickname = gameGlobals.CharacterNickname;
  (global as any).ElementValue = gameGlobals.ElementValue;
  (global as any).ChatRoomSendChat = gameGlobals.ChatRoomSendChat;
  (global as any).ChatRoomSendChatMessage = gameGlobals.ChatRoomSendChatMessage;
  (global as any).CommonKeys = gameGlobals.CommonKeys;
  (global as any).CommonGenerateUniqueID = gameGlobals.CommonGenerateUniqueID;
  (global as any).ActivityCanBeDone = gameGlobals.ActivityCanBeDone;
}

setupGameGlobals();

global.window = {
  bcx: undefined,
} as any;

(global as any).PUBLIC_URL = '/public';