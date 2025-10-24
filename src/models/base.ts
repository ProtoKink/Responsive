export type BaseSettingsModel = {
  ResponsiveEnabled: boolean;
};

export type GlobalSettingsModel = BaseSettingsModel & {
  responsesEnabled: boolean;
  CharTalkEnabled: boolean;
  doShowNewVersionMessage: boolean;
  doLeaveMessage: boolean;
  doAddMoansOnHighArousal: boolean;
  doPreventMessageIfBcxBlock: boolean;
  doMessageInterruption: boolean;
};
