import { advElement, getText } from 'bc-deeplib/deeplib';

const selector = Object.freeze({
  inputField: (id: string) => `rsp-input-field-${id}`,
  numberInputField: (id: string) => `rsp-number-input-field-${id}`,
  dropdownField: (id: string) => `rsp-dropdown-field-${id}`,
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
// #endregion !SECTION Field Builders
