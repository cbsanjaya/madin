<template>
  <q-page padding>
    <q-table
      :data="teachers"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[]"
      :loading="loading"
      :filter="filter"
      binary-state-sort
    >
      <template v-slot:top-left>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:top-right>
        <q-btn
          label="Baru"
          color="secondary"
          @click="newData"
          icon="add"
        />
      </template>

      <template v-slot:body-cell-aksi="props">
        <q-td :props="props">
          <q-btn-group rounded>
            <q-btn
              size="sm"
              color="primary"
              icon="edit"
              rounded
              @click="editData(props.row)"
            />
            <q-btn
              size="sm"
              color="negative"
              icon="delete"
              rounded
              @click="deleteData(props.row.id)"
            />
          </q-btn-group>
        </q-td>
      </template>

      <template v-slot:bottom :pagination="null"/>

    </q-table>

    <q-dialog v-model="formTeacher.show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Edit Guru</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="editTeacher.idn" label="Induk" autofocus/>
          <q-input v-model="editTeacher.name" label="Nama" />
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

<script>

export default {
  name: 'PageTeacherIndex',
  data: () => ({
    filter: '',
    loading: false,
    columns: [
      { name: 'idn', label: 'Induk', field: 'idn', align: 'left' },
      { name: 'name', label: 'Nama', field: 'name', align: 'left' },
      { name: 'aksi', label: 'Aksi', align: 'center' }
    ],
    formTeacher: {
      show: false,
      isNew: true
    },
    teachers: [],
    teacherId: null,
    editTeacher: {}
  }),
  firestore () {
    return {
      teachers: this.$db.collection('teachers')
    }
  },
  methods: {
    newData () {
      this.formTeacher = {
        show: true,
        isNew: true
      }
      this.editTeacher = {
        idn: null,
        name: null
      }
    },
    editData (teacher) {
      this.formTeacher = {
        show: true,
        isNew: false
      }
      this.teacherId = teacher.id
      this.editTeacher = {
        idn: teacher.induk,
        name: teacher.name
      }
    },
    saveData () {
      if (this.formTeacher.isNew) {
        this.$firestoreRefs.teachers.add(this.editTeacher)
      } else {
        this.$firestoreRefs.teachers.doc(this.teacherId).update(this.editTeacher)
      }
    },
    deleteData (id) {
      this.$q.dialog({
        title: 'Konfirmasi',
        message: 'Apa Benar Anda Akan Menghapus Data ini?',
        ok: {
          push: true
        },
        cancel: {
          color: 'negative'
        },
        persistent: true
      }).onOk(() => {
        this.$firestoreRefs.teachers.doc(id).delete()
      })
    }
  }
}
</script>
