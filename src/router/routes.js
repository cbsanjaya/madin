
function authorize (name, routes) {
  routes.forEach(route =>
    (route.authorize || (route.authorize = [])).unshift(name)
  )

  return routes
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), meta: { title: 'Dasboad' } },
      ...authorize('admin', [
        { path: 'students', component: () => import('pages/students/Index.vue'), meta: { title: 'Daftar Siswa' } },
        { path: 'teachers', component: () => import('pages/teachers/Index.vue'), meta: { title: 'Daftar Guru' } },
        { path: 'grades', component: () => import('pages/grades/Index.vue'), meta: { title: 'Daftar Kelas' } },
        { path: 'grades/:gradeId/lessons', component: () => import('pages/grades/Lesson.vue'), meta: { title: 'Daftar Pelajaran per Kelas' } },
        { path: 'grades/:gradeId/lessons/:lessonId/scores', component: () => import('pages/grades/LessonScore.vue'), meta: { title: 'Daftar Nilai Pelajaran' } },
        { path: 'grades/:gradeId/students', component: () => import('pages/grades/Student.vue'), meta: { title: 'Daftar Siswa per Kelas' } },
        { path: 'grades/:gradeId/students/:studentId/scores', component: () => import('pages/grades/StudentScore.vue'), meta: { title: 'Daftar Nilai Siswa' } }
      ])
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/auth/Login.vue') }
    ]
  },
  {
    path: '/oops',
    component: () => import('pages/Error404.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
