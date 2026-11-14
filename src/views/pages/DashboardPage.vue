<script setup lang="ts">
import { Bell, ChevronRight, Tractor } from "lucide-vue-next";
import type { Page } from "../../models/climora";

defineProps<{ alertCount: number }>();
const emit = defineEmits<{ navigate: [page: Page] }>();
const shortcuts = [
  { page: "properties", label: "Propriedades", icon: Tractor },
  { page: "alerts", label: "Alertas", icon: Bell },
] as const;
</script>

<template>
  <nav class="cards-grid" aria-label="Atalhos">
    <button
      v-for="shortcut in shortcuts"
      :key="shortcut.page"
      type="button"
      class="entity-card shortcut"
      @click="emit('navigate', shortcut.page)"
    >
      <span class="entity-icon"
        ><component :is="shortcut.icon" :size="24"
      /></span>
      <strong>{{ shortcut.label }}</strong>
      <span
        v-if="shortcut.page === 'alerts' && alertCount > 0"
        class="alert-count"
        :aria-label="`${alertCount} ${alertCount === 1 ? 'alerta ativo' : 'alertas ativos'}`"
      >
        {{ alertCount }}
      </span>
      <ChevronRight class="shortcut-arrow" :size="18" />
    </button>
  </nav>
</template>

<style scoped>
.shortcut {
  display: flex;
  gap: 14px;
  align-items: center;
  color: inherit;
  text-align: left;
}

.shortcut:hover {
  border-color: #a6c3a0;
}

.shortcut-arrow {
  margin-inline-start: auto;
}

.alert-count {
  border-radius: 999px;
  padding: 1px 7px;
  background: #ffe5cc;
  color: #632909;
  font-weight: 700;
}
</style>
