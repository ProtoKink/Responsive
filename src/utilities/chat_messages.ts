import { modStorage } from './data';
import { getRandomInt } from './other';

export function isSimpleChat(msg: string) {
  return (
    msg.trim().length > 0 &&
    ChatRoomTargetMemberNumber === -1 &&
    !msg.startsWith('/') &&
    !msg.startsWith('(') &&
    !msg.startsWith('*') &&
    !msg.startsWith('!') &&
    !msg.startsWith('.') &&
    !msg.startsWith('@') &&
    !msg.startsWith('http')
  );
}

export function chatRoomAutoInterceptMessage(cur_msg: string, msg?: string) {
  if (!msg) return;

  const data = modStorage.playerStorage.GlobalModule;
  if (data.doMessageInterruption && isSimpleChat(cur_msg)) {
    return chatRoomInterceptMessage(cur_msg, msg);
  }

  return chatRoomNormalMessage(msg);
}

function chatRoomInterceptMessage(cur_msg: string, msg: string) {
  if (!msg) return;
  ElementValue('InputChat', cur_msg + '... ' + msg);
  ChatRoomSendChat();
}

function chatRoomNormalMessage(msg: string) {
  if (!msg) return;

  const backupChatRoomTargetMemberNumber = ChatRoomTargetMemberNumber;
  ChatRoomSetTarget(-1);
  const oldmsg = ElementValue('InputChat');

  ElementValue('InputChat', msg);
  ChatRoomSendChat();
  ElementValue('InputChat', oldmsg);
  ChatRoomSetTarget(backupChatRoomTargetMemberNumber);
}

export function replaceTemplate(msg: string, source: Character) {
  if (!msg) return '';

  const playerPronouns = CharacterPronounDescription(Player);
  const playerName = CharacterNickname(Player);

  const playerPronoun = playerPronouns === 'She/Her' ? 'she' : 'he';
  const playerPossessive = playerPronouns === 'She/Her' ? 'her' : 'his';
  const playerIntensive = playerPronouns === 'She/Her' ? 'her' : 'him';

  const sourcePronounItem = CharacterPronounDescription(source);
  const sourceName = CharacterNickname(source);

  const sourcePronoun = sourcePronounItem === 'She/Her' ? 'she' : 'he';
  const sourcePossessive = sourcePronounItem === 'She/Her' ? 'her' : 'his';
  const sourceIntensive =
    sourceName === playerName ? (playerPronouns === 'She/Her' ? 'herself' : 'himself') : sourcePronounItem === 'She/Her' ? 'her' : 'him';

  return msg
    .replaceAll(/%TARGET%|Player/g, playerName)
    .replaceAll(/%TARGET_PRONOUN%|Pronoun/g, playerPronoun)
    .replaceAll(/%TARGET_POSSESIVE%|Possessive/g, playerPossessive)
    .replaceAll(/%TARGET_INTENSIVE%|Intensive/g, playerIntensive)
    .replaceAll(/%SOURCE%|Source/g, sourceName)
    .replaceAll(/%SOURCE_PRONOUN%|SourcePronoun/g, sourcePronoun)
    .replaceAll(/%SOURCE_POSSESIVE%|SourcePossessive/g, sourcePossessive)
    .replaceAll(/%SOURCE_INTENSIVE%|SourceIntensive/g, sourceIntensive);
}

export function randomResponse(key: string[]) {
  const rnd = getRandomInt(key.length);

  return key[rnd] as string;
}
