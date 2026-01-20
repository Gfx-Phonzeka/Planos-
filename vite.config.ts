import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // CORREÇÃO: Usamos '.' em vez de process.cwd()
    // Isto evita o erro "Cannot find name 'process'"
    const env = loadEnv(mode, '.', '');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Aqui são apenas strings, por isso não há problema usar 'process.env' no nome da chave
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
    };
});
