<template>
  <div class="popularWrapper flex mgt2">
    <div v-if="this.ready" class="carouselContainer center">
      <h3 class="flex flexCenter">Highest rated recipes</h3>
      <button class="carouselBtn btnLeft" @click="previousRecipe">
        &nbsp;<font-awesome-icon
          :icon="['fa', 'chevron-circle-left']"
          font-size="15px"
          class="arrows"
        ></font-awesome-icon>
      </button>
      <button class="carouselBtn btnRight" @click="nextRecipe">
        &nbsp;<font-awesome-icon
          :icon="['fa', 'chevron-circle-right']"
          font-size="15px"
          class="arrows"
        ></font-awesome-icon>
      </button>
      <PopularSlide
        v-bind:recipe="recipesArray[currentRecipe]"
        ref="slide"
        @pauseSlides="stopSlider"
        @resumeSlides="slideInit"
      />
      <div class="carouselNav mgt1" ref="dots">
        <button
          @click="moveToSlide(index)"
          v-for="(btn, index) in recipesArray.length"
          :key="'btn' + index"
          :class="[
            index === currentRecipe
              ? 'carouselIndicator currentSlide'
              : 'carouselIndicator'
          ]"
        ></button>
      </div>
    </div>
    <figure v-else class="altImage">
      <img :src="getDefaultImage" alt="our menu" class="imageFit" />
    </figure>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PopularSlide from './PopularSlide'
import apiCalls from '../../../mixins/apiCalls'
export default {
  data() {
    return {
      ready: false,
      recipesArray: [],
      currentRecipe: 0
    }
  },

  name: 'Popular',
  components: {
    PopularSlide
  },

  mixins: [apiCalls],

  async created() {
    try {
      const fetchedRecipes = await this.fetchDbRecipes({ sort: '-rating' })
      if (fetchedRecipes) {
        this.recipesArray = fetchedRecipes.resultsArray.slice(0, 5)
        this.ready = true
        this.slideInit()
      }
    } catch (error) {
      console.log(error.message)
    }
  },

  destroyed() {
    this.stopSlider()
  },

  computed: {
    ...mapGetters(['getDefaultImage'])
  },

  methods: {
    slideInit() {
      this.timing = setInterval(() => {
        this.nextRecipe()
      }, 5000)
    },

    stopSlider() {
      clearInterval(this.timing)
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

    // Dot navigation
    moveToSlide(dotIndex) {
      this.currentRecipe = dotIndex
      this.$refs.slide = this.recipesArray[this.currentRecipe]
    }
  }
}
</script>

<style lang="scss" scoped>
.popularWrapper {
  @include boxSize($width: 100%);
  @include alignment($direction: column, $textAlign: center);

  .carouselContainer {
    position: relative;
    @include boxSize($width: 100%);
    h3 {
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(29, 28, 28, 0.664);
      @include fonts($color: $light, $weight: 100, $size: 1rem);
      @include boxSize($height: 60px);
      z-index: 1;
      padding: 0.8rem;
    }
    .carouselBtn {
      cursor: pointer;
      font-size: 30px;
      position: absolute;
      top: calc(50% - 60px);
      transform: translateY(-50%);
      background-color: transparent;
      color: rgba(128, 128, 128, 0.712);
      z-index: 1;
      user-select: none;
      -moz-user-select: none;
      outline: none;

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
  .carouselNav {
    /* background: pink; */
    display: flex;
    justify-content: center;
    padding: 1rem 0;
  }

  .carouselIndicator {
    border: 0;
    border-radius: 50%;
    width: 1.2rem;
    height: 1.2rem;
    background-color: gray;
    margin: 0 0.8rem;
    cursor: pointer;
    outline: none;
  }

  .carouselIndicator.currentSlide {
    background: rgb(49, 49, 49);
  }
}

.altImage {
  @include boxSize($height: 250px, $width: 100%);
}

@media (min-width: 576px) {
  .altImage {
    @include boxSize($height: 300px);
  }
}

@media (min-width: 768px) {
  .popularWrapper {
    .carouselContainer {
      h3 {
        @include fonts($size: 1.3rem);
      }
    }
  }
  .altImage {
    @include boxSize($height: 400px);
  }
}

@media (min-width: 992px) {
  .popularWrapper {
    @include boxSize($minWidth: 900px);
  }
  .altImage {
    @include boxSize($height: 500px);
  }
}

@media (min-width: 1200px) {
  .popularWrapper {
    @include boxSize($width: 1100px);
  }
}
</style>
