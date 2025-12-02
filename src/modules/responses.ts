import { BaseModule, Subscreen, sdk } from 'bc-deeplib/deeplib';
import { activityDeconstruct } from '../utilities/chat_messages';
import { activityHandle, leaveHandle, orgasmHandle } from '../utilities/handlers';
import { ResponsesEntryModel, ResponsesSettingsModel } from '../models/responses';
import { GuiResponses } from '../screens/responses';
import { getDefaultResponsesEntries } from '../utilities/default_responses_entries';
import { HookPriority, ModuleCategory } from '../utilities/sdk';

export class ResponsesModule extends BaseModule {
  static instance: ResponsesModule;

  static isOrgasm: boolean = false; // Just for Char Talk stuff

  get settings(): ResponsesSettingsModel {
    return super.settings as ResponsesSettingsModel;
  }

  set settings(val: ResponsesSettingsModel) {
    super.settings = val;
  }

  get settingsScreen(): Subscreen | null {
    return GuiResponses;
  }

  get defaultSettings() {
    return getDefaultResponsesEntries();
  }

  load(): void {
    super.load();
    ResponsesModule.instance = this;
    
    ChatRoomRegisterMessageHandler({
      Description: 'Processes activity responses',
      Priority: 320,
      Callback: (data, _sender, _msg, metadata) => {
        if (data.Type !== 'Activity') return false;
        if (!metadata) return false;

        const dict = activityDeconstruct(metadata ?? {});
        if (!dict) return false;
        const entry = this.getResponsesEntry(dict?.activityName, dict?.groupName);
        if (!entry) return false;

        activityHandle(dict, entry);

        return false;
      }
    });

    //Leave Message
    sdk.hookFunction(
      'ServerAccountBeep',
      HookPriority.AddBehavior,
      (args, next) => {
        const data = args[0];

        if (!data.ChatRoomName || !ChatRoomData || data.BeepType !== 'Leash') return next(args);
        if (!Player.OnlineSharedSettings?.AllowPlayerLeashing) return next(args);

        leaveHandle(data);
        next(args);
      },
      ModuleCategory.Global
    );

    //Orgasm Handling
    sdk.hookFunction(
      'ActivityOrgasmStart',
      HookPriority.Observe,
      (args, next) => {
        orgasmHandle(args[0] as Character);
        next(args);
      },
      ModuleCategory.Global
    );
  }

  run(): void {}

  getResponsesEntry(actName: ActivityName | undefined, grpName: AssetGroupItemName | undefined): ResponsesEntryModel | undefined {
    if (!actName || !grpName) return undefined;
    return this.settings.mainResponses.find((ent) => ent.actName === actName && ent.groupName.includes(grpName));
  }

  createNewEntry(actName: ActivityName, grpName: AssetGroupItemName, responses?: string[], selfTrigger?: boolean): ResponsesEntryModel {
    return <ResponsesEntryModel>{
      actName: actName,
      groupName: [grpName],
      responses: responses ?? [],
      selfTrigger: selfTrigger ?? false
    };
  }

  createEntryIfNeeded(existing: ResponsesEntryModel | undefined, activity: Activity | undefined, group: AssetItemGroup | undefined): ResponsesEntryModel | undefined {
    if (!existing && activity?.Name && group?.Name) {
      existing = this.createNewEntry(activity.Name, group.Name);
      this.settings.mainResponses.push(existing);
    }

    return existing;
  }
}
