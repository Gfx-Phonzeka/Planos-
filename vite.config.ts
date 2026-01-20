import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      // ADICIONADO: Configuração de Build para aumentar o limite
      build: {
        chunkSizeWarningLimit: 1600, // Aumenta o limite para 1600kb (1.6MB)
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Opcional: Separa bibliotecas pesadas em ficheiros diferentes
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                }
            }
        }
      }
    };
});
