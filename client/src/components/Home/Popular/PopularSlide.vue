<template>
  <div class="slideContainer">
    <div class="carouselItem">
      <router-link
        :to="{ name: 'SingleResult', params: { id: recipe._id } }"
        tag="div"
        class="link"
      >
        <figure id="slideContainer">
          <transition name="fade" v-on:leave="leave">
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
          <figcaption>
            {{ recipe.mealName }}
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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

  methods: {
    leave(el) {
      el.style.opacity = 0
      el.duration = 1500
    }
  }
}
</script>

<style lang="scss" scoped>
.slideContainer {
  position: relative;
  figure {
    @include boxSize($height: 250px, $width: 300px);
    overflow: hidden;

    figcaption {
      position: absolute;
      bottom: 0;
      background-color: rgba(29, 28, 28, 0.774);
      @include fonts($color: $white);
      @include boxSize($width: 100%);
      padding: 1.3rem;

      span {
        display: inline-block;
        margin-left: 0.7rem;
        @include fonts($size: 0.8rem, $color: rgb(197, 195, 195));
      }
    }
  }
}

@media (min-width: 500px) {
  .slideContainer {
    figure {
      @include boxSize($width: 400px, $height: 300px);
    }
  }
}

/* @media (min-width: 776px) {
  .slideContainer {
    figure {
      @include boxSize($height: 500px);
    }
  }
} */
/* @media (min-width: 992px) {
  .slideContainer {
    figure {
      @include boxSize($width: 400px);
    }
  }
}  */
</style>
