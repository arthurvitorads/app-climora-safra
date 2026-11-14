<script setup lang="ts">
import {
  Bell,
  ChevronRight,
  LayoutDashboard,
  Leaf,
  Tractor,
} from "lucide-vue-next";
import type { Page } from "../../models/climora";
defineProps<{ page: Page; mobileNav: boolean; alertCount: number }>();
const emit = defineEmits<{ navigate: [page: Page] }>();
const navigations = [
  { id: "dashboard" as Page, name: "Início", icon: LayoutDashboard },
  { id: "properties" as Page, name: "Propriedades", icon: Tractor },
  { id: "alerts" as Page, name: "Alertas", icon: Bell },
];
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-open': mobileNav }">
    <div class="brand">
      <img src="../../assets/logo.jpg" alt="Logo Climora Safra" />
      <div>
        <strong>climora<span>.</span></strong
        ><small>SAFRA</small>
      </div>
    </div>
    <div class="side-label">MENU PRINCIPAL</div>
    <nav>
      <button
        v-for="item in navigations"
        :key="item.id"
        type="button"
        :class="['nav-link', { active: page === item.id }]"
        @click="emit('navigate', item.id)"
      >
        <component :is="item.icon" :size="19" /><span>{{ item.name }}</span
        ><span
          v-if="item.id === 'alerts' && alertCount > 0"
          class="alert-indicator"
          :aria-label="`${alertCount} ${alertCount === 1 ? 'alerta' : 'alertas'}`"
          >{{ alertCount }}</span
        ><ChevronRight v-if="page === item.id" :size="16" class="push" />
      </button>
    </nav>
    <div class="sidebar-bottom">
      <div class="sidebar-hint">
        <Leaf :size="19" />
        <div>
          <strong>Seu campo, mais preparado.</strong
          ><span>Organize sua produção e acompanhe seus resultados.</span>
        </div>
      </div>
      <small>CLIMORA Safra · MVP 0.1</small>
    </div>
  </aside>
</template>

<style scoped>
.alert-indicator {
  margin-inline-start: auto;
  background: #ffbd88;
  color: #632909;
  border-radius: 999px;
  padding: 1px 7px;
  font-weight: 700;
  animation: alert-pulse 2s ease-in-out infinite;
}
@keyframes alert-pulse {
  50% {
    background: #ffe5cc;
  }
}
@media (prefers-reduced-motion: reduce) {
  .alert-indicator {
    animation: none;
  }
}
</style>
