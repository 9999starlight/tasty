<template>
  <div class="recommendedRecipesContainer flex flexCenter mgt2">
    <img
      src="@/assets/small_pngs/chubby-pot.png"
      class="block"
      alt="pot-flowers"
      loading="lazy"
    />
    <h1 class="slim">What to cook today?</h1>
    <div class="innerWrapper flex flexCenter">
      <SingleQueryResult
        v-for="recipe in recommendedRecipes"
        :key="recipe._id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script>
import SingleQueryResult from '../sharedComponents/QueryResults/SingleQueryResult'
import apiCalls from '../../mixins/apiCalls'

export default {
  name: 'Recommended',

  components: {
    SingleQueryResult
  },

  data() {
    return {
      recommendedRecipes: []
    }
  },

  mixins: [apiCalls],

  async created() {
    try {
      const results = await this.fetchDbRecipes()
      if (results) {
        this.recommendedRecipes = [...results.resultsArray]
          .sort(() => Math.random() - 0.5)
          .slice(0, 6)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}
</script>

<style lang="scss" scoped>
.recommendedRecipesContainer {
  @include boxSize($width: 100%);
  @include alignment($direction: column);
  background-color: $light;
  padding: 1rem 0;

  .innerWrapper {
    @include boxSize($width: 100%);
    flex-wrap: wrap;
  }

  h1 {
    padding: 1rem 2rem 2rem;
    color: darken($golden, 15%);
  }
}

img {
  height: 45px;
  margin: auto;
}

@media (min-width: 576px) {
  .recommendedRecipesContainer {
    padding: 1rem;
    background-image: $zinc;
    box-shadow: $shadowBox;
  }
}

@media (min-width: 992px) {
  img {
    height: 55px;
    margin: auto;
  }
}

@media (min-width: 1200px) {
  .recommendedRecipesContainer {
    width: 1100px;
  }
}
</style>
