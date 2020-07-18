<template>
  <div class="createRecipe flex flexCenter">
    <h1 id="createRecipeHeading" class="mg2">
      Create Recipe
    </h1>
    <div class="formWrapper">
      <CreateEditForm />
    </div>
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

  computed: {
    ...mapGetters(['getEditState'])
  }
}
</script>

<style lang="scss" scoped>
.createRecipe {
  @include alignment($direction: column);
  @include boxSize($width: 100%, $height: 100%);
  position: relative;

  h1 {
    font-family: 'Lobster', cursive;
    color: lighten($graphite, 20%);
    text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.3),
      0px -1px 0px rgba(0, 0, 0, 0.7);
  }

  .formWrapper {
    width: 100%;
  }
}

@media (min-width: 768px) {
  .formWrapper {
    max-width: 600px;
  }
}
@media (min-width: 992px) {
  .createRecipe {
    background: url('../../assets/backgrounds/rosemary.jpg') $backConfig;
    background-attachment: fixed;

    h1 {
      @include fonts($size: 2.2rem);
      background-color: $light;
    }
  }
}
</style>
