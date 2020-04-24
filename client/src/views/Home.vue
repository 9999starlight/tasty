<template>
  <div class="container pd1">
    <Popular />
    <Tags />
    <BrowseRecipes class="browse"/>
    <BrowseResults />
  </div>
</template>

<script>
import Popular from '../components/homeComponents/Popular'
import BrowseRecipes from '../components/homeComponents/BrowseRecipes'
import BrowseResults from '../components/homeComponents/BrowseResults'
import Tags from '../components/homeComponents/Tags'
export default {
  name: 'home',
  components: {
    Popular,
    BrowseRecipes,
    BrowseResults,
    Tags
  },
}
</script>

<style lang="scss" scoped>
.browse {
  height: 350px;
}
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
