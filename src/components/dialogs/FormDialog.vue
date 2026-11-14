<script setup lang="ts">
import { X } from "lucide-vue-next";
defineProps<{ label: string; title: string; description: string }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card" role="dialog" aria-modal="true" :aria-label="label">
      <div class="modal-header">
        <div>
          <div class="eyebrow">CLIMORA Safra</div>
          <h2>{{ title }}</h2>
          <p>{{ description }}</p>
        </div>
        <button class="icon-button" aria-label="Fechar" @click="emit('close')">
          <X :size="21" />
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>
