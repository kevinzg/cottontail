import path from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
    publicDir: false,
    plugins: [svelte()],
    build: {
        rollupOptions: {
            input: path.resolve(__dirname, 'src/content.ts'),
            output: {
                entryFileNames: '[name].js',
                format: 'iife',
            },
        },
        outDir: 'dist',
        emptyOutDir: false,
    },
});
