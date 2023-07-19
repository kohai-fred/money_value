import { createRouter, createWebHistory } from "vue-router";
import { userStore } from "../store/user.store";
import HomeView from "../views/HomeView.vue";
import ConnexionView from "../views/ConnexionView.vue";
import DashboardView from "../views/dashboard/DashboardView.vue";

const { token } = userStore();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      name: "dashboard",
      component: DashboardView,
      meta: { requiredAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.name === "login" && token.value) next({ name: "dashboard" });
  if (to.meta.requiredAuth && !token.value) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
