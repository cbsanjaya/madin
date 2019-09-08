<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          {{ $route.meta.title }}
        </q-toolbar-title>

        <q-btn-dropdown stretch flat :label="`${getActivePeriod} H`">
          <q-list>
            <q-item-label header>Ubah Tahun Ajaran</q-item-label>
            <q-item v-for="ta in getPeriods"
              :key="ta"
              clickable
              @click="changePeriod(ta)"
              v-close-popup
              tabindex="0"
            >
              <q-item-section avatar>
                <q-avatar icon="calendar_today" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ ta }} H</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn round>
          <q-avatar>
            <img :src="user.photoURL">
          </q-avatar>

          <q-menu
            transition-show="flip-right"
            transition-hide="flip-left"
          >
            <q-list style="min-width: 100px">
              <q-item clickable @click="logout">
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                  <q-item-label caption>{{ user.displayName || user.email }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>Popular Menu</q-item-label>
        <q-item clickable to="/" exact>
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashbor</q-item-label>
            <q-item-label caption>Informasi Penting</q-item-label>
          </q-item-section>
        </q-item>
        <q-item-label header>Master Data</q-item-label>
        <q-item clickable to="/students">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Siswa</q-item-label>
            <q-item-label caption>Daftar Siswa</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/teachers">
          <q-item-section avatar>
            <q-icon name="assignment_ind" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Guru</q-item-label>
            <q-item-label caption>Daftar Guru</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/grades">
          <q-item-section avatar>
            <q-icon name="room" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Kelas</q-item-label>
            <q-item-label caption>Daftar Kelas</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'DefaultLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      user: this.$auth.currentUser,
      routes: this.$router.options.routes
    }
  },
  computed: {
    ...mapGetters('setting', [
      'getActivePeriod',
      'getPeriods'
    ])
  },
  methods: {
    openURL,
    logout () {
      this.$auth.signOut()
    },
    changePeriod (v) {
      this.$store.commit('setting/changeActivePeriod', v)
    }
  }
}
</script>

<style>
</style>
