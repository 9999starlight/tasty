<template>
  <div class="resultsWrapper flex flexCenter">
    <div class="successful flex" v-if="getSuccess">
      <div
        class="results"
        v-for="recipe in getQueriedRecipes"
        :key="recipe._id"
      >
        <SingleQueryResult :recipe="recipe" />
      </div>
    </div>
    <div class="messagewrapper" v-else>
      <NotFound :message="'No result for your search'" />
    </div>
  </div>
</template>

<script>
import SingleQueryResult from './SingleQueryResult'
import NotFound from './../NotFound'
import { mapGetters } from 'vuex'
export default {
  name: 'BrowseResults',
  components: {
    SingleQueryResult,
    NotFound
  },
  computed: {
    ...mapGetters(['getQueriedRecipes', 'getSuccess'])
  }
}
</script>

<style lang="scss" scoped>
  .resultsWrapper {
    @include boxSize($width: 100%);
    @include alignment($direction: column);

      .successful {
        @include boxSize($width: 100%);
        @include alignment($direction: column);
      }
    // border: 1px solid black;
  }
</style>
