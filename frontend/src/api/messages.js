import { apiFetch } from './client';

export function sendContactMessage(payload) {
  return apiFetch('/messages/contact', { method: 'POST', body: payload, auth: false });
}

export function sendClientMessage(message) {
  return apiFetch('/messages', { method: 'POST', body: { message } });
}

export function fetchMyMessages() {
  return apiFetch('/messages/mes-messages');
}
