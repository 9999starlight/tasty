<template>
  <div class="container">
    <h1>this is the USER PANEL page</h1>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'userpanel',

  computed: {
    ...mapGetters['getCurrentUser']
  }/* ,

  beforeRouteEnter(to, from, next) {
    let hasPermission = this.getCurrentUser
    console.log(hasPermission)
    if (!hasPermission.isAdmin) {
      next()
    } else
      next({
        name: 'error404' // back to safety route //
      })
  } */
}
</script>

<style lang="scss" scoped></style>
