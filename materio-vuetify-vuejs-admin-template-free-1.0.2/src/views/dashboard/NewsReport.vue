<template>
  <v-card>
    <v-card-title class="align-start">
      <span class="font-weight-semibold">Reporte IA</span>
      <v-spacer></v-spacer>
      <v-btn
        icon
        small
        class="me-n3 mt-n2"
      >
        <v-icon>
          {{ icons.mdiDotsVertical }}
        </v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle class="mb-8 mt-n5">
      <span class="font-weight-semibold text--primary me-1">La inteligencia artificial ha determinado que esta información parece {{ percentage }} falsa</span>
      <span></span>
    </v-card-subtitle>
    <v-card-text>
      <iframe :src="url" style="width: inherit"></iframe>
    </v-card-text>
    <v-card-actions>
    </v-card-actions>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiDotsVertical,
} from '@mdi/js'

export default {
  setup() {
    return {
      tags: [],
      items: [],
      search: '',

      // icons
      icons: {
        mdiDotsVertical,
      },
    }
  },
  methods: {
  },
  props: [
    'url', 'percentage',
  ],
  created() {
    this.infoStatus = this.percentage
  },
}
</script>
