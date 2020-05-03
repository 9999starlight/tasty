<template>
  <div class="tagsWrapper mgt2">
    <h3 class="lightItalic">Popular Categories</h3>
    <div class="tagsInner flex">
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
          tagName: 'Pasta recipes',
          tagSrc: require('@/assets/pasta_tag.jpg'),
          tagParams: {
            dishType: 'pasta'
          }
        },
        {
          tagName: 'Chicken recipes',
          tagSrc: require('@/assets/chicken_tag.jpg'),
          tagParams: {
            'ingredients.ingredient': 'chicken'
          }
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.tagsWrapper {
  @include boxSize($maxWidth: 500px);
  grid-area: tags;
  .tagsInner {
    @include alignment($justify: space-evenly);
    flex-wrap: wrap;
    .tags {
      @include boxSize($width: 100px, $height: 100px);
    }
  }
}
@media (min-width: 992px) {
  .tagsWrapper {
    //@include boxSize($minWidth: 990px, $maxWidth: 1500px);
    text-align: center;
  }
}
</style>
