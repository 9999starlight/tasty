<template>
  <div class="sortingButtonsWrapper">
    <div class="buttonPair">
      <button>A-Z<font-awesome-icon :icon="['fa', 'arrow-down']"></font-awesome-icon></button>
      <button>Z-A<font-awesome-icon :icon="['fa', 'arrow-up']"></font-awesome-icon></button>
      </div>
    <div class="buttonPair">
      <button>Date<font-awesome-icon :icon="['fa', 'arrow-down']"></font-awesome-icon></button>
      <button>Date<font-awesome-icon :icon="['fa', 'arrow-up']"></font-awesome-icon></button>
      </div>
    <div class="buttonPair">
      <button>Rating<font-awesome-icon :icon="['fa', 'arrow-down']"></font-awesome-icon></button>
      <button>Rating<font-awesome-icon :icon="['fa', 'arrow-up']"></font-awesome-icon></button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'SortingButtons'
}
</script>

<style lang="scss" scoped>
  
</style>
