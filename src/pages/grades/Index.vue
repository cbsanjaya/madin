<template>
  <q-page padding>
    <q-table
      :data="grades"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[]"
      :loading="loading"
      :filter="filter"
      binary-state-sort
    >
      <template v-slot:top-left>
        <div class="text-h4">Daftar Kelas</div>
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
              color="green"
              icon="visibility"
              label="Siswa"
              rounded
              @click="showStudents(props.row.id)"
            />
            <q-btn
              size="sm"
              color="purple"
              icon="visibility"
              label="Pelajaran"
              rounded
              @click="showLessons(props.row.id)"
            />
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

    <q-dialog v-model="formGrade.show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Edit Kelas</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="editGrade.name" label="Kelas" autofocus/>
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
  name: 'PageGradeIndex',
  data: () => ({
    filter: '',
    loading: false,
    columns: [
      { name: 'name', label: 'Kelas', field: 'name', align: 'left' },
      { name: 'aksi', label: 'Aksi', align: 'center' }
    ],
    formGrade: {
      show: false,
      isNew: true
    },
    grades: [],
    gradeId: null,
    editGrade: {}
  }),
  firestore () {
    return {
      grades: this.$db.collection('grades')
    }
  },
  methods: {
    newData () {
      this.formGrade = {
        show: true,
        isNew: true
      }
      this.editGrade = {
        name: null
      }
    },
    editData (grade) {
      this.formGrade = {
        show: true,
        isNew: false
      }
      this.gradeId = grade.id
      this.editGrade = {
        name: grade.name
      }
    },
    saveData () {
      if (this.formGrade.isNew) {
        this.$firestoreRefs.grades.add(this.editGrade)
      } else {
        this.$firestoreRefs.grades.doc(this.gradeId).update(this.editGrade)
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
        this.$firestoreRefs.grades.doc(id).delete()
      })
    },
    showStudents (gradeId) {
      this.$router.push({ path: `/grades/${gradeId}/students` })
    },
    showLessons (gradeId) {
      this.$router.push({ path: `/grades/${gradeId}/lessons` })
    }
  }
}
</script>
