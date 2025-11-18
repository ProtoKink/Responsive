type _ChatMessageDictionaryEntry = {
  [k: string]: any;
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

type $AssetGroupItemName = AssetGroupItemName | "ItemPenis" | "ItemGlans";