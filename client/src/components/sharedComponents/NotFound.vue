<template>
  <div class="notFoundBox pd2 mg2">
    <h3>{{ message }}</h3>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  props: {
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.notFoundBox {
  background-color: rgba(14, 13, 13, 0.507);

  h3 {
    @include fonts($color: $light, $weight: 700);
  }
}
</style>
