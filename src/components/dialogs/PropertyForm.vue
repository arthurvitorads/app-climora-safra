<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
import type { Property } from "../../models/climora";
import PropertyMap from "./PropertyMap.vue";

defineProps<{ editingId: string | null; error: string }>();
const propertyForm = defineModel<Property>({ required: true });
const emit = defineEmits<{ save: []; close: [] }>();
</script>

<template>
  <form @submit.prevent="emit('save')">
    <div class="form-grid">
      <label class="full"
        >Cultura
        <input
          v-model.trim="propertyForm.culture"
          maxlength="80"
          required
          placeholder="Ex.: Feijão"
        />
      </label>
      <label
        >Área plantada (ha)
        <input
          v-model.number="propertyForm.area"
          type="number"
          min="0.01"
          step="0.01"
          required
        />
      </label>
      <label
        >Produtividade esperada (kg/ha)
        <input
          v-model.number="propertyForm.productivity"
          type="number"
          min="0.01"
          step="0.01"
          required
        />
      </label>
      <label
        >Preço por kg (R$)
        <input
          v-model.number="propertyForm.unitPrice"
          type="number"
          min="0.01"
          step="0.01"
          required
        />
      </label>
      <label
        >Custo total (R$)
        <input
          v-model.number="propertyForm.cost"
          type="number"
          min="0"
          step="0.01"
          required
        />
      </label>
    </div>
    <PropertyMap
      v-model="propertyForm.boundary"
      :initial-location="propertyForm.location"
    />
    <div v-if="error" class="error" role="alert">
      <AlertCircle :size="16" />{{ error }}
    </div>
    <div class="modal-actions">
      <button type="button" class="outline-button" @click="emit('close')">
        Cancelar</button
      ><button type="submit" class="primary-button">
        {{ editingId ? "Salvar alterações" : "Cadastrar propriedade" }}
      </button>
    </div>
  </form>
</template>
