<template>
  <q-page padding>
    <q-list bordered>
      <q-item clickable v-ripple @click="dataBaru">
        <q-item-section avatar>
          <q-icon color="primary" name="plus" />
        </q-item-section>
        <q-item-section>Tambah Data Baru</q-item-section>
      </q-item>
      <q-item clickable v-ripple v-for="siswa in siswas" :key="siswa.id" @click="editData(siswa)">
        <q-item-section avatar>
          <q-icon color="primary" name="bluetooth" />
        </q-item-section>
        <q-item-section>{{ siswa.nama }}</q-item-section>
      </q-item>
    </q-list>
    <q-dialog v-model="formSiswa.show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Edit Siswa</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="editSiswa.id" label="Id" readonly/>
          <q-input v-model="editSiswa.nama" label="Nama" />
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" v-close-popup @click="saveData"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style>
</style>

<script>

export default {
  name: 'PageStudentIndex',
  data: () => ({
    formSiswa: {
      show: false,
      isNew: true
    },
    siswas: [],
    editSiswa: {
      id: null,
      nama: null
    }
  }),
  firestore () {
    return {
      siswas: this.$db.collection('siswa')
    }
  },
  methods: {
    dataBaru () {
      this.formSiswa = {
        show: true,
        isNew: true
      }
      this.editSiswa = {
        id: '[Auto]',
        nama: null
      }
    },
    editData (siswa) {
      this.formSiswa = {
        show: true,
        isNew: false
      }
      this.editSiswa = {
        id: siswa.id,
        nama: siswa.nama
      }
    },
    saveData () {
      if (this.formSiswa.isNew) {
        this.$firestoreRefs.siswas.add({
          nama: this.editSiswa.nama
        })
      } else {
        this.$firestoreRefs.siswas.doc(this.editSiswa.id).update({
          nama: this.editSiswa.nama
        })
      }
    }
  }
}
</script>
