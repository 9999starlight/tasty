<template>
  <div class="singleQuery mgb1">
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
      </figure>
      <h4 class="mealName">{{ recipe.mealName }}</h4>
      <p class="rating">
        <font-awesome-icon :icon="['fa', 'star']" class="starIcon">
        </font-awesome-icon
        >&nbsp;{{ recipe.rating }}
      </p>
      <div class="author flex flexCenter">
        <img
          :src="recipe.author.image"
          :alt="recipe.author.username"
          class="block"
        /><span>{{ recipe.author.username }}</span>
      </div>
      <p class="intro">{{ recipe.intro }}</p>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SingleQueryResult',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(['getDefaultImage'])
  }
}
</script>

<style lang="scss" scoped>
.singleQuery {
  @include boxSize($width: 100%);
  box-shadow: $shadowBox;

  .recipeLink {
    @include boxSize($width: 90%);
    @include alignment($justifyGrid: center, $align: center);
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: 1fr, 1.5fr;
    grid-template-areas:
      'figure mealName'
      'figure rating'
      'figure author'
      'intro intro';
    cursor: pointer;

    &:hover {
      filter: brightness(40%);
    }

    figure {
      @include boxSize($width: 100px, $height: 100px);
      margin: 0.5rem 0;
      grid-area: figure;
      img {
        @include boxSize($width: 100px, $height: 100px);
        object-fit: cover;
      }
    }

    .mealName {
      grid-area: mealName;
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
      .starIcon {
        @include fonts($color: rgba(236, 214, 13, 0.973), $size: 0.9rem);
      }
    }
  
    .intro {
      grid-area: intro;
      @include fonts($color: gray, $size: 0.9rem, $style: italic);
    }
  }
}
</style>
