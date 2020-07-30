<template>
  <nav
    class="paginationWrapper flex flexCenter mgt2"
    v-if="this.pageNumbers.length > 1"
  >
    <ul class="flex">
      <li>
        <a
          href="#"
          @click.prevent="$emit('prev')"
          :class="[togglePrevDisabled ? 'prev disabled' : 'prev']"
        >
          <font-awesome-icon
            :icon="['fa', 'angle-double-left']"
            class="paginationArrow"
          ></font-awesome-icon>
        </a>
      </li>
      <li>
        <a
          href="#"
          @click.prevent="$emit('first')"
          :class="{ active: currentPage === 1 }"
        >
          1
        </a>
      </li>
      <li
        class="morePagesIndicator"
        v-show="!togglePrevDisabled && currentPage > 3"
      >
        ...
      </li>
      <li v-for="num in pagesForShow" :key="num">
        <a
          href="#"
          @click.prevent="$emit('paginate', num)"
          :class="{ active: currentPage === num }"
          v-show="
            currentPage === num ||
              (num >= currentPage - 1 && num < currentPage + 2)
          "
          >{{ num }}</a
        >
      </li>
      <li
        class="morePagesIndicator"
        v-show="
          !toggleNextDisabled &&
            currentPage < pageNumbers[this.pageNumbers.length - 3]
        "
      >
        ...
      </li>
      <li>
        <a
          href="#"
          @click.prevent="$emit('last', pageNumbers)"
          :class="{ active: currentPage === pageNumbers.length }"
          v-show="pageNumbers.length > 1"
          >{{ pageNumbers.length }}
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
            class="paginationArrow"
          ></font-awesome-icon>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',

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
    },
    // pages between first and last
    pagesForShow() {
      return this.pageNumbers.slice(1, this.pageNumbers.length - 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.paginationWrapper {
  ul {
    @include boxSize($maxWidth: 100%, $height: 3rem);
    box-shadow: 0px 20px 9px -17px rgba(16, 16, 16, 0.79);

    li {
      background-color: rgba(29, 28, 28, 0.774);

      &:first-of-type {
        border-right: 1px solid darken($midTone, 10%);
        border-radius: 40% 0px 0px 40%;
      }

      &:last-of-type {
        border-left: 1px solid darken($midTone, 10%);
        border-radius: 0px 40% 40% 0px;
      }
    }
    a,
    .morePagesIndicator {
      @include alignment($display: flex, $align: center);
      @include boxSize($height: 100%);
      padding: 0.7rem;
      @include fonts($color: saturate($lightOrange, 70%), $size: 0.9rem);
      transition: background-color 0.4s;
      border-right: 1px solid darken($midTone, 10%);
      &.active {
        background-color: lighten($midTone, 5%);
      }

      &:last-of-type {
        border: none;
      }

      &.prev.disabled,
      &.next.disabled {
        cursor: not-allowed;
        color: gray;
        pointer-events: none;
      }
    }

    a:first-of-type,
    a:last-of-type {
      padding: 0.7rem 1rem;
    }
  }
  .paginationArrow {
    font-size: 1.2rem;
  }
}

@media (min-width: 576px) {
  .paginationWrapper {
    ul {
      a,
      .morePagesIndicator {
        padding: 0.8rem;
        @include fonts($size: 1rem);
      }
    }
  }
}

@media (min-width: 768px) {
  .paginationWrapper {
    ul {
      li:hover {
        background-color: darken($midTone, 25%);
      }
    }
  }
}
</style>
