import { advElement, BaseSubscreen, domUtil, exportToGlobal, getModule, getText, layout, Modal, SettingElement, SubscreenOptions } from 'bc-deeplib/deeplib';
import { ExtraType, ResponsesEntryModel, ResponsesSettingsModel } from '../models/responses';
import { ResponsesModule } from '../modules/responses';
import { logger } from '../utilities/definition';

const selector = Object.freeze({
  entrySettingForm: 'rsp-entry-setting-form',
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
});

export class GuiResponses extends BaseSubscreen {
  static instance: GuiResponses;

  activityIndex: number = 0;
  copiedEntry: ResponsesEntryModel | undefined = undefined;
  focusGroup: AssetItemGroup | undefined = undefined;
  deleteMode: boolean = false;
  doNotShowConfirmation: boolean = false;

  protected static override subscreenOptions: SubscreenOptions = {
    name: 'responses',
    icon: 'Icons/Chat.png',
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

  get activities(): Activity[] {
    if (!GuiResponses.instance.currentGroup) return [];

    const activities = AssetActivitiesForGroup('Female3DCG', GuiResponses.instance.currentGroup.Name, 'any');

    return activities
      .filter((a) => this.activityHasDictionaryText(this.getActivityLabelTag(a.Name, GuiResponses.instance.currentGroup?.Name)));
  }

  get pageStructure(): SettingElement[][] {
    return [
      [],
      [
        {
          type: 'text',
          id: 'extra_low',
          label: getText('responses.setting.low_response.name'),
          description: getText('responses.setting.low_response.desc'),
          setElementValue: () => GuiResponses.stringListShow(this.settings?.extraResponses?.low),
          setSettingValue: (val) => {
            this.settings.extraResponses.low = GuiResponses.validateInput(val) ?? this.settings.extraResponses.low;
          }
        },
        {
          type: 'text',
          id: 'extra_light',
          label: getText('responses.setting.light_response.name'),
          description: getText('responses.setting.light_response.desc'),
          setElementValue: () => GuiResponses.stringListShow(this.settings?.extraResponses?.light),
          setSettingValue: (val) => {
            this.settings.extraResponses.light = GuiResponses.validateInput(val) ?? this.settings.extraResponses.light;
          }
        },
        {
          type: 'text',
          id: 'extra_medium',
          label: getText('responses.setting.medium_response.name'),
          description: getText('responses.setting.medium_response.desc'),
          setElementValue: () => GuiResponses.stringListShow(this.settings?.extraResponses?.medium),
          setSettingValue: (val) => {
            this.settings.extraResponses.medium = GuiResponses.validateInput(val) ?? this.settings.extraResponses.medium;
          }
        },
        {
          type: 'text',
          id: 'extra_hot',
          label: getText('responses.setting.hot_response.name'),
          description: getText('responses.setting.hot_response.desc'),
          setElementValue: () => GuiResponses.stringListShow(this.settings?.extraResponses?.hot),
          setSettingValue: (val) => {
            this.settings.extraResponses.hot = GuiResponses.validateInput(val) ?? this.settings.extraResponses.hot;
          }
        },
        {
          type: 'text',
          id: 'extra_orgasm',
          label: getText('responses.setting.orgasm_response.name'),
          description: getText('responses.setting.orgasm_response.desc'),
          setElementValue: () => GuiResponses.stringListShow(this.settings?.extraResponses?.orgasm),
          setSettingValue: (val) => {
            this.settings.extraResponses.orgasm = GuiResponses.validateInput(val) ?? this.settings.extraResponses.orgasm;
          }
        }
      ]
    ];
  }

  static validateInput = (input: unknown) => {
    const raw = `[${input}]`;

    const validateStringList = (input: unknown) => {
      if (!Array.isArray(input)) return undefined;
      if (!(input as unknown[]).every((_) => typeof _ === 'string')) return undefined;
      return input as string[];
    };

    try {
      const data = JSON.parse(raw);
      return validateStringList(data);
    } catch (e) {
      return logger.error(e);
    }
  };

  static stringListShow = (input: string[]) => {
    if (!input || input.length === 0) return '';
    const result = JSON.stringify(input);
    return result.substring(1, result.length - 1);
  };

  static activityCanBeDoneOnSelf(activity: ActivityName | undefined, group: AssetGroupItemName | undefined): boolean {
    if (!activity || !group) return false;

    const activityData = AssetGetActivity(Player.AssetFamily, activity);

    if (!activityData || !activityData.TargetSelf) return false;

    const targets = typeof activityData.TargetSelf === 'boolean'
      ? activityData.Target
      : activityData.TargetSelf;

    return targets.includes(group);
  }

  load() {
    super.load();
    GuiResponses.instance = this;

    advElement.createCustom({
      id: selector.entrySettingForm,
      htmlOptions: {
        tag: 'div',
        parent: layout.getSubscreen()
      },
      position: [520, 180],
      size: () => GuiResponses.instance.focusGroup ? [1280, 720] : [0, 0],
    });

    const clearEntryButton = advElement.createButton({
      id: selector.clearEntryButton,
      onClick: () => this.clearEntry(),
      options: {
        label: 'X',
        tooltip: getText('responses.text.clear_entry')
      },
      size: [90, 90],
    });
    BaseSubscreen.menu?.prepend(clearEntryButton);

    const copyEntryButton = advElement.createButton({
      id: selector.copyEntryButton,
      onClick: () => this.copyEntry(),
      options: {
        image: 'Icons/Export.png',
        tooltip: getText('responses.text.copy_entry')
      },
      size: [90, 90],
    });
    BaseSubscreen.menu?.prepend(copyEntryButton);

    const pasteEntryButton = advElement.createButton({
      id: selector.pasteEntryButton,
      onClick: () => this.pasteEntry(),
      options: {
        image: 'Icons/Import.png',
        tooltip: getText('responses.text.paste_entry')
      },
      size: [90, 90],
    });
    BaseSubscreen.menu?.prepend(pasteEntryButton);

    const deleteModeButton = advElement.createButton({
      id: selector.deleteModeToggle,
      onClick: () => this.toggleDeleteMode(),
      options: {
        image: 'Icons/Trash.png',
        tooltip: getText('responses.text.toggle_delete_mode')
      },
      size: [90, 90],
    });
    BaseSubscreen.menu?.prepend(deleteModeButton);
  }

  run() {
    super.run();

    if (BaseSubscreen.currentPage === 1) {
      domUtil.unhide(selector.entrySettingForm);
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
    } else if (BaseSubscreen.currentPage === 2) {
      domUtil.hide(selector.entrySettingForm);
    }
  }

  click() {
    super.click();

    if (BaseSubscreen.currentPage === 1) {
      for (const Group of AssetGroup) {
        if (!Group.IsItem() || Group.MirrorActivitiesFrom || !AssetActivitiesForGroup('Female3DCG', Group.Name).length) continue;

        const Zone = Group.Zone.find((z) => DialogClickedInZone(Player, z, 0.9, 50, 50, 1));
        if (!Zone) continue;

        const activities = this.activities;
        if (this.activityIndex >= activities.length) this.activityIndex = 0;

        if (GuiResponses.instance.focusGroup) this.saveResponseEntry(this.currentEntry);
        if (GuiResponses.instance.focusGroup === Group) return this.deselectEntry();
        GuiResponses.instance.focusGroup = Group;
        if (GuiResponses.instance.focusGroup) {
          this.toggleEntrySettingForm();
          this.renderEntrySettingForm();
        }
        // this.loadResponseEntry(this.currentEntry);
      }
    }
  }

  exit() {
    GuiResponses.instance.settings.mainResponses = this.settings.mainResponses.filter((a) => a.responses.length > 0);
    this.saveResponseEntry(this.currentEntry);
    GuiResponses.instance.focusGroup = undefined;
    GuiResponses.instance.activityIndex = 0;
    GuiResponses.instance.copiedEntry = undefined;
    GuiResponses.instance.deleteMode = false;
    GuiResponses.instance.doNotShowConfirmation = false;

    super.exit();
  }

  get currentActivity(): Activity | undefined {
    return this.activities[this.activityIndex];
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

  activityHasDictionaryText(KeyWord: string | undefined): boolean {
    if (!KeyWord) return false;

    if (!ActivityDictionary) ActivityDictionaryLoad();
    if (!ActivityDictionary) return false;

    for (let D = 0; D < ActivityDictionary.length; D++) if (ActivityDictionary[D][0] === KeyWord) return true;
    return false;
  }

  getActivityLabelTag(activityName: ActivityName | undefined, groupName: $AssetGroupItemName | undefined): `Label-ChatOther-${string}-${string}` | undefined {
    if (!activityName || !groupName) return undefined;

    if (Player.HasPenis()) {
      if (groupName === 'ItemVulva') groupName = 'ItemPenis';
      if (groupName === 'ItemVulvaPiercings') groupName = 'ItemGlans';
    }

    return `Label-ChatOther-${groupName}-${activityName}`;
  }

  getActivityLabel(activity: ActivityName, group: AssetGroupItemName) {
    if (!activity || !group) return 'ACTIVITY NOT FOUND';

    const tag = this.getActivityLabelTag(activity, group);

    if (!tag) return 'ACTIVITY NOT FOUND';

    return ActivityDictionaryText(tag);
  }

  deselectEntry() {
    GuiResponses.instance.focusGroup = undefined;
    this.toggleEntrySettingForm();
  }

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

    this.renderEntrySettingForm();
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
      responses: responses ?? [''],
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

    entry.responses = GuiResponses.instance.copiedEntry.responses ?? [''];
    // GuiResponses.instance.loadResponseEntry(entry);
    if (GuiResponses.activityCanBeDoneOnSelf(GuiResponses.instance.currentActivity?.Name, GuiResponses.instance.currentGroup?.Name))
      entry.selfTrigger = GuiResponses.instance.copiedEntry.selfTrigger;

    GuiResponses.instance.renderEntrySettingForm();

    ToastManager.success('Entry pasted');
  }

  buildEntrySettingForm() {
    let entry = GuiResponses.instance.currentEntry;

    if (!GuiResponses.instance.focusGroup) {
      GuiResponses.instance.toggleEntrySettingForm();
      return [];
    }

    if (!entry) {
      entry = this.createEntryIfNeeded(entry);
    }

    if (!entry) return [];

    const activityCanBeDoneOnSelf = GuiResponses.activityCanBeDoneOnSelf(this.currentActivity?.Name, this.currentGroup?.Name);

    const selfTriggerCheckbox = advElement.createCheckbox({
      id: selector.entrySelfTrigger,
      label: getText('responses.setting.self_trigger.name'),
      description: getText('responses.setting.self_trigger.desc'),
      setElementValue: () => activityCanBeDoneOnSelf && entry?.selfTrigger,
      setSettingValue: (val) => entry.selfTrigger = val,
      disabled: !activityCanBeDoneOnSelf
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

    return [
      settings,
      this.buildActivityResponsesList(),
    ];
  }

  toggleEntrySettingForm() {
    const entrySettingForm = document.getElementById(selector.entrySettingForm) as HTMLDivElement;
    const entrySettingFormShouldBeActive = !!GuiResponses.instance.focusGroup;
    const entrySettingFormUnion = BaseSubscreen.currentElements.find((e) => e[0].id === selector.entrySettingForm);

    if (!entrySettingFormUnion) return;

    if (entrySettingFormShouldBeActive) {
      entrySettingForm.toggleAttribute('active', true);
    }


    if (!entrySettingFormShouldBeActive)
      entrySettingForm.querySelectorAll('&>*').forEach((e) => e.toggleAttribute('hidden', !entrySettingFormShouldBeActive));

    domUtil.autoSetSize(entrySettingForm, entrySettingFormUnion[1].size);

    if (entrySettingFormShouldBeActive)
      entrySettingForm.querySelectorAll('&>*').forEach((e) => e.toggleAttribute('hidden', entrySettingFormShouldBeActive));

    setTimeout(() => {
      // this trick with duplicate variable is needed to prevent hiding element with too fast clicking
      const shouldBeActive = !!GuiResponses.instance.focusGroup;
      if (!shouldBeActive) {
        entrySettingForm.toggleAttribute('active', false);
      }
    }, 500);
  }

  renderEntrySettingForm() {
    const entrySettingForm = document.getElementById(selector.entrySettingForm) as HTMLDivElement;
    entrySettingForm.innerHTML = '';
    entrySettingForm.append(...GuiResponses.instance.buildEntrySettingForm());

    this.resize(false);
  }

  buildActivityDropdown() {
    const options = this.activities.map((act, index) => {
      const groupName = GuiResponses.instance.focusGroup?.Name ? this.getActivityLabel(act.Name, GuiResponses.instance.focusGroup?.Name) : act.Name;
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
        GuiResponses.instance.renderEntrySettingForm();
      },
      label: 'Activity',
      description: 'Select an activity to respond to.',
      htmlOptions: {
        container: {
          parent: layout.getSubscreen(),
        }
      }
    });

    if (GuiResponses.instance.focusGroup) {
      domUtil.unhide(dropdown);
    } else {
      domUtil.hide(dropdown);
    }

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
      classList: [selector.entryDiv],
      children: [
        advElement.createButton({
          id: `${selector.responseAddButton}-${id}`,
          onClick: function () {
            Modal.prompt(getText('responses.prompt.add')).then((response) => {
              if (!response) return;

              responses.push(response);
              GuiResponses.instance.renderResponsesList(id, responses);
            });
          },
          options: {
            image: 'Icons/Plus.png',
            label: 'Add Response',
          },
        }),
        {
          tag: 'div',
          classList: ['scroll-box'],
          attributes: {
            id: `${selector.responsesList}-${id}`
          },
          children: [
            ...responses.map((response, index) => {
              return advElement.createButton({
                id: `${selector.responseButton}-${index}-${id}`,
                options: {
                  label: response,
                  tooltip: tooltip,
                  tooltipPosition: 'bottom',
                },
                htmlOptions: {
                  button: {
                    classList: [selector.responseEntryButton],
                    dataAttributes: {
                      deleteMode: GuiResponses.instance.deleteMode
                    }
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
                    ]);

                    if (confirmation) {
                      responses.splice(index, 1);
                      GuiResponses.instance.renderResponsesList(id, responses);
                    }
                  } else {
                    Modal.prompt(getText('responses.prompt.edit'), response).then((newResponse) => {
                      if (newResponse === '') responses.splice(index, 1);
                      else if (newResponse === response) return;
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

    const responses = responseEntry?.responses.filter((r) => !!r);

    return this.buildResponsesList('activity', responses);
  }

  renderActivityResponsesList() {
    if (!this.currentActivity || !this.currentGroup) return '';

    let responseEntry = this.getResponsesEntry(this.currentActivity?.Name, this.currentGroup?.Name);

    if (!responseEntry)
      responseEntry = this.createEntryIfNeeded(responseEntry);

    const responses = responseEntry?.responses.filter((r) => !!r);

    this.renderResponsesList('activity', responses);
  }

  buildArousalResponsesList(type: ExtraType) {
    const responses = this.settings.extraResponses[type];

    return this.buildResponsesList(type, responses);
  }

  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
    this.renderEntrySettingForm();
  }
}

exportToGlobal('GuiResponses', GuiResponses);