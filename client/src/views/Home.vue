<template>
  <div class="homeContainer pd1">
    <Popular />
    <Tags />
    <BrowseRecipes class="browse" />
    <BrowseResults />
  </div>
</template>

<script>
import Popular from '../components/homeComponents/popular/Popular'
import BrowseRecipes from '../components/homeComponents/BrowseRecipes'
import BrowseResults from '../components/homeComponents/browseResults/BrowseResults'
import Tags from '../components/homeComponents/tags/Tags'
export default {
  name: 'home',
  components: {
    Popular,
    BrowseRecipes,
    BrowseResults,
    Tags
  }
}
</script>

<style lang="scss" scoped>
.browse {
  height: 350px;
}
.homeContainer {
  @include boxSize($width: 100%, $height: 100%);
  //margin: 0 auto;
  @include alignment(
    $display: flex,
    $direction: column,
    $justify: center,
    $align: center,
    $textAlign: center
  );
  margin-top: 2rem;
  flex: 1;
  overflow: auto;
}

@media (min-width: 996px) {
  .homeContainer {
    @include alignment($display: grid, $justifyGrid: center);
    grid-template-columns: repeat(2, 1fr, 1fr);
    grid-template-rows: repeat(3, 2fr, 1fr, auto);
    grid-template-areas: 'popular tags' 'forms forms' 'results results';
  }
}

@media (min-width: 1200px) {
  .homeContainer {
    justify-content: space-evenly;
  }
}
</style>
