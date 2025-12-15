import { BaseMigrator } from 'bc-deeplib/deeplib';
import { modStorage } from '../utilities/data';

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

export class DeepLibMigrator extends BaseMigrator {
  get migrationVersion(): string {
    return '1.0.0';
  }

  migrate(): void {
    replaceTemplates();
  }
}

function replaceTemplates() {
  const data = modStorage.playerStorage.ResponsesModule as ResponsesSettingsModel;

  const replacements = Object.freeze({
    tname: '{{ target name }}',
    tpronoun: '{{ target pronoun }}',
    tpossessive: '{{ target possessive }}',
    tintensive: '{{ target intensive }}',
    tself: '{{ target self }}',

    sname: '{{ source name }}',
    spronoun: '{{ source pronoun }}',
    spossessive: '{{ source possessive }}',
    sintensive: '{{ source intensive }}',
    sself: '{{ source self }}',

    player: '{{ player name }}',
  });

  data.mainResponses.forEach((entry) => {
    entry.responses = entry.responses
      .map((r) => r
        .replaceAll(/%SOURCE_PRONOUN%|SourcePronoun/g, replacements.spronoun)
        .replaceAll(/%SOURCE_POSSESIVE%|SourcePossessive/g, replacements.spossessive)
        .replaceAll(/%SOURCE_INTENSIVE%|SourceIntensive/g, replacements.sintensive)
        .replaceAll(/%SOURCE%|Source/g, replacements.sname)
        .replaceAll(/%TARGET_PRONOUN%|Pronoun/g, replacements.tpronoun)
        .replaceAll(/%TARGET_POSSESIVE%|Possessive/g, replacements.tpossessive)
        .replaceAll(/%TARGET_INTENSIVE%|Intensive/g, replacements.tintensive)
        .replaceAll(/%TARGET%/g, replacements.tname)
        .replaceAll(/Player/g, replacements.player));
  });
  modStorage.save();
}
