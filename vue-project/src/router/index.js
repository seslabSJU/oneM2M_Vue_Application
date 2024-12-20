import { createRouter, createWebHistory } from 'vue-router'
import Create from '../views/CreateResource.vue'
import Retrieve from '../views/RetrieveResource.vue'
import Update from '../views/UpdateResource.vue'
import Delete from '../views/DeleteResource.vue'
import NotifyPage from '../views/NotifyPage.vue'
const routes = [
  {
    path: '/',
    redirect: '/create'
  },
  {
    path: '/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/retrieve',
    name: 'Retrieve',
    component: Retrieve
  },
  {
    path: '/update',
    name: 'Update',
    component: Update
  },
  {
    path: '/delete',
    name: 'Delete',
    component: Delete
  },
  {
    path: '/notifications',
    name: 'Notfiy',
    component: NotifyPage
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router