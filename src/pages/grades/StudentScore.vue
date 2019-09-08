<template>
  <q-page padding>
    <q-table
      title="Siswa"
      :data="getStudentScores"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[]"
      :loading="loading"
      binary-state-sort
    >
      <template v-slot:top-left>
        <div class="text-h4">{{ getTitle }}</div>
      </template>

      <template v-slot:bottom :pagination="null"/>

    </q-table>

  </q-page>
</template>

<script>

export default {
  name: 'PageStudentScoreIndex',
  data: () => ({
    grade: null,
    student: null,
    lessons: [],
    loading: false,
    columns: [
      { name: 'name', label: 'Pelajaran', field: 'name', align: 'left' },
      { name: 'semester', label: 'Semester', field: 'semester', align: 'left' },
      { name: 'read', label: 'Syafahi', field: row => row.score.read, align: 'left' },
      { name: 'quiz', label: 'Tugas', field: row => row.score.quiz, align: 'left' },
      { name: 'examp', label: 'Ujian', field: row => row.score.examp, align: 'left' }
    ],
    scores: []
  }),
  computed: {
    getTitle () {
      if (this.student && this.grade && this.lessons[0]) {
        return `Daftar Nilai ${this.student.name} Kelas ${this.grade.name} (${this.lessons[0].period})`
      }

      return ''
    },
    getStudentScores () {
      return this.lessons.map(item => {
        let findScore = this.scores.find(sc => sc.lesson === item.id)
        let newItem = {
          id: item.id,
          name: item.name,
          semester: item.semester,
          score: Object.assign({}, { read: 0, quiz: 0, examp: 0 }, findScore ? findScore.score : {})
        }

        return newItem
      })
    }
  },
  mounted () {
    this.$bind('student', this.$db.doc(`/students/${this.$route.params.studentId}`)).then(
      student => {
        this.$bind('scores', this.$db.collection('scores')
          .where('student', '==', student.id))
      }
    )

    this.$bind('grade', this.$db.doc(`/grades/${this.$route.params.gradeId}`)).then(
      grade => {
        this.$bind('lessons', this.$db.collection('lessons')
          .where('grade', '==', grade.id))
      }
    )
  }
}
</script>
