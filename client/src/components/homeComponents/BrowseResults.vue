<template>
  <div class="resultsWrapper flex flexCenter mgt2">
    <h2 class="slim pd1" id="searchResults">Search Results</h2>
    <div class="inner flex flexCenter">
      <div class="successful flex" v-if="getSuccess === true">
        <div
          class="results"
          v-for="recipe in getQueriedRecipes"
          :key="recipe._id"
        >
          <SingleQueryResult :recipe="recipe" />
        </div>
        <a href="#searchContainer" v-scroll-to="'#searchContainer'" class="block hashLink mg2"
      >Back to search &nbsp;<font-awesome-icon
        :icon="['fa', 'hand-point-up']"
        font-size="15px"
      ></font-awesome-icon
    ></a>
      </div>
      <div class="messagewrapper" v-if="getSuccess === false">
        <NotFound :message="'No result for your search'" />
      </div>
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
.resultsWrapper,
.inner {
  @include boxSize($width: 100%);
  @include alignment($direction: column);
  // border: 1px solid black;
}
.successful {
  @include boxSize($width: 100%);
  @include alignment($direction: column);
}
</style>
