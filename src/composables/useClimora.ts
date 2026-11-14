import { ref, watch } from 'vue'
import type { Crop, Property } from '../models/climora'
import { boundaryAreaHectares } from '../services/propertyBoundary'

export function useClimora() {
  type Modal = 'property' | null
  const KEY = 'climora_agro_v1'
  function saved(): {
    properties: Property[]
    crops: Crop[]
  } {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || '{}')
      return {
        properties: Array.isArray(data.properties) ? data.properties : [],
        crops: Array.isArray(data.crops) ? data.crops : [],
      }
    } catch {
      return { properties: [], crops: [] }
    }
  }
  const initial = saved()
  const properties = ref<Property[]>(initial.properties)
  const crops = ref<Crop[]>(initial.crops)
  watch(
    [properties, crops],
    () =>
      localStorage.setItem(
        KEY,
        JSON.stringify({
          properties: properties.value,
          crops: crops.value,
        }),
      ),
    { deep: true },
  )
  const modal = ref<Modal>(null)
  const editingId = ref<string | null>(null)
  const error = ref('')
  const emptyProperty = (): Property => ({
    id: '',
    name: '',
    city: '',
    state: '',
    area: 0,
    soil: '',
    notes: '',
    culture: '',
    productivity: 0,
    unitPrice: 0,
    cost: 0,
  })
  const propertyForm = ref<Property>(emptyProperty())
  function openProperty(p?: Property) {
    editingId.value = p?.id || null
    const existingCrop =
      p && crops.value.find((crop) => crop.propertyId === p.id)
    propertyForm.value = p
      ? {
          ...p,
          culture: p.culture ?? existingCrop?.culture ?? '',
          productivity: p.productivity ?? existingCrop?.productivity ?? 0,
          unitPrice: p.unitPrice ?? existingCrop?.unitPrice ?? 0,
          cost: p.cost ?? existingCrop?.cost ?? 0,
        }
      : emptyProperty()
    error.value = ''
    modal.value = 'property'
  }
  function closeModal() {
    modal.value = null
    error.value = ''
  }
  function saveProperty() {
    const p = propertyForm.value
    const area = boundaryAreaHectares(p.boundary)
    if (!Number.isFinite(area) || area <= 0) {
      error.value = 'Marque os quatro cantos do terreno no mapa.'
      return
    }
    const name = p.name.trim()
    if (!name) {
      error.value = 'Informe o nome da propriedade.'
      return
    }
    const culture = p.culture?.trim()
    if (!culture) {
      error.value = 'Selecione a cultura.'
      return
    }
    const { productivity, unitPrice, cost } = p
    if (
      ![productivity, unitPrice, cost].every(Number.isFinite) ||
      productivity! <= 0 ||
      unitPrice! <= 0 ||
      cost! < 0
    ) {
      error.value = 'Informe valores válidos para produtividade, preço e custo.'
      return
    }
    if (editingId.value) {
      properties.value = properties.value.map((item) =>
        item.id === editingId.value ? { ...p, culture, name, area } : item,
      )
    } else {
      properties.value.unshift({
        ...p,
        culture,
        id: crypto.randomUUID(),
        name,
        area,
      })
    }
    closeModal()
  }
  function deleteProperty(p: Property) {
    const totalCrops = crops.value.filter((c) => c.propertyId === p.id).length
    if (
      !confirm(
        `Excluir a propriedade "${p.name}"${totalCrops ? ` e seus ${totalCrops} cultivo(s)` : ''}? Esta ação não pode ser desfeita.`,
      )
    )
      return
    properties.value = properties.value.filter((x) => x.id !== p.id)
    crops.value = crops.value.filter((x) => x.propertyId !== p.id)
  }
  return {
    properties,
    modal,
    editingId,
    error,
    propertyForm,
    openProperty,
    closeModal,
    saveProperty,
    deleteProperty,
  }
}
