type _ChatMessageDictionaryEntry = {
  [k: string]: unknown;
  Tag?: CommonChatTags | string;
  Text?: string;
  MemberNumber?: number;
};

type _ChatMessageDictionary = _ChatMessageDictionaryEntry[];

type ActivityInfo = {
  sourceCharacter: Character;
  targetCharacter: Character;
  groupName: AssetGroupItemName;
  activityName: ActivityName;
};

type $AssetGroupItemName = AssetGroupItemName | 'ItemPenis' | 'ItemGlans';

type WithOptional<T, K extends keyof T> = T extends unknown
  ? Prettify<Optional<T, K & keyof T>>
  : never;