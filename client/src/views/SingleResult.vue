<template>
  <div class="singleResultWrapper container">
    <Loader v-if="isLoading" />
    <div v-if="getSuccess" class="singleResultContainer">
      <h1>{{ getSingleRecipe.mealName }}</h1>
      <p>
        <span>dish type: {{ getSingleRecipe.dishType }}</span>
        <font-awesome-icon :icon="['fas', 'weight']" class="mealIcons">
        </font-awesome-icon>
        <span>{{ getSingleRecipe.level }}</span>
        <font-awesome-icon :icon="['fas', 'users']" class="mealIcons">
        </font-awesome-icon>
        <span> {{ getSingleRecipe.persons }}</span>
        <font-awesome-icon
          :icon="['far', 'clock']"
          class="mealIcons"
        ></font-awesome-icon>
        <span>timing: {{ getSingleRecipe.timing }}</span>
        <span>vegeterian: {{ getSingleRecipe.vegeterian }}</span>
        <span>gluten free: {{ getSingleRecipe.glutenFree }}</span>
        <span>regional: {{ getSingleRecipe.regional }}</span>
      </p>
      <figure>
        <img
          v-if="getSingleRecipe.image === undefined"
          :src="getDefaultImage"
          :alt="getSingleRecipe.mealName"
        />
        <img
          v-else
          :src="getSingleRecipe.image.url"
          :alt="getSingleRecipe.mealName"
        />
      </figure>
      <p>
        <span>{{ getSingleRecipe.author.username }}</span>
        <img :src="getSingleRecipe.author.user_image.url" alt="" />
        <span>{{ getSingleRecipe.createdAt }}</span>
      </p>

      <p>{{ getSingleRecipe.intro }}</p>
      <p>Ingredients</p>
      <div v-for="ingred in getSingleRecipe.ingredients" :key="ingred.index">
        <p>
          {{ ingred.ingredient }} <span>{{ ingred.amount }}</span>
        </p>
      </div>
      <p>Directions</p>
      <div v-for="step in getSingleRecipe.steps" :key="step.index">
        <p>{{ step }}</p>
      </div>
      <section class="comments">
        <div v-for="comment in getSingleRecipe.comments" :key="comment.index">
          <p>{{ comment.author.username }}</p>
          <p>{{ comment.commentBody }}</p>
          <p>{{ comment.createdAt }}</p>
        </div>
      </section>
    </div>
    <div class="messagewrapper" v-else>
      <NotFound :message="'No result for reqested recipe'" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import loaderMixin from '../mixins/loaderMixin'
import Loader from '../components/sharedComponents/Loader'
import NotFound from '../components/sharedComponents/NotFound'
export default {
  name: 'SingleResult',
  components: {
    Loader,
    NotFound
  },

  async mounted() {
    try {
      this.toggleLoader()
      await this.$store.dispatch('fetchSingleRecipe', this.$route.params.id)
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
    ...mapGetters(['getSingleRecipe', 'getDefaultImage', 'getSuccess'])
  }
}
</script>

<style lang="scss" scoped></style>
