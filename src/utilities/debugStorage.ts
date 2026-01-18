import { modStorage } from './data';
import { MessageData, TriggerType } from '../models/behaviors';

const DEBUG_STORAGE_KEY = 'DEBUG_HISTORY';
const MAX_ENTRIES = 50;

export type BehaviorExecutionEntry = {
  id: string;
  timestamp: number;
  behaviorId: string;
  triggerId: string;
  reactionIds: string[];
  triggerType: TriggerType;
  messageData: Omit<MessageData, 'source' | 'target'> & {
    sourceMemberNumber?: number;
    targetMemberNumber?: number;
  };
};

export class DebugStorage {
  static getHistory(): BehaviorExecutionEntry[] {
    const history = modStorage.getLocalStorage(DEBUG_STORAGE_KEY) as BehaviorExecutionEntry[];
    return history ?? [];
  }

  static addEntry(entry: Omit<BehaviorExecutionEntry, 'id'>): void {
    const history = DebugStorage.getHistory();
    const newEntry = { ...entry, id: CommonGenerateUniqueID() };
    history.unshift(newEntry);
    if (history.length > MAX_ENTRIES) {
      history.length = MAX_ENTRIES;
    }
    modStorage.setLocalStorage(DEBUG_STORAGE_KEY, history);
  }

  static clearHistory(): void {
    modStorage.setLocalStorage(DEBUG_STORAGE_KEY, []);
  }
}
