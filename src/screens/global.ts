import { Setting } from "../../.types/setting";
import { GuiSubscreen } from "../base/base_setting";
import { GlobalSettingsModel } from "../models/base";

export class GuiGlobal extends GuiSubscreen {
  get name(): string {
    return "settings";
  }

  get icon(): string {
    return "Icons/Preference.png";
  }

  get settings(): GlobalSettingsModel {
    return super.settings as GlobalSettingsModel;
  }

  get structure(): Setting[] {
    return [
      <Setting>{
        type: "checkbox",
        label: "settings.setting.responsive_enabled.name",
        description: "settings.setting.responsive_enabled.desc",
        setting: () => this.settings?.ResponsiveEnabled ?? true,
        setSetting: (val) => (this.settings.ResponsiveEnabled = val)
      },
      <Setting>{
        type: "checkbox",
        label: "settings.setting.responsesEnabled.name",
        description: "settings.setting.responsesEnabled.desc",
        setting: () => this.settings?.responsesEnabled ?? true,
        setSetting: (val) => (this.settings.responsesEnabled = val)
      },
      <Setting>{
        type: "checkbox",
        label: "settings.setting.chartalk_enabled.name",
        description: "settings.setting.chartalk_enabled.desc",
        setting: () => this.settings?.CharTalkEnabled ?? true,
        setSetting: (val) => (this.settings.CharTalkEnabled = val)
      },
      <Setting>{
        type: "checkbox",
        label: "settings.setting.interruption_enabled.name",
        description: "settings.setting.interruption_enabled.desc",
        setting: () => this.settings?.doMessageInterruption ?? true,
        setSetting: (val) => (this.settings.doMessageInterruption = val)
      },
      <Setting>{
        type: "checkbox",
        label: "settings.setting.leave_message_enabled.name",
        description: "settings.setting.leave_message_enabled.desc",
        setting: () => this.settings?.doLeaveMessage ?? true,
        setSetting: (val) => (this.settings.doLeaveMessage = val)
      },
      /* <Setting>{
        type: "checkbox",
        label: "settings.setting.doAddMoansOnHighArousal.name",
        description: "settings.setting.doAddMoansOnHighArousal.desc",
        setting: () => this.settings?.doAddMoansOnHighArousal ?? true,
        setSetting: (val) => (this.settings.doAddMoansOnHighArousal = val)
      }, */
      <Setting>{
        type: "checkbox",
        label: "settings.setting.doPreventMessageIfBcxBlock.name",
        description: "settings.setting.doPreventMessageIfBcxBlock.desc",
        setting: () => this.settings?.doPreventMessageIfBcxBlock ?? false,
        setSetting: (val) => (this.settings.doPreventMessageIfBcxBlock = val)
      },
      <Setting>{
        type: "checkbox",
        label: "settings.setting.new_version_message_enabled.name",
        description: "settings.setting.new_version_message_enabled.desc",
        setting: () => this.settings?.doShowNewVersionMessage ?? true,
        setSetting: (val) => (this.settings.doShowNewVersionMessage = val)
      }
    ];
  }

  Load(): void {
    super.Load();
  }
}
