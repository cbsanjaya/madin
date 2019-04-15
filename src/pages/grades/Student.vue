<template>
  <q-page padding>
    <q-table
      title="Siswa"
      :data="gradeStudents"
      :columns="columns"
      row-key="id"
      selection="multiple"
      :selected.sync="selected"
    >
      <template v-slot:top-left>
        <div class="text-h4">Daftar Siswa Kelas {{ grade ? grade.nama : '' }}</div>
      </template>

      <template v-slot:top-right>
        <q-btn-group rounded>
          <q-btn
            rounded
            label="Baru"
            color="secondary"
            icon="add"
            @click="newData"
          />
          <q-btn
            rounded
            label="Hapus"
            color="negative"
            icon="delete"
            @click="deleteData"
            :disable="selected.length === 0"
          />
        </q-btn-group>
      </template>

      <template v-slot:bottom :pagination="null"/>

    </q-table>

    <q-dialog v-model="showForm">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Tambah Siswa ke Kelas</div>
        </q-card-section>

        <q-card-section style="margin-bottom: 300px">
          <q-select
            v-model="newStudent"
            label="Nama Siswa"
            :options="students"
            option-value="id"
            option-label="nama"
            emit-value
            map-options
          />
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
  name: 'PageGradeStudent',
  data: () => ({
    selected: [],
    columns: [
      { name: 'induk', label: 'Induk', field: 'induk', align: 'left' },
      { name: 'nama', label: 'Nama', field: 'nama', align: 'left' },
      { name: 'kamar', label: 'Kamar', field: 'kamar', align: 'left' }
    ],
    showForm: false,
    students: [],
    studentId: null,
    newStudent: null,
    grade: null,
    gradeRef: null
  }),
  computed: {
    gradeStudents: function () {
      return this.students.filter(student => {
        if (student.grades) {
          for (let i in student.grades) {
            if (student.grades[i].id === this.grade.id) {
              return true
            }
          }
        }
        return false
      })
    }
  },
  created () {
    let gradeId = this.$route.params.gradeId
    this.gradeRef = this.$db.doc(`/grades/${gradeId}`)
    this.$bind('grade', this.gradeRef)
    this.$bind('students', this.$db.collection('students').orderBy('nama'))
  },
  methods: {
    newData () {
      this.showForm = true
      this.newStudent = null
    },
    saveData () {
      this.$db.doc(`/students/${this.newStudent}`)
        .update({ grades: this.$firebase.firestore.FieldValue.arrayUnion(this.gradeRef) })
    },
    deleteData () {
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
        for (let i in this.selected) {
          this.$db.doc(`/students/${this.selected[i].id}`)
            .update({ grades: this.$firebase.firestore.FieldValue.arrayRemove(this.gradeRef) })
        }
      })
    }
  }
}
</script>
