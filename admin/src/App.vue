<script setup>
  import { useRouter } from "vue-router";
  import NavBar from "./components/NavBar.vue";
  import { ref } from "vue";
  import { useDisplay } from "vuetify/lib/framework.mjs";
  import Alert from "./components/Alert.vue";
  import { useMenu } from "./composables/menu";

  const { mdAndUp } = useDisplay();
  const { menuList } = useMenu();

  const activeMenuName = ref(false);

  const router = useRouter();
  let isDrawerVisible = ref();
  router.beforeEach((to, from, next) => {
    const path = to.name;
    isDrawerVisible.value = path !== "login";
    next();
  });

  function isLinkActive(to) {
    const currentPath = router.currentRoute.value.fullPath;
    console.log(
      '🆘 currentPath === to || currentPath.startsWith(to + "/")',
      currentPath === to || currentPath.startsWith(to + "/"),
      currentPath,
      "==>",
      to
    );
    return currentPath === to;
  }

  function setIsActive(to) {
    const currentPath = router.currentRoute.value.path;
    // const name = currentPath ===
    activeMenuName.value = currentPath === to;
    console.log("🆘 Router", router.currentRoute);
    console.log("🆘 SET", to);
  }
</script>

<template>
  <v-layout>
    <NavBar />
    <v-navigation-drawer v-if="isDrawerVisible" floating :permanent="mdAndUp">
      <v-list>
        <v-list-item
          v-for="menu in menuList"
          :key="menu.to"
          :to="menu.to"
          :href="menu.href"
          :title="menu.name"
          :prepend-icon="menu.ico"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div style="margin: 20px">
        <Alert />
        <router-view />
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped></style>
