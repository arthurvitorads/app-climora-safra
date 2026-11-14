<script setup lang="ts">
import { computed } from 'vue'
import { TriangleAlert, X } from 'lucide-vue-next'
import { money } from '../../services/format'
import { revenue } from '../../services/crop'

import type { climateAlerts } from '../../models/climateAlerts'

const props = defineProps<{ activeAlerts: typeof climateAlerts }>()
const emit = defineEmits<{ dismiss: [property: string] }>()

const alerts = computed(() =>
  props.activeAlerts.map((alert) => {
    const expectedRevenue = revenue(alert)
    const lostRevenue = (expectedRevenue * alert.lossPercent) / 100
    const adjustedRevenue = expectedRevenue - lostRevenue
    const lossBasis = `${alert.lossPercent}% sobre a receita esperada de ${money(expectedRevenue)} = ${money(lostRevenue)} de perda de receita.`
    const impact = [
      { label: 'Lucro sem perdas', value: expectedRevenue - alert.cost },
      { label: 'Lucro após perdas', value: adjustedRevenue - alert.cost },
      { label: 'Redução estimada no lucro', value: lostRevenue },
    ]
    const message = [
      `Climora | ${alert.property}`,
      `${alert.event} no cultivo de ${alert.culture}. Perda estimada de ${alert.lossPercent}% da produção.`,
      ...impact.map((item) => `${item.label}: ${money(item.value)}`),
      `Receita esperada: ${money(expectedRevenue)}`,
      `Receita após perdas: ${money(adjustedRevenue)}`,
      `Custo total: ${money(alert.cost)}`,
      lossBasis,
    ].join('\n')
    return {
      ...alert,
      impact,
      whatsappUrl: 'https://wa.me/?text=' + encodeURIComponent(message),
      expectedRevenue,
      adjustedRevenue,
    }
  }),
)
</script>

<template>
  <h1>Alertas</h1>
  <p v-if="!alerts.length" role="status">Nenhum alerta ativo.</p>
  <div v-else class="alert-list">
    <article
      v-for="alert in alerts"
      :key="alert.property"
      class="entity-card climate-alert"
    >
      <div class="alert-heading">
        <TriangleAlert :size="24" />
        <h2>{{ alert.property }}</h2>
        <div class="alert-actions">
          <a
            :href="alert.whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-button whatsapp-button"
            aria-label="Enviar por WhatsApp"
            title="Enviar por WhatsApp"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5l-4.4 1.2 1.2-4.2A8.5 8.5 0 1 1 20.5 11.7Z"
              />
              <path
                fill="currentColor"
                stroke="none"
                d="M9.4 7.4c-.5-.2-1.1 0-1.4.5-.6.8-.4 2.2.4 3.4a10.6 10.6 0 0 0 4.2 3.8c1.4.6 2.8.5 3.5-.3.4-.4.5-1 .3-1.3l-2-1c-.3-.1-.5 0-.7.2l-.6.7c-1.4-.6-2.5-1.6-3.2-2.9l.6-.7c.2-.2.2-.5.1-.7z"
              />
            </svg>
          </a>
          <button
            type="button"
            class="icon-button"
            aria-label="Fechar alerta"
            title="Fechar alerta"
            @click="emit('dismiss', alert.property)"
          >
            <X :size="20" />
          </button>
        </div>
      </div>
      <p>
        {{ alert.event }} no cultivo de {{ alert.culture }}, com perda estimada
        de {{ alert.lossPercent }}% da produção.
      </p>
      <dl class="alert-impact">
        <div v-for="item in alert.impact" :key="item.label">
          <dt>
            {{ item.label }}
            <span
              v-if="item.label === 'Redução estimada no lucro'"
              class="loss-basis"
            >
              ({{ alert.lossPercent }}% sobre a receita esperada)
            </span>
          </dt>
          <dd>{{ money(item.value) }}</dd>
        </div>
      </dl>
      <div class="details">
        <div>
          <small>Receita esperada</small>
          <strong>{{ money(alert.expectedRevenue) }}</strong>
        </div>
        <div>
          <small>Receita após perdas</small>
          <strong>{{ money(alert.adjustedRevenue) }}</strong>
        </div>
        <div>
          <small>Custo total</small>
          <strong>{{ money(alert.cost) }}</strong>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.alert-list {
  display: grid;
  gap: 16px;
}
.climate-alert {
  max-width: 800px;
}
.alert-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #943a26;
}
.alert-heading h2 {
  font-size: 1.25rem;
  margin: 0;
}
.climate-alert p {
  margin: 12px 0 20px;
}
.loss-basis {
  display: block;
  margin-top: 4px;
  font-size: 1rem;
  font-weight: 600;
}
.details {
  grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
}
.alert-impact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
  gap: 12px;
}
.alert-impact div {
  padding: 14px;
  background: #f4f7f1;
  border-radius: 8px;
}
.alert-impact div:last-child {
  background: #fff0e7;
  color: #943a26;
}
.alert-impact dd {
  margin: 6px 0 0;
  font-weight: 700;
  font-size: 1.15rem;
}
.alert-actions {
  margin-inline-start: auto;
  display: flex;
  gap: 6px;
}
.alert-actions .icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
}
.whatsapp-button {
  color: #147849;
}
.whatsapp-button:focus-visible {
  outline: 3px solid #a6c3a0;
  outline-offset: 2px;
}
</style>
