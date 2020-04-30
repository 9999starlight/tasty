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
    }, 4000)
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

<style lang="scss" scoped></style>
