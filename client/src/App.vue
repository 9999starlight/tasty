<template>
  <div id="app" class="flex">
    <app-header></app-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Header from './components/sharedComponents/Header'

export default {
  name: 'app',

  components: {
    'app-header': Header
  }
}
</script>

<style lang="scss">
#app {
  box-sizing: border-box;
  @include boxSize($width: 100%, $minHeight: 100vh);
  @include alignment($direction: column, $align: center);
}
</style>
