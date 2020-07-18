<template>
  <div class="savedRecipes flex">
    <h1 class="mg2" id="savedRecipesHeading">Saved recipes</h1>
    <Loader :bigLoader="bigLoader" v-if="isLoading" />
    <NotFound
      v-if="!getCurrentUser.favorites.length"
      :message="`You haven't saved any recipes yet`"
    />
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
    <a
      v-if="getCurrentUser.favorites.length > 4"
      href="#savedRecipesHeading"
      v-scroll-to="'#savedRecipesHeading'"
      class="block hashLink mg2"
      >Back to top &nbsp;<font-awesome-icon
        :icon="['fa', 'hand-point-up']"
        font-size="15px"
      ></font-awesome-icon
    ></a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NotFound from '../sharedComponents/NotFound'
import Loader from '../sharedComponents/Loader'
import SortingButtons from '../sharedComponents/SortingButtons'
import loaderMixin from '../../mixins/loaderMixin'
import sortingResults from '../../mixins/sortingResults'
import apiCalls from '../../mixins/apiCalls'
import Recipe from './Recipe'

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
      bigLoader: false,
      usersRecipes: false
    }
  },

  mixins: [loaderMixin, sortingResults, apiCalls],

  mounted() {
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
        const result = await this.fetchDbRecipes({
          _id: this.getCurrentUser.favorites
        })
        this.savedRecipes = [...result.resultsArray]
        this.toggleLoader()
      } catch (error) {
        console.log(error.response.data.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.savedRecipes {
  @include boxSize($width: 100%, $height: 100%);
  @include alignment($direction: column, $align: center);
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    #f2edc163 0%,
    #f7eb7463 90.1%
  );

  h1 {
    font-family: 'Lobster', cursive;
    color: lighten($graphite, 20%);
    text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.3),
      0px -1px 0px rgba(0, 0, 0, 0.7);
  }
  .listContainer {
    @include alignment($direction: column);
  }
}
@media (min-width: 992px) {
  .savedRecipes {
    @include background(
      radial-gradient(
        ellipse at center,
        rgba(41, 35, 35, 0.4) 0%,
        rgba(27, 26, 26, 0.5) 100%
      ),
      url('../../assets/backgrounds/cloth-back.jpg'),
      $backConfig
    );
    background-attachment: fixed;

    h1 {
      @include fonts($size: 2.2rem, $color: $light);
    }

    .hashLink {
      color: #7cffee;
      padding: 0.8rem;
      border: 1px solid #7cffee;
    }

    .listContainer {
      @include alignment($direction: column);
      @include boxSize($width: 900px);
    }
  }
}
</style>
