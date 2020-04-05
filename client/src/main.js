import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  store
} from './store/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
// font awesome imports:
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faChevronCircleRight,
  faChevronCircleLeft,
  faUsers,
  //faWindowClose,
  //faTrashAlt,
  //faHandPointUp,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faWeight
  //faSearch
} from '@fortawesome/free-solid-svg-icons'
import {
  faClock
} from '@fortawesome/free-regular-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
library.add(faUser, faSignOutAlt, faSignInAlt, faChevronCircleRight, faChevronCircleLeft, faUsers, faClock, faWeight)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
/* const token = localStorage.getItem('user-token')
if (token) {
  axios.defaults.headers.common['Authorization'] = token
} */
new Vue({
  store,
  router,
  axios,
  render: h => h(App),
}).$mount('#app')