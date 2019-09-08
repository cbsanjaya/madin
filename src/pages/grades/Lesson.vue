<template>
  <q-page padding>
    <q-table
      title="Siswa"
      :data="lessons"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[]"
      :loading="loading"
      binary-state-sort
    >
      <template v-slot:top-left>
        <div class="text-h4">Daftar Pelajaran Kelas {{ grade ? grade.name : '' }} Tahun Ajaran {{ getActivePeriod }} H</div>
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
              label="Nilai"
              rounded
              @click="showScores(props.row.id)"
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

    <q-dialog v-model="formLesson.show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Edit Pelajaran</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="editLesson.name" label="Pelajaran" autofocus/>
          <q-input v-model="editLesson.book" label="Kitab" />
          <q-input v-model="editLesson.day" label="Hari" />
          <q-input v-model="editLesson.semester" label="Smester" />
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
  name: 'PageLessonIndex',
  data: () => ({
    grade: null,
    loading: false,
    columns: [
      { name: 'name', label: 'Pelajaran', field: 'name', align: 'left' },
      { name: 'book', label: 'Kitab', field: 'book', align: 'left' },
      { name: 'day', label: 'Hari', field: 'day', align: 'left' },
      { name: 'semester', label: 'Semester', field: 'semester', align: 'left' },
      { name: 'aksi', label: 'Aksi', align: 'center' }
    ],
    formLesson: {
      show: false,
      isNew: true
    },
    lessons: [],
    lessonId: null,
    editLesson: {}
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
        this.$bind('lessons', this.$db.collection('lessons')
          .where('grade', '==', this.$route.params.gradeId)
          .where('period', '==', id)
        )
      }
    }
  },
  firestore () {
    return {
      grade: this.$db.doc(`/grades/${this.$route.params.gradeId}`)
    }
  },
  methods: {
    newData () {
      this.formLesson = {
        show: true,
        isNew: true
      }
      this.editLesson = {
        grade: this.grade.id,
        period: this.getActivePeriod,
        name: null,
        book: null,
        day: null,
        semester: null
      }
    },
    editData (lesson) {
      this.formLesson = {
        show: true,
        isNew: false
      }
      this.lessonId = lesson.id
      this.editLesson = {
        grade: this.grade.id,
        period: this.getActivePeriod,
        name: lesson.name,
        book: lesson.book,
        day: lesson.day,
        semester: lesson.semester
      }
    },
    saveData () {
      if (this.formLesson.isNew) {
        this.$db.collection('lessons').add(this.editLesson)
      } else {
        this.$db.collection('lessons').doc(this.lessonId).update(this.editLesson)
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
        this.$firestoreRefs.lessons.doc(id).delete()
      })
    },
    showScores (lessonId) {
      this.$router.push({ path: `/grades/${this.grade.id}/lessons/${lessonId}/scores` })
    }
  }
}
</script>
