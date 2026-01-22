import { advElement, BaseSubscreen, exportToGlobal, getText, layout, Modal, SettingElement, SubscreenOptions } from 'bc-deeplib/deeplib';
import { animationGroups, AnimatronikkaModule } from '../modules/animatronikka';
import { Animation, AnimatronikkaSettingsModel, Keyframe, KeyframeType } from '../models/animations';
import { buildContentListSection, createInputField } from '../utilities/fields';
import { bodyPartSelectorModal, expressionSelectorModal, itemSelectorModal } from '../utilities/selectorModals';
import { assertNever } from '@/utilities/other';

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
  draggingKeyframeId: string | null = null;

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
    this.attachKeyframeContainerDragHandlers(content, animation);

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

    const dragHandle = this.buildKeyframeDragHandle();
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

    const row = ElementCreate({
      tag: 'div',
      classList: ['rsp-animatronikka-keyframe-row'],
      children: [
        dragHandle,
        advElement.createLabel({
          id: null,
          label: label,
          htmlOptions: {
            classList: ['rsp-animatronikka-keyframe-label', 'truncated-text']
          }
        }),
        ElementCreate({ tag: 'div', classList: ['rsp-animatronikka-keyframe-actions'], children: [editButton, deleteButton] })
      ]
    });
    row.setAttribute('draggable', 'true');
    row.addEventListener('dragstart', (event) => this.handleKeyframeDragStart(event, keyframe));
    row.addEventListener('dragend', () => this.handleKeyframeDragEnd());
    row.addEventListener('dragover', (event) => this.handleKeyframeDragOver(event, row));
    row.addEventListener('dragleave', () => this.clearKeyframeDropIndicators(row));
    row.addEventListener('drop', (event) => this.handleKeyframeDrop(event, animation, index, row));
    return row;
  }

  buildKeyframeDragHandle(): HTMLDivElement {
    return ElementCreate({ 
      tag: 'div', 
      classList: ['rsp-animatronikka-keyframe-drag-handle'], 
      children: [
        { 
          tag: 'span', 
          classList: ['rsp-animatronikka-keyframe-drag-icon']
        }
      ] 
    });
  }

  handleKeyframeDragStart(event: DragEvent, keyframe: Keyframe): void {
    this.draggingKeyframeId = keyframe.id;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', keyframe.id);
    }
  }

  handleKeyframeDragEnd(): void {
    this.draggingKeyframeId = null;
    document
      .querySelectorAll('.rsp-animatronikka-keyframe-row--drag-over, .rsp-animatronikka-keyframe-row--drag-over-top, .rsp-animatronikka-keyframe-row--drag-over-bottom')
      .forEach(row => this.clearKeyframeDropIndicators(row as HTMLElement));
  }

  handleKeyframeDragOver(event: DragEvent, row: HTMLElement): void {
    if (!this.draggingKeyframeId) return;
    event.preventDefault();
    const rect = row.getBoundingClientRect();
    const isAfter = event.clientY >= rect.top + rect.height / 2;
    row.setAttribute('data-drop-position', isAfter ? 'after' : 'before');
    row.classList.add('rsp-animatronikka-keyframe-row--drag-over');
    row.classList.toggle('rsp-animatronikka-keyframe-row--drag-over-top', !isAfter);
    row.classList.toggle('rsp-animatronikka-keyframe-row--drag-over-bottom', isAfter);
  }

  handleKeyframeDrop(event: DragEvent, animation: Animation, targetIndex: number, row?: HTMLElement): void {
    const draggedId = this.draggingKeyframeId ?? event.dataTransfer?.getData('text/plain');
    if (!draggedId) return;
    event.preventDefault();
    const position = row?.getAttribute('data-drop-position');
    const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;
    if (this.reorderKeyframe(animation, draggedId, insertIndex)) {
      this.buildEditorPanel();
    } else {
      this.draggingKeyframeId = null;
    }
  }

  attachKeyframeContainerDragHandlers(container: HTMLElement, animation: Animation): void {
    container.addEventListener('dragover', (event) => {
      if (!this.draggingKeyframeId) return;
      event.preventDefault();
    });
    container.addEventListener('drop', (event) => {
      if (!this.draggingKeyframeId) return;
      if (event.target !== container) return;
      const draggedId = this.draggingKeyframeId ?? event.dataTransfer?.getData('text/plain');
      if (!draggedId) return;
      event.preventDefault();
      this.clearAllKeyframeDropIndicators();
      if (this.reorderKeyframe(animation, draggedId, animation.keyframes.length)) {
        this.buildEditorPanel();
      } else {
        this.draggingKeyframeId = null;
      }
    });
  }

  reorderKeyframe(animation: Animation, draggedId: string, targetIndex: number): boolean {
    const dragIndex = animation.keyframes.findIndex(keyframe => keyframe.id === draggedId);
    if (dragIndex === -1) return false;
    let insertIndex = Math.max(0, Math.min(targetIndex, animation.keyframes.length));
    if (dragIndex < insertIndex) {
      insertIndex -= 1;
    }
    if (dragIndex === insertIndex) return false;
    const [item] = animation.keyframes.splice(dragIndex, 1);
    animation.keyframes.splice(insertIndex, 0, item);
    return true;
  }

  clearKeyframeDropIndicators(row: HTMLElement): void {
    row.classList.remove(
      'rsp-animatronikka-keyframe-row--drag-over',
      'rsp-animatronikka-keyframe-row--drag-over-top',
      'rsp-animatronikka-keyframe-row--drag-over-bottom',
    );
    row.removeAttribute('data-drop-position');
  }

  clearAllKeyframeDropIndicators(): void {
    document
      .querySelectorAll('.rsp-animatronikka-keyframe-row')
      .forEach(row => this.clearKeyframeDropIndicators(row as HTMLElement));
  }

  getKeyframeLabel(keyframe: Keyframe): string {
    switch (keyframe.type) {
      case 'expression':
        return `${getText('animatronikka.keyframe.expression')} ${keyframe.group}: ${keyframe.expression ?? getText('animatronikka.text.none')} (${keyframe.durationMs}ms)`;
      case 'pose':
        return `${getText('animatronikka.keyframe.pose')} ${keyframe.poseName || getText('animatronikka.text.none')} (${keyframe.durationMs}ms)`;
      case 'restraint':
        return `${getText('animatronikka.keyframe.restraint')} ${keyframe.group}: ${keyframe.asset.name ?? getText('animatronikka.text.none')} (${keyframe.durationMs}ms)`;
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
    const selected = await itemSelectorModal({
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
    switch (type) {
      case 'expression': {
        const group = (await itemSelectorModal({
          buttons: animationGroups.map(group => ({
            label: group,
            value: group,
            selected: current && current.type === 'expression' ? current.group === group : false,
          })),
          limit: 1,
          prompt: getText('animatronikka.prompt.expression_group')
        }))?.[0];
        if (!group) return null;
        const realGroup = group === 'Eyes1' ? 'Eyes' : group;
        const assetGroup = AssetGroupGet('Female3DCG', realGroup as ExpressionGroupName);
        if (!assetGroup) return null;
        const expression = await expressionSelectorModal({
          group: assetGroup.Name as ExpressionGroupName,
          selectedExpressions: current && current.type === 'expression' ? [current.expression as ExpressionName] : [],
          limit: 1
        });
        if (!expression) return null;
        const colorInput = await Modal.prompt(getText('animatronikka.prompt.color_optional'), {
          defaultValue: current && current.type === 'expression' ? this.formatColor(current.color) : '',
          modalClassList: ['rsp-modal']
        });
        if (colorInput === null) return null;

        const durationMs = await this.promptDurationMs(current);
        if (durationMs === null) return null;
        return {
          id: current?.id ?? CommonGenerateUniqueID(),
          type,
          durationMs,
          group,
          expression: expression?.[0] ?? null,
          color: this.parseColor(colorInput),
        };
      }
      case 'pose': {
        const allowedPoses = Object.keys(PoseRecord).map(pose => ({
          label: pose,
          value: pose,
          selected: current && current.type === 'pose' ? current.poseName === pose : false,
        }));
        const pose = await itemSelectorModal({
          buttons: allowedPoses,
          limit: 1,
          prompt: getText('animatronikka.prompt.pose_name')
        });
        if (!pose || pose.length === 0) return null;
        const durationMs = await this.promptDurationMs(current);
        if (durationMs === null) return null;
        return { id: current?.id ?? CommonGenerateUniqueID(), type, durationMs, poseName: pose[0] };
      }
      case 'restraint': {
        const group = await bodyPartSelectorModal({
          selectedParts: current && current.type === 'restraint' ? [current.group as AssetGroupItemName] : [],
          limit: 1
        });
        if (!group || group.length === 0) return null;
        const asset = InventoryGet(Player, group[0]);
        if (!asset) return null;
        return { 
          id: current?.id ?? CommonGenerateUniqueID(), 
          type, 
          durationMs: 0, 
          group: group[0], 
          asset: {
            name: asset.Asset.Name,
            properties: structuredClone(asset.Property),
            color: asset.Color,
          }
        };
      }
      default:
        return assertNever(type);
    }
  }

  async promptDurationMs(current?: Keyframe): Promise<number | null> {
    const duration = await Modal.prompt(getText('animatronikka.prompt.duration_ms'), {
      defaultValue: current ? current.durationMs.toString() : '500',
      modalClassList: ['rsp-modal']
    });
    if (duration === null) return null;
    return Math.max(0, parseInt(duration || '0', 10));
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
