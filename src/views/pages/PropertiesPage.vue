<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus, Tractor } from "lucide-vue-next";
import SearchToolbar from "../../components/pages/SearchToolbar.vue";
import PropertyCard from "../../components/pages/PropertyCard.vue";
import type { Property } from "../../models/climora";
const props = defineProps<{ properties: Property[] }>();
const emit = defineEmits<{
  create: [];
  edit: [item: Property];
  remove: [item: Property];
}>();
const search = ref("");
const filteredProperties = computed(() =>
  props.properties.filter((p) =>
    [p.name, p.culture, p.city, p.state]
      .join(" ")
      .toLowerCase()
      .includes(search.value.toLowerCase()),
  ),
);
</script>

<template>
  <div class="heading">
    <div>
      <div class="eyebrow">MINHA TERRA</div>
      <h1>Minhas propriedades</h1>
      <p>Cadastre e gerencie suas áreas rurais em um só lugar.</p>
    </div>
    <button class="primary-button" @click="emit('create')">
      <Plus :size="18" /> Nova propriedade
    </button>
  </div>
  <SearchToolbar
    v-model="search"
    placeholder="Buscar por cultura, nome ou localização..."
    label="Buscar propriedades"
    >{{ filteredProperties.length }} propriedade(s)</SearchToolbar
  >
  <div v-if="!filteredProperties.length" class="wide-empty">
    <div class="empty-icon"><Tractor :size="27" /></div>
    <h3>
      {{ search ? "Nenhum resultado encontrado" : "Sua jornada começa aqui" }}
    </h3>
    <p>
      {{
        search
          ? "Tente pesquisar outro nome ou localização."
          : "Cadastre sua propriedade para organizar as informações da sua terra."
      }}
    </p>
    <button v-if="!search" class="primary-button" @click="emit('create')">
      <Plus :size="17" /> Cadastrar propriedade
    </button>
  </div>
  <div v-else class="cards-grid">
    <PropertyCard
      v-for="p in filteredProperties"
      :key="p.id"
      :p="p"
      @edit="emit('edit', p)"
      @remove="emit('remove', p)"
    />
  </div>
</template>
