<template>
  <div class="latestRecipesContainer flex flexCenter mgt2">
    <img
      src="@/assets/small_pngs/recipe-book.png"
      class="block"
      alt="recipe-book"
      loading="lazy"
    />
    <h1 class="slim">Latest Recipes</h1>
    <div class="innerWrapper flex flexCenter">
      <SingleQueryResult
        v-for="recipe in latestRecipes"
        :key="recipe._id"
        :recipe="recipe"
      />
    </div>
    <button @click="loadMore" class="hovEffect">Load more</button>
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
      allRecipes: [],
      latestRecipes: [],
      count: 6
    }
  },

  mixins: [apiCalls],

  async created() {
    try {
      const results = await this.fetchDbRecipes({
        sort: '-createdAt'
      })
      if (results) {
        this.allRecipes = [...results.resultsArray]
        this.latestRecipes = [...results.resultsArray].slice(0, this.count)
      }
    } catch (error) {
      console.log(error.message)
    }
  },

  methods: {
    loadMore() {
      const tempArr = this.allRecipes.slice(
        this.latestRecipes.length,
        this.latestRecipes.length + this.count
      )
      this.latestRecipes = [...this.latestRecipes, ...tempArr]
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

  h1 {
    padding: 1rem 2rem 2rem;
    color: darken($golden, 15%);
  }
  .innerWrapper {
    @include boxSize($width: 100%);
    flex-wrap: wrap;
  }
  button {
    background-color: transparent;
    padding: 1rem 2rem;
    @include fonts($size: 1.1rem, $color: darken($golden, 5%), $weight: 700);
    border: 1px solid darken($golden, 5%);
    margin-top: 1rem;
    transition: 350ms ease-in-out;
  }
}
img {
  height: 45px;
  margin: auto;
}

@media (min-width: 576px) {
  .latestRecipesContainer {
    padding: 1rem;
    background-image: $zinc;
    box-shadow: $shadowBox;
  }
}

/* @media (min-width: 768px) {
  .latestRecipesContainer {
    button:hover {
      box-shadow: inset 0 0 0 2rem darken($golden, 5%);
      color: $light;
    }
  }
} */

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
