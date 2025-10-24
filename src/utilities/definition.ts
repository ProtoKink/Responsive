//messageTimer
export const MT = {
  CHANGELOG: 30,
  INFO: 15,
  COMMANDS: 20
};

const cmdKeyword = 'bcr';
export const CMD_BCR = cmdKeyword;
export const CMD_TOGGLE = `${cmdKeyword} toggle`;
export const CMD_CHANGELOG = `${cmdKeyword} changelog`;
export const CMD_VERSION = `${cmdKeyword} version`;
export const CMD_DEBUG_DATA = `${cmdKeyword} debug-data`;

export const ModName = `Responsive`;
export const FullModName = `Bondage Club Responsive`; //¯\_(⌣̯̀ ⌣́)_/¯
export const MOD_VERSION_CAPTION = IS_DEVEL ? `${MOD_VERSION} - ${VERSION_HASH}` : MOD_VERSION;
export const ModRepository = `https://github.com/dDeepLb/BC-Responsive`;

export const DebugMode = false;
