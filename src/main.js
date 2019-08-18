import Vue from 'vue'
import VueRouter from 'vue-router'
import './plugins/vuetify'
import App from './App.vue'
import store from './stores/store'

import ListPage from './components/ListPage.vue'
import LoginPage from './components/LoginPage.vue'


import { library } from '@fortawesome/fontawesome-svg-core'
import { faBrain } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueClipboard from 'vue-clipboard2'
import vuetify from './plugins/vuetify';

// vueclipboard
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

//fafont
library.add(faBrain)
Vue.component('font-awesome-icon', FontAwesomeIcon)

//router
Vue.use(VueRouter)
Vue.config.productionTip = false
const routes = [
  { path: '/list/:uuid', component: ListPage },
  { path: '/login', component: LoginPage }
];
const router = new VueRouter({
  routes  
})


new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

