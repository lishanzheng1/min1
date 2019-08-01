import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import {routes} from './routes/routes'
import {store} from './store/store'
import pages from './pages/pages'
import Vuex from 'vuex'
import storageUtil from './util/storageUtil'

Vue.use(VueRouter);
Vue.use(ElementUI);

Vue.component("pages",pages);
Vue.use(Vuex);

Vue.config.productionTip = false;
const router = new VueRouter({
  routes,
  mode: 'history',
});


router.beforeEach((to,from,next) =>{
  const nextRoute = ['Login', 'Index', 'User', 'Menu', 'Auth',
    'Dictionaries','Region','Gather','Accounts','Gatheruser'];
  if (to.name === 'Login') {
    next();
    return;
    /* if (isLogin) {
       router.push({ name: 'Index' });
     }*/
  }else {
    let isLogin = storageUtil.read("sessionId");
    console.log("11111",isLogin);
   // console.log("22222222",nextRoute.indexOf(to.name) <0);
    if (nextRoute.indexOf(to.name) < 0) {
      if (!isLogin) {
        console.log('还没有登录，请登录');
        router.push({ name: 'Login' })
      }
    }
  }

  // 已登录状态；当路由到login时，跳转至Index

  next();
  /* if (to.path === '/' || to.path === '/home' ) {
     next();
   }else {
     alert("还没有登录，请登录");
     next('/');
   }*/
});


new Vue({
  router,
  store:store,
  render: h => h(App)
}).$mount('#app')
