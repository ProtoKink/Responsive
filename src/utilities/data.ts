import { modStorage } from "bc-deeplib/deeplib";
import { GlobalSettingsModel } from "../models/base";
import { ProfileEntryModel } from "../models/profiles";
import { ResponsesSettingsModel } from "../models/responses";
import { SettingsModel } from "../models/settings";
import { ModName } from "./definition";
import { _String } from "./string";

export const PlayerStorage = () => Player[ModName];
export const ExtensionStorage = () => Player.ExtensionSettings[ModName];

export function dataErase(doResetSettings: boolean, doResetResponses: boolean, doResetProfiles: boolean) {
  if (doResetSettings) {
    Player[ModName].GlobalModule = <GlobalSettingsModel>{};
  }

  if (doResetResponses) {
    Player[ModName].ResponsesModule = <ResponsesSettingsModel>{};
  }

  if (doResetProfiles) {
    Player[ModName].ProfilesModule = <ProfileEntryModel[]>{};
  }
  modStorage.save();
}

export function dataResetForManual() {
  Player[ModName].ResponsesModule = <ResponsesSettingsModel>{
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
  let data = Player[ModName];
  let mainResponses = data.ResponsesModule.mainResponses;

  mainResponses.forEach((entry) => {
    if (entry.actName == undefined) {
      mainResponses.splice(mainResponses.indexOf(entry));
    }

    if (typeof entry.groupName == "string") {
      entry.groupName = [entry.groupName];
    }

    if (entry.responses == undefined) {
      entry.responses = [""];
    }
  });
}

export function clearOldData() {
  delete (Player.OnlineSettings as any)["BCResponsive"]?.Profiles;
  delete (Player.OnlineSettings as any)["BCResponsive"]?.data;
  delete (Player.OnlineSettings as any)["BCResponsive"]?.SavedVersion;

  delete (Player as any)["BCResponsive"]?.Profiles;
  delete (Player as any)["BCResponsive"]?.data;
  delete (Player as any)["BCResponsive"]?.SavedVersion;
}
