<template>
  <div class="adminComments mgt4" v-if="!isLoading">
    <h1 class="slim" id="commentsHeading">Comments</h1>
    <p class="slim mgb2">Number of comments: {{ commentsCount }}</p>
    <section>
      <SortingButtons
        :rating="false"
        @sortTitleAsc="sortByAuthorAscending"
        @sortTitleDesc="sortByAuthorDescending"
        @sortDateAsc="sortDateAscending(allComments)"
        @sortDateDesc="sortDateDescending(allComments)"
        class="sortingBtns"
      />
      <div class="commentsContainer">
        <header class="flex flexCenter">
          <Select
            :options="adminCommentsOptions"
            class="adminCommentSearch"
            ref="adminCommentSearch"
          />
          <input
            type="text"
            v-model.trim="searchValue"
            placeholder="Search..."
          />
        </header>
        <div class="commentsListWrapper flex">
          <div
            class="singleComment mgb1 grid"
            v-for="comment in filteredComments"
            :key="comment._id"
          >
            <div class="basicInfo">
              <p class="commentId">
                <strong>Comment ID:</strong> {{ comment._id }}
              </p>
              <p><strong>Recipe ID: </strong>{{ comment.commentedRecipeId }}</p>
            </div>
            <div class="authorInfo">
              <p class="username flex">
                <span><strong>Posted by: </strong></span>
                <img
                  v-if="comment.author.user_image.url"
                  :src="comment.author.user_image.url"
                  :alt="comment.author.username"
                  loading="lazy"
                />
                <img
                  v-else
                  :src="getDefaultUserImage"
                  :alt="comment.author.username"
                  loading="lazy"
                />
                <span class="username lightItalic">
                  {{ comment.author.username }}
                </span>
              </p>
              <p><strong>User ID: </strong>{{ comment.author._id }}</p>
            </div>
            <div class="commentBody">
              <p class="commentCreated lightItalic block">
                {{ convertDate(comment.createdAt) }}
              </p>
              <p class="commentText">{{ comment.commentBody }}</p>
            </div>
            <div class="buttonsComments flex flexCenter">
              <router-link
                :to="{
                  name: 'SingleResult',
                  params: { id: comment.commentedRecipeId }
                }"
                ><a>View Recipe</a></router-link
              >
              <button
                @click="deleteComment(comment._id)"
                class="tooltipContainer"
              >
                <font-awesome-icon
                  :icon="['fa', 'trash-alt']"
                  class="delete"
                ></font-awesome-icon>
                <Tooltip :tooltipText="'Delete comment'" />
              </button>
            </div>
          </div>
          <Pagination
            v-show="!searchValue"
            :resultsPerPage="resultsPerPage"
            :totalResults="allComments.length"
            :currentPage="currentPage"
            @paginate="changePage"
            @prev="prevPage"
            @next="nextPage"
            @first="firstPage"
            @last="lastPage"
          />
        </div>
        <a
          v-if="filteredComments.length > 5"
          href="#commentsHeading"
          v-scroll-to="'#commentsHeading'"
          class="block hashLink mg2"
          >Back to top &nbsp;<font-awesome-icon
            :icon="['fa', 'hand-point-up']"
            font-size="15px"
          ></font-awesome-icon
        ></a>
      </div>
    </section>
  </div>
  <Loader :bigLoader="true" v-else />
</template>

<script>
import apiCalls from '../../mixins/apiCalls'
import loaderMixin from '../../mixins/loaderMixin'
import sortingResults from '../../mixins/sortingResults'
import dateFormat from '../../mixins/dateFormat'
import paginationOptions from '../../mixins/paginationOptions'
import SortingButtons from '../sharedComponents/SortingButtons'
import Tooltip from '../sharedComponents/Tooltip'
import Select from '../sharedComponents/Select'
import { mapGetters } from 'vuex'
import axios from 'axios'
import { commentsUrl } from '../../apiData'

export default {
  name: 'admin_comments',

  components: {
    Loader: () =>
      import('../sharedComponents/Loader.vue'),
    Pagination: () =>
      import('../sharedComponents/Pagination.vue'),
    SortingButtons,
    Select,
    Tooltip
  },

  data() {
    return {
      commentsCount: 0,
      allComments: [],
      adminCommentsOptions: ['Author', 'Comment ID', 'Recipe ID'],
      searchValue: ''
    }
  },

  created() {
    this.commentsFetch()
  },

  mixins: [
    apiCalls,
    loaderMixin,
    sortingResults,
    dateFormat,
    paginationOptions
  ],

  computed: {
    ...mapGetters(['getDefaultUserImage']),

    selectedValueComments() {
      return this.$refs.adminCommentSearch.selected
    },

    filteredComments() {
      if (!this.searchValue) {
        return this.allComments.slice(
          this.firstResultIndex,
          this.lastResultIndex
        )
      }
      return this.allComments.filter((comment) => {
        if (this.selectedValueComments === 'Comment ID') {
          return comment._id
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        } else if (this.selectedValueComments === 'Recipe ID') {
          return comment.commentedRecipeId
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        } else {
          return comment.author.username
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        }
      })
    },

    // pagination - page settings
    resultsPerPage() {
      if (this.allComments.length < 10) {
        return this.allComments.length
      } else {
        return 10
      }
    }
  },

  methods: {
    async commentsFetch() {
      try {
        this.toggleLoader()
        const comments = await this.fetchComments()
        if (comments) {
          this.allComments = [...comments.commentsArray]
          this.commentsCount = comments.count
          this.toggleLoader()
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    async deleteComment(id) {
      try {
        if (window.confirm('Remove this comment?')) {
          await axios.delete(`${commentsUrl}/${id}`)
          this.commentsFetch()
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    sortByAuthorAscending() {
      const sortByUser = this.allComments.sort((a, b) =>
        a.author.username
          .toLowerCase()
          .localeCompare(b.author.username.toLowerCase())
      )
      return sortByUser
    },

    sortByAuthorDescending() {
      const sortByUser = this.allComments.sort((a, b) =>
        b.author.username
          .toLowerCase()
          .localeCompare(a.author.username.toLowerCase())
      )
      return sortByUser
    }
  }
}
</script>

<style lang="scss" scoped>
.sortingBtns {
  margin: 1rem auto;
}
.commentsContainer {
  @include boxSize($width: 100%);
  margin: auto;
  border: 1px solid lightgray;
  header {
    @include alignment($direction: column, $justify: space-evenly);
    @include boxSize($height: 80px);
    background-color: lighten($graphite, 20%);
    @include fonts($color: $light);

    input {
      @include boxSize($width: 260px);
      padding: 0.4rem;
      border-radius: 6px;
      box-shadow: $shadowSmall;
    }
  }
  .commentsListWrapper {
    overflow-y: auto;
    @include alignment($direction: column, $align: center);
    padding: 0.5rem;
  }

  .singleComment {
    box-shadow: $shadowBox;
    text-align: left;
    @include boxSize($width: 100%);
    background-color: $light;
    div {
      padding: 0.5rem;
    }
    .username {
      @include alignment($align: center);
      img {
        @include boxSize($width: 20px, $height: 20px);
        border-radius: 50%;
        margin: 0 5px;
      }
    }

    p {
      @include fonts($size: 0.8rem);
    }
    .commentBody {
      background-color: lighten($graphite, 20%);
      @include fonts($color: $light);
      margin: 0.5rem;

      p:first-of-type {
        @include fonts($color: lighten($graphite, 55%));
      }
      .commentText {
        @include fonts($size: 1rem);
      }
    }
    .basicInfo,
    .authorInfo {
      border-bottom: 1px solid lightgray;
    }

    .buttonsComments {
      @include alignment($justify: space-evenly);

      button {
        background-color: transparent;
      }

      .delete {
        @include fonts($size: 1.2rem);
        @include fonts($color: crimson);
      }
    }
  }
}

@media (min-width: 576px) {
  .adminComments {
    @include boxSize($width: 100%);
  }

  .commentsContainer {
    header {
      @include boxSize($height: 60px);
      @include alignment($direction: row);
    }

    .singleComment {
      grid-template-columns: repeat(2, auto);
      grid-template-rows: repeat(3, auto);
      grid-template-areas: 'basicInfo authorInfo' 'commentBody commentBody' 'buttonsComments buttonsComments';
    }

    .commentBody {
      grid-area: commentBody;
    }
    .authorInfo {
      grid-area: authorInfo;
    }
    .basicInfo {
      grid-area: basicInfo;
    }
    .buttonsComments {
      grid-area: buttonsComments;
    }
  }
}
@media (min-width: 768px) {
  .adminComments,
  .loaderContainer {
    margin-top: 0;
    @include boxSize($width: calc(100% - 4rem));
    align-self: flex-end;
  }
  .loaderContainer {
    margin: auto 0;
  }
}

@media (min-width: 992px) {
  .commentsContainer {
    @include boxSize($maxWidth: 800px);
  }
}
</style>
