import { BaseModule } from "../base/base_module";
import { Subscreen } from "../base/setting_definitions";
import { ProfilesSettingsModel } from "../models/profiles";
import { GuiProfiles } from "../screens/profiles";

export class ProfilesModule extends BaseModule {
  get settings(): ProfilesSettingsModel {
    return super.settings as ProfilesSettingsModel;
  }

  get settingsScreen(): Subscreen | null {
    return GuiProfiles;
  }

  get defaultSettings() {
    return <ProfilesSettingsModel>{};
  }

  Load(): void {}

  Run(): void {}
}
