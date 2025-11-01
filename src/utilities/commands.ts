import { PlayerStorage } from "./data";
import { CMD_BCR, MT } from "./definition";
import { BCR_CHANGELOG, BCR_CMDS, BCR_TOGGLE_DISABLED, BCR_TOGGLE_ENABLED, BCR_VERSION_MSG, sendLocalSmart } from "./messages";

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
            sendLocalSmart("bcr_toggle_enb", BCR_TOGGLE_ENABLED, MT.INFO);
          }
          if (!data.modEnabled) {
            sendLocalSmart("bcr_toggle_dis", BCR_TOGGLE_DISABLED, MT.INFO);
          }
          break;

        case "changelog":
          sendLocalSmart("bcr_clog", BCR_CHANGELOG);
          break;

        case "version":
          sendLocalSmart("bcr_ver", BCR_VERSION_MSG, MT.INFO);
          break;

        case "debug-data":
          navigator.clipboard.writeText(LZString.compressToBase64(JSON.stringify(Player.Responsive)));
          break;

        default:
          sendLocalSmart("bcr_cmds", BCR_CMDS, MT.COMMANDS);
          break;
      }
    }
  });
}
