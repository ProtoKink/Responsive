import { BaseSettingsModel } from "bc-deeplib/deeplib";
import { GlobalSettingsModel } from "./base";
import { ResponsesSettingsModel } from "./responses";

export type ProfilesSettingsModel = BaseSettingsModel & {
  [index: number]: ProfileEntryModel;
};

export type ProfileEntryModel = {
  name: string;
  data: ProfileSaveModel;
};

export type ProfileSaveModel = {
  GlobalModule: GlobalSettingsModel;
  ResponsesModule: ResponsesSettingsModel;
};

