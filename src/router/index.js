import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import RegistrantInfo from '@/components/RegistrantInfo'

Vue.use(Router)

export default new Router({
    routes: [{
      path: '/Login',
      component: Login
    }, {
      path: '/RegistrantInfo',
      component: RegistrantInfo
    }]

})
