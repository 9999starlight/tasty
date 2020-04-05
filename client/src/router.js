import Vue from 'vue'
import Router from 'vue-router'
import {
    store
} from './store/store'
// views
import Home from './views/Home'
import Browse from './views/Browse'
import FoodFacts from './views/FoodFacts'
import UserPanel from './views/UserPanel'
import Login from './views/Login'
import Wines from './views/Wines'
import SingleResult from './views/SingleResult'

Vue.use(Router)

let router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '',
            name: 'home',
            component: Home
        },
        {
            path: '/browse',
            name: 'browse',
            component: Browse
        },
        {
            path: '/foodfacts',
            name: 'foodfacts',
            component: FoodFacts
        },
        {
            path: '/userpanel',
            name: 'userpanel',
            component: UserPanel
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            beforeEnter(to, from, next) {
                // check status, if logged in can't go to login page before logout
                if (!store.getters["getIsLogged"]) {
                    next()
                } else {
                    next({
                        name: "home"
                    });
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
        {
            path: '*',
            redirect: {
                name: 'home'
            }
        }
    ]
})

export default router