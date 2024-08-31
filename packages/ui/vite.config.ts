import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: resolve(__dirname, "src/main.tsx"),
			formats: ["es"],
			fileName: "index",
		},
		outDir: "dist",
		emptyOutDir: false,
		sourcemap: true,
		target: "esnext",
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
		},
	},
});
