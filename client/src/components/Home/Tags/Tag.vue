<template>
  <figure class="tag flex flexCenter" @click="fetchTaggedRecipes">
    <img :src="tag.tagSrc" :alt="tag.tagName" class="block" />
    <figcaption>{{ tag.tagName }}</figcaption>
  </figure>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Tag',
  props: {
    tag: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapActions(['fetchQueriedRecipes'])
  },

  methods: {
    async fetchTaggedRecipes(params) {
      params = this.tag.tagParams
      console.log(params)
      try {
        await this.$store.dispatch('fetchQueriedRecipes', params)
        // this.$scrollTo('#searchResults', 200, { easing: 'linear', offset: -10 })
        this.$router.push({name: 'render_results'})
      } catch (error) {
        console.log(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
figure {
  @include alignment($direction: column);
  @include boxSize($width: 100px, $height: 100px);
  overflow: hidden;
  position: relative;
  box-shadow: $shadowSmall;
  cursor: pointer;
  // border: 2px inset lightgray;
  border-radius: 10px 0 10px 0;

  &:hover {
    filter: sepia(70%);
    // transform: scale(1.02);
    // transition: 0.5s;
  }

  img {
    @include boxSize($width: 100%, $height: 100%);
    object-fit: cover;
  }

  figcaption {
      position: absolute;
      bottom: 0;
      background-color: rgba(29, 28, 28, 0.774);
      @include fonts($color: #f1f1f1, $size: 0.8rem);
      color: #f1f1f1;
      width: 100%;
      padding: 0.2rem;
    }
}
</style>
