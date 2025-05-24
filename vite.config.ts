import { defineConfig, loadEnv } from "vite";
import type { UserConfig, ConfigEnv } from "vite";
import { fileURLToPath } from "url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
export default defineConfig((mode: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode.mode, root);
  console.log(env);

  return {
    // 项目根路径
    root,
    // 获取环境变量
    base: "./",
    // 无需处理的静态资源位置
    publicDir: fileURLToPath(new URL("./public", import.meta.url)),
    // 需要处理的静态资源位置
    assetsInclude: fileURLToPath(new URL("./assets", import.meta.url)),
    plugins: [
      // Vue 模版编译插件
      vue(),
      // jsx 文件编译插件
      vueJsx(),
    ],
    server: {
      host: true,
      port: 9000,
      open: true,
      cors: true,
      // 开发时代理
      proxy: {
        // 以 /api 开头的请求会转发到 http://localhost:8080
        [env.VITE_APP_API_BASEURL]: {
          target: "http://localhost:8080",
          // 改变 Host Header
          changeOrigin: true,
        },
        [env.VITE_APP_MOCK_BASEURL]: {
          target: "http://localhost:8081",
          changeOrigin: true,
        },
      },
    },
    // 打包配置
    build: {
      sourcemap: true,
      // 打包超过 400kb 会做警告
      chunkSizeWarningLimit: 400,
      rollupOptions: {
        // 打包入口
        input: {
          index: fileURLToPath(new URL("./index.html", import.meta.url)),
        },
        // 静态资源分类打包
        output: {
          format: "esm",
          chunkFileNames: "static/js/[name].[hash].js",
          entryFileNames: "static/js/[name].[hash].js,",
          assetFileNames: "static/[ext]/[name].[hash].[ext]",
        },
      },
    },
    resolve: {
      // 配置别名
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
