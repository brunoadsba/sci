import Dexie, { type Table } from "dexie";
import {
  DB_NAME,
  DRAFT_KEY,
  STATE_RECORD_ID,
  STORAGE_KEY,
  STORE_NAME,
} from "@/features/plan/constants";
import type { AppState } from "@/features/plan/types";
import { stateTimestamp } from "@/lib/dates";

interface StateRecord {
  id: string;
  state: AppState;
  savedAt: string;
}

class PlanDatabase extends Dexie {
  [STORE_NAME]!: Table<StateRecord, string>;

  constructor() {
    super(DB_NAME);
    this.version(1).stores({
      [STORE_NAME]: "id",
    });
  }
}

let db: PlanDatabase | null = null;
let idbAvailable = true;

function getDb(): PlanDatabase | null {
  if (typeof window === "undefined") return null;
  if (!idbAvailable) return null;
  try {
    if (!db) db = new PlanDatabase();
    return db;
  } catch {
    idbAvailable = false;
    return null;
  }
}

export async function idbGetState(): Promise<AppState | null> {
  const database = getDb();
  if (!database) return null;
  try {
    const record = await database.table(STORE_NAME).get(STATE_RECORD_ID);
    return record?.state ?? null;
  } catch {
    idbAvailable = false;
    return null;
  }
}

export async function idbSetState(state: AppState): Promise<void> {
  const database = getDb();
  if (!database) return;
  try {
    await database.table(STORE_NAME).put({
      id: STATE_RECORD_ID,
      state,
      savedAt: new Date().toISOString(),
    });
  } catch {
    idbAvailable = false;
  }
}

export function loadLocalStorage(): AppState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export function saveLocalStorage(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota / private mode
  }
}

export function loadDraft(): AppState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export function saveDraft(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

export function readEmbeddedState(): AppState | null {
  if (typeof window === "undefined") return null;
  const node = document.getElementById("embedded-state");
  if (!node?.textContent) return null;
  try {
    return JSON.parse(node.textContent) as AppState;
  } catch {
    return null;
  }
}

/** Embedded snapshot wins; otherwise newest among IDB, localStorage and draft. */
export function chooseInitialState(
  embedded: AppState | null,
  idb: AppState | null,
  local: AppState | null,
  draft: AppState | null
): AppState | null {
  if (embedded) return embedded;

  const candidates = [idb, local, draft].filter(Boolean) as AppState[];
  if (!candidates.length) return null;

  return candidates.reduce((best, current) =>
    stateTimestamp(current) > stateTimestamp(best) ? current : best
  );
}

export async function persistState(state: AppState): Promise<void> {
  saveLocalStorage(state);
  await idbSetState(state);
  clearDraft();
}

export async function persistDraftThenCommit(state: AppState): Promise<void> {
  saveDraft(state);
  await persistState(state);
}
