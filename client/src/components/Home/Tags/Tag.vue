<template>
  <figure class="tag flex flexCenter" @click="fetchTaggedRecipes">
    <img :src="tag.tagSrc" :alt="tag.tagName" class="block imageFit" />
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
      try {
        await this.$store.dispatch('fetchQueriedRecipes', params)
        this.$router.push({ name: 'render_results' })
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
  @include boxSize($width: 100%, $height: 100%);
  overflow: hidden;
  position: relative;
  box-shadow: $shadowSmall;
  cursor: pointer;

  &:hover {
    filter: sepia(70%);
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

@media (min-width: 992px) {
  figure {
    @include boxSize($width: 100px, $height: 100px);
    border-radius: 10px 0 10px 0;
  }
}
</style>
