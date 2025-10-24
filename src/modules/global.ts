import { BaseModule } from "../base/base_module";
import { Subscreen } from "../base/setting_definitions";
import { GlobalSettingsModel } from "../models/base";
import { GuiGlobal } from "../screens/global";

export class GlobalModule extends BaseModule {
  get settingsScreen(): Subscreen | null {
    return GuiGlobal;
  }

  get settings(): GlobalSettingsModel {
    return super.settings as GlobalSettingsModel;
  }

  get defaultSettings() {
    return <GlobalSettingsModel>{
      ResponsiveEnabled: true,
      responsesEnabled: true,
      CharTalkEnabled: true,
      doShowNewVersionMessage: true,
      doLeaveMessage: true,
      //doAddMoansOnHighArousal: true,
      doPreventMessageIfBcxBlock: false,
      doMessageInterruption: true
    };
  }

  Load(): void { }

  Run(): void { }
}
