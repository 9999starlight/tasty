<template>
  <nav class="paginationWrapper flex flexCenter mgt2">
    <ul class="flex">
      <li>
        <a
          href="#"
          @click.prevent="$emit('prev')"
          :class="[togglePrevDisabled ? 'prev disabled' : 'prev']"
        >
          <font-awesome-icon
            :icon="['fa', 'angle-double-left']"
            font-size="15px"
          ></font-awesome-icon>
        </a>
      </li>
      <li>
        <a v-show="currentPage > 1" href="#" @click.prevent="$emit('first')">
          First
        </a>
      </li>
      <li v-for="num in pageNumbers" :key="num">
        <a
          href="#"
          @click.prevent="$emit('paginate', num)"
          :class="{ active: currentPage === num }"
          >{{ num }}</a
        >
      </li>
      <li>
        <a
          v-show="this.currentPage < pageNumbers[pageNumbers.length - 1]"
          href="#"
          @click.prevent="$emit('last', pageNumbers)"
          >Last
        </a>
      </li>
      <li>
        <a
          href="#"
          @click.prevent="$emit('next', pageNumbers)"
          :class="[toggleNextDisabled ? 'next disabled' : 'next']"
        >
          <font-awesome-icon
            :icon="['fa', 'angle-double-right']"
            font-size="15px"
          ></font-awesome-icon>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',

  /*   data() {
    return {
      prevDisabled: false,
      nextDisabled: false
    }
  }, */

  props: {
    resultsPerPage: {
      type: Number,
      required: true
    },

    totalResults: {
      type: Number,
      required: true
    },

    currentPage: {
      type: Number,
      required: true
    }
  },

  computed: {
    // calculating number of pages
    pageNumbers() {
      let arr = []
      for (
        let i = 1;
        i <= Math.ceil(this.totalResults / this.resultsPerPage);
        i++
      ) {
        arr.push(i)
      }
      // console.log(arr)
      return arr
    },

    togglePrevDisabled() {
      if (this.currentPage === 1) {
        return true
      } else {
        return false
      }
    },

    toggleNextDisabled() {
      if (this.currentPage >= this.pageNumbers[this.pageNumbers.length - 1]) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.paginationWrapper {
  @include boxSize($width: 100%);
  ul {
    @include boxSize($maxWidth: 100%, $height: 3rem);
    box-shadow: 0px 20px 9px -17px rgba(16, 16, 16, 0.79);

    li {
      background-color: rgba(29, 28, 28, 0.774);
      border-right: 1px solid darken($gray, 10%);

      &:first-of-type {
        border-radius: 50% 0px 0px 50%;
      }

      &:last-of-type {
        border-radius: 0px 50% 50% 0px;
        border: none;
      }
      a {
        display: inline-block;
        @include boxSize($height: 100%);
        padding: 0.8rem;
        @include fonts($color: saturate($lightOrange, 70%));

        &.active {
          background-color: lighten($gray, 5%);
        }

        &.prev.disabled,
        &.next.disabled {
          cursor: not-allowed;
          color: gray;
          pointer-events: none;
        }
      }
    }
  }
}

@media (min-width: 776px) {
  .paginationWrapper {
    ul {
      li:hover {
        background-color: darken($gray, 25%);
      }
    }
  }
}
</style>
