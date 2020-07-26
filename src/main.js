import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
// 引用我们的自定义组件
import "./components";

new Vue({
  render: h => h(App),
}).$mount('#app')
