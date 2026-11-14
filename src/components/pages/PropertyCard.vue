<script setup lang="ts">
import { MapPin, Pencil, Tractor, Trash2 } from "lucide-vue-next";
import type { Property } from "../../models/climora";
import { number } from "../../services/format";

defineProps<{ p: Property }>();
const emit = defineEmits<{ edit: []; remove: [] }>();
</script>

<template>
  <article class="entity-card">
    <div class="entity-card-top">
      <div class="entity-icon"><Tractor :size="24" /></div>
      <span class="tag">Propriedade rural</span>
    </div>
    <h3>{{ p.name }}</h3>
    <p v-if="p.city || p.state" class="location">
      <MapPin :size="15" /> {{ p.city }} / {{ p.state }}
    </p>
    <div class="details">
      <div>
        <small>Área plantada</small><strong>{{ number(p.area) }} ha</strong>
      </div>
      <div>
        <small>{{ p.culture ? "Cultura" : "Tipo de solo" }}</small
        ><strong>{{ p.culture || p.soil || "Não informado" }}</strong>
      </div>
    </div>
    <p v-if="p.notes" class="notes">{{ p.notes }}</p>
    <div class="entity-actions">
      <button class="outline-button" @click="emit('edit')">
        <Pencil :size="15" /> Editar</button
      ><button
        class="delete-button"
        aria-label="Excluir propriedade"
        @click="emit('remove')"
      >
        <Trash2 :size="17" />
      </button>
    </div>
  </article>
</template>
