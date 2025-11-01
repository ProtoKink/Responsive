import { sendLocalMessage } from "bc-deeplib/deeplib";
import { PlayerStorage } from "./data";
import { CMD_BCR, MT } from "./definition";
import { BCR_CHANGELOG, BCR_CMDS, BCR_TOGGLE_DISABLED, BCR_TOGGLE_ENABLED, BCR_VERSION_MSG } from "./messages";

export function loadCommands() {
  CommandCombine({
    Tag: CMD_BCR,
    Description: ": To open the Responsive commands overview.",
    Action: (args: string, command: string, parsed: string[]) => {
      switch (args) {
        case "toggle":
          const data = PlayerStorage().GlobalModule;
          data.modEnabled = !data.modEnabled;
          if (data.modEnabled) {
            sendLocalMessage("bcr_toggle_enb", BCR_TOGGLE_ENABLED, MT.INFO);
          }
          if (!data.modEnabled) {
            sendLocalMessage("bcr_toggle_dis", BCR_TOGGLE_DISABLED, MT.INFO);
          }
          break;

        case "changelog":
          sendLocalMessage("bcr_clog", BCR_CHANGELOG);
          break;

        case "version":
          sendLocalMessage("bcr_ver", BCR_VERSION_MSG, MT.INFO);
          break;

        case "debug-data":
          navigator.clipboard.writeText(LZString.compressToBase64(JSON.stringify(Player.Responsive)));
          break;

        default:
          sendLocalMessage("bcr_cmds", BCR_CMDS, MT.COMMANDS);
          break;
      }
    }
  });
}
