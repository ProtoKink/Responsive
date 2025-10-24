import { BaseSettingsModel } from "./base";

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

export type ExtraResponsesModel = {
  low: string[];
  light: string[];
  medium: string[];
  hot: string[];
  orgasm: string[];
};
