<template>
  <div class="userRecipes flex flexCenter">
    <!-- modal -->
    <transition name="fade" mode="out-in">
      <div class="modalOverlay" v-if="getEditState" @click.self="cancelEdit">
        <div class="modalWrapper" v-if="getEditState">
          <header class="flex flexCenter">
            <h2>Edit Recipe</h2>
            <button @click="cancelEdit" class="del">
              <font-awesome-icon
                :icon="['fa', 'times']"
                title="Cancel and close form"
              ></font-awesome-icon>
            </button>
          </header>
          <div class="editInner">
            <CreateEditForm class="editForm" />
          </div>
        </div>
      </div>
    </transition>
    <!-- end modal -->
    <h1 class="mg1">My Recipes</h1>
    <Loader :bigLoader="false" v-if="isLoading" />
    <NotFound
      v-if="!getCurrentUser.createdRecipes.length"
      :message="noRecipes"
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
import CreateEditForm from '../sharedComponents/CreateEditForm'

export default {
  name: 'user_recipes',

  components: {
    NotFound,
    Loader,
    Recipe,
    SortingButtons,
    CreateEditForm
  },

  data() {
    return {
      noRecipes: `You haven't created any recipes yet`,
      fetchedRecipes: [],
      usersRecipes: true
    }
  },

  mixins: [loaderMixin, sortingResults],

  computed: {
    ...mapGetters(['getCurrentUser', 'getEditState'])
  },

  mounted() {
    this.$scrollTo('#routerViewContainer', 200, {
      easing: 'linear',
      offset: 0
    })
    this.currentUserRecipes()
  },

  methods: {
    async currentUserRecipes() {
      try {
        if (!this.getCurrentUser.createdRecipes.length) {
          return
        }
        this.toggleLoader()
        const result = await axios.get(`${recipesUrl}`, {
          params: { author: this.getCurrentUser.userId }
        })
        this.fetchedRecipes = [...result.data.response.recipes]
        this.toggleLoader()
      } catch (error) {
        console.log(error.response.data.message)
      }
    },

    async cancelEdit() {
      try {
        await this.$store.dispatch('changeEditState', false)
        this.$scrollTo('#routerViewContainer', 200, {
          easing: 'linear',
          offset: 0
        })
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
  .userRecipes {
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
