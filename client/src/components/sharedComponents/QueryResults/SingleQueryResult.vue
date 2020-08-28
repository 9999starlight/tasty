<template>
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
        class="imageFit"
      />
      <img
        v-else
        :src="recipe.image"
        :key="recipe._id"
        :alt="recipe.mealName"
        class="imageFit"
      />
      <figcaption>{{ recipe.mealName | titleCase }}</figcaption>
    </figure>
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
    <p v-if="recipe.intro.length > 70" class="intro lightItalic pd1">
      {{ recipe.intro | shortenTheString | sentenceCase }}
    </p>
    <p v-else class="intro lightItalic pd1">
      {{ recipe.intro | sentenceCase }}
    </p>
  </router-link>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import titleCase from '../../../filters/titleCase'
import sentenceCase from '../../../filters/sentenceCase'

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
  },

  filters: {
    titleCase,
    sentenceCase,
    shortenTheString: function(str) {
      return str.substr(0, 70) + '...'
    }
  }
}
</script>

<style lang="scss" scoped>
.recipeLink {
  @include boxSize($width: 100%, $height: 430px);
  @include alignment($justifyGrid: center, $align: center);
  grid-template-rows: 2.3fr 1fr 1fr;
  grid-template-columns: repeat(2, 1fr);
  grid-template-areas:
    'figure figure'
    'intro intro'
    'author rating';
  background-color: $light;
  box-shadow: $shadowSmall;
  cursor: pointer;
  margin: 1rem 0;
  border-radius: 8px;

  figure {
    @include boxSize($width: 100%, $height: 290px);
    grid-area: figure;
    position: relative;
    overflow: hidden;
    border-radius: 8px 8px 0 0;
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
    color: darken($golden, 5%);

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

@media (min-width: 350px) {
  .recipeLink {
    @include boxSize($width: 310px);
  }
}

@media (min-width: 576px) {
  .recipeLink {
    margin: 1rem;

    figure {
      @include boxSize($height: 300px);
    }
  }
}

@media (min-width: 776px) {
  .recipeLink:hover figure img {
    transform: scale(1.1);
    transition: transform 0.4s ease-in-out;
    filter: brightness(90%);
  }
}
</style>
