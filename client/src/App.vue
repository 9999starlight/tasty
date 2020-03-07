<template>
  <div id="app">
    <app-header />
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/layouts/Header'

export default {
  name: 'app',

  components: {
    'app-header': Header
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Lato&display=swap');
 @import './styles/global.scss';
#app {
    margin: 0;
  padding: 0;
  box-sizing: border-box;
  @include boxSize($width: 100%, $minHeight: 100vh);
  font-family: Lato, Arial, sans-serif;
  //background-color: $graphite;
}
</style>
