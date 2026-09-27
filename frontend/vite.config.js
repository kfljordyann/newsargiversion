import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Architecture prête pour le mobile : le frontend ne parle au backend
// que via l'API REST (VITE_API_URL), jamais de logique métier côté client.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
