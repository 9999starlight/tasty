<template>
  <div class="resultsWrapper">
    <div class="results" v-for="recipe in getQueriedRecipes" :key="recipe._id">
      <SingleQueryResult :recipe="recipe" />
    </div>
  </div>
</template>

<script>
import SingleQueryResult from './SingleQueryResult'
import { mapGetters } from 'vuex'
export default {
  name: 'BrowseResults',
  components: {
    SingleQueryResult
  },
  computed: {
    ...mapGetters(['getQueriedRecipes'])
  }
}
</script>

<style></style>
