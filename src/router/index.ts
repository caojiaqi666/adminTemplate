import {
  createRouter,
  createWebHistory,
  RouteRecord,
  RouteRecordRaw,
} from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// const routes: Array<RouteRecordRaw> = [
//   {
//     path: "/",
//     name: "home",
//     component: () => import("../views/home/index.vue"),
//     // meta: {},
//     // children: []
//   },
// ];

// 默认以懒加载的模式
const modules: Record<string, any> = import.meta.glob("./modules/*.ts", {
  eager: true,
});

const routes: Array<RouteRecord> = [];
Object.keys(modules).forEach((key) => {
  const module = modules[key].default;
  routes.push(module);
});

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
