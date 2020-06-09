<template>
  <div class="errorContainer container">
    <div class="flex flexCenter">
      <h1>ERROR 404</h1>
      <font-awesome-icon
        :icon="['fa', 'heart-broken']"
        class="sadIcon mg2"
      ></font-awesome-icon>
      <h4>PAGE NOT FOUND</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error404'
}
</script>

<style lang="scss" scoped>
.errorContainer {
  margin: 0;
  @include background(
    $lightFilter,
    url('../assets/backgrounds/pots.jpg'),
    $backConfig
  );
  color: $light;
  div {
    @include alignment($direction: column);
  }
  .sadIcon {
    @include fonts($size: 3rem, $weight: 800);
  }
  h1 {
    @include fonts($size: 2rem, $weight: 800);
    letter-spacing: 0.5rem;
  }
}
@media (min-width: 768px) {
  .errorContainer {
    .sadIcon {
      @include fonts($size: 4rem);
    }
    h1 {
      @include fonts($size: 4rem);
      letter-spacing: 1rem;
    }
  }
}
</style>
