<template>
  <div class="overview">
    <h1>Overview</h1>
    <div class="counts flex">
      <header><h3>Counts</h3></header>
      <div>
        <h4>Users</h4>
        <p>{{ usersCount }}</p>
      </div>
      <div>
        <h4>Recipes</h4>
        <p>{{ recipeCount }}</p>
      </div>
      <div>
        <h4>Comments</h4>
        <p>{{ commentsCount }}</p>
      </div>
    </div>
    <div class="latestRecipes">
      <header class="flex flexCenter">
        <h3>Latest recipes</h3>
      </header>
      <div
        class="recipe grid"
        v-for="recipe in latestRecipes"
        :key="recipe._id"
      >
        <figure>
          <img
            v-if="recipe.image === undefined"
            :src="getDefaultImage"
            :alt="recipe.mealName"
            class="imageFit"
          />
          <img
            v-else
            :src="recipe.image"
            :alt="recipe.mealName"
            class="imageFit"
          />
        </figure>
        <h5 class="center">{{ recipe.mealName }}</h5>
        <p class="lightItalic created">{{ convertDate(recipe.createdAt) }}</p>
        <p class="author">{{ recipe.author.username }}</p>
      </div>
    </div>
    <StatisticBox />
  </div>
</template>

<script>
import StatisticBox from './StatisticBox/StatisticBox'
import { mapActions, mapGetters } from 'vuex'
import dateFormat from '../../mixins/dateFormat'
import { recipesUrl, usersUrl, commentsUrl } from '../../apiData'
import axios from 'axios'
export default {
  name: 'Overview',

  data() {
    return {
      latestRecipes: [],
      recipeCount: 0,
      usersCount: 0,
      commentsCount: 0
    }
  },

  components: {
    StatisticBox
  },

  mixins: [dateFormat],

  computed: {
    ...mapActions(['fetchQueriedRecipes']),
    ...mapGetters(['getDefaultImage', 'getQueriedRecipes'])
  },

  async created() {
    const fetchedRecipes = await this.fetchDbRecipes({ sort: '-createdAt' })
    this.latestRecipes = fetchedRecipes.resultsArray.slice(0, 5)
    this.recipeCount = fetchedRecipes.count
    const fetchedUsersCount = await this.fetchUsers()
    this.usersCount = fetchedUsersCount.count
    const fetchedComments = await this.fetchComments()
    this.commentsCount = fetchedComments.count
  },

  methods: {
    async fetchDbRecipes(payload) {
      try {
        const results = await axios.get(`${recipesUrl}`, {
          params: payload
        })
        return {
          resultsArray: results.data.response.recipes,
          count: results.data.docsCount
        }
      } catch (error) {
        console.log(error.results.data.message)
      }
    },

    async fetchUsers(payload) {
      try {
        const results = await axios.get(`${usersUrl}`, {
          params: payload
        })
        return {
          usersArray: results.data.response.users,
          count: results.data.docsCount
        }
      } catch (error) {
        console.log(error.results.data.message)
      }
    },

    async fetchComments(payload) {
      try {
        const results = await axios.get(`${commentsUrl}`, {
          params: payload
        })
        return {
          commentsArray: results.data.response.comments,
          count: results.data.docsCount
        }
      } catch (error) {
        console.log(error.results.data.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.overview {
  margin-top: 3rem;
  @include boxSize($width: 100%);
  align-self: center;
  .latestRecipes {
    @include boxSize($width: 280px);
    border: 1px solid lightgray;

    header {
      background-color: lighten($graphite, 20%);
      @include fonts($color: $white);
      @include boxSize($width: 100%, $height: 40px);
    }

    .recipe {
      @include boxSize($width: 100%);
      @include alignment($align: center);
      grid-template-rows: repeat(2, 1fr);
      grid-template-columns: 30px auto auto;
      grid-template-areas: 'image title title' 'image created user';
      border-bottom: 1px solid lighten($graphite, 40%);
      color: $graphite;
      padding: 0 0.2rem;

      h5 {
        grid-area: title;
      }

      figure {
        @include boxSize($width: 30px, $height: 40px);
        grid-area: image;
      }

      p {
        padding: 0.3rem;
      }

      .created {
        grid-area: created;
        margin: 0;
        @include fonts($size: 0.7rem);
      }
      .author {
        grid-area: user;
        @include fonts($size: 0.8rem, $weight: 700);
      }
    }
  }
}

@media (min-width: 768px) {
  .overview {
    margin-top: 0;
    @include boxSize($width: calc(100% - 4rem));
    align-self: flex-end;
  }
}
</style>
