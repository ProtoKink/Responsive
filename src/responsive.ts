import { GUI, GuiImportExport, initMod, Style } from 'bc-deeplib/deeplib';
import { CharTalkModule } from './modules/char_talk';
import { GlobalModule } from './modules/global';
import { ProfilesModule } from './modules/profiles';
import { ResponsesModule } from './modules/responses';
import { clearOldData, dataFix } from './utilities/data';
import { ModName, ModRepository } from './utilities/definition';
import { GuiReset } from './screens/reset';
import { CommandsModule } from './modules/commands';

initMod({
  modName: ModName,
  modRepository: ModRepository,
  async initFunction() {
    clearOldData();
    dataFix();

    Style.injectEmbed('bcr_style', `${PUBLIC_URL}/styles/main.css`);
    Style.injectEmbed('bcr_responses_style', `${PUBLIC_URL}/styles/responses.css`);
  },
  modules: [
    new GUI({
      buttonText: ModName,
      identifier: ModName,
      image: 'Icons/Arousal.png',
    }),
    new GlobalModule(),
    new ResponsesModule(),
    new ProfilesModule(),
    new CharTalkModule(),
    new CommandsModule()
  ],
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
  }
});
