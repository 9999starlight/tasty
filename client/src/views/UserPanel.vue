<template>
  <div
    :class="[
      getEditState
        ? 'userPanel container disableScrolling'
        : 'userPanel container'
    ]"
    ref="user_panel"
    v-if="getIsLogged === true"
  >
    <!-- <h1 class="mg1">Welcome {{ getCurrentUser.username }}</h1> -->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'userpanel',

  computed: {
    ...mapGetters(['getIsLogged', 'getCurrentUser', 'getEditState'])
  }
}
</script>

<style lang="scss" scoped>
.userPanel {
  padding: 0;
}
</style>
