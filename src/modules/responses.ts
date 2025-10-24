import { BaseModule } from "../base/base_module";
import { activityDeconstruct } from "../utilities/chat_messages";
import { activityHandle, leaveHandle, orgasmHandle } from "../utilities/handlers";
import { ResponsesEntryModel, ResponsesSettingsModel } from "../models/responses";
import { GuiResponses } from "../screens/responses";
import { Subscreen } from "../base/setting_definitions";
import { getDefaultResponsesEntries } from "../utilities/default_responses_entries";
import { HookPriority, ModuleCategory, hookFunction } from "../utilities/sdk";

export class ResponsesModule extends BaseModule {
  static isOrgasm: boolean = false; // Just for Char Talk stuff

  get settings(): ResponsesSettingsModel {
    return super.settings as ResponsesSettingsModel;
  }

  get settingsScreen(): Subscreen | null {
    return GuiResponses;
  }

  get defaultSettings() {
    return getDefaultResponsesEntries();
  }

  Load(): void {
    ChatRoomRegisterMessageHandler({
      Description: "Processes activity responses",
      Priority: 320,
      Callback: (data, sender, msg, metadata) => {
        if (data.Type !== "Activity") return false;

        const dict = activityDeconstruct(metadata ?? {});
        if (!dict) return false;
        let entry = this.getResponsesEntry(dict?.activityName, dict?.groupName);
				if (!entry) return false;

        activityHandle(dict, entry);

        return false;
      }
    });

    //Leave Message
    hookFunction(
      "ServerAccountBeep",
      HookPriority.AddBehavior,
      (args, next) => {
        let data = args[0];

        if (!data.ChatRoomName || !ChatRoomData || data.BeepType !== "Leash") return next(args);
        if (!Player.OnlineSharedSettings?.AllowPlayerLeashing) return next(args);

        leaveHandle(data);
        next(args);
      },
      ModuleCategory.Global
    );

    //Orgasm Handling
    hookFunction(
      "ActivityOrgasmStart",
      HookPriority.Observe,
      (args, next) => {
        orgasmHandle(args[0] as Character);
        next(args);
      },
      ModuleCategory.Global
    );
  }

  Run(): void {}

  getResponsesEntry(actName: string | undefined, grpName: string | undefined): ResponsesEntryModel | undefined {
		if (!actName || !grpName) return undefined;
    return this.settings.mainResponses.find((ent) => ent.actName === actName && ent.groupName.includes(grpName));
  }
}
