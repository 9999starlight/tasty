<template>
  <div class="resultsWrapper flex flexCenter mgt2" id="searchResults">
    <div class="inner flex flexCenter">
      <div class="successful flex" v-if="getSuccess === true">
        <h2 class="slim pd1">Search Results</h2>
        <div
          class="results flex flexCenter"
          v-for="recipe in getQueriedRecipes"
          :key="recipe._id"
        >
          <SingleQueryResult :recipe="recipe" />
        </div>
        <a
          href="#searchContainer"
          v-scroll-to="'#searchContainer'"
          class="block hashLink mg2"
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
import NotFound from './../../sharedComponents/NotFound'
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
.resultsWrapper {
  grid-area: results;

  .successful {
    @include boxSize($width: 100%);
    @include alignment($direction: column);
  }
}
</style>
