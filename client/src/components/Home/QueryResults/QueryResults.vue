<template>
  <div class="resultsWrapper flex flexCenter mgt2" id="searchResults">
    <div class="inner flex flexCenter" v-if="getSuccess">
      <h2 class="slim pd1">Search Results</h2>
      <h5>Number of results: {{ this.results.length }}</h5>
      <SortingButtons
        @sortTitleAsc="sortTitleAscending(results)"
        @sortTitleDesc="sortTitleDescending(results)"
        @sortRatingAsc="sortRatingAscending(results)"
        @sortRatingDesc="sortRatingDescending(results)"
        @sortDateAsc="sortDateAscending(results)"
        @sortDateDesc="sortDateDescending(results)"
      />
      <div class="successful flex">
        <div
          class="results flex flexCenter mg1"
          v-for="recipe in currentRecipes"
          :key="recipe._id"
        >
          <SingleQueryResult :recipe="recipe" />
        </div>
      </div>
      <Pagination
        :resultsPerPage="resultsPerPage"
        :totalResults="results.length"
        :currentPage="currentPage"
        @paginate="changePage"
        @prev="prevPage"
        @next="nextPage"
        @first="firstPage"
        @last="lastPage"
      />
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
    <!--     <div class="messagewrapper" v-else>
      <NotFound :message="'No result for your search'" />
    </div> -->
  </div>
</template>

<script>
import SingleQueryResult from './SingleQueryResult'
//import NotFound from './../../sharedComponents/NotFound'
import Pagination from './../../sharedComponents/Pagination'
import SortingButtons from './../../sharedComponents/SortingButtons'
import { mapGetters } from 'vuex'
import paginationOptions from '../../../mixins/paginationOptions'
import sortingResults from '../../../mixins/sortingResults'

export default {
  name: 'QueryResults',

  data() {
    return {
      results: []
    }
  },

  components: {
    SingleQueryResult,
    Pagination,
    //NotFound,
    SortingButtons
  },

  mixins: [paginationOptions, sortingResults],

  created() {
    this.results = [...this.getQueriedRecipes]
  },

  watch: {
    getQueriedRecipes(newValue, oldValue) {
      if (oldValue !== newValue) {
        this.results = [...newValue]
        this.currentPage = 1
        // console.log('watcher', this.results, this.currentPage)
      } else {
        this.currentPage = 1
        // console.log('watcher', this.results, this.currentPage)
      }
    },
    deep: true
  },

  computed: {
    ...mapGetters(['getQueriedRecipes', 'getSuccess']),

    // page settings
    resultsPerPage() {
      // check if results are less than initial value of 2 (to be changed to 10)
      if (this.results.length < 2) {
        return this.results.length
      } else {
        return 2
      }
    },

    currentRecipes() {
      const arr = this.results.slice(
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
