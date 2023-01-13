import Vue from 'vue'
import VueRouter from 'vue-router'
import StorageTable from '@/components/StorageTable.vue'
import LoginPage from "@/components/LoginPage.vue";
import RedactProduct from "@/components/RedactProduct.vue";
import RedactStorage from "@/components/RedactStorage.vue";
import ProductTable from "@/components/ProductTable.vue";

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/loginpage'
  },
  {
    path: '/storageTable',
    name: 'storageTable',
    component: StorageTable
  },
  {
    path: '/loginPage',
    name: 'loginPage',
    component: LoginPage
  },
  {
    path: '/redactProduct',
    name: 'redactProduct',
    component: RedactProduct
  },
  {
    path: '/redactStorage',
    name: 'redactStorage',
    component: RedactStorage
  },
  {
    path: '/productTable',
    name: 'productTable',
    component: ProductTable
  }
]

const router = new VueRouter({
  routes
})

export default router
