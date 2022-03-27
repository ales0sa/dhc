import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

window.onbeforeunload = confirmExit;

    function confirmExit() {
        
          return "Some task is in progress. Are you sure, you want to close?";
        
    }