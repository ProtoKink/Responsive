import { modLogger } from 'bc-deeplib/deeplib';
import { TriggerConstraint, MessageData, ConstraintMode, TriggerType, Behavior, Trigger, MatchMode, SourceConstraint, TargetConstraint, PlayerConstraint, RoomConstraint, IncludeExcludeRule, ConstraintEntity, ConstraintFieldKey } from '../models/behaviors';
import { BehaviorsModule } from '../modules/behaviors';
import { assertNever } from './other';
import { replaceTemplate } from './chat_messages';

type ConstraintResults = {
	source?: Record<keyof SourceConstraint, boolean>;
	target?: Record<keyof TargetConstraint, boolean>;
	player?: Record<keyof PlayerConstraint, boolean>;
	room?: Record<keyof RoomConstraint, boolean>;
};

type TriggerPredicate = (trigger: Trigger, data: MessageData) => boolean;
type TriggerRank = (trigger: Trigger) => number;

type TriggerPredicatesMap = Map<TriggerType, TriggerPredicate[]>;
/**
 * Map of trigger types to their rank function.
 * Rank is used to determine the best trigger to execute.
 */
type TriggerRanksMap = Map<TriggerType, TriggerRank>;

function matchText(text: string, pattern: string, matchMode: MatchMode): boolean {
	switch (matchMode) {
		case 'startsWith': return text.startsWith(pattern);
		case 'endsWith': return text.endsWith(pattern);
		case 'contains': return text.includes(pattern);
		case 'exact': return pattern === text;
		case 'regex': return new RegExp(pattern, 'i').test(text);
		default:
			assertNever(matchMode);
	}
}

function registerPredicate(types: TriggerType[], predicate: TriggerPredicate): void {
	types.forEach(type => {
		if (!triggerPredicates.has(type)) {
			triggerPredicates.set(type, []);
		}
		triggerPredicates.get(type)!.push(predicate);
	});
}

function registerRank(types: TriggerType[], rank: TriggerRank): void {
	types.forEach(type => triggerRanks.set(type, rank));
}

export function triggerRank(trigger: Trigger): number {
	return triggerRanks.get(trigger.type)?.(trigger) ?? 0;
}

export function hasTriggerRank(type: TriggerType): boolean {
	return triggerRanks.has(type);
}

const messageContentPredicate: TriggerPredicate = (trigger, data) => {
	if (trigger.type !== 'emote' && trigger.type !== 'speech' && trigger.type !== 'action') {
		return false;
	}

	if (!data.message) return false;

	return trigger.content.some(entry => {
		const templatedMessage = replaceTemplate(entry.value, data.target, data.source);
		if (!data.message) return false;
		return matchText(data.message, templatedMessage, entry.matchMode);
	});
};

const speechTypePredicate: TriggerPredicate = (trigger, data) => {
	if (trigger.type !== 'speech') return true;

	if (trigger.speechType === 'any') return true;

	return trigger.speechType === data.speechType;
};

const activityPredicate: TriggerPredicate = (trigger, data) => {
	if (trigger.type !== 'activity') return false;

	if (!data.activityName || !data.groupName) return false;

	return trigger.activityName.includes(data.activityName) &&
    trigger.groupName.includes(data.groupName);
};

const orgasmPredicate: TriggerPredicate = (trigger, data) => {
	if (trigger.type !== 'orgasm') return false;

	if (trigger.orgasmType === 'any') return true;

	return trigger.orgasmType === data.orgasmType;
};

const arousalPredicate: TriggerPredicate = (trigger) => {
	if (trigger.type !== 'arousal') return false;

	return (Player.ArousalSettings?.Progress ?? 0) >= trigger.limit;
};

const roomPresencePredicate: TriggerPredicate = (trigger, data) => {
	if (trigger.type !== 'roomPresence') return false;

	return trigger.event === data.roomPrecenseEvent;
};

const buttonPredicate: TriggerPredicate = (trigger, data) => {
	if (trigger.type !== 'button') return false;

	return trigger.id === data.buttonId;
};

const triggerPredicates: TriggerPredicatesMap = new Map();
const triggerRanks: TriggerRanksMap = new Map();

registerPredicate(['emote', 'speech', 'action'], messageContentPredicate);
registerPredicate(['speech'], speechTypePredicate);
registerPredicate(['activity'], activityPredicate);
registerPredicate(['orgasm'], orgasmPredicate);
registerPredicate(['roomPresence'], roomPresencePredicate);
registerPredicate(['arousal'], arousalPredicate);
registerPredicate(['button'], buttonPredicate);

registerRank(['arousal'], (trigger) => trigger.type === 'arousal' ? trigger.limit : 0);

type ConstraintPrerequisite = (trigger: Trigger) => boolean;

type ConstraintPrerequisiteEntry = {
	keys?: readonly ConstraintFieldKey[];
	predicate: ConstraintPrerequisite;
};

const constraintPrerequisites: Map<ConstraintEntity, ConstraintPrerequisiteEntry[]> = new Map();

function registerConstraintPrerequisite(entity: ConstraintEntity, predicate: ConstraintPrerequisite, keys?: readonly ConstraintFieldKey[]): void {
	let entry = constraintPrerequisites.get(entity);
	if (!entry) {
		entry = [];
		constraintPrerequisites.set(entity, entry);
	}

	entry.push({ keys, predicate });
}

export function isConstraintCompatible(trigger: Trigger, entity: ConstraintEntity, key?: ConstraintFieldKey): boolean {
	const entry = constraintPrerequisites.get(entity);
	if (!entry) return true;
	return entry.every(entry => {
		if (key === undefined) {
			if (entry.keys !== undefined) return true;
			return entry.predicate(trigger);
		}
		if (entry.keys !== undefined && !entry.keys.includes(key)) return true;
		return entry.predicate(trigger);
	});
}

const excludeOnArousal: ConstraintPrerequisite = (trigger) => trigger.type !== 'arousal';
const excludeOnButton: ConstraintPrerequisite = (trigger) => trigger.type !== 'button';

registerConstraintPrerequisite('source', excludeOnButton);
registerConstraintPrerequisite('target', excludeOnButton);

registerConstraintPrerequisite('source', excludeOnArousal);
registerConstraintPrerequisite('target', excludeOnArousal);
registerConstraintPrerequisite('player', excludeOnArousal, ['arousalMin', 'arousalMax']);

function constraintKeys<T extends object>(obj: T): (T extends unknown ? keyof T : never)[] {
	return CommonKeys(obj) as (T extends unknown ? keyof T : never)[];
}

function applicableConstraints(trigger: Trigger): TriggerConstraint | undefined {
	const constraints = trigger.constraints;
	if (!constraints) return undefined;

	const result: TriggerConstraint = {};

	(constraintKeys(constraints)).forEach(entity => {
		if (!isConstraintCompatible(trigger, entity)) return;
		const stored = constraints[entity];
		if (!stored) return;

		const filtered: Record<string, unknown> = {};
		for (const key of constraintKeys(stored)) {
			if (!isConstraintCompatible(trigger, entity, key)) continue;
			const value = (stored as Record<string, unknown>)[key];
			if (value === undefined) continue;
			filtered[key] = value;
		}

		if (CommonKeys(filtered).length > 0) {
			(result as Record<string, unknown>)[entity] = filtered;
		}
	});

	return CommonKeys(result).length > 0 ? result : undefined;
}

function checkTriggerPredicates(trigger: Trigger, data: MessageData): boolean {
	const predicates = triggerPredicates.get(trigger.type);

	if (!predicates || predicates.length === 0) {
		modLogger.warn(`No predicates registered for trigger type: ${trigger.type}`);
		return false;
	}

	return predicates.every(predicate => predicate(trigger, data));
}

function checkMemberNumberRule(rule: IncludeExcludeRule, memberNumber: number): boolean {
	const memberId = memberNumber.toString();
	return rule.entries.some(entry => {
		const matches = entry.value === memberId;
		return entry.mode === 'include' ? matches : !matches;
	});
}

function evaluateCharacterConstraints(
	constraints: SourceConstraint | TargetConstraint | PlayerConstraint,
	char: Character | undefined
): Record<string, boolean> {
	const results: Record<string, boolean> = {};
	const hasChar = char !== undefined;

	if ('memberNumber' in constraints && constraints.memberNumber !== undefined) {
		results.memberNumber = hasChar && char.MemberNumber !== undefined
			? checkMemberNumberRule(constraints.memberNumber, char!.MemberNumber)
			: false;
	}

	if (constraints.restrained !== undefined) {
		results.restrained = hasChar ? char.IsRestrained() === constraints.restrained : false;
	}

	if (constraints.gagged !== undefined) {
		results.gagged = hasChar ? char.IsGagged() === constraints.gagged : false;
	}

	if (constraints.blinded !== undefined) {
		results.blinded = hasChar ? char.IsBlind() === constraints.blinded : false;
	}

	if (constraints.deafened !== undefined) {
		results.deafened = hasChar ? char.IsDeaf() === constraints.deafened : false;
	}

	if (constraints.arousalMin !== undefined) {
		const arousal = char?.ArousalSettings?.Progress ?? 0;
		results.arousalMin = arousal <= constraints.arousalMin;
	}

	if (constraints.arousalMax !== undefined) {
		const arousal = char?.ArousalSettings?.Progress ?? 0;
		results.arousalMax = arousal >= constraints.arousalMax;
	}

	return results;
}

function evaluateSourceConstraints(constraints: SourceConstraint, data: MessageData): Record<keyof SourceConstraint, boolean> {
	return evaluateCharacterConstraints(constraints, data.source);
}

function evaluateTargetConstraints(constraints: TargetConstraint, data: MessageData): Record<keyof TargetConstraint, boolean> {
	return evaluateCharacterConstraints(constraints, data.target);
}

function evaluatePlayerConstraints(constraints: PlayerConstraint, _data: MessageData): Record<keyof PlayerConstraint, boolean> {
	return evaluateCharacterConstraints(constraints, Player);
}

function evaluateRoomConstraints(constraints: RoomConstraint, _data: MessageData): Record<keyof RoomConstraint, boolean> {
	const results: Record<string, boolean> = {};

	if (constraints.inRoomNamed !== undefined) {
		const roomName = ChatRoomData?.Name ?? '';
		results.inRoomNamed = constraints.inRoomNamed.entries.some(entry => {
			const matches = entry.value === roomName;
			return entry.mode === 'include' ? matches : !matches;
		});
	}

	if (constraints.inRoomWithMembers !== undefined) {
		const members = ChatRoomData?.Character?.map(c => c.MemberNumber) ?? [];
		results.inRoomWithMembers = constraints.inRoomWithMembers.entries.some(entry => {
			const memberId = parseInt(entry.value, 10);
			const matches = members.includes(memberId);
			return entry.mode === 'include' ? matches : !matches;
		});
	}

	return results;
}

function evaluateAllConstraints(constraints: TriggerConstraint, data: MessageData): ConstraintResults {
	const results: ConstraintResults = {};

	if (constraints.source) {
		results.source = evaluateSourceConstraints(constraints.source, data);
	}

	if (constraints.target) {
		results.target = evaluateTargetConstraints(constraints.target, data);
	}

	if (constraints.player) {
		results.player = evaluatePlayerConstraints(constraints.player, data);
	}

	if (constraints.room) {
		results.room = evaluateRoomConstraints(constraints.room, data);
	}

	return results;
}

function isTriggerMet(trigger: Trigger, messageData: MessageData): boolean {
	if (trigger.constraints && trigger.constraintMode) {
		const applicable = applicableConstraints(trigger);
		if (applicable && !processTriggerConstraint(applicable, trigger.constraintMode, messageData)) return false;
	}

	return checkTriggerPredicates(trigger, messageData);
}

export function collectTriggers(type: TriggerType, messageData: MessageData): { behavior: Behavior; trigger: Trigger }[] {
	const enabledBehaviors = Object.values(BehaviorsModule.instance.settings.behaviors)
		.filter(b => b.enabled);
	const matches: { behavior: Behavior; trigger: Trigger }[] = [];

	for (const behavior of enabledBehaviors) {
		const last = BehaviorsModule.instance.behaviorExecutionMap.get(behavior.id);
		if (last && CommonTime() - last < (behavior.cooldownSec ?? 0) * 1000) {
			continue;
		}

		const triggers = behavior.triggers.map(t => BehaviorsModule.instance.getTrigger(t));
		const triggersOfType = triggers.filter(t => t?.type === type).filter(t => t !== undefined);

		let best: Trigger | undefined;
		for (const trigger of triggersOfType) {
			if (!isTriggerMet(trigger, messageData)) continue;
			if (!best || triggerRank(trigger) > triggerRank(best)) best = trigger;
		}

		if (best) matches.push({ behavior, trigger: best });
	}

	return matches;
}

export function processTrigger(type: TriggerType, messageData: MessageData): { behavior: Behavior; trigger: Trigger } | undefined {
	return collectTriggers(type, messageData).reduce<{ behavior: Behavior; trigger: Trigger } | undefined>((best, entry) => {
		if (!best || triggerRank(entry.trigger) > triggerRank(best.trigger)) return entry;
		return best;
	}, undefined);
}

export function processTriggerConstraint(triggerConstraint: TriggerConstraint, mode: ConstraintMode, messageData: MessageData): boolean {
	function collect<T extends Record<keyof T, boolean>>(results: T | undefined): boolean[] {
		if (!results) return [];
		return CommonEntries(results).map(([, passed]) => passed);
	}

	const results = evaluateAllConstraints(triggerConstraint, messageData);
	const allResults = [
		...collect(results.source),
		...collect(results.target),
		...collect(results.player),
		...collect(results.room),
	];

	if (allResults.length === 0) return true;

	switch (mode) {
		case 'any':
			return allResults.some(result => result);
		case 'all':
			return allResults.every(result => result);
		default:
			assertNever(mode);
	}
}

export function triggerHasAnyConstraints(trigger: Trigger): boolean {
	return applicableConstraints(trigger) !== undefined;
}

export function triggerHasConstraint(trigger: Trigger, entity: 'source' | 'target' | 'player' | 'room', constraintKey?: ConstraintFieldKey): boolean {
	if (!trigger.constraints) return false;
	if (!isConstraintCompatible(trigger, entity, constraintKey)) return false;

	const entityConstraints = trigger.constraints[entity];
	if (!entityConstraints) return false;

	if (constraintKey === undefined) {
		return constraintKeys(entityConstraints).some(key => isConstraintCompatible(trigger, entity, key));
	}

	const value = (entityConstraints as any)[constraintKey];
	if (value === null || value === undefined) return false;

	if (typeof value === 'boolean' || typeof value === 'number') {
		return true;
	}

	if (typeof value === 'object' && 'entries' in value) {
		return Array.isArray(value.entries) && value.entries.length > 0;
	}

	return false;
}