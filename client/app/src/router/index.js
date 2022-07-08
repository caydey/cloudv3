import { createRouter, createWebHistory } from 'vue-router'
import ExploreView from '../views/ExploreView.vue'

import { EXPLORE_ROUTE_NAME } from '../config.js'

const routes = [
  {
    path: '/explore/:pathMatch(.*)*',
    name: EXPLORE_ROUTE_NAME,
    component: ExploreView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/' + EXPLORE_ROUTE_NAME
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
