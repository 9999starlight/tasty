<template>
  <div class="loderContainer">
     <div class="loader mg2"></div>
  </div>
</template>
<script>
export default {
  name: 'Loader'
}
</script>
<style lang="scss" scoped>
/* .loader {
  @include boxSize($width: 50px, $height: 50px);
  border-top: rgba(141, 241, 216, 0.308) 6px dotted;
  border-right: rgba(111, 240, 218, 0.61) 7px dotted;
  border-bottom: rgba(75, 240, 199, 0.719) 8px dotted;
  border-left: rgba(24, 235, 200, 0.884) 9px dotted;
  border-radius: 100%;
  animation: spinning 2s infinite linear;
} */
.loader {
  width: 50px;
  height: 50px;
  margin: 2rem 0;
  border: 2px solid #41f24a;
  border-top: 2px ridge #1b4e1d;
  border-radius: 100%;
  animation: spin 1s infinite linear;
}

@media(min-width: 768px) {
  .loader {
    width: 80px;
    height: 80px;
    margin: 3rem 0;
  }
}
</style>