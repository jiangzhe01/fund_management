import Vue from "vue";
import VueRouter from "vue-router";
import Index from "@/views/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "index",
    component: Index,
    children: [
      {
        path: "",
        component: () => import("@/views/home.vue"),
      },
      {
        path: "/home",
        component: () => import("@/views/home.vue"),
      },
      {
        path: "/infoshow",
        component: () => import("@/views/infoShow.vue"),
      },
      {
        path: "/fundlist",
        component: () => import("@/views/fundList.vue"),
      },
    ],
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/register.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login.vue"),
  },
  {
    path: "/*",
    name: "404",
    component: () => import("@/views/404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == "/login" || to.path == "/register") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }

  // const isLogin = localStorage.eleToken
});

export default router;
