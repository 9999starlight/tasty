<template>
  <nav
    :class="[!showFullMenu ? 'iconsWidth' : 'menuWidth']"
    @mouseenter="showFullMenu = true"
    @mouseleave="showFullMenu = false"
  >
    <ul class="flex">
      <router-link
        :to="{ name: 'overview' }"
        tag="li"
        active-class="active"
        exact
      >
        <a class="block fullWidth">
          <font-awesome-icon :icon="['far', 'chart-bar']" class="userIcon">
          </font-awesome-icon>
          <transition name="fade" mode="out-in">
            <span v-show="showFullMenu">Overview</span>
          </transition>
        </a>
      </router-link>
      <router-link
        :to="{ name: 'admin_users' }"
        tag="li"
        active-class="active"
        exact
      >
        <a class="block fullWidth">
          <font-awesome-icon :icon="['fa', 'users']" class="userIcon">
          </font-awesome-icon>
          <transition name="fade" mode="out-in">
            <span v-show="showFullMenu">Users</span>
          </transition>
        </a>
      </router-link>
      <router-link
        :to="{ name: 'admin_recipes' }"
        tag="li"
        active-class="active"
      >
        <a class="block fullWidth">
          <font-awesome-icon :icon="['fa', 'book']" class="userIcon">
          </font-awesome-icon
          ><transition name="fade" mode="out-in"
            ><span v-show="showFullMenu">Recipes</span></transition
          >
        </a>
      </router-link>
      <router-link
        :to="{ name: 'admin_comments' }"
        tag="li"
        active-class="active"
      >
        <a class="block fullWidth">
          <font-awesome-icon :icon="['far', 'comments']" class="userIcon">
          </font-awesome-icon
          ><transition name="fade" mode="out-in"
            ><span v-show="showFullMenu">Comments</span></transition
          >
        </a>
      </router-link>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AdminMenu',

  data() {
    return {
      showFullMenu: false
    }
  }
}
</script>

<style lang="scss" scoped>
nav {
  @include boxSize($width: 100%);
  position: fixed;
  background-color: rgba(15, 15, 15, 0.932);
  box-shadow: $shadowSmall;
  transition: 0.5s ease-in-out;
  z-index: 2;
  ul {
    li {
      &:nth-of-type(2) {
        border-left: 1px solid #fff;
        border-right: 1px solid #fff;
      }
      &:nth-of-type(3) {
        border-right: 1px solid #fff;
      }
      @include boxSize($width: 25%);
      &.active {
        background-color: rgba(250, 128, 114, 0.123);
      }

      a {
        @include fonts($size: 1rem, $color: lighten($graphite, 70%));
        padding: 0.7rem 0;
        position: relative;
        text-align: center;
        .userIcon {
          @include fonts($color: lighten($graphite, 70%));
          @include boxSize($width: 1.5rem);
          margin: 0 0.75rem;
        }

        span {
          display: block;
          font-size: 0.8rem;
        }
      }
    }
  }
}

@media (min-width: 768px) {
  nav {
    @include boxSize($height: 100%);
    top: 66px;
    left: 0;
    background-color: rgba(15, 15, 15, 0.859);
    &.iconsWidth {
      @include boxSize($width: 3rem);
    }

    &.menuWidth {
      @include boxSize($width: 200px);
    }
    ul {
      @include alignment($direction: column);

      li {
        @include boxSize($width: 100%);
        border-bottom: 1px solid #fff;
        &:nth-of-type(2),
        &:nth-of-type(3) {
          border-left: 0;
          border-right: 0;
        }
        a {
          text-align: left;
          padding: 1rem 0;
          &:hover {
            background-color: lighten($graphite, 8%);
          }
          span {
            position: absolute;
            left: 3rem;
            bottom: 1rem;
            font-size: 1rem;
          }
        }
      }
    }
  }
}

@media (min-width: 992px) {
  nav {
    @include boxSize($height: 100%);
    top: 50px;
  }
}
</style>
