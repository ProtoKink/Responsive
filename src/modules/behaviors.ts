import { BaseModule, Subscreen, exportToGlobal, getModule, sdk } from 'bc-deeplib/deeplib';
import { areBehaviorsEnabled } from '../utilities/handlers';
import { Behavior, BehaviorsSettingsModel, Reaction, Trigger, MessageData, TriggerType, TriggerOrgasmType, BehaviorInput, TriggerInput, ReactionInput, SpeechType, applyBehaviorDefaults, applyTriggerDefaults, applyReactionDefaults } from '../models/behaviors';
import { GuiBehaviors } from '../screens/behaviors';
import { HookPriority, ModuleCategory } from '../utilities/sdk';
import { collectTriggers, hasTriggerRank, triggerRank } from '../utilities/triggers';
import { processReactions } from '../utilities/reactions';
import { DebugStorage } from '../utilities/debugStorage';

const orgasmTypesFromMessage = (msg: string): TriggerOrgasmType | undefined => {
	switch (true) {
		case msg.includes('OrgasmFailResist'): return 'ruinedResisted';
		case msg.includes('OrgasmFailTimeout'): return 'ruinedTimeout';
		case msg.includes('OrgasmFailSurrender'): return 'ruinedSurrendered';
		case msg.includes('OrgasmResist'): return 'resisted';
		case msg.includes('Orgasm'): return 'normal';
	}

	return undefined;
};

export class BehaviorsModule extends BaseModule {
	static instance: BehaviorsModule;

	leashedLeave: boolean = false;
	behaviorExecutionMap: Map<string, number> = new Map();
	activeRankedKeys: Partial<Record<TriggerType, string | undefined>> = {};

	get settings(): BehaviorsSettingsModel {
		return super.settings as BehaviorsSettingsModel;
	}

	set settings(val: BehaviorsSettingsModel) {
		super.settings = val;
	}

	get settingsScreen(): Subscreen | null {
		return GuiBehaviors;
	}

	get defaultSettings() {
		return <BehaviorsSettingsModel>{
			behaviors: {},
			reactions: {},
			triggers: {}
		};
	}

	load(): void {
		super.load();
		BehaviorsModule.instance = this;

		ChatRoomRegisterMessageHandler({
			Description: 'Processes activity responses',
			Priority: 320,
			Callback: (data, sender, msg, metadata) => {
				if (!areBehaviorsEnabled()) return false;
				if (!['Activity', 'Emote', 'Action', 'Chat', 'Whisper'].includes(data.Type)) return false;
				if (!metadata) return false;

				let type: TriggerType = data.Type.toLowerCase() as TriggerType;
				let orgasmType: TriggerOrgasmType | undefined = undefined;
				let speechType: SpeechType | undefined = undefined;

				if (data.Type === 'Chat' || data.Type === 'Whisper') {
					type = 'speech';
					speechType = data.Type === 'Chat' ? 'normal' : 'whisper';
				}

				if (data.Type === 'Activity' && data.Content.startsWith('Orgasm')) {
					type = 'orgasm';
					orgasmType = orgasmTypesFromMessage(data.Content);
				}

				const messageData: MessageData = {
					source: sender,
					target: metadata.TargetCharacter,
					messageContent: data.Content,
					message: msg,
					activityName: metadata.ActivityName,
					groupName: metadata.GroupName as AssetGroupItemName,
					orgasmType,
					speechType,
				};

				BehaviorsModule.processBehavior(type, messageData);

				return false;
			}
		});

		sdk.hookFunction(
			'ServerAccountBeep',
			HookPriority.AddBehavior,
			(args, next) => {
				if (!areBehaviorsEnabled()) return next(args);
				const data = args[0];

				if (!data) return next(args);
				if (data.BeepType !== 'Leash') return next(args);
				if (!data.ChatRoomName) return next(args);
				if (!ChatRoomData) return next(args);
				if (!Player.OnlineSharedSettings?.AllowPlayerLeashing) return next(args);

				this.leashedLeave = true;

				const messageData: MessageData = {
					messageContent: data.Message,
					message: data.Message,
					roomPrecenseEvent: 'leashed'
				};
				BehaviorsModule.processBehavior('roomPresence', messageData);

				next(args);
			},
			ModuleCategory.Global
		);

		sdk.hookFunction(
			'ChatRoomSync',
			HookPriority.AddBehavior,
			(args, next) => {
				this.leashedLeave = false;
				if (!areBehaviorsEnabled()) return next(args);

				const shouldProcess = !ServerPlayerIsInChatRoom() && RelogData?.ChatRoomName !== args[0].Name;
				const ret = next(args);

				if (shouldProcess)
					BehaviorsModule.processBehavior('roomPresence', {
						source: Player,
						roomPrecenseEvent: 'join',
					});

				return ret;
			},
			ModuleCategory.Global
		);

		sdk.hookFunction(
			'ServerSend',
			HookPriority.AddBehavior,
			(args, next) => {
				if (!areBehaviorsEnabled()) return next(args);
				if (!ServerPlayerIsInChatRoom()) return next(args);
				if (args[0] !== 'ChatRoomLeave') return next(args);
				if (this.leashedLeave) return next(args);

				BehaviorsModule.processBehavior('roomPresence', {
					roomPrecenseEvent: 'leave',
					source: Player,
				});

				return next(args);
			},
			ModuleCategory.Global
		);

		sdk.hookFunction(
			'ChatRoomSyncMemberJoin',
			HookPriority.AddBehavior,
			(args, next) => {
				if (!areBehaviorsEnabled()) return next(args);
				if (!ServerPlayerIsInChatRoom()) return next(args);

				const ret = next(args);

				const character = ChatRoomGetCharacter(args[0].SourceMemberNumber);

				if (!character) return ret;

				BehaviorsModule.processBehavior('roomPresence', {
					roomPrecenseEvent: 'join',
					source: character,
				});

				return ret;
			},
			ModuleCategory.Global
		);

		sdk.hookFunction(
			'ChatRoomSyncMemberLeave',
			HookPriority.AddBehavior,
			(args, next) => {
				if (!areBehaviorsEnabled()) return next(args);
				if (!ServerPlayerIsInChatRoom()) return next(args);

				const character = ChatRoomGetCharacter(args[0].SourceMemberNumber);

				if (!character) return next(args);

				BehaviorsModule.processBehavior('roomPresence', {
					roomPrecenseEvent: 'leave',
					source: character,
				});

				return next(args);
			},
			ModuleCategory.Global
		);

		sdk.hookFunction(
			'ActivityProgressCharacter',
			HookPriority.Observe,
			(args, next) => {
				if (!areBehaviorsEnabled()) return next(args);
				if (!ServerPlayerIsInChatRoom()) return next(args);

				const ret = next(args);
				BehaviorsModule.handleArousalTick(args[0]);
				return ret;
			},
			ModuleCategory.Global
		);

		sdk.hookFunction(
			'ActivityDecayCharacter',
			HookPriority.Observe,
			(args, next) => {
				if (!areBehaviorsEnabled()) return next(args);
				if (!ServerPlayerIsInChatRoom()) return next(args);

				const ret = next(args);
				BehaviorsModule.handleArousalTick(args[0]);
				return ret;
			},
			ModuleCategory.Global
		);
	}

	getBehavior(id: string): Behavior | undefined {
		return this.settings.behaviors[id];
	}

	getTrigger(id: string): Trigger | undefined {
		return this.settings.triggers[id];
	}

	getReaction(id: string): Reaction | undefined {
		return this.settings.reactions[id];
	}

	static createBehavior(behavior: BehaviorInput): Behavior {
		return applyBehaviorDefaults(behavior);
	}

	static createTrigger(trigger: TriggerInput): Trigger {
		return applyTriggerDefaults(trigger);
	}

	static createReaction(reaction: ReactionInput): Reaction {
		return applyReactionDefaults(reaction);
	}

	static clearDebugHistory(): void {
		DebugStorage.clearHistory();
	}

	static deleteBehavior(id: string): void {
		delete BehaviorsModule.instance.settings.behaviors[id];
	}

	static deleteTrigger(id: string): void {
		delete BehaviorsModule.instance.settings.triggers[id];
    
		Object.values(BehaviorsModule.instance.settings.behaviors).forEach(behavior => {
			const index = behavior.triggers.indexOf(id);
			if (index > -1) {
				behavior.triggers.splice(index, 1);
			}
		});
	}

	static deleteReaction(id: string): void {
		delete BehaviorsModule.instance.settings.reactions[id];
    
		Object.values(BehaviorsModule.instance.settings.behaviors).forEach(behavior => {
			const index = behavior.reactions.indexOf(id);
			if (index > -1) {
				behavior.reactions.splice(index, 1);
			}
		});
	}

	static handleArousalTick(character: Character | undefined): void {
		if (!areBehaviorsEnabled()) return;
		if (!character || character.MemberNumber !== Player.MemberNumber) return;
		BehaviorsModule.processBehavior('arousal', { source: character });
	}

	static processBehavior(type: TriggerType, messageData: MessageData): Behavior | undefined {
		const matches = collectTriggers(type, messageData);
		if (hasTriggerRank(type)) return BehaviorsModule.runTopRanked(type, matches, messageData);

		const match = matches[0];
		if (!match) return undefined;
		return BehaviorsModule.runBehavior(match.behavior, match.trigger, messageData);
	}

	private static runTopRanked(type: TriggerType, matches: ReturnType<typeof collectTriggers>, messageData: MessageData): Behavior | undefined {
		const active = BehaviorsModule.instance.activeRankedKeys ??= {};
		let maxRank = -1;
		const top: { behavior: Behavior; trigger: Trigger }[] = [];

		for (const match of matches) {
			const rank = triggerRank(match.trigger);
			if (rank > maxRank) {
				maxRank = rank;
				top.length = 0;
				top.push(match);
			} else if (rank === maxRank) {
				top.push(match);
			}
		}

		// signature of the active ranked triggers. sorted so match order does not matter, joined with a null byte so different id sets cannot collide
		const key = top.length ? top.map(match => match.trigger.id).sort().join('\0') : undefined;
		if (active[type] === key) return undefined;
		active[type] = key;
		if (!key) return undefined;

		let last: Behavior | undefined;
		for (const match of top) {
			last = BehaviorsModule.runBehavior(match.behavior, match.trigger, messageData);
		}
		return last;
	}

	private static runBehavior(behavior: Behavior, trigger: Trigger, messageData: MessageData): Behavior {
		const reactions = behavior.reactions
			.map(r => BehaviorsModule.instance.getReaction(r))
			.filter(r => r !== undefined)
			.map(r => hasTriggerRank(trigger.type) && r.type === 'animation' ? { ...r, interrupt: true } : r);

		const reactionResult = processReactions(reactions, behavior.reactionMode, messageData);

		DebugStorage.addEntry({
			timestamp: Date.now(),
			behaviorId: behavior.id,
			triggerId: trigger.id,
			reactionIds: reactionResult.executedReactionIds,
			triggerType: trigger.type,
			messageData: {
				sourceMemberNumber: messageData.source?.MemberNumber,
				targetMemberNumber: messageData.target?.MemberNumber,
				messageContent: messageData.messageContent,
				activityName: messageData.activityName,
				groupName: messageData.groupName,
				orgasmType: messageData.orgasmType,
				roomPrecenseEvent: messageData.roomPrecenseEvent,
				speechType: messageData.speechType,
			}
		});

		if (reactionResult.success && behavior.cooldownSec && !hasTriggerRank(trigger.type)) {
			BehaviorsModule.instance.behaviorExecutionMap.set(behavior.id, CommonTime());
		}

		return behavior;
	}
}

exportToGlobal('BehaviorsModule', BehaviorsModule);
exportToGlobal('getModule', getModule);