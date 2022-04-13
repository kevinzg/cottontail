import path from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    build: {
        rollupOptions: {
            input: {
                background: path.resolve(__dirname, 'background.html'),
                dashboard: path.resolve(__dirname, 'dashboard.html'),
            },
        },
        outDir: 'dist',
    },
});
