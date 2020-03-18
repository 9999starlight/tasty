<template>
  <div class="singleResultWrapper">
    <div v-if="this.ready" class="singleResultContainer">
    <h1>{{ singleRecipe.mealName }}</h1>
    <p>
      <span>dish type: {{ singleRecipe.dishType }}</span>
      <span>level: {{ singleRecipe.level }}</span>
      <span>persons: {{ singleRecipe.persons }}</span>
      <span>timing: {{ singleRecipe.timing }}</span>
      <span>vegeterian: {{ singleRecipe.vegeterian }}</span>
      <span>gluten free: {{ singleRecipe.glutenFree }}</span>
      <span>regional: {{ singleRecipe.regional }}</span>
    </p>
    <figure>
      <img
        :src="singleRecipe.image === undefined ? defaultImage : singleRecipe.image.url"
        :alt="singleRecipe.mealName"
      >
    </figure>
    <p>
      <span>{{ singleRecipe.author.username }}</span>
      <span>{{singleRecipe.createdAt}}</span>
      </p>

    <p>{{ singleRecipe.intro }}</p>
    <p>Ingredients</p>
    <div
      v-for="ingredient in singleRecipe.ingredients"
      :key="ingredient.index"
    >
      <p>{{ingredient}}</p>
    </div>
    <p>Directions</p>
    <div
      v-for="step in singleRecipe.steps"
      :key="step.index"
    >
      <p>{{step}}</p>
    </div>
    <div
      v-for="comment in singleRecipe.comments"
      :key="comment.index"
    >

    </div>
    </div>
    <h1 v-else>No result for requested recipe</h1>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return{
    ready: false
    }
  },
  name: 'SingleResult',

  // resolve action promise beforeCreate
   async beforeCreate() {
    await this.$store.dispatch('getSingleRecipe', this.$route.params.id)
    this.ready = true
  },

  computed: {
    ...mapActions(['getSingleRecipe']),
    ...mapGetters(['singleRecipe', 'defaultImage'])
  }
};
</script>

<style lang="scss" scoped>
</style>