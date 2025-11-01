import { BaseSubscreen, getText, SettingElement } from "bc-deeplib/deeplib";
import { GlobalSettingsModel } from "../models/base";
import { SubscreenOptions } from "bc-deeplib/base/base_subscreen";

export class GuiGlobal extends BaseSubscreen {
  protected static override subscreenOptions: SubscreenOptions = {
    name: 'settings',
    icon: 'Icons/Preference.png',
  };

  get settings(): GlobalSettingsModel {
    return super.settings as GlobalSettingsModel;
  }

  get pageStructure(): SettingElement[][] {
    return [[
      {
        id: "modEnabled",
        type: "checkbox",
        label: getText("settings.setting.responsive_enabled.name"),
        description: getText("settings.setting.responsive_enabled.desc"),
        setElementValue: () => this.settings?.modEnabled ?? true,
        setSettingValue: (val) => (this.settings.modEnabled = val)
      },
      {
        id: "responsesEnabled",
        type: "checkbox",
        label: getText("settings.setting.responsesEnabled.name"),
        description: getText("settings.setting.responsesEnabled.desc"),
        setElementValue: () => this.settings?.responsesEnabled ?? true,
        setSettingValue: (val) => (this.settings.responsesEnabled = val)
      },
      {
        id: "charTalkEnabled",
        type: "checkbox",
        label: getText("settings.setting.chartalk_enabled.name"),
        description: getText("settings.setting.chartalk_enabled.desc"),
        setElementValue: () => this.settings?.CharTalkEnabled ?? true,
        setSettingValue: (val) => (this.settings.CharTalkEnabled = val)
      },
      {
        id: "doMessageInterruption",
        type: "checkbox",
        label: getText("settings.setting.interruption_enabled.name"),
        description: getText("settings.setting.interruption_enabled.desc"),
        setElementValue: () => this.settings?.doMessageInterruption ?? true,
        setSettingValue: (val) => (this.settings.doMessageInterruption = val)
      },
      {
        id: "doLeaveMessage",
        type: "checkbox",
        label: getText("settings.setting.leave_message_enabled.name"),
        description: getText("settings.setting.leave_message_enabled.desc"),
        setElementValue: () => this.settings?.doLeaveMessage ?? true,
        setSettingValue: (val) => (this.settings.doLeaveMessage = val)
      },
      /* {
        id: "doAddMoansOnHighArousal",
        type: "checkbox",
        label: getText("settings.setting.doAddMoansOnHighArousal.name"),
        description: getText("settings.setting.doAddMoansOnHighArousal.desc"),
        setElementValue: () => this.settings?.doAddMoansOnHighArousal ?? true,
        setSettingValue: (val) => (this.settings.doAddMoansOnHighArousal = val)
      }, */
      {
        id: "doPreventMessageIfBcxBlock",
        type: "checkbox",
        label: getText("settings.setting.doPreventMessageIfBcxBlock.name"),
        description: getText("settings.setting.doPreventMessageIfBcxBlock.desc"),
        setElementValue: () => this.settings?.doPreventMessageIfBcxBlock ?? false,
        setSettingValue: (val) => (this.settings.doPreventMessageIfBcxBlock = val)
      },
      {
        id: "doShowNewVersionMessage",
        type: "checkbox",
        label: getText("settings.setting.new_version_message_enabled.name"),
        description: getText("settings.setting.new_version_message_enabled.desc"),
        setElementValue: () => this.settings?.doShowNewVersionMessage ?? true,
        setSettingValue: (val) => (this.settings.doShowNewVersionMessage = val)
      }
    ]];
  }

  load(): void {
    super.load();
  }
}
