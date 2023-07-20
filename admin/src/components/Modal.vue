<script setup>
  import { ref } from "vue";

  const isModalOpen = ref(false);

  const props = defineProps({
    btnProps: {},
    btnTitle: String | HTMLElement,
  });
</script>

<template>
  <v-btn {{...btnProps}}>
    {{ btnTitle }}
    <v-dialog v-model="isModalOpen" activator="parent" width="auto">
      <v-card>
        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="isModalOpen = false">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<style lang="scss" scoped></style>
