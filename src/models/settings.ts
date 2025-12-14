import { GlobalSettingsModel } from './base';
import { ProfileEntryModel } from './profiles';
import { BehaviorsSettingsModel } from './behaviors';
import { SettingsModel as DL_SettingsModel } from 'bc-deeplib/deeplib';

export interface SettingsModel extends DL_SettingsModel {
  GlobalModule: GlobalSettingsModel;
  BehaviorsModule: BehaviorsSettingsModel;
  ProfilesModule: ProfileEntryModel[];
}