import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/desa/:id',
    name: 'Desa',
    component: () => import('../views/Desa.vue'),
    props: true
  },
  {
    path: '/kecamatan/:id',
    name: 'Kecamatan',
    component: () => import('../views/Kecamatan.vue'),
    props: true
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    props: true
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/Help.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
