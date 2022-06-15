import { createRouter, createWebHistory } from 'vue-router'
import ExploreView from '../views/ExploreView.vue'

const routes = [
  {
    path: '/explore/:pathMatch(.*)*',
    name: 'explore',
    component: ExploreView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/explore'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
