import { sendActionMessage } from 'bc-deeplib/deeplib';
import { MessageData, Reaction, ReactionMode } from '../models/behaviors';
import { chatRoomAutoInterceptMessage, randomResponse, replaceTemplate } from './chat_messages';
import { assertNever, getRandomInt } from './other';
import { doesBcxAllowsTalking } from './handlers';

export function processReactions(reactions: Reaction[], reactionMode: ReactionMode, messageData: MessageData) {
  switch (reactionMode) {
    case 'random': {
      const reaction = reactions[getRandomInt(reactions.length)];

      processReaction(reaction, messageData);
      break;
    }
    case 'all':
      reactions.forEach(r => processReaction(r, messageData));
      break;

    default:
      assertNever(reactionMode);
  }
}

function processReaction(reaction: Reaction, messageData: MessageData) {
  switch (reaction.type) {
    case 'speech': {
      if (!doesBcxAllowsTalking()) return;
      const response = randomResponse(reaction.content);
      const templatedResponse = replaceTemplate(response, messageData.source).trim();
      chatRoomAutoInterceptMessage(templatedResponse);

      break;
    }
    case 'emote': {
      const response = randomResponse(reaction.content);
      ChatRoomSendEmote(response);

      break;
    }
    case 'action': {
      const response = randomResponse(reaction.content);
      sendActionMessage(response);

      break;
    }
    case 'activity': {
      const activity = AssetGetActivity('Female3DCG', reaction.activityName);
      const group = AssetGroupGet('Female3DCG', reaction.groupName as AssetGroupItemName);
      const character = messageData.source;

      if (!activity || !group || !character) return;

      ActivityRun(Player, character, group, { Activity: activity, Group: group.Name });

      break;
    }

    default:
      assertNever(reaction);
  }
}