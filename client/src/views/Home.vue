<template>
  <div class="homeContainer container">
    <Tags />
    <transition name="slide-down" mode="out-in">
      <Forms class="browse" v-show="getOpenSearch" />
    </transition>
    <Popular />
    <RandomRecipes />
  </div>
</template>

<script>
import Popular from '../components/Home/Popular/Popular'
import Forms from '../components/sharedComponents/Forms'
import Tags from '../components/Home/Tags/Tags'
import RandomRecipes from '../components/Home/RandomRecipes'
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  components: {
    Popular,
    Forms,
    Tags,
    RandomRecipes
  },

  computed: {
    ...mapGetters(['getOpenSearch'])
  }
}
</script>

<style lang="scss" scoped>
.browse {
  height: 350px;
}
</style>
