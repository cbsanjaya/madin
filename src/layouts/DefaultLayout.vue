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
          Madrasah Diniah
        </q-toolbar-title>

        <q-btn-dropdown flat text-bold :label="user.displayName || user.email">
          <q-list>
            <q-item clickable @click="logout">
              <q-item-section>
                <q-item-label>Log Out</q-item-label>
                <q-item-label caption>Clear your Session</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
            <q-icon name="school" />
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
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'DefaultLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      user: this.$auth.currentUser
    }
  },
  methods: {
    openURL,
    logout () {
      this.$auth.signOut()
    }
  }
}
</script>

<style>
</style>
