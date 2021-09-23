<template>
  <v-card>
    <div class="d-flex flex-sm-row flex-column">
      <div class="flex-grow-1">
        <v-card-title>
          <span class="me-3">Etiquetas más frecuentemente usadas por la comunidad</span>
          <v-spacer></v-spacer>
          <span class="text-xs text--disabled cursor-pointer">Ver todas</span>
        </v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(count,tag) in countCTags()"
              :key="tag"
              :class="`d-flex px-0 ${count > 0 ? 'mt-4':''}`"
            >
              <v-col>
                <v-chip
                  small
                  :color="randColor()"
                  class="font-weight-medium"
                >
                  {{ tag }}
                </v-chip>
              </v-col>
              <v-col>
                <div
                  class="d-flex align-center flex-grow-1 flex-wrap ma-1"
                  style="place-content: center;"
                >
                  <span class="font-weight-semibold success--text">{{ count }}</span>
                </div>
              </v-col>
            </v-list-item>
          </v-list>
        </v-card-text>
      </div>

      <v-divider
        class="my-sm-5 mx-5"
        :vertical="$vuetify.breakpoint.smAndUp"
      ></v-divider>

      <div class="flex-grow-1">
        <v-card-title>
          <span class="me-3">Etiquetas más frecuentemente usadas por tí</span>
          <v-spacer></v-spacer>
          <span class="text-xs text--disabled cursor-pointer">Ver todas</span>
        </v-card-title>

        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(count,tag) in countUTags()"
              :key="tag"
              :class="`d-flex px-0 ${count > 0 ? 'mt-4':''}`"
            >
              <v-col>
                <v-chip
                  small
                  :color="randColor()"
                  class="font-weight-medium"
                >
                  {{ tag }}
                </v-chip>
              </v-col>
              <v-col>
                <div
                  class="d-flex align-center flex-grow-1 flex-wrap ma-1"
                  style="place-content: center;"
                >
                  <span class="font-weight-semibold success--text">{{ count }}</span>
                </div>
              </v-col>
            </v-list-item>
          </v-list>
        </v-card-text>
      </div>
    </div>
  </v-card>
</template>

<script>

export default {
  setup() {
    return {
    }
  },
  watch: {
    uTags: {
      handler: () => {
      },
      immediate: true,
    },
  },
  methods: {
    randColor() {
      return ['primary', 'warning', 'info', 'error'][Math.floor(Math.random() * 4)]
    },
    countUTags() {
      // eslint-disable-next-line
      return this.uTags.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
    },
    countCTags() {
      // eslint-disable-next-line
      return this.cTags.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
    },
  },
  props: { uTags: Array, cTags: Array },
}
</script>
