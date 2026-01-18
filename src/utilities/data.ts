import { ModStorage } from 'bc-deeplib/deeplib';
import { GlobalSettingsModel } from '../models/base';
import { ProfileEntryModel } from '../models/profiles';
import { BehaviorsSettingsModel } from '../models/behaviors';
import { SettingsModel } from '../models/settings';
import { AnimatronikkaSettingsModel } from '../models/animations';

export const modStorage = new ModStorage<SettingsModel>('Responsive');

export function dataErase(doResetSettings: boolean, doResetResponses: boolean, doResetProfiles: boolean) {
  const data = modStorage.playerStorage;
  if (doResetSettings) {
    data.GlobalModule = <GlobalSettingsModel>{};
  }

  if (doResetResponses) {
    data.BehaviorsModule = <BehaviorsSettingsModel>{};
    data.AnimatronikkaModule = <AnimatronikkaSettingsModel>{};
  }

  if (doResetProfiles) {
    data.ProfilesModule = <ProfileEntryModel[]>{};
  }
  modStorage.save();
}

export function dataResetForManual() {
  const data = modStorage.playerStorage;
  data.BehaviorsModule = {
    behaviors: {},
    triggers: {},
    reactions: {}
  } as BehaviorsSettingsModel;
  data.AnimatronikkaModule = {
    animations: {}
  } as AnimatronikkaSettingsModel;
  modStorage.save();
}
