<template>
  <div class="overview" v-if="!isLoading">
    <h1 class="mgb1 slim">Overview</h1>
    <div class="counts flex">
      <header class="flex flexCenter"><h3>Counts</h3></header>
      <div class="countsInner flex center">
        <div class="flex flexCenter">
          <h4>Users</h4>
          <p>{{ usersCount }}</p>
        </div>
        <div class="flex flexCenter">
          <h4>Recipes</h4>
          <p>{{ recipeCount }}</p>
        </div>
        <div class="flex flexCenter">
          <h4>Comments</h4>
          <p>{{ commentsCount }}</p>
        </div>
      </div>
    </div>
    <section class="center grid">
      <div class="latestRecipes">
        <header class="flex flexCenter">
          <h3>Latest recipes</h3>
        </header>
        <div class="inner scrolling">
          <router-link
            :to="{ name: 'SingleResult', params: { id: recipe._id } }"
            tag="div"
            class="recipe grid link"
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
            <p class="lightItalic created">
              {{ convertDate(recipe.createdAt) }}
            </p>
            <p class="author">{{ recipe.author.username }}</p>
          </router-link>
        </div>
      </div>
      <div class="latestComments">
        <header class="flex flexCenter">
          <h3>Latest comments</h3>
        </header>
        <div class="inner scrolling">
          <div
            class="comment"
            v-for="comment in latestComments"
            :key="comment._id"
          >
            <h5>{{ comment.author.username }}</h5>
            <p class="lightItalic created">
              {{ convertDate(comment.createdAt) }}
            </p>
            <p>{{ comment.commentBody }}</p>
            <small class="lightItalic"
              >Recipe id: {{ comment.commentedRecipeId }}</small
            >
          </div>
        </div>
      </div>
      <StatisticBox
        :title="'Most commented recipes'"
        :dataArray="mostCommented"
      />
      <StatisticBox :title="'Most active Users'" :dataArray="mostActiveUsers" />
    </section>
  </div>
  <Loader v-else :bigLoader="true" />
</template>

<script>
import StatisticBox from './StatisticBox/StatisticBox'
import Loader from '../sharedComponents/Loader'
import { mapGetters } from 'vuex'
import dateFormat from '../../mixins/dateFormat'
import apiCalls from '../../mixins/apiCalls'
import loaderMixin from '../../mixins/loaderMixin'

export default {
  name: 'overview',

  data() {
    return {
      latestRecipes: [],
      latestComments: [],
      mostCommented: [],
      mostActiveUsers: [],
      recipeCount: 0,
      usersCount: 0,
      commentsCount: 0
    }
  },

  components: {
    StatisticBox,
    Loader
  },

  mixins: [dateFormat, apiCalls, loaderMixin],

  computed: {
    ...mapGetters(['getDefaultImage'])
  },

  created() {
    this.recipeFetching()
    this.usersFetching()
    this.commentsFetching()
  },

  methods: {
    async recipeFetching() {
      try {
        this.toggleLoader()
        const fetchedRecipes = await this.fetchDbRecipes({ sort: '-createdAt' })
        this.latestRecipes = fetchedRecipes.resultsArray.slice(0, 10)
        this.recipeCount = fetchedRecipes.count
        // most commented
        const sortedByComments = [...fetchedRecipes.resultsArray]
          .sort((a, b) => b.comments.length - a.comments.length)
          .slice(0, 5)
        //console.log(sortedByComments)
        sortedByComments.map((single) => {
          this.mostCommented.push({
            name: single.mealName,
            value: single.comments.length
          })
        })
        //console.log(this.mostCommented)
      } catch (error) {
        console.log(error.message)
      }
    },

    async usersFetching() {
      try {
        const fetchedUsers = await this.fetchUsers()
        this.usersCount = fetchedUsers.count
        //console.log(fetchedUsers)
        const sortedByRecipes = [...fetchedUsers.usersArray]
          .sort((a, b) => b.createdRecipes.length - a.createdRecipes.length)
          .slice(0, 5)
        //console.log(sortedByRecipes)
        sortedByRecipes.map((single) => {
          this.mostActiveUsers.push({
            name: single.username,
            value: single.createdRecipes.length
          })
        })
      } catch (error) {
        console.log(error.message)
      }
    },

    async commentsFetching() {
      try {
        const fetchedComments = await this.fetchComments({ sort: '-createdAt' })
        this.commentsCount = fetchedComments.count
        this.latestComments = [...fetchedComments.commentsArray].slice(0, 10)
        // console.log(this.latestComments)
        this.toggleLoader()
      } catch (error) {
        console.log(error.message)
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

  .counts {
    @include alignment($direction: column);
    @include boxSize($width: 100%, $height: 150px);
    border: 1px solid lightgray;

    header {
      background-color: lighten($graphite, 20%);
      @include fonts($color: $light);
      @include boxSize($width: 100%, $height: 20%);
    }

    .countsInner {
      @include alignment($align: center);
      @include boxSize($width: 100%, $height: 80%);
      padding: 1rem 0;

      div {
        @include alignment($direction: column, $justify: space-evenly);
        @include boxSize($width: 33.33%, $height: 100%);
        color: lighten($graphite, 40%);

        &:nth-of-type(2) {
          border-left: 1px solid lighten($graphite, 60%);
          border-right: 1px solid lighten($graphite, 60%);
        }

        p {
          @include fonts($size: 1.5rem);
        }
      }
    }
  }

  section {
    place-items: center;
    margin: 1rem auto;

    .latestComments,
    .latestRecipes,
    .statisticBoxWrapper {
      margin-bottom: 1rem;
    }
  }

  .latestRecipes,
  .latestComments {
    @include boxSize($width: 280px, $height: 240px);
    border: 1px solid lightgray;
    position: relative;
    //overflow: auto;
    // scrollbar styling
    /* scrollbar-width: thin;
    scrollbar-color: lighten($graphite, 20%) lighten($graphite, 60%); */
    /*  &::-webkit-scrollbar {
      width: 11px;
    }

    &::-webkit-scrollbar-track {
      background: lighten($graphite, 60%);
    }
    &::-webkit-scrollbar-thumb {
      background-color: lighten($graphite, 20%);
      border-radius: 6px;
      border: 3px solid lighten($graphite, 60%);
    } */

    header {
      background-color: lighten($graphite, 20%);
      @include fonts($color: $light);
      @include boxSize($width: 100%, $height: 40px);
      position: sticky;
      top: 0;
    }

    .inner {
      overflow: auto;
      @include boxSize($height: calc(100% - 40px));
    }
  }

  .recipe,
  .comment {
    @include boxSize($width: 100%);
    @include alignment($align: center);
    border-bottom: 1px solid lighten($graphite, 40%);
    color: $graphite;
  }
  .recipe {
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: 30px auto auto;
    grid-template-areas: 'image title title' 'image created user';
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

  .comment {
    text-align: left;
    padding: 0.4rem;
    .created {
      @include fonts($size: 0.7rem);
    }
  }
}

@media (min-width: 576px) {
  .overview {
    section {
      .latestComments,
      .latestRecipes {
        @include boxSize($width: 320px);
      }
    }
  }
}

@media (min-width: 768px) {
  .overview/* ,
  .loaderContainer  */{
    margin-top: 0;
    @include boxSize($width: calc(100% - 4rem));
    align-self: flex-end;

    /* .loaderContainer {
      margin: auto 0;
    } */

    section {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      grid-gap: 20px;
      justify-items: center;
      align-items: stretch;
    }

    .recipe:hover {
      background-color: rgb(235, 235, 235);
    }

    .counts {
      .countsInner {
        div {
          p {
            @include fonts($size: 2rem);
          }
        }
      }
    }
  }
}

@media (min-width: 992px) {
  .overview {
    .counts,
    section {
      @include boxSize($maxWidth: 1000px);
    }

    .counts {
      margin: auto;
    }

    section {
      margin-top: 2rem;
      .latestComments,
      .latestRecipes {
        @include boxSize($width: 400px);
      }
    }
  }
}
</style>
