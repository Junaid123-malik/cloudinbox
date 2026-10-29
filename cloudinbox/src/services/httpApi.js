import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE_URL } from './config';

// Get the signed-in admin's Cognito ID token.
async function getAuthToken() {
  const session = await fetchAuthSession();
  return session.tokens?.idToken?.toString() ?? null;
}

// Convert API/DynamoDB fields into the format used by the React UI.
function normalizeMessage(message) {
  if (!message || typeof message !== 'object') return message;

  const rawStatus = String(message.status ?? 'new')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

  const statusMap = {
    new: 'new',
    in_progress: 'in_progress',
    resolved: 'resolved',
  };

  return {
    ...message,
    id: message.id ?? message.messageId,
    body: message.body ?? message.message ?? '',
    receivedAt: message.receivedAt ?? message.createdAt ?? null,
    status: statusMap[rawStatus] ?? rawStatus,
    notes: Array.isArray(message.notes) ? message.notes : [],
  };
}

async function request(path, { method = 'GET', body, admin = true } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (admin) {
    const token = await getAuthToken();

    if (!token) {
      throw new Error('Admin login required. Please sign in again.');
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Request failed (${res.status})`
    );
  }

  return res.json();
}

// API Gateway -> Lambda -> DynamoDB
export const getMessages = async () => {
  const data = await request('/messages');

  if (Array.isArray(data)) {
    return data.map(normalizeMessage);
  }

  if (Array.isArray(data?.messages)) {
    return data.messages.map(normalizeMessage);
  }

  throw new Error('Unexpected messages API response format.');
};

export const getMessageById = async (id) =>
  normalizeMessage(await request(`/messages/${id}`));

export const createMessage = async (payload) =>
  normalizeMessage(
    await request('/messages', {
      method: 'POST',
      body: payload,
      admin: false,
    })
  );

export const updateMessageStatus = async (id, status) =>
  normalizeMessage(
    await request(`/messages/${id}/status`, {
      method: 'PATCH',
      body: { status },
    })
  );

export const addNote = async (id, text) =>
  normalizeMessage(
    await request(`/messages/${id}/notes`, {
      method: 'POST',
      body: { text },
    })
  );

export const deleteMessage = (id) =>
  request(`/messages/${id}`, {
    method: 'DELETE',
  });

export const getAnalytics = () =>
  request('/analytics');