import { BaseModule } from "./base_module";
import { GuiSubscreen } from "./base_setting";
import { GUI } from "./setting_utils";

export const SETTING_FUNC_PREFIX: string = "PreferenceSubscreen";
export const SETTING_NAME_PREFIX: string = "BCR";
export const SETTING_FUNC_NAMES: string[] = ["Load", "Run", "Click", "Unload", "Exit"];

export type Subscreen = new (module: BaseModule) => GuiSubscreen;

export function getCurrentSubscreen(): GuiSubscreen | null {
  return GUI.instance && GUI.instance.currentSubscreen;
}

export function setSubscreen(subscreen: GuiSubscreen | string | null): GuiSubscreen | null {
  if (!GUI.instance) {
    throw new Error("Attempt to set subscreen before init");
  }
  GUI.instance.currentSubscreen = subscreen;
  return GUI.instance.currentSubscreen;
}
