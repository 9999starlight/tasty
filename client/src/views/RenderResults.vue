<template>
  <div class="container">
    <transition name="slide-down" mode="out-in">
      <Forms v-show="getOpenSearch" :renderPage="false" />
    </transition>
    <QueryResults />
  </div>
</template>

<script>
import QueryResults from '../components/sharedComponents/QueryResults/QueryResults'
import Forms from '../components/sharedComponents/Forms'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'render_results',
  components: {
    Forms,
    QueryResults
  },

  computed: {
    ...mapGetters(['getOpenSearch'])
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

<style lang="scss" scoped></style>
