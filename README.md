# 项目初始化

## 安装依赖

1. npm init
1. 目录结构
1. 安装依赖

```
进度加载条组件：nprogress
状态管理：pinia
localstorage：pinia-plugin-persistedstate
pnpm i axios pinia vue vue-router nprogress pinia-plugin-persistedstate element-plus
pnpm i -D less typescript
```

1. 新建 index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AIChat</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

```

1. 新建 src/styles/reset.less

1. 新建 src/main.ts

```
import { createApp } from "vue";
import App from "./App.vue";
import "./styles/reset.less";

const app = createApp(App);
app.mount("#app");

```

1. router

```
import {
  createRouter,
  createWebHistory,
  RouteRecord,
  RouteRecordRaw,
} from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/home/index.vue"),
    // meta: {},
    // children: []
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;

```

1. store

```
import {
  createRouter,
  createWebHistory,
  RouteRecord,
  RouteRecordRaw,
} from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/home/index.vue"),
    // meta: {},
    // children: []
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;

```

1. 在 main.ts 中引入 router、pinia

```
import router from "./router";
import pinia from "./store";

app.use(router);
app.use(pinia);
```

1. 新建 src/http/request.ts

```ts
import axios from "axios";

const service = axios.create({
  baseURL: "/",
  timeout: 15000,
});

// axios 实例拦截
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axios 响应拦截
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;

```

## 安装vite

转成浏览器可识别的代码

### 安装vite

```bash
pnpm i -D vite @vitejs/plugin-vue @vitejs/plugin-vue-jsx @types/node @types/nprogress vue-tsc
```

### 环境变量

必须以 `VITE` 开头

```
# axios baseurl
VITE_APP_API_BASEURL = /api
```

使用

```

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASEURL,
  timeout: 15000,
});
```

这样  `env` 会提示报错，要处理下 ts

``` src/types/env.d.ts
/// <reference types="vite/client">

interface ImportMetaEnv {
  readonly VITE_APP_API_BASEURL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

```

## 配置 vite.config.ts

```
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

```

## 配置  tsconfig.json

```
{
  "name": "daweiwebpack",
  "version": "1.0.0",
  "description": "1. npm init 2.",
  "main": "index.js",
  "scripts": {
    "dev": "vite --mode development",
    "build": "vite --mode production"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.9.0",
    "element-plus": "^2.9.11",
    "nprogress": "^0.2.0",
    "pinia": "^3.0.2",
    "pinia-plugin-persistedstate": "^4.3.0",
    "vue": "^3.5.14",
    "vue-router": "^4.5.1"
  },
  "devDependencies": {
    "@types/node": "^22.15.21",
    "@types/nprogress": "^0.2.3",
    "@vitejs/plugin-vue": "^5.2.4",
    "@vitejs/plugin-vue-jsx": "^4.2.0",
    "less": "^4.3.0",
    "typescript": "^5.8.3",
    "vite": "^6.3.5",
    "vue-tsc": "^2.2.10"
  }
}

```

# 请求的详细配置

见 `src/http/request.ts`

# 路由的封装ˇ

第7节
