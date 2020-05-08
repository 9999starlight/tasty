<template>
  <div class="userRecipes flex flexCenter">
    <h1 class="mg1">My Recipes</h1>
    <Loader :bigLoader="bigLoader" v-if="isLoading" />
    <NotFound
      v-if="!getCurrentUser.createdRecipes.length"
      :message="noRecipes"
    />
    <div v-else class="listContainer" id="listContainer">
      <UserRecipe
        v-for="recipe in fetchedRecipes"
        :key="recipe._id"
        class="renderRecipes"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NotFound from '../../sharedComponents/NotFound'
import Loader from '../../sharedComponents/Loader'
import loaderMixin from '../../../mixins/loaderMixin'
import UserRecipe from './UserRecipe'
import axios from 'axios'
import { recipesUrl } from '../../../apiData'

export default {
  name: 'user_recipes',

  components: {
    NotFound,
    Loader,
    UserRecipe
  },

  data() {
    return {
      noRecipes: `You haven't created any recipes yet`,
      bigLoader: false,
      fetchedRecipes: []
    }
  },

  mixins: [loaderMixin],

  computed: {
    ...mapGetters(['getCurrentUser'])
  },

  mounted() {
    //console.log('user recipes mounted')
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
        this.fetchedRecipes = [...result.data.recipes]
        this.toggleLoader()
        // console.log(this.fetchedRecipes)
      } catch (error) {
        console.log(error.message)
      }
    }
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
}

@media (min-width: 992px) {
  .userRecipes {
    .listContainer {
      @include boxSize($maxWidth: 900px);

      .renderRecipes {
        @include boxSize($maxWidth: 900px);
      }
    }
  }
}
</style>
