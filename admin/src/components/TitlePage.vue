<script setup>
  const props = defineProps({
    title: String,
  });
</script>

<template>
  <p class="text-h4 text-center text-capitalize my-8">{{ title }}</p>
</template>

<style lang="scss" scoped></style>
