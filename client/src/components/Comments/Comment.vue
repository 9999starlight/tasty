<template>
  <div class="singleCommentWrapper flex mgb1" v-animationscroll>
    <p class="commentAuthor flex flexCenter">
      <img
        v-if="!singleComment.author.user_image"
        :src="getDefaultUserImage"
        :alt="singleComment.author.username"
        loading="lazy"
      />
      <img
        v-else
        :src="singleComment.author.user_image.url"
        :alt="singleComment.author.username"
        loading="lazy"
      />
      <span class="slim">{{ singleComment.author.username }}</span>
    </p>
    <p class="commentBody slim mgt1">{{ singleComment.commentBody }}</p>
    <p class="date lightItalic mgt1">
      {{ convertDate(singleComment.createdAt) }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dateFormat from '../../mixins/dateFormat'
export default {
  name: 'Comment',
  props: {
    singleComment: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['getDefaultUserImage'])
  },

  mixins: [dateFormat]
}
</script>

<style lang="scss" scoped>
.singleCommentWrapper {
  @include alignment($direction: column);
  @include boxSize($width: 280px);
  border: 2px solid lightgray;
  padding: 0.8rem;
  .commentAuthor {
    align-self: flex-start;
    img {
      @include boxSize($width: 30px, $height: 30px);
      object-fit: cover;
      border-radius: 50%;
    }
    span {
      margin-left: 0.5rem;
    }
  }
  .commentBody {
    @include alignment($textAlign: left);
  }
  .date {
    align-self: flex-end;
    @include fonts($size: 0.8rem);
  }
}
@media (min-width: 576px) {
  .singleCommentWrapper {
    @include boxSize($width: 400px);
  }
}
</style>
