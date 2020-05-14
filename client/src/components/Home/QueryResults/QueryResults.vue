<template>
  <div class="resultsWrapper flex flexCenter mgt2" id="searchResults">
    <div class="inner flex flexCenter">
      <h2 class="slim pd1" v-if="getSuccess === true">Search Results</h2>
      <div class="successful flex" v-if="getSuccess === true">
        <div
          class="results flex flexCenter mg1"
          v-for="recipe in currentRecipes"
          :key="recipe._id"
        >
          <SingleQueryResult :recipe="recipe" />
        </div>
      </div>
      <Pagination
        v-if="getSuccess === true"
        :resultsPerPage="resultsPerPage"
        :totalResults="getQueriedRecipes.length"
        :currentPage="currentPage"
        @paginate="changePage"
        @prev="prevPage"
        @next="nextPage"
        @first="firstPage"
        @last="lastPage"
      />
      <div class="messagewrapper" v-if="getSuccess === false">
        <NotFound :message="'No result for your search'" />
      </div>
    </div>
    <a
      v-if="getSuccess === true"
      href="#searchContainer"
      v-scroll-to="'#searchContainer'"
      class="block hashLink mg2"
      >Back to search &nbsp;<font-awesome-icon
        :icon="['fa', 'hand-point-up']"
        font-size="15px"
      ></font-awesome-icon
    ></a>
  </div>
</template>

<script>
import SingleQueryResult from './SingleQueryResult'
import NotFound from './../../sharedComponents/NotFound'
import Pagination from './../../sharedComponents/Pagination'
import { mapGetters } from 'vuex'
import paginationOptions from '../../../mixins/paginationOptions'

export default {
  name: 'BrowseResults',

  components: {
    SingleQueryResult,
    Pagination,
    NotFound
  },

  mixins: [paginationOptions],

  computed: {
    ...mapGetters(['getQueriedRecipes', 'getSuccess']),

    // page settings
    resultsPerPage() {
      // check if results are less than initial value of 2 (to be changed to 10)
      if (this.getQueriedRecipes.length < 2) {
        return this.getQueriedRecipes.length
      } else {
        return 2
      }
    },

    currentRecipes() {
      const arr = this.getQueriedRecipes.slice(
        this.firstResultIndex,
        this.lastResultIndex
      )
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
.resultsWrapper,
.inner {
  @include boxSize($width: 100%);
  @include alignment($direction: column);
}
.resultsWrapper {
  grid-area: results;

  .successful {
    @include boxSize($width: 100%);
    // @include alignment($direction: column);
    @include alignment($justify: center, $align: center);
    flex-wrap: wrap;

    .results {
      @include boxSize($width: 290px);
    }
  }
}

@media (min-width: 500px) {
  .resultsWrapper {
    .successful {
      .results {
        @include boxSize($width: 320px);
      }
    }
  }
}

@media (min-width: 1200px) {
  .resultsWrapper {
    @include boxSize($width: 1100px);
  }
}
</style>
