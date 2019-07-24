import Vue from 'vue'
import VueRouter from 'vue-router'
import './plugins/vuetify'
import App from './App.vue'

import ListPage from './components/ListPage.vue'
import LoginPage from './components/LoginPage.vue'


import { library } from '@fortawesome/fontawesome-svg-core'
import { faBrain } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'



library.add(faBrain)

Vue.component('font-awesome-icon', FontAwesomeIcon)


Vue.use(VueRouter)

Vue.config.productionTip = false


const routes = [
  { path: '/list/:id', component: ListPage },
  { path: '/login', component: LoginPage }
]
 
const router = new VueRouter({
  routes  
})


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

