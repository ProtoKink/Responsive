import { BaseModule, Subscreen, exportToGlobal, modLogger } from 'bc-deeplib/deeplib';
import { Animation, AnimationInput, AnimationSchema, AnimatronikkaSettingsModel, Keyframe } from '../models/animations';
import { GuiAnimatronikka } from '../screens/animatronikka';

type AnimationRun = {
  id: string;
  animation: Animation;
  target: Character;
  currentIndex: number;
  loop: boolean;
  priority: number;
  timerId?: number;
};

export const animationGroups = ['Eyes', 'Eyes2', 'Eyebrows', 'Mouth', 'Fluids', 'Emoticon', 'Blush', 'Pussy'];

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

  playAnimation(animationId: string, options?: { target?: Character; loop?: boolean; priority?: number; interrupt?: boolean }): boolean {
    const animation = this.getAnimation(animationId);
    if (!animation) return false;

    const target = options?.target ?? Player;
    if (!target?.MemberNumber) return false;

    const run: AnimationRun = {
      id: animationId,
      animation: AnimationSchema.parse(animation),
      target,
      currentIndex: 0,
      loop: options?.loop ?? animation.loop ?? false,
      priority: options?.priority ?? 0,
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
    if (existing.timerId) {
      clearTimeout(existing.timerId);
    }
    this.activeRuns.delete(memberNumber);
  }

  stopAll(): void {
    this.activeRuns.forEach(run => {
      if (run.timerId) clearTimeout(run.timerId);
    });
    this.activeRuns.clear();
    this.queuedRuns.clear();
  }

  private startRun(run: AnimationRun): void {
    const memberNumber = run.target.MemberNumber;
    if (memberNumber === undefined) return;
    this.activeRuns.set(memberNumber, run);
    this.runNextFrame(run);
  }

  private runNextFrame(run: AnimationRun): void {
    const keyframes = run.animation.keyframes;
    if (keyframes.length === 0) {
      return this.finishRun(run);
    }

    if (run.currentIndex >= keyframes.length) {
      if (run.loop) {
        run.currentIndex = 0;
      } else {
        return this.finishRun(run);
      }
    }

    const keyframe = keyframes[run.currentIndex++];
    this.applyKeyframe(run.target, keyframe);

    run.timerId = setTimeout(() => this.runNextFrame(run), Math.max(0, keyframe.durationMs)) as unknown as number;
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
      default:
        return;
    }
  }

  private applyExpressionKeyframe(target: Character, keyframe: Extract<Keyframe, { type: 'expression' }>): void {
    CharacterSetFacialExpression(target, keyframe.group as keyof ExpressionNameMap, keyframe.expression as ExpressionName);
  }

  private applyPoseKeyframe(target: Character, keyframe: Extract<Keyframe, { type: 'pose' }>): void {
    PoseSetActive(target, keyframe.poseName as AssetPoseName);
  }

  private applyRestraintKeyframe(target: Character, keyframe: Extract<Keyframe, { type: 'restraint' }>): void {
    if (keyframe.assetName) {
      InventoryWear(target, keyframe.assetName, keyframe.group as AssetGroupItemName, keyframe.color);
    }

    const appearance = target.Appearance.find(a => a.Asset.Group.Name === keyframe.group);
    if (!appearance) return;
    if (keyframe.color) {
      appearance.Color = keyframe.color;
    }
    CharacterRefresh(target, false, false);
  }
}

exportToGlobal('AnimatronikkaModule', AnimatronikkaModule);
