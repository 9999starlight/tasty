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
            />
            <img
              v-else
              :src="recipe.image"
              :key="recipe._id"
              :alt="recipe.mealName"
            />
          </transition>
          <figcaption>{{ recipe.mealName }} {{ recipe.rating }}</figcaption>
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
      required: true,
    },
  },

  computed: {
    ...mapGetters(['getDefaultImage']),
  },

  methods: {
    leave(el) {
      el.style.opacity = 0
      el.duration = 1500
    },
  },
}
</script>

<style lang="scss" scoped>
.slideContainer {
  position: relative;
  figure {
    @include boxSize($height: 300px);
    overflow: hidden;
    img {
      @include boxSize($width: 100%, $height: 100%);
      object-fit: cover;
    }
    figcaption {
      position: absolute;
      bottom: 0;
      background-color: rgba(29, 28, 28, 0.774);
      color: #f1f1f1;
      width: 100%;
      padding: 1.3rem;
    }
  }
}

@media (min-width: 500px) {
  .slideContainer {
    figure {
      @include boxSize($height: 400px);
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
@media (min-width: 996px) {
  .slideContainer {
    figure {
      @include boxSize($height: 400px);
    }
  }
}

@media (min-width: 996px) {
  .slideContainer {
    figure {
      @include boxSize($height: 500px);
    }
  }
}
</style>
