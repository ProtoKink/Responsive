import { GuiSubscreen } from "../base/base_setting";
import { dataErase, dataResetForManual } from "../utilities/data";
import { getText } from "../translation";

export class GuiReset extends GuiSubscreen {
  get name(): string {
    return "reset";
  }

  get icon(): string {
    return "";
  }

  private allowedConfirmTime: number = 0 as never;

  private doResetForManualSettings: boolean = false;

  private doResetSettings: boolean = true;
  private doResetResponses: boolean = true;
  private doResetProfiles: boolean = false;

  Load() {
    this.allowedConfirmTime = Date.now() + 10_000;
    super.Load();
  }

  Run() {
    GuiSubscreen.POS_BAK = GuiSubscreen.START_X;
    GuiSubscreen.TEXT_ALIGN_BAK = MainCanvas.textAlign;

    GuiSubscreen.START_X = 180;
    MainCanvas.textAlign = "center";

    DrawText(getText(`reset.label.perma_reset_of_bcr_data`), 1000, 125, "Black");

    DrawText(getText(`reset.label.warning`), 1000, 225, "Black", "Black");
    DrawText(getText(`reset.label.if_u_confirm_perma_reset`), 1000, 325, "Black");

    DrawText(getText(`reset.label.youll_able_to_use_bcr`), 1000, 375, "Gray");

    DrawText(getText(`reset.label.action_cannot_be_undone`), 1000, 425, "Red", "Black");

    const now = Date.now();
    if (now < this.allowedConfirmTime) {
      DrawButton(
        1000,
        690,
        200,
        80,
        `${getText("reset.button.confirm")} (${Math.floor((this.allowedConfirmTime - now) / 1000)})`,
        "#ddd",
        undefined,
        undefined,
        true
      );
    } else {
      DrawButton(1000, 690, 200, 80, getText("reset.button.confirm"), "White");
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
    if (this.allowedConfirmTime === null as never) return;

    if (MouseIn(1520, 690, 200, 80)) return this.Exit();

    if (MouseIn(1000, 690, 200, 80) && Date.now() >= this.allowedConfirmTime) return this.Confirm();

    if (MouseIn(this.getXPos(4) + 600, this.getYPos(4) - 32, 64, 64)) return (this.doResetForManualSettings = !this.doResetForManualSettings);
    if (MouseIn(this.getXPos(6) + 600, this.getYPos(6) - 32, 64, 64) && !this.doResetForManualSettings)
      return (this.doResetSettings = !this.doResetSettings);
    if (MouseIn(this.getXPos(7) + 600, this.getYPos(7) - 32, 64, 64) && !this.doResetForManualSettings)
      return (this.doResetResponses = !this.doResetResponses);
    if (MouseIn(this.getXPos(8) + 800, this.getYPos(8) - 32, 64, 64) && !this.doResetForManualSettings)
      return (this.doResetProfiles = !this.doResetProfiles);
  }

  Confirm() {
    this.allowedConfirmTime = null as never;
    if (this.doResetForManualSettings) {
      dataResetForManual();
    } else {
      dataErase(this.doResetSettings, this.doResetResponses, this.doResetProfiles);
    }
    this.setSubscreen(null);
    PreferenceSubscreenExtensionsClear();
  }
}
