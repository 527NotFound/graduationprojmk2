import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../components/MainPage.vue'
import PanoramaViewer from '../components/PanoramaViewer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPage
    },
    {
      path: '/panorama',
      name: 'panorama',
      component: PanoramaViewer
    }
  ]
})

export default router 