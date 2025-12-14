import { advElement, BaseSubscreen, exportToGlobal, getText, layout, Modal, SettingElement, SubscreenOptions } from 'bc-deeplib/deeplib';
import { BehaviorsSettingsModel } from '../models/behaviors';
import { BehaviorsModule } from '../modules/behaviors';

const selector = Object.freeze({
  entrySettingForm: 'rsp-entry-setting-form',
  entryHelpingNav: 'rsp-entry-helping-nav',
  entrySelfTrigger: 'rsp-entry-self-trigger',
  settingsDiv: 'rsp-settings-div',
  entryDiv: 'rsp-entry-div',
  activityDropdown: 'rsp-activity-dropdown',
  responsesNav: 'rsp-responses-nav',
  responseAddButton: 'rsp-response-add-button',
  entryMasterSet: 'rsp-entry-master-set',
  responseButton: 'rsp-response-entry-button',
  responsesList: 'rsp-responses-list',
  responseEntryButton: 'rsp-response-entry-button',
  entryCheckSettings: 'rsp-entry-check-settings',
  clearEntryButton: 'rsp-clear-entry-button',
  deleteModeToggle: 'rsp-delete-mode-toggle',
  copyEntryButton: 'rsp-copy-entry-button',
  pasteEntryButton: 'rsp-paste-entry-button',
  doNotShowThisAgain: 'rsp-do-not-show-confirmation',
  extraSettingForm: 'rsp-extra-setting-form',
  extraDropdown: 'rsp-extra-dropdown',
  entryFormClass: 'rsp-entry-form',
});

export class GuiBehaviors extends BaseSubscreen {
  static instance: GuiBehaviors;

  deleteMode: boolean = false;
  doNotShowConfirmation: boolean = false;
  declare module: BehaviorsModule;

  protected static override subscreenOptions: SubscreenOptions = {
    name: 'responses',
    icon: `${PUBLIC_URL}/images/chat_round_line.svg`,
    forceUpCharacter: true
  };

  get settings(): BehaviorsSettingsModel {
    return super.settings as BehaviorsSettingsModel;
  }

  set settings(val: BehaviorsSettingsModel) {
    super.settings = val;
  }

  get pageStructure(): SettingElement[][] {
    return [
      [
        {
          type: 'custom',
          id: selector.entrySettingForm,
          htmlOptions: {
            tag: 'div',
            classList: [selector.entryFormClass],
            parent: layout.getSubscreen()
          },
          position: [520, 180],
          size: () => [1280, 720],
        },
        {
          type: 'custom',
          id: selector.entryHelpingNav,
          htmlOptions: {
            tag: 'nav',
            children: [],
            parent: layout.getSubscreen()
          },
          position: [1905, 900, 'bottom-right'],
          size: () => [90, null],
        }
      ],
      [
        {
          type: 'custom',
          id: selector.extraSettingForm,
          htmlOptions: {
            tag: 'div',
            classList: [selector.entryFormClass],
            parent: layout.getSubscreen()
          },
          position: [520, 180],
          size: () => [1280, 720],
        }
      ]
    ];
  }

  load() {
    GuiBehaviors.instance = this;
    super.load();

    const deleteModeButton = advElement.createButton({
      id: selector.deleteModeToggle,
      onClick: () => this.toggleDeleteMode(),
      options: {
        image: `${PUBLIC_URL}/images/trash_bin.svg`,
        tooltip: getText('responses.text.toggle_delete_mode')
      },
      size: [90, 90],
    });
    BaseSubscreen.menu?.prepend(deleteModeButton);
  }

  run() {
    super.run();
  }

  click() {
    super.click();
  }

  exit() {
    GuiBehaviors.instance.settings.mainResponses = this.settings.mainResponses.filter((a) => a.responses.length > 0 && a.responses.some((r) => !!r));
    GuiBehaviors.instance.deleteMode = false;
    GuiBehaviors.instance.doNotShowConfirmation = false;

    super.exit();
  }

  buildResponsesList(id: string, responses: string[] = []) {
    const tooltip = this.deleteMode
      ? getText('responses.text.delete_mode')
      : getText('responses.text.edit_mode');

    return ElementCreate({
      tag: 'div',
      attributes: {
        id: `${selector.responsesNav}-${id}`
      },
      classList: [selector.entryDiv, selector.responsesNav],
      children: [
        advElement.createButton({
          id: `${selector.responseAddButton}-${id}`,
          onClick: function () {
            Modal.prompt(getText('responses.prompt.add'), { modalId: 'rsp-modal' }).then((response) => {
              if (response === null) return;

              responses.push(response);
              GuiBehaviors.instance.renderResponsesList(id, responses);
            });
          },
          options: {
            image: `${PUBLIC_URL}/images/plus.svg`,
            label: getText('responses.button.add_response'),
          },
          htmlOptions: {
            button: {
              classList: [selector.responseAddButton],
            }
          }
        }),
        {
          tag: 'div',
          classList: ['scroll-box', selector.responsesList],
          attributes: {
            id: `${selector.responsesList}-${id}`
          },
          children: [
            ...responses.map((response, index) => {
              return advElement.createButton({
                id: `${selector.responseButton}-${index}-${id}`,
                options: {
                  label: response === '' ? getText('responses.text.empty_response') : response,
                  tooltip: tooltip,
                  tooltipPosition: 'bottom',
                },
                htmlOptions: {
                  button: {
                    classList: [selector.responseEntryButton],
                    dataAttributes: {
                      deleteMode: GuiBehaviors.instance.deleteMode,
                      emptyResponse: response === ''
                    }
                  },
                  label: {
                    classList: ['truncated-text']
                  }
                },
                onClick: async function () {
                  if (GuiBehaviors.instance.deleteMode) {
                    const confirmation = GuiBehaviors.instance.doNotShowConfirmation || await Modal.confirm([
                      getText('responses.prompt.delete'),
                      advElement.createCheckbox({
                        id: selector.doNotShowThisAgain,
                        label: getText('responses.text.do_not_show_this_again_until_leaving_this_screen'),
                        setSettingValue: (val) => GuiBehaviors.instance.doNotShowConfirmation = val
                      })
                    ], { modalId: 'rsp-modal' });

                    if (confirmation) {
                      responses.splice(index, 1);
                      GuiBehaviors.instance.renderResponsesList(id, responses);
                    }
                  } else {
                    Modal.prompt(getText('responses.prompt.edit'), { defaultValue: response, modalId: 'rsp-modal' }).then((newResponse) => {
                      if (newResponse === response) return;
                      else if (newResponse === null) return;
                      else responses[index] = newResponse;

                      GuiBehaviors.instance.renderResponsesList(id, responses);
                    });
                  }
                }
              });
            })
          ],
        }
      ]
    });
  }

  renderResponsesList(id: string, responses: string[] = []) {
    const responsesList = document.getElementById(`${selector.responsesNav}-${id}`) as HTMLDivElement;
    responsesList.innerHTML = '';
    responsesList.append(...this.buildResponsesList(id, responses).children);
  }

  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
  }
}

exportToGlobal('GuiResponses', GuiBehaviors);