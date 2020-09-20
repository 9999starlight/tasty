<template>
  <div class="container renderResults">
    <transition name="slide-down" mode="out-in">
      <Forms v-show="getOpenSearch" :renderPage="false" />
    </transition>
    <QueryResults id="searchResults" />
  </div>
</template>

<script>
import QueryResults from '../components/sharedComponents/QueryResults/QueryResults'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'render_results',
  components: {
    Forms: () =>
      import(
        /* webpackPrefetch: true */ '../components/sharedComponents/Forms'
      ),
    QueryResults
  },

  computed: {
    ...mapGetters(['getOpenSearch', 'getQueriedRecipes'])
  },

  methods: {
    ...mapMutations(['setOpenSearch']),
    setOpenSearch() {
      this.$store.commit('setOpenSearch')
    }
  },

  beforeDestroy() {
    if (this.getOpenSearch === true) this.setOpenSearch()
  }
}
</script>

<style lang="scss" scoped>
.renderResults {
  justify-content: flex-start;
}
</style>
