import { BaseSettingsModel } from 'bc-deeplib/deeplib';

export type GlobalSettingsModel = BaseSettingsModel & {
  modEnabled: boolean;
  responsesEnabled: boolean;
  CharTalkEnabled: boolean;
  doShowNewVersionMessage: boolean;
  doLeaveMessage: boolean;
  doAddMoansOnHighArousal: boolean;
  doPreventMessageIfBcxBlock: boolean;
  doMessageInterruption: boolean;
};
