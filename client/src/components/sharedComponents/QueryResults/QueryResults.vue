<template>
  <div class="resultsWrapper flex flexCenter" id="searchResults">
    <div class="inner flex flexCenter" v-if="getSuccess">
      <h2 class="slim pd1" id="searchHeading">Search Results</h2>
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
          <SingleQueryResult
          v-for="recipe in currentRecipes"
          :key="recipe._id"
          :recipe="recipe"
          class="mg1"/>
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
        href="#searchHeading"
        v-scroll-to="'#searchHeading'"
        class="block hashLink mg2"
        >Back to top &nbsp;<font-awesome-icon
          :icon="['fa', 'hand-point-up']"
          font-size="15px"
        ></font-awesome-icon
      ></a>
    </div>
  </div>
</template>

<script>
import SingleQueryResult from './SingleQueryResult'
import Pagination from '../Pagination'
import SortingButtons from '../SortingButtons'
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
    SortingButtons
  },

  mixins: [paginationOptions, sortingResults],

  created() {
    //console.log(this.getQueriedRecipes)
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
    @include alignment($justify: center, $align: center);
    flex-wrap: wrap;
  }
}

@media (min-width: 1200px) {
  .resultsWrapper {
    @include boxSize($width: 1100px);
  }
}
</style>
