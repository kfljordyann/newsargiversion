import { apiFetch } from './client';

export function register(payload) {
  return apiFetch('/auth/inscription', { method: 'POST', body: payload, auth: false });
}

export function login(payload) {
  return apiFetch('/auth/connexion', { method: 'POST', body: payload, auth: false });
}

export function forgotPassword(identifiant) {
  return apiFetch('/auth/mot-de-passe-oublie', {
    method: 'POST',
    body: { identifiant },
    auth: false,
  });
}

export function fetchMe() {
  return apiFetch('/auth/moi');
}
