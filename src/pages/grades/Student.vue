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
        <div class="text-h4">Daftar Siswa Kelas {{ grade ? grade.name : '' }} Tahun Ajaran {{ getActivePeriod }} H</div>
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
            option-label="name"
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
import { mapGetters } from 'vuex'

export default {
  name: 'PageGradeStudent',
  data: () => ({
    selected: [],
    columns: [
      { name: 'induk', label: 'Induk', field: row => row.student.idn, align: 'left' },
      { name: 'nama', label: 'Nama', field: row => row.student.name, align: 'left' },
      { name: 'kamar', label: 'Kamar', field: row => row.student.room, align: 'left' }
    ],
    showForm: false,
    students: [],
    studentId: null,
    newStudent: null,
    grade: null,
    gradeStudents: null
  }),
  computed: {
    ...mapGetters('setting', [
      'getActivePeriod'
    ])
  },
  watch: {
    getActivePeriod: {
      immediate: true,
      handler (id) {
        this.$bind('gradeStudents',
          this.$db.collection('grade_students')
            .where('grade', '==', this.$db.doc(`/grades/${this.$route.params.gradeId}`))
            .where('period', '==', id)
        )
      }
    }
  },
  firestore () {
    return {
      grade: this.$db.doc(`/grades/${this.$route.params.gradeId}`),
      students: this.$db.collection('students')
    }
  },
  methods: {
    newData () {
      this.showForm = true
      this.newStudent = null
    },
    saveData () {
      let studentRef = this.$db.doc(`/students/${this.newStudent}`)
      this.$db.doc(`/grade_students/${this.grade.id}_${this.newStudent}`)
        .set({
          grade: this.$firestoreRefs.grade,
          student: studentRef,
          period: this.getActivePeriod
        })
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
          this.$db.collection('grade_students').doc(this.selected[i].id).delete()
        }
        this.selected = []
      })
    }
  }
}
</script>
