<template>
  <div class="container singleUserRecipes">
    <button @click="showForms = !showForms">Browse Recipes</button>
    <transition name="slide-down" mode="out-in">
      <Forms v-show="showForms" :renderPage="false" />
    </transition>
    <QueryResults />
  </div>
</template>

<script>
import QueryResults from '../components/sharedComponents/QueryResults/QueryResults'
import Forms from '../components/sharedComponents/Forms'
export default {
  name: 'render_results',
  components: {
    Forms,
    QueryResults
  },

  data() {
    return {
      showForms: false
    }
  }
}
</script>

<style lang="scss" scoped></style>
