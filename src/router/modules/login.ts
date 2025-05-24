export default {
  path: "/login",
  name: "login",
  component: () => import("@/views/login/index.vue"),
  meta: {
    title: "登录页",
    icon: "login",
    orderNo: 0,
    hidden: false,
    keepAlive: true,
  },
  children: [],
};
