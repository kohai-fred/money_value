import { createRouter, createWebHistory } from "vue-router";
import { userStore } from "../store/user.store";
import HomeView from "../views/HomeView.vue";
import ConnexionView from "../views/ConnexionView.vue";
import DashboardView from "../views/dashboard/DashboardView.vue";
import ExchangeView from "../views/dashboard/ExchangeView.vue";

const { token } = userStore();

const router = createRouter({
  mode: "history",
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return { el: to.hash, top: 80, behavior: "smooth" };
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: ConnexionView,
    },
    {
      path: "/dashboard",
      meta: { requiredAuth: true },
      children: [
        {
          path: "currency",
          name: "currency",
          component: DashboardView,
        },
        {
          path: "exchange",
          name: "exchange",
          component: ExchangeView,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name === "login" && token.value) {
    next({ name: "currency" });
    return;
  }
  if (to.meta.requiredAuth && !token.value) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
