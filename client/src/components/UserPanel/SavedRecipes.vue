<template>
  <div class="savedRecipes flex flexCenter">
    <h1 class="mg1">Saved recipes</h1>
    <Loader :bigLoader="bigLoader" v-if="isLoading" />
    <NotFound v-if="!getCurrentUser.favorites.length" :message="noRecipes" />
    <div v-else class="listContainer flex flexCenter" id="listContainer">
      <SortingButtons
        @sortTitleAsc="sortTitleAscending(savedRecipes)"
        @sortTitleDesc="sortTitleDescending(savedRecipes)"
        @sortRatingAsc="sortRatingAscending(savedRecipes)"
        @sortRatingDesc="sortRatingDescending(savedRecipes)"
        @sortDateAsc="sortDateAscending(savedRecipes)"
        @sortDateDesc="sortDateDescending(savedRecipes)"
      />
      <transition-group name="list-complete" tag="div">
        <Recipe
          v-for="recipe in savedRecipes"
          :key="recipe._id"
          class="renderRecipes sortingItem"
          :recipe="recipe"
          :usersRecipes="usersRecipes"
          @deletedFromFavorites="currentUserFavorites"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NotFound from '../sharedComponents/NotFound'
import Loader from '../sharedComponents/Loader'
import SortingButtons from '../sharedComponents/SortingButtons'
import loaderMixin from '../../mixins/loaderMixin'
import sortingResults from '../../mixins/sortingResults'
import Recipe from './Recipe'
import axios from 'axios'
import { recipesUrl } from '../../apiData'
export default {
  name: 'saved_recipes',

  components: {
    NotFound,
    Loader,
    Recipe,
    SortingButtons
  },

  data() {
    return {
      savedRecipes: [],
      noRecipes: `You haven't saved any recipes yet`,
      bigLoader: false,
      usersRecipes: false
    }
  },

  mixins: [loaderMixin, sortingResults],

  mounted() {
    //console.log('saved recipes mounted')
    this.$scrollTo('#routerViewContainer', 200, {
      easing: 'linear',
      offset: 0
    })
    this.currentUserFavorites()
  },

  computed: {
    ...mapGetters(['getCurrentUser'])
  },

  methods: {
    async currentUserFavorites() {
      try {
        if (!this.getCurrentUser.favorites.length) {
          return
        }
        this.toggleLoader()
        const result = await axios.get(`${recipesUrl}`, {
          params: { _id: this.getCurrentUser.favorites }
        })
        console.log(result)
        this.savedRecipes = [...result.data.recipes]
        // console.log(this.savedRecipes)
        this.toggleLoader()
      } catch (error) {
        console.log(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.savedRecipes {
  @include boxSize($width: 100%);
  @include alignment($direction: column);
  // border-top: 2px solid rgb(233, 231, 231);

  h1 {
    font-family: 'Lobster', cursive;
    color: lighten($graphite, 20%);
  }
  .listContainer {
    @include alignment($direction: column);
  }
}
@media (min-width: 992px) {
  .savedRecipes {
    .listContainer {
      @include alignment($direction: column);
      @include boxSize($width: 900px);

      /*  .renderRecipes {
        @include boxSize($maxWidth: 900px);
      } */
    }
  }
}
</style>
