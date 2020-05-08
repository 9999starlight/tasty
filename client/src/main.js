import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  store
} from './store/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// Font Awesome:
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faUsers,
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
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons'
import {
  faClock
} from '@fortawesome/free-regular-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
library.add(faUser, faSignOutAlt, faSignInAlt, faChevronCircleRight, faChevronCircleLeft, faUsers, faClock, faWeight, faUserShield, faChevronDown, faPlus, faTimes, faStar, faSearch, faHandPointUp, faCheck, faAngleDoubleLeft, faAngleDoubleRight, faTrashAlt, faEdit)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// vue-scrollto
let VueScrollTo = require('vue-scrollto')
Vue.use(VueScrollTo)

// set deafult Axios headers for current user's requests
const token = localStorage.getItem('userToken')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

Vue.config.productionTip = false

new Vue({
  store,
  router,
  axios,
  render: h => h(App),
}).$mount('#app')