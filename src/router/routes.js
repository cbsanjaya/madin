
const routes = [
  {
    path: '/',
    component: () => import('layouts/DefaultLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), meta: { title: 'Dasboad' } },
      { path: 'students', component: () => import('pages/students/Index.vue'), meta: { title: 'Daftar Siswa' } },
      { path: 'teachers', component: () => import('pages/teachers/Index.vue'), meta: { title: 'Daftar Guru' } },
      { path: 'grades', component: () => import('pages/grades/Index.vue'), meta: { title: 'Daftar Kelas' } },
      { path: 'grades/:gradeId', component: () => import('pages/grades/Student.vue'), meta: { title: 'Daftar Siswa di Kelas' } }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/auth/Login.vue') }
    ]
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
