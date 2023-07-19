<script setup>
  import { alertStore } from "../store/alert.store";

  const { alert } = alertStore();
  console.log("🚀 ~ file: Alert.vue:5 ~ alert:", alert.value);
  // const props = defineProps({
  //   color: String,
  //   title: String,
  // });
</script>

<template>
  <div>
    <v-slide-x-transition opacity="100">
      <v-alert
        :color="alert.color"
        :icon="'$' + alert.color"
        :title="alert.title"
        elevation="8"
        v-if="alert.isOpen"
        width="fit-content"
        id="alert"
      ></v-alert>
    </v-slide-x-transition>
  </div>
</template>

<style scoped>
  #alert {
    position: absolute;
    top: 95px;
    right: 20px;
    z-index: 100;
    width: 0;
    opacity: 100;
  }
</style>
