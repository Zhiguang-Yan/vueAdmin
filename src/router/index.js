import Vue from 'vue'
import Router from 'vue-router'
<<<<<<< HEAD
const Login = () => import('@/components/login/login')

const Home = () => import('@/components/home/home')

const Users = () => import('@/components/users/users')

const Permission = () => import('@/components/permission/permission')

const RoleList = () => import('@/components/roleList/roleList')

const GoodList = () => import('@/components/goodList/goodList')

const AddGood = () => import('@/components/addGood/addGood')

const Cateparams = () => import('@/components/cateparams/cateparams')

const Categories = () => import('@/components/categories/categories')

const OrderList = () => import('@/components/orderList/orderList')

const DataReport = () => import('@/components/dataReport/dataReport')

=======
// import HelloWorld from '@/components/HelloWorld'
>>>>>>> 63ce83caa3953e8d0ad7b456bd8277e8972029f7
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: 'users',
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/permission',
          name: 'permission',
          component: Permission
        },
        {
          path: '/roleList',
          name: 'roleList',
          component: RoleList
        },
        {
          path: '/goodList',
          name: 'goodList',
          component: GoodList
        },
        {
          path: '/addGood',
          name: 'addGood',
          component: AddGood
        },
        {
          path: '/cateparams',
          name: 'cateparams',
          component: Cateparams
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/orderList',
          name: 'orderList',
          component: OrderList
        },
        {
          path: '/dataReport',
          name: 'dataReport',
          component: DataReport
        }
      ]
    }
  ]
})
