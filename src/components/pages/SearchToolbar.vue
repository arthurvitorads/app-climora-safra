<script setup lang="ts">
import { Search } from "lucide-vue-next";
defineProps<{ placeholder: string; label: string }>();
const search = defineModel<string>({ required: true });
</script>

<template>
  <div class="toolbar">
    <div class="search-box">
      <Search :size="18" />
      <input
        v-model="search"
        type="search"
        :placeholder="placeholder"
        :aria-label="label"
      />
    </div>
    <span><slot /></span>
  </div>
</template>
