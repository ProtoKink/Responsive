import { advElement, exportToGlobal, getText, Modal } from 'bc-deeplib/deeplib';

export async function itemSelectorModal(options: { buttons?: { label: string, value: string, selected?: boolean }[], limit?: number, prompt?: string, showSearch?: boolean }): Promise<string[] | null> {
  options ??= {};
  const buttons = options.buttons ?? [];
  const limit = options.limit ?? Infinity;
  const showSearch = options.showSearch ?? false;
  if (buttons.length === 0 || limit < 1) {
    return [];
  }
  const prompt = options.prompt ?? getText('behaviors.prompt.select_item');
  const selectedIds: Set<string> = new Set(buttons.filter(button => button.selected).map(button => button.value));
  while (selectedIds.size > limit) {
    const oldest = selectedIds.values().next().value;
    if (oldest === undefined) {
      break;
    }
    selectedIds.delete(oldest);
  }

  const buttonByValue = new Map<string, HTMLElement>();
  const buttonElements = buttons.map(button => {
    const isSelected = selectedIds.has(button.value);
    const buttonElement = advElement.createButton({
      id: `rsp-selector-${button.value}`,
      onClick: function () {
        const state = this.toggleAttribute('data-selected');
        if (state) {
          if (!selectedIds.has(button.value)) {
            if (selectedIds.size >= limit) {
              const oldest = selectedIds.values().next().value;
              if (oldest !== undefined) {
                selectedIds.delete(oldest);
                buttonByValue.get(oldest)?.removeAttribute('data-selected');
              }
            }
            selectedIds.add(button.value);
          }
        } else {
          selectedIds.delete(button.value);
        }
      },
      options: {
        label: button.label
      },
      htmlOptions: {
        button: {
          classList: ['rsp-selector-button'],
          dataAttributes: {
            selected: isSelected ? '' : undefined,
            label: button.label
          },
          attributes: {
            name: button.value
          }
        }
      }
    });
    buttonByValue.set(button.value, buttonElement);
    return buttonElement;
  });

  const searchInput = showSearch ? advElement.createInput({
    id: 'rsp-selector-search',
    type: 'text',
    setSettingValue(val) {
      const searchTerm = val.toLowerCase().trim();
      buttonElements.forEach(button => {
        if (button instanceof HTMLElement) {
          const label = button.getAttribute('data-label') || button.textContent || '';
          const matches = label.toLowerCase().includes(searchTerm);
          button.style.display = matches ? '' : 'none';
        }
      });
    },
    htmlOptions: {
      input: {
        classList: ['rsp-selector-search-input'],
        attributes: {
          placeholder: getText('behaviors.prompt.search_items')
        }
      }
    }
  }) : null;

  return await Modal.confirm([
    advElement.createLabel({ id: null, label: prompt }),
    ElementCreate({ tag: 'br' }),
    ...(searchInput ? [searchInput] : []),
    {
      tag: 'div',
      classList: ['rsp-selector-buttons-container', 'scroll-box'],
      children: buttonElements
    }
  ], { modalClassList: ['rsp-modal'] }).then((result) => {
    if (!result) {
      return null;
    }
    return Array.from(selectedIds);
  });
}

export async function animationSelectorModal(options?: { selectedIds?: string[]; limit?: number; animations?: Record<string, { id: string; name: string }> }): Promise<string[] | null> {
  options ??= {};
  const animations = options.animations ?? {};
  const buttons = Object.values(animations).map(animation => ({
    label: animation.name,
    value: animation.id,
    selected: options?.selectedIds?.includes(animation.id) ?? false,
  }));

  return await itemSelectorModal({ buttons, limit: options.limit });
}

export async function bodyPartSelectorModal(options?: { selectedParts?: AssetGroupItemName[], limit?: number }): Promise<AssetGroupItemName[] | null> {
  options ??= {};
  const limit = options.limit ?? Infinity;
  if (limit < 1) {
    return [];
  }

  options.selectedParts = options.selectedParts?.filter(part => Boolean(part));
  const selectedParts: Set<AssetGroupItemName> = new Set(options.selectedParts ?? []);

  const groupsToConceal: AssetGroupItemName[] = [
    'ItemAddon',
    'ItemHandheld',
    'ItemDevices',
    'ItemMisc',
    'ItemNipplesPiercings',
    'ItemMouth2',
    'ItemMouth3',
    'ItemTorso2',
    'ItemNeckRestraints',
    'ItemNeckAccessories'
  ];

  const bodyPartGrid = DialogFocusGroup.Create('rsp-body-part-selector', function () {
    this.setAttribute('aria-checked', 'false');

    const clickedPart = this.name as AssetGroupItemName;
    const wasSelected = this.getAttribute('data-selected') === '';

    if (wasSelected) {
      if (selectedParts.has(clickedPart)) {
        selectedParts.delete(clickedPart);
      }
    } else {
      if (!selectedParts.has(clickedPart)) {
        if (selectedParts.size >= limit) {
          const oldest = Array.from(selectedParts).shift();
          if (oldest) {
            selectedParts.delete(oldest);
            const firstMirrored = ActivityGetAllMirrorGroups('Female3DCG', oldest);
            firstMirrored.forEach(group => {
              const elements = bodyPartGrid.querySelectorAll(`[name='${group.Name}']`);
              elements.forEach(element => element.removeAttribute('data-selected'));
            });
          }
        }
        selectedParts.add(clickedPart);
      }
    }

    const mirrored = ActivityGetAllMirrorGroups('Female3DCG', clickedPart);
    mirrored.forEach(group => {
      const elements = bodyPartGrid.querySelectorAll(`[name='${group.Name}']`);
      elements.forEach(element => element.toggleAttribute('data-selected'));
    });
  }, {
    useDynamicGroupName: true
  });

  for (const part of selectedParts) {
    const partElement = bodyPartGrid.querySelectorAll(`[name='${part}']`);
    if (partElement) {
      partElement.forEach(element => element.setAttribute('data-selected', ''));
    }
  }

  for (const bodyPart of groupsToConceal) {
    const bodyPartElement = bodyPartGrid.querySelectorAll(`[id^='rsp-body-part-selector-${bodyPart}'`);
    if (bodyPartElement) {
      bodyPartElement.forEach(element => element.setAttribute('concealed', 'true'));
    }
  }

  const selectAllButton = advElement.createButton({
    id: 'rsp-body-part-select-all',
    onClick: function () {
      const visibleElements = Array.from(bodyPartGrid.querySelectorAll('[name]:not([concealed])')) as HTMLElement[];

      for (const element of visibleElements) {
        const partName = element.getAttribute('name') as AssetGroupItemName;
        if (!partName || selectedParts.has(partName)) {
          continue;
        }
        if (selectedParts.size >= limit) {
          break;
        }
        selectedParts.add(partName);
        element.setAttribute('data-selected', '');

        const mirrored = ActivityGetAllMirrorGroups('Female3DCG', partName);
        mirrored.forEach(group => {
          const elements = bodyPartGrid.querySelectorAll(`[name='${group.Name}']`);
          elements.forEach(el => el.setAttribute('data-selected', ''));
        });
      }
    },
    options: {
      label: getText('behaviors.prompt.select_all')
    },
    htmlOptions: {
      button: {
        classList: ['rsp-select-all-button']
      }
    }
  });

  const deselectAllButton = advElement.createButton({
    id: 'rsp-body-part-deselect-all',
    onClick: function () {
      const partsToDeselect = [...selectedParts];
      selectedParts.clear();

      partsToDeselect.forEach(part => {
        const elements = bodyPartGrid.querySelectorAll(`[name='${part}']`);
        elements.forEach(element => element.removeAttribute('data-selected'));

        const mirrored = ActivityGetAllMirrorGroups('Female3DCG', part);
        mirrored.forEach(group => {
          const mirrorElements = bodyPartGrid.querySelectorAll(`[name='${group.Name}']`);
          mirrorElements.forEach(element => element.removeAttribute('data-selected'));
        });
      });
    },
    options: {
      label: getText('behaviors.prompt.deselect_all')
    },
    htmlOptions: {
      button: {
        classList: ['rsp-deselect-all-button']
      }
    }
  });

  const label = limit > 1 ? getText('behaviors.prompt.select_multiple_items') : getText('behaviors.prompt.select_item');

  return await Modal.confirm([
    advElement.createLabel({ id: null, label }),
    ElementCreate({ tag: 'br' }),
    {
      tag: 'div',
      classList: ['rsp-selector-buttons-container'],
      children: [
        bodyPartGrid
      ]
    }
  ], {
    modalClassList: ['rsp-modal', 'rsp-body-part-selector-modal'],
    onShow() {
      const buttonContainer = this.querySelector('.deeplib-modal-button-container');
      if (buttonContainer) {
        const controlsContainer = ElementCreate({
          tag: 'div',
          classList: ['rsp-selector-controls'],
          children: [
            selectAllButton,
            deselectAllButton
          ]
        });
        buttonContainer.insertBefore(controlsContainer, buttonContainer.firstChild);
      }
    },
  }).then((result) => {
    if (!result) {
      return null;
    }
    return Array.from(selectedParts).filter(part => Boolean(part));
  });
}

export async function activitySelectorModal(options?: { selectedActivities?: string[], limit?: number }): Promise<string[] | null> {
  options ??= {};
  const limit = options.limit ?? Infinity;
  if (limit < 1) {
    return [];
  }

  options.selectedActivities = options.selectedActivities?.filter(activity => Boolean(activity));
  const selectedActivities: Set<string> = new Set(options.selectedActivities ?? []);
  const allActivities = AssetAllActivities('Female3DCG');

  const onClick: ((this: HTMLButtonElement, ev: MouseEvent | TouchEvent) => any) = function () {
    const wasSelected = this.hasAttribute('data-selected');
    const activityGrid = ElementWrap('rsp-activity-selector-grid');

    if (wasSelected) {
      if (selectedActivities.has(this.name)) {
        selectedActivities.delete(this.name);
      }
      this.removeAttribute('data-selected');
    } else {
      if (!selectedActivities.has(this.name)) {
        if (selectedActivities.size >= limit) {
          const oldest = Array.from(selectedActivities).shift();
          if (oldest && activityGrid) {
            const oldestElement = activityGrid.querySelector(`[name='${oldest}']`);
            if (oldestElement) {
              oldestElement.removeAttribute('data-selected');
              selectedActivities.delete(oldest);
            }
          }
        }
        selectedActivities.add(this.name);
      }
      this.setAttribute('data-selected', '');
    }
  };

  const activityButtons = allActivities.map(activity => {
    const isSelected = selectedActivities.has(activity.Name);
    return advElement.createButton({
      id: `rsp-activity-selector-${activity.Name}`,
      onClick: onClick,
      options: {
        label: ActivityDictionaryText(`Activity${activity.Name}`)
      },
      htmlOptions: {
        button: {
          classList: ['rsp-activity-selector-button'],
          attributes: {
            name: activity.Name,
          },
          dataAttributes: {
            activityLabel: ActivityDictionaryText(`Activity${activity.Name}`),
            selected: isSelected,
          }
        }
      }
    });
  });

  const activityGrid = ElementCreate({
    tag: 'div',
    classList: ['rsp-activity-selector-grid', 'scroll-box'],
    attributes: {
      id: 'rsp-activity-selector-grid'
    },
    children: activityButtons
  });

  const getVisibleButtons = (): HTMLButtonElement[] => {
    return activityButtons.filter(button => {
      if (!(button instanceof HTMLElement)) return false;
      return button.style.display !== 'none';
    }) as HTMLButtonElement[];
  };

  const selectAllButton = advElement.createButton({
    id: 'rsp-activity-select-all',
    onClick: function () {
      const visibleButtons = getVisibleButtons();

      for (const button of visibleButtons) {
        const activityName = button.name;
        if (!selectedActivities.has(activityName)) {
          if (selectedActivities.size >= limit) {
            break;
          }
          selectedActivities.add(activityName);
          button.setAttribute('data-selected', '');
        }
      }
    },
    options: {
      label: getText('behaviors.prompt.select_all')
    },
    htmlOptions: {
      button: {
        classList: ['rsp-select-all-button']
      }
    }
  });

  const deselectAllButton = advElement.createButton({
    id: 'rsp-activity-deselect-all',
    onClick: function () {
      const activityGrid = ElementWrap('rsp-activity-selector-grid');

      selectedActivities.clear();

      if (activityGrid) {
        const allSelectedButtons = activityGrid.querySelectorAll('[data-selected]');
        allSelectedButtons.forEach(button => {
          button.removeAttribute('data-selected');
        });
      }
    },
    options: {
      label: getText('behaviors.prompt.deselect_all')
    },
    htmlOptions: {
      button: {
        classList: ['rsp-deselect-all-button']
      }
    }
  });

  const searchInput = advElement.createInput({
    id: 'rsp-activity-search',
    type: 'text',
    setSettingValue(val) {
      const searchTerm = val.toLowerCase().trim();
      activityButtons.forEach(button => {
        if (button instanceof HTMLElement) {
          const label = button.getAttribute('data-activity-label') || button.textContent || '';
          const matches = label.toLowerCase().includes(searchTerm);
          button.style.display = matches ? '' : 'none';
        }
      });
    },
    htmlOptions: {
      input: {
        attributes: {
          placeholder: getText('behaviors.prompt.search_activities'),
        }
      }
    }
  });

  const label = limit > 1 ? getText('behaviors.prompt.select_multiple_items') : getText('behaviors.prompt.select_item');

  return await Modal.confirm([
    advElement.createLabel({ id: null, label }),
    searchInput,
    activityGrid
  ], {
    modalClassList: ['rsp-modal', 'rsp-activity-selector-modal'], onShow() {
      const buttonContainer = this.querySelector('.deeplib-modal-button-container');
      if (buttonContainer) {
        const controlsContainer = ElementCreate({
          tag: 'div',
          classList: ['rsp-selector-controls'],
          children: [
            selectAllButton,
            deselectAllButton
          ]
        });
        buttonContainer.insertBefore(controlsContainer, buttonContainer.firstChild);
      }
    },
  }).then((result) => {
    if (!result) {
      return null;
    }
    return Array.from(selectedActivities).filter(part => Boolean(part));
  });
}
type MemberRole = 'friend' | 'submissive' | 'lover' | 'owner' | 'same_room' | 'player' | 'custom';
export interface MemberSelectorEntry {
  memberNumber: number;
  name: string;
  context: MemberRole;
}

export async function memberNumberSelectorModal(options?: {
  selectedMembers?: number[],
  limit?: number,
  includeFriends?: boolean,
  includeSubs?: boolean,
  includeLovers?: boolean,
  includeOwner?: boolean,
  includeInRoom?: boolean,
  includePlayer?: boolean,
}): Promise<number[] | null> {
  options ??= {};
  const limit = options.limit ?? Infinity;
  if (limit < 1) {
    return [];
  }

  const includeFriends = options.includeFriends ?? true;
  const includeSubs = options.includeSubs ?? true;
  const includeLovers = options.includeLovers ?? true;
  const includeOwner = options.includeOwner ?? true;
  const includeInRoom = options.includeInRoom ?? true;
  const includePlayer = options.includePlayer ?? true;

  const selectedMembers: Set<number> = new Set(options.selectedMembers ?? []);
  const memberEntries: Map<number, MemberSelectorEntry> = new Map();

  if (includePlayer && Player) {
    memberEntries.set(Player.MemberNumber, {
      memberNumber: Player.MemberNumber,
      name: CharacterNickname(Player),
      context: 'player'
    });
  }

  owner: if (includeOwner && Player?.Ownership) {
    const owner = Player.Ownership;
    if (!owner?.MemberNumber || isNaN(owner.MemberNumber)) break owner;
    memberEntries.set(owner.MemberNumber, {
      memberNumber: owner.MemberNumber,
      name: owner.Name,
      context: 'owner'
    });
  }

  if (includeLovers && Player.Lovership.length > 0) {
    for (const lover of Player.Lovership) {
      if (!lover?.MemberNumber || isNaN(lover.MemberNumber)) continue;
      if (memberEntries.has(lover.MemberNumber)) continue;
      memberEntries.set(lover.MemberNumber, {
        memberNumber: lover.MemberNumber,
        name: lover.Name,
        context: 'lover'
      });
    }
  }

  if (includeSubs && Player.SubmissivesList.size > 0) {
    for (const sub of Player.SubmissivesList) {
      if (memberEntries.has(sub)) continue;
      memberEntries.set(sub, {
        memberNumber: sub,
        name: Player.FriendNames.get(sub) ?? getText('behaviors.name.unknown'),
        context: 'submissive'
      });
    }
  }

  if (includeFriends && Player.FriendNames.size > 0) {
    for (const [friendNumber, friendName] of Player.FriendNames) {
      if (!friendNumber || memberEntries.has(friendNumber)) continue;
      memberEntries.set(friendNumber, {
        memberNumber: friendNumber,
        name: friendName,
        context: 'friend'
      });
    }
  }

  if (includeInRoom && ChatRoomCharacter) {
    for (const character of ChatRoomCharacter) {
      if (!character.IsOnline()) continue;

      if (!character.MemberNumber || isNaN(character.MemberNumber)) continue;
      if (memberEntries.has(character.MemberNumber)) continue;
      memberEntries.set(character.MemberNumber, {
        memberNumber: character.MemberNumber,
        name: CharacterNickname(character),
        context: 'same_room'
      });
    }
  }

  if (selectedMembers.size > 0) {
    for (const memberNumber of selectedMembers) {
      if (memberEntries.has(memberNumber)) continue;
      memberEntries.set(memberNumber, {
        memberNumber: memberNumber,
        name: getText('behaviors.name.unknown'),
        context: 'custom'
      });
    }
  }

  const contextPriority: Record<MemberRole, number> = {
    'friend': 1,
    'submissive': 2,
    'lover': 3,
    'owner': 4,
    'same_room': 5,
    'custom': 6,
    'player': 7
  };

  const sortedEntries = Array.from(memberEntries.values()).sort((a, b) => {
    const aPriority = contextPriority[a.context] ?? 999;
    const bPriority = contextPriority[b.context] ?? 999;

    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    return a.name.localeCompare(b.name);
  });

  if (sortedEntries.length === 0) {
    return [];
  }

  const createGridRow = (entry: MemberSelectorEntry): HTMLElement => {
    const rowId = `rsp-member-row-${entry.memberNumber}`;
    const isSelected = selectedMembers.has(entry.memberNumber);

    return ElementCreate({
      tag: 'div',
      attributes: {
        id: rowId,
        'data-member-number': entry.memberNumber.toString()
      },
      classList: isSelected ? ['rsp-member-grid-row', 'rsp-member-row-selected'] : ['rsp-member-grid-row'],
      children: [
        {
          tag: 'div',
          classList: ['rsp-member-grid-cell', 'rsp-member-grid-cell-checkbox'],
          children: [
            advElement.createCheckbox({
              id: `rsp-member-select-${entry.memberNumber}`,
              setElementValue: () => isSelected,
              htmlOptions: {
                checkbox: {
                  eventListeners: {
                    click: function (this: HTMLInputElement) {
                      const memberNumber = parseInt(this.closest('.rsp-member-grid-row')?.getAttribute('data-member-number') || '0', 10);
                      const row = ElementWrap(rowId);

                      if (this.checked) {
                        if (selectedMembers.size >= limit) {
                          const firstSelected = Array.from(selectedMembers)[0];
                          selectedMembers.delete(firstSelected);
                          const firstRow = document.querySelector(`[data-member-number="${firstSelected}"]`);
                          if (firstRow) {
                            const checkbox = firstRow.querySelector('input[type="checkbox"]') as HTMLInputElement;
                            if (checkbox) checkbox.checked = false;
                            firstRow.classList.remove('rsp-member-row-selected');
                          }
                        }
                        selectedMembers.add(memberNumber);
                        if (row) row.classList.add('rsp-member-row-selected');
                      } else {
                        selectedMembers.delete(memberNumber);
                        if (row) row.classList.remove('rsp-member-row-selected');
                      }
                    }
                  }
                }
              }
            }),
          ]
        },
        {
          tag: 'div',
          classList: ['rsp-member-grid-cell', 'rsp-member-grid-cell-name'],
          children: [
            entry.name
          ]
        },
        {
          tag: 'div',
          classList: ['rsp-member-grid-cell', 'rsp-member-grid-cell-number'],
          children: [
            entry.memberNumber.toString()
          ]
        },
        {
          tag: 'div',
          classList: ['rsp-member-grid-cell', 'rsp-member-grid-cell-context'],
          children: [
            getText(`behaviors.member_role.${entry.context}`)
          ]
        }
      ]
    }) as HTMLElement;
  };

  const gridContainer = ElementCreate({
    tag: 'div',
    classList: ['rsp-member-selector-grid'],
    children: [
      {
        tag: 'div',
        classList: ['rsp-member-grid-header'],
        children: [
          {
            tag: 'div',
            classList: ['rsp-member-grid-cell', 'rsp-member-grid-header-cell'],
          },
          {
            tag: 'div',
            classList: ['rsp-member-grid-cell', 'rsp-member-grid-header-cell'],
            children: [getText('behaviors.member_selector.name')]
          },
          {
            tag: 'div',
            classList: ['rsp-member-grid-cell', 'rsp-member-grid-header-cell'],
            children: [getText('behaviors.member_selector.number')]
          },
          {
            tag: 'div',
            classList: ['rsp-member-grid-cell', 'rsp-member-grid-header-cell'],
            children: [getText('behaviors.member_selector.context')]
          }
        ]
      },
      {
        tag: 'div',
        classList: ['rsp-member-grid-content', 'scroll-box'],
        attributes: {
          id: 'rsp-member-selector-content'
        },
        children: sortedEntries.map(entry => createGridRow(entry))
      }
    ]
  });

  const selectAllButton = advElement.createButton({
    id: 'rsp-member-select-all',
    onClick: function () {
      const checkboxes = gridContainer.querySelectorAll('.rsp-member-grid-content input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      for (const checkbox of Array.from(checkboxes).reverse()) {
        if (checkbox.checked) continue;
        checkbox.click();
      }
    },
    options: {
      label: getText('behaviors.prompt.select_all')
    },
    htmlOptions: {
      button: {
        classList: ['rsp-select-all-button']
      }
    }
  });

  const deselectAllButton = advElement.createButton({
    id: 'rsp-member-deselect-all',
    onClick: function () {
      const checkboxes = gridContainer.querySelectorAll('.rsp-member-grid-content input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      for (const checkbox of Array.from(checkboxes).reverse()) {
        if (!checkbox.checked) continue;
        checkbox.click();
      }
    },
    options: {
      label: getText('behaviors.prompt.deselect_all')
    },
    htmlOptions: {
      button: {
        classList: ['rsp-deselect-all-button']
      }
    }
  });

  const searchInput = advElement.createInput({
    id: 'rsp-member-search',
    type: 'text',
    setSettingValue(val) {
      const searchTerm = val.toLowerCase().trim();
      const rows = gridContainer.querySelectorAll('.rsp-member-grid-row') as NodeListOf<HTMLElement>;
      rows.forEach(row => {
        const nameCell = row.querySelector('.rsp-member-grid-cell-name');
        const numberCell = row.querySelector('.rsp-member-grid-cell-number');
        const contextCell = row.querySelector('.rsp-member-grid-cell-context');

        const name = nameCell?.textContent?.toLowerCase() || '';
        const number = numberCell?.textContent?.toLowerCase() || '';
        const context = contextCell?.textContent?.toLowerCase() || '';

        const matches = name.includes(searchTerm) || number.includes(searchTerm) || context.includes(searchTerm);
        row.style.display = matches ? '' : 'none';
      });
    },
    htmlOptions: {
      input: {
        attributes: {
          placeholder: getText('behaviors.member_selector.search_placeholder')
        }
      }
    }
  });

  const addCustomEntries = (memberNumbers: number[]): void => {
    const contentContainer = ElementWrap('rsp-member-selector-content');
    if (!contentContainer) return;

    let addedAny = false;
    const newEntries: MemberSelectorEntry[] = [];

    for (const memberNumber of memberNumbers) {
      if (isNaN(memberNumber) || memberNumber <= 0) continue;
      if (memberEntries.has(memberNumber)) {
        selectedMembers.add(memberNumber);
        const existingRow = ElementWrap(`rsp-member-row-${memberNumber}`);
        if (!existingRow) continue;
        existingRow.classList.add('rsp-member-row-selected');
        const checkbox = existingRow.querySelector('input[type="checkbox"]') as HTMLInputElement;
        if (checkbox) checkbox.checked = true;
        continue;
      }

      const newEntry: MemberSelectorEntry = {
        memberNumber: memberNumber,
        name: getText('behaviors.name.unknown'),
        context: 'custom'
      };

      memberEntries.set(memberNumber, newEntry);
      selectedMembers.add(memberNumber);
      newEntries.push(newEntry);
      addedAny = true;
    }

    if (!addedAny) return;

    const allEntries = Array.from(memberEntries.values()).sort((a, b) => {
      const aPriority = contextPriority[a.context] ?? 999;
      const bPriority = contextPriority[b.context] ?? 999;

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return a.name.localeCompare(b.name);
    });

    contentContainer.replaceChildren();
    allEntries.forEach(entry => {
      const row = createGridRow(entry);
      contentContainer.appendChild(row);
    });
  };

  const customInput = advElement.createInput({
    id: 'rsp-member-custom-input',
    type: 'text',
    htmlOptions: {
      input: {
        attributes: {
          placeholder: getText('behaviors.member_selector.custom_input_placeholder'),
          pattern: '[0-9,\\s]+'
        }
      }
    }
  });

  const addCustomButton = advElement.createButton({
    id: 'rsp-member-add-custom',
    onClick: function () {
      const input = ElementWrap('rsp-member-custom-input') as HTMLInputElement;
      if (!input) return;

      const value = input.value.trim();
      if (!value) return;

      const memberNumbers = value.split(',')
        .map(num => parseInt(num.trim(), 10))
        .filter(num => !isNaN(num) && num > 0);

      if (memberNumbers.length === 0) return;

      addCustomEntries(memberNumbers);

      input.value = '';
    },
    options: {
      image: `${PUBLIC_URL}/images/plus.svg`
    },
    htmlOptions: {
      button: {
        classList: ['rsp-member-add-custom-button']
      }
    }
  });

  const customInputContainer = ElementCreate({
    tag: 'div',
    classList: ['rsp-member-custom-container'],
    children: [
      customInput,
      addCustomButton
    ]
  });

  return await Modal.confirm([
    advElement.createLabel({ id: null, label: getText('behaviors.prompt.select_item') }),
    searchInput,
    customInputContainer,
    gridContainer
  ], {
    modalClassList: ['rsp-modal', 'rsp-member-selector-modal'],
    onShow() {
      const buttonContainer = this.querySelector('.deeplib-modal-button-container');
      if (buttonContainer) {
        const controlsContainer = ElementCreate({
          tag: 'div',
          classList: ['rsp-selector-controls'],
          children: [
            selectAllButton,
            deselectAllButton
          ]
        });
        buttonContainer.insertBefore(controlsContainer, buttonContainer.firstChild);
      }
    },
  }).then((result) => {
    if (!result) {
      return null;
    }
    return Array.from(selectedMembers);
  });
}

export async function textReactionSelectorModal(options?: { initialValue?: string, prompt?: string }): Promise<string | null> {
  options ??= {};
  const initialValue = options?.initialValue ?? '';
  const prompt = options?.prompt ?? getText('behaviors.prompt.edit_text_reaction');
  let textValue = initialValue;

  const textareaId = 'rsp-text-reaction-textarea';
  const textarea = ElementCreate({
    tag: 'textarea',
    attributes: {
      id: textareaId,
      rows: '2',
    },
    classList: ['rsp-text-reaction-textarea'],
    eventListeners: {
      input: function () {
        textValue = this.value;
      }
    }
  }) as HTMLTextAreaElement;
  textarea.value = initialValue;

  const insertAtCursor = (text: string) => {
    const textareaElement = ElementWrap(textareaId) as HTMLTextAreaElement;
    if (!textareaElement) return;

    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;
    const currentValue = textareaElement.value;

    const newValue = currentValue.slice(0, start) + text + currentValue.slice(end);
    textareaElement.value = newValue;
    textValue = newValue;

    const newPosition = start + text.length;
    textareaElement.setSelectionRange(newPosition, newPosition);
    textareaElement.focus();
  };

  const templateStrings: { label: string, value: string }[] = [
    { label: 'Player Name', value: '{{player-name}}' },
    { label: 'Player Pronoun', value: '{{player-pronoun}}' },
    { label: 'Player Possessive', value: '{{player-possessive}}' },
    { label: 'Player Intensive', value: '{{player-intensive}}' },
    { label: 'Player Self', value: '{{player-self}}' },
    { label: 'Target Name', value: '{{target-name}}' },
    { label: 'Target Pronoun', value: '{{target-pronoun}}' },
    { label: 'Target Possessive', value: '{{target-possessive}}' },
    { label: 'Target Intensive', value: '{{target-intensive}}' },
    { label: 'Target Self', value: '{{target-self}}' },
    { label: 'Source Name', value: '{{source-name}}' },
    { label: 'Source Pronoun', value: '{{source-pronoun}}' },
    { label: 'Source Possessive', value: '{{source-possessive}}' },
    { label: 'Source Intensive', value: '{{source-intensive}}' },
    { label: 'Source Self', value: '{{source-self}}' }
  ];

  const templateButtons = templateStrings.map(template =>
    advElement.createButton({
      id: `rsp-template-${template.label.toLowerCase().replace(/\s+/g, '-')}`,
      onClick: function () {
        insertAtCursor(template.value);
      },
      options: {
        label: template.label
      },
      htmlOptions: {
        button: {
          classList: ['rsp-template-button']
        }
      }
    })
  );

  const templateButtonsContainer = ElementCreate({
    tag: 'div',
    classList: ['rsp-template-buttons-container'],
    children: templateButtons
  });

  const container = ElementCreate({
    tag: 'div',
    classList: ['rsp-text-reaction-container'],
    children: [
      advElement.createLabel({
        id: null,
        label: getText('behaviors.prompt.enter_text'),
        htmlOptions: {
          classList: ['rsp-text-reaction-label']
        }
      }),
      textarea,
      {
        tag: 'div',
        classList: ['rsp-template-section'],
        children: [
          advElement.createLabel({
            id: null,
            label: getText('behaviors.prompt.insert_template'),
            htmlOptions: {
              classList: ['rsp-template-section-label']
            }
          }),
          templateButtonsContainer
        ]
      }
    ]
  });

  return await Modal.confirm([
    advElement.createLabel({ id: null, label: prompt }),
    container
  ], {
    modalClassList: ['rsp-modal', 'rsp-text-reaction-modal'],
    onShow() {
      const textareaElement = ElementWrap(textareaId) as HTMLTextAreaElement;
      if (textareaElement) {
        textareaElement.focus();
        textareaElement.setSelectionRange(textareaElement.value.length, textareaElement.value.length);
      }
    }
  }).then((result) => {
    if (!result) {
      return null;
    }
    return textValue;
  });
}

export async function expressionSelectorModal(options: { group: ExpressionGroupName | 'Eyes1'; selectedExpressions?: ExpressionName[]; limit?: number }): Promise<ExpressionName[] | null> {
  const limit = options.limit ?? Infinity;
  if (limit < 1) {
    return [];
  }
  
  const selectedExpressions: Set<ExpressionName | null> = new Set(options.selectedExpressions ?? []);
  while (selectedExpressions.size > limit) {
    const oldest = selectedExpressions.values().next().value;
    if (oldest === undefined) {
      break;
    }
    selectedExpressions.delete(oldest);
  }
  const realGroup = options.group;
  const group = realGroup === 'Eyes1' ? 'Eyes' : realGroup;

  const allowedExpressions: (ExpressionName | null)[] = [];
  const assetGroup = AssetGroupGet('Female3DCG', group);
  if (assetGroup) {
    allowedExpressions.push(...(assetGroup.AllowExpression ?? []));
    if (!allowedExpressions.includes(null)) {
      allowedExpressions.unshift(null);
    }
  }
  
  const buttonByValue = new Map<ExpressionName, HTMLElement>();
  const buttons = allowedExpressions.map(expression => {
    const isSelected = selectedExpressions.has(expression);
    const buttonElement = advElement.createButton({
      id: null,
      onClick: function () {
        const state = this.toggleAttribute('data-selected');
        if (state) {
          if (!selectedExpressions.has(expression)) {
            if (selectedExpressions.size >= limit) {
              const oldest = selectedExpressions.values().next().value;
              if (oldest !== undefined) {
                selectedExpressions.delete(oldest);
                buttonByValue.get(oldest)?.removeAttribute('data-selected');
              }
            }
            selectedExpressions.add(expression);
          }
        } else {
          selectedExpressions.delete(expression);
        }
      },
      options: {
        image: expression ? `Assets/Female3DCG/${realGroup}/${expression}/Icon.png` : `Assets/Female3DCG/${group}/Icon.png`
      },
      htmlOptions: {
        button: {
          classList: ['rsp-expression-selector-button'],
          dataAttributes: {
            selected: isSelected ? '' : undefined
          }
        }
      }
    });
    buttonByValue.set(expression, buttonElement);
    return buttonElement;
  });

  return await Modal.confirm([
    advElement.createLabel({ id: null, label: getText('animatronikka.prompt.expression_name') }),
    {
      tag: 'div',
      classList: ['rsp-expression-selector-buttons-container'],
      children: buttons
    }
  ], { modalClassList: ['rsp-modal', 'rsp-expression-selector-modal'] }).then((result) => {
    if (!result) {
      return null;
    }
    return Array.from(selectedExpressions).filter(expression => Boolean(expression));
  });
}

exportToGlobal('activitySelectorModal', activitySelectorModal);
exportToGlobal('animationSelectorModal', animationSelectorModal);
exportToGlobal('bodyPartSelectorModal', bodyPartSelectorModal);
exportToGlobal('memberNumberSelectorModal', memberNumberSelectorModal);
exportToGlobal('textReactionSelectorModal', textReactionSelectorModal);