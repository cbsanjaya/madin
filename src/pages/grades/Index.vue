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

      <template v-slot:body-cell-guru="props">
        <q-td :props="props">
          {{ props.row.guru.nama || '' }}
        </q-td>
      </template>

      <template v-slot:body-cell-aksi="props">
        <q-td :props="props">
          <q-btn-group rounded>
            <q-btn
              size="sm"
              color="green"
              icon="visibility"
              rounded
              @click="showDetails(props.row)"
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

      <template v-slot:pagination>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

    </q-table>

    <q-dialog v-model="formGrade.show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Edit Kelas</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="editGrade.nama" label="Nama" autofocus/>
          <q-input v-model="editGrade.tahun" label="Tahun" type="number"/>
          <q-select
            v-model="editGrade.guru"
            label="Guru"
            :options="teachers"
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
  name: 'PageGradeIndex',
  data: () => ({
    filter: '',
    loading: false,
    columns: [
      { name: 'nama', label: 'Nama', field: 'nama', align: 'left' },
      { name: 'tahun', label: 'Tahun', field: 'tahun', align: 'left' },
      { name: 'guru', label: 'Guru', align: 'left' },
      { name: 'aksi', label: 'Aksi', align: 'center' }
    ],
    formGrade: {
      show: false,
      isNew: true
    },
    grades: [],
    gradeId: null,
    editGrade: {},
    teachers: []
  }),
  firestore () {
    return {
      grades: this.$db.collection('grades'),
      teachers: this.$db.collection('teachers')
    }
  },
  methods: {
    newData () {
      this.formGrade = {
        show: true,
        isNew: true
      }
      this.editGrade = {
        nama: null,
        tahun: null,
        guru: null
      }
    },
    editData (grade) {
      this.formGrade = {
        show: true,
        isNew: false
      }
      this.gradeId = grade.id
      this.editGrade = {
        nama: grade.nama,
        tahun: grade.tahun,
        guru: grade.guru.id
      }
    },
    saveData () {
      this.editGrade.guru = this.$db.collection('teachers').doc(this.editGrade.guru)
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
    showDetails (grade) {

    }
  }
}
</script>
