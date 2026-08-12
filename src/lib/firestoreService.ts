import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch,
  Unsubscribe 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { DraftItem, HistoryItem } from '../types';

export interface SnapshotItem {
  id: string;
  url: string;
  timestamp: string;
  name?: string;
}

const isLocalGuest = (uid: string) => uid.startsWith('guest_local_') || !auth.currentUser;

// Subscribe to user drafts
export function subscribeDrafts(
  uid: string, 
  onUpdate: (drafts: DraftItem[]) => void
): Unsubscribe {
  if (isLocalGuest(uid)) {
    const raw = localStorage.getItem(`sc_drafts_${uid}`);
    onUpdate(raw ? JSON.parse(raw) : []);
    return () => {};
  }

  const draftsRef = collection(db, 'users', uid, 'drafts');
  const q = query(draftsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q, 
    (snapshot) => {
      const items: DraftItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as DraftItem);
      });
      onUpdate(items);
    },
    (error) => {
      console.warn('Firestore drafts subscription error:', error);
      const raw = localStorage.getItem(`sc_drafts_${uid}`);
      onUpdate(raw ? JSON.parse(raw) : []);
    }
  );
}

// Save or update draft
export async function saveDraft(uid: string, draft: DraftItem): Promise<void> {
  if (isLocalGuest(uid)) {
    const key = `sc_drafts_${uid}`;
    const current: DraftItem[] = JSON.parse(localStorage.getItem(key) || '[]');
    const index = current.findIndex(d => d.id === draft.id);
    if (index >= 0) {
      current[index] = draft;
    } else {
      current.unshift(draft);
    }
    localStorage.setItem(key, JSON.stringify(current));
    return;
  }

  try {
    const draftRef = doc(db, 'users', uid, 'drafts', draft.id);
    await setDoc(draftRef, draft, { merge: true });
  } catch (err) {
    console.error('Error saving draft to Firestore:', err);
  }
}

// Delete draft
export async function deleteDraft(uid: string, draftId: string): Promise<void> {
  if (isLocalGuest(uid)) {
    const key = `sc_drafts_${uid}`;
    const current: DraftItem[] = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = current.filter(d => d.id !== draftId);
    localStorage.setItem(key, JSON.stringify(filtered));
    return;
  }

  try {
    const draftRef = doc(db, 'users', uid, 'drafts', draftId);
    await deleteDoc(draftRef);
  } catch (err) {
    console.error('Error deleting draft from Firestore:', err);
  }
}

// Subscribe to user history
export function subscribeHistory(
  uid: string, 
  onUpdate: (history: HistoryItem[]) => void
): Unsubscribe {
  if (isLocalGuest(uid)) {
    const raw = localStorage.getItem(`sc_history_${uid}`);
    onUpdate(raw ? JSON.parse(raw) : []);
    return () => {};
  }

  const historyRef = collection(db, 'users', uid, 'history');
  const q = query(historyRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q, 
    (snapshot) => {
      const items: HistoryItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as HistoryItem);
      });
      onUpdate(items);
    },
    (error) => {
      console.warn('Firestore history subscription error:', error);
      const raw = localStorage.getItem(`sc_history_${uid}`);
      onUpdate(raw ? JSON.parse(raw) : []);
    }
  );
}

// Save history item (limit up to 20)
export async function saveHistoryItem(uid: string, item: HistoryItem): Promise<void> {
  if (isLocalGuest(uid)) {
    const key = `sc_history_${uid}`;
    const current: HistoryItem[] = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = [item, ...current.slice(0, 19)];
    localStorage.setItem(key, JSON.stringify(updated));
    return;
  }

  try {
    const historyRef = doc(db, 'users', uid, 'history', item.id);
    await setDoc(historyRef, item);
  } catch (err) {
    console.error('Error saving history to Firestore:', err);
  }
}

// Clear history
export async function clearUserHistory(uid: string, currentHistory: HistoryItem[]): Promise<void> {
  if (isLocalGuest(uid)) {
    localStorage.removeItem(`sc_history_${uid}`);
    return;
  }

  try {
    const batch = writeBatch(db);
    currentHistory.forEach((item) => {
      const ref = doc(db, 'users', uid, 'history', item.id);
      batch.delete(ref);
    });
    await batch.commit();
  } catch (err) {
    console.error('Error clearing history from Firestore:', err);
  }
}

// Subscribe to user snapshots
export function subscribeSnapshots(
  uid: string, 
  onUpdate: (snapshots: SnapshotItem[]) => void
): Unsubscribe {
  if (isLocalGuest(uid)) {
    const raw = localStorage.getItem(`sc_snapshots_${uid}`);
    onUpdate(raw ? JSON.parse(raw) : []);
    return () => {};
  }

  const snapshotsRef = collection(db, 'users', uid, 'snapshots');
  const q = query(snapshotsRef, orderBy('timestamp', 'desc'));

  return onSnapshot(
    q, 
    (snapshot) => {
      const items: SnapshotItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as SnapshotItem);
      });
      onUpdate(items);
    },
    (error) => {
      console.warn('Firestore snapshots subscription error:', error);
      const raw = localStorage.getItem(`sc_snapshots_${uid}`);
      onUpdate(raw ? JSON.parse(raw) : []);
    }
  );
}

// Save snapshot
export async function saveSnapshot(uid: string, snapshotItem: SnapshotItem): Promise<void> {
  if (isLocalGuest(uid)) {
    const key = `sc_snapshots_${uid}`;
    const current: SnapshotItem[] = JSON.parse(localStorage.getItem(key) || '[]');
    const index = current.findIndex(s => s.id === snapshotItem.id);
    if (index >= 0) {
      current[index] = snapshotItem;
    } else {
      current.unshift(snapshotItem);
    }
    localStorage.setItem(key, JSON.stringify(current));
    return;
  }

  try {
    const ref = doc(db, 'users', uid, 'snapshots', snapshotItem.id);
    await setDoc(ref, snapshotItem);
  } catch (err) {
    console.error('Error saving snapshot to Firestore:', err);
  }
}

// Delete snapshot
export async function deleteSnapshot(uid: string, snapshotId: string): Promise<void> {
  if (isLocalGuest(uid)) {
    const key = `sc_snapshots_${uid}`;
    const current: SnapshotItem[] = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = current.filter(s => s.id !== snapshotId);
    localStorage.setItem(key, JSON.stringify(filtered));
    return;
  }

  try {
    const ref = doc(db, 'users', uid, 'snapshots', snapshotId);
    await deleteDoc(ref);
  } catch (err) {
    console.error('Error deleting snapshot from Firestore:', err);
  }
}

// Delete multiple snapshots
export async function deleteSnapshotsBatch(uid: string, snapshotIds: string[]): Promise<void> {
  if (isLocalGuest(uid)) {
    const key = `sc_snapshots_${uid}`;
    const current: SnapshotItem[] = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = current.filter(s => !snapshotIds.includes(s.id));
    localStorage.setItem(key, JSON.stringify(filtered));
    return;
  }

  try {
    const batch = writeBatch(db);
    snapshotIds.forEach((id) => {
      const ref = doc(db, 'users', uid, 'snapshots', id);
      batch.delete(ref);
    });
    await batch.commit();
  } catch (err) {
    console.error('Error deleting batch snapshots from Firestore:', err);
  }
}
