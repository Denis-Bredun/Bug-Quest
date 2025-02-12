import {defineConfig} from 'vite'
// import react from '@vitejs/plugin-react-swc'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    esbuild: {
        loader: 'tsx',
    },
    root: './',
    build: {
        outDir: './build',
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
                '.ts': 'tsx',
            },
        },
    },
    plugins: [react(), tsconfigPaths()],
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    }
});