import { GuiSubscreen } from "../base/base_setting";
import { ProfileEntryModel, ProfileNames, ProfileSaveModel, ProfilesSettingsModel } from "../models/profiles";
import { conWarn } from "../utilities/console";
import { getText } from "../translation";
import { PlayerStorage } from "../utilities/data";

export class GuiProfiles extends GuiSubscreen {
  private PreferenceText = "";
  private ProfileNames: ProfileNames = ["", "", ""];

  get name(): string {
    return "profiles";
  }

  get icon(): string {
    return "Icons/Title.png";
  }

  get settings(): ProfilesSettingsModel {
    return super.settings as ProfilesSettingsModel;
  }

  tmpGlbl = GuiSubscreen.START_X;

  Load() {
    super.Load();

    for (let i = 0; i < 3; i++) {
      let profileIndex = i + 1;
      if (!PlayerStorage()?.ProfilesModule?.[profileIndex]) {
        PlayerStorage().ProfilesModule[profileIndex] = {
          data: <ProfileSaveModel>{},
          name: ""
        };
      }
      this.ProfileNames[i] = PlayerStorage()?.ProfilesModule?.[profileIndex]?.name ?? "";
    }

    CharacterAppearanceForceUpCharacter = Player.MemberNumber ?? -1;
  }

  Run() {
    let prev = MainCanvas.textAlign;
    super.Run();
    MainCanvas.textAlign = "left";

    for (let i = 0; i < 3; i++) {
      let profileIndex = i + 1;

      if (this.ProfileNames[i] === "")
        DrawText(getText("profiles.text.profile") + ` ${profileIndex}`, this.getXPos(profileIndex), this.getYPos(profileIndex), "Black", "Gray");
      if (this.ProfileNames[i] !== "")
        DrawText(this.ProfileNames[i] as string, this.getXPos(profileIndex), this.getYPos(profileIndex), "Black", "Gray");

      this.drawButton("profiles.button.save", "white", profileIndex, 250);
      this.drawButton("profiles.button.load", "white", profileIndex, 500);
      this.drawButton("profiles.button.delete", "IndianRed", profileIndex, 750);
    }

    if (this.PreferenceText)
      DrawText(this.PreferenceText, GuiSubscreen.START_X + 250, GuiSubscreen.START_Y - GuiSubscreen.Y_MOD, "Black", "Gray");

    MainCanvas.textAlign = prev;
  }

  Click() {
    super.Click();

    for (let i = 0; i < 3; i++) {
      let profileIndex = i + 1;

      this.handleProfilesSaving(profileIndex);
      this.handleProfilesLoading(profileIndex);
      this.handleProfilesDeleting(profileIndex);
    }
  }

  Exit() {
    CharacterAppearanceForceUpCharacter = -1;
    CharacterLoadCanvas(Player);
    this.PreferenceText = "";
    super.Exit();
  }

  saveProfile(profileId: number, profileName: string) {
    if (profileId < 1 || profileId > 3) {
      conWarn(`Invalid profile id ${profileId}`);
      return false;
    }

    if (!Object.keys(PlayerStorage()?.ProfilesModule?.[profileId]).length) {
      PlayerStorage().ProfilesModule[profileId] = <ProfileEntryModel>{};
    }

    let saveData: ProfileSaveModel = {
      GlobalModule: PlayerStorage().GlobalModule,
      ResponsesModule: PlayerStorage().ResponsesModule
    };

    PlayerStorage().ProfilesModule[profileId] = {
      name: profileName,
      data: saveData
    };

    return true;
  }

  loadProfile(profileId: number) {
    if (profileId < 1 || profileId > 3) {
      conWarn(`Invalid profile id ${profileId}`);
      return false;
    }

    if (!Object.keys(PlayerStorage()?.ProfilesModule?.[profileId]).length) {
      return false;
    }

    let data = PlayerStorage().ProfilesModule[profileId].data;
    if (!data) {
      return false;
    }

    if (data) {
      PlayerStorage().GlobalModule = data.GlobalModule;
      PlayerStorage().ResponsesModule = data.ResponsesModule;
    }

    return true;
  }

  deleteProfile(profileId: number) {
    if (profileId < 1 || profileId > 3) {
      conWarn(`Invalid profile id ${profileId}`);
      return false;
    }

    if (!Object.keys(PlayerStorage()?.ProfilesModule?.[profileId]).length) {
      return false;
    }

    if (Object.keys(PlayerStorage()?.ProfilesModule?.[profileId]).length) {
      PlayerStorage().ProfilesModule[profileId] = <ProfileEntryModel>{};
      return true;
    }
  }

  handleProfilesSaving(profileIndex: number) {
    let formerIndex = profileIndex - 1;
    if (MouseIn(this.getXPos(profileIndex) + 250, this.getYPos(profileIndex) - 32, 200, 64)) {
      let promptedName = prompt(getText("profiles.prompt"));

      if (promptedName === null) return;
      this.ProfileNames[formerIndex] = promptedName;
      if (this.ProfileNames[formerIndex] === "") {
        this.saveProfile(profileIndex, "");
        this.PreferenceText = `${getText("profiles.text.profile")} ${profileIndex} ${getText("profiles.text.has_been_saved")}`;
      }
      if (this.ProfileNames[formerIndex] !== "") {
        this.saveProfile(profileIndex, this.ProfileNames[formerIndex] as string);
        this.PreferenceText = `${getText("profiles.text.profile")} "${this.ProfileNames[formerIndex]}" ${getText(
          "profiles.text.has_been_saved"
        )}`;
      }
      return;
    }
  }

  handleProfilesLoading(profileIndex: number) {
    let formerIndex = profileIndex - 1;
    if (MouseIn(this.getXPos(profileIndex) + 500, this.getYPos(profileIndex) - 32, 200, 64)) {
      if (!this.loadProfile(profileIndex)) {
        this.PreferenceText = `${getText("profiles.text.profile")} ${profileIndex} ${getText("profiles.text.needs_to_be_saved")}`;
        return;
      }
      if (this.ProfileNames[formerIndex] === "")
        this.PreferenceText = `${getText("profiles.text.profile")} ${profileIndex} ${getText("profiles.text.has_been_loaded")}`;
      if (this.ProfileNames[formerIndex] !== "")
        this.PreferenceText = `${getText("profiles.text.profile")} "${this.ProfileNames[formerIndex]}" ${getText(
          "profiles.text.has_been_loaded"
        )}`;
      return;
    }
  }

  handleProfilesDeleting(profileIndex: number) {
    let formerIndex = profileIndex - 1;
    if (MouseIn(this.getXPos(profileIndex) + 750, this.getYPos(profileIndex) - 32, 200, 64)) {
      if (this.ProfileNames[formerIndex] === null) return;

      if (this.deleteProfile(profileIndex)) {
        if (this.ProfileNames[formerIndex] === "") {
          this.PreferenceText = `${getText("profiles.text.profile")} ${profileIndex} ${getText("profiles.text.has_been_deleted")}`;
          return;
        }
        if (this.ProfileNames[formerIndex] !== "") {
          this.PreferenceText = `${getText("profiles.text.profile")} "${this.ProfileNames[formerIndex]}" ${getText(
            "profiles.text.has_been_deleted"
          )}`;
          this.ProfileNames[formerIndex] = "";
          return;
        }
      }

      if (!this.deleteProfile(profileIndex)) {
        this.PreferenceText = `${getText("profiles.text.profile")} ${profileIndex} ${getText("profiles.text.not_saved_or_already_deleted")}`;
        return;
      }
      return;
    }
  }
}
