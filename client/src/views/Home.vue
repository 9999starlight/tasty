<template>
  <div class="homeContainer container">
    <Popular />
    <Tags />
    <Forms class="browse" />
  </div>
</template>

<script>
import Popular from '../components/Home/Popular/Popular'
import Forms from '../components/sharedComponents/Forms'
import Tags from '../components/Home/Tags/Tags'

export default {
  name: 'home',
  components: {
    Popular,
    Forms,
    Tags
  }
}
</script>

<style lang="scss" scoped>
.browse {
  height: 350px;
}
</style>
