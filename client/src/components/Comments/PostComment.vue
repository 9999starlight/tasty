<template>
  <section class="addComment flex flexCenter">
    <form class=" mgt1">
      <textarea
        v-model="commentText"
        name=""
        id=""
        placeholder="Add your comment here..."
        maxlength="300"
        required
        class="block center"
      ></textarea>
      <div class="messageWrapper flex flexCenter">
        <transition name="expand" mode="out-in">
          <InfoMessage
            v-if="postCommentMessage !== ''"
            :message="postCommentMessage"
            :messageStatus="messageStatus"
            @clear="updateMessage('')"
          />
        </transition>
      </div>
      <button
        type="submit"
        class="btnAction block hovEffect"
        @click.prevent="postUserComment"
      >
        <font-awesome-icon :icon="['fas', 'plus']"> </font-awesome-icon
        >&nbsp;Add Comment
      </button>
    </form>
  </section>
</template>

<script>
import InfoMessage from '../sharedComponents/InfoMessage'
import { commentsUrl } from '../../apiData'
import { mapGetters } from 'vuex'
import axios from 'axios'
export default {
  name: 'PostComment',
  components: {
    InfoMessage
  },
  data() {
    return {
      commentText: '',
      postCommentMessage: '',
      messageStatus: false
    }
  },
  props: {
    recipeId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters(['getCurrentUser', 'getIsLogged']),
    validateCommentText() {
      if (this.commentText.length === 0 || this.commentText.length > 300) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    updateMessage(message) {
      this.postCommentMessage = message
    },
    async postUserComment() {
      try {
        if (!this.getIsLogged) {
          this.messageStatus = false
          this.updateMessage('Login or Sign Up to post your comment!')
        } else {
          if (!this.validateCommentText) {
            this.messageStatus = false
            this.updateMessage('Maximum comment characters is 300')
          } else {
            const response = await axios.post(`${commentsUrl}`, {
              commentedRecipeId: this.recipeId,
              author: this.getCurrentUser.userId,
              commentBody: this.commentText
            })
            if (response.data) {
              this.messageStatus = true
              this.updateMessage('Comment posted successfully!')
              this.$emit('commentAdded')
              this.commentText = ''
            }
          }
        }
      } catch (error) {
        console.log(error.response.data.message)
        this.messageStatus = false
        this.updateMessage(error.response.data.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addComment {
  @include alignment($direction: column, $align: center);
  @include boxSize($maxWidth: 280px);

  margin: auto;
  form {
    @include boxSize($width: 100%);
  }
  textarea {
    resize: none;
    overflow: auto;
    @include boxSize($width: 100%, $height: 120px);
    border: 1px solid lightgray;
    padding: 0.8rem;
    font-size: 0.9rem;
    &:focus {
      outline: 1px solid rgb(158, 192, 90);
    }
  }
  .messageWrapper {
    @include boxSize($height: 40px);
  }
  button {
    @include boxSize($width: 100%);
  }
}

@media (min-width: 576px) {
  .addComment {
    @include boxSize($maxWidth: 400px);
    button {
      @include boxSize($maxWidth: 400px, $height: 2.5rem);
    }
  }
}
</style>
