<template>
  <div class="latestRecipesContainer flex flexCenter mgt2">
    <img
      src="@/assets/small_pngs/recipe-book.png"
      class="block"
      alt="recipe-book"
    />
    <h1 class="slim">Latest Recipes</h1>
    <div class="innerWrapper flex flexCenter">
      <SingleQueryResult
        v-for="recipe in latestRecipes"
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
  name: 'LatestRecipes',

  components: {
    SingleQueryResult
  },

  data() {
    return {
      latestRecipes: []
    }
  },

  mixins: [apiCalls],

  async created() {
    try {
      const results = await this.fetchDbRecipes({
        sort: '-createdAt'
      })
      if (results) {
        this.latestRecipes = [...results.resultsArray].slice(0, 6)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
}
</script>

<style lang="scss" scoped>
.latestRecipesContainer {
  @include boxSize($width: 100%);
  @include alignment($direction: column);
  background-color: $light;
  padding: 1rem 0;
  /* mask-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    #ffffff 5%,
    #ffffff 95%,
    rgba(255, 255, 255, 0) 100%
  );
  -webkit-mask-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    #ffffff 5%,
    #ffffff 95%,
    rgba(255, 255, 255, 0) 100%
  ); */

  h1 {
    padding: 1rem 2rem 2rem;
  }
  .innerWrapper {
    @include boxSize($width: 100%);
    flex-wrap: wrap;

    /* .recipeLink {
      margin: 1rem 0;
    } */
  }
}
img {
  height: 45px;
  margin: auto;
}

@media (min-width: 350px) {
  .latestRecipesContainer {
    padding: 1rem;
    background-color: rgb(250, 221, 226);
    background: $palePinkGray;
  }
}

@media (min-width: 992px) {
  img {
    height: 55px;
    margin: auto;
  }
}

@media (min-width: 1200px) {
  .latestRecipesContainer {
    width: 1100px;
  }
}
</style>
