// #region SECTION Imports & Types
import { advElement, BaseSubscreen, exportToGlobal, getText, layout, Modal, SettingElement, SubscreenOptions } from 'bc-deeplib/deeplib';
import { BehaviorsSettingsModel, Behavior, Trigger, Reaction, ConstraintMode, MatchMode, SpeechType, OrgasmType, RoomPresenceEvent, ReactionMode, TriggerTypeSchema, ReactionTypeSchema, ReactionType, TriggerType } from '../models/behaviors';
import { BehaviorsModule } from '../modules/behaviors';
import { assertNever } from '../utilities/other';
import { idSelectorModal } from '@/utilities/selectorModals';

type TabType = 'behaviors' | 'triggers' | 'reactions';
// #endregion !SECTION Imports & Types

// #region SECTION Constants
const selector = Object.freeze({
  tabContainer: 'rsp-behaviors-tab-container',
  tabButton: 'rsp-behaviors-tab-button',
  tabContent: 'rsp-behaviors-tab-content',
  listPanel: 'rsp-behaviors-list-panel',
  editorPanel: 'rsp-behaviors-editor-panel',
  listItem: 'rsp-behaviors-list-item',
  addButton: 'rsp-behaviors-add-button',
  deleteModeToggle: 'rsp-delete-mode-toggle',
  collapsibleSection: 'rsp-behaviors-collapsible',
  collapsibleHeader: 'rsp-behaviors-collapsible-header',
  collapsibleContent: 'rsp-behaviors-collapsible-content',
  contentList: 'rsp-behaviors-content-list',
  chip: 'rsp-behaviors-chip',
  chipRemove: 'rsp-behaviors-chip-remove',
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

    container.innerHTML = '';
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
        .forEach(behavior => {
          children.push(this.buildBehaviorListItem(behavior));
        });
    } else if (this.activeTab === 'triggers') {
      Object.values(this.settings.triggers)
        .filter(trigger => !query || trigger.name.toLowerCase().includes(query))
        .forEach(trigger => {
          children.push(this.buildTriggerListItem(trigger));
        });
    } else if (this.activeTab === 'reactions') {
      Object.values(this.settings.reactions)
        .filter(reaction => !query || reaction.name.toLowerCase().includes(query))
        .forEach(reaction => {
          children.push(this.buildReactionListItem(reaction));
        });
    }

    const scrollBox = ElementCreate({
      tag: 'div',
      classList: ['scroll-box', 'rsp-behaviors-list-items'],
      children: children
    });

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
        .forEach(behavior => {
          children.push(this.buildBehaviorListItem(behavior));
        });
    } else if (this.activeTab === 'triggers') {
      Object.values(this.settings.triggers)
        .filter(trigger => !query || trigger.name.toLowerCase().includes(query))
        .forEach(trigger => {
          children.push(this.buildTriggerListItem(trigger));
        });
    } else if (this.activeTab === 'reactions') {
      Object.values(this.settings.reactions)
        .filter(reaction => !query || reaction.name.toLowerCase().includes(query))
        .forEach(reaction => {
          children.push(this.buildReactionListItem(reaction));
        });
    }

    listItemsContainer.innerHTML = '';
    listItemsContainer.append(...children);
    listItemsContainer.scrollTop = scrollPosition;
  }

  updateListItemName(id: string, newName: string) {
    const listItem = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
    if (!listItem) return;

    const nameElement = listItem.querySelector('.rsp-behaviors-item-name') as HTMLElement;
    if (nameElement) {
      nameElement.textContent = newName;
    }
  }

  buildBehaviorListItem(behavior: Behavior): HTMLElement {
    const isSelected = this.selectedBehaviorId === behavior.id;

    const button = advElement.createButton({
      id: `rsp-behavior-list-item-${behavior.id}`,
      onClick: () => {
        if (this.deleteMode) {
          this.handleDelete('behaviors', behavior.id);
        } else {
          this.selectBehavior(behavior.id);
        }
      },
      htmlOptions: {
        button: {
          classList: [selector.listItem],
          dataAttributes: {
            id: behavior.id,
            deletable: 'true',
            deleteMode: this.deleteMode,
            selected: isSelected
          }
        }
      }
    });

    const mainDiv = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-item-main'],
      children: [
        advElement.createCheckbox({
          id: `rsp-behavior-enabled-${CommonGenerateUniqueID()}`,
          label: behavior.name,
          setElementValue: () => behavior.enabled,
          setSettingValue: (val) => behavior.enabled = val,
          options: {
            direction: 'rowReverse'
          },
          htmlOptions: {
            label: {
              classList: ['rsp-behaviors-item-name']
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

    button.appendChild(mainDiv);
    return button;
  }

  buildTriggerListItem(trigger: Trigger): HTMLElement {
    const isSelected = this.selectedTriggerId === trigger.id;
    const hasConstraints = !!(trigger.constraints && Object.keys(trigger.constraints).length > 0);

    const button = advElement.createButton({
      id: `rsp-trigger-list-item-${trigger.id}`,
      onClick: () => {
        if (this.deleteMode) {
          this.handleDelete('triggers', trigger.id);
        } else {
          this.selectTrigger(trigger.id);
        }
      },
      htmlOptions: {
        button: {
          classList: [selector.listItem],
          dataAttributes: {
            id: trigger.id,
            deletable: 'true',
            deleteMode: this.deleteMode,
            selected: isSelected
          }
        }
      }
    });

    const badges: Array<{ tag: 'span'; classList: string[]; children: string[] }> = [
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
          classList: ['rsp-behaviors-item-name'],
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

    button.appendChild(mainDiv);
    return button;
  }

  buildReactionListItem(reaction: Reaction): HTMLElement {
    const isSelected = this.selectedReactionId === reaction.id;

    const button = advElement.createButton({
      id: `rsp-reaction-list-item-${reaction.id}`,
      onClick: () => {
        if (this.deleteMode) {
          this.handleDelete('reactions', reaction.id);
        } else {
          this.selectReaction(reaction.id);
        }
      },
      htmlOptions: {
        button: {
          classList: [
            selector.listItem,
          ],
          dataAttributes: {
            id: reaction.id,
            deletable: 'true',
            deleteMode: this.deleteMode,
            selected: isSelected
          }
        }
      }
    });

    const mainDiv = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-item-main'],
      children: [
        {
          tag: 'span',
          classList: ['rsp-behaviors-item-name'],
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

    button.appendChild(mainDiv);
    return button;
  }
  // #endregion !SECTION List Panel Building

  // #region SECTION Editor Panel Building
  buildEditorPanel(): HTMLElement {
    const panel = ElementCreate({
      tag: 'div',
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

    return panel;
  }

  buildBehaviorEditor(behavior: Behavior): HTMLElement[] {
    const elements: HTMLElement[] = [];

    // Name
    elements.push(this.createInputField(
      'behaviors.field.name',
      behavior.name,
      (val) => {
        behavior.name = val;
        this.updateListItemName(behavior.id, val);
      }
    ));

    // Enabled
    elements.push(advElement.createCheckbox({
      id: 'rsp-behavior-editor-enabled',
      label: getText('behaviors.field.enabled'),
      setElementValue: () => behavior.enabled,
      setSettingValue: (val) => behavior.enabled = val,
      htmlOptions: {
        container: {
          classList: ['rsp-behaviors-field'],
        }
      }
    }));

    // Reaction Mode
    elements.push(this.createDropdownField(
      'behaviors.field.reaction_mode',
      behavior.reactionMode,
      ['all', 'random'] as ReactionMode[],
      (val) => behavior.reactionMode = val as ReactionMode,
    ));

    // Cooldown
    elements.push(this.createNumberInputField(
      'behaviors.field.cooldown',
      behavior.cooldownSec?.toString() || '',
      (val) => behavior.cooldownSec = val ? parseFloat(val) : undefined,
    ));

    // Triggers Section
    elements.push(this.buildTriggersSection(behavior));

    // Reactions Section
    elements.push(this.buildReactionsSection(behavior));

    return elements;
  }

  buildTriggerEditor(trigger: Trigger): HTMLElement[] {
    const elements: HTMLElement[] = [];

    // Name
    elements.push(this.createInputField(
      'behaviors.field.name',
      trigger.name,
      (val) => {
        trigger.name = val;
        this.updateListItemName(trigger.id, val);
      }
    ));

    // Type
    const typeOptions = TriggerTypeSchema.options;
    elements.push(this.createDropdownField(
      'behaviors.field.type',
      trigger.type,
      typeOptions,
      (val) => {
        const newTrigger = this.changeTriggerType(trigger, val as TriggerType);
        if (newTrigger) {
          this.settings.triggers[newTrigger.id] = newTrigger;
          this.selectedTriggerId = newTrigger.id;
          this.render();
        }
      }
    ));

    // Type-specific fields
    elements.push(...this.buildTriggerTypeFields(trigger));

    // Advanced Options (Collapsible)
    elements.push(this.buildCollapsibleSection(
      'behaviors.section.advanced_options',
      this.buildTriggerAdvancedOptions(trigger)
    ));

    return elements;
  }

  buildTriggerTypeFields(trigger: Trigger): HTMLElement[] {
    const elements: HTMLElement[] = [];

    switch (trigger.type) {
      case 'speech':
        elements.push(this.createDropdownField(
          'behaviors.field.speech_type',
          trigger.speechType,
          ['any', 'normal', 'whisper'] as SpeechType[],
          (val) => trigger.speechType = val as SpeechType
        ));
        elements.push(this.buildContentArrayField(
          'behaviors.field.content',
          trigger.content,
          (val) => trigger.content = val
        ));
        elements.push(this.createDropdownField(
          'behaviors.field.match_mode',
          trigger.matchMode,
          ['startsWith', 'contains', 'endsWith', 'exact', 'regex'] as MatchMode[],
          (val) => trigger.matchMode = val as MatchMode
        ));
        break;
      case 'emote':
      case 'action':
        elements.push(this.buildContentArrayField(
          'behaviors.field.content',
          trigger.content,
          (val) => trigger.content = val
        ));
        elements.push(this.createDropdownField(
          'behaviors.field.match_mode',
          trigger.matchMode,
          ['startsWith', 'contains', 'endsWith', 'exact', 'regex'] as MatchMode[],
          (val) => trigger.matchMode = val as MatchMode
        ));
        break;
      case 'activity':
        elements.push(this.buildStringArrayField(
          'behaviors.field.activity_names',
          trigger.activityName,
          (val) => trigger.activityName = val
        ));
        elements.push(this.buildStringArrayField(
          'behaviors.field.group_names',
          trigger.groupName,
          (val) => trigger.groupName = val
        ));
        break;
      case 'orgasm':
        elements.push(this.createDropdownField(
          'behaviors.field.orgasm_type',
          trigger.orgasmType,
          ['any', 'normal', 'resisted', 'ruinedResisted', 'ruinedTimeout', 'ruinedSurrendered'] as OrgasmType[],
          (val) => trigger.orgasmType = val as OrgasmType
        ));
        break;
      case 'roomPresence':
        elements.push(this.createDropdownField(
          'behaviors.field.room_presence_event',
          trigger.event,
          ['leave', 'join', 'leashed'] as RoomPresenceEvent[],
          (val) => trigger.event = val as RoomPresenceEvent
        ));
        break;
      default:
        assertNever(trigger);
    }

    return elements;
  }

  buildTriggerAdvancedOptions(trigger: Trigger): HTMLElement[] {
    const elements: HTMLElement[] = [];

    // Constraint Mode
    elements.push(this.createDropdownField(
      'behaviors.field.constraint_mode',
      trigger.constraintMode || 'all',
      ['any', 'all'] as ConstraintMode[],
      (val) => trigger.constraintMode = val as ConstraintMode
    ));

    // Constraints
    trigger.constraints ??= {};

    // Source
    elements.push(this.buildIncludeExcludeField(
      'behaviors.field.constraint_source',
      trigger.constraints.source,
      (val) => trigger.constraints!.source = val
    ));

    // Target
    elements.push(this.buildIncludeExcludeField(
      'behaviors.field.constraint_target',
      trigger.constraints.target,
      (val) => trigger.constraints!.target = val
    ));

    // Arousal Min/Max
    elements.push(this.createNumberInputField(
      'behaviors.field.arousal_min',
      trigger.constraints.arousalMin?.toString() || '',
      (val) => trigger.constraints!.arousalMin = val ? parseFloat(val) : undefined
    ));

    elements.push(this.createNumberInputField(
      'behaviors.field.arousal_max',
      trigger.constraints.arousalMax?.toString() || '',
      (val) => trigger.constraints!.arousalMax = val ? parseFloat(val) : undefined
    ));

    // In Room With Members
    elements.push(this.buildIncludeExcludeField(
      'behaviors.field.in_room_with_members',
      trigger.constraints.inRoomWithMembers,
      (val) => trigger.constraints!.inRoomWithMembers = val
    ));

    // In Room Named
    elements.push(this.buildIncludeExcludeField(
      'behaviors.field.in_room_named',
      trigger.constraints.inRoomNamed,
      (val) => trigger.constraints!.inRoomNamed = val
    ));

    // Cooldown
    elements.push(this.createNumberInputField(
      'behaviors.field.cooldown',
      trigger.cooldownSec?.toString() || '',
      (val) => trigger.cooldownSec = val ? parseFloat(val) : undefined
    ));

    return elements;
  }

  buildReactionEditor(reaction: Reaction): HTMLElement[] {
    const elements: HTMLElement[] = [];

    // Name
    elements.push(this.createInputField(
      'behaviors.field.name',
      reaction.name,
      (val) => {
        reaction.name = val;
        this.updateListItemName(reaction.id, val);
      }
    ));

    // Type
    const typeOptions = ReactionTypeSchema.options;
    elements.push(this.createDropdownField(
      'behaviors.field.type',
      reaction.type,
      typeOptions,
      (val) => {
        const newReaction = this.changeReactionType(reaction, val as ReactionType);
        if (newReaction) {
          this.settings.reactions[newReaction.id] = newReaction;
          this.selectedReactionId = newReaction.id;
          this.render();
        }
      }
    ));

    // Type-specific fields
    if (reaction.type === 'speech' || reaction.type === 'emote' || reaction.type === 'action') {
      elements.push(this.buildContentArrayField(
        'behaviors.field.content',
        reaction.content,
        (val) => reaction.content = val
      ));
    }

    return elements;
  }

  buildTriggersSection(behavior: Behavior): HTMLElement {
    const section = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-section'],
      children: [
        advElement.createLabel({
          id: 'rsp-behaviors-section-label-triggers',
          label: getText('behaviors.section.triggers'),
          htmlOptions: {
            classList: ['rsp-behaviors-section-label']
          }
        }),
        this.buildChipList(
          behavior.triggers.map(id => this.settings.triggers[id]).filter(Boolean) as Trigger[],
          (trigger) => {
            const index = behavior.triggers.indexOf(trigger.id);
            if (index > -1) {
              behavior.triggers.splice(index, 1);
              this.render();
            }
          }
        ),
        advElement.createButton({
          id: 'rsp-behavior-add-trigger',
          onClick: () => this.showTriggerSelector(behavior),
          options: {
            label: getText('behaviors.button.add_trigger')
          }
        })
      ]
    });

    return section;
  }

  buildReactionsSection(behavior: Behavior): HTMLElement {
    const section = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-section'],
      children: [
        advElement.createLabel({
          id: 'rsp-behaviors-section-label-reactions',
          label: getText('behaviors.section.reactions'),
          htmlOptions: {
            classList: ['rsp-behaviors-section-label']
          }
        }),
        this.buildChipList(
          behavior.reactions.map(id => this.settings.reactions[id]).filter(Boolean) as Reaction[],
          (reaction) => {
            const index = behavior.reactions.indexOf(reaction.id);
            if (index > -1) {
              behavior.reactions.splice(index, 1);
              this.render();
            }
          }
        ),
        advElement.createButton({
          id: 'rsp-behavior-add-reaction',
          onClick: () => this.showReactionSelector(behavior),
          options: {
            label: getText('behaviors.button.add_reaction')
          }
        })
      ]
    });

    return section;
  }
  // #endregion !SECTION Editor Panel Building

  // #region SECTION Field Builders
  buildChipList(items: Array<{ id: string; name: string }>, onRemove: (item: { id: string; name: string }) => void): HTMLElement {
    const container = ElementCreate({
      tag: 'div',
      classList: ['rsp-behaviors-chips'],
      children: items.map(item => {
        return ({
          tag: 'div',
          classList: [selector.chip],
          children: [
            {
              tag: 'span',
              children: [item.name]
            },
            advElement.createButton({
              id: `rsp-chip-remove-${item.id}`,
              onClick: () => onRemove(item),
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
      })
    });

    return container;
  }

  buildContentArrayField(labelKey: string, values: string[], onChange: (values: string[]) => void): HTMLElement {
    const addButton = advElement.createButton({
      id: `rsp-content-add-${CommonGenerateUniqueID()}`,
      onClick: () => {
        Modal.prompt(getText('behaviors.prompt.add_content'), { modalId: 'rsp-modal' }).then((response) => {
          if (response === null) return;
          values.push(response);
          onChange(values);
          this.render();
        });
      },
      options: {
        image: `${PUBLIC_URL}/images/plus.svg`,
        label: getText('behaviors.button.add_content')
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
      classList: ['rsp-behaviors-section'],
      children: [
        header,
        this.buildContentList(values, onChange)
      ]
    });

    return container;
  }

  buildContentList(values: string[], onChange: (values: string[]) => void): HTMLElement {
    const tooltip = this.deleteMode
      ? getText('behaviors.text.delete_mode')
      : getText('behaviors.text.edit_mode');

    const container = ElementCreate({
      tag: 'div',
      classList: [selector.contentList, 'scroll-box'],
      children: [
        ...values.map((value, index) => {
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
            onClick: async () => {
              if (this.deleteMode) {
                const confirmed = await this.confirmationModal(getText('behaviors.prompt.delete_content'));
                if (!confirmed) return;

                values.splice(index, 1);
                onChange(values);
                this.render();
              } else {
                Modal.prompt(getText('behaviors.prompt.edit_content'), { defaultValue: value, modalId: 'rsp-modal' }).then((newValue) => {
                  if (newValue === value) return;
                  else if (newValue === null) return;
                  else {
                    values[index] = newValue;
                    onChange(values);
                    this.render();
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

  buildStringArrayField(labelKey: string, values: string[], onChange: (values: string[]) => void): HTMLElement {
    return this.buildContentArrayField(labelKey, values, onChange);
  }

  buildIncludeExcludeField(labelKey: string, rule: { entries: Array<{ value: string; mode: 'include' | 'exclude' }> } | undefined, onChange: (rule: { entries: Array<{ value: string; mode: 'include' | 'exclude' }> } | undefined) => void): HTMLElement {
    const entries = rule?.entries || [];
    const addButton = advElement.createButton({
      id: `rsp-constraint-entry-add-${CommonGenerateUniqueID()}`,
      onClick: () => {
        Modal.prompt(getText('behaviors.prompt.add_content'), { modalId: 'rsp-modal' }).then((response) => {
          if (response === null) return;
          entries.push({ value: response, mode: 'include' });
          if (!rule) {
            rule = { entries: entries };
          } else {
            rule.entries = entries;
          }
          onChange(rule);
          this.render();
        });
      },
      options: {
        image: `${PUBLIC_URL}/images/plus.svg`,
        label: getText('behaviors.button.add_content')
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
      classList: ['rsp-behaviors-section'],
      children: [
        header,
        this.buildConstraintEntryList(
          entries,
          (updatedEntries) => {
            if (!rule) {
              rule = { entries: updatedEntries };
            } else {
              rule.entries = updatedEntries;
            }
            onChange(rule);
          }
        )
      ]
    });

    return container;
  }

  buildConstraintEntryList(entries: Array<{ value: string; mode: 'include' | 'exclude' }>, onChange: (entries: Array<{ value: string; mode: 'include' | 'exclude' }>) => void): HTMLElement {
    const tooltip = this.deleteMode
      ? getText('behaviors.text.delete_mode')
      : getText('behaviors.text.edit_mode');

    const container = ElementCreate({
      tag: 'div',
      classList: [selector.contentList, 'scroll-box'],
      children: [
        ...entries.map((entry, index) => {
          const entryContainer = ElementCreate({
            tag: 'div',
            classList: ['rsp-constraint-entry'],
            children: [
              this.createDropdownField(
                '',
                entry.mode,
                ['include', 'exclude'],
                (val) => {
                  entries[index].mode = val as 'include' | 'exclude';
                  onChange(entries);
                }
              ),
              advElement.createButton({
                id: `rsp-constraint-entry-${index}-${CommonGenerateUniqueID()}`,
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

                    entries.splice(index, 1);
                    onChange(entries);
                    this.render();
                  } else {
                    Modal.prompt(getText('behaviors.prompt.edit_content'), { defaultValue: entry.value, modalId: 'rsp-modal' }).then((newValue) => {
                      if (newValue === entry.value) return;
                      else if (newValue === null) return;
                      else {
                        entries[index].value = newValue;
                        onChange(entries);
                        this.render();
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

  createInputField(labelKey: string, value: string, onChange: (value: string) => void): HTMLElement {
    return advElement.createInput({
      id: `rsp-input-${CommonGenerateUniqueID()}`,
      type: 'text',
      label: getText(labelKey),
      setElementValue: () => value,
      setSettingValue: onChange,
      htmlOptions: {
        container: {
          classList: ['rsp-behaviors-field', 'rsp-behaviors-text-field'],
        }
      }
    });
  }

  createNumberInputField(labelKey: string, value: string, onChange: (value: string) => void): HTMLElement {
    return advElement.createInput({
      id: `rsp-input-${CommonGenerateUniqueID()}`,
      type: 'number',
      label: getText(labelKey),
      setElementValue: () => value,
      setSettingValue: onChange,
      htmlOptions: {
        container: {
          classList: ['rsp-behaviors-field', 'rsp-behaviors-number-field'],
        },
        input: {
          attributes: {
            step: '0.1'
          }
        }
      }
    });
  }

  createDropdownField(labelKey: string, value: string, options: string[], onChange: (value: string) => void): HTMLElement {
    return advElement.createDropdown({
      id: `rsp-dropdown-${CommonGenerateUniqueID()}`,
      label: getText(labelKey),
      optionsList: options.map(opt => {
        const label = getText('behaviors.option.' + opt);
        return {
          tag: 'option',
          attributes: {
            value: opt,
            label: label,
            selected: opt === value
          },
        };
      }),
      htmlOptions: {
        container: {
          classList: ['rsp-behaviors-field', 'rsp-behaviors-dropdown-field'],
        }
      },
      setElementValue: () => value,
      setSettingValue: onChange
    });
  }
  // #endregion !SECTION Field Builders

  // #region SECTION Selection Methods
  selectBehavior(id: string) {
    this.selectedBehaviorId = id;
    this.render();
  }

  selectTrigger(id: string) {
    this.selectedTriggerId = id;
    this.render();
  }

  selectReaction(id: string) {
    this.selectedReactionId = id;
    this.render();
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
    Modal.prompt(getText('behaviors.prompt.behavior_name'), { modalId: 'rsp-modal' }).then((name) => {
      if (name === null) return;

      const behavior = BehaviorsModule.createBehavior({
        name: name || getText('behaviors.text.new_behavior'),
        enabled: true,
      });

      if (behavior) {
        this.settings.behaviors[behavior.id] = behavior;
        this.selectedBehaviorId = behavior.id;
        this.render();
      }
    });
  }

  handleAddTrigger() {
    Modal.prompt(getText('behaviors.prompt.trigger_name'), { modalId: 'rsp-modal' }).then((name) => {
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
        this.render();
      }
    });
  }

  handleAddReaction() {
    Modal.prompt(getText('behaviors.prompt.reaction_name'), { modalId: 'rsp-modal' }).then((name) => {
      if (name === null) return;

      const reaction = BehaviorsModule.createReaction({
        name: name || getText('behaviors.text.new_reaction'),
        type: 'speech',
        content: []
      });

      if (reaction) {
        this.settings.reactions[reaction.id] = reaction;
        this.selectedReactionId = reaction.id;
        this.render();
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

    this.render();
  }
  // #endregion !SECTION Handlers

  // #region SECTION Selectors

  async showTriggerSelector(behavior: Behavior) {
    const availableTriggers = Object.values(this.settings.triggers).filter(t => !behavior.triggers.includes(t.id));

    if (availableTriggers.length === 0) {
      Modal.alert(getText('behaviors.text.no_triggers_available'), { modalId: 'rsp-modal' });
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
    this.render();
  }

  async showReactionSelector(behavior: Behavior) {
    const availableReactions = Object.values(this.settings.reactions).filter(r => !behavior.reactions.includes(r.id));

    if (availableReactions.length === 0) {
      Modal.alert(getText('behaviors.text.no_reactions_available'), { modalId: 'rsp-modal' });
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
    this.render();
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
    this.updateDeleteModeToggle();
    const deletableItems = document.querySelectorAll('[data-deletable]');
    deletableItems.forEach(item => {
      item.toggleAttribute('data-delete-mode', this.deleteMode);
    });
  }

  updateDeleteModeToggle() {
    const button = ElementWrap(selector.deleteModeToggle);
    if (button) {
      button.toggleAttribute('data-delete-mode', this.deleteMode);
    }
  }

  async confirmationModal(message: string): Promise<boolean> {
    return this.doNotShowConfirmation || await Modal.confirm([
      message,
      advElement.createCheckbox({
        id: 'rsp-do-not-show-confirmation',
        label: getText('behaviors.text.do_not_show_this_again_until_leaving_this_screen'),
        setSettingValue: (val) => this.doNotShowConfirmation = val
      })
    ], { modalId: 'rsp-modal' });
  }
  // #endregion !SECTION Utility Methods
}

exportToGlobal('GuiResponses', GuiBehaviors);
