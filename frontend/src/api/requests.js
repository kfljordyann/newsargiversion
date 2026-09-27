import { apiFetch } from './client';

export function createRequest(payload) {
  return apiFetch('/demandes', { method: 'POST', body: payload });
}

export function fetchMyRequests() {
  return apiFetch('/demandes/mes-demandes');
}
