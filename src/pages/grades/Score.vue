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

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="idn" :props="props">{{ props.row.idn }}</q-td>
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
          <q-td key="score" :props="props">
            {{ props.row.score }}
            <q-popup-edit v-model="editScore" @hide="editScore = ''" @save="setScore(props.row.id)" title="Update Nilai" buttons>
              <q-input type="number" v-model="editScore" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="aksi" :props="props">
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
        </q-tr>
      </template>

      <template v-slot:bottom :pagination="null"/>

    </q-table>

  </q-page>
</template>

<script>

export default {
  name: 'PageScoreIndex',
  data: () => ({
    grade: null,
    lesson: null,
    students: [],
    loading: false,
    columns: [
      { name: 'idn', label: 'Induk', field: 'idn', align: 'left' },
      { name: 'name', label: 'Nama', field: 'name', align: 'left' },
      { name: 'score', label: 'Nilai', field: 'score', align: 'left' },
      { name: 'aksi', label: 'Aksi', align: 'center' }
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
    getStudentScores () {
      return this.students.map(item => {
        let findScore = this.scores.find(sc => sc.student === item.student.id)
        let newItem = {
          id: item.student.id,
          idn: item.student.idn,
          name: item.student.name,
          score: findScore ? findScore.score : 0
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
    setScore (studentId) {
      this.$db.collection('scores').doc(`${studentId}_${this.lesson.id}`).set({
        lesson: this.lesson.id,
        student: studentId,
        score: Number(this.editScore)
      })
    }
  }
}
</script>
