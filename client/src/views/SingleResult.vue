<template>
  <div class="singleResultWrapper">
    <div v-if="this.ready" class="singleResultContainer">
      <h1>{{ recipe.mealName }}</h1>
      <p>
        <span>dish type: {{ recipe.dishType }}</span>
        <font-awesome-icon :icon="['fas', 'weight']" class="mealIcons">
        </font-awesome-icon>
        <span>{{ recipe.level }}</span>
        <font-awesome-icon :icon="['fas', 'users']" class="mealIcons">
        </font-awesome-icon>
        <span> {{ recipe.persons }}</span>
        <font-awesome-icon
          :icon="['far', 'clock']"
          class="mealIcons"
        ></font-awesome-icon>
        <span>timing: {{ recipe.timing }}</span>
        <span>vegeterian: {{ recipe.vegeterian }}</span>
        <span>gluten free: {{ recipe.glutenFree }}</span>
        <span>regional: {{ recipe.regional }}</span>
      </p>
      <figure>
        <img
          v-if="recipe.image === undefined"
          :src="getDefaultImage"
          :alt="recipe.mealName"
        />
        <img v-else :src="recipe.image.url" :alt="recipe.mealName" />
      </figure>
      <p>
        <span>{{ recipe.author.username }}</span>
        <img :src="recipe.author.user_image.url" alt="" />
        <span>{{ recipe.createdAt }}</span>
      </p>

      <p>{{ recipe.intro }}</p>
      <p>Ingredients</p>
      <div v-for="ingredient in recipe.ingredients" :key="ingredient.index">
        <p>{{ ingredient }}</p>
      </div>
      <p>Directions</p>
      <div v-for="step in recipe.steps" :key="step.index">
        <p>{{ step }}</p>
      </div>
      <section class="comments">
        <div v-for="comment in recipe.comments" :key="comment.index">
          <p>{{ comment.author.username }}</p>
          <p>{{ comment.commentBody }}</p>
          <p>{{ comment.createdAt }}</p>
        </div>
      </section>
    </div>
    <h1 v-else>No result for requested recipe</h1>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      ready: false,
      recipe: null,
    }
  },
  name: 'SingleResult',

  // resolve action promise beforeCreate
  async beforeCreate() {
    await this.$store.dispatch('fetchSingleRecipe', this.$route.params.id)
    this.recipe = Object.assign({}, this.getSingleRecipe)
    this.ready = true
  },

  computed: {
    ...mapActions(['fetchSingleRecipe']),
    ...mapGetters(['getSingleRecipe', 'getDefaultImage']),
  },
}
</script>

<style lang="scss" scoped></style>
