<template>
  <div class="popularWrapper center">
    <div
      v-if="this.ready"
      class="carouselContainer"
    >
      <button
        class="carouselBtn btnLeft"
        @click="previousRecipe"
      >&nbsp;<font-awesome-icon
          :icon="['fa', 'chevron-circle-left']"
          font-size="15px"
          class="arrows"
        ></font-awesome-icon></button>
      <transition name="fade">
        <div
          class="carouselItem"
          ref="slide"
        >
          <router-link
            :to="{ name: 'SingleResult', params: {id: recipesArray[currentRecipe]._id } }"
            tag="div"
            class="link"
          >
            <figure id="slideContainer">
              <img
                :src="recipesArray[currentRecipe].image === undefined ? defaultImage : recipesArray[currentRecipe].image"
                :alt="recipesArray[currentRecipe].mealName"
              >
              <figcaption>{{ recipesArray[currentRecipe].mealName }} {{ recipesArray[currentRecipe].rating }}</figcaption>
            </figure>
          </router-link>
        </div>
      </transition>
      <button
        class="carouselBtn btnRight"
        @click="nextRecipe"
      >&nbsp;<font-awesome-icon
          :icon="['fa', 'chevron-circle-right']"
          font-size="15px"
          class="arrows"
        ></font-awesome-icon></button>
    </div>
    <figure v-else>
      <img
        :src="defaultImage"
        alt="our menu"
      >
    </figure>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      ready: false,
      recipesArray: [],
      currentRecipe: 0
    };
  },

  name: "Popular",

  // resolve action promise in beforeCreate
  async beforeCreate() {
    try {
      await this.$store.dispatch("fetchPopularRecipes");
      this.recipesArray = [...this.fetchedRecipes];
      this.ready = true;
      this.slideTimeout();
      console.log(this.recipesArray);
    } catch (error) {
      console.log(error.message);
    }
  },

  destroyed() {
    clearInterval(this.timing);
  },

  computed: {
    ...mapActions(["fetchPopularRecipes"]),
    ...mapGetters(["fetchedRecipes", "defaultImage"])
  },

  methods: {
    slideTimeout() {
      this.timing = setInterval(() => {
        this.nextRecipe();
      }, 4000);
    },

    nextRecipe() {
      this.currentRecipe++;
      if (this.currentRecipe === this.recipesArray.length) {
        this.currentRecipe = 0;
      }
      this.$refs.slide = this.recipesArray[this.currentRecipe];
    },

    previousRecipe() {
      this.currentRecipe--;
      if (this.currentRecipe < 0) {
        this.currentRecipe = this.recipesArray.length - 1;
      }
      this.$refs.slide = this.recipesArray[this.currentRecipe];
    }
  }
};
</script>

<style lang="scss" scoped>
.popularWrapper {
  border: 1px solid black;
  .carouselContainer {
    position: relative;
    figure {
      @include boxSize($height: 300px);
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

    .carouselBtn {
      cursor: pointer;
      font-size: 30px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background-color: transparent;
      color: rgba(128, 128, 128, 0.712);
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

@media (min-width: 500px) {
  .popularWrapper {
    .carouselContainer {
      figure {
        @include boxSize($height: 400px);
      }
    }
  }
}

@media (min-width: 776px) {
  .popularWrapper {
    @include boxSize($width: 80%);
    .carouselContainer {
      figure {
        @include boxSize($height: 500px);
      }
    }
  }
}

@media (min-width: 996px) {
  .popularWrapper {
    @include boxSize($width: 60%);
    .carouselContainer {
      figure {
        @include boxSize($height: 400px);
      }
      .arrows {
        @include fonts($size: 2.5rem);
      }
    }
  }
}

@media (min-width: 996px) {
  .popularWrapper {
    //@include boxSize($width: 60%);
    .carouselContainer {
      figure {
        @include boxSize($height: 500px);
      }
    }
  }
}
</style>