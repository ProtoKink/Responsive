import { advElement, BaseSubscreen, domUtil, exportToGlobal, getText, layout, Modal, SettingElement, SubscreenOptions } from "bc-deeplib/deeplib";
import { ResponsesEntryModel, ResponsesSettingsModel } from "../models/responses";

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
});

export class GuiResponses extends BaseSubscreen {
  static instance: GuiResponses;

  activityIndex: number = 0;
  currentEntry: ResponsesEntryModel | undefined;
  selfAllowed: boolean = false; // to not call ActivityCanBeDoneOnSelf() every draw call;
  masterSet: boolean = false;
  copiedEntry = <ResponsesEntryModel>{};
  focusGroup: AssetItemGroup | undefined;

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

  get currentResponsesEntry(): ResponsesEntryModel | undefined {
    let actName = this.currentAct()?.Name ?? "";
    let groupName = this.currentGroup()?.Name;
    let entry = this.getResponsesEntry(actName, groupName);
    return entry;
  }

  get activities(): Activity[] {
    if (!GuiResponses.instance.focusGroup) return [];
    else
      return AssetActivitiesForGroup("Female3DCG", GuiResponses.instance.focusGroup.Name, "any").filter((a) =>
        this.activityHasDictionaryText(this.getActivityLabelTag(a, GuiResponses.instance.focusGroup!))
      );
  }

  get pageStructure(): SettingElement[][] {
    return [
      [],
      [
        {
          type: "text",
          id: "extra_low",
          label: "responses.setting.low_response.name",
          description: "responses.setting.low_response.desc",
          setElementValue: () => GuiResponses.stringListShow(this.settings?.extraResponses?.low),
          setSettingValue: (val) => {
            this.settings.extraResponses.low = GuiResponses.validateInput(val) ?? this.settings.extraResponses.low;
          }
        },
        {
          type: "text",
          id: "extra_light",
          label: "responses.setting.light_response.name",
          description: "responses.setting.light_response.desc",
          setElementValue: () => GuiResponses.stringListShow(this.settings?.extraResponses?.light),
          setSettingValue: (val) => {
            this.settings.extraResponses.light = GuiResponses.validateInput(val) ?? this.settings.extraResponses.light;
          }
        },
        {
          type: "text",
          id: "extra_medium",
          label: "responses.setting.medium_response.name",
          description: "responses.setting.medium_response.desc",
          setElementValue: () => GuiResponses.stringListShow(this.settings?.extraResponses?.medium),
          setSettingValue: (val) => {
            this.settings.extraResponses.medium = GuiResponses.validateInput(val) ?? this.settings.extraResponses.medium;
          }
        },
        {
          type: "text",
          id: "extra_hot",
          label: "responses.setting.hot_response.name",
          description: "responses.setting.hot_response.desc",
          setElementValue: () => GuiResponses.stringListShow(this.settings?.extraResponses?.hot),
          setSettingValue: (val) => {
            this.settings.extraResponses.hot = GuiResponses.validateInput(val) ?? this.settings.extraResponses.hot;
          }
        },
        {
          type: "text",
          id: "extra_orgasm",
          label: "responses.setting.orgasm_response.name",
          description: "responses.setting.orgasm_response.desc",
          setElementValue: () => GuiResponses.stringListShow(this.settings?.extraResponses?.orgasm),
          setSettingValue: (val) => {
            this.settings.extraResponses.orgasm = GuiResponses.validateInput(val) ?? this.settings.extraResponses.orgasm;
          }
        }
      ]
    ];
  }

  static validateInput = (input: string) => {
    let raw = `[${input}]`;

    const validateStringList = (input: any) => {
      if (!Array.isArray(input)) return undefined;
      if (!(input as any[]).every((_) => typeof _ === "string")) return undefined;
      return input as string[];
    };

    try {
      let data = JSON.parse(raw);
      return validateStringList(data);
    } catch (e) {
      return undefined;
    }
  };

  static stringListShow = (input: string[]) => {
    if (!input || input.length === 0) return "";
    let result = JSON.stringify(input);
    return result.substring(1, result.length - 1);
  };

  static activityCanBeDoneOnSelf(activity: ActivityName, group: AssetGroupItemName): boolean {
    const foundActivity = AssetAllActivities(Player.AssetFamily).find((act) => act.Name === activity);

    return foundActivity?.TargetSelf
      ? (typeof foundActivity.TargetSelf === "boolean" ? foundActivity.Target : foundActivity.TargetSelf).includes(group)
      : false;
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
  }

  run() {
    super.run();

    if (BaseSubscreen.currentPage == 1) {
      domUtil.unhide(selector.entrySettingForm);
      // Draws all the available character zones
      for (let Group of AssetGroup) {
        if (Group.IsItem() && !Group.MirrorActivitiesFrom && AssetActivitiesForGroup("Female3DCG", Group.Name).length) {
          const isActive = GuiResponses.instance.focusGroup == Group;
          if (isActive) continue;
          DrawAssetGroupZone(Player, Group.Zone, 0.9, 50, 50, 1, "#606060FF", 1, GuiResponses.instance.getZoneColor(Group.Name));
        }
      }

      if (GuiResponses.instance.focusGroup != null) {
        const group = GuiResponses.instance.focusGroup;
        DrawAssetGroupZone(Player, group.Zone, 0.9, 50, 50, 1, "cyan", 1, GuiResponses.instance.getZoneColor(group.Name));

        MainCanvas.textAlign = "left";
      } else {
        // DrawText(getText("responses.text.select_zone"), this.getXPos(0), this.getYPos(0), "Black", "White");
      }
    } else if (BaseSubscreen.currentPage == 2) {
      domUtil.hide(selector.entrySettingForm);
    }
  }

  click() {
    super.click();

    if (BaseSubscreen.currentPage == 1) {
      for (const Group of AssetGroup) {
        if (!Group.IsItem() || Group.MirrorActivitiesFrom || !AssetActivitiesForGroup("Female3DCG", Group.Name).length) continue;

        const Zone = Group.Zone.find((z) => DialogClickedInZone(Player, z, 0.9, 50, 50, 1));
        if (!Zone) continue;

        this.currentEntry = this.currentResponsesEntry
        if (GuiResponses.instance.focusGroup) this.saveResponseEntry(this.currentEntry);
        if (GuiResponses.instance.focusGroup === Group) return this.deselectEntry();
        GuiResponses.instance.focusGroup = Group;
        if (GuiResponses.instance.focusGroup) {
          this.toggleEntrySettingForm();
          this.renderEntrySettingForm();
        }
        let activities = this.activities;
        if (this.activityIndex >= activities.length) this.activityIndex = 0;
        this.currentEntry = this.currentResponsesEntry
        // this.loadResponseEntry(this.currentEntry);
      }

      this.handleActivityEntryClick();
    }
  }

  exit() {
    GuiResponses.instance.settings.mainResponses = this.settings.mainResponses.filter((a) => a.responses.length > 0);
    this.saveResponseEntry(this.currentEntry);
    this.currentEntry = undefined;
    GuiResponses.instance.focusGroup = null;

    super.exit();
  }

  currentAct() {
    return this.activities[this.activityIndex];
  }

  currentGroup() {
    return GuiResponses.instance.focusGroup;
  }

  getZoneColor(groupName: AssetGroupItemName): string {
    const hasConfiguration = this.settings?.mainResponses?.some((a) => a.groupName.includes(groupName));
    const isCurrentGroup = this.currentGroup()?.Name == groupName;

    if (isCurrentGroup) return "#44ffff44";
    else if (hasConfiguration) return "#00FF0044";
    else return "#80808044";
  }

  getResponsesEntry(actName: string, grpName: AssetGroupItemName): ResponsesEntryModel | undefined {
    return this.settings?.mainResponses?.find((a) => a.actName == actName && a.groupName.includes(grpName));
  }

  activityHasDictionaryText(KeyWord: string) {
    if (!ActivityDictionary) ActivityDictionaryLoad();
    if (!ActivityDictionary) return;

    for (let D = 0; D < ActivityDictionary.length; D++) if (ActivityDictionary[D][0] == KeyWord) return true;
    return false;
  }

  getActivityLabelTag(activity: Activity, group: AssetGroup): `Label-ChatOther-${string}-${string}` {
    let groupName = group.Name as AssetGroupItemName | "ItemPenis" | "ItemGlans";
    if (Player.HasPenis()) {
      if (groupName == "ItemVulva") groupName = "ItemPenis";
      if (groupName == "ItemVulvaPiercings") groupName = "ItemGlans";
    }

    return `Label-ChatOther-${groupName}-${activity.Name}`;
  }

  getActivityLabel(activity: Activity, group: AssetGroup) {
    if (!activity) return "ACTIVITY NOT FOUND";

    let tag = this.getActivityLabelTag(activity, group);

    return ActivityDictionaryText(tag);
  }

  deselectEntry() {
    GuiResponses.instance.focusGroup = undefined;
    GuiResponses.instance.currentEntry = undefined;
    this.toggleEntrySettingForm();
  }

  saveResponseEntry(entry: ResponsesEntryModel | undefined) {
    let responses = ElementValue("mainResponses");
    let merge: boolean;
    let unmerge: boolean;
    const validResponses = GuiResponses.validateInput(responses);

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

  clearEntry(entry: ResponsesEntryModel) {
    if (!entry) return;
    let temp = this.settings?.mainResponses?.find((ent) => ent.actName === entry.actName && ent.groupName === entry.groupName);

    if (temp?.groupName.length <= 1) {
      this.settings.mainResponses = this.settings?.mainResponses.filter((a) => {
        return !(a.actName == entry.actName && a.groupName == entry.groupName);
      });
    } else {
      temp?.groupName?.splice(temp?.groupName?.indexOf(this.currentGroup()?.Name), 1);
    }
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
  mergeEntry(entry: ResponsesEntryModel, validResponses: string[]) {
    // Responses we entered into Responses field
    const stringifiedValidResponses = JSON.stringify(validResponses);

    // Looking for entry to merge, if any
    let mergingEntry = this.settings?.mainResponses?.find((ent) => {
      return (
        ent.actName == this.currentAct().Name && // Actions are same
        !ent.groupName.includes(this.currentGroup().Name) && // Group array don't have selected group
        (JSON.stringify(ent.responses) === stringifiedValidResponses || // Responses are the same
          ent.selfTrigger === entry.selfTrigger) // Self trigger from current entry is same with one that we found
      );
    });

    if (!mergingEntry) return false; // We didn't find entry that fullfils our needs. We don't need to merge

    mergingEntry.groupName.push(this.currentGroup()?.Name);

    const entr = this.settings?.mainResponses?.find((ent) => ent.actName === entry.actName && ent.groupName === entry.groupName);
    entr?.groupName?.splice(entr?.groupName?.indexOf(this.currentGroup()?.Name), 1);

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
  unmergeEntry(entry: ResponsesEntryModel, validResponses: string[]) {
    // Responses we entered into Responses field
    const stringifiedCurrentResponses = JSON.stringify(validResponses);

    // Looking for entry to unmerge, if any
    let unmergingEntry = this.settings?.mainResponses?.find((ent) => {
      return (
        ent.actName == this.currentAct().Name && // Actions are same
        Array.isArray(ent.groupName) && // Group name is type of array
        ent.groupName.length > 1 && // Group array has more than one entry
        ent.groupName.includes(this.currentGroup().Name) && // Group array has selected group
        (JSON.stringify(ent.responses) !== stringifiedCurrentResponses || // Responses are not the same
          ent.selfTrigger !== entry.selfTrigger) // Self trigger from current entry not same with one that we found
      );
    });

    if (!unmergingEntry) return false; // We didn't find entry that fullfils our needs. We don't need to unmerge

    unmergingEntry.groupName.splice(unmergingEntry.groupName.indexOf(this.currentGroup()?.Name), 1);

    const newEntry = this.createNewEntry(this.currentAct().Name, this.currentGroup().Name, validResponses, entry.selfTrigger);
    this.settings.mainResponses.push(newEntry);

    return true;
  }

  createNewEntry(actName: string, grpName: string, responses?: string[], selfTrigger?: boolean): ResponsesEntryModel {
    return <ResponsesEntryModel>{
      actName: actName,
      groupName: [grpName],
      responses: responses ?? [""],
      selfTrigger: selfTrigger ?? false
    };
  }

  createEntryIfNeeded(existing: ResponsesEntryModel | undefined): ResponsesEntryModel {
    if (!existing) {
      existing = this.createNewEntry(this.currentAct()?.Name, this.currentGroup()?.Name ?? "");
      this.settings.mainResponses.push(existing);
      // this.loadResponseEntry(this.currentEntry);
    }

    return existing;
  }

  copyEntry(entry: ResponsesEntryModel | undefined) {
    this.copiedEntry = structuredClone(entry) as ResponsesEntryModel;
  }

  pasteEntry(entry: ResponsesEntryModel | undefined) {
    if (Object.keys(this.copiedEntry).length === 0) return;
    if (!entry) entry = this.createEntryIfNeeded(entry);

    entry.responses = this.copiedEntry.responses ?? [""];
    // this.loadResponseEntry(entry);
    if (GuiResponses.activityCanBeDoneOnSelf(this.currentAct()?.Name, this.currentGroup()?.Name))
      entry.selfTrigger = this.copiedEntry.selfTrigger;
  }

  handleActivityEntryClick() {
    let entry = this.currentEntry;
    this.selfAllowed = GuiResponses.activityCanBeDoneOnSelf(this.currentAct()?.Name, this.currentGroup()?.Name);

    // Clear Entry
    if (!!entry && MouseIn(1310, 280, 64, 64)) {
      this.clearEntry(entry);
    }

    if (MouseIn(1385, 280, 64, 64)) {
      this.copyEntry(entry);
    }

    if (MouseIn(1455, 280, 64, 64)) {
      this.pasteEntry(entry);
    }
  }

  drawActivityOptions() {
    let activityEntry = this.currentEntry;

    if (!!activityEntry) {
      MainCanvas.textAlign = "center";
      DrawButton(1310, 280, 64, 64, "X", "White", undefined, getText("responses.text.clear_entry"));
      MainCanvas.textAlign = "left";
    }

    MainCanvas.textAlign = "center";
    DrawButton(1385, 280, 64, 64, "", "White", undefined, getText("responses.text.copy_entry"));
    DrawImageResize("Icons/Export.png", 1385, 280, 64, 64);
    MainCanvas.textAlign = "left";

    MainCanvas.textAlign = "center";
    DrawButton(1455, 280, 64, 64, "", "White", undefined, getText("responses.text.paste_entry"));
    DrawImageResize("Icons/Import.png", 1455, 280, 64, 64);
    MainCanvas.textAlign = "left";
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

    const selfTriggerCheckbox = advElement.createCheckbox({
      id: selector.entrySelfTrigger,
      label: getText('responses.setting.self_trigger.name'),
      description: getText('responses.setting.self_trigger.desc'),
      setElementValue: () => entry.selfTrigger,
      setSettingValue: (val) => entry.selfTrigger = val,
      disabled: !GuiResponses.activityCanBeDoneOnSelf(this.currentAct()?.Name, this.currentGroup()?.Name)
    })

    const masterSetCheckbox = advElement.createCheckbox({
      id: selector.entryMasterSet,
      label: getText('responses.setting.master_set.name'),
      description: getText('responses.setting.master_set.desc'),
      setElementValue: () => GuiResponses.instance.masterSet,
      setSettingValue: (val) => GuiResponses.instance.masterSet = val,
    })
        let activity = GuiResponses.instance.activities[GuiResponses.instance.activityIndex ?? 0];

        if (!!activity) {
          let image = "Assets/" + Player.AssetFamily + "/Activity/" + activity.Name + ".png";
          if (activity.Name.indexOf("Item") > -1) {
            image = "Icons/Dress.png";
          }
          DrawImageResize(image, 1170, 280 - 28, 120, 120);
          DrawEmptyRect(1170, 280 - 28, 120, 120, "Black", 2);
          GuiResponses.instance.drawActivityOptions();
        }

    const settings = ElementCreate({
      tag: 'div',
      attributes: {
        id: selector.settingsDiv
      },
      classList: [selector.entryDiv],
      children: [
        this.buildActivityDropdown(),
        selfTriggerCheckbox,
        masterSetCheckbox
      ]
    });

    return [
      settings,
      this.buildResponsesList(),
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
      return ({
        attributes: {
          value: index,
          label: this.getActivityLabel(act, GuiResponses.instance.focusGroup),
          selected: index === GuiResponses.instance.activityIndex
        }
      }) as Omit<HTMLOptions<"option">, "tag">
    })

    const dropdown = advElement.createDropdown({
      id: selector.activityDropdown,
      optionsList: options,
      setSettingValue: function (value) {
        GuiResponses.instance.saveResponseEntry(GuiResponses.instance.currentResponsesEntry);
        GuiResponses.instance.activityIndex = CommonParseNumber(value);
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

  buildResponsesList() {
    let responseEntry = this.getResponsesEntry(this.currentAct()?.Name, this.currentGroup()?.Name);

    if (!responseEntry) 
      responseEntry = this.createEntryIfNeeded(responseEntry);

    const responses = responseEntry.responses.filter((r) => !!r);

    return ElementCreate({
      tag: 'div',
      attributes: {
        id: selector.responsesNav
      },
      classList: [selector.entryDiv],
      children: [
        advElement.createButton({
          id: selector.responseAddButton,
          onClick: function () {
            Modal.prompt(getText('responses.prompt')).then((response) => {
              if (!response) return;

              responseEntry.responses.push(response);
              GuiResponses.instance.renderResponsesList();
            })
          },
          options: {
            image: "Icons/Plus.png",
            label: "Add Response",
          },
        }),
        {
          tag: 'div',
          classList: ['scroll-box'],
          attributes: {
            id: selector.responsesList
          },
          children: [
            ...responses.map((response, index) => {
              return advElement.createButton({
                id: `${selector.responseButton}-${index}`,
                options: {
                  label: response,
                  tooltip: 'Click to edit',
                },
                htmlOptions: {
                  button: {
                    classList: [selector.responseEntryButton],
                  }
                },
                onClick: function () {
                  Modal.prompt(getText('responses.prompt'), response).then((newResponse) => {
                    if (!newResponse) responseEntry.responses.splice(index, 1)
                    else responseEntry.responses[index] = newResponse;

                    GuiResponses.instance.renderResponsesList();
                  })
                }
              });
            })
          ],
        }
      ]
    });
  }

  renderResponsesList() {
    const responsesList = document.getElementById(selector.responsesNav) as HTMLDivElement;
    responsesList.innerHTML = '';
    responsesList.append(...this.buildResponsesList().children);
  }
}

exportToGlobal("GuiResponses", GuiResponses);