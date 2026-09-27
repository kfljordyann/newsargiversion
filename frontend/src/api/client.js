const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'sargi_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * Client HTTP unique. Toute la logique métier reste côté serveur ;
 * cette fonction ne fait que parler à l'API REST, ce qui permettra plus
 * tard de réutiliser ces mêmes fonctions dans une app React Native/Expo.
 */
export async function apiFetch(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  const token = getToken();
  if (auth && token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    const err = new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
    err.isNetworkError = true;
    throw err;
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const err = new Error(data?.message || 'Une erreur est survenue.');
    err.status = response.status;
    err.details = data?.erreurs;
    throw err;
  }

  return data;
}
