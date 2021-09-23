<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="dataTable"
      item-key="full_name"
      class="table-rounded"
      hide-default-footer
      disable-sort
    >
      <!-- name -->
      <template #[`item.authorId`]="{ item }">
        <div class="d-flex flex-column">
          <span class="d-block font-weight-semibold text--primary text-truncate">{{item.authorId}}</span>
        </div>
      </template>
      <!-- status -->
      <template #[`item.tags`]="{ item }">
        <div v-for="t in item.tags" :key="t">
          <v-chip small color="primary" class="font-weight-medium mb-1">
            {{ t }}
          </v-chip>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mdiSquareEditOutline, mdiDotsVertical } from '@mdi/js'
import axios from 'axios'
import config from '../../config/config.json'

export default {
  data() {
    const statusColor = {
      /* eslint-disable key-spacing */
      Current: 'primary',
      Professional: 'success',
      Rejected: 'error',
      Resigned: 'warning',
      Applied: 'info',
      /* eslint-enable key-spacing */
    }

    return {
      headers: [
        { text: 'NOMBRE', value: 'authorId' },
        { text: 'NOTICIA', value: 'newsId' },
        { text: 'ETIQUETAS', value: 'tags' },
      ],
      status: {
        1: 'Current',
        2: 'Professional',
        3: 'Rejected',
        4: 'Resigned',
        5: 'Applied',
      },
      statusColor,

      // icons
      icons: {
        mdiSquareEditOutline,
        mdiDotsVertical,
      },
    }
  },
  props: ['dataTable'],
  watch: {
    // eslint-disable-next-line
    dataTable: async function () {
      await this.setNameAndNews()
    },
  },
  methods: {
    async getUserName(id) {
      const user = await axios.get(`${config.api_url}/users/${id}`).catch({})

      return user.data.name
    },
    async getNewsName(id) {
      const news = await axios.get(`${config.api_url}/news/${id}`).catch({})

      return news.data.url
    },
    async setNameAndNews() {
      // eslint-disable-next-line
      for await (const element of this.dataTable) {
        // eslint-disable-next-line
        element.authorId = await this.getUserName(element.authorId)
        // eslint-disable-next-line
        element.newsId = await this.getNewsName(element.newsId)
      }

      console.log(this.dataTable)
    },
  },
}
</script>
