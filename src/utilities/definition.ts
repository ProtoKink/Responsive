import { Logger } from 'bc-deeplib/deeplib';
import { GlobalModule } from '../modules/global';
import { BehaviorsModule } from '../modules/behaviors';
import { CharTalkModule } from '../modules/char_talk';
import { ProfilesModule } from '../modules/profiles';
import { CommandsModule } from '../modules/commands';

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
export const ModRepository = 'https://github.com/dDeepLb/BC-Responsive';

export const DebugMode = false;

export const logger = new Logger(ModName);

declare module 'bc-deeplib/deeplib' {
  interface ModulesList { 
    GlobalModule: GlobalModule;
    BehaviorsModule: BehaviorsModule;
    ProfilesModule: ProfilesModule;
    CharTalkModule: CharTalkModule;
    CommandsModule: CommandsModule;
  }
}