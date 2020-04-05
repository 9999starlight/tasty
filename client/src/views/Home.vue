<template>
  <div class="container pd1">
    <h1>this is the HOME page</h1>
    <Popular />
    <div>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis veritatis
      quam, ipsam voluptate excepturi temporibus earum esse, quae, deserunt
      quaerat reprehenderit exercitationem dignissimos dolores! Suscipit
      architecto quos eos deserunt quidem! Tenetur quos ad aspernatur voluptas
      quidem dolor. Nesciunt quia maiores culpa sint cum officiis nisi eos minus
      ex, libero, quas recusandae, perspiciatis quisquam! Harum iure amet, nulla
      saepe excepturi vel.
    </div>
  </div>
</template>

<script>
import Popular from '../components/Popular'

export default {
  name: 'home',
  components: {
    Popular,
  },
}
</script>

<style lang="scss" scoped>
.container {
  @include boxSize($width: 100%, $height: 100%);
  margin: 0 auto;
}
</style>
