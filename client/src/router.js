import Vue from 'vue'
import Router from 'vue-router'
import { store } from './store/store'
// views
import Home from './views/Home'
//import QueryResults from './components/Home/QueryResults/QueryResults'
import Login from './views/Login'
import SingleResult from './views/SingleResult'
import RenderResults from './views/RenderResults'
// UserPanel & children
import UserPanel from './views/UserPanel'
import UserRecipes from './components/UserPanel/UserRecipes'
import CreateRecipe from './components/UserPanel/CreateRecipe'
import SavedRecipes from './components/UserPanel/SavedRecipes'
// AdminPanel & children
import AdminPanel from './views/AdminPanel'
import Overview from './components/AdminPanel/Overview'
import AdminUsers from './components/AdminPanel/AdminUsers'
import AdminRecipes from './components/AdminPanel/AdminRecipes'
import AdminComments from './components/AdminPanel/AdminComments'
import ErrorPage from './views/ErrorPage'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },

  routes: [
    {
      path: '',
      name: 'home',
      component: Home
    },
    {
      path: '/userpanel',
      name: 'userpanel',
      component: UserPanel,
      children: [
        {
          path: '/userpanel/user_recipes',
          name: 'user_recipes',
          component: UserRecipes
        },
        {
          path: '/userpanel/create_recipe',
          name: 'create_recipe',
          component: CreateRecipe
        },
        {
          path: '/userpanel/saved_recipes',
          name: 'saved_recipes',
          component: SavedRecipes
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/adminpanel',
      component: AdminPanel,
      children: [
        {
          path: '',
          name: 'overview',
          component: Overview
        },
        {
          path: '/adminpanel/admin_users',
          name: 'admin_users',
          component: AdminUsers
        },
        {
          path: '/adminpanel/admin_recipes',
          name: 'admin_recipes',
          component: AdminRecipes
        },
        {
          path: '/adminpanel/admin_comments',
          name: 'admin_comments',
          component: AdminComments
        }
      ],
      meta: {
        requiresAdmin: true,
        //requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter(to, from, next) {
        // check status, if logged in can't go to login page before logout
        if (store.getters['getIsLogged'] == false) {
          next()
        } else {
          next({
            name: 'home'
          })
        }
      }
    },
    {
      path: '/SingleResult/:id',
      name: 'SingleResult',
      component: SingleResult,
      props: true
    },
    {
      path: '/render_results',
      name: 'render_results',
      component: RenderResults
    },
    {
      path: '/error404',
      name: 'error404',
      component: ErrorPage
    },
    {
      path: '*',
      component: ErrorPage 
    }
  ]
})

// guard for private routes - only for logged in user or admin
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters['getIsLogged'] == false) {
      //if(store.getters['getCurrentUser'] == null){
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (
      store.getters['getCurrentUser'] != null &&
      store.getters['getCurrentUser'].isAdmin == true
    ) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else next()
})
export default router
