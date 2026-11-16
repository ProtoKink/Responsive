"use strict";
var Responsive = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/Responsive.ts
  var Responsive_exports = {};
  __export(Responsive_exports, {
    init: () => init,
    unload: () => unload
  });

  // public/styles/main.css
  var main_default = ".ResponsiveMessageContent {\n  display: inline;\n}\n\n.ResponsiveVersion {\n  font-weight: bold;\n  color: rgb(203, 185, 23);\n}\n\n#TextAreaChatLog[data-colortheme='dark'] div.ChatMessage.ResponsiveMessage,\n#TextAreaChatLog[data-colortheme='dark2'] div.ChatMessage.ResponsiveMessage {\n  background-color: #111;\n  border: 2px solid #440171;\n  padding-left: 5px;\n  display: block;\n  white-space: normal;\n  color: #eee;\n}\n\n#TextAreaChatLog div.ChatMessage.ResponsiveMessage {\n  background-color: #eee;\n  border: 2px solid #440171;\n  padding-left: 5px;\n  display: block;\n  white-space: wrap;\n  color: #111;\n}\n\n#TextAreaChatLog[data-colortheme='dark'] a.ResponsiveText,\n#TextAreaChatLog[data-colortheme='dark2'] a.ResponsiveText {\n  cursor: pointer;\n  font-weight: bold;\n  color: #eee;\n}\n\n#TextAreaChatLog a.ResponsiveText {\n  cursor: pointer;\n  font-weight: bold;\n  color: #111;\n}\n\n#ResponsiveGratitude {\n  position: fixed;\n  width: 25%;\n  height: 50%;\n  top: 15%;\n  left: 50%;\n}\n\n.ResponsiveH {\n  font-size: 1em;\n  color: #333;\n}\n\n.ResponsiveP {\n  font-size: 0.6em;\n  color: #555;\n  line-height: 1.5;\n}\n\n.ResponsiveP:last-child {\n  font-size: 0.8em;\n  color: #ff69b4;\n}\n";

  // src/Base/Modules.ts
  var modulesMap = /* @__PURE__ */ new Map();
  function modules() {
    return [...modulesMap.values()];
  }
  __name(modules, "modules");
  function registerModule(module) {
    modulesMap.set(module.constructor.name, module);
    return module;
  }
  __name(registerModule, "registerModule");

  // src/Translation.ts
  var _Localization = class _Localization {
    static async load() {
      const lang = TranslationLanguage.toLowerCase();
      this.Translation = await _Localization.fetchLanguageFile(lang);
    }
    static getText(srcTag) {
      return this.Translation[srcTag] || srcTag || "";
    }
    static async fetchLanguageFile(lang) {
      const response = await fetch(`${"https://protokink.github.io/Responsive/dev/public"}/i18n/${lang}.lang`);
      if (lang != "en" && !response.ok) {
        return _Localization.fetchLanguageFile("en");
      }
      const langFileContent = await response.text();
      return this.parseLanguageFile(langFileContent);
    }
    static parseLanguageFile(content) {
      const translations = {};
      const lines = content.split("\n");
      for (const line of lines) {
        if (line.trim() === "" || line.trim().startsWith("#")) {
          continue;
        }
        const [key, value] = line.split("=");
        translations[key.trim()] = value.trim();
      }
      return translations;
    }
  };
  __name(_Localization, "Localization");
  __publicField(_Localization, "Translation", {});
  var Localization = _Localization;
  var getText = /* @__PURE__ */ __name((string) => Localization.getText(string), "getText");

  // src/Utilities/Definition.ts
  var MT = {
    CHANGELOG: 30,
    INFO: 15,
    COMMANDS: 20
  };
  var cmdKeyword = "bcr";
  var CMD_BCR = cmdKeyword;
  var CMD_TOGGLE = `${cmdKeyword} toggle`;
  var CMD_CHANGELOG = `${cmdKeyword} changelog`;
  var CMD_VERSION = `${cmdKeyword} version`;
  var CMD_DEBUG_DATA = `${cmdKeyword} debug-data`;
  var ModName = `Responsive`;
  var FullModName = `Bondage Club Responsive`;
  var MOD_VERSION_CAPTION = true ? `${"0.6.6"} - ${"f3f0b0ce"}` : "0.6.6";
  var ModRepository = `https://github.com/dDeepLb/BC-Responsive`;
  var DebugMode = false;

  // src/Utilities/String.ts
  var __String = class __String {
    static encode(string) {
      return LZString.compressToBase64(JSON.stringify(string));
    }
    static decode(string) {
      let d = LZString.decompressFromBase64(string);
      let data = {};
      try {
        let decoded = JSON.parse(d);
        data = decoded;
      } catch {
      }
      if (data) return data;
    }
    static shuffle(string) {
      let temp = JSON.parse(JSON.stringify(string));
      let ret = [];
      while (temp.length > 0) {
        let d = Math.floor(Math.random() * temp.length);
        ret.push(temp[d]);
        temp.splice(d, 1);
      }
      return ret;
    }
  };
  __name(__String, "_String");
  var _String = __String;

  // src/Utilities/Data.ts
  var PlayerStorage = /* @__PURE__ */ __name(() => Player[ModName], "PlayerStorage");
  var ExtensionStorage = /* @__PURE__ */ __name(() => Player.ExtensionSettings[ModName], "ExtensionStorage");
  function dataTake() {
    if (ExtensionStorage()) {
      Player[ModName] = JSON.parse(LZString.decompressFromBase64(ExtensionStorage()) || "");
    } else if (Player.OnlineSettings["BCResponsive"]) {
      if (typeof Player.OnlineSettings["BCResponsive"] == "object") {
        return Player[ModName] = {};
      }
      Player[ModName] = JSON.parse(LZString.decompressFromBase64(Player.OnlineSettings["BCResponsive"]) || "");
      delete Player.OnlineSettings["BCResponsive"];
      window.ServerAccountUpdate.QueueData({ OnlineSettings: Player.OnlineSettings });
    } else {
      Player[ModName] = {};
    }
  }
  __name(dataTake, "dataTake");
  function dataStore() {
    if (!ExtensionStorage()) Player.ExtensionSettings[ModName] = "";
    let Data = {
      Version: PlayerStorage().Version,
      GlobalModule: PlayerStorage().GlobalModule,
      ResponsesModule: PlayerStorage().ResponsesModule,
      ProfilesModule: PlayerStorage().ProfilesModule
    };
    Player.ExtensionSettings[ModName] = _String.encode(Data);
    ServerPlayerExtensionSettingsSync(ModName);
  }
  __name(dataStore, "dataStore");
  function dataErase(doResetSettings, doResetResponses, doResetProfiles) {
    if (doResetSettings) {
      Player[ModName].GlobalModule = {};
    }
    if (doResetResponses) {
      Player[ModName].ResponsesModule = {};
    }
    if (doResetProfiles) {
      Player[ModName].ProfilesModule = {};
    }
    dataStore();
  }
  __name(dataErase, "dataErase");
  function dataResetForManual() {
    Player[ModName].ResponsesModule = {
      ResponsiveEnabled: false,
      mainResponses: [],
      extraResponses: {
        low: [],
        light: [],
        medium: [],
        hot: [],
        orgasm: []
      }
    };
    dataStore();
  }
  __name(dataResetForManual, "dataResetForManual");
  function dataFix() {
    let data = Player[ModName];
    let mainResponses = data.ResponsesModule.mainResponses;
    mainResponses.forEach((entry) => {
      if (entry.actName == void 0) {
        mainResponses.splice(mainResponses.indexOf(entry));
      }
      if (typeof entry.groupName == "string") {
        entry.groupName = [entry.groupName];
      }
      if (entry.responses == void 0) {
        entry.responses = [""];
      }
    });
  }
  __name(dataFix, "dataFix");
  function clearOldData() {
    delete Player.OnlineSettings["BCResponsive"]?.Profiles;
    delete Player.OnlineSettings["BCResponsive"]?.data;
    delete Player.OnlineSettings["BCResponsive"]?.SavedVersion;
    delete Player["BCResponsive"]?.Profiles;
    delete Player["BCResponsive"]?.data;
    delete Player["BCResponsive"]?.SavedVersion;
  }
  __name(clearOldData, "clearOldData");

  // src/Base/SettingDefinitions.ts
  var SETTING_FUNC_PREFIX = "PreferenceSubscreen";
  var SETTING_NAME_PREFIX = "BCR";
  var SETTING_FUNC_NAMES = ["Load", "Run", "Click", "Unload", "Exit"];
  function setSubscreen(subscreen) {
    if (!GUI.instance) {
      throw new Error("Attempt to set subscreen before init");
    }
    GUI.instance.currentSubscreen = subscreen;
    return GUI.instance.currentSubscreen;
  }
  __name(setSubscreen, "setSubscreen");

  // src/Base/BaseSetting.ts
  var _GuiSubscreen = class _GuiSubscreen {
    constructor(module) {
      __publicField(this, "module");
      if (module) this.module = module;
      SETTING_FUNC_NAMES.forEach((name) => {
        const fName = SETTING_FUNC_PREFIX + SETTING_NAME_PREFIX + this.name + name;
        if (typeof this[name] === "function" && typeof window[fName] !== "function")
          window[fName] = () => {
            this[name]();
          };
      });
    }
    get name() {
      return "UNKNOWN";
    }
    get icon() {
      return "";
    }
    get label() {
      return "UNDEFINED SETTING SCREEN";
    }
    get message() {
      return PreferenceMessage;
    }
    set message(message) {
      PreferenceMessage = message;
    }
    get SubscreenName() {
      return SETTING_NAME_PREFIX + this.constructor.name;
    }
    setSubscreen(screen) {
      return setSubscreen(screen);
    }
    get settings() {
      return this.module.settings;
    }
    get multipageStructure() {
      return [[]];
    }
    get structure() {
      return this.multipageStructure[Math.min(PreferencePageCurrent - 1, this.multipageStructure.length - 1)];
    }
    get character() {
      return GUI.instance?.currentCharacter;
    }
    getYPos(ix) {
      return _GuiSubscreen.START_Y + _GuiSubscreen.Y_MOD * (ix % 9);
    }
    getXPos(ix) {
      return _GuiSubscreen.START_X + _GuiSubscreen.X_MOD * Math.floor(ix / 9);
    }
    hideElements() {
      this.multipageStructure.forEach((item, ix, arr) => {
        if (ix != PreferencePageCurrent - 1) {
          item.forEach((setting) => {
            if (setting.type == "text" || setting.type == "number") this.elementHide(setting.id);
          });
        }
      });
    }
    Load() {
      for (const module of modules()) {
        if (!module.settingsScreen) continue;
        if (!Object.keys(module.settings).length) module.registerDefaultSettings();
      }
      this.multipageStructure.forEach(
        (s) => s.forEach((item) => {
          switch (item.type) {
            case "text":
              let input = ElementCreateInput(item.id, "text", item.setting(), "255");
              input.setAttribute("autocomplete", "off");
              break;
            case "number":
              ElementCreateInput(item.id, "number", item.setting(), "255");
              break;
          }
        })
      );
      CharacterAppearanceForceUpCharacter = Player.MemberNumber ?? -1;
    }
    Run() {
      _GuiSubscreen.POS_BAK = _GuiSubscreen.START_X;
      _GuiSubscreen.TEXT_ALIGN_BAK = MainCanvas.textAlign;
      _GuiSubscreen.START_X = 550;
      MainCanvas.textAlign = "left";
      DrawCharacter(Player, 50, 50, 0.9, false);
      DrawText(getText(`${this.name}.title`), _GuiSubscreen.START_X, _GuiSubscreen.START_Y - _GuiSubscreen.Y_MOD, "Black", "#D7F6E9");
      DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png", "Responsive");
      if (this.multipageStructure.length > 1) {
        MainCanvas.textAlign = "center";
        PreferencePageChangeDraw(1595, 75, this.multipageStructure.length);
        MainCanvas.textAlign = "left";
      }
      this.hideElements();
      this.structure.forEach((item, ix, arr) => {
        switch (item.type) {
          case "checkbox":
            this.drawCheckbox(item.label, item.description, item.setting(), ix, item.disabled);
            break;
          case "text":
          case "number":
            this.elementPosition(item.id, item.label, item.description, ix, item.disabled);
            break;
          case "label":
            this.drawLabel(item.label, item.description, ix);
            break;
          case "button":
            this.drawBetterButton(item.position, item.size, item.label, item.color, item.image, item.disabled);
            break;
        }
      });
      _GuiSubscreen.START_X = _GuiSubscreen.POS_BAK;
      MainCanvas.textAlign = _GuiSubscreen.TEXT_ALIGN_BAK;
    }
    Click() {
      _GuiSubscreen.POS_BAK = _GuiSubscreen.START_X;
      _GuiSubscreen.TEXT_ALIGN_BAK = MainCanvas.textAlign;
      _GuiSubscreen.START_X = 550;
      MainCanvas.textAlign = "left";
      if (MouseIn(1815, 75, 90, 90)) return this.Exit();
      if (this.multipageStructure.length > 1) PreferencePageChangeClick(1595, 75, this.multipageStructure.length);
      this.structure.forEach((item, ix, arr) => {
        switch (item.type) {
          case "checkbox":
            if (MouseIn(this.getXPos(ix) + 600, this.getYPos(ix) - 32, 64, 64) && !item.disabled) {
              item.setSetting(!item.setting());
            }
            break;
          case "button":
            if (MouseIn(item.position[0], item.position[1], item.size[0], item.size[1])) item.callback();
            break;
        }
      });
      _GuiSubscreen.START_X = _GuiSubscreen.POS_BAK;
      MainCanvas.textAlign = _GuiSubscreen.TEXT_ALIGN_BAK;
    }
    Exit() {
      this.multipageStructure.forEach(
        (s) => s.forEach((item) => {
          switch (item.type) {
            case "number":
              if (!CommonIsNumeric(ElementValue(item.id))) {
                ElementRemove(item.id);
                break;
              }
            case "text":
              item.setSetting(ElementValue(item.id));
              ElementRemove(item.id);
              break;
          }
        })
      );
      CharacterAppearanceForceUpCharacter = -1;
      CharacterLoadCanvas(Player);
      setSubscreen("mainmenu");
      dataStore();
    }
    Unload() {
    }
    tooltip(text) {
      drawTooltip(300, 850, 1400, text, "left");
    }
    drawCheckbox(label, description, value, order, disabled = false) {
      var isHovering = MouseIn(this.getXPos(order), this.getYPos(order) - 32, 600, 64);
      DrawTextFit(getText(label), this.getXPos(order), this.getYPos(order), 600, isHovering ? "Red" : "Black", "Gray");
      DrawCheckbox(this.getXPos(order) + 600, this.getYPos(order) - 32, 64, 64, "", value ?? false, disabled);
      if (isHovering) this.tooltip(getText(description));
    }
    drawBetterButton(position, size, label, color, image = "", disabled = false) {
      var isHovering = MouseIn(position[0], position[1] - 32, size[0], size[1]);
      DrawButton(position[0], position[1], size[0], size[1], "", color, "", "", disabled);
      DrawImageResize(image, position[0] + 10, position[1] + 10, 60, 60);
      DrawTextFit(getText(label), position[0] + 80, position[1] + 40, 600, isHovering ? "Red" : "Black", "Gray");
    }
    drawButton(label, color, order, XOffset, disabled = false) {
      var isHovering = MouseIn(this.getXPos(order) + XOffset, this.getYPos(order) - 32, 200, 64);
      DrawButton(this.getXPos(order) + XOffset, this.getYPos(order) - 32, 200, 64, "", color, "", "", disabled);
      DrawTextFit(getText(label), this.getXPos(order) + XOffset + 58, this.getYPos(order), 600, isHovering ? "Red" : "Black", "Gray");
    }
    elementHide(elementId) {
      ElementPosition(elementId, -999, -999, 1, 1);
    }
    elementPosition(elementId, label, description, order, disabled = false) {
      var isHovering = MouseIn(this.getXPos(order), this.getYPos(order) - 32, 600, 64);
      DrawTextFit(getText(label), this.getXPos(order), this.getYPos(order), 600, isHovering ? "Red" : "Black", "Gray");
      ElementPosition(elementId, this.getXPos(order) + 750 + 225, this.getYPos(order), 800, 64);
      if (disabled) ElementSetAttribute(elementId, "disabled", "true");
      if (!disabled) document.getElementById(elementId)?.removeAttribute("disabled");
      if (isHovering) this.tooltip(getText(description));
    }
    drawLabel(label, description, order) {
      var isHovering = MouseIn(this.getXPos(order), this.getYPos(order) - 32, 600, 64);
      DrawTextFit(getText(label), this.getXPos(order), this.getYPos(order), 600, isHovering ? "Red" : "Black", "Gray");
      if (isHovering) this.tooltip(getText(description));
    }
  };
  __name(_GuiSubscreen, "GuiSubscreen");
  __publicField(_GuiSubscreen, "START_X", 180);
  __publicField(_GuiSubscreen, "START_Y", 205);
  __publicField(_GuiSubscreen, "X_MOD", 950);
  __publicField(_GuiSubscreen, "Y_MOD", 75);
  __publicField(_GuiSubscreen, "POS_BAK", _GuiSubscreen.START_X);
  __publicField(_GuiSubscreen, "TEXT_ALIGN_BAK", "left");
  var GuiSubscreen = _GuiSubscreen;
  function drawTooltip(x, y, width, text, align) {
    const bak = MainCanvas.textAlign;
    MainCanvas.textAlign = align;
    DrawRect(x, y, width, 65, "#ffff88");
    DrawEmptyRect(x, y, width, 65, "Black");
    DrawTextFit(text, align === "left" ? x + 3 : x + width / 2, y + 33, width - 6, "black");
    MainCanvas.textAlign = bak;
  }
  __name(drawTooltip, "drawTooltip");

  // src/Screens/Reset.ts
  var _GuiReset = class _GuiReset extends GuiSubscreen {
    constructor() {
      super(...arguments);
      __publicField(this, "allowedConfirmTime", 0);
      __publicField(this, "doResetForManualSettings", false);
      __publicField(this, "doResetSettings", true);
      __publicField(this, "doResetResponses", true);
      __publicField(this, "doResetProfiles", false);
    }
    get name() {
      return "reset";
    }
    get icon() {
      return "";
    }
    Load() {
      this.allowedConfirmTime = Date.now() + 1e4;
      super.Load();
    }
    Run() {
      GuiSubscreen.POS_BAK = GuiSubscreen.START_X;
      GuiSubscreen.TEXT_ALIGN_BAK = MainCanvas.textAlign;
      GuiSubscreen.START_X = 180;
      MainCanvas.textAlign = "center";
      DrawText(getText(`reset.label.perma_reset_of_bcr_data`), 1e3, 125, "Black");
      DrawText(getText(`reset.label.warning`), 1e3, 225, "Black", "Black");
      DrawText(getText(`reset.label.if_u_confirm_perma_reset`), 1e3, 325, "Black");
      DrawText(getText(`reset.label.youll_able_to_use_bcr`), 1e3, 375, "Gray");
      DrawText(getText(`reset.label.action_cannot_be_undone`), 1e3, 425, "Red", "Black");
      const now = Date.now();
      if (now < this.allowedConfirmTime) {
        DrawButton(
          1e3,
          690,
          200,
          80,
          `${getText("reset.button.confirm")} (${Math.floor((this.allowedConfirmTime - now) / 1e3)})`,
          "#ddd",
          void 0,
          void 0,
          true
        );
      } else {
        DrawButton(1e3, 690, 200, 80, getText("reset.button.confirm"), "White");
      }
      DrawButton(1520, 690, 200, 80, getText("reset.button.cancel"), "White");
      MainCanvas.textAlign = "left";
      this.drawCheckbox(
        "reset.setting.reset_for_manual_setting.text",
        "reset.setting.reset_for_manual_setting.desc",
        this.doResetForManualSettings,
        4
      );
      this.drawCheckbox(
        "reset.setting.reset_settings.text",
        "reset.setting.reset_settings.desc",
        this.doResetSettings,
        6,
        this.doResetForManualSettings
      );
      this.drawCheckbox(
        "reset.setting.reset_responses.text",
        "reset.setting.reset_responses.desc",
        this.doResetResponses,
        7,
        this.doResetForManualSettings
      );
      this.drawCheckbox(
        "reset.setting.reset_profiles.text",
        "reset.setting.reset_profiles.desc",
        this.doResetProfiles,
        8,
        this.doResetForManualSettings
      );
      MainCanvas.textAlign = GuiSubscreen.TEXT_ALIGN_BAK;
    }
    Click() {
      if (this.allowedConfirmTime === null) return;
      if (MouseIn(1520, 690, 200, 80)) return this.Exit();
      if (MouseIn(1e3, 690, 200, 80) && Date.now() >= this.allowedConfirmTime) return this.Confirm();
      if (MouseIn(this.getXPos(4) + 600, this.getYPos(4) - 32, 64, 64)) return this.doResetForManualSettings = !this.doResetForManualSettings;
      if (MouseIn(this.getXPos(6) + 600, this.getYPos(6) - 32, 64, 64) && !this.doResetForManualSettings)
        return this.doResetSettings = !this.doResetSettings;
      if (MouseIn(this.getXPos(7) + 600, this.getYPos(7) - 32, 64, 64) && !this.doResetForManualSettings)
        return this.doResetResponses = !this.doResetResponses;
      if (MouseIn(this.getXPos(8) + 800, this.getYPos(8) - 32, 64, 64) && !this.doResetForManualSettings)
        return this.doResetProfiles = !this.doResetProfiles;
    }
    Confirm() {
      this.allowedConfirmTime = null;
      if (this.doResetForManualSettings) {
        dataResetForManual();
      } else {
        dataErase(this.doResetSettings, this.doResetResponses, this.doResetProfiles);
      }
      this.setSubscreen(null);
      PreferenceSubscreenExtensionsClear();
    }
  };
  __name(_GuiReset, "GuiReset");
  var GuiReset = _GuiReset;

  // src/Screens/MainMenu.ts
  var _MainMenu = class _MainMenu extends GuiSubscreen {
    constructor(module) {
      super(module);
      __publicField(this, "subscreens", []);
      this.subscreens = module.subscreens;
    }
    get name() {
      return "mainmenu";
    }
    Load() {
      if (!GUI.instance?.currentSubscreen) {
        this.setSubscreen(this);
        return;
      }
      super.Load();
    }
    Run() {
      let tmp = GuiSubscreen.START_X;
      var prev = MainCanvas.textAlign;
      GuiSubscreen.START_X = 550;
      MainCanvas.textAlign = "left";
      DrawCharacter(Player, 50, 50, 0.9, false);
      DrawText(
        getText("mainmenu.title").replace("$ModVersion", MOD_VERSION_CAPTION),
        GuiSubscreen.START_X,
        GuiSubscreen.START_Y - GuiSubscreen.Y_MOD,
        "Black",
        "#D7F6E9"
      );
      DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
      MainCanvas.textAlign = "center";
      let i = 0;
      for (const screen of this.subscreens) {
        const PX = Math.floor(i / 6);
        const PY = i % 6;
        if (screen.name == "mainmenu") continue;
        DrawButton(GuiSubscreen.START_X + 430 * PX, 190 + 120 * PY, 450, 90, "", "White", "", "");
        DrawImageResize(screen.icon, GuiSubscreen.START_X + 430 * PX + 10, 190 + 120 * PY + 10, 70, 70);
        MainCanvas.textAlign = "left";
        DrawTextFit(getText(`mainmenu.button.${screen.name}`), GuiSubscreen.START_X + 100 + 430 * PX, 235 + 120 * PY, 340, "Black");
        MainCanvas.textAlign = "center";
        i++;
        MainCanvas.textAlign = "left";
      }
      DrawButton(1500, 730, 405, 80, "", "IndianRed");
      DrawImageResize("Icons/ServiceBell.png", 1510, 740, 60, 60);
      DrawTextFit("Reset", 1580, 770, 320, "Black");
      DrawButton(1500, 830, 405, 80, "", "#BDA203", "", "Open Responsive Wiki on GitHub.", false);
      DrawImageResize("Icons/Introduction.png", 1510, 840, 60, 60);
      DrawTextFit("Wiki", 1580, 870, 320, "Black");
      GuiSubscreen.START_X = tmp;
      MainCanvas.textAlign = prev;
    }
    Click() {
      if (MouseIn(1815, 75, 90, 90)) return this.Exit();
      let tmp = GuiSubscreen.START_X;
      GuiSubscreen.START_X = 550;
      let i = 0;
      for (const screen of this.subscreens) {
        const PX = Math.floor(i / 6);
        const PY = i % 6;
        if (screen.name == "mainmenu") continue;
        if (MouseIn(GuiSubscreen.START_X + 430 * PX, 190 + 120 * PY, 450, 90)) {
          this.setSubscreen(screen);
          return;
        }
        i++;
      }
      GuiSubscreen.START_X = tmp;
      if (MouseIn(1500, 730, 405, 80)) this.setSubscreen(new GuiReset());
      if (MouseIn(1500, 830, 405, 80)) window.open("https://github.com/dDeepLb/BC-Responsive/wiki/", "_blank");
    }
    Exit() {
      CharacterAppearanceForceUpCharacter = -1;
      CharacterLoadCanvas(Player);
      this.setSubscreen(null);
      PreferenceSubscreenExtensionsClear();
    }
  };
  __name(_MainMenu, "MainMenu");
  var MainMenu = _MainMenu;

  // src/Base/BaseModule.ts
  var _BaseModule = class _BaseModule {
    get settingsScreen() {
      return null;
    }
    /** Allows changing the subkey for that module settings storage */
    get settingsStorage() {
      return this.constructor.name;
    }
    get settings() {
      if (!this.settingsStorage) return {};
      if (!PlayerStorage()) {
        Player[ModName] = {};
        this.registerDefaultSettings();
      } else if (!PlayerStorage()[this.settingsStorage]) this.registerDefaultSettings();
      return PlayerStorage()[this.settingsStorage];
    }
    get enabled() {
      if (!PlayerStorage()?.GlobalModule) return false;
      return PlayerStorage().GlobalModule.ResponsiveEnabled && this.settings.ResponsiveEnabled && (ServerPlayerIsInChatRoom() || CurrentModule == "Room" && CurrentScreen == "Crafting");
    }
    Init() {
      this.registerDefaultSettings();
    }
    registerDefaultSettings() {
      const storage = this.settingsStorage;
      const defaults = this.defaultSettings;
      if (!storage || !defaults) return;
      PlayerStorage()[storage] = Object.assign(defaults, PlayerStorage()[storage] ?? {});
    }
    get defaultSettings() {
      return null;
    }
    Load() {
    }
    Run() {
    }
    Unload() {
    }
  };
  __name(_BaseModule, "BaseModule");
  var BaseModule = _BaseModule;

  // src/Base/SettingUtils.ts
  var _GUI = class _GUI extends BaseModule {
    constructor() {
      super();
      __publicField(this, "_subscreens");
      __publicField(this, "_mainMenu");
      __publicField(this, "_currentSubscreen", null);
      if (_GUI.instance) {
        throw new Error("Duplicate initialization");
      }
      this._mainMenu = new MainMenu(this);
      this._subscreens = [this._mainMenu];
      _GUI.instance = this;
    }
    get subscreens() {
      return this._subscreens;
    }
    get mainMenu() {
      return this._mainMenu;
    }
    get currentSubscreen() {
      return this._currentSubscreen;
    }
    set currentSubscreen(subscreen) {
      if (this._currentSubscreen) {
        this._currentSubscreen.Unload();
      }
      if (typeof subscreen === "string") {
        const scr = this._subscreens?.find((s) => s.name === subscreen);
        if (!scr) throw `Failed to find screen name ${subscreen}`;
        this._currentSubscreen = scr;
      } else {
        this._currentSubscreen = subscreen;
      }
      PreferenceMessage = "";
      PreferencePageCurrent = 1;
      let subscreenName = "";
      if (this._currentSubscreen) {
        subscreenName = SETTING_NAME_PREFIX + this._currentSubscreen?.name;
        this._currentSubscreen.Load();
      }
    }
    get currentCharacter() {
      return Player;
    }
    get defaultSettings() {
      return null;
    }
    Load() {
      for (const module of modules()) {
        if (!module.settingsScreen) continue;
        this._subscreens.push(new module.settingsScreen(module));
      }
      this._mainMenu.subscreens = this._subscreens;
      PreferenceRegisterExtensionSetting({
        Identifier: "Responsive",
        ButtonText: getText("infosheet.button.mod_button"),
        Image: `Icons/Arousal.png`,
        load: /* @__PURE__ */ __name(() => {
          setSubscreen(new MainMenu(this));
        }, "load"),
        run: /* @__PURE__ */ __name(() => {
          if (this._currentSubscreen) {
            MainCanvas.textAlign = "left";
            this._currentSubscreen.Run();
            MainCanvas.textAlign = "center";
            this.drawDebug();
          }
        }, "run"),
        click: /* @__PURE__ */ __name(() => {
          if (this._currentSubscreen) {
            this._currentSubscreen.Click();
          }
        }, "click"),
        exit: /* @__PURE__ */ __name(() => {
          if (this._currentSubscreen) {
            this._currentSubscreen.Exit();
          }
        }, "exit")
      });
    }
    drawDebug() {
      if (DebugMode) {
        if (MouseX > 0 || MouseY > 0) {
          MainCanvas.save();
          MainCanvas.lineWidth = 1;
          MainCanvas.strokeStyle = "red";
          MainCanvas.beginPath();
          MainCanvas.moveTo(0, MouseY);
          MainCanvas.lineTo(2e3, MouseY);
          MainCanvas.moveTo(MouseX, 0);
          MainCanvas.lineTo(MouseX, 1e3);
          MainCanvas.stroke();
          MainCanvas.fillStyle = "black";
          MainCanvas.strokeStyle = "white";
          MainCanvas.fillRect(0, 950, 250, 50);
          MainCanvas.strokeRect(0, 950, 250, 50);
          DrawText(`X: ${MouseX} Y: ${MouseY}`, 125, 975, "white");
          MainCanvas.restore();
        }
      }
    }
  };
  __name(_GUI, "GUI");
  __publicField(_GUI, "instance", null);
  var GUI = _GUI;

  // src/Utilities/Other.ts
  function getCharacter(memberNumber) {
    return ChatRoomCharacter.find((c) => c.MemberNumber == memberNumber) ?? void 0;
  }
  __name(getCharacter, "getCharacter");
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  __name(getRandomInt, "getRandomInt");
  function injectStyle(styleSrc, styleId) {
    const checkStyle = !!document.getElementById(styleId);
    if (checkStyle) return;
    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.appendChild(document.createTextNode(styleSrc));
    document.head.appendChild(styleElement);
  }
  __name(injectStyle, "injectStyle");

  // src/Utilities/ChatMessages.ts
  function activityDeconstruct(dict) {
    const activityName = dict.ActivityName;
    const targetCharacter = dict.TargetCharacter;
    const groupName = dict.GroupName;
    const sourceCharacter = dict.SourceCharacter;
    if (activityName === void 0 || targetCharacter === void 0 || groupName === void 0 || sourceCharacter === void 0) {
      return void 0;
    }
    return {
      groupName,
      activityName,
      sourceCharacter,
      targetCharacter
    };
  }
  __name(activityDeconstruct, "activityDeconstruct");
  function isSimpleChat(msg) {
    return msg.trim().length > 0 && ChatRoomTargetMemberNumber == -1 && !msg.startsWith("/") && !msg.startsWith("(") && !msg.startsWith("*") && !msg.startsWith("!") && !msg.startsWith(".") && !msg.startsWith("@") && !msg.startsWith("http");
  }
  __name(isSimpleChat, "isSimpleChat");
  function chatRoomAutoInterceptMessage(cur_msg, msg, source) {
    if (!msg) return;
    const data = PlayerStorage().GlobalModule;
    if (data.doMessageInterruption && isSimpleChat(cur_msg)) {
      return chatRoomInterceptMessage(cur_msg, msg);
    }
    return chatRoomNormalMessage(msg);
  }
  __name(chatRoomAutoInterceptMessage, "chatRoomAutoInterceptMessage");
  function orgasmMessage() {
    chatRoomAutoInterceptMessage(ElementValue("InputChat"), typedMoan("orgasm"), Player);
  }
  __name(orgasmMessage, "orgasmMessage");
  function leaveMessage() {
    if (isSimpleChat(ElementValue("InputChat"))) chatRoomAutoInterceptMessage(ElementValue("InputChat"), " ");
  }
  __name(leaveMessage, "leaveMessage");
  function activityMessage(dict, entry) {
    const source = getCharacter(dict.sourceCharacter.MemberNumber);
    const response = typedResponse(entry?.responses ?? []);
    const templatedResponse = replaceTemplate(response, source).trim();
    if (templatedResponse[0] == "@") {
      if (templatedResponse[1] == "@") {
        const playerName = CharacterNickname(Player);
        const messageWithPlayerName = `${playerName} ${templatedResponse.slice(2)}`;
        return sendAction(messageWithPlayerName);
      }
      return sendAction(templatedResponse.slice(1));
    }
    chatRoomAutoInterceptMessage(ElementValue("InputChat"), templatedResponse, source);
  }
  __name(activityMessage, "activityMessage");
  function sendAction(action) {
    ServerSend("ChatRoomChat", {
      Content: "RESPONSIVE_CUSTOM_ACTION",
      Type: "Action",
      Dictionary: [
        { Tag: 'MISSING TEXT IN "Interface.csv": RESPONSIVE_CUSTOM_ACTION', Text: action }
      ]
    });
  }
  __name(sendAction, "sendAction");
  function chatRoomInterceptMessage(cur_msg, msg) {
    if (!msg) return;
    ElementValue("InputChat", cur_msg + "... " + msg);
    ChatRoomSendChat();
  }
  __name(chatRoomInterceptMessage, "chatRoomInterceptMessage");
  function chatRoomNormalMessage(msg) {
    if (!msg) return;
    let backupChatRoomTargetMemberNumber = ChatRoomTargetMemberNumber;
    ChatRoomSetTarget(-1);
    let oldmsg = ElementValue("InputChat");
    ElementValue("InputChat", msg);
    ChatRoomSendChat();
    ElementValue("InputChat", oldmsg);
    ChatRoomSetTarget(backupChatRoomTargetMemberNumber);
  }
  __name(chatRoomNormalMessage, "chatRoomNormalMessage");
  function replaceTemplate(msg, source) {
    if (!msg) return "";
    source ?? (source = Player);
    const playerPronouns = CharacterPronounDescription(Player);
    const playerName = CharacterNickname(Player);
    const playerPronoun = playerPronouns === "She/Her" ? "she" : "he";
    const playerPossessive = playerPronouns === "She/Her" ? "her" : "his";
    const playerIntensive = playerPronouns === "She/Her" ? "her" : "him";
    const sourcePronounItem = CharacterPronounDescription(source);
    const sourceName = CharacterNickname(source);
    const sourcePronoun = sourcePronounItem === "She/Her" ? "she" : "he";
    const sourcePossessive = sourcePronounItem === "She/Her" ? "her" : "his";
    const sourceIntensive = sourceName === playerName ? playerPronouns === "She/Her" ? "herself" : "himself" : sourcePronounItem === "She/Her" ? "her" : "him";
    return msg.replaceAll(/%TARGET%|Player/g, playerName).replaceAll(/%TARGET_PRONOUN%|Pronoun/g, playerPronoun).replaceAll(/%TARGET_POSSESIVE%|Possessive/g, playerPossessive).replaceAll(/%TARGET_INTENSIVE%|Intensive/g, playerIntensive).replaceAll(/%SOURCE%|Source/g, sourceName).replaceAll(/%SOURCE_PRONOUN%|SourcePronoun/g, sourcePronoun).replaceAll(/%SOURCE_POSSESIVE%|SourcePossessive/g, sourcePossessive).replaceAll(/%SOURCE_INTENSIVE%|SourceIntensive/g, sourceIntensive);
  }
  __name(replaceTemplate, "replaceTemplate");
  function randomResponse(key) {
    const rnd = getRandomInt(key.length);
    return key[rnd];
  }
  __name(randomResponse, "randomResponse");
  function typedMoan(moanType) {
    return randomResponse(PlayerStorage().ResponsesModule.extraResponses[moanType]);
  }
  __name(typedMoan, "typedMoan");
  function typedResponse(responses) {
    return randomResponse(responses);
  }
  __name(typedResponse, "typedResponse");

  // src/Utilities/Console.ts
  var STYLES = {
    INFO: "color: #32CCCC",
    LOG: "color: #CCCC32",
    DEBUG: "color: #9E4BCF"
  };
  function conLog(...args) {
    if (typeof args[0] === "string") console.log(`%cBCR: ${args[0]}`, STYLES.LOG, ...args.slice(1));
    else console.log(`%cBCR:`, STYLES.LOG, ...args);
  }
  __name(conLog, "conLog");
  function conWarn(...args) {
    if (typeof args[0] === "string") console.warn(`%cBCR: ${args[0]}`, STYLES.LOG, ...args.slice(1));
    else console.warn(`%cBCR: `, STYLES.LOG, ...args);
  }
  __name(conWarn, "conWarn");
  function conErr(...args) {
    if (typeof args[0] === "string") console.error(`%cBCR: ${args[0]}`, STYLES.LOG, ...args.slice(1));
    else console.error(`%cBCR:`, STYLES.LOG, ...args);
  }
  __name(conErr, "conErr");
  function conDebug(...args) {
    if (DebugMode) {
      if (typeof args[0] === "string") console.debug(`%cBCR: ${args[0]}`, STYLES.DEBUG, ...args.slice(1));
      else console.debug(`%cBCR:`, STYLES.LOG, ...args);
    }
  }
  __name(conDebug, "conDebug");

  // src/Utilities/SDK.ts
  var SDK = bcModSdk.registerMod(
    {
      name: ModName,
      fullName: FullModName,
      version: MOD_VERSION_CAPTION,
      repository: ModRepository
    },
    {
      allowReplace: false
    }
  );
  var patchedFunctions = /* @__PURE__ */ new Map();
  function initPatchableFunction(target) {
    let result = patchedFunctions.get(target);
    if (!result) {
      result = {
        name: target,
        hooks: []
      };
      patchedFunctions.set(target, result);
    }
    return result;
  }
  __name(initPatchableFunction, "initPatchableFunction");
  function hookFunction(target, priority, hook, module = null) {
    const data = initPatchableFunction(target);
    if (data.hooks.some((h) => h.hook === hook)) {
      conErr(`Duplicate hook for "${target}"`, hook);
      return () => null;
    }
    const removeCallback = SDK.hookFunction(target, priority, hook);
    data.hooks.push({
      hook,
      priority,
      module,
      removeCallback
    });
    data.hooks.sort((a, b) => b.priority - a.priority);
    return removeCallback;
  }
  __name(hookFunction, "hookFunction");

  // src/Modules/CharTalk.ts
  var letterExpressionMap = [
    { regex: /[.?!…~]/, expr: [null, 600] },
    { regex: /[,;]/, expr: [null, 250] },
    //Latin
    { regex: /[a]/i, expr: ["Open", 400] },
    { regex: /[oeu]/i, expr: ["HalfOpen", 300] },
    { regex: /[bp]/i, expr: [null, 200] },
    { regex: /[mn]/i, expr: [null, 500] },
    { regex: /[ij]/i, expr: ["Smirk", 400] },
    { regex: /[kqrw]/i, expr: ["HalfOpen", 300] },
    { regex: /[fv]/i, expr: ["LipBite", 300] },
    { regex: /[cdt]/i, expr: ["TonguePinch", 200] },
    { regex: /[slz]/i, expr: ["TonguePinch", 400] },
    { regex: /[ghx]/i, expr: ["Angry", 300] },
    //Cyrillic
    { regex: /[ая]/i, expr: ["Open", 400] },
    { regex: /[оеуєю]/i, expr: ["HalfOpen", 300] },
    { regex: /[бп]/i, expr: [null, 200] },
    { regex: /[мн]/i, expr: [null, 500] },
    { regex: /[иіжїы]/i, expr: ["Smirk", 400] },
    { regex: /[yкр]/i, expr: ["HalfOpen", 300] },
    { regex: /[фв]/i, expr: ["LipBite", 300] },
    { regex: /[цдт]/i, expr: ["TonguePinch", 200] },
    { regex: /[слз]/i, expr: ["TonguePinch", 400] },
    { regex: /[гх]/i, expr: ["Angry", 300] }
  ];
  var _CharTalkModule = class _CharTalkModule extends BaseModule {
    Load() {
      ChatRoomRegisterMessageHandler({
        Description: "Processes mouth moving on the client",
        Priority: 500,
        Callback: /* @__PURE__ */ __name((data, sender, msg) => {
          if (data.Type === "Chat") _CharTalkModule.charTalkHandle(sender, msg);
          return false;
        }, "Callback")
      });
      hookFunction(
        "CommonDrawAppearanceBuild",
        0 /* Observe */,
        (args, next) => {
          const c = args[0];
          if (!c?.MemberNumber) return next(args);
          const charData = _CharTalkModule.characterData[c.MemberNumber];
          if (!charData) return next(args);
          const mouth = InventoryGet(c, "Mouth");
          if (!mouth) return next(args);
          if (!mouth.Property) mouth.Property = {};
          charData.realExpression = mouth.Property.Expression ?? null;
          mouth.Property.Expression = charData.currentExpression ?? null;
          const returnValue = next(args);
          mouth.Property.Expression = charData.realExpression;
          return returnValue;
        },
        3 /* CharTalk */
      );
    }
    /**
     * Gets the sent message, checks it for validity,
     * then splits it in chunks and turns it into a list of expression changes
     * before pushing them into the animator.
     */
    static animateSpeech(c, msg) {
      const maxFrames = 30;
      const chunks = msg.match(/.{1,3}/g) || [];
      const animation = chunks.map((chunk) => {
        const match = letterExpressionMap.find(({ regex }) => regex.test(chunk)) ?? { expr: [null, 200] };
        return match.expr;
      }).slice(0, maxFrames);
      _CharTalkModule.runExpressionAnimation(c, animation);
    }
    /**
     * Runs animation by changing mouth expression every `step[1]`ms
     */
    static runExpressionAnimationStep(c) {
      if (!c?.MemberNumber) return;
      const charData = _CharTalkModule.characterData[c.MemberNumber];
      if (!charData) return;
      if (charData.animationFrame >= charData.animation.length) {
        return _CharTalkModule.cleanup(c);
      }
      const [expression, duration] = charData.animation[charData.animationFrame++];
      _CharTalkModule.setLocalMouthExpression(c, expression);
      setTimeout(() => _CharTalkModule.runExpressionAnimationStep(c), duration);
    }
    static runExpressionAnimation(c, list) {
      if (!c?.MemberNumber) return;
      if (_CharTalkModule.characterData[c.MemberNumber]) return;
      _CharTalkModule.characterData[c.MemberNumber] = {
        realExpression: null,
        currentExpression: null,
        animation: list,
        animationFrame: 0
      };
      _CharTalkModule.runExpressionAnimationStep(c);
    }
    static setLocalMouthExpression(c, expressionName) {
      if (!c?.MemberNumber) return;
      const mouth = InventoryGet(c, "Mouth");
      if (!mouth || expressionName && !mouth.Asset.Group.AllowExpression?.includes(expressionName)) return;
      _CharTalkModule.characterData[c.MemberNumber].currentExpression = expressionName;
      CharacterRefresh(c, false);
    }
    static charTalkHandle(c, msg) {
      const storage = PlayerStorage().GlobalModule;
      if (!storage.ResponsiveEnabled || !storage.CharTalkEnabled || !c?.MemberNumber || _CharTalkModule.characterData[c.MemberNumber]) return;
      if (isSimpleChat(msg)) {
        _CharTalkModule.animateSpeech(c, msg);
      }
    }
    static cleanup(c) {
      if (!c?.MemberNumber || !_CharTalkModule.characterData[c.MemberNumber]) return;
      _CharTalkModule.setLocalMouthExpression(c, _CharTalkModule.characterData[c.MemberNumber].realExpression);
      delete _CharTalkModule.characterData[c.MemberNumber];
    }
  };
  __name(_CharTalkModule, "CharTalkModule");
  __publicField(_CharTalkModule, "characterData", {});
  var CharTalkModule = _CharTalkModule;

  // src/Screens/Global.ts
  var _GuiGlobal = class _GuiGlobal extends GuiSubscreen {
    get name() {
      return "settings";
    }
    get icon() {
      return "Icons/Preference.png";
    }
    get settings() {
      return super.settings;
    }
    get structure() {
      return [
        {
          type: "checkbox",
          label: "settings.setting.responsive_enabled.name",
          description: "settings.setting.responsive_enabled.desc",
          setting: /* @__PURE__ */ __name(() => this.settings?.ResponsiveEnabled ?? true, "setting"),
          setSetting: /* @__PURE__ */ __name((val) => this.settings.ResponsiveEnabled = val, "setSetting")
        },
        {
          type: "checkbox",
          label: "settings.setting.responsesEnabled.name",
          description: "settings.setting.responsesEnabled.desc",
          setting: /* @__PURE__ */ __name(() => this.settings?.responsesEnabled ?? true, "setting"),
          setSetting: /* @__PURE__ */ __name((val) => this.settings.responsesEnabled = val, "setSetting")
        },
        {
          type: "checkbox",
          label: "settings.setting.chartalk_enabled.name",
          description: "settings.setting.chartalk_enabled.desc",
          setting: /* @__PURE__ */ __name(() => this.settings?.CharTalkEnabled ?? true, "setting"),
          setSetting: /* @__PURE__ */ __name((val) => this.settings.CharTalkEnabled = val, "setSetting")
        },
        {
          type: "checkbox",
          label: "settings.setting.interruption_enabled.name",
          description: "settings.setting.interruption_enabled.desc",
          setting: /* @__PURE__ */ __name(() => this.settings?.doMessageInterruption ?? true, "setting"),
          setSetting: /* @__PURE__ */ __name((val) => this.settings.doMessageInterruption = val, "setSetting")
        },
        {
          type: "checkbox",
          label: "settings.setting.leave_message_enabled.name",
          description: "settings.setting.leave_message_enabled.desc",
          setting: /* @__PURE__ */ __name(() => this.settings?.doLeaveMessage ?? true, "setting"),
          setSetting: /* @__PURE__ */ __name((val) => this.settings.doLeaveMessage = val, "setSetting")
        },
        {
          type: "checkbox",
          label: "settings.setting.doPreventMessageIfBcxBlock.name",
          description: "settings.setting.doPreventMessageIfBcxBlock.desc",
          setting: /* @__PURE__ */ __name(() => this.settings?.doPreventMessageIfBcxBlock ?? false, "setting"),
          setSetting: /* @__PURE__ */ __name((val) => this.settings.doPreventMessageIfBcxBlock = val, "setSetting")
        },
        {
          type: "checkbox",
          label: "settings.setting.new_version_message_enabled.name",
          description: "settings.setting.new_version_message_enabled.desc",
          setting: /* @__PURE__ */ __name(() => this.settings?.doShowNewVersionMessage ?? true, "setting"),
          setSetting: /* @__PURE__ */ __name((val) => this.settings.doShowNewVersionMessage = val, "setSetting")
        }
      ];
    }
    Load() {
      super.Load();
    }
  };
  __name(_GuiGlobal, "GuiGlobal");
  var GuiGlobal = _GuiGlobal;

  // src/Modules/Global.ts
  var _GlobalModule = class _GlobalModule extends BaseModule {
    get settingsScreen() {
      return GuiGlobal;
    }
    get settings() {
      return super.settings;
    }
    get defaultSettings() {
      return {
        ResponsiveEnabled: true,
        responsesEnabled: true,
        CharTalkEnabled: true,
        doShowNewVersionMessage: true,
        doLeaveMessage: true,
        //doAddMoansOnHighArousal: true,
        doPreventMessageIfBcxBlock: false,
        doMessageInterruption: true
      };
    }
    Load() {
    }
    Run() {
    }
  };
  __name(_GlobalModule, "GlobalModule");
  var GlobalModule = _GlobalModule;

  // src/Screens/Profiles.ts
  var _GuiProfiles = class _GuiProfiles extends GuiSubscreen {
    constructor() {
      super(...arguments);
      __publicField(this, "PreferenceText", "");
      __publicField(this, "ProfileNames", ["", "", ""]);
      __publicField(this, "tmpGlbl", GuiSubscreen.START_X);
    }
    get name() {
      return "profiles";
    }
    get icon() {
      return "Icons/Title.png";
    }
    get settings() {
      return super.settings;
    }
    Load() {
      super.Load();
      for (let i = 0; i < 3; i++) {
        let profileIndex = i + 1;
        if (!PlayerStorage()?.ProfilesModule?.[profileIndex]) {
          PlayerStorage().ProfilesModule[profileIndex] = {
            data: {},
            name: ""
          };
        }
        this.ProfileNames[i] = PlayerStorage()?.ProfilesModule?.[profileIndex]?.name ?? "";
      }
      CharacterAppearanceForceUpCharacter = Player.MemberNumber ?? -1;
    }
    Run() {
      let prev = MainCanvas.textAlign;
      super.Run();
      MainCanvas.textAlign = "left";
      for (let i = 0; i < 3; i++) {
        let profileIndex = i + 1;
        if (this.ProfileNames[i] === "")
          DrawText(getText("profiles.text.profile") + ` ${profileIndex}`, this.getXPos(profileIndex), this.getYPos(profileIndex), "Black", "Gray");
        if (this.ProfileNames[i] !== "")
          DrawText(this.ProfileNames[i], this.getXPos(profileIndex), this.getYPos(profileIndex), "Black", "Gray");
        this.drawButton("profiles.button.save", "white", profileIndex, 250);
        this.drawButton("profiles.button.load", "white", profileIndex, 500);
        this.drawButton("profiles.button.delete", "IndianRed", profileIndex, 750);
      }
      if (this.PreferenceText)
        DrawText(this.PreferenceText, GuiSubscreen.START_X + 250, GuiSubscreen.START_Y - GuiSubscreen.Y_MOD, "Black", "Gray");
      MainCanvas.textAlign = prev;
    }
    Click() {
      super.Click();
      for (let i = 0; i < 3; i++) {
        let profileIndex = i + 1;
        this.handleProfilesSaving(profileIndex);
        this.handleProfilesLoading(profileIndex);
        this.handleProfilesDeleting(profileIndex);
      }
    }
    Exit() {
      CharacterAppearanceForceUpCharacter = -1;
      CharacterLoadCanvas(Player);
      this.PreferenceText = "";
      super.Exit();
    }
    saveProfile(profileId, profileName) {
      if (profileId < 1 || profileId > 3) {
        conWarn(`Invalid profile id ${profileId}`);
        return false;
      }
      if (!Object.keys(PlayerStorage()?.ProfilesModule?.[profileId]).length) {
        PlayerStorage().ProfilesModule[profileId] = {};
      }
      let saveData = {
        GlobalModule: PlayerStorage().GlobalModule,
        ResponsesModule: PlayerStorage().ResponsesModule
      };
      PlayerStorage().ProfilesModule[profileId] = {
        name: profileName,
        data: saveData
      };
      return true;
    }
    loadProfile(profileId) {
      if (profileId < 1 || profileId > 3) {
        conWarn(`Invalid profile id ${profileId}`);
        return false;
      }
      if (!Object.keys(PlayerStorage()?.ProfilesModule?.[profileId]).length) {
        return false;
      }
      let data = PlayerStorage().ProfilesModule[profileId].data;
      if (!data) {
        return false;
      }
      if (data) {
        PlayerStorage().GlobalModule = data.GlobalModule;
        PlayerStorage().ResponsesModule = data.ResponsesModule;
      }
      return true;
    }
    deleteProfile(profileId) {
      if (profileId < 1 || profileId > 3) {
        conWarn(`Invalid profile id ${profileId}`);
        return false;
      }
      if (!Object.keys(PlayerStorage()?.ProfilesModule?.[profileId]).length) {
        return false;
      }
      if (Object.keys(PlayerStorage()?.ProfilesModule?.[profileId]).length) {
        PlayerStorage().ProfilesModule[profileId] = {};
        return true;
      }
    }
    handleProfilesSaving(profileIndex) {
      let formerIndex = profileIndex - 1;
      if (MouseIn(this.getXPos(profileIndex) + 250, this.getYPos(profileIndex) - 32, 200, 64)) {
        let promptedName = prompt(getText("profiles.prompt"));
        if (promptedName === null) return;
        this.ProfileNames[formerIndex] = promptedName;
        if (this.ProfileNames[formerIndex] === "") {
          this.saveProfile(profileIndex, "");
          this.PreferenceText = `${getText("profiles.text.profile")} ${profileIndex} ${getText("profiles.text.has_been_saved")}`;
        }
        if (this.ProfileNames[formerIndex] !== "") {
          this.saveProfile(profileIndex, this.ProfileNames[formerIndex]);
          this.PreferenceText = `${getText("profiles.text.profile")} "${this.ProfileNames[formerIndex]}" ${getText(
            "profiles.text.has_been_saved"
          )}`;
        }
        return;
      }
    }
    handleProfilesLoading(profileIndex) {
      let formerIndex = profileIndex - 1;
      if (MouseIn(this.getXPos(profileIndex) + 500, this.getYPos(profileIndex) - 32, 200, 64)) {
        if (!this.loadProfile(profileIndex)) {
          this.PreferenceText = `${getText("profiles.text.profile")} ${profileIndex} ${getText("profiles.text.needs_to_be_saved")}`;
          return;
        }
        if (this.ProfileNames[formerIndex] === "")
          this.PreferenceText = `${getText("profiles.text.profile")} ${profileIndex} ${getText("profiles.text.has_been_loaded")}`;
        if (this.ProfileNames[formerIndex] !== "")
          this.PreferenceText = `${getText("profiles.text.profile")} "${this.ProfileNames[formerIndex]}" ${getText(
            "profiles.text.has_been_loaded"
          )}`;
        return;
      }
    }
    handleProfilesDeleting(profileIndex) {
      let formerIndex = profileIndex - 1;
      if (MouseIn(this.getXPos(profileIndex) + 750, this.getYPos(profileIndex) - 32, 200, 64)) {
        if (this.ProfileNames[formerIndex] === null) return;
        if (this.deleteProfile(profileIndex)) {
          if (this.ProfileNames[formerIndex] === "") {
            this.PreferenceText = `${getText("profiles.text.profile")} ${profileIndex} ${getText("profiles.text.has_been_deleted")}`;
            return;
          }
          if (this.ProfileNames[formerIndex] !== "") {
            this.PreferenceText = `${getText("profiles.text.profile")} "${this.ProfileNames[formerIndex]}" ${getText(
              "profiles.text.has_been_deleted"
            )}`;
            this.ProfileNames[formerIndex] = "";
            return;
          }
        }
        if (!this.deleteProfile(profileIndex)) {
          this.PreferenceText = `${getText("profiles.text.profile")} ${profileIndex} ${getText("profiles.text.not_saved_or_already_deleted")}`;
          return;
        }
        return;
      }
    }
  };
  __name(_GuiProfiles, "GuiProfiles");
  var GuiProfiles = _GuiProfiles;

  // src/Modules/Profiles.ts
  var _ProfilesModule = class _ProfilesModule extends BaseModule {
    get settings() {
      return super.settings;
    }
    get settingsScreen() {
      return GuiProfiles;
    }
    get defaultSettings() {
      return {};
    }
    Load() {
    }
    Run() {
    }
  };
  __name(_ProfilesModule, "ProfilesModule");
  var ProfilesModule = _ProfilesModule;

  // src/Utilities/Handlers.ts
  var doesBcxAllowsTalking = /* @__PURE__ */ __name(() => {
    const isRuleWorking = /* @__PURE__ */ __name((ruleName) => {
      const rule = window.bcx?.getModApi(ModName).getRuleState(ruleName);
      if (!rule) return false;
      switch (ruleName) {
        case "speech_forbid_open_talking":
          return rule.inEffect && rule.isEnforced;
        case "speech_limit_open_talking":
          return rule.inEffect && rule.isEnforced;
        case "speech_specific_sound":
          return rule.inEffect && rule.isEnforced && rule.customData.soundWhitelist;
        case "speech_mandatory_words":
          return rule.inEffect && rule.isEnforced && rule.customData.mandatoryWords;
        default:
          break;
      }
    }, "isRuleWorking");
    if (PlayerStorage().GlobalModule.doPreventMessageIfBcxBlock && (isRuleWorking("speech_forbid_open_talking") || isRuleWorking("speech_limit_open_talking") || isRuleWorking("speech_specific_sound") || isRuleWorking("speech_mandatory_words"))) {
      return false;
    }
    return true;
  }, "doesBcxAllowsTalking");
  var orgasmHandle = /* @__PURE__ */ __name((c) => {
    if (!PlayerStorage().GlobalModule.ResponsiveEnabled) return;
    if (!PlayerStorage().GlobalModule.responsesEnabled) return;
    if (CurrentScreen !== "ChatRoom" || !Player) return;
    if (Player.MemberNumber !== c.MemberNumber) return;
    if (!PlayerStorage().ResponsesModule.extraResponses.orgasm) return;
    if (ActivityOrgasmRuined) return;
    if (window.bcx && !doesBcxAllowsTalking()) return;
    ResponsesModule.isOrgasm = true;
    orgasmMessage();
  }, "orgasmHandle");
  var activityHandle = /* @__PURE__ */ __name((dict, entry) => {
    if (!PlayerStorage().GlobalModule.ResponsiveEnabled) return;
    if (!PlayerStorage().GlobalModule.responsesEnabled) return;
    if (CurrentScreen !== "ChatRoom" || !Player) return;
    if (dict.targetCharacter.MemberNumber !== Player.MemberNumber) return;
    if (!entry || !entry?.responses) return;
    if (!entry.selfTrigger && dict.targetCharacter.MemberNumber === dict.sourceCharacter.MemberNumber) return;
    if (window.bcx && !doesBcxAllowsTalking()) return;
    activityMessage(dict, entry);
  }, "activityHandle");
  var leaveHandle = /* @__PURE__ */ __name((data) => {
    if (!PlayerStorage().GlobalModule.ResponsiveEnabled) return;
    if (!PlayerStorage().GlobalModule.doLeaveMessage) return;
    if (CurrentScreen !== "ChatRoom" || !Player) return;
    if (!(CurrentScreen == "ChatRoom" && ChatRoomData?.Name != data.ChatRoomName)) return;
    if (window.bcx && !doesBcxAllowsTalking()) return;
    leaveMessage();
  }, "leaveHandle");

  // src/Screens/Responses.ts
  var _GuiResponses = class _GuiResponses extends GuiSubscreen {
    constructor() {
      super(...arguments);
      __publicField(this, "activityIndex", 0);
      __publicField(this, "selfAllowed", false);
      // to not call ActivityCanBeDoneOnSelf() every draw call;
      __publicField(this, "masterSet", false);
      __publicField(this, "copiedEntry", {});
    }
    get name() {
      return "responses";
    }
    get icon() {
      return "Icons/Chat.png";
    }
    get settings() {
      return super.settings;
    }
    get currentResponsesEntry() {
      let actName = this.currentAct()?.Name ?? "";
      let groupName = this.currentGroup()?.Name ?? "";
      let entry = this.getResponsesEntry(actName, groupName);
      return entry;
    }
    get activities() {
      if (!Player.FocusGroup) return [];
      else
        return AssetActivitiesForGroup("Female3DCG", Player.FocusGroup.Name, "any").filter(
          (a) => this.getActivityLabelTag(a, Player.FocusGroup)
        );
    }
    get multipageStructure() {
      return [
        [],
        [
          {
            type: "text",
            id: "extra_low",
            label: "responses.setting.low_response.name",
            description: "responses.setting.low_response.desc",
            setting: /* @__PURE__ */ __name(() => _GuiResponses.stringListShow(this.settings?.extraResponses?.low), "setting"),
            setSetting: /* @__PURE__ */ __name((val) => {
              this.settings.extraResponses.low = _GuiResponses.validateInput(val) ?? this.settings.extraResponses.low;
            }, "setSetting")
          },
          {
            type: "text",
            id: "extra_light",
            label: "responses.setting.light_response.name",
            description: "responses.setting.light_response.desc",
            setting: /* @__PURE__ */ __name(() => _GuiResponses.stringListShow(this.settings?.extraResponses?.light), "setting"),
            setSetting: /* @__PURE__ */ __name((val) => {
              this.settings.extraResponses.light = _GuiResponses.validateInput(val) ?? this.settings.extraResponses.light;
            }, "setSetting")
          },
          {
            type: "text",
            id: "extra_medium",
            label: "responses.setting.medium_response.name",
            description: "responses.setting.medium_response.desc",
            setting: /* @__PURE__ */ __name(() => _GuiResponses.stringListShow(this.settings?.extraResponses?.medium), "setting"),
            setSetting: /* @__PURE__ */ __name((val) => {
              this.settings.extraResponses.medium = _GuiResponses.validateInput(val) ?? this.settings.extraResponses.medium;
            }, "setSetting")
          },
          {
            type: "text",
            id: "extra_hot",
            label: "responses.setting.hot_response.name",
            description: "responses.setting.hot_response.desc",
            setting: /* @__PURE__ */ __name(() => _GuiResponses.stringListShow(this.settings?.extraResponses?.hot), "setting"),
            setSetting: /* @__PURE__ */ __name((val) => {
              this.settings.extraResponses.hot = _GuiResponses.validateInput(val) ?? this.settings.extraResponses.hot;
            }, "setSetting")
          },
          {
            type: "text",
            id: "extra_orgasm",
            label: "responses.setting.orgasm_response.name",
            description: "responses.setting.orgasm_response.desc",
            setting: /* @__PURE__ */ __name(() => _GuiResponses.stringListShow(this.settings?.extraResponses?.orgasm), "setting"),
            setSetting: /* @__PURE__ */ __name((val) => {
              this.settings.extraResponses.orgasm = _GuiResponses.validateInput(val) ?? this.settings.extraResponses.orgasm;
            }, "setSetting")
          }
        ]
      ];
    }
    static activityCanBeDoneOnSelf(activity, group) {
      return activity?.TargetSelf ? (typeof activity.TargetSelf === "boolean" ? activity.Target : activity.TargetSelf).includes(group) : false;
    }
    /**
     * Whether an activity can be performed on others / only on self / both.
     * @param {Activity} activity
     * @returns {{ onOthers: boolean, onSelf: boolean, selfOnly: boolean, othersOnly: boolean }}
     */
    static activityTargetMode(activity) {
      const onOthers = Array.isArray(activity.Target) && activity.Target.length > 0;
      const onSelf = activity.TargetSelf === true || Array.isArray(activity.TargetSelf) && activity.TargetSelf.length > 0;
      return {
        onOthers,
        onSelf,
        selfOnly: onSelf && !onOthers,
        othersOnly: onOthers && !onSelf
      };
    }
    Load() {
      if (!this.settings) conDebug(`Loading Responses GUI`);
      super.Load();
      ElementCreateTextArea("mainResponses");
      this.elementHide("mainResponses");
      CharacterAppearanceForceUpCharacter = Player.MemberNumber ?? -1;
    }
    Run() {
      let prev = MainCanvas.textAlign;
      MainCanvas.textAlign = "left";
      super.Run();
      if (PreferencePageCurrent == 1) {
        for (let Group of AssetGroup) {
          if (Group.IsItem() && !Group.MirrorActivitiesFrom && AssetActivitiesForGroup("Female3DCG", Group.Name).length)
            DrawAssetGroupZone(Player, Group.Zone, 0.9, 50, 50, 1, "#808080FF", 3, this.getZoneColor(Group.Name));
        }
        if (Player.FocusGroup != null) {
          let activity = this.activities[this.activityIndex ?? 0];
          DrawAssetGroupZone(Player, Player.FocusGroup.Zone, 0.9, 50, 50, 1, "cyan");
          MainCanvas.textAlign = "center";
          DrawBackNextButton(
            550,
            this.getYPos(0),
            600,
            64,
            this.getActivityLabel(activity, Player.FocusGroup),
            "White",
            "",
            () => "",
            () => ""
          );
          MainCanvas.textAlign = "left";
          if (!!activity) {
            let image = "Assets/" + Player.AssetFamily + "/Activity/" + activity.Name + ".png";
            if (activity.Name.indexOf("Item") > -1) {
              image = "Icons/Dress.png";
            }
            DrawImageResize(image, 1170, this.getYPos(0) - 28, 120, 120);
            DrawEmptyRect(1170, this.getYPos(0) - 28, 120, 120, "Black", 2);
            this.drawActivityOptions();
          }
        } else {
          DrawText(getText("responses.text.select_zone"), this.getXPos(0), this.getYPos(0), "Black", "White");
        }
      }
      if (PreferencePageCurrent == 2) this.elementHide("mainResponses");
      MainCanvas.textAlign = prev;
    }
    Click() {
      let tmp = GuiSubscreen.START_X;
      GuiSubscreen.START_X = 550;
      super.Click();
      if (PreferencePageCurrent == 1) {
        for (const Group of AssetGroup) {
          if (Group.IsItem() && !Group.MirrorActivitiesFrom && AssetActivitiesForGroup("Female3DCG", Group.Name).length) {
            const Zone = Group.Zone.find((z) => DialogClickedInZone(Player, z, 0.9, 50, 50, 1));
            if (Zone) {
              if (Player.FocusGroup) this.saveResponseEntry(this.currentResponsesEntry);
              if (Player.FocusGroup === Group) return this.deselectEntry();
              Player.FocusGroup = Group;
              let activities = this.activities;
              if (this.activityIndex >= activities.length) this.activityIndex = 0;
              this.loadResponseEntry(this.currentResponsesEntry);
            }
          }
        }
        if (Player.FocusGroup != null) {
          let activities = this.activities;
          if (MouseIn(this.getXPos(0), this.getYPos(0), 600, 64)) {
            this.saveResponseEntry(this.currentResponsesEntry);
            if (MouseX <= this.getXPos(0) + 300) this.activityIndex = (activities.length + this.activityIndex - 1) % activities.length;
            else this.activityIndex = (this.activityIndex + 1) % activities.length;
            this.loadResponseEntry(this.currentResponsesEntry);
          }
        }
        this.handleActivityEntryClick();
      }
      GuiSubscreen.START_X = tmp;
    }
    Exit() {
      this.saveResponseEntry(this.currentResponsesEntry);
      ElementRemove("mainResponses");
      CharacterAppearanceForceUpCharacter = -1;
      CharacterLoadCanvas(Player);
      Player.FocusGroup = null;
      super.Exit();
    }
    currentAct() {
      return this.activities[this.activityIndex];
    }
    currentGroup() {
      return Player.FocusGroup;
    }
    getZoneColor(groupName) {
      let hasConfiguration = this.settings?.mainResponses?.some((a) => a.groupName.includes(groupName));
      return hasConfiguration ? "#00FF0044" : "#80808044";
    }
    getResponsesEntry(actName, grpName) {
      return this.settings?.mainResponses?.find((a) => a.actName == actName && a.groupName.includes(grpName));
    }
    getActivityLabelTag(activity, group) {
      let groupName = group.Name;
      if (Player.HasPenis()) {
        if (groupName == "ItemVulva") groupName = "ItemPenis";
        if (groupName == "ItemVulvaPiercings") groupName = "ItemGlans";
      }
      const targetMode = _GuiResponses.activityTargetMode(activity);
      if (targetMode.selfOnly) {
        return `Label-ChatSelf-${groupName}-${activity.Name}`;
      } else {
        return `Label-ChatOther-${groupName}-${activity.Name}`;
      }
    }
    getActivityLabel(activity, group) {
      if (!activity) return "ACTIVITY NOT FOUND";
      let tag = this.getActivityLabelTag(activity, group);
      return ActivityDictionaryText(tag);
    }
    deselectEntry() {
      Player.FocusGroup = null;
      this.elementHide("mainResponses");
    }
    loadResponseEntry(entry) {
      this.elementSetValue("mainResponses", _GuiResponses.stringListShow(entry?.responses) ?? []);
    }
    saveResponseEntry(entry) {
      let responses = ElementValue("mainResponses");
      let merge = false;
      let unmerge = false;
      const validResponses = _GuiResponses.validateInput(responses);
      if (responses != "" && validResponses) {
        if (!entry) entry = this.createEntryIfNeeded(entry);
        if (!this.masterSet) {
          merge = this.mergeEntry(entry, validResponses);
          unmerge = this.unmergeEntry(entry, validResponses);
        }
        if (this.masterSet || !(merge || unmerge)) entry.responses = validResponses ?? entry.responses;
        this.settings.mainResponses.sort((a, b) => a.actName.localeCompare(b.actName));
      }
    }
    clearEntry(entry) {
      if (!entry) return;
      let temp = this.settings?.mainResponses?.find((ent) => ent.actName === entry.actName && ent.groupName === entry.groupName);
      if (temp?.groupName?.length && temp.groupName.length <= 1) {
        this.settings.mainResponses = this.settings?.mainResponses.filter((a) => {
          return !(a.actName == entry.actName && a.groupName == entry.groupName);
        });
      } else {
        const currentGroupName = this.currentGroup()?.Name;
        if (currentGroupName) {
          temp?.groupName?.splice(temp?.groupName?.indexOf(currentGroupName), 1);
        }
      }
      this.elementSetValue("mainResponses", []);
    }
    /**
     * Get entry >
     *
     * find response that has same `actName`, that doesn't includes current `groupName` and responses are the same with current entry >
     *
     * push `groupName` to that response >
     *
     * clear current entry
     */
    mergeEntry(entry, validResponses) {
      const stringifiedValidResponses = JSON.stringify(validResponses);
      let mergingEntry = this.settings?.mainResponses?.find((ent) => {
        const currentGroupName2 = this.currentGroup()?.Name;
        if (!currentGroupName2) return false;
        return ent.actName == this.currentAct().Name && // Actions are same
        !ent.groupName.includes(currentGroupName2) && // Group array don't have selected group
        (JSON.stringify(ent.responses) === stringifiedValidResponses || // Responses are the same
        ent.selfTrigger === entry.selfTrigger);
      });
      if (!mergingEntry) return false;
      const currentGroupName = this.currentGroup()?.Name;
      if (!currentGroupName) return false;
      mergingEntry.groupName.push(currentGroupName);
      const entr = this.settings?.mainResponses?.find((ent) => ent.actName === entry.actName && ent.groupName === entry.groupName);
      entr?.groupName?.splice(entr?.groupName?.indexOf(currentGroupName), 1);
      this.clearEntry(entry);
      return true;
    }
    /**
     * Get entry >
     *
     * find response that has same `actName`, that includes current `groupName` and responses are not the same with current entry >
     *
     * remove `groupName` from that response >
     *
     * create new entry with this data
     */
    unmergeEntry(entry, validResponses) {
      const stringifiedCurrentResponses = JSON.stringify(validResponses);
      let unmergingEntry = this.settings?.mainResponses?.find((ent) => {
        const currentGroupName2 = this.currentGroup()?.Name;
        if (!currentGroupName2) return false;
        return ent.actName == this.currentAct().Name && // Actions are same
        Array.isArray(ent.groupName) && // Group name is type of array
        ent.groupName.length > 1 && // Group array has more than one entry
        ent.groupName.includes(currentGroupName2) && // Group array has selected group
        (JSON.stringify(ent.responses) !== stringifiedCurrentResponses || // Responses are not the same
        ent.selfTrigger !== entry.selfTrigger);
      });
      if (!unmergingEntry) return false;
      const currentGroupName = this.currentGroup()?.Name;
      if (!currentGroupName) return false;
      unmergingEntry.groupName.splice(unmergingEntry.groupName.indexOf(currentGroupName), 1);
      const newEntry = this.createNewEntry(this.currentAct().Name, currentGroupName, validResponses, entry.selfTrigger);
      this.settings.mainResponses.push(newEntry);
      return true;
    }
    createNewEntry(actName, grpName, responses, selfTrigger) {
      return {
        actName,
        groupName: [grpName],
        responses: responses ?? [""],
        selfTrigger: selfTrigger ?? false
      };
    }
    createEntryIfNeeded(existing) {
      if (!existing) {
        existing = this.createNewEntry(this.currentAct()?.Name, this.currentGroup()?.Name ?? "");
        this.settings.mainResponses.push(existing);
        this.loadResponseEntry(this.currentResponsesEntry);
      }
      return existing;
    }
    copyEntry(entry) {
      this.copiedEntry = entry;
    }
    pasteEntry(entry) {
      if (Object.keys(this.copiedEntry).length === 0) return;
      if (!entry) entry = this.createEntryIfNeeded(entry);
      entry.responses = this.copiedEntry.responses ?? [""];
      this.loadResponseEntry(entry);
      const currentGroupName = this.currentGroup()?.Name;
      if (!currentGroupName) return;
      if (_GuiResponses.activityCanBeDoneOnSelf(this.currentAct(), currentGroupName))
        entry.selfTrigger = this.copiedEntry.selfTrigger;
    }
    handleActivityEntryClick() {
      let entry = this.currentResponsesEntry;
      const currentGroupName = this.currentGroup()?.Name;
      if (!currentGroupName) return;
      this.selfAllowed = _GuiResponses.activityCanBeDoneOnSelf(this.currentAct(), currentGroupName);
      if (!!entry && MouseIn(1310, this.getYPos(0), 64, 64)) {
        this.clearEntry(entry);
      }
      if (MouseIn(1385, this.getYPos(0), 64, 64)) {
        this.copyEntry(entry);
      }
      if (MouseIn(1455, this.getYPos(0), 64, 64)) {
        this.pasteEntry(entry);
      }
      if (MouseIn(this.getXPos(2) + 600, this.getYPos(2) - 32, 64, 64) && this.selfAllowed) {
        entry = this.createEntryIfNeeded(entry);
        entry.selfTrigger = !entry.selfTrigger;
      }
      if (MouseIn(this.getXPos(8) + 600, this.getYPos(8) - 32, 64, 64)) {
        this.masterSet = !this.masterSet;
      }
    }
    drawActivityOptions() {
      let activityEntry = this.currentResponsesEntry;
      if (!!activityEntry) {
        MainCanvas.textAlign = "center";
        DrawButton(1310, this.getYPos(0), 64, 64, "X", "White", void 0, getText("responses.text.clear_entry"));
        MainCanvas.textAlign = "left";
      }
      MainCanvas.textAlign = "center";
      DrawButton(1385, this.getYPos(0), 64, 64, "", "White", void 0, getText("responses.text.copy_entry"));
      DrawImageResize("Icons/Export.png", 1385, this.getYPos(0), 64, 64);
      MainCanvas.textAlign = "left";
      MainCanvas.textAlign = "center";
      DrawButton(1455, this.getYPos(0), 64, 64, "", "White", void 0, getText("responses.text.paste_entry"));
      DrawImageResize("Icons/Import.png", 1455, this.getYPos(0), 64, 64);
      MainCanvas.textAlign = "left";
      this.drawCheckbox(
        "responses.setting.self_trigger.name",
        "responses.setting.self_trigger.desc",
        activityEntry?.selfTrigger ?? false,
        2,
        !this.selfAllowed
      );
      this.drawCheckbox("responses.setting.master_set.name", "responses.setting.master_set.desc", this.masterSet ?? false, 8);
      this.elementPosition("mainResponses", "responses.setting.responses.name", "responses.setting.responses.desc", 3, false);
    }
    elementSetValue(elementId, value) {
      let element = document.getElementById(elementId);
      if (!!element && value != null) element.value = value;
    }
    elementPosition(elementId, label, description, order, disabled = false) {
      var isHovering = MouseIn(this.getXPos(order), this.getYPos(order) - 32, 600, 64);
      const isValid = !!_GuiResponses.validateInput(ElementValue(elementId));
      DrawTextFit(
        isValid ? `${getText(label)}` : `${getText(label)} \u2716`,
        this.getXPos(order),
        this.getYPos(order),
        600,
        isHovering ? "Red" : "Black",
        "Gray"
      );
      ElementPosition(elementId, this.getXPos(order) + 750 + 225, this.getYPos(order), 800, 64);
      if (disabled) ElementSetAttribute(elementId, "disabled", "true");
      if (!disabled) document.getElementById(elementId)?.removeAttribute("disabled");
      if (isHovering) this.tooltip(getText(description));
    }
  };
  __name(_GuiResponses, "GuiResponses");
  __publicField(_GuiResponses, "validateInput", /* @__PURE__ */ __name((input) => {
    let raw = `[${input}]`;
    const validateStringList = /* @__PURE__ */ __name((input2) => {
      if (!Array.isArray(input2)) return void 0;
      if (!input2.every((_) => typeof _ === "string")) return void 0;
      return input2;
    }, "validateStringList");
    try {
      let data = JSON.parse(raw);
      return validateStringList(data);
    } catch (e) {
      return void 0;
    }
  }, "validateInput"));
  __publicField(_GuiResponses, "stringListShow", /* @__PURE__ */ __name((input) => {
    if (!input || input.length === 0) return "";
    let result = JSON.stringify(input);
    return result.substring(1, result.length - 1);
  }, "stringListShow"));
  var GuiResponses = _GuiResponses;

  // src/Utilities/DefaultResponsesEntries.ts
  var DefaultResponses = {
    pain: ["Aie!", "Aoouch!", "Aaaaie!", "Ouch", "Aow"],
    tickle: ["Hahaha!", "Mmmmhahaha!", "Muhahah...", "Ha!Ha!"],
    boop: ["Eek!", "Beep!", "Aww.."],
    low: ["", "", "mh", "\u2665oh\u2665", "ah", "...\u2665"],
    light: ["ah\u2665", "Aah!", "mh", "oh!\u2665", "mh\u2665"],
    medium: ["mm", "aaaah", "Mm.. Ah\u2665"],
    hot: ["nh... ah\u2665", "Oooh", "mmmmmh!", "HaaA\u2665"],
    orgasm: ["Mh...Mn...HaaAAaah!", "Mmmmh... MMmh... Hhhmmmm...", "Oooooh... Mmmmh... OooOOOOh!", "Mmmhnn... Nyhmm... aah!"]
  };
  var setData = /* @__PURE__ */ __name((key) => {
    let oldSettings = null;
    if (Player?.OnlineSettings?.BCResponsive?.data) {
      oldSettings = JSON.parse(
        //@ts-ignore
        LZString.decompressFromBase64(Player?.OnlineSettings?.BCResponsive?.data)
      );
    }
    return oldSettings ? oldSettings?.[key] ? oldSettings?.[key] : DefaultResponses[key] : DefaultResponses[key];
  }, "setData");
  function getDefaultResponsesEntries() {
    return {
      mainResponses: [
        {
          actName: "Pet",
          groupName: ["ItemNose"],
          responses: setData("boop"),
          selfTrigger: false
        },
        {
          actName: "LSCG_SharkBite",
          groupName: ["ItemNose"],
          responses: setData("boop"),
          selfTrigger: false
        },
        {
          actName: "Slap",
          groupName: ["ItemVulva", "ItemVulvaPiercings", "ItemBreast", "ItemHead"],
          responses: setData("pain"),
          selfTrigger: true
        },
        {
          actName: "Bite",
          groupName: [
            "ItemFeet",
            "ItemLegs",
            "ItemButt",
            "ItemTorso",
            "ItemTorso2",
            "ItemNipples",
            "ItemBreast",
            "ItemArms",
            "ItemHands",
            "ItemNeck",
            "ItemMouth",
            "ItemNose",
            "ItemEars",
            "ItemBoots"
          ],
          responses: setData("pain"),
          selfTrigger: true
        },
        {
          actName: "Spank",
          groupName: ["ItemFeet", "ItemLegs", "ItemButt", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemArms", "ItemHands", "ItemBoots"],
          responses: setData("pain"),
          selfTrigger: true
        },
        {
          actName: "Kick",
          groupName: ["ItemFeet", "ItemLegs", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemBoots"],
          responses: setData("pain")
        },
        {
          actName: "Pinch",
          groupName: ["ItemButt", "ItemPelvis", "ItemNipples", "ItemArms", "ItemMouth", "ItemNose", "ItemEars"],
          responses: setData("pain"),
          selfTrigger: true
        },
        {
          actName: "SpankItem",
          groupName: [
            "ItemFeet",
            "ItemLegs",
            "ItemVulva",
            "ItemVulvaPiercings",
            "ItemButt",
            "ItemPelvis",
            "ItemTorso",
            "ItemNipples",
            "ItemBreast",
            "ItemArms",
            "ItemBoots"
          ],
          responses: setData("pain"),
          selfTrigger: true
        },
        {
          actName: "ShockItem",
          groupName: [
            "ItemFeet",
            "ItemLegs",
            "ItemVulva",
            "ItemVulvaPiercings",
            "ItemButt",
            "ItemPelvis",
            "ItemTorso",
            "ItemNipples",
            "ItemBreast",
            "ItemArms",
            "ItemNeck",
            "ItemNeckAccessories",
            "ItemBoots"
          ],
          responses: setData("pain"),
          selfTrigger: true
        },
        {
          actName: "LSCG_SharkBite",
          groupName: [
            "ItemFeet",
            "ItemLegs",
            "ItemButt",
            "ItemTorso",
            "ItemNipples",
            "ItemBreast",
            "ItemArms",
            "ItemHands",
            "ItemNeck",
            "ItemEars",
            "ItemBoots"
          ],
          responses: setData("pain")
        },
        {
          actName: "Tickle",
          groupName: ["ItemFeet", "ItemLegs", "ItemPelvis", "ItemTorso", "ItemTorso2", "ItemBreast", "ItemArms", "ItemNeck", "ItemBoots"],
          responses: setData("tickle")
        },
        {
          actName: "TickleItem",
          groupName: [
            "ItemFeet",
            "ItemLegs",
            "ItemVulva",
            "ItemVulvaPiercings",
            "ItemButt",
            "ItemPelvis",
            "ItemTorso",
            "ItemNipples",
            "ItemBreast",
            "ItemArms",
            "ItemNeck",
            "ItemMouth",
            "ItemNose",
            "ItemHood",
            "ItemEars",
            "ItemBoots"
          ],
          responses: setData("tickle")
        }
      ],
      extraResponses: {
        low: setData("low"),
        light: setData("light"),
        medium: setData("medium"),
        hot: setData("hot"),
        orgasm: setData("orgasm")
      }
    };
  }
  __name(getDefaultResponsesEntries, "getDefaultResponsesEntries");

  // src/Modules/Responses.ts
  var _ResponsesModule = class _ResponsesModule extends BaseModule {
    // Just for Char Talk stuff
    get settings() {
      return super.settings;
    }
    get settingsScreen() {
      return GuiResponses;
    }
    get defaultSettings() {
      return getDefaultResponsesEntries();
    }
    Load() {
      ChatRoomRegisterMessageHandler({
        Description: "Processes activity responses",
        Priority: 320,
        Callback: /* @__PURE__ */ __name((data, sender, msg, metadata) => {
          if (data.Type !== "Activity") return false;
          const dict = activityDeconstruct(metadata ?? {});
          if (!dict) return false;
          let entry = this.getResponsesEntry(dict?.activityName, dict?.groupName);
          if (!entry) return false;
          activityHandle(dict, entry);
          return false;
        }, "Callback")
      });
      hookFunction(
        "ServerAccountBeep",
        1 /* AddBehavior */,
        (args, next) => {
          let data = args[0];
          if (!data.ChatRoomName || !ChatRoomData || data.BeepType !== "Leash") return next(args);
          if (!Player.OnlineSharedSettings?.AllowPlayerLeashing) return next(args);
          leaveHandle(data);
          next(args);
        },
        0 /* Global */
      );
      hookFunction(
        "ActivityOrgasmStart",
        0 /* Observe */,
        (args, next) => {
          orgasmHandle(args[0]);
          next(args);
        },
        0 /* Global */
      );
    }
    Run() {
    }
    getResponsesEntry(actName, grpName) {
      if (!actName || !grpName) return void 0;
      return this.settings.mainResponses.find((ent) => ent.actName === actName && ent.groupName.includes(grpName));
    }
  };
  __name(_ResponsesModule, "ResponsesModule");
  __publicField(_ResponsesModule, "isOrgasm", false);
  var ResponsesModule = _ResponsesModule;

  // src/Utilities/Messages.ts
  var BCR_CMDS = (
    /*html*/
    `
  <div class="ResponsiveMessageContent">
    <b style='color:#440171; text-shadow: 0.05em 0.05em #690092;'>BC Responsive</b>: Available commands (Clickable)
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_TOGGLE}")'>Toggle Responsive</a>
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_CHANGELOG}")'>Show Changelog</a>
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_VERSION}")'>Show Version</a><br>
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_DEBUG_DATA}")'>Debug Data</a><br>
    <br><a href='https://github.com/dDeepLb/BC-Responsive/wiki' target='_blank'><b>Open Wiki</b></a>
  </div>
  `
  );
  var BCR_NEW_VERSION = (
    /*html*/
    `
  <div class='ResponsiveMessageContent'>
    <b style='color:#690092; text-shadow: 0.05em 0.05em #440171;'>BC Responsive</b><b>: New Version!</b> [${MOD_VERSION_CAPTION}]<br>
    <br><b style='color:#CC3232; text-shadow: 0.05em 0.05em #920009;'>Please, reload your page~</b><br>
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_CHANGELOG}")'><b>Changelog (Click)</b></a>
    <br><a class="ResponsiveText" onClick='window.CommandSet("${CMD_BCR}")'><b>Show Help (Click)</b></a>
  </div>
 `
  );
  var BCR_VERSION_MSG = (
    /*html*/
    `
  <p class='ResponsiveMessageContent'>Current version of <b style='color:#690092; text-shadow: 0.05em 0.05em #440171;'>BC Responsive: v${MOD_VERSION_CAPTION}</b></p>
  `
  );
  var BCR_TOGGLE_ENABLED = (
    /*html*/
    `
    <p class='ResponsiveMessageContent'><b>BC Responsive</b> has been enabled</p>
    `
  );
  var BCR_TOGGLE_DISABLED = (
    /*html*/
    `
    <p class='ResponsiveMessageContent'><b>BC Responsive</b> has been disabled</p>
    `
  );
  var BCR_CHANGELOG = (
    /*html*/
    `
  <div class="ResponsiveMessageContent">
    <b class="ResponsiveVersion">0.6.6</b>
    <br>\u2022 Fixed CharTalk making expression stuck.
    <br>\u2022 Fixed custom actions to be displayed correctly throughout all translations.<br> 
    <br>\u2022 Fixed CharTalk to match letters in case-insensitive way.
    <br>\u2022 Limit amount of animation frames in CharTalk to 30. Long sentences or RP essays won't be animated for 10 straight minutes~<br>

    <b class="ResponsiveVersion">0.6.5</b>
    <br>\u2022 Move mod button to Extensions Settings. Preferences > Extensions > Responsive Settings.
    <br>\u2022 Fixed crash in some cases by automating data repairing.<br>

    <b class="ResponsiveVersion">0.6.4</b>
    <br>\u2022 Fixed Character Talk wasn't working.<br>
  </div>

  <br><a href='https://github.com/dDeepLb/BC-Responsive/wiki/Full-Changelog' target='_blank'><b>Full Changelog (Click)</b></a>
  `
  );
  function sendLocalSmart(id, message, timeoutInSeconds) {
    const div = document.createElement("div");
    div.id = id;
    div.setAttribute("class", "ChatMessage ResponsiveMessage");
    div.setAttribute("data-time", ChatRoomCurrentTime());
    div.setAttribute("data-sender", Player?.MemberNumber + "");
    div.innerHTML = message.replaceAll("\n	", "") + /*html*/
    `<br><a class="ResponsiveText" onClick='document.getElementById("${id}").remove();'><b>Close (Click)</b></a>`;
    ChatRoomAppendChat(div);
    if (!timeoutInSeconds) return;
    setTimeout(() => div?.remove(), timeoutInSeconds * 1e3);
  }
  __name(sendLocalSmart, "sendLocalSmart");

  // src/Modules/Version.ts
  var _VersionModule = class _VersionModule extends BaseModule {
    Load() {
      hookFunction(
        "ChatRoomSync",
        0 /* Observe */,
        (args, next) => {
          next(args);
          _VersionModule.sendNewVersionMessage();
        },
        0 /* Global */
      );
    }
    Run() {
    }
    static isNewVersion(current, candidate) {
      if (current !== void 0) {
        const CURRENT_ = current.split("."), CANDIDATE_ = candidate.split(".");
        for (let i = 0; i < 3; i++) {
          if (CURRENT_[i] === CANDIDATE_[i]) {
            continue;
          }
          return CANDIDATE_[i] > CURRENT_[i];
        }
      }
      if (current === void 0 || current === "" || !current) {
        return true;
      }
      return false;
    }
    static sendNewVersionMessage() {
      if (PlayerStorage().GlobalModule.doShowNewVersionMessage && _VersionModule.isItNewVersion) {
        sendLocalSmart("ResponsiveNewVersion", BCR_NEW_VERSION);
      }
    }
    static saveVersion() {
      if (PlayerStorage()) {
        PlayerStorage().Version = "0.6.6";
      }
    }
    static loadVersion() {
      if (PlayerStorage()?.Version) {
        return PlayerStorage().Version;
      }
      return;
    }
    static checkIfNewVersion() {
      let LoadedVersion = _VersionModule.loadVersion();
      if (_VersionModule.isNewVersion(LoadedVersion, "0.6.6")) {
        _VersionModule.isItNewVersion = true;
      }
      _VersionModule.saveVersion();
    }
  };
  __name(_VersionModule, "VersionModule");
  __publicField(_VersionModule, "isItNewVersion", false);
  var VersionModule = _VersionModule;

  // src/Utilities/Commands.ts
  function loadCommands() {
    CommandCombine({
      Tag: CMD_BCR,
      Description: ": To open the Responsive commands overview.",
      Action: /* @__PURE__ */ __name((args, command, parsed) => {
        switch (args) {
          case "toggle":
            const data = PlayerStorage().GlobalModule;
            data.ResponsiveEnabled = !data.ResponsiveEnabled;
            if (data.ResponsiveEnabled) {
              sendLocalSmart("bcr_toggle_enb", BCR_TOGGLE_ENABLED, MT.INFO);
            }
            if (!data.ResponsiveEnabled) {
              sendLocalSmart("bcr_toggle_dis", BCR_TOGGLE_DISABLED, MT.INFO);
            }
            break;
          case "changelog":
            sendLocalSmart("bcr_clog", BCR_CHANGELOG);
            break;
          case "version":
            sendLocalSmart("bcr_ver", BCR_VERSION_MSG, MT.INFO);
            break;
          case "debug-data":
            navigator.clipboard.writeText(LZString.compressToBase64(JSON.stringify(Player.Responsive)));
            break;
          default:
            sendLocalSmart("bcr_cmds", BCR_CMDS, MT.COMMANDS);
            break;
        }
      }, "Action")
    });
  }
  __name(loadCommands, "loadCommands");

  // src/Responsive.ts
  function initWait() {
    conLog("Init wait");
    if (CurrentScreen == null || CurrentScreen === "Login") {
      hookFunction("LoginResponse", 0, (args, next) => {
        conDebug(`Init! LoginResponse caught: `, args);
        next(args);
        const response = args[0];
        if (response && typeof response.Name === "string" && typeof response.AccountName === "string") {
          init();
        }
      });
    } else {
      conLog(`Already logged in, init`);
      init();
    }
  }
  __name(initWait, "initWait");
  async function init() {
    if (window.ResponsiveLoaded) return;
    await Localization.load();
    injectStyle(main_default, "bcr_style");
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
  __name(init, "init");
  function initModules() {
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
    conLog("Modules Loaded.");
    return true;
  }
  __name(initModules, "initModules");
  function unload() {
    unloadModules();
    delete window.ResponsiveLoaded;
    conLog("Unloaded.");
    return true;
  }
  __name(unload, "unload");
  function unloadModules() {
    for (const m of modules()) {
      m.Unload();
    }
  }
  __name(unloadModules, "unloadModules");
  initWait();
  return __toCommonJS(Responsive_exports);
})();
//# sourceMappingURL=main.js.map
