<template>
  <div class="tagsWrapper mg1">
    <h2>Popular Tags</h2>
    <button
      v-if="showButtons"
      class="leftSilde"
      @click="slideLeft"
      aria-label="slide left"
    >
      <font-awesome-icon
        :icon="['fa', 'angle-double-left']"
        font-size="15px"
        class="arrows"
      ></font-awesome-icon>
    </button>
    <button
      v-if="showButtons"
      class="rightSlide"
      @click="slideRight"
      aria-label="slide right"
    >
      <font-awesome-icon
        :icon="['fa', 'angle-double-right']"
        font-size="15px"
        class="arrows"
      ></font-awesome-icon>
    </button>
    <div
      :class="[
        moveLeft
          ? 'tagsInner flex moveLeft'
          : moveRight
          ? 'tagsInner flex moveRight'
          : 'tagsInner flex'
      ]"
    >
      <div
        class="tags flex flexCenter mg1"
        v-for="(tag, index) in tagData"
        :key="index"
      >
        <Tag :tag="tag" />
      </div>
    </div>
  </div>
</template>
<script>
import Tag from './Tag'
export default {
  name: 'Tags',
  components: {
    Tag
  },
  data() {
    return {
      tagData: [
        {
          tagName: 'Easy to prepare',
          tagSrc: require('@/assets/easy_tag.jpg'),
          tagParams: {
            level: 'easy'
          }
        },
        {
          tagName: 'Latest',
          tagSrc: require('@/assets/latest_tag.jpg'),
          tagParams: {
            sort: '-createdAt'
          }
        },
        {
          tagName: 'Highest rated',
          tagSrc: require('@/assets/popular_tag.jpg'),
          tagParams: {
            sort: '-rating'
          }
        },
        {
          tagName: 'Vegetarian',
          tagSrc: require('@/assets/vegetarian_tag.jpg'),
          tagParams: {
            vegetarian: true
          }
        },
        {
          tagName: 'Pasta',
          tagSrc: require('@/assets/pasta_tag.jpg'),
          tagParams: {
            dishType: 'pasta'
          }
        },
        {
          tagName: 'Chicken',
          tagSrc: require('@/assets/chicken_tag.jpg'),
          tagParams: {
            'ingredients.ingredient': 'chicken'
          }
        }
      ],
      moveLeft: false,
      moveRight: false,
      showButtons: false
    }
  },

  created() {
    window.addEventListener('load', this.buttonsDisplay)
    window.addEventListener('resize', this.buttonsDisplay)
  },

  destroyed() {
    window.removeEventListener('load', this.buttonsDisplay)
    window.removeEventListener('resize', this.buttonsDisplay)
  },

  methods: {
    buttonsDisplay() {
      if (window.innerWidth > 600) {
        this.moveRight = false
        this.moveLeft = false
        this.showButtons = false
      } else {
        this.showButtons = true
      }
    },

    slideLeft() {
      this.moveRight = false
      this.moveLeft = true
    },

    slideRight() {
      this.moveLeft = false
      this.moveRight = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tagsWrapper {
  position: relative;
  @include boxSize($width: 100vw, $height: 9rem);
  overflow: hidden;

  h2 {
    color: #a3865b;
  }

  .tagsInner {
    @include alignment($justify: space-evenly);
    width: min-content;
    transition: 0.8s;
  }
  .tags {
    @include boxSize($width: 70px, $height: 50px);
  }

  .leftSilde,
  .rightSlide {
    position: absolute;
    bottom: 0;
    margin-top: 1rem;
    cursor: pointer;
    font-size: 1.5rem;
    background-color: transparent;
    color: rgba(128, 128, 128, 0.712);
    z-index: 1;
    user-select: none;
    -moz-user-select: none;
    outline: none;
  }

  .leftSilde {
    left: 30vw;
  }

  .rightSlide {
    right: 30vw;
  }

  .moveLeft {
    margin-right: -300px;
  }

  .moveRight {
    margin-left: -300px;
  }
}

@media (min-width: 600px) {
  .tagsWrapper {
    position: relative;
    @include boxSize($width: initial, $height: initial);
    margin: 2rem auto;

    .tagsInner {
      width: auto;
      transition: 0.8s;
    }
  }
}

@media (min-width: 768px) {
  .tagsWrapper {
    .tags {
      @include boxSize($width: 90px, $height: 50px);
    }
  }
}

@media (min-width: 992px) {
  .tagsWrapper {
    text-align: center;
    @include boxSize($minWidth: 900px, $maxWidth: 1000px);

    .tags {
      @include boxSize($width: 100px, $height: 100px);
    }
  }
}

@media (min-width: 1200px) {
  .tagsWrapper {
    @include boxSize($width: 1000px);
  }
}
</style>
