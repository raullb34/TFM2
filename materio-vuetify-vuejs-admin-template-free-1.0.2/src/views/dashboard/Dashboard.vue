<template>
  <v-row
    style="align-items: center;
    justify-content: center;"
  >
    <v-col
      cols="12"
      md="10"
    >
      <v-text-field
        v-model="news"
        rounded
        dense
        outlined
        label="Ingresa el texto de una noticia para contrastarla"
        :prepend-icon="icons.mdiMagnify"
        clear-icon="mdi-close-circle"
        class="app-bar-search flex-grow-0"
        @click:prepend="findNewsText()"
      ></v-text-field>
    </v-col>

      <v-col
        v-if="newsChecked"
        cols="12"
        md="12"
      >
        <news-report :url="news" :percentage="percent" v-on:endReport="endReportTags"></news-report>
      </v-col>
      <v-col
        v-if="newsChecked"
        cols="12"
        md="12"
      >
        <add-tags></add-tags>
      </v-col>
      <v-col
        v-else
        cols="12"
        md="12"
      >
        <v-carousel>
          <v-carousel-item
            v-for="news in newsExample"
            :key="news"
          >
            <v-sheet
              color="primary"
              height="100%"
              tile
            >
              <v-row
                class="height:80%;width:100%"
                align="center"
                justify="center"
              >
                <img :src="require('@/assets/images/news/img1.png')"/>
              </v-row>
            </v-sheet>
          </v-carousel-item>
      </v-carousel>
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <my-progress :progressUser="userProgress"></my-progress>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <tags-stats :cTags="communityTags" :uTags="userTags"></tags-stats>
    </v-col>
    <v-col cols="12">
      <dashboard-datatable :dataTable="communityReports"></dashboard-datatable>
    </v-col>
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiMagnify } from '@mdi/js'

// import StatisticsCardVertical from '@/components/statistics-card/StatisticsCardVertical.vue'
import axios from 'axios'

// demos
import AddTags from './AddTags.vue'
import NewsReport from './NewsReport.vue'
import TagsStats from './TagsStats.vue'
import MyProgress from './MyProgress.vue'
import DashboardDatatable from './DashboardDatatable.vue'
import config from '../../config/config.json'

export default {
  components: {
    // StatisticsCardVertical,
    TagsStats,
    MyProgress,
    DashboardDatatable,
    AddTags,
    NewsReport,
  },
  data() {
    return {
      newsExample: ['example'],
      icons: {
        mdiMagnify,
      },
      news: '',
      newsChecked: false,
      percent: '0%',
      userTags: [],
      communityTags: [],
      userProgress: [],
      userReports: [],
      communityReports: [],
    }
  },
  async created() {
    const user = window.localStorage.getItem('user')
    if (user === {} || user === undefined || user === null) {
      this.$router.push('/pages/login')
    }
  },
  async mounted() {
    this.getUserReports()
  },
  methods: {
    async findNewsText() {
      this.newsChecked = true
      const infoWeb = await axios.get(this.news)
      const parser = new DOMParser()
      const doc = parser.parseFromString(infoWeb.data, 'text/html')
      const textInsideNews = doc.getElementsByTagName('p')
      let newsTxt = ''
      textInsideNews.forEach(element => {
        newsTxt += element.innerText
      })
      console.log(newsTxt)
      this.percent = await axios.post(`${config.api_url}/predict`, { text: newsTxt })
      console.log(this.percent.data.fake)
      this.percent = `${(this.percent.data.fake * 100).toFixed(2)}%`
      let currentNews = await axios.post(`${config.api_url}/news`, { author: '', url: this.news })
      if (currentNews.data !== undefined) {
        currentNews = currentNews.data
      }
      window.localStorage.setItem('news', JSON.stringify(currentNews))
    },
    async getInfoNews() {
      this.newsExample = await axios.get(`${config.api_url}/news`)
      this.newsExample = this.newsExample.data
      console.log(this.newsExample)
    },
    endReportTags() {
      this.newsChecked = false
      this.getUserReports()
    },
    async getUserReports() {
      return Promise.all(axios.get(`${config.api_url}/reports?userId=${JSON.parse(window.localStorage.getItem('user')).id}`).then(async userRep => {
        console.log(userRep)
        this.userReports = userRep.data
        await userRep.data.forEach(element => {
          if (this.userTags.length <= 0) {
            this.userTags = element.tags
          } else {
            this.userTags.concat(element.tags)
          }
          console.log(this.userTags)
          this.updateProgress()

          return this.userTags
        })
      }).catch({}), axios.get(`${config.api_url}/reports`).then(async allRep => {
        console.log(allRep)
        this.communityReports = allRep.data
        await allRep.data.forEach(element => {
          if (this.communityTags.length <= 0) {
            this.communityTags = element.tags
          } else {
            this.communityTags.concat(element.tags)
          }
          console.log(this.communityTags)

          return this.communityTags
        })
      }).catch({}))
    },
    async updateProgress() {
      // this.userProgress = []
      console.log('hola2')
      await this.userReports.forEach(element => {
        console.log(element)
        this.userProgress.push({
          origin: element.shared,
          action: `Noticia Reportada ${element.date}`,
          points: '+20 puntos',
          color: 'primary',
        })
      })

      return this.userProgess
    },
  },
}
</script>
