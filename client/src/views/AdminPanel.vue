<template>
  <div class="adminContainer container">
    <AdminMenu />
    <Overview />
    <div class="adminRouterView" id="adminRouterView">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminMenu from '../components/AdminPanel/AdminMenu'
import Overview from '../components/AdminPanel/Overview'

export default {
  name: 'adminpanel',

  /* data() {
    return {
    }
  }, */

  components: {
    AdminMenu,
    Overview
  },

  computed: {
    ...mapGetters(['getCurrentUser', 'getDefaultUserImage'])
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

@media (min-width: 768px) {
  .adminContainer {
    padding: 2rem 1rem 1rem 0;
  }

  .adminRouterView {
    @include boxSize($width: calc(100% - 4rem));
    align-self: flex-end;
  }
}
</style>
