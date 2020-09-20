<template>
  <div class="singleResultContainer container">
    <transition name="slide-down" mode="out-in">
      <Forms v-show="getOpenSearch" />
    </transition>
    <div class="singleResultWrapper" v-if="ready">
      <h1>{{ resultRecipe.mealName | titleCase }}</h1>
      <section class="favorites flex">
        <div class="messageWrapper center">
          <transition name="expand" mode="out-in">
            <InfoMessage
              v-if="message !== ''"
              :message="message"
              :messageStatus="messageStatus"
              @clear="updateMessage('')"
            />
          </transition>
        </div>
        <button
          v-if="disableRecipeSaving"
          class="addToFavorites hovEffect"
          @click="addToFavorites"
        >
          Add to favorites &nbsp;
          <span>
            <font-awesome-icon :icon="['fas', 'plus']" class="plus">
            </font-awesome-icon>
          </span>
        </button>
        <transition v-else name="pulsing-in" appear>
          <div
            :class="
              disableRecipeSaving ? 'changableSave' : 'changableSave heart'
            "
          >
            <span>Recipe saved</span>
          </div>
        </transition>
        <Rating
          v-if="disableRating"
          :resultRecipe="resultRecipe"
          @updateRating="updateRecipe"
          @updateMsg="updateMessage"
          @updateMsgStatus="updateMessageStatus"
        />
        <transition v-if="userRate" name="pulsing-in" appear>
          <p class="userRating flex flexCenter">
            Your rate:<span>{{ userRate }}</span
            ><font-awesome-icon :icon="['fas', 'star']" class="starIcon">
            </font-awesome-icon>
          </p>
        </transition>
      </section>
      <section class="basicInfo flex mgb1">
        <span class="info tooltipContainer"
          ><font-awesome-icon :icon="['fas', 'weight']" class="mealIcons">
          </font-awesome-icon>
          {{ resultRecipe.level }}<Tooltip :tooltipText="'Level of difficulty'"
        /></span>
        <span class="info tooltipContainer"
          ><font-awesome-icon :icon="['fas', 'user']" class="mealIcons">
          </font-awesome-icon>
          {{ resultRecipe.persons }}<Tooltip :tooltipText="'Number of persons'"
        /></span>
        <span class="info tooltipContainer"
          ><font-awesome-icon
            :icon="['far', 'clock']"
            class="mealIcons"
          ></font-awesome-icon>
          {{ resultRecipe.timing }}<Tooltip :tooltipText="'Preparation time'"
        /></span>
      </section>
      <figure class="mgb1">
        <img
          v-if="resultRecipe.image === undefined"
          :src="getDefaultImage"
          :alt="resultRecipe.mealName"
          loading="lazy"
        />
        <img
          v-else
          :src="resultRecipe.image.url"
          :alt="resultRecipe.mealName"
          loading="lazy"
        />
      </figure>
      <section class="underImage flex mgb1">
        <div class="userInfoRating flex mgb1">
          <button
            class="userInfo tooltipContainer"
            @click="allUserRecipes(resultRecipe.author._id)"
          >
            <p class="flex flexCenter">
              <img
                v-if="resultRecipe.author.user_image === undefined"
                :src="getDefaultUserImage"
                alt="user image"
                class="authorImage"
                loading="lazy"
              />
              <img
                v-else
                :src="resultRecipe.author.user_image.url"
                alt="user image"
                class="authorImage"
                loading="lazy"
              />
              <span class="authorUsername">{{
                resultRecipe.author.username
              }}</span>
            </p>
            <Tooltip :tooltipText="`See user's recipes`" />
          </button>
          <p class="rating">
            <font-awesome-icon :icon="['fa', 'star']" class="starIcon">
            </font-awesome-icon
            >&nbsp;&nbsp;{{ resultRecipe.rating }} /
            <span class="lightItalic">{{
              resultRecipe.rates.length
                ? resultRecipe.rates.length + ' votes'
                : 'not rated'
            }}</span>
          </p>
        </div>
        <span class="recipeDate">{{
          convertDate(resultRecipe.createdAt)
        }}</span>
        <p class="intro lightItalic">{{ resultRecipe.intro | sentenceCase }}</p>
      </section>
      <section class="additionalInfo flex mgb1">
        <p class="mgb1">
          <span class="slim">Vegetarian: </span>
          <font-awesome-icon
            :icon="
              resultRecipe.vegetarian ? ['fas', 'check'] : ['fas', 'times']
            "
            :class="
              resultRecipe.vegetarian
                ? 'additionalIcons check'
                : 'additionalIcons times'
            "
          ></font-awesome-icon>
        </p>
        <p class="mgb1">
          <span class="slim">Gluten Free: </span
          ><font-awesome-icon
            :icon="
              resultRecipe.glutenFree ? ['fas', 'check'] : ['fas', 'times']
            "
            :class="
              resultRecipe.glutenFree
                ? 'additionalIcons check'
                : 'additionalIcons times'
            "
          ></font-awesome-icon>
        </p>
        <p v-if="resultRecipe.regional" class="mgb1">
          <span class="slim">Regional: </span
          >{{ resultRecipe.regional | titleCase }}
        </p>
        <p class="mgb1">
          <span class="slim">Dish Type: </span
          >{{ resultRecipe.dishType | titleCase }}
        </p>
      </section>
      <section class="ingredients flex mgb1">
        <h3 class="mgb1">Ingredients:</h3>
        <ul class="flex">
          <li
            v-for="ingred in resultRecipe.ingredients"
            :key="ingred.index"
            class="mgb1"
          >
            <span>{{ ingred.ingredient | sentenceCase }}</span
            ><span v-if="ingred.amount"> - </span>
            <span> {{ ingred.amount }}</span>
          </li>
        </ul>
      </section>
      <section class="directions flex mgb1">
        <h3 class="mgb1">Directions:</h3>
        <ol class="flex">
          <li
            v-for="(st, index) in resultRecipe.steps"
            :key="index"
            :data-number="index + 1"
            class="mgb1"
          >
            <p>{{ st.step | sentenceCase }}</p>
          </li>
        </ol>
      </section>
      <Comments
        :comments="resultRecipe.comments"
        :recipeId="this.$route.params.id"
        @updating="updateRecipe"
      />
    </div>
    <NotFound
      v-else-if="displayNotFound"
      :message="'No result for reqested recipe'"
    />
    <Loader v-else :bigLoader="true" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Comments from '../components/Comments/Comments'
import Tooltip from '../components/sharedComponents/Tooltip'
import dateFormat from './../mixins/dateFormat'
import apiCalls from './../mixins/apiCalls'
import titleCase from '../filters/titleCase'
import sentenceCase from '../filters/sentenceCase'
import axios from 'axios'
import { usersUrl } from '../apiData'

export default {
  name: 'SingleResult',
  components: {
    NotFound: () =>
      import(
        /* webpackPrefetch: true */ '../components/sharedComponents/NotFound.vue'
      ),
    Forms: () =>
      import(
        /* webpackPrefetch: true */ '../components/sharedComponents/Forms.vue'
      ),
    Loader: () =>
      import(
        /* webpackPrefetch: true */ '../components/sharedComponents/Loader.vue'
      ),
    Rating: () =>
      import(
        /* webpackPrefetch: true */ '../components/SingleResult/Rating.vue'
      ),
    InfoMessage: () =>
      import(
        /* webpackPrefetch: true */ '../components/sharedComponents/InfoMessage.vue'
      ),
    Comments,
    Tooltip
  },

  data() {
    return {
      ready: false,
      resultRecipe: {},
      message: '',
      messageStatus: false,
      displayNotFound: false
    }
  },

  async beforeCreate() {
    try {
      this.resultRecipe = {}
      const result = await this.$store.dispatch(
        'fetchSingleRecipe',
        this.$route.params.id
      )
      if (result) {
        this.resultRecipe = JSON.parse(JSON.stringify(this.getSingleRecipe))
        this.ready = true
      } else {
        this.displayNotFound = true
      }
    } catch (error) {
      console.log(error.message)
    }
  },

  computed: {
    ...mapActions(['fetchSingleRecipe']),
    ...mapGetters([
      'getSingleRecipe',
      'getDefaultImage',
      'getDefaultUserImage',
      'getCurrentUser',
      'getIsLogged',
      'getOpenSearch'
    ]),

    disableRecipeSaving() {
      if (!this.getIsLogged) {
        return true
      }
      const checkUserFavorites = this.getCurrentUser.favorites.filter(
        (fav) => fav === this.resultRecipe._id
      )
      if (checkUserFavorites.length) {
        return false
      } else {
        return true
      }
    },

    checkRatedBy() {
      if (this.getIsLogged) {
        return this.resultRecipe.rates.filter(
          (rate) => rate.ratedBy === this.getCurrentUser.userId
        )
      } else {
        return null
      }
    },

    disableRating() {
      if (!this.getIsLogged) {
        return true
      }
      if (
        this.getIsLogged &&
        (this.resultRecipe.author._id === this.getCurrentUser.userId ||
          this.checkRatedBy.length)
      ) {
        return false
      } else {
        return true
      }
    },

    userRate() {
      if (
        this.getIsLogged &&
        this.resultRecipe.author._id !== this.getCurrentUser.userId &&
        this.checkRatedBy.length
      ) {
        return this.checkRatedBy[0].rate
      } else {
        return null
      }
    }
  },

  mixins: [dateFormat, apiCalls],

  filters: {
    titleCase,
    sentenceCase
  },

  methods: {
    updateMessage(message) {
      this.message = message
    },

    updateMessageStatus(msgStatus) {
      this.messageStatus = msgStatus
    },

    ...mapMutations(['setOpenSearch']),
    setOpenSearch() {
      this.$store.commit('setOpenSearch')
    },

    async updateRecipe() {
      try {
        const result = await this.$store.dispatch(
          'fetchSingleRecipe',
          this.$route.params.id
        )
        if (result) {
          this.resultRecipe = Object.assign({}, this.getSingleRecipe)
          this.updateMessageStatus(true)
          this.updateMessage('Recipe has been rated')
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    async addToFavorites() {
      try {
        if (!this.getIsLogged) {
          this.updateMessageStatus(false)
          this.updateMessage('Login to save this recipe')
          return
        }
        const response = await axios.patch(
          `${usersUrl}/favorites/${this.getCurrentUser.userId}`,
          { favoriteId: this.resultRecipe._id }
        )
        if (response) {
          this.$store.dispatch('updateUser', response.data.updatedUser)
          this.updateMessageStatus(true)
          this.updateMessage(response.data.message)
        }
      } catch (error) {
        this.updateMessageStatus(false)
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 409)
        ) {
          console.log(error.response.data.message)
          this.updateMessage(error.response.data.message)
        } else {
          this.updateMessage(error.message)
          console.log(error.message)
        }
      }
    }
  },

  beforeDestroy() {
    if (this.getOpenSearch === true) this.setOpenSearch()
  }
}
</script>

<style lang="scss" scoped>
.singleResultWrapper {
  @include alignment($display: flex, $justify: center, $align: center);
  flex-direction: column;
  @include boxSize($width: 100%);
  background-color: $light;

  section,
  figure,
  h1 {
    @include boxSize($width: 100%);
  }

  section {
    border-bottom: 1px inset lightgray;
    @include alignment($direction: column, $align: flex-start);
    padding-bottom: 0.8rem;
    font-size: 0.9rem;
  }
  img {
    object-fit: cover;
  }
  h1 {
    @include fonts($color: darken($golden, 5%), $weight: 800);
    text-shadow: 0px 3px 3px rgba(255, 255, 255, 0.5);
    margin: 2rem auto;
  }

  h3 {
    color: darken($golden, 5%);
  }

  .favorites {
    @include alignment($align: center);
    flex-wrap: wrap;

    .addToFavorites,
    .changableSave {
      @include boxSize($width: 140px, $height: 40px);
    }

    .addToFavorites {
      @include fonts($color: $light, $size: 0.9rem);
      @include alignment($display: inline-block);
      background-color: #f1b3b3;
      background-image: linear-gradient(
        89.5deg,
        rgba(246, 114, 128, 0.9) 0.2%,
        rgba(248, 177, 149, 0.9) 90.6%
      );
      background-size: 600% 600%;
      animation: movingBackground 10s ease infinite;
      margin-bottom: 1rem;
      text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.82),
        0px -1px 0px rgba(151, 146, 146, 0.67);
      border-radius: 6px;

      span {
        margin-left: 0.3rem;
      }
    }

    // save recipe style
    .changableSave {
      &.heart {
        position: relative;
        @include boxSize($width: 100px, $height: 40px);
      }
      &.heart:before,
      &.heart:after {
        position: absolute;
        content: '';
        left: 20px;
        top: 0;
        @include boxSize($width: 20px, $height: 35px);
        background: #ec476b;
        border-radius: 50px 50px 0 0;
        transform: rotate(-45deg);
        transform-origin: 0 100%;
      }
      &.heart:after {
        left: 0;
        transform: rotate(45deg);
        transform-origin: 100% 100%;
      }

      span {
        position: absolute;
        text-align: left;
        @include fonts($size: 0.9rem, $color: lighten($graphite, 20%));
      }
    }
    // end save
    .userRating {
      @include boxSize($height: 40px);
      @include fonts($size: 0.9rem, $color: lighten($graphite, 20%));

      span,
      .starIcon {
        margin-left: 0.3rem;
      }

      span {
        @include fonts($color: lighten($graphite, 15%));
        text-shadow: #706f6f 1px 1px 0;
      }
    }

    .messageWrapper {
      @include boxSize($width: 100%, $height: 40px);
    }
  }

  .basicInfo {
    @include alignment($direction: row);
    @include fonts($color: $graphite);
    padding: 0.8rem;

    .info {
      margin-right: 1rem;
    }

    .mealIcons {
      color: gray;
      margin-right: 0.2rem;
    }
  }

  figure {
    @include boxSize($height: 270px);
    box-shadow: $shadowSmall;

    img {
      @include boxSize($width: 100%, $height: 100%);
    }
  }

  .underImage {
    @include boxSize($width: 100%);

    .userInfoRating {
      @include boxSize($width: 100%);
      @include alignment($justify: space-between, $align: center);

      .userInfo {
        display: block;
        background-color: transparent;
        color: #a3865b;
      }

      .authorImage {
        @include boxSize($width: 40px, $height: 40px);
        border-radius: 50%;
        margin-right: 0.5rem;
      }
    }

    .recipeDate {
      @include fonts($size: 0.8rem, $color: gray);
    }
    .intro {
      color: rgb(75, 72, 72);
      text-align: left;
    }

    .intro {
      margin-top: 0.7rem;
    }
  }

  .additionalInfo {
    @include fonts($size: 0.9rem);

    .additionalIcons {
      margin-left: 0.5rem;

      &.check {
        color: rgba(0, 128, 0, 0.733);
      }
      &.times {
        color: rgba(255, 0, 0, 0.699);
      }
    }
  }

  .ingredients {
    h3 {
      $color: darken($golden, 5%);
    }
    ul {
      @include alignment($direction: column, $align: flex-start);

      li {
        @include fonts($color: rgb(75, 72, 72));
        text-align: left;

        &::before {
          content: '\2726';
          margin-right: 0.5rem;
          //color: rgb(219, 86, 108);
          color: $golden;
        }
      }
    }
  }

  .directions {
    ol {
      @include alignment(
        $direction: column,
        $align: flex-start,
        $textAlign: left
      );

      li {
        @include fonts($color: rgb(75, 72, 72));
        line-height: 1.5;

        &::before {
          content: attr(data-number) '.';
          @include fonts($color: rgb(218, 113, 130), $weight: 800, $size: 2rem);
          margin-right: 0.5rem;
          line-height: 1.1;
        }
      }
    }
  }

  .comments {
    border-bottom: none;
  }
}

@media (min-width: 576px) {
  .singleResultWrapper {
    @include boxSize($width: 550px);

    figure {
      @include boxSize($width: 500px);
    }
  }
}

@media (min-width: 768px) {
  .singleResultWrapper {
    .favorites {
      @include alignment($direction: row, $justify: space-evenly);
      .addToFavorites {
        margin-bottom: 0;
      }
    }
  }
}

@media (min-width: 992px) {
  .singleResultContainer {
    background-image: $zinc;
  }
  .singleResultWrapper {
    @include boxSize($width: 900px, $maxWidth: initial);
    @include alignment($display: grid);
    padding: 1rem;
    grid-template-columns: 1fr 1fr 1fr 1fr 1.5fr;
    grid-template-rows: repeat(7, auto);
    grid-template-areas: 'title title title title title' 'favorites favorites favorites favorites favorites' 'basicInfo basicInfo basicInfo basicInfo basicInfo' 'photo photo photo photo additionalInfo' 'underImage underImage underImage underImage underImage' 'ingredients ingredients directions directions directions' 'comments comments comments comments comments';
    section {
      font-size: 1rem;
    }
    h1 {
      grid-area: title;
    }
    .favorites {
      grid-area: favorites;
    }
    .basicInfo {
      grid-area: basicInfo;
    }

    figure {
      grid-area: photo;
      @include boxSize($height: 400px, $width: 600px);
    }

    .underImage {
      grid-area: underImage;

      .userInfoRating {
        @include boxSize($width: 65%);
      }
    }

    .additionalInfo {
      grid-area: additionalInfo;
      border: none;
      align-self: start;
      font-size: 1.1rem;
    }

    .ingredients,
    .directions {
      border: none;
      height: 100%;
      margin-bottom: 0;
    }

    .ingredients {
      grid-area: ingredients;
      padding: 0.8rem 0.8rem 0.8rem 0;
    }

    .directions {
      grid-area: directions;
      padding: 0.8rem 0 0.8rem 1.4rem;

      ol li {
        p {
          line-height: 1.8;
        }
      }
    }

    .comments {
      grid-area: comments;
      border-top: 1px solid lightgray;
      padding-top: 2rem;
    }
  }
}
</style>
