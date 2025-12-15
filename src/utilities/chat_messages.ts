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

const pronouns = {
  'She/Her': {
    pronoun: 'she',
    possessive: 'her',
    intensive: 'her',
    intensiveSelf: 'herself'
  },
  'He/Him': {
    pronoun: 'he',
    possessive: 'his',
    intensive: 'him',
    intensiveSelf: 'himself'
  },
  'They/Them': {
    pronoun: 'they',
    possessive: 'their',
    intensive: 'them',
    intensiveSelf: 'themselves'
  },
};

export function replaceTemplate(msg: string, target?: Character, source?: Character) {
  if (msg === undefined) return '';

  const playerPronounKey = CharacterPronounDescription(Player) as keyof typeof pronouns;
  const playerEntry = pronouns[playerPronounKey];
  const playerName = CharacterNickname(Player);

  const targetPronounKey = target
    ? (CharacterPronounDescription(target) as keyof typeof pronouns)
    : undefined;

  const targetEntry = targetPronounKey ? pronouns[targetPronounKey] : undefined;
  const targetName = target ? CharacterNickname(target) : undefined;

  const sourcePronounKey = source
    ? (CharacterPronounDescription(source) as keyof typeof pronouns)
    : undefined;

  const sourceEntry = sourcePronounKey ? pronouns[sourcePronounKey] : undefined;
  const sourceName = source ? CharacterNickname(source) : undefined;

  const replacements: Record<string, string | undefined> = {
    'player name': playerName,
    'player pronoun': playerEntry.pronoun,
    'player possessive': playerEntry.possessive,
    'player intensive': playerEntry.intensive,
    'player self': playerEntry.intensiveSelf,

    'target name': targetName,
    'target pronoun': targetEntry?.pronoun,
    'target possessive': targetEntry?.possessive,
    'target intensive': targetEntry?.intensive,
    'target self': targetEntry?.intensiveSelf,

    'source name': sourceName,
    'source pronoun': sourceEntry?.pronoun,
    'source possessive': sourceEntry?.possessive,
    'source intensive': sourceEntry?.intensive,
    'source self': sourceEntry?.intensiveSelf
  };

  return msg.replace(/{{\s*([^}]+?)\s*}}/g, (_, key) => {
    const normalized = key.trim().toLowerCase();
    return replacements[normalized] ?? `{{ ${key} }}`;
  });
}

export function randomResponse(key: string[]) {
  const rnd = getRandomInt(key.length);

  return key[rnd] as string;
}
