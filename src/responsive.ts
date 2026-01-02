import { GUI, GuiImportExport, initMod, Style, VersionModule } from 'bc-deeplib/deeplib';
import { CharTalkModule } from './modules/char_talk';
import { GlobalModule } from './modules/global';
import { ProfilesModule } from './modules/profiles';
import { BehaviorsModule } from './modules/behaviors';
import { ModName, ModRepository } from './utilities/definition';
import { GuiReset } from './screens/reset';
import { CommandsModule } from './modules/commands';
import { BCR_CHANGELOG } from './utilities/messages';
import { DeepLibMigrator } from './migrators/deeplib';

initMod({
  modName: ModName,
  modRepository: ModRepository,
  async initFunction() {
    Style.injectEmbed('bcr_style', `${PUBLIC_URL}/styles/main.css`);
    Style.injectEmbed('bcr_behaviors_style', `${PUBLIC_URL}/styles/behaviors.css`);

    ServerPlayerChatRoom.register({
      callback: () => CurrentModule === 'DeepLibMod' as keyof ModuleScreens && InformationSheetReturnScreen?.[1] === 'ChatRoom'
    });
  },
  modules: {
    GUI: new GUI({
      buttonText: ModName,
      identifier: ModName,
      image: 'Icons/Arousal.png',
    }),
    GlobalModule: new GlobalModule(),
    BehaviorsModule: new BehaviorsModule(),
    ProfilesModule: new ProfilesModule(),
    CharTalkModule: new CharTalkModule(),
    CommandsModule: new CommandsModule(),
    VersionModule: new VersionModule({
      newVersionMessage: BCR_CHANGELOG,
      migrators: [
        new DeepLibMigrator()
      ]
    })
  },
  mainMenuOptions: {
    wikiLink: 'https://github.com/dDeepLb/BC-Responsive/wiki',
    importExportSubscreen: new GuiImportExport({
      customFileExtension: 'bcrsp'
    }),
    resetSubscreen: new GuiReset(),
    storageFullnessIndicator: true
  },
  translationOptions: {
    pathToTranslationsFolder: `${PUBLIC_URL}/i18n`,
    fetchFolder: true
  }
});
