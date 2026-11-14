<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { LocateFixed } from 'lucide-vue-next'
import type { Coordinates } from '../../models/climora'
import { loadLeaflet } from '../../services/propertyMap'

import {
  boundarySize,
  isValidBoundary,
  outlinePoints,
} from '../../services/propertyBoundary'

const props = defineProps<{ initialLocation?: Coordinates }>()
const corners = defineModel<Coordinates[]>()
const cornerLabels = [
  'superior esquerdo',
  'superior direito',
  'inferior esquerdo',
  'inferior direito',
]
const boundaryError = ref('')
let redraw: ((points: Coordinates[]) => void) | undefined
const container = ref<HTMLElement>()
const status = ref<'loading' | 'ready' | 'error'>('loading')
const tileError = ref(false)
const locateError = ref('')
const locating = ref(false)
const brazil = { lat: -14.235, lng: -51.9253 }

let map: ReturnType<Awaited<ReturnType<typeof loadLeaflet>>['map']> | undefined
let disposed = false

async function initializeMap() {
  status.value = 'loading'
  try {
    const leaflet = await loadLeaflet()
    if (disposed || !container.value) return

    map = leaflet.map(container.value, { scrollWheelZoom: false })
    map.setView(props.initialLocation ?? brazil, props.initialLocation ? 16 : 4)
    const tiles = leaflet.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        noWrap: true,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    )
    tiles.on('tileerror', () => (tileError.value = true))
    tiles.on('tileload', () => (tileError.value = false))
    tiles.addTo(map)

    const activeMap = map
    const layers: { remove: () => void }[] = []
    redraw = (points) => {
      layers.splice(0).forEach((layer) => layer.remove())
      if (isValidBoundary(points)) {
        const outline = leaflet.polygon(outlinePoints(points), {
          color: '#287344',
          fillOpacity: 0.22,
          interactive: false,
        })
        outline.addTo(activeMap)
        layers.push(outline)
      }
      points.forEach((point, index) => {
        const pin = leaflet.circleMarker(point, {
          radius: 7,
          color: '#fff',
          fillColor: '#287344',
          fillOpacity: 1,
          weight: 2,
          interactive: false,
        })
        pin.bindTooltip(String(index + 1), {
          permanent: true,
          direction: 'top',
        })
        pin.addTo(activeMap)
        layers.push(pin)
      })
    }

    redraw(corners.value ?? [])
    if (isValidBoundary(corners.value)) {
      map.fitBounds(corners.value!, { padding: [32, 32], maxZoom: 18 })
    }
    map.on('click', ({ latlng }) => addCorner(latlng))
    status.value = 'ready'
  } catch {
    if (disposed) return
    map?.remove()
    map = undefined
    status.value = 'error'
  }
}

function addCorner(point: Coordinates) {
  const points = corners.value ?? []
  if (points.length >= boundarySize) return

  const { lat, lng } = point
  const normalized = { lat, lng: ((((lng + 180) % 360) + 360) % 360) - 180 }
  if (
    points.some(
      (corner) =>
        corner.lat === normalized.lat && corner.lng === normalized.lng,
    )
  )
    return

  const next = [...points, normalized]
  if (next.length === boundarySize && !isValidBoundary(next)) {
    boundaryError.value =
      'O contorno ficou irregular. Escolha outro ponto ou desfaça a última marcação.'
    return
  }
  updateCorners(next)
}

function updateCorners(points: Coordinates[]) {
  boundaryError.value = ''
  corners.value = points
  redraw?.(points)
}

function locate() {
  locateError.value = ''
  if (!navigator.geolocation) {
    locateError.value = 'A localização do dispositivo está indisponível.'
    return
  }

  locating.value = true
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      locating.value = false
      map?.setView({ lat: coords.latitude, lng: coords.longitude }, 16)
    },
    () => {
      locating.value = false
      locateError.value =
        'Não foi possível obter sua localização. Navegue pelo mapa para encontrar a propriedade.'
    },
    { timeout: 8000 },
  )
}

onMounted(initializeMap)
onBeforeUnmount(() => {
  disposed = true
  map?.remove()
  map = undefined
})
</script>

<template>
  <section class="property-map" aria-label="Localização da propriedade">
    <div class="map-heading">
      <strong>Localização da propriedade</strong>
      <button
        v-if="status === 'ready'"
        type="button"
        class="outline-button"
        :disabled="locating"
        @click="locate"
      >
        <LocateFixed :size="16" /> Minha localização
      </button>
    </div>
    <div
      v-show="status !== 'error'"
      ref="container"
      class="map"
      role="region"
      aria-label="Mapa interativo"
    ></div>
    <div v-if="status === 'ready'" class="map-actions">
      <p aria-live="polite" v-if="(corners?.length ?? 0) < boundarySize">
        Marque o canto {{ (corners?.length ?? 0) + 1 }} ({{
          cornerLabels[corners?.length ?? 0]
        }}).
      </p>
      <p v-else aria-live="polite"><slot /></p>
      <button
        v-if="corners?.length"
        type="button"
        class="outline-button"
        @click="updateCorners(corners.slice(0, -1))"
      >
        Desfazer último canto
      </button>
      <button
        v-if="corners?.length"
        type="button"
        class="outline-button"
        @click="updateCorners([])"
      >
        Limpar seleção
      </button>
    </div>
    <p v-if="boundaryError" role="alert">{{ boundaryError }}</p>
    <p v-if="status === 'loading'" role="status">Carregando mapa…</p>
    <template v-if="status === 'error'">
      <p role="alert">
        Não foi possível carregar o mapa. Verifique sua conexão.
      </p>
      <button type="button" class="outline-button" @click="initializeMap">
        Tentar novamente
      </button>
    </template>
    <p v-if="tileError" role="status">
      O mapa não carregou por completo. Verifique sua conexão.
    </p>
    <p v-if="locateError" role="status">{{ locateError }}</p>
  </section>
</template>

<style scoped>
.map-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.property-map p {
  color: #53675a;
  font-size: 0.85rem;
  margin: 6px 0;
}

.map {
  isolation: isolate;
  height: clamp(135px, 30dvh, 280px);
  border-radius: 10px;
  background: #e8eee4;
  cursor: crosshair;
}

.map-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.map-actions p {
  flex: 1 1 180px;
}
</style>
