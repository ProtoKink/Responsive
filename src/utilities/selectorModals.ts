import { advElement, getText, Modal } from 'bc-deeplib/deeplib';

export async function idSelectorModal(buttons: { label: string, value: string }[]): Promise<string[]> {
  const selectedIds: Set<string> = new Set();

  const buttonElements = buttons.map(button => advElement.createButton({
    id: `rsp-selector-${button.value}`,
    onClick: function() {
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