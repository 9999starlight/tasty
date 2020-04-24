<template>
  <div id="app" class="flex">
    <app-header></app-header>
    <transition
      name="fade"
      mode="out-in"
    >
    <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Header from './components/sharedComponents/Header'

export default {
  name: 'app',

  components: {
    'app-header': Header,
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato|Poppins&display=swap');
@import './styles/global.scss';
#app {
  box-sizing: border-box;
  @include boxSize($width: 100%, $minHeight: 100vh);
  @include alignment($direction: column, $align: center);
  font-family: 'Lato', Arial, sans-serif;
  //position: relative;
}
</style>
