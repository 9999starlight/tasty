<template>
  <div :class="[!bigLoader ? 'loaderContainer flex flexCenter mg1': 'loaderContainer flex flexCenter mgAuto']">
    <div :class="[!bigLoader ? 'small progress' : 'large progress']">
      <div>Loading…</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Loader',

  props: {
    bigLoader: {
      type: Boolean
    }
  }
}
</script>
<style lang="scss" scoped>
.progress {
  position: relative;
  display: inline-block;
  @include boxSize($width: 5em, $height: 5em);
  margin: 0 0.5em;
  font-size: 12px;
  text-indent: 999em;
  overflow: hidden;
  animation: spinning 1s infinite steps(8);

  &.small {
    font-size: 6px;
    //margin: 1rem;
  }
  &.large {
    font-size: 15px;
  }

  &:before,
  &:after,
  & > div:before,
  & > div:after {
    content: '';
    position: absolute;
    top: 0;
    left: 2.25em; /* (container width - part width)/2  */
    width: 0.5em;
    height: 1.5em;
    border-radius: 0.2em;
    background: #eee;
    box-shadow: 0 3.5em #eee; /* container height - part height */
    transform-origin: 50% 2.5em; /* container height / 2 */
  }

  &:before {
    background: #555;
  }

  &:after {
    transform: rotate(-45deg);
    background: #777;
  }

  & > div:before {
    transform: rotate(-90deg);
    background: #999;
  }

  & > div:after {
    transform: rotate(-135deg);
    background: #bbb;
  }
}

.mgAuto {
  margin: auto;
}
</style>
