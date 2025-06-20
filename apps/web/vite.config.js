import { loadEnv, defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        define: {
            __APP_ENV__: JSON.stringify(env),
        },
        plugins: [react()],
        envDir: "../../",
        build: {
            target: "esnext",
        },
        server: {
            port: 3000,
        },
    };
});
