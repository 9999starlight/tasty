<template>
  <span class="tooltipBox">
    {{ tooltipText }}
  </span>
</template>
<script>
export default {
  name: 'Tooltip',
  props: {
    tooltipText: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.tooltipBox {
  display: none;
  position: absolute;
  bottom: 100%;
  transform: translateX(-50%);
  background-color: lighten($graphite, 10%);
  @include boxSize($minWidth: 200px, $maxWidth: 200px);
  border-radius: 8px;
  padding: 0.8rem;
  @include fonts($color: $light, $size: 0.9rem);
  transition: ease-in-out 0.3s;

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    right: 50%;
    transform: translateX(-50%);
    border: 0.5rem solid transparent;
    border-top-color: lighten($graphite, 10%);
  }
}
</style>
