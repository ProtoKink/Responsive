import { modStorage } from './data';
import { ModName } from './definition';

export const doesBcxAllowsTalking = () => {
  if (!window.bcx) return true;

  const isRuleWorking = (ruleName: string) => {
    const rule = window.bcx?.getModApi(ModName).getRuleState(ruleName);
    if (!rule) return false;

    switch (ruleName) {
      case 'speech_forbid_open_talking':
        return rule.inEffect && rule.isEnforced;
      case 'speech_limit_open_talking':
        return rule.inEffect && rule.isEnforced;
      case 'speech_specific_sound':
        return rule.inEffect && rule.isEnforced && rule.customData.soundWhitelist;
      case 'speech_mandatory_words':
        return rule.inEffect && rule.isEnforced && rule.customData.mandatoryWords;
      default:
        break;
    }
  };

  if (
    modStorage.playerStorage.GlobalModule.doPreventMessageIfBcxBlock &&
    (isRuleWorking('speech_forbid_open_talking') ||
      isRuleWorking('speech_limit_open_talking') ||
      isRuleWorking('speech_specific_sound') ||
      isRuleWorking('speech_mandatory_words'))
  ) {
    return false;
  }
  return true;
};
