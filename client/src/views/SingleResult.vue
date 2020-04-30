<template>
  <div class="singleResultContainer container">
    <div v-if="ready" class="singleResultWrapper">
      <h1 class="mgb1">{{ resultRecipe.mealName }}</h1>
      <section class="favorites">
        <button class="addToFavorites">addd favorites</button>
        <button class="addRate">rate recipe</button>
      </section>
      <section class="basicInfo flex mgb1">
        <span
          ><font-awesome-icon :icon="['fas', 'weight']" class="mealIcons">
          </font-awesome-icon>
          {{ resultRecipe.level }}</span
        >
        <span
          ><font-awesome-icon :icon="['fas', 'users']" class="mealIcons">
          </font-awesome-icon>
          {{ resultRecipe.persons }}</span
        >
        <span
          ><font-awesome-icon
            :icon="['far', 'clock']"
            class="mealIcons"
          ></font-awesome-icon>
          {{ resultRecipe.timing }}</span
        >
      </section>
      <figure class="mgb1">
        <img
          v-if="resultRecipe.image === undefined"
          :src="getDefaultImage"
          :alt="resultRecipe.mealName"
        />
        <img
          v-else
          :src="resultRecipe.image.url"
          :alt="resultRecipe.mealName"
        />
      </figure>
      <section class="underImage flex mgb1">
        <p class="userInfo flex flexCenter mgb1">
          <img
            v-if="resultRecipe.author.user_image.url"
            :src="resultRecipe.author.user_image.url"
            alt="user image"
            class="authorImage"
          />
          <img
            v-else
            :src="getDefaultUserImage"
            alt="user image"
            class="authorImage"
          />
          <span class="authorUsername">{{ resultRecipe.author.username }}</span>
        </p>
        <span class="recipeDate">{{ resultRecipe.createdAt }}</span>
        <p class="intro lightItalic">{{ resultRecipe.intro }}</p>
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
          <span class="slim">Regional: </span>{{ resultRecipe.regional }}
        </p>
        <p class="mgb1">
          <span class="slim">Dish Type: </span>{{ resultRecipe.dishType }}
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
            {{ ingred.ingredient }} <span>{{ ingred.amount }}</span>
          </li>
        </ul>
      </section>
      <section class="directions flex mgb1">
        <h3 class="mgb1">Directions:</h3>
        <ol class="flex">
          <li
            v-for="(step, index) in resultRecipe.steps"
            :key="index"
            :data-number="index + 1"
            class="mgb1"
          >
            <p>{{ step }}</p>
          </li>
        </ol>
      </section>
      <Comments
        :comments="resultRecipe.comments"
        :recipeId="this.$route.params.id"
      />
    </div>
    <div class="messagewrapper" v-else>
      <NotFound :message="'No result for reqested recipe'" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import NotFound from '../components/sharedComponents/NotFound'
import Comments from '../components/Comments/Comments'

export default {
  name: 'SingleResult',
  components: {
    NotFound,
    Comments
  },

  data() {
    return {
      ready: false,
      resultRecipe: {}
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
        this.resultRecipe = Object.assign({}, this.getSingleRecipe)
        this.ready = true
      }
    } catch (error) {
      console.log(error.message)
    }
  },

  computed: {
    ...mapActions(['fetchSingleRecipe']),
    ...mapGetters(['getSingleRecipe', 'getDefaultImage', 'getDefaultUserImage'])
  }
}
</script>

<style lang="scss" scoped>
.singleResultWrapper {
  @include alignment($display: flex, $justify: center, $align: center);
  flex-direction: column;
  // @include boxSize($maxWidth: 100vw);

  section {
    border-bottom: 1px inset rgb(209, 207, 207);
  }
  section,
  figure,
  h1 {
    @include boxSize($width: 100%);
  }

  section {
    @include alignment($direction: column, $align: flex-start);
    padding: 0.8rem;
  }
  img {
    object-fit: cover;
  }
  h1 {
    $color: $graphite;
  }

  .basicInfo {
    @include alignment($direction: row);
    @include fonts($color: $graphite);

    span {
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
      @include boxSize($width: 100%, $height: 270px);
    }
  }

  .underImage {
    .authorImage {
      @include boxSize($width: 40px, $height: 40px);
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    .recipeDate {
      color: gray;
    }
    .intro {
      margin-top: 0.7rem;
      color: rgb(75, 72, 72);
    }
  }

  .additionalInfo {
    @include fonts($size: 1.2rem);

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
    ul {
      @include alignment($direction: column, $align: flex-start);

      li {
        @include fonts($color: rgb(75, 72, 72), $size: 1.2rem);
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
        @include fonts($color: rgb(75, 72, 72), $size: 1.2rem);

        &::before {
          content: attr(data-number) '.';
          @include fonts($color: rgb(218, 113, 130), $weight: 800, $size: 2rem);
          margin-right: 0.5rem;
          line-height: 1.1;
        }
      }
    }
  }
}

@media (min-width: 996px) {
  .singleResultWrapper {
    @include boxSize($maxWidth: 1500px);

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
      @include boxSize($height: 400px);

      img {
        @include boxSize($height: 400px);
      }
    }

    .underImage {
      grid-area: underImage;
    }

    .additionalInfo {
      grid-area: additionalInfo;
    }

    .ingredients {
      grid-area: ingredients;
    }

    .directions {
      grid-area: directions;
    }

    .comments {
      grid-area: comments;
    }
  }
}
</style>
