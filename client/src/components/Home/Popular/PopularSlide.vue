<template>
  <router-link
    :to="{ name: 'SingleResult', params: { id: recipe._id } }"
    tag="div"
    class="singleRecipeSlide"
  >
    <figure
      id="slideContainer"
      @mouseenter="$emit('pauseSlides')"
      @mouseleave="$emit('resumeSlides')"
    >
      <transition name="fadePartial" mode="out-in">
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
      </transition>
      <figcaption class="flex flexCenter">
        <span
          ><strong>{{ recipe.mealName | titleCase }}</strong></span
        >
        <span>
          <font-awesome-icon :icon="['fa', 'star']" class="starIcon">
          </font-awesome-icon
          >&nbsp;&nbsp;{{ recipe.rating }} /
          {{
            recipe.rates.length ? recipe.rates.length + ' votes' : 'not rated'
          }}
        </span>
      </figcaption>
    </figure>
  </router-link>
</template>

<script>
import { mapGetters } from 'vuex'
import titleCase from '../../../filters/titleCase'

export default {
  name: 'PopularSlide',

  props: {
    recipe: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(['getDefaultImage'])
  },

  filters: {
    titleCase
  }
}
</script>

<style lang="scss" scoped>
.singleRecipeSlide {
  position: relative;
  box-shadow: $shadowBox;
  cursor: pointer;
  figure {
    @include boxSize($height: 250px, $width: 100%);
    overflow: hidden;

    figcaption {
      position: absolute;
      bottom: 0;
      background-color: rgba(29, 28, 28, 0.774);
      @include fonts($color: $light, $size: 0.8rem);
      @include boxSize($width: 100%, $height: 60px);

      span:nth-of-type(2) {
        display: inline-block;
        margin: 0 0.7rem;
        @include fonts($color: rgb(197, 195, 195));
        svg {
          @include fonts($size: inherit);
        }
      }
    }
  }
}

@media (min-width: 576px) {
  .singleRecipeSlide {
    figure {
      @include boxSize($height: 300px);

      figcaption {
        font-size: 1rem;
      }
    }
  }
}

@media (min-width: 776px) {
  .singleRecipeSlide {
    figure {
      @include boxSize($height: 400px);
      figcaption {
        @include fonts($size: 1.2rem);
      }
    }
  }
}
@media (min-width: 992px) {
  .singleRecipeSlide {
    figure {
      @include boxSize($height: 500px);
    }
  }
}
</style>
