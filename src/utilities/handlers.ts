import { ResponsesEntryModel } from "../models/responses";
import { ResponsesModule } from "../modules/responses";
import { GuiResponses } from "../screens/responses";
import { activityMessage, leaveMessage, orgasmMessage } from "./chat_messages";
import { PlayerStorage } from "./data";
import { ModName } from "./definition";

const doesBcxAllowsTalking = () => {
  if (!window.bcx) return true;

  const isRuleWorking = (ruleName: string) => {
    const rule = window.bcx?.getModApi(ModName).getRuleState(ruleName);
    if (!rule) return false;

    switch (ruleName) {
      case "speech_forbid_open_talking":
        return rule.inEffect && rule.isEnforced;
      case "speech_limit_open_talking":
        return rule.inEffect && rule.isEnforced;
      case "speech_specific_sound":
        return rule.inEffect && rule.isEnforced && rule.customData.soundWhitelist;
      case "speech_mandatory_words":
        return rule.inEffect && rule.isEnforced && rule.customData.mandatoryWords;
      default:
        break;
    }
  };

  if (
    PlayerStorage().GlobalModule.doPreventMessageIfBcxBlock &&
    (isRuleWorking("speech_forbid_open_talking") ||
      isRuleWorking("speech_limit_open_talking") ||
      isRuleWorking("speech_specific_sound") ||
      isRuleWorking("speech_mandatory_words"))
  ) {
    return false;
  }
  return true;
};

export const orgasmHandle = (c: Character) => {
  if (!PlayerStorage().GlobalModule.modEnabled) return;
  if (!PlayerStorage().GlobalModule.responsesEnabled) return;
  if (CurrentScreen !== "ChatRoom" || !Player) return;
  if (Player.MemberNumber !== c.MemberNumber) return;
  if (!PlayerStorage().ResponsesModule.extraResponses.orgasm) return;
  if (ActivityOrgasmRuined) return;
  if (!doesBcxAllowsTalking()) return;

  ResponsesModule.isOrgasm = true;
  orgasmMessage();
};

export const activityHandle = (dict: ActivityInfo, entry: ResponsesEntryModel) => {
  if (!PlayerStorage().GlobalModule.modEnabled) return;
  if (!PlayerStorage().GlobalModule.responsesEnabled) return;
  if (CurrentScreen !== "ChatRoom" || !Player) return;
  if (dict.targetCharacter.MemberNumber !== Player.MemberNumber) return;
  if (!entry || !entry?.responses) return;
  if (entry.selfTrigger && !GuiResponses.activityCanBeDoneOnSelf(dict.activityName as ActivityName, dict.groupName as AssetGroupItemName)) return;
  if (!entry.selfTrigger && dict.targetCharacter.MemberNumber === dict.sourceCharacter.MemberNumber) return;
  if (!doesBcxAllowsTalking()) return;

  activityMessage(dict, entry);
};

export const leaveHandle = (data: ServerAccountBeepResponse) => {
  if (!PlayerStorage().GlobalModule.modEnabled) return;
  if (!PlayerStorage().GlobalModule.doLeaveMessage) return;
  if (CurrentScreen !== "ChatRoom" || !Player) return;
  if (!(CurrentScreen == "ChatRoom" && ChatRoomData?.Name != data.ChatRoomName)) return;
  if (!doesBcxAllowsTalking()) return;

  leaveMessage();
};
