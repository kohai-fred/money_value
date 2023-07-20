<script setup>
  import { useRouter } from "vue-router";
  import NavBar from "./components/NavBar.vue";
  import { ref } from "vue";
  import { useDisplay } from "vuetify/lib/framework.mjs";
  import Alert from "./components/Alert.vue";

  const { mdAndUp } = useDisplay();

  const router = useRouter();
  let isDrawerVisible = ref();
  router.beforeEach((to, from, next) => {
    const path = to.name;
    isDrawerVisible.value = path !== "login";
    next();
  });
</script>

<template>
  <v-layout>
    <NavBar />
    <v-navigation-drawer v-if="isDrawerVisible" floating :permanent="mdAndUp">
      <v-list>
        <v-list-item title="Navigation drawer"></v-list-item>
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
