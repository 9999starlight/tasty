<template>
  <div class="barWrapper mgb1">
    <div class="barProgress flex" :style="{ width: singleData.percentage }"><span>{{ singleData.name }}</span><span>{{ singleData.value }}</span></div>
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
  .barWrapper {
    @include boxSize($width: 100%, $height: 30px);
    background-color: rgb(211, 209, 209);

    .barProgress {
      @include boxSize($height: 30px);
      @include alignment($justify: space-between);
      background-color: green;

        span {
          display: inline-block;
          @include fonts($color: $white);
        }
    }
  }
</style>