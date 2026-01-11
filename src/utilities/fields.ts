import { advElement, getText } from 'bc-deeplib/deeplib';

const selector = Object.freeze({
  inputField: (id: string) => `rsp-input-field-${id}`,
  numberInputField: (id: string) => `rsp-number-input-field-${id}`,
  dropdownField: (id: string) => `rsp-dropdown-field-${id}`,
  contentListSection: (id: string) => `rsp-content-list-section-${id}`,
  collapsibleHeader: 'rsp-behaviors-collapsible-header',
  collapsibleContent: 'rsp-behaviors-collapsible-content',
  collapsibleSection: 'rsp-behaviors-collapsible',
});

interface InputFieldOptions {
  id: string;
  labelKey: string;
  value?: string;
  onChange: (value: string) => void;
}
export function createInputField({ id, labelKey, value = '', onChange }: InputFieldOptions): HTMLElement {
  const elementId = selector.inputField(id);
  const thisElement = ElementWrap(elementId);
  if (thisElement) {
    thisElement.replaceChildren();
  }

  const element = advElement.createInput({
    id: elementId,
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
  if (thisElement) {
    thisElement.replaceWith(element);
  }

  return element;
}

interface NumberInputFieldOptions {
  id: string;
  labelKey: string;
  value?: string;
  onChange: (value: string) => void;
  step?: string;
  min?: string;
  max?: string;
}
export function createNumberInputField({ id, labelKey, value = '', onChange, step = '1', min = '0', max = '100' }: NumberInputFieldOptions): HTMLElement {
  step = Number(step).toString();
  min = Number(min).toString();
  max = Number(max).toString();
  const elementId = selector.inputField(id);
  const thisElement = ElementWrap(elementId);
  if (thisElement) {
    thisElement.replaceChildren();
  }

  const element = advElement.createInput({
    id: elementId,
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
          step: step,
          min: min,
          max: max
        }
      }
    }
  });

  if (thisElement) {
    thisElement.replaceWith(element);
  }

  return element;
}

interface DropdownFieldOptions {
  id: string;
  labelKey: string;
  value?: string;
  options: string[];
  onChange: (value: string) => void;
}
export function createDropdownField({ id, labelKey, value = '', options, onChange }: DropdownFieldOptions): HTMLElement {
  value = value || options[0];
  const elementId = selector.dropdownField(id);
  const thisElement = ElementWrap(elementId);
  if (thisElement) {
    thisElement.replaceChildren();
  }

  const element = advElement.createDropdown({
    id: elementId,
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

  if (thisElement) {
    thisElement.replaceWith(element);
  }

  return element;
}

interface ContentListSectionOptions {
  id: string;
  labelKey: string;
  onAdd: () => void;
  addLabel: string;
  content: HTMLElement;
}
export function buildContentListSection({ id, labelKey, onAdd, addLabel, content }: ContentListSectionOptions): HTMLElement {
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

interface CollapsibleSectionOptions {
  headerKey: string;
  content: HTMLElement[];
}
export function buildCollapsibleSection({ headerKey, content }: CollapsibleSectionOptions): HTMLElement {

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