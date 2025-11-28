import { advElement, BaseSubscreen, exportToGlobal, getModule, getText, layout, Modal, SettingElement, SubscreenOptions } from 'bc-deeplib/deeplib';
import { ExtraType, ResponsesEntryModel, ResponsesSettingsModel } from '../models/responses';
import { ResponsesModule } from '../modules/responses';
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

export class GuiResponses extends BaseSubscreen {
  static instance: GuiResponses;

  activityIndex: number = 0;
  copiedEntry: ResponsesEntryModel | undefined = undefined;
  focusGroup: AssetItemGroup = AssetGroupGet('Female3DCG', 'ItemArms') as AssetItemGroup;
  deleteMode: boolean = false;
  doNotShowConfirmation: boolean = false;
  selectedExtra: ExtraType = 'low';

  protected static override subscreenOptions: SubscreenOptions = {
    name: 'responses',
    icon: `${PUBLIC_URL}/images/chat_round_line.svg`,
    forceUpCharacter: true
  };

  get settings(): ResponsesSettingsModel {
    return super.settings as ResponsesSettingsModel;
  }

  set settings(val: ResponsesSettingsModel) {
    super.settings = val;
  }

  get currentEntry(): ResponsesEntryModel | undefined {
    const actName = this.currentActivity?.Name;
    const groupName = this.currentGroup?.Name;

    if (!actName || !groupName) return undefined;

    const entry = this.getResponsesEntry(actName, groupName);
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
          size: () => GuiResponses.instance.focusGroup ? [1280, 720] : [0, 0],
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
    GuiResponses.instance = this;
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
          const isActive = GuiResponses.instance.focusGroup === Group;
          if (isActive) continue;
          DrawAssetGroupZone(Player, Group.Zone, 0.9, 50, 50, 1, '#606060FF', 1, GuiResponses.instance.getZoneColor(Group.Name));
        }
      }

      if (GuiResponses.instance.focusGroup) {
        const group = GuiResponses.instance.focusGroup;
        DrawAssetGroupZone(Player, group.Zone, 0.9, 50, 50, 1, 'cyan', 1, GuiResponses.instance.getZoneColor(group.Name));

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

        if (GuiResponses.instance.focusGroup !== Group) this.saveResponseEntry(this.currentEntry);
        GuiResponses.instance.focusGroup = Group;
        if (GuiResponses.instance.focusGroup) {
          this.buildEntrySettingForm();
        }
        // this.loadResponseEntry(this.currentEntry);
      }
    }
  }

  exit() {
    GuiResponses.instance.settings.mainResponses = this.settings.mainResponses.filter((a) => a.responses.length > 0 && a.responses.some((r) => !!r));
    this.saveResponseEntry(this.currentEntry);
    GuiResponses.instance.focusGroup = AssetGroupGet('Female3DCG', 'ItemArms') as AssetItemGroup;
    GuiResponses.instance.activityIndex = 0;
    GuiResponses.instance.copiedEntry = undefined;
    GuiResponses.instance.deleteMode = false;
    GuiResponses.instance.doNotShowConfirmation = false;
    GuiResponses.instance.selectedExtra = 'low';

    super.exit();
  }

  get currentActivity(): Activity | undefined {
    return getActivities(this.focusGroup)[this.activityIndex];
  }

  get currentGroup(): AssetItemGroup | undefined {
    const group = GuiResponses.instance.focusGroup;

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

  getResponsesEntry(actName: ActivityName, grpName: AssetGroupItemName): ResponsesEntryModel | undefined {
    return getModule<ResponsesModule>('ResponsesModule').getResponsesEntry(actName, grpName);
  }

  // #region Entry Actions

  saveResponseEntry(entry: ResponsesEntryModel | undefined) {
    entry ??= this.currentEntry;

    if (!entry) return;

    const responses = entry.responses ?? [];

    if (responses.filter(r => !!r).length > 0) {
      if (!entry) entry = this.createEntryIfNeeded(entry);

      this.settings.mainResponses.sort((a, b) => a.actName.localeCompare(b.actName));
    } else {
      this.clearEntry(entry);
    }
  }

  clearEntry(entry?: ResponsesEntryModel) {
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
  unmergeEntry(entry: ResponsesEntryModel, validResponses: string[]) {
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

    const newEntry = this.createNewEntry(this.currentActivity.Name, this.currentGroup.Name, validResponses, entry.selfTrigger);
    this.settings.mainResponses.push(newEntry);

    return true;
  }

  createNewEntry(actName: ActivityName, grpName: AssetGroupItemName, responses?: string[], selfTrigger?: boolean): ResponsesEntryModel {
    return <ResponsesEntryModel>{
      actName: actName,
      groupName: [grpName],
      responses: responses ?? [],
      selfTrigger: selfTrigger ?? false
    };
  }

  createEntryIfNeeded(existing: ResponsesEntryModel | undefined): ResponsesEntryModel | undefined {
    if (!existing && this.currentActivity?.Name && this.currentGroup?.Name) {
      existing = this.createNewEntry(this.currentActivity?.Name, this.currentGroup?.Name);
      this.settings.mainResponses.push(existing);
      // this.loadResponseEntry(this.currentEntry);
    }

    return existing;
  }

  copyEntry(entry?: ResponsesEntryModel | undefined) {
    entry ??= GuiResponses.instance.currentEntry;

    if (!entry) return ToastManager.error('No entry to copy');

    GuiResponses.instance.copiedEntry = structuredClone(entry) as ResponsesEntryModel;

    ToastManager.success('Entry copied');
  }

  pasteEntry(entry?: ResponsesEntryModel | undefined) {
    entry ??= GuiResponses.instance.currentEntry;

    if (!entry) return;

    if (!GuiResponses.instance.copiedEntry) return ToastManager.error('No entry to paste to');

    if (Object.keys(GuiResponses.instance.copiedEntry).length === 0) return;
    if (!entry) entry = GuiResponses.instance.createEntryIfNeeded(entry);

    if (!entry) return;

    entry.responses = GuiResponses.instance.copiedEntry.responses ?? [];
    // GuiResponses.instance.loadResponseEntry(entry);
    if (activityCanBeDoneOnSelf(GuiResponses.instance.currentActivity?.Name, GuiResponses.instance.currentGroup?.Name))
      entry.selfTrigger = GuiResponses.instance.copiedEntry.selfTrigger;

    GuiResponses.instance.buildEntrySettingForm();

    ToastManager.success('Entry pasted');
  }

  // #endregion Entry Actions

  // #region Main Responses Entry Form

  buildEntrySettingForm() {
    let entry = GuiResponses.instance.currentEntry;

    if (!entry) {
      entry = this.createEntryIfNeeded(entry);
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
        GuiResponses.instance.selectedExtra = value as ExtraType;
        GuiResponses.instance.buildExtraEntrySettingForm();
      },
      label: 'Extra Response',
      description: 'Select an extra response to respond to.',
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
      const groupName = GuiResponses.instance.focusGroup?.Name ? getActivityLabel(act.Name, GuiResponses.instance.focusGroup?.Name) : act.Name;
      return ({
        attributes: {
          value: index,
          label: groupName,
          selected: index === GuiResponses.instance.activityIndex
        }
      }) as Omit<HTMLOptions<'option'>, 'tag'>;
    });

    const dropdown = advElement.createDropdown({
      id: selector.activityDropdown,
      optionsList: options,
      setSettingValue: function (value) {
        GuiResponses.instance.saveResponseEntry(GuiResponses.instance.currentEntry);
        GuiResponses.instance.activityIndex = CommonParseInt(value) ?? 0;
        GuiResponses.instance.buildEntrySettingForm();
      },
      label: 'Activity',
      description: 'Select an activity to respond to.',
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
              GuiResponses.instance.renderResponsesList(id, responses);
            });
          },
          options: {
            image: `${PUBLIC_URL}/images/plus.svg`,
            label: 'Add Response',
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
                      deleteMode: GuiResponses.instance.deleteMode,
                      emptyResponse: response === ''
                    }
                  },
                  label: {
                    classList: ['truncated-text']
                  }
                },
                onClick: async function () {
                  if (GuiResponses.instance.deleteMode) {
                    const confirmation = GuiResponses.instance.doNotShowConfirmation || await Modal.confirm([
                      getText('responses.prompt.delete'),
                      advElement.createCheckbox({
                        id: selector.doNotShowThisAgain,
                        label: getText('responses.text.do_not_show_this_again_until_leaving_this_screen'),
                        setSettingValue: (val) => GuiResponses.instance.doNotShowConfirmation = val
                      })
                    ], { modalId: 'rsp-modal' });

                    if (confirmation) {
                      responses.splice(index, 1);
                      GuiResponses.instance.renderResponsesList(id, responses);
                    }
                  } else {
                    Modal.prompt(getText('responses.prompt.edit'), { defaultValue: response, modalId: 'rsp-modal' }).then((newResponse) => {
                      if (newResponse === response) return;
                      else if (newResponse === null) return;
                      else responses[index] = newResponse;

                      GuiResponses.instance.renderResponsesList(id, responses);
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

    let responseEntry = this.getResponsesEntry(this.currentActivity?.Name, this.currentGroup?.Name);

    if (!responseEntry)
      responseEntry = this.createEntryIfNeeded(responseEntry);

    const responses = responseEntry?.responses;

    return this.buildResponsesList('activity', responses);
  }

  renderActivityResponsesList() {
    if (!this.currentActivity || !this.currentGroup) return;

    let responseEntry = this.getResponsesEntry(this.currentActivity?.Name, this.currentGroup?.Name);

    if (!responseEntry)
      responseEntry = this.createEntryIfNeeded(responseEntry);

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

exportToGlobal('GuiResponses', GuiResponses);