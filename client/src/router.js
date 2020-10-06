import Vue from 'vue'
import Router from 'vue-router'
import { store } from './store/store'
import Home from './views/Home'

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
      component: Home,
      meta: {
        showSearch: true
      }
    },
    {
      path: '/userpanel',
      component: () =>
        import(/* webpackChunkName: "userpanel" */ './views/UserPanel.vue'),
      children: [
        {
          path: '',
          name: 'user_profile',
          component: () =>
            import(
              /* webpackChunkName: "userprofile" */ './components/UserPanel/UserProfile.vue'
            )
        },
        {
          path: '/userpanel/user_recipes',
          name: 'user_recipes',
          component: () =>
            import(
              /* webpackChunkName: "userrecipes" */ './components/UserPanel/UserRecipes.vue'
            )
        },
        {
          path: '/userpanel/create_recipe',
          name: 'create_recipe',
          component: () =>
            import(
              /* webpackChunkName: "createrecipe" */ './components/UserPanel/CreateRecipe.vue'
            )
        },
        {
          path: '/userpanel/saved_recipes',
          name: 'saved_recipes',
          component: () =>
            import(
              /* webpackChunkName: "savedrecipes" */ './components/UserPanel/SavedRecipes.vue'
            )
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/adminpanel',
      component: () =>
        import(/* webpackChunkName: "adminpanel" */ './views/AdminPanel.vue'),
      children: [
        {
          path: '',
          name: 'overview',
          component: () =>
            import(
              /* webpackChunkName: "overview" */ './components/AdminPanel/Overview.vue'
            )
        },
        {
          path: '/adminpanel/admin_users',
          name: 'admin_users',
          component: () =>
            import(
              /* webpackChunkName: "adminusers" */ './components/AdminPanel/AdminUsers.vue'
            )
        },
        {
          path: '/adminpanel/admin_recipes',
          name: 'admin_recipes',
          component: () =>
            import(
              /* webpackChunkName: "adminrecipes" */ './components/AdminPanel/AdminRecipes.vue'
            )
        },
        {
          path: '/adminpanel/admin_comments',
          name: 'admin_comments',
          component: () =>
            import(
              /* webpackChunkName: "admincomments" */ './components/AdminPanel/AdminComments.vue'
            )
        }
      ],
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import(/* webpackChunkName: "login" */ './views/Login.vue'),
      beforeEnter(to, from, next) {
        // check status, if logged in can't go to login page
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
      component: () =>
        import(
          /* webpackChunkName: "singleresult" */ './views/SingleResult.vue'
        ),
      props: true
    },
    {
      path: '/render_results',
      name: 'render_results',
      component: () =>
        import(
          /* webpackChunkName: "renderresults" */ './views/RenderResults.vue'
        ),
      meta: {
        showSearch: true
      }
    },
    {
      path: '/error404',
      name: 'error404',
      component: () =>
        import(/* webpackChunkName: "errorpage" */ './views/ErrorPage.vue')
    },
    {
      path: '*',
      component: () =>
        import(/* webpackChunkName: "errorpage" */ './views/ErrorPage.vue')
    }
  ]
})

// guard for private routes - only for logged in user or admin
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem('userToken') == null) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      let user = JSON.parse(localStorage.getItem('vuex'))
      if (to.matched.some((record) => record.meta.requiresAdmin)) {
        if (user.currentUser.currentUser.isAdmin == true) {
          next()
        } else {
          next({ name: 'home' })
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
