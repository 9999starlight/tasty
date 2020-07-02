<template>
  <div class="homeContainer container" id="homeContainer">
    <Tags />
    <transition name="slide-down" mode="out-in">
      <Forms class="browse" v-show="getOpenSearch" />
    </transition>
    <Popular />
    <LatestRecipes />
    <Recommended />
    <a
          href="#homeContainer"
          v-scroll-to="'#homeContainer'"
          class="block hashLink mg1"
          >Back to top &nbsp;<font-awesome-icon
            :icon="['fa', 'hand-point-up']"
            font-size="15px"
          ></font-awesome-icon
        ></a>
  </div>
</template>

<script>
import Popular from '../components/Home/Popular/Popular'
import Forms from '../components/sharedComponents/Forms'
import Tags from '../components/Home/Tags/Tags'
import LatestRecipes from '../components/Home/LatestRecipes'
import Recommended from '../components/Home/Recommended'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'home',
  components: {
    Popular,
    Forms,
    Tags,
    LatestRecipes,
    Recommended
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

<style lang="scss" scoped>
.browse {
  height: 350px;
}
</style>
