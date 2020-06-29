<template>
  <div class="randomRecipesContainer flex mgt2">
    <!--     <div class="recipeWrapper"> -->
    <SingleQueryResult
      v-for="recipe in randomRecipes"
      :key="recipe._id"
      :recipe="recipe"
    />
    <!--     </div> -->
  </div>
</template>

<script>
import SingleQueryResult from '../sharedComponents/QueryResults/SingleQueryResult'
import apiCalls from '../../mixins/apiCalls'

export default {
  name: 'RandomRecipes',

  components: {
    SingleQueryResult
  },

  data() {
    return {
      randomRecipes: []
    }
  },

  mixins: [apiCalls],

  async created() {
    try {
      const results = await this.fetchDbRecipes()
      if (results) {
        this.randomRecipes = [...results.resultsArray]
          .sort(() => Math.random() - 0.5)
          .slice(0, 12)
        //console.log(this.randomRecipes)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}
</script>

<style lang="scss" scoped>
.randomRecipesContainer {
  @include boxSize($width: 100%);
  // @include alignment($direction: column);
  @include alignment($justify: center, $align: center);
  flex-wrap: wrap;

  .recipeLink {
    // @include boxSize($maxWidth: max-content);
    margin: 1rem;
  }
}

@media (min-width: 1200px) {
  .randomRecipesContainer {
    width: 1100px;
  }
}
</style>
