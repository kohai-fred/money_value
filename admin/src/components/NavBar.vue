<script setup>
  import { useRouter } from "vue-router";
  import { userStore } from "../store/user.store";

  const router = useRouter();
  const { token, removeToken } = userStore();

  function deconnexion() {
    removeToken.value();
    router.push({ name: "home" });
  }
</script>

<template>
  <v-app-bar title="Money Value" color="teal" scroll-behavior="elevate" class="mb-5">
    <v-avatar color="grey" class="mr-3">
      <v-btn
        id="menu-activator"
        class="ma-2"
        :icon="('mdi', token ? ' mdi-account-circle-outline' : ' mdi-cogs')"
      ></v-btn>
    </v-avatar>
    <v-menu activator="#menu-activator" transition="scale-transition">
      <v-card>
        <v-list>
          <v-list-item to="/" title="Accueil" prepend-icon="mdi mdi-home-outline" />
          <v-list-item v-if="!token" to="/login" title="Login" prepend-icon="mdi mdi-login-variant" />
          <template v-else>
            <v-list-item to="/dashboard" title="Dashboard" prepend-icon="mdi mdi-monitor-dashboard" />
            <v-divider horizontal class="my-5"></v-divider>
            <v-list-item>
              <v-btn @click="deconnexion" color="teal" elevation="4" prepend-icon="mdi mdi-logout-variant">
                Déconnexion
              </v-btn>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<style lang="scss" scoped></style>
