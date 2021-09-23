<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          Verificador de Información <br> Basado en Gamificación e IA
        </v-card-title>

        <!-- title -->
        <v-card-text>
          <p class="mb-2">
            Una nueva metodología para contrastar información de manera sencilla
          </p>
        </v-card-text>

        <!-- login form -->
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="name"
              outlined
              label="Nombre"
              placeholder="Nombre"
              hide-details
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="password"
              outlined
              :type="isPasswordVisible ? 'text' : 'password'"
              label="Contraseña"
              placeholder="············"
              :append-icon="isPasswordVisible ? icons.mdiEyeOffOutline : icons.mdiEyeOutline"
              hide-details
              @click:append="isPasswordVisible = !isPasswordVisible"
            ></v-text-field>
            <v-btn
              block
              color="primary"
              class="mt-6"
              @click="login()"
            >
              Acceder
            </v-btn>
          </v-form>
        </v-card-text>

        <!-- create new account  -->
        <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
          <span class="me-2">
            ¿Nuevo en la plataforma?
          </span>
          <router-link :to="{name:'pages-register'}">
            Crea una cuenta
          </router-link>
        </v-card-text>

        <!-- divider -->
        <v-card-text class="d-flex align-center mt-2">
          <v-divider></v-divider>
          <span class="mx-5">o</span>
          <v-divider></v-divider>
        </v-card-text>

        <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
          <span class="me-2">
            Accede como
          </span>
          <router-link :to="{name:''}">
            invitado
          </router-link>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiFacebook, mdiTwitter, mdiGithub, mdiGoogle, mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'
import axios from 'axios'
import config from '../../config/config.json'

export default {
  setup() {
    const isPasswordVisible = ref(false)
    const name = ref('')
    const password = ref('')
    const socialLink = [
      {
        icon: mdiFacebook,
        color: '#4267b2',
        colorInDark: '#4267b2',
      },
      {
        icon: mdiTwitter,
        color: '#1da1f2',
        colorInDark: '#1da1f2',
      },
      {
        icon: mdiGithub,
        color: '#272727',
        colorInDark: '#fff',
      },
      {
        icon: mdiGoogle,
        color: '#db4437',
        colorInDark: '#db4437',
      },
    ]

    return {
      isPasswordVisible,
      name,
      password,
      socialLink,

      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
    }
  },
  methods: {
    async login() {
      await axios.post(`${config.api_url}/login`, { user: this.name, password: this.password }).then(result => {
        console.log(result)
        if (result.status === 201) {
          window.localStorage.setItem('user', JSON.stringify(result.data))
          this.$router.push('/dashboard')
        } else {
          this.$router.push('/pages-login')
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';
.card-header a{
  color: #4DB6AC
}
</style>
