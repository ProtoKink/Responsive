import { modLogger, sendActionMessage } from 'bc-deeplib/deeplib';
import { MessageData, MessageDataSchema, Reaction, ReactionMode, ReactionModeSchema, ReactionSchema } from '../models/behaviors';
import { chatRoomAutoInterceptMessage, randomResponse, replaceTemplate } from './chat_messages';
import { assertNever, getRandomInt } from './other';
import { doesBcxAllowsTalking } from './handlers';
import z from 'zod';

export function processReactions(reactions: Reaction[], reactionMode: ReactionMode, messageData: MessageData): boolean {
  try {
    reactions = z.array(ReactionSchema).parse(reactions);
    reactionMode = ReactionModeSchema.parse(reactionMode);
    messageData = MessageDataSchema.parse(messageData) as MessageData;
  } catch (e) {
    modLogger.error(e);
    return false;
  }

  switch (reactionMode) {
    case 'random': {
      const reaction = reactions[getRandomInt(reactions.length)];

      return processReaction(reaction, messageData);
    }
    case 'all':
      return reactions.every(r => processReaction(r, messageData));

    default:
      assertNever(reactionMode);
  }
}

function processReaction(reaction: Reaction, messageData: MessageData): boolean {
  try {
    reaction = ReactionSchema.parse(reaction);
    messageData = MessageDataSchema.parse(messageData) as MessageData;
  } catch (e) {
    modLogger.error(e);
    return false;
  }

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
    default:
      assertNever(reaction);
  }
}