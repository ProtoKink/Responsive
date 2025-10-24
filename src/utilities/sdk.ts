import { conErr } from './console';
import { FullModName, MOD_VERSION_CAPTION, ModName, ModRepository } from './definition';

export const SDK = bcModSdk.registerMod(
  {
    name: ModName,
    fullName: FullModName,
    version: MOD_VERSION_CAPTION,
    repository: ModRepository
  },
  {
    allowReplace: false
  }
);

export enum HookPriority {
  Observe = 0,
  AddBehavior = 1,
  ModifyBehavior = 5,
  OverrideBehavior = 10,
  Top = 100
}

export enum ModuleCategory {
  Core = -1,
  Global = 0,
  Responses = 1,
  Profiles = 2,
  CharTalk = 3
}

const patchedFunctions: Map<string, PatchedFunctionData> = new Map();

function initPatchableFunction(target: string): PatchedFunctionData {
  let result = patchedFunctions.get(target);
  if (!result) {
    result = {
      name: target,
      hooks: []
    };
    patchedFunctions.set(target, result);
  }
  return result;
}

export function hookFunction(
  target: string,
  priority: number,
  hook: import('../../.types/bcmodsdk').PatchHook,
  module: ModuleCategory | null = null
): () => void {
  const data = initPatchableFunction(target);

  if (data.hooks.some((h) => h.hook === hook)) {
    conErr(`Duplicate hook for "${target}"`, hook);
    return () => null;
  }

  const removeCallback = SDK.hookFunction(target, priority, hook as any);

  data.hooks.push({
    hook,
    priority,
    module,
    removeCallback
  });
  data.hooks.sort((a, b) => b.priority - a.priority);
  return removeCallback;
}

export function patchFunction(target: string, patches: Record<string, string>): void {
  SDK.patchFunction(target, patches);
}

export function removeHookByModule(target: string, module: ModuleCategory): boolean {
  const data = initPatchableFunction(target);

  for (let i = data.hooks.length - 1; i >= 0; i--) {
    if (data.hooks[i].module === module) {
      data.hooks[i].removeCallback();
      data.hooks.splice(i, 1);
    }
  }

  return true;
}

export function removeAllHooksByModule(module: ModuleCategory): boolean {
  for (const data of patchedFunctions.values()) {
    for (let i = data.hooks.length - 1; i >= 0; i--) {
      if (data.hooks[i].module === module) {
        data.hooks[i].removeCallback();
        data.hooks.splice(i, 1);
      }
    }
  }

  return true;
}
