<template>
  <div
    :class="[
      getEditState
        ? 'adminContainer container disableScrolling'
        : 'adminContainer container'
    ]"
  >
    <AdminMenu />
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminMenu from '../components/AdminPanel/AdminMenu'

export default {
  name: 'adminpanel',

  components: {
    AdminMenu
  },

  computed: {
    ...mapGetters(['getCurrentUser', 'getEditState'])
  }
}
</script>

<style lang="scss" scoped>
.adminContainer {
  @include alignment($justify: flex-start);
  position: relative;
  margin-top: 0;
  padding: 0 0.5rem 0.5rem 0.5rem;
}
.disableScrolling {
  overflow: hidden;
}

@media (min-width: 768px) {
  .adminContainer {
    padding: 2rem 1rem 1rem 0;
  }

  .loaderContainer {
    margin-top: auto 0;
    @include boxSize($width: calc(100% - 4rem));
    align-self: flex-end;
}
}
</style>
