<template>
  <div class="singleResultWrapper container">
    <Loader v-if="isLoading" />
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
      <div v-for="ingred in recipe.ingredients" :key="ingred.index">
        <p>
          {{ ingred.ingredient }} <span>{{ ingred.amount }}</span>
        </p>
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
import loaderMixin from '../mixins/loaderMixin'
import Loader from '../components/Loader'
export default {
  data() {
    return {
      ready: false,
      recipe: null
    }
  },
  name: 'SingleResult',
  components: {
    Loader
  },

  async mounted() {
    try {
        this.toggleLoader()
        const res = await this.$store.dispatch('fetchSingleRecipe', this.$route.params.id)
        // console.log(res)
        if(res) {
        this.recipe = Object.assign({}, this.getSingleRecipe)
        this.ready = true
        }
        this.toggleLoader()
      } catch (error) {
        console.log(error.message)
      }
  },

  mixins: [loaderMixin],
/* 
  watch: {
    $route: 'fetchRecipe'
  },
 */
  computed: {
    ...mapActions(['fetchSingleRecipe']),
    ...mapGetters(['getSingleRecipe', 'getDefaultImage'])
  },

  /* methods: {
    async fetchRecipe() {
      try {
        this.toggleLoader()
        // console.log('SingleResult param id: ', this.$route.params.id)
        await this.$store.dispatch('fetchSingleRecipe', this.$route.params.id)
        this.recipe = Object.assign({}, this.getSingleRecipe)
        this.toggleLoader()
        this.ready = true
      } catch (error) {
        console.log(error.message)
      }
    }
  } */
}
</script>

<style lang="scss" scoped></style>
