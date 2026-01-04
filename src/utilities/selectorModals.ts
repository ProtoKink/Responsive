import { advElement, exportToGlobal, getText, Modal } from 'bc-deeplib/deeplib';

export async function idSelectorModal(buttons: { label: string, value: string }[]): Promise<string[]> {
  const selectedIds: Set<string> = new Set();

  const buttonElements = buttons.map(button => advElement.createButton({
    id: `rsp-selector-${button.value}`,
    onClick: function () {
      const state = this.toggleAttribute('data-selected');
      if (state) {
        selectedIds.add(button.value);
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
      }
    }
  }));

  return await Modal.confirm([
    getText('behaviors.prompt.select_item'),
    ElementCreate({ tag: 'br' }),
    {
      tag: 'div',
      classList: ['rsp-selector-buttons-container'],
      children: buttonElements
    }
  ], { modalId: 'rsp-modal' }).then((result) => {
    if (!result) {
      return [];
    }
    return Array.from(selectedIds);
  });
}

export async function bodyPartSelectorModal(options?: { selectedParts?: AssetGroupItemName[], limit?: number }): Promise<AssetGroupItemName[]> {
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
        classList: ['rsp-body-part-select-all-button']
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
        classList: ['rsp-body-part-deselect-all-button']
      }
    }
  });

  return await Modal.confirm([
    getText('behaviors.prompt.select_item'),
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
      return [];
    }
    return Array.from(selectedParts).filter(part => Boolean(part));
  });
}

export async function activitySelectorModal(options?: { selectedActivities?: string[], limit?: number }): Promise<string[]> {
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
    const activityGrid = document.getElementById('rsp-activity-selector-grid');

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
      label: getText('behaviors.prompt.select_all') || 'Select All'
    },
    htmlOptions: {
      button: {
        classList: ['rsp-activity-select-all-button']
      }
    }
  });

  const deselectAllButton = advElement.createButton({
    id: 'rsp-activity-deselect-all',
    onClick: function () {
      const activityGrid = document.getElementById('rsp-activity-selector-grid');

      selectedActivities.clear();

      if (activityGrid) {
        const allSelectedButtons = activityGrid.querySelectorAll('[data-selected]');
        allSelectedButtons.forEach(button => {
          button.removeAttribute('data-selected');
        });
      }
    },
    options: {
      label: getText('behaviors.prompt.deselect_all') || 'Deselect All'
    },
    htmlOptions: {
      button: {
        classList: ['rsp-activity-deselect-all-button']
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

  return await Modal.confirm([
    getText('behaviors.prompt.select_item'),
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
      return [];
    }
    return Array.from(selectedActivities).filter(part => Boolean(part));
  });
}

exportToGlobal('activitySelectorModal', activitySelectorModal);
exportToGlobal('bodyPartSelectorModal', bodyPartSelectorModal);