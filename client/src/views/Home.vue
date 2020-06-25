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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'home',
  components: {
    Popular,
    Forms,
    Tags,
    RandomRecipes
  },

  async beforeCreate() {
    try {
      await this.$store.dispatch('toggleSearch', false)
    } catch (error) {
      console.log(error)
    }
  },

  computed: {
    ...mapGetters(['getOpenSearch']),
    ...mapActions(['toggleSearch'])
  }
}
</script>

<style lang="scss" scoped>
.browse {
  height: 350px;
}
</style>
