<template>
  <div class="userRecipes flex">
    <!-- modal -->
    <transition name="fade" mode="out-in">
      <div class="modalOverlay" v-if="getEditState" @click.self="cancelEdit">
        <div class="modalWrapper" v-if="getEditState">
          <header class="flex flexCenter">
            <h2>Edit Recipe</h2>
            <button @click="cancelEdit" class="del tooltipContainer">
              <font-awesome-icon :icon="['fa', 'times']"></font-awesome-icon>
              <Tooltip :tooltipText="'Cancel and close form'" />
            </button>
          </header>
          <div class="editInner">
            <CreateEditForm class="editForm" />
          </div>
        </div>
      </div>
    </transition>
    <!-- end modal -->
    <h1 class="mg2" id="userRecipesHeading">Created Recipes</h1>
    <Loader :bigLoader="false" v-if="isLoading" />
    <NotFound
      v-if="!getCurrentUser.createdRecipes.length"
      :message="`You haven't created any recipes yet`"
    />
    <div v-else class="listContainer flex flexCenter" id="listContainer">
      <SortingButtons
        @sortTitleAsc="sortTitleAscending(fetchedRecipes)"
        @sortTitleDesc="sortTitleDescending(fetchedRecipes)"
        @sortRatingAsc="sortRatingAscending(fetchedRecipes)"
        @sortRatingDesc="sortRatingDescending(fetchedRecipes)"
        @sortDateAsc="sortDateAscending(fetchedRecipes)"
        @sortDateDesc="sortDateDescending(fetchedRecipes)"
      />
      <transition-group name="list-complete" tag="div">
        <Recipe
          v-for="recipe in fetchedRecipes"
          :key="recipe._id"
          class="renderRecipes sortingItem"
          :recipe="recipe"
          :usersRecipes="usersRecipes"
          @del="currentUserRecipes"
          @editing="editingStateSettings"
        />
      </transition-group>
    </div>
    <a
      v-if="getCurrentUser.createdRecipes.length > 5"
      href="#userRecipesHeading"
      v-scroll-to="'#userRecipesHeading'"
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
import Tooltip from '../sharedComponents/Tooltip'
import loaderMixin from '../../mixins/loaderMixin'
import sortingResults from '../../mixins/sortingResults'
import apiCalls from '../../mixins/apiCalls'

export default {
  name: 'user_recipes',

  components: {
    NotFound: () => import('../sharedComponents/NotFound.vue'),
    Loader: () =>
      import(/* webpackPrefetch: true */ '../sharedComponents/Loader.vue'),
    Recipe: () => import('./Recipe.vue'),
    SortingButtons: () => import('../sharedComponents/SortingButtons.vue'),
    CreateEditForm: () => import('../sharedComponents/CreateEditForm.vue'),
    Tooltip
  },

  data() {
    return {
      fetchedRecipes: [],
      usersRecipes: true
    }
  },

  mixins: [loaderMixin, sortingResults, apiCalls],

  computed: {
    ...mapGetters(['getCurrentUser', 'getEditState'])
  },

  mounted() {
    this.currentUserRecipes()
  },

  methods: {
    async currentUserRecipes() {
      try {
        if (!this.getCurrentUser.createdRecipes.length) {
          return
        }
        this.toggleLoader()
        const result = await this.fetchDbRecipes({
          author: this.getCurrentUser.userId
        })
        this.fetchedRecipes = [...result.resultsArray]
        this.toggleLoader()
      } catch (error) {
        console.log(error.response.data.message)
      }
    },

    async cancelEdit() {
      try {
        await this.$store.dispatch('changeEditState', false)
      } catch (error) {
        console.log(error)
      }
    },

    async editingStateSettings(id) {
      try {
        await this.$store.dispatch('fetchSingleRecipe', id)
        await this.$store.dispatch('changeEditState', true)
      } catch (error) {
        console.log(error.message)
      }
    }
  },

  beforeDestroy() {
    this.cancelEdit()
  }
}
</script>

<style lang="scss" scoped>
.userRecipes {
  @include boxSize($width: 100%, $height: 100%);
  flex: 1 1 auto;
  @include alignment($direction: column, $align: center);
  background-color: rgb(238, 236, 236);

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
  .userRecipes {
    @include background(
      radial-gradient(
        ellipse at center,
        rgba(41, 35, 35, 0.4) 0%,
        rgba(27, 26, 26, 0.5) 100%
      ),
      url('../../assets/backgrounds/pestle-and-mortar.jpg'),
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

      .renderRecipes {
        @include boxSize($maxWidth: 900px);
      }
    }
  }
}
</style>
