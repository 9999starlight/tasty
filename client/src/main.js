import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
// font awesome imports:
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faChevronCircleRight,
  faChevronCircleLeft,
  //faWindowClose,
  //faTrashAlt,
  //faHandPointUp,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  //faSearch
} from '@fortawesome/free-solid-svg-icons'
/* import {
  faUser
} from '@fortawesome/free-regular-svg-icons' */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUser, faSignOutAlt, faSignInAlt, faAngleDoubleLeft, faAngleDoubleRight,   faChevronCircleRight, faChevronCircleLeft,)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  axios,
  render: h => h(App),
}).$mount('#app')
