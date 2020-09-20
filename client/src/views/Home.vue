<template>
  <div class="homeContainer container" id="homeContainer">
    <transition name="slide-down" mode="out-in">
      <Forms v-show="getOpenSearch" />
    </transition>
    <Popular />
    <Tags />
    <LatestRecipes />
    <Recommended />
    <a
      href="#homeContainer"
      v-scroll-to="'#homeContainer'"
      class="block hashLink mg2"
      >Back to top &nbsp;<font-awesome-icon
        :icon="['fa', 'hand-point-up']"
        font-size="15px"
      ></font-awesome-icon
    ></a>
  </div>
</template>

<script>
import Popular from '../components/Home/Popular/Popular'
import Tags from '../components/Home/Tags/Tags'
import LatestRecipes from '../components/Home/LatestRecipes'
import Recommended from '../components/Home/Recommended'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'home',
  components: {
    Popular,
    Tags,
    LatestRecipes,
    Recommended,
    Forms: () =>
      import(/* webpackPrefetch: true */ '../components/sharedComponents/Forms.vue')
  },

  computed: {
    ...mapGetters(['getOpenSearch'])
  },

  beforeDestroy() {
    if (this.getOpenSearch === true) this.setOpenSearch()
  },

  methods: {
    ...mapMutations(['setOpenSearch']),
    setOpenSearch() {
      this.$store.commit('setOpenSearch')
    }
  }
}
</script>

<style lang="scss" scoped></style>
