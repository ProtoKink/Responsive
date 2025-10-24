import { BaseSettingsModel, GlobalSettingsModel } from "./base";
import { ResponsesSettingsModel } from "./responses";

export type ProfilesSettingsModel = BaseSettingsModel & {
  [index: number]: string;
  index: ProfileEntryModel[];
};

export type ProfileEntryModel = {
  [index: number]: ProfileEntryModel;
  name: string;
  data: ProfileSaveModel;
};

export type ProfileSaveModel = {
  GlobalModule: GlobalSettingsModel;
  ResponsesModule: ResponsesSettingsModel;
};

export type ProfileNames = {
  [index: number]: string | null;
};
