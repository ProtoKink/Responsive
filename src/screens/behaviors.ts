// #region SECTION Imports & Types
import { advElement, BaseSubscreen, exportToGlobal, getText, layout, Modal, SettingElement, SubscreenOptions } from 'bc-deeplib/deeplib';
import { BehaviorsSettingsModel, Behavior, Trigger, Reaction, ConstraintMode, MatchMode, SpeechType, OrgasmType, RoomPresenceEvent, ReactionMode, TriggerTypeSchema, ReactionTypeSchema, ReactionType, TriggerType, IncludeExcludeEntry, SpeechTypeSchema, MatchModeSchema, OrgasmTypeSchema, RoomPresenceEventSchema, ReactionModeSchema, ConstraintModeSchema, IncludeExcludeEntrySchema } from '../models/behaviors';
import { BehaviorsModule } from '../modules/behaviors';
import { assertNever } from '../utilities/other';
import { activitySelectorModal, bodyPartSelectorModal, idSelectorModal, textReactionSelectorModal } from '@/utilities/selectorModals';
import { triggerHasConstraints } from '@/utilities/triggers';
import { createDropdownField, createInputField, createNumberInputField } from '@/utilities/fields';

type TabType = 'behaviors' | 'triggers' | 'reactions';
// #endregion !SECTION Imports & Types

// #region SECTION Constants
const selector = Object.freeze({
  tabContainer: 'rsp-behaviors-tab-container',
  tabButton: 'rsp-behaviors-tab-button',
  tabContent: 'rsp-behaviors-tab-content',
  listPanel: 'rsp-behaviors-list-panel',
  editorPanel: 'rsp-behaviors-editor-panel',
  listItemC: 'rsp-behaviors-list-item',
  addButton: 'rsp-behaviors-add-button',
  deleteModeToggle: 'rsp-delete-mode-toggle',
  collapsibleSection: 'rsp-behaviors-collapsible',
  collapsibleHeader: 'rsp-behaviors-collapsible-header',
  collapsibleContent: 'rsp-behaviors-collapsible-content',
  contentList: 'rsp-behaviors-content-list',
  chip: 'rsp-behaviors-chip',
  chipRemove: 'rsp-behaviors-chip-remove',
  listItemsContainer: 'rsp-behaviors-list-items',
  chipList: (id: string) => `rsp-chip-list-${id}`,
  contentListSection: (id: string) => `rsp-content-list-section-${id}`,
  listItem: (id: string) => `rsp-list-item-${id}`,
  constraintEntryList: (id: string) => `rsp-constraint-entry-list-${id}`,
});
// #endregion !SECTION Constants

// #region SECTION Class Definition
export class GuiBehaviors extends BaseSubscreen {
  static instance: GuiBehaviors;

  deleteMode: boolean = false;
  doNotShowConfirmation: boolean = false;
  activeTab: TabType = 'behaviors';
  selectedBehaviorId: string | null = null;
  selectedTriggerId: string | null = null;
  selectedReactionId: string | null = null;
  searchQuery: string = '';
  declare module: BehaviorsModule;

  protected static override subscreenOptions: SubscreenOptions = {
    name: 'behaviors',
    icon: `${PUBLIC_URL}/images/chat_round_line.svg`,
    forceUpCharacter: true,
    drawCharacter: false
  };

  get settings(): BehaviorsSettingsModel {
    return super.settings as BehaviorsSettingsModel;
  }

  set settings(val: BehaviorsSettingsModel) {
    super.settings = val;
  }
  // #endregion !SECTION Class Definition

  // #region SECTION BaseSubscreen Lifecycle
  get pageStructure(): SettingElement[][] {
    return [
      [
        {
          type: 'custom',
          id: selector.tabContainer,
          htmlOptions: {
            tag: 'div',
            classList: ['rsp-behaviors-container'],
            parent: layout.getSubscreen()
          },
          position: [150, 180],
          size: () => [1780, 720],
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
        tooltip: getText('behaviors.text.toggle_delete_mode')
      },
      size: [90, 90],
    });
    BaseSubscreen.menu?.prepend(deleteModeButton);

    this.render();
  }

  run() {
    super.run();
  }

  click() {
    super.click();
  }

  exit() {
    GuiBehaviors.instance.deleteMode = false;
    GuiBehaviors.instance.doNotShowConfirmation = false;
    GuiBehaviors.instance.selectedBehaviorId = null;
    GuiBehaviors.instance.selectedTriggerId = null;
    GuiBehaviors.instance.selectedReactionId = null;
    GuiBehaviors.instance.searchQuery = '';

    super.exit();
  }
  // #endregion !SECTION BaseSubscreen Lifecycle

  // #region SECTION Rendering
  render() {
    const container = ElementWrap(selector.tabContainer);
    if (!container) return;

    container.replaceChildren();
    container.append(this.buildTabNavigation(), this.buildTabContent());
  }

  buildTabNavigation(): HTMLElement {
    const nav = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-tabs'],
      children: [
        this.createTabButton('behaviors', getText('behaviors.tab.behaviors')),
        this.createTabButton('triggers', getText('behaviors.tab.triggers')),
        this.createTabButton('reactions', getText('behaviors.tab.reactions')),
      ]
    });

    return nav;
  }

  createTabButton(tab: TabType, label: string): HTMLElement {
    const button = advElement.createButton({
      id: `${selector.tabButton}-${tab}`,
      onClick: () => this.switchTab(tab),
      options: {
        label: label
      },
      htmlOptions: {
        button: {
          classList: [
            selector.tabButton,
          ],
          dataAttributes: {
            tab: tab,
            selected: this.activeTab === tab
          }
        }
      }
    });

    return button;
  }

  switchTab(tab: TabType) {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.selectedBehaviorId = null;
    this.selectedTriggerId = null;
    this.selectedReactionId = null;
    this.searchQuery = '';
    this.render();
  }

  buildTabContent(): HTMLElement {
    const content = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-tab-content'],
      children: [
        this.buildListPanel(),
        this.buildEditorPanel()
      ]
    });

    return content;
  }
  // #endregion !SECTION Rendering

  // #region SECTION List Panel Building
  buildListPanel(): HTMLElement {
    const panel = ElementCreate({
      tag: 'div',
      classList: [selector.listPanel],
      children: [
        {
          tag: 'div',
          classList: ['rsp-behaviors-list-header'],
          children: [
            this.buildSearchBar(),
            this.buildAddButton(),
          ]
        },
        this.buildListItems()
      ]
    });

    return panel;
  }

  buildSearchBar(): HTMLElement {
    const searchInput = advElement.createInput({
      id: `rsp-search-${this.activeTab}`,
      type: 'text',
      setElementValue: () => this.searchQuery,
      setSettingValue: (val: string) => {
        this.searchQuery = val;
        this.updateListItems();
      },
      htmlOptions: {
        container: {
          classList: ['rsp-behaviors-search']
        },
        input: {
          attributes: {
            placeholder: getText('behaviors.search.placeholder')
          }
        },
      }
    });

    return searchInput;
  }

  buildAddButton(): HTMLElement {
    const tooltipMap = {
      behaviors: 'behaviors.button.add_behavior',
      triggers: 'behaviors.button.add_trigger',
      reactions: 'behaviors.button.add_reaction'
    };
    const tooltip = getText(tooltipMap[this.activeTab]);

    return advElement.createButton({
      id: `${selector.addButton}-${this.activeTab}`,
      onClick: () => this.handleAdd(),
      options: {
        image: `${PUBLIC_URL}/images/plus.svg`,
        tooltip: tooltip
      },
      htmlOptions: {
        button: {
          classList: [selector.addButton]
        }
      }
    });
  }

  buildListItems(): HTMLElement {
    const children: HTMLElement[] = [];
    const query = this.searchQuery.toLowerCase().trim();

    if (this.activeTab === 'behaviors') {
      Object.values(this.settings.behaviors)
        .filter(behavior => !query || behavior.name.toLowerCase().includes(query))
        .reverse()
        .forEach(behavior => {
          children.push(this.buildBehaviorListItem(behavior));
        });
    } else if (this.activeTab === 'triggers') {
      Object.values(this.settings.triggers)
        .filter(trigger => !query || trigger.name.toLowerCase().includes(query))
        .reverse()
        .forEach(trigger => {
          children.push(this.buildTriggerListItem(trigger));
        });
    } else if (this.activeTab === 'reactions') {
      Object.values(this.settings.reactions)
        .filter(reaction => !query || reaction.name.toLowerCase().includes(query))
        .reverse()
        .forEach(reaction => {
          children.push(this.buildReactionListItem(reaction));
        });
    }

    const thisElement = ElementWrap(selector.listItemsContainer);

    const scrollBox = ElementCreate({
      tag: 'div',
      classList: ['scroll-box', 'rsp-behaviors-list-items'],
      attributes: {
        id: selector.listItemsContainer,
      },
      children: children
    });

    if (thisElement) {
      thisElement.replaceWith(scrollBox);
    }

    return scrollBox;
  }

  updateListItems() {
    const listItemsContainer = document.querySelector('.rsp-behaviors-list-items') as HTMLElement;
    if (!listItemsContainer) return;

    const scrollPosition = listItemsContainer.scrollTop;

    const children: HTMLElement[] = [];
    const query = this.searchQuery.toLowerCase().trim();

    if (this.activeTab === 'behaviors') {
      Object.values(this.settings.behaviors)
        .filter(behavior => !query || behavior.name.toLowerCase().includes(query))
        .reverse()
        .forEach(behavior => {
          children.push(this.buildBehaviorListItem(behavior));
        });
    } else if (this.activeTab === 'triggers') {
      Object.values(this.settings.triggers)
        .filter(trigger => !query || trigger.name.toLowerCase().includes(query))
        .reverse()
        .forEach(trigger => {
          children.push(this.buildTriggerListItem(trigger));
        });
    } else if (this.activeTab === 'reactions') {
      Object.values(this.settings.reactions)
        .filter(reaction => !query || reaction.name.toLowerCase().includes(query))
        .reverse()
        .forEach(reaction => {
          children.push(this.buildReactionListItem(reaction));
        });
    }

    listItemsContainer.replaceChildren();
    listItemsContainer.append(...children);
    listItemsContainer.scrollTop = scrollPosition;
  }

  buildBehaviorListItem(behavior: Behavior): HTMLElement {
    const isSelected = this.selectedBehaviorId === behavior.id;

    const thisElement = ElementWrap(selector.listItem(behavior.id));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const mainDiv = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-item-main'],
      children: [
        advElement.createCheckbox({
          id: `rsp-behavior-enabled-${CommonGenerateUniqueID()}`,
          label: behavior.name,
          setElementValue: () => behavior.enabled,
          options: {
            direction: 'rowReverse'
          },
          htmlOptions: {
            label: {
              classList: ['rsp-behaviors-item-name', 'truncated-text']
            }
          }
        }),
        {
          tag: 'span',
          classList: ['rsp-behaviors-item-info'],
          children: [
            `${behavior.triggers.length} ${getText('behaviors.text.triggers')}, ${behavior.reactions.length} ${getText('behaviors.text.reactions')}`
          ]
        }
      ]
    });

    const button = advElement.createButton({
      id: selector.listItem(thisElement ? CommonGenerateUniqueID() : behavior.id),
      onClick: () => {
        if (this.deleteMode) {
          this.handleDelete('behaviors', behavior.id);
        } else {
          this.selectBehavior(behavior.id);
        }
      },
      htmlOptions: {
        button: {
          classList: [selector.listItemC],
          dataAttributes: {
            deletable: 'true',
            deleteMode: this.deleteMode,
            selected: isSelected
          },
          children: [
            mainDiv
          ]
        },
      }
    });

    if (thisElement) {
      thisElement.replaceWith(button);
      button.id = selector.listItem(behavior.id);
    }

    return button;
  }

  buildTriggerListItem(trigger: Trigger): HTMLElement {
    const thisElement = ElementWrap(selector.listItem(trigger.id));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const isSelected = this.selectedTriggerId === trigger.id;
    const hasConstraints = triggerHasConstraints(trigger);

    const badges: HTMLOptions<keyof HTMLElementTagNameMap>[] = [
      {
        tag: 'span' as const,
        classList: ['rsp-behaviors-item-badge', `type-${trigger.type}`],
        children: [
          getText(`behaviors.trigger_type.${trigger.type}`)
        ]
      },
      ...(hasConstraints ? [{
        tag: 'span' as const,
        classList: ['rsp-behaviors-item-badge', 'has-constraints'],
        children: [
          getText('behaviors.text.has_constraints')
        ]
      }] : [])
    ];

    const mainDiv = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-item-main'],
      children: [
        {
          tag: 'span',
          classList: ['rsp-behaviors-item-name', 'truncated-text'],
          children: [
            trigger.name
          ]
        },
        {
          tag: 'div',
          classList: ['rsp-behaviors-item-badges'],
          children: badges
        }
      ]
    });

    const button = advElement.createButton({
      id: selector.listItem(thisElement ? CommonGenerateUniqueID() : trigger.id),
      onClick: () => {
        if (this.deleteMode) {
          this.handleDelete('triggers', trigger.id);
        } else {
          this.selectTrigger(trigger.id);
        }
      },
      htmlOptions: {
        button: {
          classList: [selector.listItemC],
          dataAttributes: {
            deletable: 'true',
            deleteMode: this.deleteMode,
            selected: isSelected
          },
          children: [
            mainDiv
          ]
        },
      }
    });

    if (thisElement) {
      thisElement.replaceWith(button);
      button.id = selector.listItem(trigger.id);
    }

    return button;
  }

  buildReactionListItem(reaction: Reaction): HTMLElement {
    const isSelected = this.selectedReactionId === reaction.id;

    const thisElement = ElementWrap(selector.listItem(reaction.id));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const mainDiv = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-item-main'],
      children: [
        {
          tag: 'span',
          classList: ['rsp-behaviors-item-name', 'truncated-text'],
          children: [reaction.name]
        },
        {
          tag: 'div',
          classList: ['rsp-behaviors-item-badges'],
          children: [
            {
              tag: 'span',
              classList: ['rsp-behaviors-item-badge', `type-${reaction.type}`],
              children: [getText(`behaviors.reaction_type.${reaction.type}`)]
            }
          ]
        }
      ]
    });

    const button = advElement.createButton({
      id: selector.listItem(thisElement ? CommonGenerateUniqueID() : reaction.id),
      onClick: () => {
        if (this.deleteMode) {
          this.handleDelete('reactions', reaction.id);
        } else {
          this.selectReaction(reaction.id);
        }
      },
      htmlOptions: {
        button: {
          classList: [selector.listItemC],
          dataAttributes: {
            deletable: 'true',
            deleteMode: this.deleteMode,
            selected: isSelected
          },
          children: [
            mainDiv
          ]
        },
      }
    });

    if (thisElement) {
      thisElement.replaceWith(button);
      button.id = selector.listItem(reaction.id);
    }

    return button;
  }
  // #endregion !SECTION List Panel Building

  // #region SECTION Editor Panel Building
  buildEditorPanel(): HTMLElement {
    const thisElement = ElementWrap(selector.editorPanel);
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const panel = ElementCreate({
      tag: 'div',
      attributes: {
        id: selector.editorPanel,
      },
      classList: [selector.editorPanel, 'scroll-box'],
      children: []
    });

    if (this.activeTab === 'behaviors' && this.selectedBehaviorId) {
      const behavior = this.settings.behaviors[this.selectedBehaviorId];
      if (behavior) {
        panel.append(...this.buildBehaviorEditor(behavior));
      }
    } else if (this.activeTab === 'triggers' && this.selectedTriggerId) {
      const trigger = this.settings.triggers[this.selectedTriggerId];
      if (trigger) {
        panel.append(...this.buildTriggerEditor(trigger));
      }
    } else if (this.activeTab === 'reactions' && this.selectedReactionId) {
      const reaction = this.settings.reactions[this.selectedReactionId];
      if (reaction) {
        panel.append(...this.buildReactionEditor(reaction));
      }
    } else {
      panel.appendChild(advElement.createLabel({
        id: 'rsp-behaviors-editor-empty',
        label: getText('behaviors.text.select_item_to_edit'),
        htmlOptions: {
          classList: ['rsp-behaviors-editor-empty'],
        }
      }));
    }

    if (thisElement) {
      thisElement.replaceWith(panel);
    }

    return panel;
  }

  buildBehaviorEditor(behavior: Behavior): HTMLElement[] {
    const elements: HTMLElement[] = [];

    const nameField = createInputField({
      id: `${behavior.id}-name`,
      labelKey: 'behaviors.field.name',
      value: behavior.name,
      onChange: (val) => {
        behavior.name = val;
        this.buildBehaviorListItem(behavior);
      }
    });
    elements.push(nameField);

    const enabledField = advElement.createCheckbox({
      id: `${behavior.id}-enabled`,
      label: getText('behaviors.field.enabled'),
      setElementValue: () => behavior.enabled,
      setSettingValue: (val) => {
        behavior.enabled = val;
        this.buildBehaviorListItem(behavior);
      },
      htmlOptions: {
        container: {
          classList: ['rsp-behaviors-field'],
        }
      }
    });
    elements.push(enabledField);

    const reactionModeField = createDropdownField({
      id: `${behavior.id}-reaction-mode`,
      labelKey: 'behaviors.field.reaction_mode',
      value: behavior.reactionMode,
      options: Object.values(ReactionModeSchema.options),
      onChange: (val) => behavior.reactionMode = val as ReactionMode
    });
    elements.push(reactionModeField);

    const cooldownField = createNumberInputField({
      id: `${behavior.id}-cooldown`,
      labelKey: 'behaviors.field.cooldown',
      value: behavior.cooldownSec?.toString() || '',
      onChange: (val) => behavior.cooldownSec = val ? parseFloat(val) : undefined,
      step: '0.1'
    });
    elements.push(cooldownField);

    elements.push(this.buildTriggersSection(behavior));

    elements.push(this.buildReactionsSection(behavior));

    return elements;
  }

  buildTriggerEditor(trigger: Trigger): HTMLElement[] {
    const elements: HTMLElement[] = [];

    const nameField = createInputField({
      id: `${trigger.id}-name`,
      labelKey: 'behaviors.field.name',
      value: trigger.name,
      onChange: (val) => {
        trigger.name = val;
        this.buildTriggerListItem(trigger);
      }
    });
    elements.push(nameField);

    const typeOptions = TriggerTypeSchema.options;
    const typeField = createDropdownField({
      id: `${trigger.id}-type`,
      labelKey: 'behaviors.field.type',
      value: trigger.type,
      options: typeOptions,
      onChange: (val) => {
        const newTrigger = this.changeTriggerType(trigger, val as TriggerType);
        if (newTrigger) {
          this.settings.triggers[newTrigger.id] = newTrigger;
          this.selectedTriggerId = newTrigger.id;
          this.buildTriggerListItem(newTrigger);
          this.buildEditorPanel();
        }
      }
    });
    elements.push(typeField);

    elements.push(...this.buildTriggerTypeFields(trigger));

    elements.push(this.buildCollapsibleSection(
      'behaviors.section.advanced_options',
      this.buildTriggerContraintsOptions(trigger)
    ));

    return elements;
  }

  buildReactionEditor(reaction: Reaction): HTMLElement[] {
    const elements: HTMLElement[] = [];

    const nameField = createInputField({
      id: `${reaction.id}-name`,
      labelKey: 'behaviors.field.name',
      value: reaction.name,
      onChange: (val) => {
        reaction.name = val;
        this.buildReactionListItem(reaction);
      }
    });
    elements.push(nameField);

    const typeOptions = ReactionTypeSchema.options;
    const typeField = createDropdownField({
      id: `${reaction.id}-type`,
      labelKey: 'behaviors.field.type',
      value: reaction.type,
      options: typeOptions,
      onChange: (val) => {
        const newReaction = this.changeReactionType(reaction, val as ReactionType);
        if (newReaction) {
          this.settings.reactions[newReaction.id] = newReaction;
          this.selectedReactionId = newReaction.id;
          this.buildReactionListItem(newReaction);
          this.buildEditorPanel();
        }
      }
    });
    elements.push(typeField);

    if (reaction.type === 'speech' || reaction.type === 'emote' || reaction.type === 'action') {
      const renderContent = () => this.buildContentArrayField(
        `${reaction.id}-content`,
        'behaviors.field.content',
        reaction.content,
        (val) => {
          reaction.content = val;
          renderContent();
        }
      );
      const contentSection = renderContent();
      elements.push(contentSection);
    } else if (reaction.type === 'activity') {
      const renderActivityNames = () => this.buildContentListSection(
        `${reaction.id}-activity-names`,
        'behaviors.field.activity_names',
        async () => {
          const result = await activitySelectorModal({ selectedActivities: [reaction.activityName], limit: 1 });
          if (!result) return;

          let updated = false;
          const selectedActivity = result[0];

          if (reaction.activityName !== selectedActivity) {
            reaction.activityName = selectedActivity;
            updated = true;
          }
          if (updated) {
            renderActivityNames();
          }
        },
        'behaviors.button.add_activity_name',
        this.buildChipList(
          `${reaction.id}-activity-names`,
          reaction.activityName ? [{ id: reaction.activityName, name: ActivityDictionaryText(`Activity${reaction.activityName}`) }] : [],
          function () {
            reaction.activityName = '';
            this.remove();
          }
        )
      );
      const activityNamesSection = renderActivityNames();
      elements.push(activityNamesSection);

      const rerenderGroupNames = () => this.buildContentListSection(
        `${reaction.id}-group-names`,
        'behaviors.field.group_names',
        async () => {
          const result = await bodyPartSelectorModal({ selectedParts: [reaction.groupName] as AssetGroupItemName[], limit: 1 });
          if (!result) return;

          const selectedPart = result[0];
          let updated = false;

          if (reaction.groupName !== selectedPart) {
            reaction.groupName = selectedPart;
            updated = true;
          }
          if (updated) {
            rerenderGroupNames();
          }
        },
        'behaviors.button.add_group_name',
        this.buildChipList(
          `${reaction.id}-group-names`,
          reaction.groupName ? [{ id: reaction.groupName, name: reaction.groupName }] : [],
          function () {
            reaction.groupName = '';
            this.remove();
          }
        )
      );
      const groupNamesSection = rerenderGroupNames();
      elements.push(groupNamesSection);
    }

    return elements;
  }

  buildTriggerTypeFields(trigger: Trigger): HTMLElement[] {
    const elements: HTMLElement[] = [];

    switch (trigger.type) {
      case 'speech': {
        const speechTypeField = createDropdownField({
          id: `${trigger.id}-speech-type`,
          labelKey: 'behaviors.field.speech_type',
          value: trigger.speechType,
          options: Object.values(SpeechTypeSchema.options),
          onChange: (val) => trigger.speechType = val as SpeechType
        });
        elements.push(speechTypeField);
        const renderContent = () => this.buildContentArrayField(
          `${trigger.id}-content`,
          'behaviors.field.content',
          trigger.content,
          (val) => {
            trigger.content = val;
            renderContent();
          }
        );
        const contentSection = renderContent();
        elements.push(contentSection);
        const matchModeField1 = createDropdownField({
          id: `${trigger.id}-match-mode`,
          labelKey: 'behaviors.field.match_mode',
          value: trigger.matchMode,
          options: Object.values(MatchModeSchema.options),
          onChange: (val) => trigger.matchMode = val as MatchMode
        });
        elements.push(matchModeField1);
        break;
      }
      case 'emote':
      case 'action': {
        const renderContent = () => this.buildContentArrayField(
          `${trigger.id}-content`,
          'behaviors.field.content',
          trigger.content,
          (val) => {
            trigger.content = val;
            renderContent();
          }
        );
        const contentSection = renderContent();
        elements.push(contentSection);
        
        const matchModeField2 = createDropdownField({
          id: `${trigger.id}-match-mode`,
          labelKey: 'behaviors.field.match_mode',
          value: trigger.matchMode,
          options: Object.values(MatchModeSchema.options),
          onChange: (val) => trigger.matchMode = val as MatchMode
        });
        elements.push(matchModeField2);
        break;
      }
      case 'activity': {
        const renderActivityNames = () => this.buildContentListSection(
          `${trigger.id}-activity-names`,
          'behaviors.field.activity_names',
          async () => {
            const result = await activitySelectorModal({ selectedActivities: trigger.activityName });
            if (!result) return;

            trigger.activityName = result;
            renderActivityNames();
          },
          'behaviors.button.add_activity_name',
          this.buildChipList(
            `${trigger.id}-activity-names`,
            trigger.activityName.map(activity => ({ id: activity, name: ActivityDictionaryText(`Activity${activity}`) })),
            function (item) {
              trigger.activityName.splice(trigger.activityName.indexOf(item.id), 1);
              this.remove();
            }
          )
        );
        const activityNamesSection = renderActivityNames();
        elements.push(activityNamesSection);

        const rerenderGroupNames = () => this.buildContentListSection(
          `${trigger.id}-group-names`,
          'behaviors.field.group_names',
          async () => {
            const result = await bodyPartSelectorModal({ selectedParts: trigger.groupName as AssetGroupItemName[] });
            if (!result) return;

            trigger.groupName = result;
            rerenderGroupNames();
          },
          'behaviors.button.add_group_name',
          this.buildChipList(
            `${trigger.id}-group-names`,
            trigger.groupName.map(name => ({ id: name, name: TextGetInScope('Screens/Character/Preference/Text_Preference.csv', `ArousalZone${name}`) })),
            function (item) {
              trigger.groupName.splice(trigger.groupName.indexOf(item.id), 1);
              this.remove();
            }
          )
        );
        const groupNamesSection = rerenderGroupNames();
        elements.push(groupNamesSection);
        break;
      }
      case 'orgasm': {
        const orgasmTypeField = createDropdownField({
          id: `${trigger.id}-orgasm-type`,
          labelKey: 'behaviors.field.orgasm_type',
          value: trigger.orgasmType,
          options: Object.values(OrgasmTypeSchema.options),
          onChange: (val) => trigger.orgasmType = val as OrgasmType
        });
        elements.push(orgasmTypeField);
        break;
      }
      case 'roomPresence': {
        const roomPresenceField = createDropdownField({
          id: `${trigger.id}-room-presence-event`,
          labelKey: 'behaviors.field.room_presence_event',
          value: trigger.event,
          options: Object.values(RoomPresenceEventSchema.options),
          onChange: (val) => trigger.event = val as RoomPresenceEvent
        });
        elements.push(roomPresenceField);
        break;
      }
    }

    return elements;
  }

  buildTriggerContraintsOptions(trigger: Trigger): HTMLElement[] {
    const elements: HTMLElement[] = [];

    const constraintModeField = createDropdownField({
      id: `${trigger.id}-constraint-mode`,
      labelKey: 'behaviors.field.constraint_mode',
      value: trigger.constraintMode || 'all',
      options: Object.values(ConstraintModeSchema.options),
      onChange: (val) => trigger.constraintMode = val as ConstraintMode
    });
    elements.push(constraintModeField);

    trigger.constraints ??= {};

    const renderSource = () => this.buildIncludeExcludeField(
      `${trigger.id}-constraint-source`,
      'behaviors.field.constraint_source',
      trigger.constraints?.source,
      (val) => {
        trigger.constraints!.source = val;
        renderSource();
        this.buildTriggerListItem(trigger);
      }
    );
    const sourceSection = renderSource();
    elements.push(sourceSection);

    const renderTarget = () => this.buildIncludeExcludeField(
      `${trigger.id}-constraint-target`,
      'behaviors.field.constraint_target',
      trigger.constraints?.target,
      (val) => {
        trigger.constraints!.target = val;
        renderTarget();
        this.buildTriggerListItem(trigger);
      }
    );
    const targetSection = renderTarget();
    elements.push(targetSection);

    const renderArousalMin = () => createNumberInputField({
      id: `${trigger.id}-arousal-min`,
      labelKey: 'behaviors.field.arousal_min',
      value: trigger.constraints?.arousalMin?.toString() ?? '',
      onChange: (val) => {
        trigger.constraints!.arousalMin = val ? parseFloat(val) : undefined;
        this.buildTriggerListItem(trigger);
      },
      min: '0',
      max: '100'
    });
    const arousalMinField = renderArousalMin();
    elements.push(arousalMinField);

    const renderArousalMax = () => createNumberInputField({
      id: `${trigger.id}-arousal-max`,
      labelKey: 'behaviors.field.arousal_max',
      value: trigger.constraints?.arousalMax?.toString() ?? '',
      onChange: (val) => {
        trigger.constraints!.arousalMax = val ? parseFloat(val) : undefined;
        this.buildTriggerListItem(trigger);
      },
      min: '0',
      max: '100'
    });
    const arousalMaxField = renderArousalMax();
    elements.push(arousalMaxField);

    const renderInRoomWithMembers = () => this.buildIncludeExcludeField(
      `${trigger.id}-in-room-with-members`,
      'behaviors.field.in_room_with_members',
      trigger.constraints?.inRoomWithMembers,
      (val) => {
        trigger.constraints!.inRoomWithMembers = val;
        renderInRoomWithMembers();
        this.buildTriggerListItem(trigger);
      }
    );
    const inRoomWithMembersSection = renderInRoomWithMembers();
    elements.push(inRoomWithMembersSection);

    const renderInRoomNamed = () => this.buildIncludeExcludeField(
      `${trigger.id}-in-room-named`,
      'behaviors.field.in_room_named',
      trigger.constraints?.inRoomNamed,
      (val) => {
        trigger.constraints!.inRoomNamed = val;
        renderInRoomNamed();
        this.buildTriggerListItem(trigger);
      }
    );
    const inRoomNamedSection = renderInRoomNamed();
    elements.push(inRoomNamedSection);

    return elements;
  }

  buildTriggersSection(behavior: Behavior): HTMLElement {
    const thisElement = ElementWrap(selector.contentListSection(`${behavior.id}-triggers`));
    if (thisElement) thisElement.replaceChildren();

    const content = this.buildChipList(
      thisElement ? CommonGenerateUniqueID() : `${behavior.id}-triggers`,
      behavior.triggers.map(id => this.settings.triggers[id]).filter(Boolean).reverse() as Trigger[],
      async (trigger) => {
        const index = behavior.triggers.indexOf(trigger.id);
        if (index > -1) {
          behavior.triggers.splice(index, 1);
          this.buildTriggersSection(behavior);
          this.buildBehaviorListItem(behavior);
        }
      }
    );

    const section = this.buildContentListSection(
      thisElement ? CommonGenerateUniqueID() : `${behavior.id}-triggers`,
      'behaviors.section.triggers',
      async () => {
        await this.showTriggerSelector(behavior);
        this.buildTriggersSection(behavior);
        this.buildBehaviorListItem(behavior);
      },
      'behaviors.button.add_trigger',
      content
    );

    if (thisElement) {
      thisElement.replaceWith(section);
      section.id = selector.contentListSection(`${behavior.id}-triggers`);
    }

    return section;
  }

  buildReactionsSection(behavior: Behavior): HTMLElement {
    const thisElement = ElementWrap(selector.contentListSection(`${behavior.id}-reactions`));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const content = this.buildChipList(
      thisElement ? CommonGenerateUniqueID() : `${behavior.id}-reactions`,
      behavior.reactions.map(id => this.settings.reactions[id]).filter(Boolean).reverse() as Reaction[],
      async (reaction) => {
        const index = behavior.reactions.indexOf(reaction.id);
        if (index > -1) {
          behavior.reactions.splice(index, 1);
          this.buildReactionsSection(behavior);
          this.buildBehaviorListItem(behavior);
        }
      }
    );

    const section = this.buildContentListSection(
      thisElement ? CommonGenerateUniqueID() : `${behavior.id}-reactions`,
      'behaviors.section.reactions',
      async () => {
        await this.showReactionSelector(behavior);
        this.buildReactionsSection(behavior);
        this.buildBehaviorListItem(behavior);
      },
      'behaviors.button.add_reaction',
      content
    );

    if (thisElement) {
      thisElement.replaceWith(section);
      section.id = selector.contentListSection(`${behavior.id}-reactions`);
    }

    return section;
  }
  // #endregion !SECTION Editor Panel Building

  // #region SECTION Field Builders
  buildChipList(id: string, items: Array<{ id: string; name: string; type?: string }>, onRemove: (this: HTMLElement, item: { id: string; name: string }) => void): HTMLElement {
    const chipListId = selector.chipList(id);
    const thisElement = ElementWrap(chipListId);
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const container = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-chips'],
      attributes: {
        id: chipListId,
      },
      children: items.slice().reverse().map(item => {
        const chipClassList = item.type
          ? [selector.chip, `type-${item.type}`]
          : [selector.chip];
        const chip = ElementCreate({
          tag: 'div',
          classList: chipClassList,
          children: [
            {
              tag: 'span',
              children: [item.name]
            },
            advElement.createButton({
              id: `rsp-chip-remove-${item.id}`,
              onClick: function () { onRemove.call(chip, item); },
              options: {
                image: `${PUBLIC_URL}/images/cross.svg`,
                noStyling: true
              },
              htmlOptions: {
                button: {
                  classList: [selector.chipRemove],
                }
              }
            })
          ]
        });
        return chip;
      })
    });

    if (thisElement) {
      thisElement.replaceWith(container);
    }

    return container;
  }

  buildContentArrayField(id: string, labelKey: string, values: string[], onChange: (values: string[]) => void): HTMLElement {
    const content = this.buildContentList(values, onChange);
    const onAdd = () => {
      textReactionSelectorModal({ prompt: getText('behaviors.prompt.add_content')}).then((response) => {
        if (response === null) return;
        values.push(response);
        onChange(values);
      });
    };

    const thisElement = ElementWrap(selector.contentListSection(id));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const section = this.buildContentListSection(id, labelKey, onAdd, 'behaviors.button.add_content', content);

    if (thisElement) {
      thisElement.replaceWith(section);
    }

    return section;
  }

  buildContentList(values: string[], onChange: (values: string[]) => void): HTMLElement {
    const tooltip = this.deleteMode
      ? getText('behaviors.text.delete_mode')
      : getText('behaviors.text.edit_mode');

    const container = ElementCreate({
      tag: 'div',
      classList: [selector.contentList, 'scroll-box'],
      children: [
        ...values.slice().reverse().map((value, index) => {
          const originalIndex = values.length - 1 - index;
          return advElement.createButton({
            id: `rsp-content-${index}-${CommonGenerateUniqueID()}`,
            options: {
              label: value === '' ? getText('behaviors.text.empty_content') : value,
              tooltip: tooltip,
              tooltipPosition: 'top'
            },
            htmlOptions: {
              button: {
                classList: ['rsp-content-item'],
                dataAttributes: {
                  deletable: 'true',
                  deleteMode: this.deleteMode,
                  emptyContent: (value === '').toString()
                }
              },
              label: {
                classList: ['truncated-text']
              }
            },
            onClick: async function () {
              if (GuiBehaviors.instance.deleteMode) {
                const confirmed = await GuiBehaviors.instance.confirmationModal(getText('behaviors.prompt.delete_content'));
                if (!confirmed) return;

                values.splice(originalIndex, 1);
                onChange(values);
                const label = this.querySelector('.button-label');
                if (label?.textContent) {
                  label.textContent = value === '' ? getText('behaviors.text.empty_content') : value;
                }
              } else {
                textReactionSelectorModal({ initialValue: value, prompt: getText('behaviors.prompt.edit_text_reaction') }).then((newValue) => {
                  if (newValue === value) return;
                  else if (newValue === null) return;
                  else {
                    values[originalIndex] = newValue;
                    onChange(values);
                    const label = this.querySelector('.button-label');
                    if (label?.textContent) {
                      label.textContent = newValue === '' ? getText('behaviors.text.empty_content') : newValue;
                    }
                  }
                });
              }
            }
          });
        })
      ]
    });

    return container;
  }

  buildContentListSection(id: string, labelKey: string, onAdd: () => void, addLabel: string, content: HTMLElement): HTMLElement {
    const sectionId = selector.contentListSection(id);
    const thisElement = ElementWrap(sectionId);
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const addButton = advElement.createButton({
      id: `rsp-content-add-${CommonGenerateUniqueID()}`,
      onClick: onAdd,
      options: {
        image: `${PUBLIC_URL}/images/plus.svg`,
        label: getText(addLabel)
      },
      htmlOptions: {
        button: {
          classList: ['rsp-content-add']
        }
      }
    });

    const header = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-content-list-header'],
      children: [
        advElement.createLabel({
          id: `rsp-label-${CommonGenerateUniqueID()}`,
          label: getText(labelKey)
        }),
        addButton
      ]
    });

    const container = ElementCreate({
      tag: 'div',
      attributes: {
        id: sectionId,
      },
      classList: ['rsp-behaviors-section'],
      children: [
        header,
        content
      ]
    });

    if (thisElement) {
      thisElement.replaceWith(container);
    }

    return container;
  }

  buildIncludeExcludeField(id: string, labelKey: string, rule: { entries: Array<{ value: string; mode: 'include' | 'exclude' }> } | undefined, onChange: (rule: { entries: Array<{ value: string; mode: 'include' | 'exclude' }> } | undefined) => void): HTMLElement {
    const entries = rule?.entries || [];
    const onAdd = () => {
      Modal.prompt(getText('behaviors.prompt.add_content'), { modalClassList: ['rsp-modal'] }).then((response) => {
        if (response === null) return;
        entries.push({ value: response, mode: 'include' });
        if (!rule) {
          rule = { entries: entries };
        } else {
          rule.entries = entries;
        }
        onChange(rule);
      });
    };

    const list = this.buildConstraintEntryList(
      id,
      entries,
      (updatedEntries) => {
        if (!rule) {
          rule = { entries: updatedEntries };
        } else {
          rule.entries = updatedEntries;
        }
        onChange(rule);
      }
    );

    const thisElement = ElementWrap(selector.contentListSection(id));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const section = this.buildContentListSection(id, labelKey, onAdd, 'behaviors.button.add_content', list);


    if (thisElement) {
      thisElement.replaceWith(section);
    }

    return section;
  }

  buildConstraintEntryList(id: string, entries: IncludeExcludeEntry[], onChange: (entries: IncludeExcludeEntry[]) => void): HTMLElement {
    const tooltip = this.deleteMode
      ? getText('behaviors.text.delete_mode')
      : getText('behaviors.text.edit_mode');

    const thisElement = ElementWrap(selector.constraintEntryList(id));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const container = ElementCreate({
      tag: 'div',
      attributes: {
        id: selector.constraintEntryList(id),
      },
      classList: [selector.contentList, 'scroll-box'],
      children: [
        ...entries.slice().reverse().map((entry, index) => {
          const originalIndex = entries.length - 1 - index;
          const modeField = createDropdownField({
            id: `${id}-entry-${originalIndex}-mode`,
            labelKey: '',
            value: entry.mode,
            options: Object.values(IncludeExcludeEntrySchema.shape.mode.options),
            onChange: (val) => {
              entries[originalIndex].mode = val as 'include' | 'exclude';
              onChange(entries);
            }
          });
          const entryContainer = ElementCreate({
            tag: 'div',
            classList: ['rsp-constraint-entry'],
            children: [
              modeField,
              advElement.createButton({
                id: `rsp-constraint-entry-${originalIndex}-${CommonGenerateUniqueID()}`,
                options: {
                  label: entry.value === '' ? getText('behaviors.text.empty_content') : entry.value,
                  tooltip: tooltip,
                  tooltipPosition: 'top'
                },
                htmlOptions: {
                  button: {
                    classList: ['rsp-content-item'],
                    dataAttributes: {
                      deletable: 'true',
                      deleteMode: this.deleteMode,
                      emptyContent: (entry.value === '').toString()
                    }
                  },
                  label: {
                    classList: ['truncated-text']
                  }
                },
                onClick: async () => {
                  if (this.deleteMode) {
                    const confirmed = await this.confirmationModal(getText('behaviors.prompt.delete_content'));
                    if (!confirmed) return;

                    entries.splice(originalIndex, 1);
                    onChange(entries);
                  } else {
                    Modal.prompt(getText('behaviors.prompt.edit_content'), { defaultValue: entry.value, modalClassList: ['rsp-modal'] }).then((newValue) => {
                      if (newValue === entry.value) return;
                      else if (newValue === null) return;
                      else {
                        entries[originalIndex].value = newValue;
                        onChange(entries);
                      }
                    });
                  }
                }
              })
            ]
          });

          return entryContainer;
        })
      ]
    });

    if (thisElement) {
      thisElement.replaceWith(container);
    }

    return container;
  }

  buildCollapsibleSection(headerKey: string, content: HTMLElement[]): HTMLElement {
    const header = ElementCreate({
      tag: 'div',
      classList: [selector.collapsibleHeader],
      attributes: {
        'data-expanded': 'false'
      },
      children: [getText(headerKey)],
      eventListeners: {
        click: () => {
          const isExpanded = header.getAttribute('data-expanded') === 'true';
          header.setAttribute('data-expanded', (!isExpanded).toString());
        }
      }
    });

    const contentDiv = ElementCreate({
      tag: 'div',
      classList: [selector.collapsibleContent],
      children: content
    });

    const section = ElementCreate({
      tag: 'div',
      classList: [selector.collapsibleSection],
      children: [header, contentDiv]
    });

    return section;
  }

  // #region SECTION Selection Methods
  selectBehavior(id: string) {
    let oldBehavior: Behavior | undefined;
    if (this.selectedBehaviorId) {
      oldBehavior = this.settings.behaviors[this.selectedBehaviorId];
    }
    this.selectedBehaviorId = id;
    if (oldBehavior) this.buildBehaviorListItem(oldBehavior);
    this.buildBehaviorListItem(this.settings.behaviors[id]);
    this.buildEditorPanel();
  }

  selectTrigger(id: string) {
    let oldTrigger: Trigger | undefined;
    if (this.selectedTriggerId) {
      oldTrigger = this.settings.triggers[this.selectedTriggerId];
    }
    this.selectedTriggerId = id;
    if (oldTrigger) this.buildTriggerListItem(oldTrigger);
    this.buildTriggerListItem(this.settings.triggers[id]);
    this.buildEditorPanel();
  }

  selectReaction(id: string) {
    let oldReaction: Reaction | undefined;
    if (this.selectedReactionId) {
      oldReaction = this.settings.reactions[this.selectedReactionId];
    }
    this.selectedReactionId = id;
    if (oldReaction) this.buildReactionListItem(oldReaction);
    this.buildReactionListItem(this.settings.reactions[id]);
    this.buildEditorPanel();
  }
  // #endregion !SECTION Selection Methods

  // #region SECTION Handlers

  handleAdd() {
    if (this.activeTab === 'behaviors') {
      this.handleAddBehavior();
    } else if (this.activeTab === 'triggers') {
      this.handleAddTrigger();
    } else if (this.activeTab === 'reactions') {
      this.handleAddReaction();
    }
  }

  handleAddBehavior() {
    Modal.prompt(getText('behaviors.prompt.behavior_name'), { modalClassList: ['rsp-modal'] }).then((name) => {
      if (name === null) return;

      const behavior = BehaviorsModule.createBehavior({
        name: name || getText('behaviors.text.new_behavior'),
        enabled: true,
      });

      if (behavior) {
        this.settings.behaviors[behavior.id] = behavior;
        this.selectedBehaviorId = behavior.id;
        this.buildListItems();
        this.buildEditorPanel();
      }
    });
  }

  handleAddTrigger() {
    Modal.prompt(getText('behaviors.prompt.trigger_name'), { modalClassList: ['rsp-modal'] }).then((name) => {
      if (name === null) return;

      const trigger = BehaviorsModule.createTrigger({
        name: name || getText('behaviors.text.new_trigger'),
        type: 'speech',
        speechType: 'any',
        content: [],
        matchMode: 'contains'
      });

      if (trigger) {
        this.settings.triggers[trigger.id] = trigger;
        this.selectedTriggerId = trigger.id;
        this.buildListItems();
        this.buildEditorPanel();
      }
    });
  }

  handleAddReaction() {
    Modal.prompt(getText('behaviors.prompt.reaction_name'), { modalClassList: ['rsp-modal'] }).then((name) => {
      if (name === null) return;

      const reaction = BehaviorsModule.createReaction({
        name: name || getText('behaviors.text.new_reaction'),
        type: 'speech',
        content: []
      });

      if (reaction) {
        this.settings.reactions[reaction.id] = reaction;
        this.selectedReactionId = reaction.id;
        this.buildListItems();
        this.buildEditorPanel();
      }
    });
  }

  async handleDelete(type: 'behaviors' | 'triggers' | 'reactions', id: string) {
    const itemMap = {
      behaviors: this.settings.behaviors,
      triggers: this.settings.triggers,
      reactions: this.settings.reactions
    };

    const item = itemMap[type][id];

    if (!item) return;

    const confirmed = await this.confirmationModal(getText('behaviors.prompt.delete_confirm').replace('{name}', item.name));
    if (!confirmed) return;

    if (type === 'behaviors') {
      if (this.selectedBehaviorId === id) {
        this.selectedBehaviorId = null;
      }
      BehaviorsModule.deleteBehavior(id);
    } else if (type === 'triggers') {
      if (this.selectedTriggerId === id) {
        this.selectedTriggerId = null;
      }
      BehaviorsModule.deleteTrigger(id);
    } else if (type === 'reactions') {
      if (this.selectedReactionId === id) {
        this.selectedReactionId = null;
      }
      BehaviorsModule.deleteReaction(id);
    }

    ElementWrap(selector.listItem(id))?.remove();
    this.buildEditorPanel();
  }
  // #endregion !SECTION Handlers

  // #region SECTION Selectors

  async showTriggerSelector(behavior: Behavior) {
    const availableTriggers = Object.values(this.settings.triggers).filter(t => !behavior.triggers.includes(t.id));

    if (availableTriggers.length === 0) {
      Modal.alert(getText('behaviors.text.no_triggers_available'), { modalClassList: ['rsp-modal'] });
      return;
    }

    const options = availableTriggers.map(t => ({
      label: t.name,
      value: t.id
    }));

    const selectedIds = await idSelectorModal(options);
    if (selectedIds.length === 0) return;

    selectedIds.forEach((id: string) => {
      behavior.triggers.push(id);
    });
    this.buildBehaviorListItem(behavior);
    this.buildTriggersSection(behavior);
  }

  async showReactionSelector(behavior: Behavior) {
    const availableReactions = Object.values(this.settings.reactions).filter(r => !behavior.reactions.includes(r.id));

    if (availableReactions.length === 0) {
      Modal.alert(getText('behaviors.text.no_reactions_available'), { modalClassList: ['rsp-modal'] });
      return;
    }

    const options = availableReactions.map(r => ({
      label: r.name,
      value: r.id
    }));

    const selectedIds = await idSelectorModal(options);
    if (selectedIds.length === 0) return;

    selectedIds.forEach((id: string) => {
      behavior.reactions.push(id);
    });
    this.buildBehaviorListItem(behavior);
    this.buildReactionsSection(behavior);
  }
  // #endregion !SECTION Selectors

  // #region SECTION Creators

  changeTriggerType(trigger: Trigger, newType: TriggerType): Trigger | undefined {
    let newTrigger: Trigger | undefined;

    switch (newType) {
      case 'speech':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'speech',
          speechType: 'any',
          content: [],
          matchMode: 'contains'
        });
        break;
      case 'emote':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'emote',
          content: [],
          matchMode: 'contains'
        });
        break;
      case 'action':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'action',
          content: [],
          matchMode: 'contains'
        });
        break;
      case 'activity':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'activity',
          activityName: [],
          groupName: []
        });
        break;
      case 'orgasm':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'orgasm',
          orgasmType: 'any'
        });
        break;
      case 'roomPresence':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'roomPresence',
          event: 'join'
        });
        break;
      default:
        assertNever(newType);
    }

    if (!newTrigger) return undefined;

    return {
      ...newTrigger,
      id: trigger.id,
    };
  }

  changeReactionType(reaction: Reaction, newType: ReactionType): Reaction | undefined {
    let newReaction: Reaction | undefined;

    switch (newType) {
      case 'speech':
        newReaction = BehaviorsModule.createReaction({
          name: reaction.name || getText('behaviors.text.new_reaction'),
          type: 'speech',
          content: []
        });
        break;
      case 'emote':
        newReaction = BehaviorsModule.createReaction({
          name: reaction.name || getText('behaviors.text.new_reaction'),
          type: 'emote',
          content: []
        });
        break;
      case 'action':
        newReaction = BehaviorsModule.createReaction({
          name: reaction.name || getText('behaviors.text.new_reaction'),
          type: 'action',
          content: []
        });
        break;
      case 'activity':
        newReaction = BehaviorsModule.createReaction({
          name: reaction.name || getText('behaviors.text.new_reaction'),
          type: 'activity',
          activityName: '',
          groupName: ''
        });
        break;
      default:
        assertNever(newType);
    }

    if (!newReaction) return undefined;

    return {
      ...newReaction,
      id: reaction.id,
    };
  }
  // #endregion !SECTION Creators

  // #region SECTION Utility Methods
  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
    ElementWrap(selector.deleteModeToggle)?.toggleAttribute('data-delete-mode', this.deleteMode);
    const deletableItems = document.querySelectorAll('[data-deletable]');
    deletableItems.forEach(item => {
      item.toggleAttribute('data-delete-mode', this.deleteMode);
    });
  }

  async confirmationModal(message: string): Promise<boolean> {
    const result = this.doNotShowConfirmation || await Modal.confirm([
      message,
      advElement.createCheckbox({
        id: 'rsp-do-not-show-confirmation',
        label: getText('behaviors.text.do_not_show_this_again_until_leaving_this_screen'),
        setSettingValue: (val) => this.doNotShowConfirmation = val
      })
    ], { modalId: 'rsp-modal' });
    if (result === false) this.doNotShowConfirmation = false;

    return result ?? false;
  }
  // #endregion !SECTION Utility Methods
}

exportToGlobal('GuiResponses', GuiBehaviors);
