import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import * as path from "path";

export default defineConfig({
	plugins: [sveltekit(), basicSsl()],
	server: {
		https: {}
	},
	resolve: {
		alias: [
			{
				find: "@",
				replacement: path.resolve("./src")
			}
		]
	}
});
