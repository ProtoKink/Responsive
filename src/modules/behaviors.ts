import { BaseModule, Subscreen, sdk } from 'bc-deeplib/deeplib';
import { activityDeconstruct } from '../utilities/chat_messages';
import { activityHandle, leaveHandle, orgasmHandle } from '../utilities/handlers';
import { BehaviorsEntryModel, BehaviorsSettingsModel } from '../models/behaviors';
import { GuiBehaviors } from '../screens/behaviors';
import { getDefaultResponsesEntries } from '../utilities/default_responses_entries';
import { HookPriority, ModuleCategory } from '../utilities/sdk';

export class BehaviorsModule extends BaseModule {
  static instance: BehaviorsModule;

  static isOrgasm: boolean = false; // Just for Char Talk stuff

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
    return getDefaultResponsesEntries();
  }

  load(): void {
    super.load();
    BehaviorsModule.instance = this;
    
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

  getResponsesEntry(actName: ActivityName | undefined, grpName: AssetGroupItemName | undefined): BehaviorsEntryModel | undefined {
    if (!actName || !grpName) return undefined;
    return this.settings.mainResponses.find((ent) => ent.actName === actName && ent.groupName.includes(grpName));
  }

  createNewEntry(actName: ActivityName, grpName: AssetGroupItemName, responses?: string[], selfTrigger?: boolean): BehaviorsEntryModel {
    return <BehaviorsEntryModel>{
      actName: actName,
      groupName: [grpName],
      responses: responses ?? [],
      selfTrigger: selfTrigger ?? false
    };
  }

  createEntryIfNeeded(existing: BehaviorsEntryModel | undefined, activity: Activity | undefined, group: AssetItemGroup | undefined): BehaviorsEntryModel | undefined {
    if (!existing && activity?.Name && group?.Name) {
      existing = this.createNewEntry(activity.Name, group.Name);
      this.settings.mainResponses.push(existing);
    }

    return existing;
  }
}
