<template>
  <div class="statisticBoxWrapper">
    <h2>{{ title }}</h2>
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

  data() {
    return {
      dataArray: [{name: 'broj 1', value: 9}, {name: 'broj 2', value: 7}, {name: 'broj 3', value: 5}, {name: 'broj 4', value: 4}, {name: 'broj 5', value: 3}],
      title: 'Lorem ipsum',
    }
  },

 /*  props: {
    dataArray: {
      type: Array,
      required: true
    },

    title: {
      type: String,
      required: true
    }
  }, */

  computed: {
    addPercentages() {
      const highestValue = this.dataArray[0].value
      //console.log(highestValue)
      const addWidth =  this.dataArray.map(data => ({...data, percentage: (data.value / highestValue) * 100  + '%'}))
      //console.log(addWidth)
      return addWidth
    }
  }
}
</script>

<style></style>
