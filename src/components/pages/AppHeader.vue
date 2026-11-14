<script setup lang="ts">
import { Menu } from "lucide-vue-next";

defineProps<{ pageTitle: string }>();
const emit = defineEmits<{ toggleMenu: [] }>();
</script>

<template>
  <header class="topbar">
    <div class="topbar-title">
      <button
        type="button"
        class="mobile-menu icon-button"
        aria-label="Abrir menu"
        @click="emit('toggleMenu')"
      >
        <Menu :size="22" />
      </button>
      <strong>{{ pageTitle }}</strong>
    </div>
  </header>
</template>
