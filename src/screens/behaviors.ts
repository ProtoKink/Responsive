// #region SECTION Imports & Types
import { advElement, BaseSubscreen, exportToGlobal, getText, layout, Modal, SettingElement, SubscreenOptions } from 'bc-deeplib/deeplib';
import { BehaviorsSettingsModel, Behavior, Trigger, Reaction, ConstraintMode, MatchMode, SpeechType, OrgasmType, RoomPresenceEvent, ReactionMode, TriggerTypeSchema, ReactionTypeSchema, ReactionType, TriggerType, IncludeExcludeEntry, MatchContentEntry, SpeechTypeSchema, MatchModeSchema, OrgasmTypeSchema, RoomPresenceEventSchema, ReactionModeSchema, ConstraintModeSchema, IncludeExcludeEntrySchema } from '../models/behaviors';
import { BehaviorsModule } from '../modules/behaviors';
import { assertNever } from '../utilities/other';
import { activitySelectorModal, animationSelectorModal, bodyPartSelectorModal, itemSelectorModal, memberNumberSelectorModal, textReactionSelectorModal } from '@/utilities/selectorModals';
import { triggerHasAnyConstraints } from '@/utilities/triggers';
import { buildCollapsibleSection, buildContentListSection, createDropdownField, createInputField, createNumberInputField } from '@/utilities/fields';
import { AnimatronikkaModule } from '@/modules/animatronikka';
import { DebugStorage, BehaviorExecutionEntry } from '@/utilities/debugStorage';

type TabType = 'behaviors' | 'triggers' | 'reactions' | 'debugger';
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
  contentList: 'rsp-behaviors-content-list',
  chip: 'rsp-behaviors-chip',
  chipRemove: 'rsp-behaviors-chip-remove',
  listItemsContainer: 'rsp-behaviors-list-items',
  chipList: (id: string) => `rsp-chip-list-${id}`,
  contentListSection: (id: string) => `rsp-content-list-section-${id}`,
  listItem: (id: string) => `rsp-list-item-${id}`,
  includeExcludeEntryList: (id: string) => `rsp-constraint-entry-list-${id}`,
  constraintsSection: (id: string) => `rsp-constraints-section-${id}`,
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
        this.createTabButton('debugger', getText('behaviors.tab.debugger')),
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
    if (this.activeTab === 'debugger') {
      return ElementCreate({
        tag: 'div',
        classList: ['rsp-behaviors-tab-content'],
        children: [this.buildDebuggerPanel()]
      });
    }

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

  buildAddButton(): HTMLElement | undefined {
    if (this.activeTab === 'debugger') return undefined;

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
      classList: ['scroll-box', selector.listItemsContainer],
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
    const listItemsContainer = document.querySelector(`.${selector.listItemsContainer}`) as HTMLElement;
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
    const hasTimeout = behavior.cooldownSec && behavior.cooldownSec > 0;
    const image = hasTimeout ? `${PUBLIC_URL}/images/clock.svg` : undefined;

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
      options: {
        image: image
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
        img: {
          classList: ['rsp-behaviors-item-timeout-icon']
        }
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
    const hasConstraints = triggerHasAnyConstraints(trigger);

    const badges: HTMLOptions<'span'>[] = [
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

  buildDebuggerPanel(): HTMLElement {
    const history = DebugStorage.getHistory();

    const title = advElement.createLabel({
      id: 'rsp-debugger-title',
      label: getText('behaviors.debugger.title'),
      htmlOptions: {
        classList: ['rsp-debugger-title']
      }
    });

    const countLabel = advElement.createLabel({
      id: 'rsp-debugger-count',
      label: getText('behaviors.debugger.entry_count', { $count: history.length.toString() }),
      htmlOptions: {
        classList: ['rsp-debugger-count']
      }
    });

    const clearButton = advElement.createButton({
      id: 'rsp-debugger-clear',
      onClick: () => {
        BehaviorsModule.clearDebugHistory();
        this.render();
      },
      options: {
        label: getText('behaviors.debugger.clear_history'),
      },
      htmlOptions: {
        button: {
          classList: ['rsp-debugger-clear']
        }
      }
    });

    const note = advElement.createLabel({
      id: 'rsp-debugger-note',
      label: getText('behaviors.debugger.local_storage_note'),
      htmlOptions: {
        classList: ['rsp-debugger-note']
      }
    });

    const header = ElementCreate({
      tag: 'div',
      classList: ['rsp-debugger-header'],
      children: [title, note, countLabel, clearButton]
    });

    const list = ElementCreate({
      tag: 'div',
      classList: ['rsp-debugger-list', 'scroll-box'],
      children: []
    });

    if (history.length === 0) {
      list.appendChild(advElement.createLabel({
        id: 'rsp-debugger-empty',
        label: getText('behaviors.debugger.no_executions'),
        htmlOptions: {
          classList: ['rsp-debugger-empty']
        }
      }));
    } else {
      history.forEach(entry => list.appendChild(this.buildDebuggerEntry(entry)));
    }

    return ElementCreate({
      tag: 'div',
      classList: ['rsp-debugger-panel'],
      children: [header, list]
    });
  }

  buildDebuggerEntry(entry: BehaviorExecutionEntry): HTMLElement {
    const behavior = this.module.getBehavior(entry.behaviorId);
    const trigger = this.module.getTrigger(entry.triggerId);

    const behaviorLabel = behavior
      ? behavior.name
      : `${getText('behaviors.debugger.unknown_behavior')} (${entry.behaviorId})`;

    const triggerLabel = trigger
      ? `${trigger.name} (${getText(`behaviors.trigger_type.${trigger.type}`)})`
      : `${getText('behaviors.debugger.unknown_trigger')} (${entry.triggerId})`;

    const reactionLabels = entry.reactionIds.length === 0
      ? [getText('behaviors.text.empty_content')]
      : entry.reactionIds.map(id => {
        const reaction = this.module.getReaction(id);
        return reaction
          ? reaction.name
          : `${getText('behaviors.debugger.unknown_reaction')} (${id})`;
      });

    const header = ElementCreate({
      tag: 'div',
      classList: ['rsp-debugger-entry-header'],
      children: [
        advElement.createLabel({
          id: null,
          label: behaviorLabel,
          htmlOptions: {
            classList: ['rsp-debugger-entry-title', !behavior ? 'rsp-debugger-unknown' : undefined]
          }
        }),
        advElement.createLabel({
          id: null,
          label: new Date(entry.timestamp).toLocaleString(),
          htmlOptions: {
            classList: ['rsp-debugger-entry-time']
          }
        }),
        {
          tag: 'div',
          classList: ['rsp-debugger-badge'],
          children: [getText(`behaviors.trigger_type.${entry.triggerType}`)]
        }
      ]
    });

    const body = ElementCreate({
      tag: 'div',
      classList: ['rsp-debugger-entry-body'],
      children: [
        this.buildDebuggerField('behaviors.debugger.trigger', triggerLabel, !trigger),
        this.buildDebuggerField('behaviors.debugger.reactions', reactionLabels.join(', '), reactionLabels.some(label => label.startsWith(getText('behaviors.debugger.unknown_reaction')))),
      ]
    });

    const messageFields: HTMLElement[] = [];
    const data = entry.messageData;
    if (data.sourceMemberNumber !== undefined) {
      messageFields.push(this.buildDebuggerField('behaviors.debugger.source_member', data.sourceMemberNumber.toString()));
    }
    if (data.targetMemberNumber !== undefined) {
      messageFields.push(this.buildDebuggerField('behaviors.debugger.target_member', data.targetMemberNumber.toString()));
    }
    if (data.messageContent) {
      messageFields.push(this.buildDebuggerField('behaviors.debugger.message_content', data.messageContent));
    }
    if (data.activityName) {
      messageFields.push(this.buildDebuggerField('behaviors.debugger.activity_name', data.activityName));
    }
    if (data.groupName) {
      messageFields.push(this.buildDebuggerField('behaviors.debugger.group_name', data.groupName));
    }
    if (data.orgasmType) {
      messageFields.push(this.buildDebuggerField('behaviors.field.orgasm_type', data.orgasmType));
    }
    if (data.roomPrecenseEvent) {
      messageFields.push(this.buildDebuggerField('behaviors.field.room_presence_event', data.roomPrecenseEvent));
    }
    if (data.speechType) {
      messageFields.push(this.buildDebuggerField('behaviors.field.speech_type', data.speechType));
    }

    const messageSection = buildCollapsibleSection({
      headerKey: 'behaviors.debugger.message_data',
      content: () => messageFields.length > 0
        ? messageFields
        : [this.buildDebuggerField('behaviors.debugger.message_data', getText('behaviors.text.empty_content'))]
    });

    return ElementCreate({
      tag: 'div',
      classList: ['rsp-debugger-entry'],
      children: [header, body, messageSection]
    });
  }

  buildDebuggerField(labelKey: string, value: string, isUnknown: boolean = false): HTMLElement {
    return ElementCreate({
      tag: 'div',
      classList: ['rsp-debugger-field'],
      children: [
        advElement.createLabel({
          id: null,
          label: getText(labelKey),
          htmlOptions: {
            classList: ['rsp-debugger-field-label']
          }
        }),
        advElement.createLabel({
          id: null,
          label: value,
          htmlOptions: {
            classList: ['rsp-debugger-field-value', isUnknown ? 'rsp-debugger-unknown' : undefined]
          }
        })
      ]
    });
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
      onChange: (val) => {
        behavior.cooldownSec = val ? parseFloat(val) : undefined;
        this.buildBehaviorListItem(behavior);
      },
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

    elements.push(buildCollapsibleSection({
      id: selector.constraintsSection(trigger.id),
      headerKey: 'behaviors.section.constraints',
      content: this.buildTriggerContraintsOptions(trigger)
    }));

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
      const renderActivityNames = () => buildContentListSection({
        id: `${reaction.id}-activity-names`,
        labelKey: 'behaviors.field.activity_names',
        onAdd: async () => {
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
        addLabel: 'behaviors.button.select_activity',
        content: this.buildChipList(
          `${reaction.id}-activity-names`,
          reaction.activityName ? [{ id: reaction.activityName, name: ActivityDictionaryText(`Activity${reaction.activityName}`) }] : [],
          function () {
            reaction.activityName = '';
            this.remove();
          }
        )
      });
      const activityNamesSection = renderActivityNames();
      elements.push(activityNamesSection);

      const rerenderGroupNames = () => buildContentListSection({
        id: `${reaction.id}-group-names`,
        labelKey: 'behaviors.field.group_names',
        onAdd: async () => {
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
        addLabel:'behaviors.button.select_body_part',
        content: this.buildChipList(
          `${reaction.id}-group-names`,
          reaction.groupName ? [{ id: reaction.groupName, name: TextGetInScope('Screens/Character/Preference/Text_Preference.csv', `ArousalZone${reaction.groupName}`) }] : [],
          function () {
            reaction.groupName = '';
            this.remove();
          }
        )
      });
      const groupNamesSection = rerenderGroupNames();
      elements.push(groupNamesSection);
    } else if (reaction.type === 'animation') {
      const renderAnimation = () => buildContentListSection({
        id: `${reaction.id}-animation`,
        labelKey: 'behaviors.field.animation',
        onAdd: async () => {
          const animations = AnimatronikkaModule.instance?.settings.animations ?? {};
          const selected = reaction.animationId ? [reaction.animationId] : [];
          const result = await animationSelectorModal({ selectedIds: selected, limit: 1, animations });
          if (!result || result.length === 0) return;
          const [animationId] = result;
          if (reaction.animationId !== animationId) {
            reaction.animationId = animationId;
            renderAnimation();
          }
        },
        addLabel: 'behaviors.button.select_animation',
        content: this.buildChipList(
          `${reaction.id}-animation`,
          reaction.animationId
            ? [{
              id: reaction.animationId,
              name: AnimatronikkaModule.instance?.settings.animations?.[reaction.animationId]?.name ?? reaction.animationId
            }]
            : [],
          function () {
            reaction.animationId = '';
            this.remove();
          }
        )
      });
      elements.push(renderAnimation());

      const interruptField = advElement.createCheckbox({
        id: `${reaction.id}-animation-interrupt`,
        label: getText('behaviors.field.animation_interrupt'),
        setElementValue: () => reaction.interrupt ?? false,
        setSettingValue: (val) => reaction.interrupt = val,
        htmlOptions: {
          container: {
            classList: ['rsp-behaviors-field'],
          }
        }
      });
      elements.push(interruptField);

      const priorityField = createNumberInputField({
        id: `${reaction.id}-animation-priority`,
        labelKey: 'behaviors.field.animation_priority',
        value: reaction.priority?.toString() ?? '',
        onChange: (val) => {
          reaction.priority = val ? parseFloat(val) : undefined;
        },
        step: '1',
        min: '0',
        max: '100'
      });
      elements.push(priorityField);
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
        const renderContent = () => this.buildMatchContentField(
          `${trigger.id}-content`,
          'behaviors.field.content',
          () => {
            textReactionSelectorModal({ prompt: getText('behaviors.prompt.add_content')}).then((response) => {
              if (response === null) return;
              trigger.content.push({ value: response, matchMode: 'contains' });
              renderContent();
            });
          },
          trigger.content,
          (entries) => {
            trigger.content = entries;
            renderContent();
          },
          true
        );
        const contentSection = renderContent();
        elements.push(contentSection);
        break;
      }
      case 'emote':
      case 'action': {
        const renderContent = () => this.buildMatchContentField(
          `${trigger.id}-content`,
          'behaviors.field.content',
          () => {
            textReactionSelectorModal({ prompt: getText('behaviors.prompt.add_content')}).then((response) => {
              if (response === null) return;
              trigger.content.push({ value: response, matchMode: 'contains' });
              renderContent();
            });
          },
          trigger.content,
          (entries) => {
            trigger.content = entries;
            renderContent();
          },
          true
        );
        const contentSection = renderContent();
        elements.push(contentSection);
        break;
      }
      case 'activity': {
        const renderActivityNames = () => buildContentListSection({
          id: `${trigger.id}-activity-names`,
          labelKey: 'behaviors.field.activity_names',
          onAdd: async () => {
            const result = await activitySelectorModal({ selectedActivities: trigger.activityName });
            if (!result) return;

            trigger.activityName = result;
            renderActivityNames();
          },
          addLabel: 'behaviors.button.select_activities',
          content: this.buildChipList(
            `${trigger.id}-activity-names`,
            trigger.activityName.map(activity => ({ id: activity, name: ActivityDictionaryText(`Activity${activity}`) })),
            function (item) {
              trigger.activityName.splice(trigger.activityName.indexOf(item.id), 1);
              this.remove();
            }
          )
        });
        const activityNamesSection = renderActivityNames();
        elements.push(activityNamesSection);

        const rerenderGroupNames = () => buildContentListSection({
          id: `${trigger.id}-group-names`,
          labelKey: 'behaviors.field.group_names',
          onAdd: async () => {
            const result = await bodyPartSelectorModal({ selectedParts: trigger.groupName as AssetGroupItemName[] });
            if (!result) return;

            trigger.groupName = result;
            rerenderGroupNames();
          },
          addLabel: 'behaviors.button.select_body_parts',
          content: this.buildChipList(
            `${trigger.id}-group-names`,
            trigger.groupName.map(name => ({ id: name, name: TextGetInScope('Screens/Character/Preference/Text_Preference.csv', `ArousalZone${name}`) })),
            function (item) {
              trigger.groupName.splice(trigger.groupName.indexOf(item.id), 1);
              this.remove();
            }
          )
        });
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

    const onChange = () => {
      buildCollapsibleSection({
        id: selector.constraintsSection(trigger.id),
        headerKey: 'behaviors.section.constraints',
        content: () => this.buildTriggerContraintsOptions(trigger),
        expanded: true
      });
    };

    const hasConstraints = triggerHasAnyConstraints(trigger);

    if (!hasConstraints) {
      const addConstraintButton = advElement.createButton({
        id: `rsp-add-constraint-${trigger.id}`,
        onClick: () => {
          this.showEntitySelector(trigger);
        },
        options: {
          image: `${PUBLIC_URL}/images/plus.svg`,
          label: getText('behaviors.button.add_constraint')
        },
        htmlOptions: {
          button: {
            classList: ['rsp-content-add']
          }
        }
      });
      const addConstraintLabel = advElement.createLabel({
        id: `rsp-label-constraints-${CommonGenerateUniqueID()}`,
        label: getText('behaviors.text.no_constraints')
      });
      const container = ElementCreate({
        tag: 'div',
        classList: ['rsp-no-constraints-container'],
        children: [addConstraintLabel, addConstraintButton]
      });
      elements.push(container);
      return elements;
    }

    const constraintModeField = createDropdownField({
      id: `${trigger.id}-constraint-mode`,
      labelKey: 'behaviors.field.constraint_mode',
      value: trigger.constraintMode || 'all',
      options: Object.values(ConstraintModeSchema.options),
      onChange: (val) => trigger.constraintMode = val as ConstraintMode,
      replace: false
    });
    elements.push(constraintModeField);

    trigger.constraints ??= {};

    if (trigger.constraints.source) {
      elements.push(this.buildEntityConstraintSection(trigger, 'source', onChange));
    }
    if (trigger.constraints.target) {
      elements.push(this.buildEntityConstraintSection(trigger, 'target', onChange));
    }
    if (trigger.constraints.player) {
      elements.push(this.buildEntityConstraintSection(trigger, 'player', onChange));
    }
    if (trigger.constraints.room) {
      elements.push(this.buildEntityConstraintSection(trigger, 'room', onChange));
    }

    const addConstraintButton = advElement.createButton({
      id: `rsp-add-constraint-${trigger.id}`,
      onClick: () => {
        this.showEntitySelector(trigger);
      },
      options: {
        image: `${PUBLIC_URL}/images/plus.svg`,
        label: getText('behaviors.button.add_constraint')
      },
      htmlOptions: {
        button: {
          classList: ['rsp-content-add']
        }
      }
    });
    elements.push(addConstraintButton);

    return elements;
  }

  async showEntitySelector(trigger: Trigger): Promise<void> {
    const entities = [
      { value: 'source', label: getText('behaviors.entity.source') },
      { value: 'target', label: getText('behaviors.entity.target') },
      { value: 'player', label: getText('behaviors.entity.player') },
      { value: 'room', label: getText('behaviors.entity.room') }
    ];

    const selected = await itemSelectorModal({ buttons: entities.map(e => ({ label: e.label, value: e.value })) });
    if (selected === null || selected.length === 0) return;
    for (const entity of selected) {
      await this.showConstraintTypeSelector(trigger, entity as 'source' | 'target' | 'player' | 'room');
    }
  }

  buildEntityConstraintSection(trigger: Trigger, entity: 'source' | 'target' | 'player' | 'room', onChange: () => void): HTMLElement {
    const entityConstraints = trigger.constraints?.[entity];
    if (!entityConstraints) {
      return ElementCreate({ tag: 'div' });
    }

    const entityLabels: Record<typeof entity, string> = {
      source: getText('behaviors.entity.source'),
      target: getText('behaviors.entity.target'),
      player: getText('behaviors.entity.player'),
      room: getText('behaviors.entity.room')
    };

    const constraintElements: HTMLElement[] = [];

    if ((entity === 'source' || entity === 'target') && 'memberNumber' in entityConstraints && entityConstraints.memberNumber) {
      const renderMemberNumber = (replace?: boolean) => this.buildIncludeExcludeField(
        `${trigger.id}-${entity}-memberNumber`,
        'behaviors.field.constraint_member_number',
        () => {
          const rule = entityConstraints.memberNumber;
          const entries = rule?.entries || [];
          memberNumberSelectorModal({ selectedMembers: entries.map(entry => parseInt(entry.value)) }).then((response) => {
            if (response === null) return;
            const newEntries = entries.filter(entry => response.includes(parseInt(entry.value)));
            response.forEach(memberNumber => {
              if (newEntries.some(entry => entry.value === memberNumber.toString())) return;
              newEntries.push({ value: memberNumber.toString(), mode: 'include' });
            });
            trigger.constraints ??= {};
            (trigger.constraints[entity] as any).memberNumber = { entries: newEntries };
            renderMemberNumber(true);
            this.buildTriggerListItem(trigger);
          });
        },
        entityConstraints.memberNumber,
        (val) => {
          trigger.constraints ??= {};
          (trigger.constraints[entity] as any).memberNumber = val;
          renderMemberNumber(true);
          this.buildTriggerListItem(trigger);
        },
        () => {
          if (trigger.constraints && trigger.constraints[entity]) {
            delete (trigger.constraints[entity] as any).memberNumber;
            if (Object.keys(trigger.constraints[entity] as any).length === 0) {
              delete trigger.constraints[entity];
              if (Object.keys(trigger.constraints).length === 0) {
                trigger.constraints = undefined;
              }
            }
          }
          onChange();
          this.buildTriggerListItem(trigger);
        },
        replace
      );
      constraintElements.push(renderMemberNumber(false));
    }

    const booleanConstraints = ['restrained', 'gagged', 'blinded', 'deafened'] as const;
    for (const constraintKey of booleanConstraints) {
      if (constraintKey in entityConstraints && entityConstraints[constraintKey as keyof typeof entityConstraints] !== undefined) {
        const value = (entityConstraints as any)[constraintKey] as boolean;
        const field = createDropdownField({
          id: `${trigger.id}-${entity}-${constraintKey}`,
          labelKey: `behaviors.field.constraint_${constraintKey}`,
          value: value.toString(),
          options: ['true', 'false'],
          onChange: (val) => {
            trigger.constraints ??= {};
            (trigger.constraints[entity] as any)[constraintKey] = val === 'true';
            this.buildTriggerListItem(trigger);
          }
        });
        const removeButton = advElement.createButton({
          id: `rsp-remove-constraint-${trigger.id}-${entity}-${constraintKey}`,
          onClick: () => {
            if (trigger.constraints && trigger.constraints[entity]) {
              delete (trigger.constraints[entity] as any)[constraintKey];
              if (Object.keys(trigger.constraints[entity] as any).length === 0) {
                delete trigger.constraints[entity];
                if (Object.keys(trigger.constraints).length === 0) {
                  trigger.constraints = undefined;
                }
              }
            }
            onChange();
            this.buildTriggerListItem(trigger);
          },
          options: {
            image: `${PUBLIC_URL}/images/trash_bin.svg`,
            tooltip: getText('behaviors.button.remove_constraint'),
            tooltipPosition: 'left'
          },
          htmlOptions: {
            button: {
              classList: ['rsp-constraint-remove']
            }
          }
        });
        field.appendChild(removeButton);
        constraintElements.push(field);
      }
    }

    const numericConstraints = ['arousalMin', 'arousalMax'] as const;
    for (const constraintKey of numericConstraints) {
      if (constraintKey in entityConstraints && entityConstraints[constraintKey as keyof typeof entityConstraints] !== undefined) {
        const value = (entityConstraints as any)[constraintKey] as number;
        const field = createNumberInputField({
          id: `${trigger.id}-${entity}-${constraintKey}`,
          labelKey: `behaviors.field.constraint_${constraintKey}`,
          value: value?.toString() ?? '',
          onChange: (val) => {
            trigger.constraints ??= {};
            (trigger.constraints[entity] as any)[constraintKey] = val ? parseFloat(val) : undefined;
            this.buildTriggerListItem(trigger);
          },
          min: '0',
          max: '100'
        });
        const removeButton = advElement.createButton({
          id: `rsp-remove-constraint-${trigger.id}-${entity}-${constraintKey}`,
          onClick: () => {
            if (trigger.constraints && trigger.constraints[entity]) {
              delete (trigger.constraints[entity] as any)[constraintKey];
              if (Object.keys(trigger.constraints[entity] as any).length === 0) {
                delete trigger.constraints[entity];
                if (Object.keys(trigger.constraints).length === 0) {
                  trigger.constraints = undefined;
                }
              }
            }
            onChange();
            this.buildTriggerListItem(trigger);
          },
          options: {
            image: `${PUBLIC_URL}/images/trash_bin.svg`,
            tooltip: getText('behaviors.button.remove_constraint'),
            tooltipPosition: 'left'
          },
          htmlOptions: {
            button: {
              classList: ['rsp-constraint-remove']
            }
          }
        });
        field.appendChild(removeButton);
        constraintElements.push(field);
      }
    }

    if (entity === 'room') {
      if ('inRoomWithMembers' in entityConstraints && entityConstraints.inRoomWithMembers) {
        const renderInRoomWithMembers = (replace?: boolean) => this.buildIncludeExcludeField(
          `${trigger.id}-room-inRoomWithMembers`,
          'behaviors.field.constraint_in_room_with_members',
          () => {
            const rule = entityConstraints.inRoomWithMembers;
            const entries = rule?.entries || [];
            memberNumberSelectorModal({ selectedMembers: entries.map(entry => parseInt(entry.value)) }).then((response) => {
              if (response === null) return;
              const newEntries = entries.filter(entry => response.includes(parseInt(entry.value)));
              response.forEach(memberNumber => {
                if (newEntries.some(entry => entry.value === memberNumber.toString())) return;
                newEntries.push({ value: memberNumber.toString(), mode: 'include' });
              });
              trigger.constraints ??= {};
              (trigger.constraints.room as any).inRoomWithMembers = { entries: newEntries };
              renderInRoomWithMembers(true);
              this.buildTriggerListItem(trigger);
            });
          },
          entityConstraints.inRoomWithMembers,
          (val) => {
            trigger.constraints ??= {};
            (trigger.constraints.room as any).inRoomWithMembers = val;
            renderInRoomWithMembers(true);
            this.buildTriggerListItem(trigger);
          },
          () => {
            if (trigger.constraints && trigger.constraints.room) {
              delete (trigger.constraints.room as any).inRoomWithMembers;
              if (Object.keys(trigger.constraints.room as any).length === 0) {
                delete trigger.constraints.room;
                if (Object.keys(trigger.constraints).length === 0) {
                  trigger.constraints = undefined;
                }
              }
            }
            onChange();
            this.buildTriggerListItem(trigger);
          },
          replace
        );
        constraintElements.push(renderInRoomWithMembers(false));
      }

      if ('inRoomNamed' in entityConstraints && entityConstraints.inRoomNamed) {
        const renderInRoomNamed = (replace?: boolean) => this.buildIncludeExcludeField(
          `${trigger.id}-room-inRoomNamed`,
          'behaviors.field.constraint_in_room_named',
          () => {
            const rule = entityConstraints.inRoomNamed;
            const entries = rule?.entries || [];
            Modal.prompt(getText('behaviors.prompt.add_content'), { modalClassList: ['rsp-modal'] }).then((response) => {
              if (response === null) return;
              entries.push({ value: response, mode: 'include' });
              trigger.constraints ??= {};
              (trigger.constraints.room as any).inRoomNamed = { entries: entries };
              renderInRoomNamed(true);
              this.buildTriggerListItem(trigger);
            });
          },
          entityConstraints.inRoomNamed,
          (val) => {
            trigger.constraints ??= {};
            (trigger.constraints.room as any).inRoomNamed = val;
            renderInRoomNamed(true);
            this.buildTriggerListItem(trigger);
          },
          () => {
            if (trigger.constraints && trigger.constraints.room) {
              delete (trigger.constraints.room as any).inRoomNamed;
              if (Object.keys(trigger.constraints.room as any).length === 0) {
                delete trigger.constraints.room;
                if (Object.keys(trigger.constraints).length === 0) {
                  trigger.constraints = undefined;
                }
              }
            }
            onChange();
            this.buildTriggerListItem(trigger);
          },
          replace
        );
        constraintElements.push(renderInRoomNamed(false));
      }
    }

    const addConstraintButton = advElement.createButton({
      id: `rsp-add-constraint-${trigger.id}-${entity}`,
      onClick: () => {
        this.showConstraintTypeSelector(trigger, entity);
      },
      options: {
        image: `${PUBLIC_URL}/images/plus.svg`,
        label: getText('behaviors.button.add_constraint')
      },
      htmlOptions: {
        button: {
          classList: ['rsp-content-add']
        }
      }
    }); 

    return buildCollapsibleSection({
      id: `${trigger.id}-entity-${entity}`,
      headerKey: entityLabels[entity],
      content: () => [...constraintElements, addConstraintButton],
      expanded: true
    });
  }

  async showConstraintTypeSelector(trigger: Trigger, entity: 'source' | 'target' | 'player' | 'room'): Promise<void> {
    trigger.constraints ??= {};
    const entityConstraints = (trigger.constraints[entity] ?? {}) as any;

    const availableConstraints: Array<{ key: string; label: string }> = [];

    if (entity === 'source' || entity === 'target') {
      if (!('memberNumber' in entityConstraints && entityConstraints.memberNumber)) {
        availableConstraints.push({ key: 'memberNumber', label: getText('behaviors.field.constraint_member_number') });
      }
    }

    if (entity === 'source' || entity === 'target' || entity === 'player') {
      if (!('restrained' in entityConstraints && entityConstraints.restrained !== undefined)) {
        availableConstraints.push({ key: 'restrained', label: getText('behaviors.field.constraint_restrained') });
      }
      if (!('gagged' in entityConstraints && entityConstraints.gagged !== undefined)) {
        availableConstraints.push({ key: 'gagged', label: getText('behaviors.field.constraint_gagged') });
      }
      if (!('blinded' in entityConstraints && entityConstraints.blinded !== undefined)) {
        availableConstraints.push({ key: 'blinded', label: getText('behaviors.field.constraint_blinded') });
      }
      if (!('deafened' in entityConstraints && entityConstraints.deafened !== undefined)) {
        availableConstraints.push({ key: 'deafened', label: getText('behaviors.field.constraint_deafened') });
      }
      if (!('arousalMin' in entityConstraints && entityConstraints.arousalMin !== undefined)) {
        availableConstraints.push({ key: 'arousalMin', label: getText('behaviors.field.constraint_arousalMin') });
      }
      if (!('arousalMax' in entityConstraints && entityConstraints.arousalMax !== undefined)) {
        availableConstraints.push({ key: 'arousalMax', label: getText('behaviors.field.constraint_arousalMax') });
      }
    }

    if (entity === 'room') {
      if (!('inRoomWithMembers' in entityConstraints && entityConstraints.inRoomWithMembers)) {
        availableConstraints.push({ key: 'inRoomWithMembers', label: getText('behaviors.field.constraint_in_room_with_members') });
      }
      if (!('inRoomNamed' in entityConstraints && entityConstraints.inRoomNamed)) {
        availableConstraints.push({ key: 'inRoomNamed', label: getText('behaviors.field.constraint_in_room_named') });
      }
    }

    if (availableConstraints.length === 0) {
      return;
    }

    const selected = await itemSelectorModal({ buttons: availableConstraints.map(c => ({ label: c.label, value: c.key })) });
    if (selected === null || selected.length === 0) return;

    if (!trigger.constraints) {
      trigger.constraints = {};
    }
    trigger.constraints[entity] ??= {} as any;

    selected.forEach((constraintKey) => {
      const entityConstraints = trigger.constraints![entity] as any;
      switch (constraintKey) {
        case 'memberNumber':
          entityConstraints.memberNumber = { entries: [] };
          break;
        case 'inRoomWithMembers':
        case 'inRoomNamed':
          entityConstraints[constraintKey] = { entries: [] };
          break;
        case 'arousalMin':
        case 'arousalMax':
          entityConstraints[constraintKey] = 0;
          break;
        case 'restrained':
        case 'gagged':
        case 'blinded':
        case 'deafened':
          entityConstraints[constraintKey] = false;
          break;
        default:
          return assertNever(constraintKey as never);
      }
    });

    buildCollapsibleSection({
      id: selector.constraintsSection(trigger.id),
      headerKey: 'behaviors.section.constraints',
      content: () => this.buildTriggerContraintsOptions(trigger),
      expanded: true
    });
    this.buildTriggerListItem(trigger);
  }

  buildTriggersSection(behavior: Behavior): HTMLElement {
    const sectionId = `${behavior.id}-triggers`;
    const thisElement = ElementWrap(selector.contentListSection(sectionId));
    if (thisElement) thisElement.replaceChildren();

    const content = this.buildChipList(
      thisElement ? CommonGenerateUniqueID() : sectionId,
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

    const section = buildContentListSection({
      id: thisElement ? CommonGenerateUniqueID() : sectionId,
      labelKey: 'behaviors.section.triggers',
      onAdd: async () => {
        await this.showTriggerSelector(behavior);
        this.buildTriggersSection(behavior);
        this.buildBehaviorListItem(behavior);
      },
      addLabel: 'behaviors.button.add_trigger',
      content: content
    });

    if (thisElement) {
      thisElement.replaceWith(section);
      section.id = selector.contentListSection(sectionId);
    }

    return section;
  }

  buildReactionsSection(behavior: Behavior): HTMLElement {
    const sectionId = `${behavior.id}-reactions`;
    const thisElement = ElementWrap(selector.contentListSection(sectionId));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const content = this.buildChipList(
      thisElement ? CommonGenerateUniqueID() : sectionId,
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

    const section = buildContentListSection({
      id: thisElement ? CommonGenerateUniqueID() : sectionId,
      labelKey: 'behaviors.section.reactions',
      onAdd: async () => {
        await this.showReactionSelector(behavior);
        this.buildReactionsSection(behavior);
        this.buildBehaviorListItem(behavior);
      },
      addLabel: 'behaviors.button.add_reaction',
      content: content
    });

    if (thisElement) {
      thisElement.replaceWith(section);
      section.id = selector.contentListSection(sectionId);
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

    const section = buildContentListSection({ id, labelKey, onAdd, addLabel: 'behaviors.button.add_content', content });

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

  buildIncludeExcludeField(
    id: string, 
    labelKey: string, 
    onAdd: () => void, 
    rule: { entries: IncludeExcludeEntry[] } | undefined, 
    onChange: (rule: { entries: IncludeExcludeEntry[] } | undefined) => void, 
    onRemove?: () => void,
    replace?: boolean
  ): HTMLElement {
    const entries = rule?.entries || [];

    const list = this.buildIncludeExcludeEntryList(
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
    if (thisElement && replace) {
      thisElement.replaceChildren();
    }

    const section = buildContentListSection({ id, labelKey, onAdd, addLabel: 'behaviors.button.add_content', content: list });

    if (onRemove) {
      const header = section.querySelector('.rsp-content-list-header');
      if (header) {
        const removeButton = advElement.createButton({
          id: `rsp-remove-constraint-${id}`,
          onClick: onRemove,
          options: {
            image: `${PUBLIC_URL}/images/trash_bin.svg`,
            tooltip: getText('behaviors.button.remove_constraint'),
            tooltipPosition: 'top'
          },
          htmlOptions: {
            button: {
              classList: ['rsp-constraint-remove']
            }
          }
        });
        header.appendChild(removeButton);
      }
    }

    if (thisElement && replace) {
      thisElement.replaceWith(section);
    }

    return section;
  }

  buildMatchContentEntryList(
    id: string, 
    entries: MatchContentEntry[], 
    onChange: (entries: MatchContentEntry[]) => void
  ): HTMLElement {
    const tooltip = this.deleteMode
      ? getText('behaviors.text.delete_mode')
      : getText('behaviors.text.edit_mode');

    const thisElement = ElementWrap(selector.includeExcludeEntryList(id));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const container = ElementCreate({
      tag: 'div',
      attributes: {
        id: selector.includeExcludeEntryList(id),
      },
      classList: [selector.contentList, 'scroll-box'],
      children: [
        ...entries.slice().reverse().map((entry, index) => {
          const originalIndex = entries.length - 1 - index;
          const matchModeField = createDropdownField({
            id: `${id}-entry-${originalIndex}-match-mode`,
            labelKey: '',
            value: entry.matchMode ?? 'contains',
            options: Object.values(MatchModeSchema.options),
            onChange: (val) => {
              entries[originalIndex].matchMode = val as MatchMode;
              onChange(entries);
            }
          });
          const entryContainer = ElementCreate({
            tag: 'div',
            classList: ['rsp-include-exclude-entry'],
            children: [
              matchModeField,
              advElement.createButton({
                id: null,
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

  buildMatchContentField(
    id: string,
    labelKey: string,
    onAdd: () => void,
    entries: MatchContentEntry[],
    onChange: (entries: MatchContentEntry[]) => void,
    replace?: boolean
  ): HTMLElement {
    const list = this.buildMatchContentEntryList(
      id,
      entries,
      onChange
    );

    const thisElement = ElementWrap(selector.contentListSection(id));
    if (thisElement && replace) {
      thisElement.replaceChildren();
    }

    const section = buildContentListSection({ id, labelKey, onAdd, addLabel: 'behaviors.button.add_content', content: list });

    if (thisElement && replace) {
      thisElement.replaceWith(section);
    }

    return section;
  }

  buildIncludeExcludeEntryList(id: string, entries: IncludeExcludeEntry[], onChange: (entries: IncludeExcludeEntry[]) => void): HTMLElement {
    const tooltip = this.deleteMode
      ? getText('behaviors.text.delete_mode')
      : getText('behaviors.text.edit_mode');

    const thisElement = ElementWrap(selector.includeExcludeEntryList(id));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const container = ElementCreate({
      tag: 'div',
      attributes: {
        id: selector.includeExcludeEntryList(id),
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
            classList: ['rsp-include-exclude-entry'],
            children: [
              modeField,
              advElement.createButton({
                id: null,
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
        content: []
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

    const selectedIds = await itemSelectorModal({ buttons: options });
    if (selectedIds === null || selectedIds.length === 0) return;

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

    const selectedIds = await itemSelectorModal({ buttons: options });
    if (selectedIds === null || selectedIds.length === 0) return;

    selectedIds.forEach((id) => behavior.reactions.push(id));
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
          constraintMode: trigger.constraintMode,
          constraints: trigger.constraints
        });
        break;
      case 'emote':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'emote',
          content: [],
          constraintMode: trigger.constraintMode,
          constraints: trigger.constraints
        });
        break;
      case 'action':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'action',
          content: [],
          constraintMode: trigger.constraintMode,
          constraints: trigger.constraints
        });
        break;
      case 'activity':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'activity',
          activityName: [],
          groupName: [],
          constraintMode: trigger.constraintMode,
          constraints: trigger.constraints
        });
        break;
      case 'orgasm':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'orgasm',
          orgasmType: 'any',
          constraintMode: trigger.constraintMode,
          constraints: trigger.constraints
        });
        break;
      case 'roomPresence':
        newTrigger = BehaviorsModule.createTrigger({
          name: trigger.name || getText('behaviors.text.new_trigger'),
          type: 'roomPresence',
          event: 'join',
          constraintMode: trigger.constraintMode,
          constraints: trigger.constraints
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
      case 'animation':
        newReaction = BehaviorsModule.createReaction({
          name: reaction.name || getText('behaviors.text.new_reaction'),
          type: 'animation',
          animationId: '',
          interrupt: false,
          priority: 0
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
