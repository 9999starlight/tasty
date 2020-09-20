<template>
  <div class="resultsWrapper flex flexCenter">
    <h1 class="pd1" id="searchHeading">Search Results</h1>
    <h4>Recipes found: {{ this.results.length }}</h4>
    <div class="inner flex flexCenter" v-if="getSuccess">
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
          class="mg1"
        />
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
        v-if="getSuccess === true && currentRecipes.length >= 5"
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
    SingleQueryResult: () =>
      import(/* webpackPrefetch: true */ './SingleQueryResult.vue'),
    Pagination: () => import(/* webpackPrefetch: true */ '../Pagination.vue'),
    SortingButtons: () =>
      import(/* webpackPrefetch: true */ '../SortingButtons.vue')
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
      } else {
        this.currentPage = 1
      }
    },
    deep: true
  },

  computed: {
    ...mapGetters(['getQueriedRecipes', 'getSuccess']),

    // page settings
    resultsPerPage() {
      if (this.results.length < 6) {
        return this.results.length
      } else {
        return 6
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

  h1,
  h4 {
    color: $golden;
  }

  .successful {
    @include boxSize($width: 100%);
    @include alignment($justify: center, $align: center);
    flex-wrap: wrap;
    margin: 1.5rem auto;
  }
}

@media (min-width: 1200px) {
  .resultsWrapper {
    @include boxSize($width: 1100px);
  }
}
</style>
