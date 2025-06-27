import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

export default defineConfig({
    plugins: [react(), tsconfigPaths(), EnvironmentPlugin('all')],
    build: {
        target: 'esnext',
    },
    worker: {
        format: 'es',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        exclude: [...configDefaults.exclude],
    },
});
