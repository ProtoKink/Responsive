import { advElement, getText, Modal } from 'bc-deeplib/deeplib';

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

export async function bodyPartSelectorModal(): Promise<AssetGroupItemName[]> {
  const selectedParts: Set<AssetGroupItemName> = new Set();

  const bodyPartsWithoutActivities = CommonMemoize(() => {
    const bodyPartsWithoutActivities = new Set<AssetGroupItemName>();
    for (const group of AssetGroup) {
      if (!group.Zone) continue;
      const isPossible = ActivityPossibleOnGroup(Player, group.Name as AssetGroupItemName);
      if (!isPossible) {
        bodyPartsWithoutActivities.add(group.Name as AssetGroupItemName);
      }
    }
    return bodyPartsWithoutActivities;
  })();

  const bodyPartGrid = DialogFocusGroup.Create('rsp-body-part-selector', function () {
    this.setAttribute('aria-checked', 'false');

    const mirrored = ActivityGetAllMirrorGroups('Female3DCG', this.name as AssetGroupItemName);
    mirrored.forEach(group => {
      const elements = bodyPartGrid.querySelectorAll(`[name='${group.Name}']`);
      elements.forEach(element => element.toggleAttribute('data-selected'));
    });

    const state = this.getAttribute('data-selected');
    if (state === '') {
      selectedParts.add(this.name as AssetGroupItemName);
    } else if (state === null) {
      selectedParts.delete(this.name as AssetGroupItemName);
    }
  }, {
    useDynamicGroupName: true
  });

  for (const bodyPart of bodyPartsWithoutActivities) {
    const bodyPartElement = bodyPartGrid.querySelectorAll(`[id^='rsp-body-part-selector-${bodyPart}'`);
    if (bodyPartElement) {
      bodyPartElement.forEach(element => element.setAttribute('concealed', 'true'));
    }
  }

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
  ], { modalId: 'rsp-modal' }).then((result) => {
    if (!result) {
      return [];
    }
    return Array.from(selectedParts);
  });
}
