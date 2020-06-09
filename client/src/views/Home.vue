<template>
  <div class="homeContainer pd1">
    <div class="popularTags flex flexCenter">
      <Popular />
      <Tags />
    </div>
    <Forms class="browse" />
    <!-- <QueryResults /> -->
<!--     <div id="rwContainer" class="rwContainer flex flexCenter">
    <router-view></router-view>
    </div>  -->
  </div>
</template>

<script>
import Popular from '../components/Home/Popular/Popular'
import Forms from '../components/sharedComponents/Forms'
//import QueryResults from '../components/sharedComponents/QueryResults/QueryResults'
import Tags from '../components/Home/Tags/Tags'

export default {
  name: 'home',
  components: {
    Popular,
    Forms,
    // QueryResults,
    Tags
  },

/*   methods: {
    viewResults() {
      //this.$router.push({ name: 'query_results' })
      this.$scrollTo('#rwContainer', 200, { easing: 'linear', offset: 0 })
    }
  } */
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

  .popularTags {
    @include alignment($direction: column);
    grid-area: popularTags;
  }

  .resultsWrapper {
    margin-top: 2rem;
  }
}

/* .rwContainer {
  @include boxSize($width: 100%, $height: 100%);
  //margin: 0 auto;
  @include alignment(
    $direction: column
  );
  grid-area: results;
} */

@media (min-width: 996px) {
  .homeContainer {
    @include alignment($display: grid, $justifyGrid: center);
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, auto);
    grid-template-areas: 'popularTags popularTags' 'forms forms';

    .popularTags {
      @include alignment($direction: row, $justify: space-evenly);
    }
  }
}

@media (min-width: 1200px) {
  .homeContainer {
    justify-content: center;

    .popularTags {
      @include boxSize($width: 1100px);
    }
  }
}
</style>
