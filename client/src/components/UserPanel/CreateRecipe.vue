<template>
  <div class="createRecipe flex flexCenter">
    <h1 id="createRecipeHeading" class="mg1">
      {{ !getEditState ? 'Create new recipe' : 'Edit recipe' }}
    </h1>
    
    <CreateEditForm />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateEditForm from '../sharedComponents/CreateEditForm'

export default {
  name: 'create_recipe',

  components: {
    CreateEditForm
  },

  mounted() {
    this.$scrollTo('#createRecipeHeading', 200, {
      easing: 'linear',
      offset: 0
    })
  },

  computed: {
    ...mapGetters(['getEditState'])
  },

  async beforeRouteLeave(to, from, next) {
    try {
      await this.$store.dispatch('changeEditState', false)
      // await this.$store.dispatch('clearSingleRecipe', '')
      next()
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.createRecipe {
  @include alignment($direction: column);
  @include boxSize($width: 100%);
  h1 {
    font-family: 'Lobster', cursive;
    color: lighten($graphite, 20%);
  }
}
</style>
