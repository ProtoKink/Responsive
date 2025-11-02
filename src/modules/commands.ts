import { BaseModule, modStorage, sendLocalMessage } from "bc-deeplib/deeplib";
import { PlayerStorage } from "../utilities/data";
import { CMD_BCR, CMD_CHANGELOG, CMD_DEBUG_DATA, CMD_TOGGLE, CMD_VERSION, MT } from "../utilities/definition";
import { BCR_TOGGLE_ENABLED, BCR_TOGGLE_DISABLED, BCR_CHANGELOG, BCR_VERSION_MSG, BCR_CMDS } from "../utilities/messages";

export class CommandsModule extends BaseModule {
  load(): void {
    CommandCombine({
      Tag: CMD_BCR,
      Description: ": To open the Responsive commands overview.",
      Action: () => {
        sendLocalMessage("bcr_cmds", BCR_CMDS, MT.COMMANDS)
      },
      Subcommands: [
        {
          Tag: CMD_TOGGLE,
          Description: ": To toggle the Responsive mod.",
          Action: () => {
            const data = PlayerStorage().GlobalModule;
            data.modEnabled = !data.modEnabled;
            if (data.modEnabled) {
              sendLocalMessage("bcr_toggle_enb", BCR_TOGGLE_ENABLED, MT.INFO);
            }
            if (!data.modEnabled) {
              sendLocalMessage("bcr_toggle_dis", BCR_TOGGLE_DISABLED, MT.INFO);
            }
          }
        },
        {
          Tag: CMD_CHANGELOG,
          Description: ": To open the Responsive changelog.",
          Action: () => {
            sendLocalMessage("bcr_clog", BCR_CHANGELOG);
          }
        },
        {
          Tag: CMD_VERSION,
          Description: ": To open the Responsive version.",
          Action: () => {
            sendLocalMessage("bcr_ver", BCR_VERSION_MSG, MT.INFO);
          }
        },
        {
          Tag: CMD_DEBUG_DATA,
          Description: ": To copy the Responsive debug data.",
          Action: () => {
            navigator.clipboard.writeText(LZString.compressToBase64(JSON.stringify(modStorage.extensionStorage)));
          }
        }
      ]
    });
  }
}
