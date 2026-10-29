// Single entry point for data access. Set VITE_USE_MOCK=false to use the real API.
import { USE_MOCK } from './config';
import * as mock from './mockApi';
import * as http from './httpApi';

const impl = USE_MOCK ? mock : http;
export const getMessages = () => impl.getMessages();
export const getMessageById = (id) => impl.getMessageById(id);
export const createMessage = (payload) => impl.createMessage(payload);
export const updateMessageStatus = (id, status) => impl.updateMessageStatus(id, status);
export const addNote = (id, text) => impl.addNote(id, text);
export const deleteMessage = (id) => impl.deleteMessage(id);
export const getAnalytics = () => impl.getAnalytics();
