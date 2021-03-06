import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import animationScroll from './directives/animationScroll'
Vue.use(VueAxios, axios)
Vue.directive('animationscroll', animationScroll)
import './styles/global.scss'

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
  faMinus,
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
  faHeartBroken,
  faInfoCircle
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
  faMinus,
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
  faHeartBroken,
  faInfoCircle
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
tokenSettings()

// response interceptor check for invalid/expired token
axios.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    if (
      localStorage.getItem('userToken') !== null &&
      error.response.status === 401 &&
      error.response.data.message === 'Unauthorized access or invalid token!'
    ) {
      // console.log(error.response)
      store.dispatch('logoutUser')
    }
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  axios,
  render: (h) => h(App)
}).$mount('#app')

