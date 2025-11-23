import { Logger } from 'bc-deeplib/deeplib';

//messageTimer
export const MT = {
  CHANGELOG: 30,
  INFO: 15,
  COMMANDS: 20
};

export const CMD_BCR = 'bcr';
export const CMD_TOGGLE = 'toggle';
export const CMD_CHANGELOG = 'changelog';
export const CMD_VERSION = 'version';
export const CMD_DEBUG_DATA = 'debug-data';

export const ModName = 'Responsive';
export const MOD_VERSION_CAPTION = IS_DEVEL ? `${MOD_VERSION} - ${VERSION_HASH}` : MOD_VERSION;
export const ModRepository = 'https://github.com/dDeepLb/BC-Responsive';

export const DebugMode = false;

export const logger = new Logger(ModName);