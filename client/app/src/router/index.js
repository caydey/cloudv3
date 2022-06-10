import { createRouter, createWebHistory } from 'vue-router'
import ExploreView from '../views/ExploreView.vue'

const routes = [
  {
    path: '/explore/:all*',
    name: 'explore',
    component: ExploreView
  },
  {
    path: '/:all*',
    redirect: '/explore',
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
