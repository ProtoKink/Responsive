import { BaseModule, Subscreen, exportToGlobal, getModule, sdk } from 'bc-deeplib/deeplib';
import { areBehaviorsEnabled } from '../utilities/handlers';
import { modStorage } from '../utilities/data';
import { Behavior, BehaviorsSettingsModel, Reaction, Trigger, MessageData, TriggerType, TriggerOrgasmType, BehaviorInput, TriggerInput, ReactionInput, SpeechType, TriggerButton, applyBehaviorDefaults, applyTriggerDefaults, applyReactionDefaults } from '../models/behaviors';
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

const selec = Object.freeze({
	chatRoomButtonsId: 'rsp-chatroom-buttons',
});

const CHAT_ROOM_BUTTON_POSITION_KEY = 'CHAT_ROOM_BUTTON_POSITION';
const CHAT_ROOM_BUTTON_SIZE = 64;
const CHAT_ROOM_BUTTON_DRAG_THRESHOLD = 6;

type ChatRoomButtonAnchor = { x: number; y: number };
type ChatRoomButtonDrag = {
	pointerId: number;
	originX: number;
	originY: number;
	startLeft: number;
	startTop: number;
	moved: boolean;
};

export class BehaviorsModule extends BaseModule {
	static instance: BehaviorsModule;

	private leashedLeave: boolean = false;
	behaviorExecutionMap: Map<string, number> = new Map();
	private static chatRoomButtonDrag: ChatRoomButtonDrag | null = null;
	private static suppressChatRoomButtonToggle = false;
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

		sdk.hookFunction(
			'ChatRoomLoad',
			HookPriority.Observe,
			async (args, next) => {
				const ret = await next(args);
				BehaviorsModule.syncChatRoomButtons();
				return ret;
			},
			ModuleCategory.Global
		);

		sdk.hookFunction(
			'ChatRoomResize',
			HookPriority.Observe,
			(args, next) => {
				const ret = next(args);
				BehaviorsModule.positionChatRoomButtons();
				return ret;
			},
			ModuleCategory.Global
		);

		sdk.hookFunction(
			'ChatRoomUnload',
			HookPriority.Observe,
			(args, next) => {
				BehaviorsModule.clearChatRoomButtons();
				return next(args);
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

	static syncChatRoomButtons(): void {
		BehaviorsModule.clearChatRoomButtons();
		if (!areBehaviorsEnabled()) return;

		const triggers = BehaviorsModule.chatRoomButtonTriggers();
		if (triggers.length === 0) return;

		const buttons = triggers.map(trigger => {
			return ElementButton.Create(
				`rsp-chatroom-button-${trigger.id}`,
				() => {
					BehaviorsModule.processBehavior('button', {
						buttonId: trigger.id,
						source: Player,
					});
				},
				{
					label: trigger.name,
					role: 'menuitem',
					labelPosition: 'left'
				},
				{
					button: {
						classList: ['rsp-chatroom-button'],
					},
				}
			);
		});

		const columns = CommonClamp(triggers.length, 1, 3);
		const buttonMenu = ElementMenu.Create(
			null,
			buttons,
			{ role: 'menu' },
			{
				menu: {
					classList: ['rsp-chatroom-button-grid'],
					style: { '--rsp-button-columns': String(columns) },
				},
			}
		);

		const mainButton = ElementButton.Create(
			null,
			function (this: HTMLButtonElement, ev: PointerEvent) {
				if (BehaviorsModule.suppressChatRoomButtonToggle) {
					BehaviorsModule.suppressChatRoomButtonToggle = false;
					ev.preventDefault();
					ev.stopPropagation();
					return;
				}
				const open = this.getAttribute('aria-expanded') !== 'true';
				this.setAttribute('aria-expanded', String(open));
				buttonMenu.toggleAttribute('data-open', open);
				BehaviorsModule.layoutChatRoomButtonGrid();
			},
			{
				image: 'Icons/Arousal.png',
				ariaHasPopup: 'menu',
				ariaExpanded: 'false',
			},
			{
				button: {
					classList: ['rsp-chatroom-button-main'],
				},
			}
		);

		ElementCreate({
			tag: 'div',
			attributes: { id: selec.chatRoomButtonsId },
			classList: ['rsp-chatroom-buttons'],
			children: [mainButton, buttonMenu],
			parent: document.body,
		});
		
		mainButton.addEventListener('pointerdown', BehaviorsModule.onMenuPointerDown);
		document.addEventListener('pointermove', BehaviorsModule.onMenuPointerMove);
		document.addEventListener('pointerup', BehaviorsModule.onMenuPointerUp);
	}

	static positionChatRoomButtons(): void {
		const menu = ElementWrap(selec.chatRoomButtonsId);
		if (!menu) return;
		const canvasSize = CHAT_ROOM_BUTTON_SIZE;

		const maxX = Math.max(0, window.innerWidth - canvasSize);
		const maxY = Math.max(0, window.innerHeight - canvasSize);
		const anchor = BehaviorsModule.readMenuAnchor() ?? {
			x: maxX === 0 ? 0 : Math.min(1, 16 / maxX),
			y: maxY === 0 ? 0 : Math.min(1, 80 / maxY),
		};
		BehaviorsModule.placeMenu(menu, anchor.x * maxX, anchor.y * maxY);
	}

	static layoutChatRoomButtonGrid(): void {
		const menu = ElementWrap(selec.chatRoomButtonsId);
		const grid = menu?.querySelector<HTMLElement>('.rsp-chatroom-button-grid');
		if (!menu || !grid) return;

		const rect = menu.getBoundingClientRect();
		const spaceRight = window.innerWidth - rect.left;
		const spaceLeft = rect.right;
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;
		const alignStart = spaceRight >= spaceLeft;
		const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;
		grid.classList.toggle('align-start', alignStart);
		grid.classList.toggle('open-up', openUp);
		grid.style.setProperty('--rsp-grid-max-width', `${Math.max(120, (alignStart ? spaceRight : spaceLeft) - 8)}px`);
		grid.style.setProperty('--rsp-grid-max-height', `${Math.max(80, (openUp ? spaceAbove : spaceBelow) - 12)}px`);
	}

	static closeChatRoomButtonMenu(): void {
		const menu = ElementWrap(selec.chatRoomButtonsId);
		const mainButton = menu?.querySelector<HTMLButtonElement>('.rsp-chatroom-button-main');
		mainButton?.setAttribute('aria-expanded', 'false');
		menu?.querySelector('.rsp-chatroom-button-grid')?.removeAttribute('data-open');
	}

	static clearChatRoomButtons(): void {
		document.removeEventListener('pointermove', BehaviorsModule.onMenuPointerMove);
		document.removeEventListener('pointerup', BehaviorsModule.onMenuPointerUp);
		BehaviorsModule.chatRoomButtonDrag = null;
		ElementRemove(selec.chatRoomButtonsId);
	}

	private static placeMenu(menu: HTMLElement, left: number, top: number): void {
		const canvasSize = CHAT_ROOM_BUTTON_SIZE;
		const maxX = Math.max(0, window.innerWidth - canvasSize);
		const maxY = Math.max(0, window.innerHeight - canvasSize);
		const x = CommonClamp(left, 0, maxX);
		const y = CommonClamp(top, 0, maxY);
		menu.style.left = `${x}px`;
		menu.style.top = `${y}px`;
		menu.style.width = `${canvasSize}px`;
		menu.style.height = `${canvasSize}px`;
		BehaviorsModule.layoutChatRoomButtonGrid();
	}

	private static readMenuAnchor(): ChatRoomButtonAnchor | null {
		const stored = modStorage.getLocalStorage(CHAT_ROOM_BUTTON_POSITION_KEY) as Partial<ChatRoomButtonAnchor> | null;
		if (!stored || typeof stored.x !== 'number' || typeof stored.y !== 'number') return null;
		if (!Number.isFinite(stored.x) || !Number.isFinite(stored.y)) return null;
		return {
			x: CommonClamp(stored.x, 0, 1),
			y: CommonClamp(stored.y, 0, 1),
		};
	}

	private static rememberMenuAnchor(left: number, top: number): void {
		const canvasSize = CHAT_ROOM_BUTTON_SIZE;
		const maxX = Math.max(0, window.innerWidth - canvasSize);
		const maxY = Math.max(0, window.innerHeight - canvasSize);
		modStorage.setLocalStorage(CHAT_ROOM_BUTTON_POSITION_KEY, {
			x: maxX === 0 ? 0 : CommonClamp(left, 0, maxX) / maxX,
			y: maxY === 0 ? 0 : CommonClamp(top, 0, maxY) / maxY,
		});
	}

	private static onMenuPointerDown = (ev: PointerEvent): void => {
		if (ev.button !== 0) return;
		const menu = ElementWrap(selec.chatRoomButtonsId);
		const mainButton = menu?.querySelector<HTMLButtonElement>('.rsp-chatroom-button-main');
		if (!menu || !mainButton) return;
		const target = ev.target;
		if (!(target instanceof Node) || !mainButton.contains(target)) return;
		if (target instanceof Element && target.closest('.rsp-chatroom-button-grid')) return;

		const rect = menu.getBoundingClientRect();
		BehaviorsModule.chatRoomButtonDrag = {
			pointerId: ev.pointerId,
			originX: ev.clientX,
			originY: ev.clientY,
			startLeft: rect.left,
			startTop: rect.top,
			moved: false,
		};
		mainButton.setPointerCapture(ev.pointerId);
	};

	private static onMenuPointerMove = (ev: PointerEvent): void => {
		const drag = BehaviorsModule.chatRoomButtonDrag;
		if (!drag || ev.pointerId !== drag.pointerId) return;
		const menu = ElementWrap(selec.chatRoomButtonsId);
		if (!menu) return;

		const dx = ev.clientX - drag.originX;
		const dy = ev.clientY - drag.originY;
		if (!drag.moved && Math.hypot(dx, dy) < CHAT_ROOM_BUTTON_DRAG_THRESHOLD) return;
		drag.moved = true;
		BehaviorsModule.suppressChatRoomButtonToggle = true;
		menu.setAttribute('data-dragging', '');
		BehaviorsModule.placeMenu(menu, drag.startLeft + dx, drag.startTop + dy);
	};

	private static onMenuPointerUp = (ev: PointerEvent): void => {
		const drag = BehaviorsModule.chatRoomButtonDrag;
		if (!drag || ev.pointerId !== drag.pointerId) return;
		BehaviorsModule.chatRoomButtonDrag = null;
		const menu = ElementWrap(selec.chatRoomButtonsId);
		menu?.removeAttribute('data-dragging');
		if (!drag.moved || !menu) return;

		BehaviorsModule.suppressChatRoomButtonToggle = true;
		const rect = menu.getBoundingClientRect();
		BehaviorsModule.rememberMenuAnchor(rect.left, rect.top);
		setTimeout(() => {
			BehaviorsModule.suppressChatRoomButtonToggle = false;
		}, 0);
	};

	private static chatRoomButtonTriggers(): TriggerButton[] {
		const behaviors = Object.values(BehaviorsModule.instance.settings.behaviors ?? {});
		const ids = new Set(behaviors.filter(behavior => behavior.enabled).flatMap(behavior => behavior.triggers));

		return [...ids].flatMap(id => {
			const trigger = BehaviorsModule.instance.getTrigger(id);
			return trigger?.type === 'button' ? [trigger] : [];
		});
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
				buttonId: messageData.buttonId,
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