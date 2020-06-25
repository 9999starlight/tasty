import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// Font Awesome:
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faUsers,
  faUserSlash,
  faTrashAlt,
  faEdit,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faWeight,
  faUserShield,
  faChevronDown,
  faPlus,
  faTimes,
  faStar,
  faSearch,
  faHandPointUp,
  faCheck,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faArrowUp,
  faArrowDown,
  faLock,
  faBook,
  faHeart,
  faHeartBroken
} from '@fortawesome/free-solid-svg-icons'
import {
  faClock,
  faComments,
  faChartBar
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faChevronCircleRight,
  faChevronCircleLeft,
  faUsers,
  faUserSlash,
  faClock,
  faWeight,
  faUserShield,
  faChevronDown,
  faPlus,
  faTimes,
  faStar,
  faSearch,
  faHandPointUp,
  faCheck,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faArrowUp,
  faArrowDown,
  faTrashAlt,
  faEdit,
  faLock,
  faComments,
  faBook,
  faChartBar,
  faHeart,
  faUserSlash,
  faHeartBroken
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// vue-scrollto
let VueScrollTo = require('vue-scrollto')
Vue.use(VueScrollTo)

// set deafult Axios headers for current user's requests
function tokenSettings() {
  const token = localStorage.getItem('userToken')
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

// if token expires redirect to login page before reqest to server
axios.interceptors.request.use(
  function (config) {
    if (
      localStorage.getItem('userToken') != null &&
      (store.state.currentUser.currentUser.exp - Date.now() / 1000) <= 0
    ) {
      // console.log(config)
      store.dispatch('logoutUser')
      router.push('/login')
    }
    return config
  },
  function(error) {
    console.log(error)
    return Promise.reject(error.message)
  }
)

// response interceptor
/* axios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    if (
      localStorage.getItem('userToken') != null &&
      error.response.status === 401
    ) {
      // console.log(error.response.data.message)
      store.dispatch('logoutUser')
      router.push('/login')
    }

    return Promise.reject(error)
  }
) */
//
Vue.config.productionTip = false

new Vue({
  store,
  router,
  axios,
  render: (h) => h(App)
}).$mount('#app')
tokenSettings()
