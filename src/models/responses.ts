import { BaseSettingsModel } from "bc-deeplib/deeplib";

export type ExtraType = 'low' | 'light' | 'medium' | 'hot' | 'orgasm';

export type ResponsesSettingsModel = BaseSettingsModel & {
  mainResponses: ResponsesEntryModel[];
  extraResponses: ExtraResponsesModel;
};

export type ResponsesEntryModel = {
  actName: string;
  groupName: string[];
  responses: string[];
  selfTrigger?: boolean;
};

export type ExtraResponsesModel = Record<ExtraType, string[]>;
