<template>
  <div class="popularWrapper flex">
        <h1 class="slim pd1">Popular recipes</h1>
    <div v-if="this.ready" class="carouselContainer">
      <button class="carouselBtn btnLeft" @click="nextRecipe">
        &nbsp;<font-awesome-icon
          :icon="['fa', 'chevron-circle-left']"
          font-size="15px"
          class="arrows"
        ></font-awesome-icon>
      </button>
      <PopularSlide v-bind:recipe="recipesArray[currentRecipe]" ref="slide" />
      <button class="carouselBtn btnRight" @click="previousRecipe">
        &nbsp;<font-awesome-icon
          :icon="['fa', 'chevron-circle-right']"
          font-size="15px"
          class="arrows"
        ></font-awesome-icon>
      </button>
    </div>
    <figure v-else>
      <img :src="getDefaultImage" alt="our menu" />
    </figure>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PopularSlide from './PopularSlide'
export default {
  data() {
    return {
      ready: false,
      recipesArray: [],
      currentRecipe: 0,
    }
  },

  name: 'Popular',
  components: {
    PopularSlide,
  },

  // resolve action promise in beforeCreate
  async beforeCreate() {
    try {
      await this.$store.dispatch('fetchSliderRecipes')
      this.recipesArray = [...this.getSliderRecipes]
      this.ready = true
      // console.log(this.recipesArray);
    } catch (error) {
      console.log(error.message)
    }
  },

  created() {
    this.slideInit()
  },

  destroyed() {
    clearInterval(this.timing)
  },

  computed: {
    ...mapActions(['fetchSliderRecipes']),
    ...mapGetters(['getSliderRecipes', 'getDefaultImage']),
  },

  methods: {
    slideInit() {
      this.timing = setInterval(() => {
        this.nextRecipe()
      }, 5000)
    },

    nextRecipe() {
      this.currentRecipe++
      if (this.currentRecipe === this.recipesArray.length) {
        this.currentRecipe = 0
      }
      this.$refs.slide = this.recipesArray[this.currentRecipe]
    },

    previousRecipe() {
      this.currentRecipe--
      if (this.currentRecipe < 0) {
        this.currentRecipe = this.recipesArray.length - 1
      }
      this.$refs.slide = this.recipesArray[this.currentRecipe]
    },
  },
}
</script>

<style lang="scss" scoped>
.popularWrapper {
  @include boxSize($maxWidth: 400px);
  @include alignment($direction: column);

  .carouselContainer {
    position: relative;
    box-shadow: $shadowBox;

    .carouselBtn {
      cursor: pointer;
      font-size: 30px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: transparent;
      color: rgba(128, 128, 128, 0.712);
      z-index: 1;
      //user-select: none;
      //-moz-user-select: none;

      &.btnLeft {
        left: 10px;
      }
      &.btnRight {
        right: 10px;
      }

      .arrows {
        background-color: transparent;
      }
    }
  }
}

/* @media (min-width: 776px) {
  .popularWrapper {
    @include boxSize($width: 80%);
  }
}
 */
/* @media (min-width: 996px) {
  .popularWrapper {
    @include boxSize($width: 70%);
    .carouselContainer {
      .arrows {
        @include fonts($size: 2.5rem);
      }
    }
  }
} */

/* @media (min-width: 996px) {
  .popularWrapper {
    //@include boxSize($width: 60%);
  }
} */
</style>
