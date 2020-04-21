<template>
  <div class="singleQuery">
    <router-link
      :to="{ name: 'SingleResult', params: { id: recipe._id } }"
      tag="div"
      class="link"
    >
      <figure>
        <img
          v-if="recipe.image === undefined"
          :src="getDefaultImage"
          :key="recipe._id"
          :alt="recipe.mealName"
        />
        <img
          v-else
          :src="recipe.image"
          :key="recipe._id"
          :alt="recipe.mealName"
        />
      </figure>
      <h2>{{ recipe.mealName }}</h2>
      <p>{{ recipe.rating }}</p>
      <p>{{ recipe.author.username }}</p>
      <p>{{ recipe.intro }}</p>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SingleQueryResult',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters(['getDefaultImage'])
  }
}
</script>

<style></style>
