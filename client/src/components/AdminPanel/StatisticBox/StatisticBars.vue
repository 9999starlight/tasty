<template>
  <div class="progress">
    <span>{{ singleData.name }}</span>
    <div class="barWrapper">
      <div class="barProgress flex" :style="{ width: singleData.percentage }">
        <span>{{ singleData.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatisticBars',

  props: {
    singleData: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.progress {
  span {
    display: inline-block;
    @include fonts($color: lighten($graphite, 5%), $size: 0.8rem);
    width: 100%;
    text-align: left;
  }
  .barWrapper {
    @include boxSize($width: 100%, $height: 0.8rem);
    background-color: rgb(211, 209, 209);
    margin-bottom: 0.3rem;
    border-radius: 1rem;

    .barProgress {
      @include boxSize($height: 0.8rem);
      @include alignment($justify: flex-end, $align: center);
      background-color: green;
      background: $blueGreenGradient;
      border-radius: 1rem;

      span {
        display: inline-block;
        @include fonts($color: $light, $size: 0.8rem, $weight: 700);
        margin-right: 0.7rem;
        width: 100%;
        text-align: right;
      }
    }
  }
}
</style>
