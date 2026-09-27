import { apiFetch } from './client';

export function fetchServices() {
  return apiFetch('/services', { auth: false });
}

export function fetchService(id) {
  return apiFetch(`/services/${id}`, { auth: false });
}
