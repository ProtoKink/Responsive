import { BaseMigrator } from 'bc-deeplib/deeplib';
import { modStorage } from '../utilities/data';
import { GlobalSettingsModel } from '../models/base';
import { applyBehaviorDefaults, applyReactionDefaults, applyTriggerDefaults, BehaviorsSettingsModel, Reaction, ReactionInput, TriggerInput } from '../models/behaviors';

type ExtraType = 'low' | 'light' | 'medium' | 'hot' | 'orgasm';

type ResponsesSettingsModel = {
	mainResponses: ResponsesEntryModel[];
	extraResponses: ExtraResponsesModel;
};

type ResponsesEntryModel = {
	actName: ActivityName;
	groupName: AssetGroupItemName[];
	responses: string[];
	selfTrigger: boolean;
};

type ExtraResponsesModel = Record<ExtraType, string[]>;

type OldGlobal = GlobalSettingsModel & { responsiveEnabled?: boolean };

type SettingsBag = {
	GlobalModule?: OldGlobal;
	ResponsesModule?: ResponsesSettingsModel;
	BehaviorsModule?: (BehaviorsSettingsModel & Partial<ResponsesSettingsModel>) | ResponsesSettingsModel;
	ProfilesModule?: Record<string, { data?: SettingsBag } | undefined>;
};

const replacements = Object.freeze({
	tname: '{{target-name}}',
	tpronoun: '{{target-pronoun}}',
	tpossessive: '{{target-possessive}}',
	tintensive: '{{target-intensive}}',
	tself: '{{target-self}}',

	sname: '{{source-name}}',
	spronoun: '{{source-pronoun}}',
	spossessive: '{{source-possessive}}',
	sintensive: '{{source-intensive}}',
	sself: '{{source-self}}',

	player: '{{player-name}}',
});

const arousalLimits: Record<Exclude<ExtraType, 'orgasm'>, number> = {
	low: 20,
	light: 40,
	medium: 60,
	hot: 80,
};

export class DeepLibMigrator extends BaseMigrator {
	get migrationVersion(): string {
		return '1.0.0';
	}

	migrate(): void {
		const storage = modStorage.playerStorage as unknown as SettingsBag;
		migrateGlobal(storage.GlobalModule);
		migrateResponses(storage, storage.GlobalModule);

		for (const profile of Object.values(storage.ProfilesModule ?? {})) {
			if (!profile?.data) continue;
			migrateGlobal(profile.data.GlobalModule);
			migrateResponses(profile.data, profile.data.GlobalModule);
		}

		modStorage.save();
	}
}

function migrateGlobal(global: OldGlobal | undefined): void {
	if (!global) return;
	if (global?.responsiveEnabled !== undefined) 
		global.modEnabled = global.responsiveEnabled;
	delete global.responsiveEnabled;
	delete global.ResponsiveEnabled;
}

function migrateResponses(holder: SettingsBag, global: OldGlobal | undefined): void {
	const old = oldResponses(holder);
	if (!old) return;

	replaceTemplates(old);
	holder.BehaviorsModule = toBehaviors(old, global?.doAddMoansOnHighArousal !== false);
	delete holder.ResponsesModule;
}

function oldResponses(holder: SettingsBag): ResponsesSettingsModel | undefined {
	if (isOldResponses(holder.ResponsesModule)) return holder.ResponsesModule;
	if (isOldResponses(holder.BehaviorsModule)) return holder.BehaviorsModule;
	return undefined;
}

function isOldResponses(value: unknown): value is ResponsesSettingsModel {
	if (!CommonIsObject(value)) return false;
	const data = value as ResponsesSettingsModel & { behaviors?: unknown };
	return Array.isArray(data.mainResponses) && data.behaviors === undefined;
}

function replaceTemplates(data: ResponsesSettingsModel) {
	for (const entry of data.mainResponses) {
		entry.responses = (entry.responses ?? []).map(replaceLine);
	}

	for (const key of Object.keys(data.extraResponses ?? {}) as ExtraType[]) {
		data.extraResponses[key] = (data.extraResponses[key] ?? []).map(replaceLine);
	}
}

function replaceLine(line: string): string {
	return line
		.replaceAll(/%SOURCE_PRONOUN%|SourcePronoun/g, replacements.spronoun)
		.replaceAll(/%SOURCE_POSSESIVE%|SourcePossessive/g, replacements.spossessive)
		.replaceAll(/%SOURCE_INTENSIVE%|SourceIntensive/g, replacements.sintensive)
		.replaceAll(/%SOURCE%|Source/g, replacements.sname)
		.replaceAll(/%TARGET_PRONOUN%|Pronoun/g, replacements.tpronoun)
		.replaceAll(/%TARGET_POSSESIVE%|Possessive/g, replacements.tpossessive)
		.replaceAll(/%TARGET_INTENSIVE%|Intensive/g, replacements.tintensive)
		.replaceAll(/%TARGET%/g, replacements.tname)
		.replaceAll(/Player/g, replacements.player);
}

function formatGroupNames(groups: string[]): string {
	const shown = groups.slice(0, 3);
	const extra = groups.length - shown.length;
	const label = shown.join(', ');
	return extra > 0 ? `${label} + ${extra} more` : label;
}

function toBehaviors(data: ResponsesSettingsModel, moansEnabled: boolean): BehaviorsSettingsModel {
	const built: Pick<BehaviorsSettingsModel, 'behaviors' | 'triggers' | 'reactions'> = {
		behaviors: {},
		triggers: {},
		reactions: {},
	};

	for (const entry of data.mainResponses) {
		const groups = entry.groupName ?? [];
		const name = `${entry.actName} (${entry.selfTrigger ? 'Self&Other' : 'Other'}) [${formatGroupNames(groups)}]`;
		addBehavior(built, name, true, {
			type: 'activity',
			activityName: [entry.actName],
			groupName: groups,
			...playerTargetConstraint(Player.MemberNumber, !entry.selfTrigger),
		}, entry.responses ?? []);
	}

	for (const type of ['low', 'light', 'medium', 'hot'] as const) {
		addBehavior(built, `Arousal ${type}`, moansEnabled, {
			type: 'arousal',
			limit: arousalLimits[type],
		}, data.extraResponses?.[type] ?? []);
	}

	addBehavior(built, 'Orgasm', true, {
		type: 'orgasm',
		orgasmType: 'normal',
		...playerSourceConstraint(Player.MemberNumber),
	}, data.extraResponses?.orgasm ?? []);

	return built;
}

function playerTargetConstraint(member: number | undefined, excludeSelfSource: boolean): Pick<TriggerInput, 'constraintMode' | 'constraints'> {
	if (member === undefined) return {};
	const memberRule = { entries: [{ value: String(member), mode: 'include' as const }] };
	return {
		constraintMode: 'all',
		constraints: {
			target: { memberNumber: memberRule },
			...(excludeSelfSource ? { source: { memberNumber: { entries: [{ value: String(member), mode: 'exclude' }] } } } : {}),
		},
	};
}

function playerSourceConstraint(member: number | undefined): Pick<TriggerInput, 'constraintMode' | 'constraints'> {
	if (member === undefined) return {};
	return {
		constraintMode: 'all',
		constraints: {
			source: { memberNumber: { entries: [{ value: String(member), mode: 'include' }] } },
		},
	};
}

function addBehavior(
	built: Pick<BehaviorsSettingsModel, 'behaviors' | 'triggers' | 'reactions'>,
	name: string,
	enabled: boolean,
	triggerInput: TriggerInput,
	lines: string[],
): void {
	const reactions = toReactions(name, lines);
	if (reactions.length === 0) return;

	const trigger = applyTriggerDefaults({ ...triggerInput, name });
	const behavior = applyBehaviorDefaults({
		name,
		enabled,
		reactionMode: 'random',
		triggers: [trigger.id],
		reactions: reactions.map((reaction) => reaction.id),
	});

	built.triggers[trigger.id] = trigger;
	built.behaviors[behavior.id] = behavior;
	for (const reaction of reactions) built.reactions[reaction.id] = reaction;
}

function toReactions(name: string, lines: string[]): Reaction[] {
	const parsed = lines.map(parseLine);
	const split = parsed.reduce((acc, line) => {
		(acc[line.type] ??= []).push(line);
		return acc;
	}, {} as Partial<Record<LineReaction['type'], ParsedLine[]>>);

	const ret: Reaction[] = [];
	for (const type of Object.keys(split) as LineReaction['type'][]) {
		ret.push(applyReactionDefaults({ type, name, content: split[type]?.map((line) => line.content) } as ReactionInput));
	}
	return ret;
}

type LineReaction = Extract<Reaction, { type: 'speech' | 'emote' | 'action' }>;

type ParsedLine = {
	type: LineReaction['type'];
	content: string;
};

function parseLine(line: string): ParsedLine {
	if (line.startsWith('@@')) return { type: 'action', content: `${replacements.player} ${line.slice(2).trimStart()}` };
	if (line.startsWith('@')) return { type: 'action', content: line.slice(1).trimStart() };
	if (line.startsWith('*')) {
		const content = line.endsWith('*') && line.length > 1 ? line.slice(1, -1) : line.slice(1);
		return { type: 'emote', content };
	}
	return { type: 'speech', content: line };
}
