import { advElement, BaseSubscreen, exportToGlobal, getText, layout, Modal, SettingElement, SubscreenOptions } from 'bc-deeplib/deeplib';
import { AnimatronikkaModule } from '../modules/animatronikka';
import { Animation, AnimatronikkaSettingsModel, Keyframe, KeyframeType } from '../models/animations';
import { buildContentListSection, createInputField } from '../utilities/fields';
import { idSelectorModal } from '../utilities/selectorModals';

type PreviewMode = 'full' | 'face' | 'body';

const selector = Object.freeze({
  container: 'rsp-animatronikka-container',
  listPanel: 'rsp-animatronikka-list-panel',
  editorPanel: 'rsp-animatronikka-editor-panel',
  listItem: (id: string) => `rsp-animatronikka-list-item-${id}`,
  listItemsContainer: 'rsp-animatronikka-list-items',
  addButton: 'rsp-animatronikka-add',
  deleteModeToggle: 'rsp-animatronikka-delete-mode',
  previewMode: 'rsp-animatronikka-preview-mode',
});

export class GuiAnimatronikka extends BaseSubscreen {
  static instance: GuiAnimatronikka;
  deleteMode = false;
  selectedAnimationId: string | null = null;
  searchQuery = '';
  previewMode: PreviewMode = 'full';

  protected static override subscreenOptions: SubscreenOptions = {
    name: 'animatronikka',
    icon: `${PUBLIC_URL}/images/clock.svg`,
    forceUpCharacter: true,
    drawCharacter: true,
  };

  get settings(): AnimatronikkaSettingsModel {
    return super.settings as AnimatronikkaSettingsModel;
  }

  set settings(val: AnimatronikkaSettingsModel) {
    super.settings = val;
  }

  get pageStructure(): SettingElement[][] {
    return [[
      {
        type: 'custom',
        id: selector.container,
        htmlOptions: {
          tag: 'div',
          classList: ['rsp-animatronikka-container'],
          parent: layout.getSubscreen(),
        },
        position: [150, 180, 'top-left'],
        size: () => [1780, 720],
      }
    ]];
  }

  load(): void {
    GuiAnimatronikka.instance = this;
    super.load();

    const deleteModeButton = advElement.createButton({
      id: selector.deleteModeToggle,
      onClick: () => this.toggleDeleteMode(),
      options: {
        image: `${PUBLIC_URL}/images/trash_bin.svg`,
        tooltip: getText('animatronikka.text.toggle_delete_mode')
      },
      size: [90, 90],
    });
    BaseSubscreen.menu?.prepend(deleteModeButton);

    this.render();
  }

  exit(): void {
    GuiAnimatronikka.instance.deleteMode = false;
    GuiAnimatronikka.instance.selectedAnimationId = null;
    GuiAnimatronikka.instance.searchQuery = '';
    super.exit();
  }

  render(): void {
    const container = ElementWrap(selector.container);
    if (!container) return;
    container.replaceChildren();
    container.append(this.buildListPanel(), this.buildEditorPanel());
  }

  buildListPanel(): HTMLElement {
    return ElementCreate({
      tag: 'div',
      classList: [selector.listPanel],
      children: [
        ElementCreate({
          tag: 'div',
          classList: ['rsp-animatronikka-list-header'],
          children: [
            this.buildSearchBar(),
            this.buildAddButton(),
          ]
        }),
        this.buildListItems(),
        this.buildLibraryControls()
      ]
    });
  }

  buildSearchBar(): HTMLElement {
    return advElement.createInput({
      id: 'rsp-animatronikka-search',
      type: 'text',
      setElementValue: () => this.searchQuery,
      setSettingValue: (val: string) => {
        this.searchQuery = val;
        this.updateListItems();
      },
      htmlOptions: {
        container: {
          classList: ['rsp-animatronikka-search']
        },
        input: {
          attributes: {
            placeholder: getText('animatronikka.search.placeholder')
          }
        }
      }
    });
  }

  buildAddButton(): HTMLElement {
    return advElement.createButton({
      id: selector.addButton,
      onClick: () => this.handleAddAnimation(),
      options: {
        image: `${PUBLIC_URL}/images/plus.svg`,
        tooltip: getText('animatronikka.button.add_animation')
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
    Object.values(this.settings.animations)
      .filter(animation => !query || animation.name.toLowerCase().includes(query))
      .reverse()
      .forEach(animation => children.push(this.buildListItem(animation)));

    const thisElement = ElementWrap(selector.listItemsContainer);
    const scrollBox = ElementCreate({
      tag: 'div',
      classList: ['scroll-box', selector.listItemsContainer],
      attributes: { id: selector.listItemsContainer },
      children
    });

    if (thisElement) {
      thisElement.replaceWith(scrollBox);
    }

    return scrollBox;
  }

  buildLibraryControls(): HTMLElement {
    const importButton = advElement.createButton({
      id: 'rsp-animatronikka-import',
      onClick: () => this.handleImportAnimations(),
      options: {
        image: `${PUBLIC_URL}/images/paste.svg`,
        tooltip: getText('animatronikka.button.import')
      },
      htmlOptions: {
        button: {
          classList: ['rsp-animatronikka-library-controls-button']
        }
      }
    });

    return ElementCreate({
      tag: 'div',
      classList: ['rsp-animatronikka-library-controls'],
      children: [importButton]
    });
  }

  updateListItems(): void {
    const listItemsContainer = document.querySelector(`.${selector.listItemsContainer}`) as HTMLElement;
    if (!listItemsContainer) return;
    const scrollPosition = listItemsContainer.scrollTop;
    const children: HTMLElement[] = [];
    const query = this.searchQuery.toLowerCase().trim();

    Object.values(this.settings.animations)
      .filter(animation => !query || animation.name.toLowerCase().includes(query))
      .reverse()
      .forEach(animation => children.push(this.buildListItem(animation)));

    listItemsContainer.replaceChildren();
    listItemsContainer.append(...children);
    listItemsContainer.scrollTop = scrollPosition;
  }

  buildListItem(animation: Animation): HTMLElement {
    const isSelected = this.selectedAnimationId === animation.id;
    const thisElement = ElementWrap(selector.listItem(animation.id));
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const button = advElement.createButton({
      id: selector.listItem(thisElement ? CommonGenerateUniqueID() : animation.id),
      onClick: () => {
        if (this.deleteMode) {
          this.handleDeleteAnimation(animation.id);
        } else {
          this.selectAnimation(animation.id);
        }
      },
      options: {
        label: animation.name,
      },
      htmlOptions: {
        button: {
          classList: ['rsp-animatronikka-list-item'],
          dataAttributes: {
            deletable: 'true',
            deleteMode: this.deleteMode,
            selected: isSelected
          }
        },
        label: {
          classList: ['truncated-text']
        }
      }
    });

    if (thisElement) {
      thisElement.replaceWith(button);
      button.id = selector.listItem(animation.id);
    }

    return button;
  }

  buildEditorPanel(): HTMLElement {
    const thisElement = ElementWrap(selector.editorPanel);
    if (thisElement) {
      thisElement.replaceChildren();
    }

    const panel = ElementCreate({
      tag: 'div',
      attributes: { id: selector.editorPanel },
      classList: [selector.editorPanel, 'scroll-box'],
      children: []
    });

    if (!this.selectedAnimationId) {
      panel.appendChild(advElement.createLabel({
        id: 'rsp-animatronikka-editor-empty',
        label: getText('animatronikka.text.select_animation_to_edit'),
        htmlOptions: {
          classList: ['rsp-animatronikka-editor-empty']
        }
      }));
    } else {
      const animation = this.settings.animations[this.selectedAnimationId];
      if (animation) {
        panel.append(...this.buildAnimationEditor(animation));
      }
    }

    if (thisElement) {
      thisElement.replaceWith(panel);
    }

    return panel;
  }

  buildAnimationEditor(animation: Animation): HTMLElement[] {
    const elements: HTMLElement[] = [];

    elements.push(this.buildPreviewControls(animation));

    const nameField = createInputField({
      id: `${animation.id}-name`,
      labelKey: 'animatronikka.field.name',
      value: animation.name,
      onChange: (val) => {
        animation.name = val;
        this.buildListItem(animation);
      }
    });
    elements.push(nameField);

    const tagsField = createInputField({
      id: `${animation.id}-tags`,
      labelKey: 'animatronikka.field.tags',
      value: animation.tags.join(', '),
      onChange: (val) => {
        animation.tags = val.split(',').map(v => v.trim()).filter(Boolean);
      }
    });
    elements.push(tagsField);

    const loopField = advElement.createCheckbox({
      id: `${animation.id}-loop`,
      label: getText('animatronikka.field.loop'),
      setElementValue: () => animation.loop ?? false,
      setSettingValue: (val) => (animation.loop = val),
      htmlOptions: {
        container: {
          classList: ['rsp-animatronikka-field']
        }
      }
    });
    elements.push(loopField);

    elements.push(this.buildKeyframesSection(animation));

    return elements;
  }

  buildPreviewControls(animation: Animation): HTMLElement {
    const playButton = advElement.createButton({
      id: `${animation.id}-play`,
      onClick: () => {
        AnimatronikkaModule.instance?.playAnimation(animation.id, { interrupt: true, priority: 1, target: Player });
      },
      options: {
        image: `${PUBLIC_URL}/images/play.svg`,
        tooltip: getText('animatronikka.button.play'),
        tooltipPosition: 'right'
      },
      htmlOptions: {
        button: {
          classList: ['rsp-animatronikka-playback-controls-button']
        }
      }
    });

    const stopButton = advElement.createButton({
      id: `${animation.id}-stop`,
      onClick: () => {
        if (Player?.MemberNumber) {
          AnimatronikkaModule.instance?.stopAnimation(Player.MemberNumber);
        }
      },
      options: {
        image: `${PUBLIC_URL}/images/stop.svg`,
        tooltip: getText('animatronikka.button.stop'),
        tooltipPosition: 'right'
      },
      htmlOptions: {
        button: {
          classList: ['rsp-animatronikka-playback-controls-button']
        }
      }
    });

    // Yeah, do ask me why it's here. I just moved it, and I'm too lazy to name its container properly
    const exportButton = advElement.createButton({
      id: `${animation.id}-export`,
      onClick: () => this.handleExportAnimation(animation),
      options: {
        image: `${PUBLIC_URL}/images/copy.svg`,
        tooltip: getText('animatronikka.button.export'),
        tooltipPosition: 'right'

      },
      htmlOptions: {
        button: {
          classList: ['rsp-animatronikka-export-button']
        }
      }
    });

    const previewLabel = advElement.createLabel({
      id: `${animation.id}-preview-label`,
      label: getText('animatronikka.text.preview_mode'),
      htmlOptions: { classList: ['rsp-animatronikka-preview-label'] }
    });

    const previewModes: PreviewMode[] = ['full', 'face', 'body'];
    const modeButtons = previewModes.map(mode =>
      advElement.createButton({
        id: `${selector.previewMode}-${mode}`,
        onClick: () => this.setPreviewMode(mode),
        options: {
          label: getText(`animatronikka.preview_mode.${mode}`)
        },
        htmlOptions: {
          button: {
            classList: ['rsp-animatronikka-preview-button'],
            dataAttributes: {
              selected: (this.previewMode === mode).toString()
            }
          }
        }
      })
    );

    return ElementCreate({
      tag: 'div',
      classList: ['rsp-animatronikka-preview-controls'],
      children: [
        playButton,
        stopButton,
        exportButton,
        ElementCreate({ tag: 'div', classList: ['rsp-animatronikka-preview-modes'], children: [previewLabel, ...modeButtons] })
      ]
    });
  }

  setPreviewMode(mode: PreviewMode): void {
    this.previewMode = mode;
    const buttons = document.querySelectorAll('.rsp-animatronikka-preview-button');
    buttons.forEach(button => {
      const buttonMode = button.getAttribute('id')?.split('-').pop();
      if (!buttonMode) return;
      button.setAttribute('data-selected', (buttonMode === mode).toString());
    });
    CharacterRefresh(Player, false, false);
  }

  buildKeyframesSection(animation: Animation): HTMLElement {
    const content = ElementCreate({
      tag: 'div',
      classList: ['rsp-animatronikka-keyframes'],
      children: animation.keyframes.map((keyframe, index) => this.buildKeyframeRow(animation, keyframe, index))
    });

    return buildContentListSection({
      id: `${animation.id}-keyframes`,
      labelKey: 'animatronikka.section.keyframes',
      onAdd: () => this.handleAddKeyframe(animation),
      addLabel: 'animatronikka.button.add_keyframe',
      content
    });
  }

  buildKeyframeRow(animation: Animation, keyframe: Keyframe, index: number): HTMLElement {
    const label = this.getKeyframeLabel(keyframe);

    const editButton = advElement.createButton({
      id: `${animation.id}-keyframe-edit-${keyframe.id}`,
      onClick: () => this.handleEditKeyframe(animation, keyframe),
      options: { label: getText('animatronikka.button.edit') },
      htmlOptions: { button: { classList: ['rsp-animatronikka-keyframe-button'] } }
    });

    const deleteButton = advElement.createButton({
      id: `${animation.id}-keyframe-delete-${keyframe.id}`,
      onClick: () => {
        if (this.deleteMode) {
          animation.keyframes.splice(index, 1);
          this.buildEditorPanel();
        }
      },
      options: { label: getText('animatronikka.button.delete') },
      htmlOptions: { button: { classList: ['rsp-animatronikka-keyframe-button'] } }
    });

    const moveUp = advElement.createButton({
      id: `${animation.id}-keyframe-up-${keyframe.id}`,
      onClick: () => this.moveKeyframe(animation, index, -1),
      options: { label: getText('animatronikka.button.move_up') },
      htmlOptions: { button: { classList: ['rsp-animatronikka-keyframe-button'] } }
    });

    const moveDown = advElement.createButton({
      id: `${animation.id}-keyframe-down-${keyframe.id}`,
      onClick: () => this.moveKeyframe(animation, index, 1),
      options: { label: getText('animatronikka.button.move_down') },
      htmlOptions: { button: { classList: ['rsp-animatronikka-keyframe-button'] } }
    });

    return ElementCreate({
      tag: 'div',
      classList: ['rsp-animatronikka-keyframe-row'],
      children: [
        advElement.createLabel({
          id: null,
          label: label,
          htmlOptions: {
            classList: ['rsp-animatronikka-keyframe-label', 'truncated-text']
          }
        }),
        ElementCreate({ tag: 'div', classList: ['rsp-animatronikka-keyframe-actions'], children: [moveUp, moveDown, editButton, deleteButton] })
      ]
    });
  }

  moveKeyframe(animation: Animation, index: number, delta: number): void {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= animation.keyframes.length) return;
    const [item] = animation.keyframes.splice(index, 1);
    animation.keyframes.splice(nextIndex, 0, item);
    this.buildEditorPanel();
  }

  getKeyframeLabel(keyframe: Keyframe): string {
    switch (keyframe.type) {
      case 'expression':
        return `${getText('animatronikka.keyframe.expression')} ${keyframe.group}: ${keyframe.expression ?? getText('animatronikka.text.none')} (${keyframe.durationMs}ms)`;
      case 'pose':
        return `${getText('animatronikka.keyframe.pose')} ${keyframe.poseName || getText('animatronikka.text.none')} (${keyframe.durationMs}ms)`;
      case 'restraint':
        return `${getText('animatronikka.keyframe.appearance')} ${keyframe.group}: ${keyframe.assetName ?? getText('animatronikka.text.none')} (${keyframe.durationMs}ms)`;
      default:
        return getText('animatronikka.text.unknown_keyframe');
    }
  }

  async handleAddAnimation(): Promise<void> {
    const name = await Modal.prompt(getText('animatronikka.prompt.animation_name'), { modalClassList: ['rsp-modal'] });
    if (name === null) return;
    const animation = AnimatronikkaModule.createAnimation({
      name: name || getText('animatronikka.text.new_animation'),
      keyframes: [],
      tags: [],
      loop: false
    });
    if (!animation) return;
    this.settings.animations[animation.id] = animation;
    this.selectedAnimationId = animation.id;
    this.buildListItems();
    this.buildEditorPanel();
  }

  async handleExportAnimation(animation: Animation): Promise<void> {
    const payload = JSON.stringify(animation, null, 2);
    await this.showJsonModal(getText('animatronikka.prompt.export_json'), payload, true);
  }

  async handleImportAnimations(): Promise<void> {
    const input = await this.showJsonModal(getText('animatronikka.prompt.import_json'), '', false);
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      let added = 0;
      items.forEach(item => {
        const inputAnimation: Animation = {
          id: '',
          name: typeof item?.name === 'string' ? item.name : getText('animatronikka.text.new_animation'),
          keyframes: Array.isArray(item?.keyframes) ? item.keyframes : [],
          tags: Array.isArray(item?.tags) ? item.tags : [],
          loop: typeof item?.loop === 'boolean' ? item.loop : false,
        };
        delete (inputAnimation as { id?: string }).id;
        const animation = AnimatronikkaModule.createAnimation(inputAnimation);
        if (animation) {
          this.settings.animations[animation.id] = animation;
          added++;
        }
      });
      if (added > 0) {
        this.buildListItems();
      }
      ToastManager.success(getText('animatronikka.text.import_success', { $count: added.toString() }));
    } catch (_error) {
      ToastManager.error(getText('animatronikka.text.import_failed'));
    }
  }

  async handleDeleteAnimation(id: string): Promise<void> {
    const animation = this.settings.animations[id];
    if (!animation) return;
    const confirmed = await Modal.confirm([
      getText('animatronikka.prompt.delete_confirm', { $name: animation.name })
    ], { modalClassList: ['rsp-modal'] });
    if (!confirmed) return;
    delete this.settings.animations[id];
    if (this.selectedAnimationId === id) this.selectedAnimationId = null;
    ElementWrap(selector.listItem(id))?.remove();
    this.buildEditorPanel();
  }

  selectAnimation(id: string): void {
    const old = this.selectedAnimationId ? this.settings.animations[this.selectedAnimationId] : undefined;
    this.selectedAnimationId = id;
    if (old) this.buildListItem(old);
    this.buildListItem(this.settings.animations[id]);
    this.buildEditorPanel();
  }

  async handleAddKeyframe(animation: Animation): Promise<void> {
    const type = await this.selectKeyframeType();
    if (!type) return;
    const keyframe = await this.promptKeyframe(type);
    if (!keyframe) return;
    animation.keyframes.push(keyframe);
    this.buildEditorPanel();
  }

  async handleEditKeyframe(animation: Animation, keyframe: Keyframe): Promise<void> {
    const updated = await this.promptKeyframe(keyframe.type, keyframe);
    if (!updated) return;
    const index = animation.keyframes.findIndex(k => k.id === keyframe.id);
    if (index === -1) return;
    animation.keyframes[index] = { ...updated, id: keyframe.id };
    this.buildEditorPanel();
  }

  async selectKeyframeType(): Promise<KeyframeType | null> {
    const selected = await idSelectorModal({
      buttons: (['expression', 'pose', 'restraint'] as KeyframeType[]).map(type => ({
        label: getText(`animatronikka.keyframe.${type}`),
        value: type,
      })),
      limit: 1
    });
    if (!selected || selected.length === 0) return null;
    return selected[0] as KeyframeType;
  }

  async promptKeyframe(type: KeyframeType, current?: Keyframe): Promise<Keyframe | null> {
    const duration = await Modal.prompt(getText('animatronikka.prompt.duration_ms'), {
      defaultValue: current ? current.durationMs.toString() : '500',
      modalClassList: ['rsp-modal']
    });
    if (duration === null) return null;
    const durationMs = Math.max(0, parseInt(duration || '0', 10));

    switch (type) {
      case 'expression': {
        const group = await Modal.prompt(getText('animatronikka.prompt.expression_group'), {
          defaultValue: current && current.type === 'expression' ? current.group : 'Mouth',
          modalClassList: ['rsp-modal']
        });
        if (group === null) return null;
        const expression = await Modal.prompt(getText('animatronikka.prompt.expression_name'), {
          defaultValue: current && current.type === 'expression' ? (current.expression ?? '') : '',
          modalClassList: ['rsp-modal']
        });
        if (expression === null) return null;
        const colorInput = await Modal.prompt(getText('animatronikka.prompt.color_optional'), {
          defaultValue: current && current.type === 'expression' ? this.formatColor(current.color) : '',
          modalClassList: ['rsp-modal']
        });
        if (colorInput === null) return null;
        return {
          id: current?.id ?? '',
          type,
          durationMs,
          group,
          expression: expression === '' ? null : expression,
          color: this.parseColor(colorInput),
        };
      }
      case 'pose': {
        const poseInput = await Modal.prompt(getText('animatronikka.prompt.pose_list'), {
          defaultValue: current && current.type === 'pose' ? current.poseName : '',
          modalClassList: ['rsp-modal']
        });
        if (poseInput === null) return null;
        const poseName = poseInput || '';
        return { id: current?.id ?? '', type, durationMs, poseName };
      }
      case 'restraint': {
        const group = await Modal.prompt(getText('animatronikka.prompt.appearance_group'), {
          defaultValue: current && current.type === 'restraint' ? current.group : '',
          modalClassList: ['rsp-modal']
        });
        if (group === null) return null;
        const assetName = await Modal.prompt(getText('animatronikka.prompt.asset_name_optional'), {
          defaultValue: current && current.type === 'restraint' ? (current.assetName ?? '') : '',
          modalClassList: ['rsp-modal']
        });
        if (assetName === null) return null;
        const colorInput = await Modal.prompt(getText('animatronikka.prompt.color_optional'), {
          defaultValue: current && current.type === 'restraint' ? this.formatColor(current.color) : '',
          modalClassList: ['rsp-modal']
        });
        if (colorInput === null) return null;
        return {
          id: current?.id ?? '',
          type,
          durationMs,
          group,
          assetName: assetName || undefined,
          color: this.parseColor(colorInput),
        };
      }
      default:
        return null;
    }
  }

  parseColor(input: string): string | string[] | undefined {
    const trimmed = input.trim();
    if (!trimmed) return undefined;
    if (trimmed.includes(',')) {
      return trimmed.split(',').map(value => value.trim()).filter(Boolean);
    }
    return trimmed;
  }

  formatColor(color?: string | string[] | null): string {
    if (!color) return '';
    return Array.isArray(color) ? color.join(', ') : color;
  }

  toggleDeleteMode(): void {
    this.deleteMode = !this.deleteMode;
    ElementWrap(selector.deleteModeToggle)?.toggleAttribute('data-delete-mode', this.deleteMode);
    const deletableItems = document.querySelectorAll('[data-deletable]');
    deletableItems.forEach(item => {
      item.toggleAttribute('data-delete-mode', this.deleteMode);
    });
  }

  async showJsonModal(title: string, initialValue: string, readOnly: boolean): Promise<string | null> {
    let value = initialValue;
    const textareaId = `rsp-animatronikka-json-${CommonGenerateUniqueID()}`;
    const textarea = ElementCreate({
      tag: 'textarea',
      attributes: {
        id: textareaId,
        rows: '10',
        readonly: readOnly ? 'true' : undefined,
      },
      classList: ['rsp-animatronikka-json-textarea'],
      eventListeners: {
        input: function () {
          value = this.value;
        }
      }
    }) as HTMLTextAreaElement;
    textarea.value = initialValue;

    return await Modal.confirm([
      advElement.createLabel({ id: null, label: title }),
      textarea
    ], { modalClassList: ['rsp-modal', 'rsp-animatronikka-json-modal'] }).then((result) => {
      if (!result) {
        return null;
      }
      return value;
    });
  }
}

exportToGlobal('GuiAnimatronikka', GuiAnimatronikka);
