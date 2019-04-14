<template>
  <q-page padding>
    <q-table
      title="Siswa"
      :data="students"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[]"
      :loading="loading"
      :filter="filter"
      binary-state-sort
    >
      <template v-slot:top-left>
        <q-btn
          label="Baru"
          color="secondary"
          @click="newData"
          icon="add"
        />
      </template>

      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
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

      <template v-slot:pagination>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

    </q-table>

    <q-dialog v-model="formStudent.show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Edit Siswa</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="editStudent.induk" label="Induk" autofocus/>
          <q-input v-model="editStudent.nama" label="Nama" />
          <q-input v-model="editStudent.kamar" label="Kamar" />
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
  name: 'PageStudentIndex',
  data: () => ({
    filter: '',
    loading: false,
    columns: [
      { name: 'induk', label: 'Induk', field: 'induk', align: 'left' },
      { name: 'nama', label: 'Nama', field: 'nama', align: 'left' },
      { name: 'kamar', label: 'Kamar', field: 'kamar', align: 'left' },
      { name: 'aksi', label: 'Aksi', align: 'center' }
    ],
    formStudent: {
      show: false,
      isNew: true
    },
    students: [],
    studentId: null,
    editStudent: {}
  }),
  firestore () {
    return {
      students: this.$db.collection('students')
    }
  },
  methods: {
    newData () {
      this.formStudent = {
        show: true,
        isNew: true
      }
      this.editStudent = {
        induk: null,
        nama: null,
        kamar: null
      }
    },
    editData (student) {
      this.formStudent = {
        show: true,
        isNew: false
      }
      this.studentId = student.id
      this.editStudent = {
        induk: student.induk,
        nama: student.nama,
        kamar: student.kamar
      }
    },
    saveData () {
      if (this.formStudent.isNew) {
        this.$firestoreRefs.students.add(this.editStudent)
      } else {
        this.$firestoreRefs.students.doc(this.studentId).update(this.editStudent)
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
        this.$firestoreRefs.students.doc(id).delete()
      })
    }
  }
}
</script>
