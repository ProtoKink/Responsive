import { BaseSubscreen, getText, layout, modules, advElement, SubscreenOptions } from 'bc-deeplib/deeplib';
import { dataErase, dataResetForManual, modStorage } from '../utilities/data';

export class GuiReset extends BaseSubscreen {
  get name(): string {
    return 'reset';
  }

  protected static override subscreenOptions: SubscreenOptions = {
    name: 'reset',
    drawCharacter: false,
    doShowExitButton: false,
    doShowTitle: false,
  };

  private doResetForManualSettings: boolean = false;

  private doResetSettings: boolean = true;
  private doResetResponses: boolean = true;
  private doResetProfiles: boolean = false;

  load() {
    super.load();
    let timeToConfirm = 5;

    ElementCreate({
      tag: 'div',
      classList: ['rsp-reset-container'],
      attributes: {
        id: 'rsp-reset-container'
      },
      children: [
        advElement.createLabel({
          id: 'themed-reset-label-perma_reset_of_mod_data',
          label: getText('reset.label.perma_reset_of_mod_data'),
        }),
        {
          tag: 'br'
        },
        advElement.createLabel({
          id: 'themed-reset-label-warning',
          label: getText('reset.label.warning'),
        }),
        advElement.createLabel({
          id: 'themed-reset-label-if_u_confirm_perma_reset',
          label: getText('reset.label.if_u_confirm_perma_reset'),
        }),
        {
          tag: 'br'
        },
        advElement.createLabel({
          id: 'themed-reset-label-youll_able_to_use_mod',
          label: getText('reset.label.youll_able_to_use_mod'),
        }),
        {
          tag: 'br'
        },
        advElement.createLabel({
          id: 'themed-reset-label-action_cannot_be_undone',
          label: getText('reset.label.action_cannot_be_undone'),
        }),
        {
          tag: 'br'
        },
        {
          tag: 'div',
          attributes: {
            id: 'rsp-reset-buttons-container'
          },
          children: [
            advElement.createButton({
              id: 'rsp-reset-button',
              onClick: () => {
                this.confirm();
                timer?.();
              },
              options: {
                label: `${getText('reset.button.confirm')} (${timeToConfirm})`,
              },
              disabled: true
            }),
            advElement.createButton({
              id: 'rsp-cancel-button',
              onClick: () => {
                this.exit();
                timer?.();
              },
              options: {
                label: getText('reset.button.cancel')
              }
            })
          ]
        }
      ],
      parent: layout.getSubscreen(),
    });

    const timer = TimerCreate(() => {
      timeToConfirm--;
      const button = ElementWrap('rsp-reset-button') as HTMLButtonElement | null;
      const buttonLabel = button?.querySelector('.button-label');

      if (buttonLabel) {
        buttonLabel.textContent = `${getText('reset.button.confirm')} (${timeToConfirm})`;
      }

      if (timeToConfirm <= 0) {
        if (button && buttonLabel) {
          button.disabled = false;
          buttonLabel.textContent = getText('reset.button.confirm');
        }

        timer();
      }
    }, 1000, true, 'universal');
  }

  resize(onLoad?: boolean): void {
    super.resize(onLoad);
    ElementSetPosition('rsp-reset-container', 500, 175, 'top-left');
    ElementSetSize('rsp-reset-container', 1000, null);
  }

  confirm() {

    if (this.doResetForManualSettings) {
      dataResetForManual();
    } else {
      dataErase(this.doResetSettings, this.doResetResponses, this.doResetProfiles);

      for (const module of modules()) {
        module.registerDefaultSettings(modStorage.playerStorage);
      }
    }

    PreferenceOpenSubscreen('Extensions').then(() => {
      PreferenceSubscreenExtensionsClear();
    });
  }
}
