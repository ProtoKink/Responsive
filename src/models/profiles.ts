import { BaseSettingsModel } from 'bc-deeplib/deeplib';
import { GlobalSettingsModel } from './base';
import { BehaviorsSettingsModel } from './behaviors';

export type ProfilesSettingsModel = BaseSettingsModel & {
  [index: number]: ProfileEntryModel;
};

export type ProfileEntryModel = {
  name: string;
  data: ProfileSaveModel;
};

export type ProfileSaveModel = {
  GlobalModule: GlobalSettingsModel;
  BehaviorsModule: BehaviorsSettingsModel;
};

