<script setup lang="ts">
import { computed } from 'vue'
import { number } from '../../services/format'
import { boundaryAreaHectares } from '../../services/propertyBoundary'
import { AlertCircle } from 'lucide-vue-next'
import type { Property } from '../../models/climora'
import PropertyMap from './PropertyMap.vue'

defineProps<{ editingId: string | null; error: string }>()
const propertyForm = defineModel<Property>({ required: true })
const cultures = [
  'Soja',
  'Feijão',
  'Milho',
  'Trigo',
  'Arroz',
  'Café',
  'Mandioca',
  'Algodão',
  'Cana-de-açúcar',
  'Hortaliças',
  'Outras culturas',
]
const savedCulture = propertyForm.value.culture
if (savedCulture && !cultures.includes(savedCulture))
  cultures.push(savedCulture)
const area = computed(() => boundaryAreaHectares(propertyForm.value.boundary))

const emit = defineEmits<{ save: []; close: [] }>()
</script>

<template>
  <form class="property-form" @submit.prevent="emit('save')">
    <div class="form-grid">
      <label>
        Nome da propriedade
        <input v-model.trim="propertyForm.name" maxlength="90" required />
      </label>
      <label>
        Cultura
        <select v-model="propertyForm.culture" required>
          <option disabled value="">Selecione a cultura</option>
          <option v-for="culture in cultures" :key="culture" :value="culture">
            {{ culture }}
          </option>
        </select>
      </label>
    </div>
    <PropertyMap
      v-model="propertyForm.boundary"
      :initial-location="propertyForm.location"
    >
      <strong v-if="area > 0">Área delimitada: {{ number(area) }} ha</strong>
    </PropertyMap>
    <div class="form-grid calculation-fields">
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
    <div v-if="error" class="error" role="alert">
      <AlertCircle :size="16" />{{ error }}
    </div>
    <div class="modal-actions">
      <button type="button" class="outline-button" @click="emit('close')">
        Cancelar</button
      ><button type="submit" class="primary-button">
        {{ editingId ? 'Salvar alterações' : 'Cadastrar propriedade' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.property-form {
  display: grid;
  gap: 12px;
}

.form-grid {
  gap: 10px;
}

.calculation-fields {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.modal-actions {
  padding-top: 10px;
  margin-top: 0;
}

@media (max-width: 440px) {
  .calculation-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
