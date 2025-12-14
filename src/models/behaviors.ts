import { BaseSettingsModel } from 'bc-deeplib/deeplib';

export type ExtraType = 'low' | 'light' | 'medium' | 'hot' | 'orgasm';

export type BehaviorsSettingsModel = BaseSettingsModel & {
  mainResponses: BehaviorsEntryModel[];
  extraResponses: ExtraResponsesModel;
};

export type BehaviorsEntryModel = {
  actName: ActivityName;
  groupName: AssetGroupItemName[];
  responses: string[];
  selfTrigger: boolean;
};

export type ExtraResponsesModel = Record<ExtraType, string[]>;
