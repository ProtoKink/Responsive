import { GlobalSettingsModel } from './base';
import { ProfileEntryModel } from './profiles';
import { ResponsesSettingsModel } from './responses';
import { SettingsModel as DL_SettingsModel } from 'bc-deeplib/deeplib';

export interface SettingsModel extends DL_SettingsModel {
  GlobalModule: GlobalSettingsModel;
  ResponsesModule: ResponsesSettingsModel;
  ProfilesModule: ProfileEntryModel[];
}