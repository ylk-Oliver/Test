import Vue from 'vue'
import App from './App.vue'
import Vuex from "vuex";
import iview from "iview";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import router from './router'
import store from "./store/index";
import axios from "axios"
import 'iview/dist/styles/iview.css'
import global from "./config/Global.vue"

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(iview)
Vue.use(Vuex)

Vue.prototype.$http = axios
Vue.prototype.GLOBAL = global

//获取cookie
Vue.prototype.getCookie = (name) => {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return (arr[2]);
	else
		return null;
}

//删除cookie
Vue.prototype.delCookie = (name) => {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//设置cookie,增加到vue实例方便全局调用
//vue全局调用的理由是，有些组件所用到的接口可能需要session验证，session从cookie获取
//当然，如果session保存到vuex的话除外
Vue.prototype.setCookie = (c_name, value, expiredays) => {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

//时间戳转时间
Vue.prototype.timeStamp = function(time) {
	var date = new Date(time * 1000);
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = date.getDate() + ' ';
	var h = date.getHours() + ':';
	var m = date.getMinutes() + ':';
	var s = date.getSeconds();

	if (D < 10) {
		D = "0" + D;
	}
	return Y + M + D
}

//时间转时间戳
Vue.prototype.time = function(index) {
	var strtime = index;
	var date = new Date(strtime);
	var time = Date.parse(date) / 1000;
	return time
}

new Vue({
	router,
	components: {
		App,
		ElementUI
	},
	watch: {
		"$route": 'checkLogin'
	},
	created() {
		this.checkLogin();
	},
	methods: {
		checkLogin() {
			//检查是否存在session
			//cookie操作方法在源码里有或者参考网上的即可
			if (!this.getCookie('session')) {
				//如果没有登录状态则跳转到登录页
				this.$router.push('/Login');
			} else {
				//否则跳转到登录后的页面
				this.$router.push('/RegistrantInfo');
			}
		}
	},
	render: h => h(App),
	store: new Vuex.Store(store)
}).$mount('#app')
