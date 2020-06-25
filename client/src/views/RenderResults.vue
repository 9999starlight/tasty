<template>
  <div class="container singleUserRecipes">
    <transition name="slide-down" mode="out-in">
      <Forms v-show="getOpenSearch" :renderPage="false" />
    </transition>
    <QueryResults />
  </div>
</template>

<script>
import QueryResults from '../components/sharedComponents/QueryResults/QueryResults'
import Forms from '../components/sharedComponents/Forms'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'render_results',
  components: {
    Forms,
    QueryResults
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

<style lang="scss" scoped></style>
