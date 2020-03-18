<template>
  <div id="app">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from "./components/Header";

export default {
  name: "app",

  components: {
    "app-header": Header
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato|Poppins&display=swap');
@import "./styles/global.scss";
#app {
  box-sizing: border-box;
  @include boxSize($width: 100%, $minHeight: 100vh);
  font-family: "Lato", Arial, sans-serif;
  //position: relative;
}
</style>
