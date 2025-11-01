
import { conErr } from './console';

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