<template>
  <div class="adminRecipes">This is the recipes admin</div>
</template>

<script>
export default {
name: 'admin_recipes',

mounted() {
    this.$scrollTo('#adminRouterView', 200, {
      easing: 'linear',
      offset: 0
    })
  }
}
</script>

<style>

</style>