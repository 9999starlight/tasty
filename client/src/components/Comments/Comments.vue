<template>
  <section class="comments mgt2">
    <h2 class="mgb1">Comments:</h2>
    <h3 v-if="!comments.length" class="lightItalic mg1">Not Commented Yet</h3>
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

<style></style>
