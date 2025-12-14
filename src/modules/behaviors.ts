import { BaseModule, Subscreen, sdk } from 'bc-deeplib/deeplib';
import { BehaviorsSettingsModel } from '../models/behaviors';
import { GuiBehaviors } from '../screens/behaviors';
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
    return <BehaviorsSettingsModel>{
      mainResponses: [],
      extraResponses: {
        low: [],
        light: [],
        medium: [],
        hot: [],
        orgasm: []
      },
      doShowNewVersionMessage: true,
      modEnabled: true
    };
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

        next(args);
      },
      ModuleCategory.Global
    );

    //Orgasm Handling
    sdk.hookFunction(
      'ActivityOrgasmStart',
      HookPriority.Observe,
      (args, next) => {
        next(args);
      },
      ModuleCategory.Global
    );
  }

  run(): void {}
}
