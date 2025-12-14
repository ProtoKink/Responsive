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

export function dataFix() {
  const data = modStorage.playerStorage;
  const mainResponses = data.BehaviorsModule.mainResponses;

  mainResponses.forEach((entry) => {
    if (entry.actName === undefined) {
      mainResponses.splice(mainResponses.indexOf(entry));
    }

    if (typeof entry.groupName === 'string') {
      entry.groupName = [entry.groupName];
    }

    if (entry.responses === undefined) {
      entry.responses = [''];
    }
  });
}

export function clearOldData() {
  delete (Player.OnlineSettings as any)?.['BCResponsive']?.Profiles;
  delete (Player.OnlineSettings as any)?.['BCResponsive']?.data;
  delete (Player.OnlineSettings as any)?.['BCResponsive']?.SavedVersion;

  delete (Player as any)['BCResponsive']?.Profiles;
  delete (Player as any)['BCResponsive']?.data;
  delete (Player as any)['BCResponsive']?.SavedVersion;
}
