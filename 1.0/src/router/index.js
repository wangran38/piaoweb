import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '系统桌面', icon: 'dashboard' }
    }]
  },
  // {
  //   path: '/history',
  //   component: Layout,
  //   redirect: '/history',
  //   children: [{
  //     path: 'history',
  //     name: '首页',
  //     component: () => import('@/views/history'),
  //     meta: { title: '动物数据', icon: 'dashboard' }
  //   }]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

router.addRoutes(constantRoutes)

   // 动态路由 刷新页面重构路由数据
export const asyncRoutes = [
  { path: '*', redirect: '/404', hidden: true }
]

export default router
