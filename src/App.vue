<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <ControlLayout/>
  </div>
</template>

<script>
import ControlLayout from './components/ControlSetting.vue'

export default {
  name: 'app',
  components: {
    ControlLayout
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#app {
  position: relative;
  top: 0;
  left: 500px;
  width: 500px;
}
</style>
