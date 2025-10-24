import { Setting } from "../../.types/setting";
import { BaseSettingsModel } from "../models/base";
import { getText } from "../translation";
import { dataStore } from "../utilities/data";
import { BaseModule } from "./base_module";
import { modules } from "./modules";
import { SETTING_FUNC_NAMES, SETTING_FUNC_PREFIX, SETTING_NAME_PREFIX, setSubscreen } from "./setting_definitions";
import { GUI } from "./setting_utils";

export abstract class GuiSubscreen {
  static START_X: number = 180;
  static START_Y: number = 205;
  static X_MOD: number = 950;
  static Y_MOD: number = 75;
  static POS_BAK: number = GuiSubscreen.START_X;
  static TEXT_ALIGN_BAK: CanvasTextAlign = "left";
  readonly module!: BaseModule;

  constructor(module?: BaseModule) {
    if (module) this.module = module;

    // create each handler for a new preference subscreen
    SETTING_FUNC_NAMES.forEach((name) => {
      const fName = SETTING_FUNC_PREFIX + SETTING_NAME_PREFIX + this.name + name;
      if (typeof (<any>this)[name] === "function" && typeof (<any>window)[fName] !== "function")
        (<any>window)[fName] = () => {
          (<any>this)[name]();
        };
    });
  }

  get name(): string {
    return "UNKNOWN";
  }

  get icon(): string {
    return "";
  }

  get label(): string {
    return "UNDEFINED SETTING SCREEN";
  }

  get message(): string {
    return PreferenceMessage;
  }

  set message(message: string) {
    PreferenceMessage = message;
  }

  get SubscreenName(): string {
    return SETTING_NAME_PREFIX + this.constructor.name;
  }

  setSubscreen(screen: GuiSubscreen | string | null) {
    return setSubscreen(screen);
  }

  get settings(): BaseSettingsModel {
    return this.module.settings as BaseSettingsModel;
  }

  get multipageStructure(): Setting[][] {
    return [[]];
  }

  get structure(): Setting[] {
    return this.multipageStructure[Math.min(PreferencePageCurrent - 1, this.multipageStructure.length - 1)];
  }

  get character(): Character {
    return GUI.instance?.currentCharacter as Character;
  }

  getYPos(ix: number) {
    return GuiSubscreen.START_Y + GuiSubscreen.Y_MOD * (ix % 9);
  }

  getXPos(ix: number) {
    return GuiSubscreen.START_X + GuiSubscreen.X_MOD * Math.floor(ix / 9);
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
    this.multipageStructure.forEach((s) =>
      s.forEach((item) => {
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
    GuiSubscreen.POS_BAK = GuiSubscreen.START_X;
    GuiSubscreen.TEXT_ALIGN_BAK = MainCanvas.textAlign;

    GuiSubscreen.START_X = 550;
    MainCanvas.textAlign = "left";

    DrawCharacter(Player, 50, 50, 0.9, false);
    DrawText(getText(`${this.name}.title`), GuiSubscreen.START_X, GuiSubscreen.START_Y - GuiSubscreen.Y_MOD, "Black", "#D7F6E9");
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

    GuiSubscreen.START_X = GuiSubscreen.POS_BAK;
    MainCanvas.textAlign = GuiSubscreen.TEXT_ALIGN_BAK;
  }

  Click() {
    GuiSubscreen.POS_BAK = GuiSubscreen.START_X;
    GuiSubscreen.TEXT_ALIGN_BAK = MainCanvas.textAlign;

    GuiSubscreen.START_X = 550;
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

    GuiSubscreen.START_X = GuiSubscreen.POS_BAK;
    MainCanvas.textAlign = GuiSubscreen.TEXT_ALIGN_BAK;
  }

  Exit() {
    this.multipageStructure.forEach((s) =>
      s.forEach((item) => {
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
    // Empty
  }

  tooltip(text: string) {
    drawTooltip(300, 850, 1400, text, "left");
  }

  drawCheckbox(label: string, description: string, value: boolean, order: number, disabled: boolean = false) {
    var isHovering = MouseIn(this.getXPos(order), this.getYPos(order) - 32, 600, 64);
    DrawTextFit(getText(label), this.getXPos(order), this.getYPos(order), 600, isHovering ? "Red" : "Black", "Gray");
    DrawCheckbox(this.getXPos(order) + 600, this.getYPos(order) - 32, 64, 64, "", value ?? false, disabled);
    if (isHovering) this.tooltip(getText(description));
  }

  drawBetterButton(position: number[], size: number[], label: string, color: string, image: string = "", disabled: boolean = false) {
    var isHovering = MouseIn(position[0], position[1] - 32, size[0], size[1]);
    DrawButton(position[0], position[1], size[0], size[1], "", color, "", "", disabled);
    DrawImageResize(image, position[0] + 10, position[1] + 10, 60, 60);
    DrawTextFit(getText(label), position[0] + 80, position[1] + 40, 600, isHovering ? "Red" : "Black", "Gray");
  }

  drawButton(label: string, color: string, order: number, XOffset: number, disabled: boolean = false) {
    var isHovering = MouseIn(this.getXPos(order) + XOffset, this.getYPos(order) - 32, 200, 64);
    DrawButton(this.getXPos(order) + XOffset, this.getYPos(order) - 32, 200, 64, "", color, "", "", disabled);
    DrawTextFit(getText(label), this.getXPos(order) + XOffset + 58, this.getYPos(order), 600, isHovering ? "Red" : "Black", "Gray");
  }

  elementHide(elementId: string) {
    ElementPosition(elementId, -999, -999, 1, 1);
  }

  elementPosition(elementId: string, label: string, description: string, order: number, disabled: boolean = false) {
    var isHovering = MouseIn(this.getXPos(order), this.getYPos(order) - 32, 600, 64);
    DrawTextFit(getText(label), this.getXPos(order), this.getYPos(order), 600, isHovering ? "Red" : "Black", "Gray");
    ElementPosition(elementId, this.getXPos(order) + 750 + 225, this.getYPos(order), 800, 64);
    if (disabled) ElementSetAttribute(elementId, "disabled", "true");
    if (!disabled) document.getElementById(elementId)?.removeAttribute("disabled");
    if (isHovering) this.tooltip(getText(description));
  }

  drawLabel(label: string, description: string, order: number) {
    var isHovering = MouseIn(this.getXPos(order), this.getYPos(order) - 32, 600, 64);
    DrawTextFit(getText(label), this.getXPos(order), this.getYPos(order), 600, isHovering ? "Red" : "Black", "Gray");
    if (isHovering) this.tooltip(getText(description));
  }
}

function drawTooltip(x: number, y: number, width: number, text: string, align: "left" | "center" | "right") {
  const bak = MainCanvas.textAlign;
  MainCanvas.textAlign = align;
  DrawRect(x, y, width, 65, "#ffff88");
  DrawEmptyRect(x, y, width, 65, "Black");
  DrawTextFit(text, align === "left" ? x + 3 : x + width / 2, y + 33, width - 6, "black");
  MainCanvas.textAlign = bak;
}
