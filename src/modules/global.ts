import { BaseModule, Subscreen } from 'bc-deeplib/deeplib';
import { GlobalSettingsModel } from '../models/base';
import { GuiGlobal } from '../screens/global';

export class GlobalModule extends BaseModule {
  get settingsScreen(): Subscreen | null {
    return GuiGlobal;
  }

  get settings(): GlobalSettingsModel {
    return super.settings as GlobalSettingsModel;
  }

  set settings(val: GlobalSettingsModel) { 
    super.settings = val;
  }

  get defaultSettings() {
    return <GlobalSettingsModel>{
      modEnabled: true,
      responsesEnabled: true,
      CharTalkEnabled: true,
      doShowNewVersionMessage: true,
      doLeaveMessage: true,
      //doAddMoansOnHighArousal: true,
      doPreventMessageIfBcxBlock: false,
      doMessageInterruption: true
    };
  }

  load(): void { }

  run(): void { }
}
