import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/index.css', 'resources/js/main.jsx'],
            refresh: true,
        }),
        react(),
    ],
    define: {
        'process.env': {},
    },
    server: {
        host: '0.0.0.0',
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
        hmr: {
            host: '192.168.101.83',
        }
    },
});
