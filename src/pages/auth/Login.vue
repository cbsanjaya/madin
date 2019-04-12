<template>
  <q-page class="flex flex-center">
    <q-card style="width: 700px; max-width: 80vw;">
      <form @submit.prevent="login()">
        <q-card-section>
          <div class="text-h6">Login to Your Account</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="email" type="email" label="Email"/>
          <q-input v-model="password" type="password" label="Password" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn label="Login" color="primary" type="submit"/>
          <q-btn label="Login With Google" color="secondary" @click="googleLogin"/>
        </q-card-actions>
      </form>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.$auth.signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          this.$router.push('/')
        })
        .catch(error => {
          this.$q.notify('Invalid Login!')
          console.error(`Not signed in: ${error.message}`)
        })
    },
    googleLogin () {
      var provider = new this.$firebase.auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      this.$auth.signInWithPopup(provider)
        .then(user => {
          this.$router.push('/')
        })
        .catch(error => {
          this.$q.notify('Invalid Login!')
          console.error(`Not signed in: ${error.message}`)
        })
    }
  }
}
</script>
