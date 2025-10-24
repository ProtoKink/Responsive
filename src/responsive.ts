import bcr_style from '../public/styles/main.css';
import { modules, registerModule } from './base/modules';
import { GUI } from './base/setting_utils';
import { CharTalkModule } from './modules/char_talk';
import { GlobalModule } from './modules/global';
import { ProfilesModule } from './modules/profiles';
import { ResponsesModule } from './modules/responses';
import { VersionModule } from './modules/version';
import { Localization } from './translation';
import { loadCommands } from './utilities/commands';
import { conDebug, conLog } from './utilities/console';
import { clearOldData, dataFix, dataStore, dataTake } from './utilities/data';
import { MOD_VERSION_CAPTION } from './utilities/definition';
import { injectStyle } from './utilities/other';
import { hookFunction } from './utilities/sdk';

function initWait() {
  conLog('Init wait');
  if (CurrentScreen == null || CurrentScreen === 'Login') {
    hookFunction('LoginResponse', 0, (args, next) => {
      conDebug(`Init! LoginResponse caught: `, args);
      next(args);
      const response = args[0];
      if (response && typeof response.Name === 'string' && typeof response.AccountName === 'string') {
        init();
      }
    });
  } else {
    conLog(`Already logged in, init`);
    init();
  }
}

export async function init() {
  if (window.ResponsiveLoaded) return;

  await Localization.load();

  injectStyle(bcr_style, 'bcr_style');

  dataTake();
  loadCommands();

  if (!initModules()) {
    unload();
    return;
  }
  clearOldData();
  dataFix();

  VersionModule.checkIfNewVersion();

  dataStore();

  window.ResponsiveLoaded = true;
  conLog(`Loaded! Version: ${MOD_VERSION_CAPTION}`);
}

function initModules(): boolean {
  registerModule(new GUI());
  registerModule(new GlobalModule());
  registerModule(new ResponsesModule());
  registerModule(new ProfilesModule());
  registerModule(new VersionModule());
  registerModule(new CharTalkModule());

  for (const m of modules()) {
    m.Init();
  }

  for (const m of modules()) {
    m.Load();
  }

  for (const m of modules()) {
    m.Run();
  }

  conLog('Modules Loaded.');
  return true;
}

export function unload(): true {
  unloadModules();

  delete window.ResponsiveLoaded;
  conLog('Unloaded.');
  return true;
}

function unloadModules() {
  for (const m of modules()) {
    m.Unload();
  }
}

initWait();
