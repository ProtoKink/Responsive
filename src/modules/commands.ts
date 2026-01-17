import { BaseModule, sendLocalMessage } from 'bc-deeplib/deeplib';
import { CMD_BCR, CMD_CHANGELOG, CMD_DEBUG_DATA, CMD_TOGGLE, CMD_VERSION, MSG_TIMER } from '../utilities/definition';
import { BCR_TOGGLE_ENABLED, BCR_TOGGLE_DISABLED, BCR_CHANGELOG, BCR_VERSION_MSG, BCR_CMDS } from '../utilities/messages';
import { modStorage } from '../utilities/data';

export class CommandsModule extends BaseModule {
  load(): void {
    CommandCombine({
      Tag: CMD_BCR,
      Description: ': To open the Responsive commands overview.',
      Action: () => {
        sendLocalMessage('bcr_cmds', BCR_CMDS, MSG_TIMER.COMMANDS);
      },
      Subcommands: [
        {
          Tag: CMD_TOGGLE,
          Description: ': To toggle the Responsive mod.',
          Action: () => {
            const data = modStorage.playerStorage.GlobalModule;
            data.modEnabled = !data.modEnabled;
            if (data.modEnabled) {
              sendLocalMessage('bcr_toggle_enb', BCR_TOGGLE_ENABLED, MSG_TIMER.INFO);
            }
            if (!data.modEnabled) {
              sendLocalMessage('bcr_toggle_dis', BCR_TOGGLE_DISABLED, MSG_TIMER.INFO);
            }
          }
        },
        {
          Tag: CMD_CHANGELOG,
          Description: ': To open the Responsive changelog.',
          Action: () => {
            sendLocalMessage('bcr_clog', BCR_CHANGELOG);
          }
        },
        {
          Tag: CMD_VERSION,
          Description: ': To open the Responsive version.',
          Action: () => {
            sendLocalMessage('bcr_ver', BCR_VERSION_MSG, MSG_TIMER.INFO);
          }
        },
        {
          Tag: CMD_DEBUG_DATA,
          Description: ': To copy the Responsive debug data.',
          Action: () => {
            navigator.clipboard.writeText(modStorage.extensionStorage);
          }
        }
      ]
    });
  }
}
