<template>
  <div class="adminUsers">This is the admin users</div>
</template>

<script>
export default {
name: 'admin_users',
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