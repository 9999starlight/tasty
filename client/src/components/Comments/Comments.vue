<template>
  <section class="comments">
    <h2 class="mgb2">Comments:</h2>
    <h4 v-if="!comments.length" class="lightItalic mg1">Not Commented Yet</h4>
    <div
      v-for="singleComment in comments"
      :key="singleComment.index"
      class="flex flexCenter"
    >
      <Comment :singleComment="singleComment" />
    </div>
    <PostComment :recipeId="recipeId" @commentAdded="updateComments" />
  </section>
</template>

<script>
import Comment from './Comment'
import PostComment from './PostComment'
export default {
  name: 'Comments',
  components: {
    Comment,
    PostComment
  },
  props: {
    comments: {
      type: Array,
      required: true
    },
    recipeId: {
      type: String,
      required: true
    }
  },

  methods: {
    updateComments() {
      this.$emit('updating')
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  color: darken($golden, 5%);
}
</style>
