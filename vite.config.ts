import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	resolve: {
    alias: {
		'@': path.resolve(__dirname, './src'),
		'@assets': path.resolve(__dirname, './src/assets'),
		'@components': path.resolve(__dirname, './src/components'),
		'@features': path.resolve(__dirname, './src/features'),
		'@pages': path.resolve(__dirname, './src/pages'),
		'@routes': path.resolve(__dirname, './src/routes'),
		'@services': path.resolve(__dirname, './src/services'),
		},
	},

		plugins: [react(), tailwindcss()],
		server: {
			host: '0.0.0.0',
			port: 5174,
		},	
	});
