import { sendActionMessage } from 'bc-deeplib/deeplib';
import { MessageData, Reaction, ReactionMode } from '../models/behaviors';
import { AnimatronikkaModule } from '../modules/animatronikka';
import { chatRoomAutoInterceptMessage, randomResponse, replaceTemplate } from './chat_messages';
import { assertNever, getRandomInt } from './other';
import { doesBcxAllowsTalking } from './handlers';

export function processReactions(reactions: Reaction[], reactionMode: ReactionMode, messageData: MessageData): { success: boolean; executedReactionIds: string[] } {
  if (reactions.length === 0) {
    return { success: false, executedReactionIds: [] };
  }
  
  switch (reactionMode) {
    case 'random': {
      const reaction = reactions[getRandomInt(reactions.length)];

      const success = processReaction(reaction, messageData);
      return {
        success,
        executedReactionIds: success ? [reaction.id] : [],
      };
    }
    case 'all':
    {
      const executedReactionIds: string[] = [];
      const success = reactions.every(reaction => {
        const processed = processReaction(reaction, messageData);
        if (processed) executedReactionIds.push(reaction.id);
        return processed;
      });

      return { success, executedReactionIds };
    }

    default:
      assertNever(reactionMode);
  }
}

function processReaction(reaction: Reaction, messageData: MessageData): boolean {
  switch (reaction.type) {
    case 'speech': {
      if (!doesBcxAllowsTalking()) return false;
      const response = randomResponse(reaction.content);
      const templatedResponse = replaceTemplate(response, messageData.source).trim();
      chatRoomAutoInterceptMessage(templatedResponse);

      return true;
    }
    case 'emote': {
      const response = randomResponse(reaction.content);
      const templatedResponse = replaceTemplate(response, messageData.source).trim();
      // add ** to make emote not send player's name
      ChatRoomSendEmote('**' + templatedResponse);

      return true;
    }
    case 'action': {
      const response = randomResponse(reaction.content);
      const templatedResponse = replaceTemplate(response, messageData.source).trim();
      sendActionMessage(templatedResponse);

      return true;
    }
    case 'activity': {
      const activity = AssetGetActivity('Female3DCG', reaction.activityName);
      const group = AssetGroupGet('Female3DCG', reaction.groupName as AssetGroupItemName);
      const character = messageData.source;

      if (!activity || !group || !character) return false;

      if (!ActivityCanBeDone(character, activity.Name, group.Name)) return false;

      ActivityRun(Player, character, group, { Activity: activity, Group: group.Name });

      return true;
    }
    case 'animation': {
      const module = AnimatronikkaModule.instance;
      if (!module || !reaction.animationId) return false;

      const success = module.playAnimation(reaction.animationId, {
        interrupt: reaction.interrupt,
        priority: reaction.priority,
        target: Player,
      });

      return success;
    }
    default:
      assertNever(reaction);
  }
}