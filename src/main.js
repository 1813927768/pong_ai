import Vue from 'vue'
import App from './App.vue'
import {startGame} from "./js/gameController"

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')



// start the game
window.onload = function(){
    startGame();
}
