<template>
    <p :class="!messageStatus ? 'error' : 'success'">{{ message }}</p>
</template>

<script>
export default {
  name: 'InfoMessage',

  data() {
    return {
      timeSet: null
    }
  },

  props: {
    message: {
      type: String,
      required: true
    },

    messageStatus: {
      type: Boolean,
      required: true
    }
  },

  created() {
    this.timeSet = setTimeout(() => {
      this.$emit('clear', '')
    }, 5000)
  },

  methods: {
    clear() {
      this.message = ''
    }
  },

  beforeDestroy() {
    clearTimeout(this.timeSet)
    this.timeSet = null
  }
}
</script>

<style lang="scss" scoped>
.error {
  @include fonts($color: crimson, $size: 0.8rem);
}

.success {
  @include fonts($color: green, $size: 0.8rem);
}

@media(min-width: 996px) {

  .error,
  .success {
    @include fonts($size: 1rem)
  }
}
</style>
