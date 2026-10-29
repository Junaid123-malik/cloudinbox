import { seedMessages, sampleVolume, sampleResponseTimes } from '../data/mockData';

// In-memory store. Resets on page refresh. Not persisted anywhere.
let store = structuredClone(seedMessages);
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const find = (id) => {
  const m = store.find((x) => x.id === id);
  if (!m) throw new Error('Message not found');
  return m;
};

export async function getMessages() { await wait(700); return structuredClone(store); }
export async function getMessageById(id) { await wait(200); return structuredClone(find(id)); }

export async function createMessage(payload) {
  await wait(900);
  const msg = { id: `msg_${Date.now()}`, ...payload, priority: payload.priority || 'medium', status: 'new', receivedAt: new Date().toISOString(), notes: [] };
  store = [msg, ...store];
  return structuredClone(msg);
}
export async function updateMessageStatus(id, status) { await wait(250); find(id).status = status; return structuredClone(find(id)); }
export async function addNote(id, text) {
  await wait(250);
  find(id).notes.push({ id: `n_${Date.now()}`, author: 'Alex Morgan', text, createdAt: new Date().toISOString() });
  return structuredClone(find(id));
}
export async function deleteMessage(id) { await wait(250); find(id); store = store.filter((m) => m.id !== id); return { id }; }
export async function getAnalytics() { await wait(500); return { volume: sampleVolume, responseTimes: sampleResponseTimes, isSample: true }; }
