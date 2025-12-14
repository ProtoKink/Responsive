import { advElement, BaseSubscreen, exportToGlobal, getText, layout, Modal, SettingElement, SubscreenOptions } from 'bc-deeplib/deeplib';
import { ExtraType, BehaviorsEntryModel, BehaviorsSettingsModel } from '../models/behaviors';
import { BehaviorsModule } from '../modules/behaviors';
import { activityCanBeDoneOnSelf, getActivities, getActivityLabel } from '../utilities/activities';

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

  activityIndex: number = 0;
  copiedEntry: BehaviorsEntryModel | undefined = undefined;
  focusGroup: AssetItemGroup = AssetGroupGet('Female3DCG', 'ItemArms') as AssetItemGroup;
  deleteMode: boolean = false;
  doNotShowConfirmation: boolean = false;
  selectedExtra: ExtraType = 'low';
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

  get currentEntry(): BehaviorsEntryModel | undefined {
    const actName = this.currentActivity?.Name;
    const groupName = this.currentGroup?.Name;

    if (!actName || !groupName) return undefined;

    const entry = this.module.getResponsesEntry(actName, groupName);
    return entry;
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
            children: this.buildEntrySettingForm(),
            parent: layout.getSubscreen()
          },
          position: [520, 180],
          size: () => GuiBehaviors.instance.focusGroup ? [1280, 720] : [0, 0],
        },
        {
          type: 'custom',
          id: selector.entryHelpingNav,
          htmlOptions: {
            tag: 'nav',
            children: [
              advElement.createButton({
                id: selector.clearEntryButton,
                onClick: () => this.clearEntry(),
                options: {
                  image: `${PUBLIC_URL}/images/cross.svg`,
                  tooltip: getText('responses.text.clear_entry')
                },
                size: [90, 90],
              }),
              advElement.createButton({
                id: selector.copyEntryButton,
                onClick: () => this.copyEntry(),
                options: {
                  image: `${PUBLIC_URL}/images/copy.svg`,
                  tooltip: getText('responses.text.copy_entry')
                },
                size: [90, 90],
              }),
              advElement.createButton({
                id: selector.pasteEntryButton,
                onClick: () => this.pasteEntry(),
                options: {
                  image: `${PUBLIC_URL}/images/paste.svg`,
                  tooltip: getText('responses.text.paste_entry')
                },
                size: [90, 90],
              })
            ],
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
            children: this.buildExtraEntrySettingForm(),
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

    if (BaseSubscreen.currentPage === 1) {
      // Draws all the available character zones
      for (const Group of AssetGroup) {
        if (Group.IsItem() && !Group.MirrorActivitiesFrom && AssetActivitiesForGroup('Female3DCG', Group.Name).length) {
          const isActive = GuiBehaviors.instance.focusGroup === Group;
          if (isActive) continue;
          DrawAssetGroupZone(Player, Group.Zone, 0.9, 50, 50, 1, '#606060FF', 1, GuiBehaviors.instance.getZoneColor(Group.Name));
        }
      }

      if (GuiBehaviors.instance.focusGroup) {
        const group = GuiBehaviors.instance.focusGroup;
        DrawAssetGroupZone(Player, group.Zone, 0.9, 50, 50, 1, 'cyan', 1, GuiBehaviors.instance.getZoneColor(group.Name));

        MainCanvas.textAlign = 'left';
      } else {
        // DrawText(getText("responses.text.select_zone"), this.getXPos(0), this.getYPos(0), "Black", "White");
      }
    }
  }

  click() {
    super.click();

    if (BaseSubscreen.currentPage === 1) {
      for (const Group of AssetGroup) {
        if (!Group.IsItem() || Group.MirrorActivitiesFrom || !AssetActivitiesForGroup('Female3DCG', Group.Name).length) continue;

        const Zone = Group.Zone.find((z) => DialogClickedInZone(Player, z, 0.9, 50, 50, 1));
        if (!Zone) continue;

        const activities = getActivities(this.focusGroup);
        if (this.activityIndex >= activities.length) this.activityIndex = 0;

        if (GuiBehaviors.instance.focusGroup !== Group) this.saveResponseEntry(this.currentEntry);
        GuiBehaviors.instance.focusGroup = Group;
        if (GuiBehaviors.instance.focusGroup) {
          this.buildEntrySettingForm();
        }
        // this.loadResponseEntry(this.currentEntry);
      }
    }
  }

  exit() {
    GuiBehaviors.instance.settings.mainResponses = this.settings.mainResponses.filter((a) => a.responses.length > 0 && a.responses.some((r) => !!r));
    this.saveResponseEntry(this.currentEntry);
    GuiBehaviors.instance.focusGroup = AssetGroupGet('Female3DCG', 'ItemArms') as AssetItemGroup;
    GuiBehaviors.instance.activityIndex = 0;
    GuiBehaviors.instance.copiedEntry = undefined;
    GuiBehaviors.instance.deleteMode = false;
    GuiBehaviors.instance.doNotShowConfirmation = false;
    GuiBehaviors.instance.selectedExtra = 'low';

    super.exit();
  }

  get currentActivity(): Activity | undefined {
    return getActivities(this.focusGroup)[this.activityIndex];
  }

  get currentGroup(): AssetItemGroup | undefined {
    const group = GuiBehaviors.instance.focusGroup;

    if (!group?.IsItem()) return;

    return group;
  }

  getZoneColor(groupName: AssetGroupItemName): string {
    const hasConfiguration = this.settings?.mainResponses?.some((a) => a.groupName.includes(groupName));
    const isCurrentGroup = this.currentGroup?.Name === groupName;

    if (isCurrentGroup) return '#44ffff44';
    else if (hasConfiguration) return '#00FF0044';
    else return '#80808044';
  }

  // #region Entry Actions

  saveResponseEntry(entry: BehaviorsEntryModel | undefined) {
    entry ??= this.currentEntry;

    if (!entry) return;

    const responses = entry.responses ?? [];

    if (responses.filter(r => !!r).length > 0) {
      if (!entry) entry = this.module.createEntryIfNeeded(entry, this.currentActivity, this.currentGroup);

      this.settings.mainResponses.sort((a, b) => a.actName.localeCompare(b.actName));
    } else {
      this.clearEntry(entry);
    }
  }

  clearEntry(entry?: BehaviorsEntryModel) {
    entry ??= this.currentEntry;

    if (!entry) return ToastManager.error('No entry to clear');

    if (entry?.groupName.length <= 1) {
      this.settings.mainResponses = this.settings?.mainResponses.filter((a) => {
        return !(a.actName === entry.actName && a.groupName === entry.groupName);
      });
    } else if (entry?.groupName.length > 1 && this.currentGroup?.Name) {
      entry?.groupName?.splice(entry?.groupName?.indexOf(this.currentGroup?.Name), 1);
    }

    this.buildEntrySettingForm();
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
  unmergeEntry(entry: BehaviorsEntryModel, validResponses: string[]) {
    // Responses we entered into Responses field
    const stringifiedCurrentResponses = JSON.stringify(validResponses);

    // Looking for entry to unmerge, if any
    const unmergingEntry = this.settings?.mainResponses?.find((ent) => {
      return (
        ent.actName === this.currentActivity?.Name && // Actions are same
        Array.isArray(ent.groupName) && // Group name is type of array
        ent.groupName.length > 1 && // Group array has more than one entry
        ent.groupName.includes(this.currentGroup!.Name) && // Group array has selected group
        (JSON.stringify(ent.responses) !== stringifiedCurrentResponses || // Responses are not the same
          ent.selfTrigger !== entry.selfTrigger) // Self trigger from current entry not same with one that we found
      );
    });

    if (!unmergingEntry) return false; // We didn't find entry that fullfils our needs. We don't need to unmerge

    if (!this.currentActivity?.Name || !this.currentGroup?.Name) return false;

    unmergingEntry.groupName.splice(unmergingEntry.groupName.indexOf(this.currentGroup.Name), 1);

    const newEntry = this.module.createNewEntry(this.currentActivity.Name, this.currentGroup.Name, validResponses, entry.selfTrigger);
    this.settings.mainResponses.push(newEntry);

    return true;
  }

  copyEntry(entry?: BehaviorsEntryModel | undefined) {
    entry ??= GuiBehaviors.instance.currentEntry;

    if (!entry) return ToastManager.error('No entry to copy');

    GuiBehaviors.instance.copiedEntry = structuredClone(entry) as BehaviorsEntryModel;

    ToastManager.success('Entry copied');
  }

  pasteEntry(entry?: BehaviorsEntryModel | undefined) {
    entry ??= GuiBehaviors.instance.currentEntry;

    if (!entry) return;

    if (!GuiBehaviors.instance.copiedEntry) return ToastManager.error('No entry to paste to');

    if (Object.keys(GuiBehaviors.instance.copiedEntry).length === 0) return;
    if (!entry) entry = this.module.createEntryIfNeeded(entry, this.currentActivity, this.currentGroup);

    if (!entry) return;

    entry.responses = GuiBehaviors.instance.copiedEntry.responses ?? [];
    // GuiResponses.instance.loadResponseEntry(entry);
    if (activityCanBeDoneOnSelf(GuiBehaviors.instance.currentActivity?.Name, GuiBehaviors.instance.currentGroup?.Name))
      entry.selfTrigger = GuiBehaviors.instance.copiedEntry.selfTrigger;

    GuiBehaviors.instance.buildEntrySettingForm();

    ToastManager.success('Entry pasted');
  }

  // #endregion Entry Actions

  // #region Main Responses Entry Form

  buildEntrySettingForm() {
    let entry = GuiBehaviors.instance.currentEntry;

    if (!entry) {
      entry = this.module.createEntryIfNeeded(entry, this.currentActivity, this.currentGroup);
    }

    if (!entry) return [];

    const entrySettingForm = ElementWrap(selector.entrySettingForm) as HTMLDivElement | null;
    if (entrySettingForm)
      entrySettingForm.innerHTML = '';

    const isActivityCanBeDoneOnSelf = activityCanBeDoneOnSelf(this.currentActivity?.Name, this.currentGroup?.Name);

    const selfTriggerCheckbox = advElement.createCheckbox({
      id: selector.entrySelfTrigger,
      label: getText('responses.setting.self_trigger.name'),
      description: getText('responses.setting.self_trigger.desc'),
      setElementValue: () => isActivityCanBeDoneOnSelf && entry?.selfTrigger,
      setSettingValue: (val) => entry.selfTrigger = val,
      disabled: !isActivityCanBeDoneOnSelf
    });

    const settings = ElementCreate({
      tag: 'div',
      attributes: {
        id: selector.settingsDiv
      },
      classList: [selector.entryDiv],
      children: [
        this.buildActivityDropdown(),
        selfTriggerCheckbox,
      ]
    });

    const ret = [
      settings,
      this.buildActivityResponsesList()
    ];

    if (entrySettingForm) {
      entrySettingForm.append(
        ...ret
      );
      this.resize(false);

      return;
    } else {
      return ret;
    }
  }

  // #endregion Main Responses Entry Form

  // #region Extra Responses Entry Form

  buildExtraEntrySettingForm() {
    const entrySettingForm = ElementWrap(selector.extraSettingForm) as HTMLDivElement | null;
    if (entrySettingForm)
      entrySettingForm.innerHTML = '';

    const extra = this.selectedExtra;
    const extraTypes = Object.keys(this.settings.extraResponses) as ExtraType[];

    const dropdownOptions = extraTypes.map((et) => {
      return ({
        attributes: {
          value: et,
          label: getText(`responses.extra.${et}`),
          selected: et === extra
        }
      }) as Omit<HTMLOptions<'option'>, 'tag'>;
    });

    const dropdown = advElement.createDropdown({
      id: selector.extraDropdown,
      optionsList: dropdownOptions,
      setSettingValue: function (value) {
        GuiBehaviors.instance.selectedExtra = value as ExtraType;
        GuiBehaviors.instance.buildExtraEntrySettingForm();
      },
      label: getText('responses.extra.dropdown.label'),
      description: getText('responses.extra.dropdown.desc'),
    });

    const settings = ElementCreate({
      tag: 'div',
      attributes: {
        id: `${selector.settingsDiv}-extra`
      },
      classList: [selector.entryDiv],
      children: [
        dropdown
      ]
    });

    const ret = [
      settings,
      this.buildExtraResponsesList(extra)
    ];

    if (entrySettingForm) {
      entrySettingForm.append(
        ...ret
      );
      this.resize(false);

      return;
    } else {
      return ret;
    }
  }

  // #endregion Extra Responses Entry Form

  buildActivityDropdown() {
    const options = getActivities(this.focusGroup).map((act, index) => {
      const groupName = GuiBehaviors.instance.focusGroup?.Name ? getActivityLabel(act.Name, GuiBehaviors.instance.focusGroup?.Name) : act.Name;
      return ({
        attributes: {
          value: index,
          label: groupName,
          selected: index === GuiBehaviors.instance.activityIndex
        }
      }) as Omit<HTMLOptions<'option'>, 'tag'>;
    });

    const dropdown = advElement.createDropdown({
      id: selector.activityDropdown,
      optionsList: options,
      setSettingValue: function (value) {
        GuiBehaviors.instance.saveResponseEntry(GuiBehaviors.instance.currentEntry);
        GuiBehaviors.instance.activityIndex = CommonParseInt(value) ?? 0;
        GuiBehaviors.instance.buildEntrySettingForm();
      },
      label: getText('responses.activity.dropdown.label'),
      description: getText('responses.activity.dropdown.desc'),
    });

    return dropdown;
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

  buildActivityResponsesList() {
    if (!this.currentActivity || !this.currentGroup) return '';

    let responseEntry = this.module.getResponsesEntry(this.currentActivity?.Name, this.currentGroup?.Name);

    if (!responseEntry)
      responseEntry = this.module.createEntryIfNeeded(responseEntry, this.currentActivity, this.currentGroup);

    const responses = responseEntry?.responses;

    return this.buildResponsesList('activity', responses);
  }

  renderActivityResponsesList() {
    if (!this.currentActivity || !this.currentGroup) return;

    let responseEntry = this.module.getResponsesEntry(this.currentActivity?.Name, this.currentGroup?.Name);

    if (!responseEntry)
      responseEntry = this.module.createEntryIfNeeded(responseEntry, this.currentActivity, this.currentGroup);

    const responses = responseEntry?.responses;

    this.renderResponsesList('activity', responses);
  }

  buildExtraResponsesList(type: ExtraType) {
    const responses = this.settings.extraResponses[type];

    return this.buildResponsesList(type, responses);
  }

  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;

    ElementWrap(selector.deleteModeToggle)?.toggleAttribute('data-delete-mode', this.deleteMode);
    if (BaseSubscreen.currentPage === 1)
      this.buildEntrySettingForm();
    if (BaseSubscreen.currentPage === 2)
      this.buildExtraEntrySettingForm();
  }
}

exportToGlobal('GuiResponses', GuiBehaviors);