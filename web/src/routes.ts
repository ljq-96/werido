const routes = [
  {
    path: '/',
    component: '@/layouts',
    routes: [
      {
        path: '/manage',
        component: 'manage',
      },
    ],
  },
]

export default routes
