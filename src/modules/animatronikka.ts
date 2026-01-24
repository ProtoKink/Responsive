import { BaseModule, Subscreen, exportToGlobal, modLogger } from 'bc-deeplib/deeplib';
import { Animation, AnimationInput, AnimationSchema, AnimatronikkaSettingsModel, Keyframe } from '../models/animations';
import { GuiAnimatronikka } from '../screens/animatronikka';
import { assertNever } from '@/utilities/other';

type AnimationRun = {
  id: string;
  animation: Animation;
  target: Character;
  loopsRemaining: number;
  priority: number;
  groupStates: Map<string, GroupState>;
  activeGroupCount: number;
};

type GroupState = {
  keyframes: Keyframe[];
  index: number;
  cancelTimer?: () => void;
};

export const animationGroups = ['Eyes', 'Eyes1', 'Eyes2', 'Eyebrows', 'Mouth', 'Fluids', 'Emoticon', 'Blush', 'Pussy'] as const;

export class AnimatronikkaModule extends BaseModule {
  static instance: AnimatronikkaModule;

  private activeRuns: Map<number, AnimationRun> = new Map();
  private queuedRuns: Map<number, AnimationRun[]> = new Map();

  get settings(): AnimatronikkaSettingsModel {
    return super.settings as AnimatronikkaSettingsModel;
  }

  set settings(val: AnimatronikkaSettingsModel) {
    super.settings = val;
  }

  get settingsScreen(): Subscreen | null {
    return GuiAnimatronikka;
  }

  get defaultSettings() {
    return <AnimatronikkaSettingsModel>{
      animations: {},
    };
  }

  load(): void {
    super.load();
    AnimatronikkaModule.instance = this;
  }

  static createAnimation(animation: AnimationInput): Animation | undefined {
    const result = AnimationSchema.safeParse(animation);
    if (!result.success) return modLogger.error(result.error), undefined;
    return result.data;
  }

  getAnimation(id: string): Animation | undefined {
    return this.settings.animations[id];
  }

  deleteAnimation(id: string): void {
    delete this.settings.animations[id];
  }

  playAnimation(animationId: string, options?: { target?: Character; loopCount?: number; priority?: number; interrupt?: boolean }): boolean {
    const animation = this.getAnimation(animationId);
    if (!animation) return false;

    const target = options?.target ?? Player;
    if (!target?.MemberNumber) return false;

    const run: AnimationRun = {
      id: animationId,
      animation: AnimationSchema.parse(animation),
      target,
      loopsRemaining: this.getLoopsRemaining(animation, options?.loopCount),
      priority: options?.priority ?? 0,
      groupStates: new Map(),
      activeGroupCount: 0,
    };

    const existing = this.activeRuns.get(target.MemberNumber);
    if (existing) {
      const shouldInterrupt = options?.interrupt || run.priority > existing.priority;
      if (shouldInterrupt) {
        this.stopAnimation(target.MemberNumber);
      } else {
        const queue = this.queuedRuns.get(target.MemberNumber) ?? [];
        queue.push(run);
        this.queuedRuns.set(target.MemberNumber, queue);
        return true;
      }
    }

    this.startRun(run);
    return true;
  }

  stopAnimation(memberNumber: number): void {
    const existing = this.activeRuns.get(memberNumber);
    if (!existing) return;
    existing.groupStates.forEach(group => {
      if (group.cancelTimer) group.cancelTimer();
      group.cancelTimer = undefined;
    });
    this.activeRuns.delete(memberNumber);
  }

  stopAll(): void {
    this.activeRuns.forEach(run => {
      run.groupStates.forEach(group => {
        if (group.cancelTimer) group.cancelTimer();
        group.cancelTimer = undefined;
      });
    });
    this.activeRuns.clear();
    this.queuedRuns.clear();
  }

  private startRun(run: AnimationRun): void {
    const memberNumber = run.target.MemberNumber;
    if (memberNumber === undefined) return;
    this.activeRuns.set(memberNumber, run);
    run.groupStates = this.buildGroupStates(run.animation.keyframes);
    run.activeGroupCount = run.groupStates.size;
    if (run.activeGroupCount === 0) {
      return this.finishRun(run);
    }

    run.groupStates.forEach((_group, groupKey) => {
      this.runNextGroupFrame(run, groupKey);
    });
  }

  private runNextGroupFrame(run: AnimationRun, groupKey: string): void {
    const group = run.groupStates.get(groupKey);
    if (!group) return;

    if (group.index >= group.keyframes.length) {
      return this.finishGroup(run, groupKey);
    }

    const keyframe = group.keyframes[group.index++];
    this.applyKeyframe(run.target, keyframe);

    group.cancelTimer = TimerCreate(
      () => this.runNextGroupFrame(run, groupKey),
      Math.max(0, keyframe.durationMs),
      false,
      'universal'
    );
  }

  private finishGroup(run: AnimationRun, groupKey: string): void {
    const group = run.groupStates.get(groupKey);
    if (!group) return;
    if (group.cancelTimer) group.cancelTimer();
    group.cancelTimer = undefined;

    run.activeGroupCount -= 1;
    if (run.activeGroupCount > 0) return;

    if (run.loopsRemaining > 0) {
      run.loopsRemaining -= 1;
      this.restartRun(run);
      return;
    }

    this.finishRun(run);
  }

  private getLoopsRemaining(animation: Animation, loopCount?: number): number {
    if (typeof loopCount === 'number') {
      return Math.max(0, Math.floor(loopCount));
    }
    return Math.max(0, Math.floor(animation.loopCount ?? 1));
  }

  private restartRun(run: AnimationRun): void {
    run.groupStates.forEach(group => {
      if (group.cancelTimer) group.cancelTimer();
      group.cancelTimer = undefined;
      group.index = 0;
    });

    run.activeGroupCount = run.groupStates.size;
    run.groupStates.forEach((_group, groupKey) => {
      this.runNextGroupFrame(run, groupKey);
    });
  }

  private finishRun(run: AnimationRun): void {
    const memberNumber = run.target.MemberNumber;
    if (memberNumber === undefined) return;
    this.activeRuns.delete(memberNumber);
    const queued = this.queuedRuns.get(memberNumber);
    if (!queued || queued.length === 0) return;
    const next = queued.shift();
    if (next) {
      this.queuedRuns.set(memberNumber, queued);
      this.startRun(next);
    }
  }

  private applyKeyframe(target: Character, keyframe: Keyframe): void {
    switch (keyframe.type) {
      case 'expression':
        this.applyExpressionKeyframe(target, keyframe);
        break;
      case 'pose':
        this.applyPoseKeyframe(target, keyframe);
        break;
      case 'restraint':
        this.applyRestraintKeyframe(target, keyframe);
        break;
      case 'appearance':
        this.applyAppearanceKeyframe(target, keyframe);
        break;
      default:
        return assertNever(keyframe);
    }
  }

  private applyExpressionKeyframe(target: Character, keyframe: Extract<Keyframe, { type: 'expression' }>): void {
    CharacterSetFacialExpression(target, keyframe.group as keyof ExpressionNameMap, keyframe.expression as ExpressionName, undefined, keyframe.color);
  }

  private applyPoseKeyframe(target: Character, keyframe: Extract<Keyframe, { type: 'pose' }>): void {
    PoseSetActive(target, keyframe.poseName as AssetPoseName);
  }

  private applyRestraintKeyframe(target: Character, keyframe: Extract<Keyframe, { type: 'restraint' }>): void {
    const item = InventoryWear(target, keyframe.asset.name, keyframe.group as AssetGroupItemName, keyframe.asset.color, undefined, undefined, undefined, false);
    if (!item) return;
    if (keyframe.asset.property) {
      item.Property = keyframe.asset.property;
    }

    CharacterRefresh(target, true, true);
  }
  
  private applyAppearanceKeyframe(target: Character, keyframe: Extract<Keyframe, { type: 'appearance' }>): void {
    const item = InventoryWear(target, keyframe.asset.name, keyframe.group as AssetGroupName, keyframe.asset.color, undefined, undefined, undefined, false);
    if (!item) return;
    if (keyframe.asset.property) {
      item.Property = keyframe.asset.property;
    }

    CharacterRefresh(target, true, true);
  }

  private buildGroupStates(keyframes: Keyframe[]): Map<string, GroupState> {
    const groups = new Map<string, GroupState>();
    keyframes.forEach(keyframe => {
      const groupKey = this.getKeyframeGroupKey(keyframe);
      const group = groups.get(groupKey);
      if (group) {
        group.keyframes.push(keyframe);
      } else {
        groups.set(groupKey, { keyframes: [keyframe], index: 0 });
      }
    });

    return groups;
  }

  private getKeyframeGroupKey(keyframe: Keyframe): string {
    switch (keyframe.type) {
      case 'expression':
        return `expression:${keyframe.group}`;
      case 'pose':
        return 'pose';
      case 'restraint':
        return `restraint:${keyframe.group}`;
      case 'appearance':
        return `appearance:${keyframe.group}`;
      default:
        return assertNever(keyframe);
    }
  }
}

exportToGlobal('AnimatronikkaModule', AnimatronikkaModule);
