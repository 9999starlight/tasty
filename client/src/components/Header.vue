<template>
  <header class="flex">
    <div
      :class="displayMenu && burgerIcon ? 'filter open' : 'filter'"
      @click.self="showMenu()"
    ></div>
    <div class="menuWrapper flex">
      <h2 class="logo">Tasty</h2>
      <div v-if="burgerIcon" class="menu flex flexCenter" @click="showMenu()">
        <div :class="!displayMenu ? 'line' : 'line transformMenu'"></div>
        <div :class="!displayMenu ? 'line' : 'line transformMenu'"></div>
        <div :class="!displayMenu ? 'line' : 'line transformMenu'"></div>
      </div>
    </div>
    <nav class="flex">
      <ul v-if="displayMenu" class="links flex">
        <!-- if loggedIn -->
        <router-link
          v-if="getIsLogged"
          :to="{ name: 'userpanel' }"
          tag="li"
          active-class="active"
          class="flex"
          ><a
            >&nbsp;
            <font-awesome-icon :icon="['fa', 'user']" class="userIcon">
            </font-awesome-icon
            >My Account
          </a></router-link
        >
        <li class="flex" v-if="getIsLogged">
          <button @click="logout">
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="userIcon">
            </font-awesome-icon>
            Logout
          </button>
        </li>
        <!-- end logged in -->
        <!-- if !loggedIn -->
        <router-link
          v-if="!getIsLogged"
          :to="{ name: 'login' }"
          tag="li"
          class="flex"
          active-class="active"
        >
          <a>
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="userIcon">
            </font-awesome-icon>
            Login
          </a>
        </router-link>
        <!-- end logged out -->
        <router-link
          :to="{ name: 'home' }"
          tag="li"
          class="flex"
          active-class="active"
          exact
          ><a>Home</a></router-link
        >
        <router-link
          :to="{ name: 'browse' }"
          tag="li"
          active-class="active"
          class="flex"
          ><a>Recipes</a></router-link
        >
        <router-link
          :to="{ name: 'foodfacts' }"
          tag="li"
          active-class="active"
          class="flex"
          ><a>Food Facts</a></router-link
        >
        <router-link
          :to="{ name: 'wines' }"
          tag="li"
          active-class="active"
          class="flex"
          ><a>Wines</a></router-link
        >
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'app-header',
  data() {
    return {
      displayMenu: false,
      burgerIcon: true,
    }
  },

  created() {
    window.addEventListener('load', this.onResize)
    window.addEventListener('resize', this.onResize)
  },

  destroyed() {
    window.removeEventListener('load', this.onResize)
    window.removeEventListener('resize', this.onResize)
  },

  watch: {
    $route() {
      window.innerWidth > 995
        ? (this.displayMenu = true)
        : (this.displayMenu = false)
    },
  },

  computed: {
    ...mapActions(['logoutUser']),
    ...mapGetters(['getCurrentUser', 'getIsLogged']),
  },

  methods: {
    showMenu() {
      this.displayMenu = !this.displayMenu
    },

    onResize() {
      if (window.innerWidth > 995) {
        this.burgerIcon = false
        this.displayMenu = true
      } else {
        this.displayMenu = false
        this.burgerIcon = true
      }
    },

    logout() {
      localStorage.removeItem('userToken')
      this.$store.dispatch('logoutUser')
      delete axios.defaults.headers.common['Authorization']
      this.$router.push('home')
    },
  },
}
</script>
<style lang="scss" scoped>
header {
  @include alignment($direction: column);
  // position: relative;
  position: sticky;
  width: 100%;
  top: 0;
  background-color: $white;
  z-index: 2;

  filter {
    position: absolute;
    background-color: rgba(15, 15, 15, 0.904);
  }

  .open {
    @include boxSize($width: 100%, $minHeight: 100vh);
    top: 0;
    left: 0;
    position: absolute;
    z-index: 2;
    background: rgba(15, 15, 15, 0.849);
  }

  .menuWrapper {
    @include alignment($justify: space-between, $align: center);
    z-index: 3;

    h2 {
      padding: 0.8rem;
    }

    .menu {
      flex-direction: column;
      cursor: pointer;
      padding: 0.8rem;

      .line {
        width: 40px;
        height: 4px;
        background-color: black;
        margin-top: 10px;
        transition: 0.5s;

        &.transformMenu {
          background-color: $white;
        }

        &.transformMenu:first-of-type {
          transform: rotate(45deg) translate(10px, 10px);
        }

        &.transformMenu:nth-of-type(2) {
          transform: rotate(-45deg);
        }

        &.transformMenu:nth-of-type(3) {
          opacity: 0;
        }
      }
    }
  }
  nav {
    z-index: 3;
    position: relative;

    ul {
      @include alignment($direction: column, $align: center);
      position: absolute;
      animation: slideLeft 1.2s;
    }

    li {
      border-bottom: 1px solid #fff;
      @include boxSize($width: 100%);
      @include alignment($justify: center, $align: center);

      &.active {
        background-color: rgba(250, 128, 114, 0.123);
      }

      &:hover {
        background-color: rgba(133, 104, 101, 0.452);
      }

      a,
      button {
        padding: 0.8rem;
        color: $white;
        @include boxSize($width: 100%);
        @include alignment($textAlign: center);
      }

      .userIcon {
        @include fonts($color: gray, $size: 1rem);
        display: inline-block;
        padding-right: 0.2rem;
      }

      button {
        border: none;
        background: transparent;
        @include fonts($size: inherit);
      }
    }

    .links {
      @include boxSize($width: 100%);
    }
  }
}

@media (min-width: 996px) {
  header {
    @include alignment($direction: row, $justify: space-between);
    box-shadow: $shadowSmall;

    .menuWrapper {
      @include boxSize($width: 20%);
    }

    nav {
      @include boxSize($width: 80%);
      @include alignment($justify: flex-end);

      ul {
        @include alignment($direction: row, $justify: flex-end);
        position: relative;

        li {
          border: none;
          padding: 0 0.5rem;
          width: initial;

          &.active {
            background-color: transparent;
            border-bottom: 2px solid rgba(250, 128, 114, 0.705);
          }

          &:hover {
            background-color: transparent;
          }
          a:hover {
            color: rgba(250, 128, 114, 0.452);
          }
          a,
          button {
            color: black;
          }
        }
      }
    }
  }
}
</style>
