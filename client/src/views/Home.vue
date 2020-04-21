<template>
  <div class="container pd1 grid">
    <h1>Popular recipes</h1>
    <Popular />
    <BrowseRecipes />
    <BrowseResults />
  </div>
</template>

<script>
import Popular from '../components/homeComponents/Popular'
import BrowseRecipes from '../components/homeComponents/BrowseRecipes'
import BrowseResults from '../components/homeComponents/BrowseResults'
export default {
  name: 'home',
  components: {
    Popular,
    BrowseRecipes,
    BrowseResults
  },
}
</script>

<style lang="scss" scoped>
/* .container {
  @include boxSize($width: 100%, $height: 100%);
  //margin: 0 auto;
  @include alignment($justifyGrid: center, $align: center)
} */

/* @media (min-width: 996px) {
  .container {

  }
} */
</style>
