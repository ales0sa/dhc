<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Projects</router-link> |
      <router-link to="/about">About</router-link>
      <!-- | <span @click="toggleDevTools = true" v-if="!devTools"> Turn <b>ON</b> DevTools </span>
      <span @click="toggleDevTools = false" v-if="devTools"> Turn <b>OFF</b> DevTools </span> -->
    </div>
    <router-view :devTools="devTools" />
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      devTools: false,
    };
  },
  methods: {
    toggleDevTools() {
      this.devTools = !this.devTools;
    }
  }
}
</script>
<style lang="scss">
@import './assets/main.scss'; 
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #3836a5;
    

    &.router-link-exact-active {
      color: #0b0c47;
    }
  }
}
</style>
