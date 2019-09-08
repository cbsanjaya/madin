<template>
  <q-page padding>
    <q-table
      title="Siswa"
      :data="getLessonScores"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[]"
      :loading="loading"
      binary-state-sort
    >
      <template v-slot:top-left>
        <div class="text-h4">{{ getTitle }}</div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="idn" :props="props">{{ props.row.idn }}</q-td>
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
          <q-td key="read" :props="props" class="cursor-pointer">
            {{ props.row.score.read }}
            <q-popup-edit v-model="editScore" @hide="editScore = ''" @save="setScore(props.row.id, 'read')" title="Update Nilai" buttons>
              <q-input type="number" v-model="editScore" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="quiz" :props="props" class="cursor-pointer">
            {{ props.row.score.quiz }}
            <q-popup-edit v-model="editScore" @hide="editScore = ''" @save="setScore(props.row.id, 'quiz')" title="Update Nilai" buttons>
              <q-input type="number" v-model="editScore" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="examp" :props="props" class="cursor-pointer">
            {{ props.row.score.examp }}
            <q-popup-edit v-model="editScore" @hide="editScore = ''" @save="setScore(props.row.id, 'examp')" title="Update Nilai" buttons>
              <q-input type="number" v-model="editScore" dense autofocus />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom :pagination="null"/>

    </q-table>

  </q-page>
</template>

<script>

export default {
  name: 'PageLessonScoreIndex',
  data: () => ({
    grade: null,
    lesson: null,
    students: [],
    loading: false,
    columns: [
      { name: 'idn', label: 'Induk', field: 'idn', align: 'left' },
      { name: 'name', label: 'Nama', field: 'name', align: 'left' },
      { name: 'read', label: 'Syafahi', field: row => row.score.read, align: 'left' },
      { name: 'quiz', label: 'Tugas', field: row => row.score.quiz, align: 'left' },
      { name: 'examp', label: 'Ujian', field: row => row.score.examp, align: 'left' }
    ],
    scores: [],
    editScore: ''
  }),
  computed: {
    getTitle () {
      if (this.lesson && this.grade) {
        return `Daftar Nilai ${this.lesson.name} Kelas ${this.grade.name} (${this.lesson.period}-${this.lesson.semester})`
      }

      return ''
    },
    getLessonScores () {
      return this.students.map(item => {
        let findScore = this.scores.find(sc => sc.student === item.student.id)
        let newItem = {
          id: item.student.id,
          idn: item.student.idn,
          name: item.student.name,
          score: Object.assign({}, { read: 0, quiz: 0, examp: 0 }, findScore ? findScore.score : {})
        }

        return newItem
      })
    }
  },
  mounted () {
    this.$bind('grade', this.$db.doc(`/grades/${this.$route.params.gradeId}`))
    this.$bind('lesson', this.$db.doc(`/lessons/${this.$route.params.lessonId}`)).then(
      lesson => {
        this.$bind('students', this.$db.collection('grade_students')
          .where('grade', '==', this.$db.doc(`/grades/${this.$route.params.gradeId}`))
          .where('period', '==', lesson.period))

        this.$bind('scores', this.$db.collection('scores')
          .where('lesson', '==', lesson.id))
      }
    )
  },
  methods: {
    setScore (studentId, scorekey) {
      this.$db.collection('scores').doc(`${studentId}_${this.lesson.id}`).set({
        lesson: this.lesson.id,
        student: studentId,
        score: {
          [scorekey]: Number(this.editScore)
        }
      }, { merge: true })
    }
  }
}
</script>
