<template>
  <div class="statisticBoxWrapper">
    <h3>{{ title }}</h3>
    <div class="barsWrapper">
      <StatisticBars
        v-for="(singleData, index) in addPercentages"
        :key="'data' + index"
        class="singleBar"
        :singleData="singleData"
      />
    </div>
  </div>
</template>

<script>
import StatisticBars from './StatisticBars'
export default {
  name: 'StatisticBox',

  components: {
    StatisticBars
  },

  props: {
    dataArray: {
      type: Array,
      required: true
    },

    title: {
      type: String,
      required: true
    }
  },

  computed: {
    addPercentages() {
      const addWidth = this.dataArray.map((data) => ({
        ...data,
        percentage: (data.value / this.dataArray[0].value) * 100 + '%'
      }))
      return addWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.statisticBoxWrapper {
  @include boxSize($width: 280px, $height: 240px);
  border: 1px solid lightgray;

  h3 {
    background-color: lighten($graphite, 20%);
    @include fonts($color: $light);
    margin: auto;
    @include boxSize($width: 100%);
    padding: 0.5rem;
  }

  .barsWrapper {
    padding: 0.5rem;
  }
}

@media (min-width: 576px) {
  .statisticBoxWrapper {
    @include boxSize($width: 320px);
  }
}

@media (min-width: 992px) {
  .statisticBoxWrapper {
    @include boxSize($width: 400px);
  }
}
</style>
