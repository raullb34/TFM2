<template>
  <v-card>
    <v-card-title class="align-start">
      <span>Mi progreso</span>

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

    <v-card-text>
      <v-list
        v-if="progressUser.length > 0"
        class="pb-0"
      >
        <v-list-item
          v-for="(data,index) in progressUser"
          :key="data.country"
          :class="`d-flex align-center px-0 ${index > 0 ? 'mt-4':''}`"
        >
          <v-avatar
            :color="data.color"
            size="40"
            :class="`${data.color} white--text font-weight-medium me-3`"
          >
            <span class="text-base">RP</span>
          </v-avatar>

          <div class="d-flex align-center flex-grow-1 flex-wrap">
            <div class="me-2">
              <div class="font-weight-semibold">
                <span class="text--primary text-base me-1">{{ data.origin }}</span>

                <v-icon
                  size="20"
                  :color="data.points.charAt(0) === '+' ? 'success':'error'"
                >
                  {{ data.points.charAt(0) === '+' ? icons.mdiChevronUp: icons.mdiChevronDown }}
                </v-icon>

                <span :class="`text-xs ${data.points.charAt(0) === '+' ? 'success--text':'error--text ma-2'}`">{{ data.points }}</span>
              </div>

              <v-list-item-subtitle class="text-xs">
                {{ data.action }}
              </v-list-item-subtitle>
            </div>
          </div>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <span>No hay reportes</span>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiDotsVertical, mdiChevronUp, mdiChevronDown } from '@mdi/js'

export default {
  data() {
    return {
      icons: {
        mdiDotsVertical,
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },
  props: ['progressUser'],
}
</script>
