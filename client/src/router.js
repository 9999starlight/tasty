import Vue from 'vue'
import Router from 'vue-router'
import { store } from './store/store'
// views
import Home from './views/Home'
import FoodFacts from './views/FoodFacts'
import UserPanel from './views/UserPanel'
import AdminPanel from './views/AdminPanel'
import Login from './views/Login'
import Wines from './views/Wines'
import SingleResult from './views/SingleResult'
import UserRecipes from './components/UserPanel/UserRecipes/UserRecipes'
import CreateRecipe from './components/UserPanel/CreateRecipe'
import SavedRecipes from './components/UserPanel/SavedRecipes'
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
      path: '/foodfacts',
      name: 'foodfacts',
      component: FoodFacts
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
      name: 'adminpanel',
      component: AdminPanel,
      meta: {
        requiresAdmin: true
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
      path: '/wines',
      name: 'wines',
      component: Wines
    },
    {
      path: '/SingleResult/:id',
      name: 'SingleResult',
      component: SingleResult,
      props: true
    },
    /*     {
      path: '/BrowseResults',
      name: 'BrowseResults',
      component: BrowseResults
    }, */
    {
      path: '/error404',
      name: 'error404',
      component: ErrorPage
    },
    {
      path: '*',
      redirect: {
        name: 'home'
      }
    }
  ]
})

// guard for private routes - only for logged in user or admin
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters['getIsLogged'] == false) {
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
        path: '/',
        query: { redirect: to.fullPath }
      })
    }
  } else next()
})
export default router
