<template>
  <div class="singleQuery">
    <router-link
      :to="{ name: 'SingleResult', params: { id: recipe._id } }"
      tag="div"
      class="recipeLink grid"
    >
      <figure>
        <img
          v-if="recipe.image === undefined"
          :src="getDefaultImage"
          :key="recipe._id"
          :alt="recipe.mealName"
          class="block"
        />
        <img
          v-else
          :src="recipe.image"
          :key="recipe._id"
          :alt="recipe.mealName"
          class="block"
        />
        <figcaption>{{ recipe.mealName }}</figcaption>
      </figure>
      <!-- <h4 class="mealName">{{ recipe.mealName }}</h4> -->
      <p class="rating">
        <font-awesome-icon :icon="['fa', 'star']" class="starIcon">
        </font-awesome-icon
        >&nbsp;{{ recipe.rating }} /
        {{ recipe.rates.length ? recipe.rates.length + ' votes' : 'not rated' }}
      </p>
      <div class="author flex flexCenter">
        <img
          v-if="recipe.author.image"
          :src="recipe.author.image"
          :alt="recipe.author.username"
          class="block"
        />
        <img
          v-else
          :src="defaultUserImage"
          :alt="recipe.author.username"
          class="block"
        />
        <span>{{ recipe.author.username }}</span>
      </div>
      <p class="intro lightItalic">{{ recipe.intro }}</p>
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'SingleQueryResult',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(['getDefaultImage']),
    ...mapState(['defaultUserImage'])
  }
}
</script>

<style lang="scss" scoped>
.singleQuery {
  @include boxSize($width: 100%);
  box-shadow: $shadowBox;

  .recipeLink {
    @include boxSize($width: 100%);
    @include alignment($justifyGrid: center, $align: center);
    grid-template-rows: 1.5fr 1.5fr 1.5fr 1fr 1fr;
    grid-template-columns: 1fr, 1fr;
    grid-template-areas:
      'figure figure'
      'figure figure'
      'figure figure'
      'intro intro'
      'author rating';
    cursor: pointer;

    figure {
      @include boxSize($width: 290px, $height: 290px);
      // margin: 0.5rem 0;
      grid-area: figure;
      position: relative;
      img {
        @include boxSize($width: 290px, $height: 290px);
        object-fit: cover;
      }
      figcaption {
        position: absolute;
        bottom: 0;
        background-color: rgba(29, 28, 28, 0.774);
        @include fonts($color: $light, $size: 1.2rem);
        @include boxSize($width: 100%);
        padding: 0.5rem;
      }
    }

    .author {
      grid-area: author;

      img {
        @include boxSize($width: 20px, $height: 20px);
        border-radius: 50%;
        margin-right: 10px;
      }
    }

    .rating {
      grid-area: rating;
      @include fonts($color: gray, $size: 0.9rem);
    }

    .intro {
      grid-area: intro;
      @include fonts($size: 0.9rem);
      text-align: left;
    }
  }
}

@media (min-width: 500px) {
  .singleQuery {
    .recipeLink {
      &:hover {
      filter: brightness(80%);
      }
      figure {
        @include boxSize($width: 320px, $height: 320px);
        img {
          @include boxSize($width: 320px, $height: 320px);
        }
      }
    }
  }
}
</style>
