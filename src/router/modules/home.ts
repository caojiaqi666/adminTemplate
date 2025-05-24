export default {
  path: "/home",
  name: "home",
  component: () => import("@/views/home/index.vue"),
  meta: {
    title: "首页",
    icon: "home",
    orderNo: 0,
    hidden: false,
    keepAlive: true,
  },
  children: [],
};
