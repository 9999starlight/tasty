<template>
  <div class="ratingContainer">
    <div v-show="ratingDropdown" class="overlay" @click="toggleRating"></div>
    <div class="ratingWrapper">
      <div @click="toggleRating" class="addRate flex flexCenter">
        <p class="flex flexCenter">
          Rate recipe &nbsp;<span class="starEntity">&#x2605;</span>
        </p>
      </div>
      <div
        v-show="ratingDropdown === true"
        class="starRatingDropdown flex flexCenter"
      >
        <div ref="stars" class="stars flex">
          <label v-for="(num, index) in 10" :key="index" :for="'star' + num">
            <input
              type="radio"
              name="star"
              :id="'star' + num"
              :value="num"
              v-model="rateValue"
            />
            <span
              tabindex="0"
              :id="num"
              class="sp"
              @mouseover="fillTheStars"
              @click="rateThisRecipe"
            ></span>
          </label>
        </div>
        <div class="rateCounterWrapper flex flexCenter">
          <span class="rateCounter">{{ rateValue }}/10</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import { recipesUrl } from '../../apiData'
export default {
  name: 'Rating',

  data() {
    return {
      ratingDropdown: false,
      rateValue: 1
    }
  },

  props: {
    resultRecipe: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(['getCurrentUser', 'getIsLogged'])

    /* disableRating() {
      const checkRatedBy = this.resultRecipe.rates.filter(
          (rate) => rate.ratedBy === this.getCurrentUser.userId)
      if (
        this.getIsLogged &&
        (this.resultRecipe.author._id === this.getCurrentUser.userId || checkRatedBy.length)
      ) {
        return false
      } else {
        return true
      }
    } */
  },

  methods: {
    toggleRating() {
      this.ratingDropdown = !this.ratingDropdown
    },

    fillTheStars(event) {
      // console.log(event.target)
      this.rateValue = Number(event.target.id)
      const stars = this.$refs.stars.children
      stars.forEach((child) => {
        if (Number(child.children[1].id) <= Number(event.target.id)) {
          child.children[1].classList.add('coloring')
        } else child.children[1].classList.remove('coloring')
      })
    },

    async rateThisRecipe() {
      try {
        if (!this.getIsLogged) {
          this.$emit('updateMsgStatus', false)
          this.$emit('updateMsg', 'Login to rate this recipe')
          this.ratingDropdown = false
          this.rateValue = 1
          return
        }
        /* // check if user already rated this recipe
        const checkRatedBy = this.resultRecipe.rates.filter(
          (rate) => rate.ratedBy === this.getCurrentUser.userId
        )
        if (checkRatedBy.length) {
          this.$emit('updateMsgStatus', false)
          this.$emit('updateMsg', 'You have already rated this recipe!')
          this.ratingDropdown = false
          this.rateValue = 1
          return
        } */
        this.ratingDropdown = false
        // update recipe rating
        const response = await axios.patch(
          `${recipesUrl}/rate/${this.resultRecipe._id}`,
          { rate: this.rateValue }
        )
        if (response) {
          this.rateValue = 1
          console.log(response)
          this.$emit('updateRating')
        }
      } catch (error) {
        this.$emit('updateMsgStatus', false)
        this.$emit('updateMsg', 'Something went wrong, try again later')
        console.log(error.response.data.error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ratingWrapper {
  position: relative;
  z-index: 4;

  .addRate,
  .starRatingDropdown {
    @include boxSize($width: 280px);
  }

  .addRate {
    @include boxSize($height: 40px);
    @include fonts($color: $light);
    background-color: lighten($graphite, 15%);
    border-bottom: 1px solid lighten($graphite, 50%);
    cursor: pointer;
  }

  .starRatingDropdown {
    @include alignment($justify: space-between);
    position: absolute;
    top: 40px;
    @include boxSize($height: 40px);
    background-color: lighten($graphite, 15%);

    .stars {
      @include alignment($justify: space-evenly);
      @include boxSize($width: 83%);
    }

    // star checkboxes
    label,
    input,
    span {
      display: inline-block;
    }

    label {
      position: relative;
      @include boxSize($width: 1.4rem, $height: 1.5rem);
      color: lightgray;

      input,
      span {
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
        outline: none;
      }

      input {
        visibility: hidden;
      }

      span {
        @include boxSize($width: 20px, $height: 20px);

        // stars empty and filled with shiny shadow effect
        &:after {
          content: ' \2606';
          position: absolute;
          animation: 1s pulse ease;
          transition: all 0.4s ease-out;
        }
        &:hover:after {
          color: lighten($graphite, 80%);
          text-shadow: 0 0 15px lighten($graphite, 90%);
        }
        // adding class for coloring previous stars mouseover
        &.coloring:after {
          content: ' \2605';
          color: yellow;
        }
      }

      input:checked ~ span:after {
        content: ' \2605';
        color: yellow;
      }
    }

    .rateCounterWrapper {
      @include fonts($color: white, $size: 0.8rem);
      @include boxSize($width: 15%, $height: 100%);
      background-color: lighten($graphite, 6%);
    }
  }
}

@media (min-width: 576px) {
  .ratingWrapper {
    .addRate,
    .starRatingDropdown {
      @include boxSize($width: 350px);
    }

    .starRatingDropdown {
      label {
        font-size: 1.6rem;
        line-height: 0.8;
        margin-right: 0.3rem;
      }

      .rateCounter {
        @include fonts($size: 1rem);
      }
    }
  }
}
</style>
