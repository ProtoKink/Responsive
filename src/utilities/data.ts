import { ModStorage } from 'bc-deeplib/deeplib';
import { GlobalSettingsModel } from '../models/base';
import { ProfileEntryModel } from '../models/profiles';
import { BehaviorsSettingsModel } from '../models/behaviors';
import { SettingsModel } from '../models/settings';

export const modStorage = new ModStorage<SettingsModel>('Responsive');

export function dataErase(doResetSettings: boolean, doResetResponses: boolean, doResetProfiles: boolean) {
  const data = modStorage.playerStorage;
  if (doResetSettings) {
    data.GlobalModule = <GlobalSettingsModel>{};
  }

  if (doResetResponses) {
    data.BehaviorsModule = <BehaviorsSettingsModel>{};
  }

  if (doResetProfiles) {
    data.ProfilesModule = <ProfileEntryModel[]>{};
  }
  modStorage.save();
}

export function dataResetForManual() {
  const data = modStorage.playerStorage;
  data.BehaviorsModule = <BehaviorsSettingsModel><unknown>{
    mainResponses: [],
    extraResponses: {
      low: [],
      light: [],
      medium: [],
      hot: [],
      orgasm: []
    }
  };
  modStorage.save();
}
