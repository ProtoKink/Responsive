import { GlobalSettingsModel } from "./base";
import { ProfileEntryModel } from "./profiles";
import { ResponsesSettingsModel } from "./responses";

export type SettingsModel = {
  [x: string]: any;
  Version: string;
  GlobalModule: GlobalSettingsModel;
  ResponsesModule: ResponsesSettingsModel;
  ProfilesModule: ProfileEntryModel[];
};
