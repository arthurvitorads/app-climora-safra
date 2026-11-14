<script setup lang="ts">
import { computed, ref } from "vue";
import { climateAlerts } from "./models/climateAlerts";
import AppSidebar from "./components/pages/AppSidebar.vue";
import AppHeader from "./components/pages/AppHeader.vue";
import FormDialog from "./components/dialogs/FormDialog.vue";
import PropertyForm from "./components/dialogs/PropertyForm.vue";
import DashboardPage from "./views/pages/DashboardPage.vue";
import PropertiesPage from "./views/pages/PropertiesPage.vue";
import AlertsPage from "./views/pages/AlertsPage.vue";
import { useClimora } from "./composables/useClimora";
import type { Page } from "./models/climora";

const {
  properties,
  modal,
  editingId,
  error,
  propertyForm,
  openProperty,
  closeModal,
  saveProperty,
  deleteProperty,
} = useClimora();
const page = ref<Page>("dashboard");
const mobileNav = ref(false);
const activeAlerts = ref([...climateAlerts]);

function dismissAlert(property: string) {
  activeAlerts.value = activeAlerts.value.filter(
    (alert) => alert.property !== property,
  );
}
const pageTitle = computed(
  () =>
    ({
      dashboard: "Início",
      properties: "Minhas propriedades",
      alerts: "Alertas",
    })[page.value],
);
function navigate(next: Page) {
  page.value = next;
  mobileNav.value = false;
}
</script>

<template>
  <div class="app-shell">
    <AppSidebar
      :page="page"
      :mobile-nav="mobileNav"
      :alert-count="activeAlerts.length"
      @navigate="navigate"
    />
    <main class="main">
      <AppHeader
        :page-title="pageTitle"
        @toggle-menu="mobileNav = !mobileNav"
      />
      <div class="content">
        <DashboardPage
          v-if="page === 'dashboard'"
          :alert-count="activeAlerts.length"
          @navigate="navigate"
        />
        <PropertiesPage
          v-else-if="page === 'properties'"
          :properties="properties"
          @create="openProperty()"
          @edit="openProperty"
          @remove="deleteProperty"
        />
        <AlertsPage
          v-else-if="page === 'alerts'"
          :active-alerts="activeAlerts"
          @dismiss="dismissAlert"
        />
      </div>
    </main>
    <div v-if="mobileNav" class="nav-overlay" @click="mobileNav = false"></div>
    <FormDialog
      v-if="modal === 'property'"
      label="Cadastro de propriedade"
      :title="editingId ? 'Editar propriedade' : 'Nova propriedade'"
      description="Informe os dados da sua propriedade rural."
      @close="closeModal"
    >
      <PropertyForm
        v-model="propertyForm"
        :editing-id="editingId"
        :error="error"
        @save="saveProperty"
        @close="closeModal"
      />
    </FormDialog>
  </div>
</template>
