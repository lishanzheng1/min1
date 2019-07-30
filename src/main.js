import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import {routes} from './routes/routes'
import {store} from './store/store'
import pages from './pages/pages'
import Vuex from 'vuex'
Vue.use(VueRouter);
Vue.use(ElementUI);

Vue.component("pages",pages);
Vue.use(Vuex);

const router = new VueRouter({
  routes,
  mode: 'history'
})
Vue.config.productionTip = false;

new Vue({
  router,
  store:store,
  render: h => h(App)
}).$mount('#app')
