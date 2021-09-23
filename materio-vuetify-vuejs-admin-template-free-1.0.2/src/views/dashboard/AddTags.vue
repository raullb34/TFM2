<template>
  <v-card>
    <v-card-title class="align-start">
      <span class="font-weight-semibold">Añadir Etiquetas</span>
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
      <span class="font-weight-semibold text--primary me-1">Etiquetas más populares</span>
      <span>😎 del momento</span>
    </v-card-subtitle>

    <v-card-text>
      <v-row>
        <v-col
          v-for="data in statisticsData"
          :key="data.title"
          cols="12"
          md="6"
          class="d-flex align-center"
        >
          <v-avatar
            size="44"
            :color="resolveStatisticsIconVariation(data.title).color"
            rounded
            class="elevation-1"
          >
            <v-icon
              dark
              color="white"
              size="30"
            >
              {{ resolveStatisticsIconVariation(data.title).icon }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="mb-0">
              {{ data.title }}
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ data.total }}
            </h3>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-layout wrap>
          <v-flex xs12>
            <v-combobox
              v-model="tags"
              multiple
              outlined
              label="Tags"
              append-icon
              chips
              deletable-chips
              class="tag-input"
              :search-input.sync="search"
              @keyup.tab="updateTags"
              @paste="updateTags"
            >
            </v-combobox>
          </v-flex>
          <v-chip
            v-for="tag in tags"
            :key="tag"
            close
            color="success"
            text-color="white"
          >
            <v-icon left>
              {{ icons.mdiLabelOutline }}
            </v-icon>{{ tag }}
          </v-chip>
        </v-layout>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn text outlined @click="sendReport(true)">
        <v-icon
          style="color: green"
        >
          {{ icons.mdiThumbUpOutline }}
        </v-icon>
      </v-btn>
      <v-btn text outlined @click="sendReport(false)">
        <v-icon
          style="color: red"
        >
          {{ icons.mdiThumbDownOutline }}
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text outlined @click="shareContent()"
      >
        <v-icon>
          {{ icons.mdiShare }}
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiAccountOutline,
  mdiCurrencyUsd,
  mdiTrendingUp,
  mdiDotsVertical,
  mdiLabelOutline,
  mdiThumbUpOutline,
  mdiThumbDownOutline,
  mdiShare,
} from '@mdi/js'
import axios from 'axios'
import config from '../../config/config.json'

export default {
  setup() {
    const statisticsData = [
      {
        title: 'Etiquetas usadas por ti',
        total: 0,
      },
      {
        title: 'Etiquetas totales',
        total: 0,
      },
    ]

    const resolveStatisticsIconVariation = data => {
      if (data === 'Sales') return { icon: mdiTrendingUp, color: 'primary' }

      return { icon: mdiLabelOutline, color: 'primary' }
    }

    return {
      statisticsData,
      resolveStatisticsIconVariation,
      tags: [],
      items: [],
      search: '',

      // icons
      icons: {
        mdiDotsVertical,
        mdiTrendingUp,
        mdiAccountOutline,
        mdiLabelOutline,
        mdiCurrencyUsd,
        mdiThumbUpOutline,
        mdiThumbDownOutline,
        mdiShare,
      },
    }
  },
  methods: {
    updateTags() {
      this.$nextTick(() => {
        this.tags.push(...this.search.split(','))
        this.$nextTick(() => {
          this.search = ''
        })
      })
    },
    async shareContent() {
      await navigator.share({ title: '', text: '', url: '' })
      this.$emit('endReport', true)
    },
    async sendReport(reportType) {
      console.log(this.$store.state)
      await axios.post(`${config.api_url}/reports`, {
        /* eslint no-underscore-dangle: 0 */
        authorId: JSON.parse(window.localStorage.getItem('user')).id,
        /* eslint no-underscore-dangle: 0 */
        newsId: JSON.parse(window.localStorage.getItem('news'))._id,
        tags: this.tags,
        fake: reportType,
      })
    },
  },
}
</script>
