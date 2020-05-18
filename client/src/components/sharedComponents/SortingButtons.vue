<template>
  <div class="sortingButtonsWrapper flex flexCenter">
    <div class="buttonPair">
      <button class="sortBtn btnAsc" @click="$emit('sortTitleAsc')">
        A-Z<font-awesome-icon
          :icon="['fa', 'arrow-down']"
          class="arrow"
        ></font-awesome-icon>
      </button>
      <button class="sortBtn btnDesc" @click="$emit('sortTitleDesc')">
        A-Z<font-awesome-icon
          :icon="['fa', 'arrow-up']"
          class="arrow"
        ></font-awesome-icon>
      </button>
    </div>
    <div class="buttonPair">
      <button class="sortBtn btnAsc" @click="$emit('sortDateAsc')">
        Date<font-awesome-icon
          :icon="['fa', 'arrow-down']"
          class="arrow"
        ></font-awesome-icon>
      </button>
      <button class="sortBtn btnDesc" @click="$emit('sortDateDesc')">
        Date<font-awesome-icon
          :icon="['fa', 'arrow-up']"
          class="arrow"
        ></font-awesome-icon>
      </button>
    </div>
    <div class="buttonPair">
      <button class="sortBtn btnAsc" @click="$emit('sortRatingAsc')">
        Rating<font-awesome-icon
          :icon="['fa', 'arrow-down']"
          class="arrow"
        ></font-awesome-icon>
      </button>
      <button class="sortBtn btnDesc" @click="$emit('sortRatingDesc')">
        Rating<font-awesome-icon
          :icon="['fa', 'arrow-up']"
          class="arrow"
        ></font-awesome-icon>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SortingButtons'
}
</script>

<style lang="scss" scoped>
.sortingButtonsWrapper {
  @include boxSize($width: 100%);
  @include alignment($justify: space-evenly);
  margin: 1rem 0;
  .buttonPair {
    @include boxSize($width: 33.3%);

    .sortBtn {
      @include boxSize($width: 90px, $height: 30px);
      box-shadow: $shadowSmall;
      //margin: 0.3rem 0;

      &:focus {
          //background-color: $graphite, 10%;
          outline: 1px inset saturate($lightOrange, 80%);
          box-shadow: 0 5px gray;
          color: $lightOrange;
      }

      &.btnAsc {
        background-color: lighten($graphite, 20%);
        @include fonts($color: $white);
        border: 2px inset $white;
        margin-bottom: 0.1rem;
      }

      &.btnDesc {
        background-color: $white;
        @include fonts($color: lighten($graphite, 20%));
        border: 2px inset lighten($graphite, 20%);
      }

      .arrow {
        margin-left: 0.3rem;
      }
    }
  }
}
@media (min-width: 776px) {
  .sortingButtonsWrapper {
    @include boxSize($maxWidth: 750px);
    .buttonPair {
      .sortBtn:hover {
          transform: scale(1.02);
          transition: 0.5s;
      }
    }
  }
}
</style>
