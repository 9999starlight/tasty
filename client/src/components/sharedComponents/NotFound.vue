<template>
  <div class="notFoundBox">
    <p>{{ message }}</p>
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
    margin: auto;
  }
</style>