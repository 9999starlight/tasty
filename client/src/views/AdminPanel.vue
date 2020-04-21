<template>
  <div class="adminContainer container">
<h1>this is admin panel</h1>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
name:'adminpanel',

  computed: {
    ...mapGetters['getCurrentUser']
  }
}
</script>

<style>

</style>