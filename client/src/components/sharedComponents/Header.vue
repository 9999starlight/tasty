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
        <router-link
          :to="{ name: 'home' }"
          tag="li"
          class="flex"
          active-class="active"
          exact
          ><a>Home</a></router-link
        >
        <!-- <router-link
          :to="{ name: 'browse' }"
          tag="li"
          active-class="active"
          class="flex"
          ><a>Recipes</a></router-link
        > -->
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
        <!-- if loggedIn -->
        <router-link
          v-if="getIsLogged"
          :to="{ name: 'userpanel' }"
          tag="li"
          active-class="active"
          class="flex"
          ><a>
            <img
              v-if="getCurrentUser.userImage"
              :src="getCurrentUser.userImage"
              :alt="getCurrentUser.username"
            />
            <img
              v-else
              :src="getDefaultUserImage"
              :alt="getCurrentUser.username"
            />
            {{ getCurrentUser.username }}
            <font-awesome-icon
              :icon="['fa', 'chevron-down']"
              class="arrowDown"
            ></font-awesome-icon> </a
        ></router-link>
        <router-link
          v-if="authAdmin == true"
          :to="{ name: 'overview' }"
          tag="li"
          active-class="active"
          class="flex"
          ><a
            >&nbsp;
            <font-awesome-icon :icon="['fa', 'user-shield']" class="userIcon">
            </font-awesome-icon
            >Admin Panel
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
            </font-awesome-icon>&nbsp;
            Login
          </a>
        </router-link>
        <!-- end logged out -->
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
//import axios from 'axios'

export default {
  name: 'app-header',
  data() {
    return {
      displayMenu: false,
      burgerIcon: true
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
      window.innerWidth > 991
        ? (this.displayMenu = true)
        : (this.displayMenu = false)
    }
  },

  computed: {
    ...mapActions(['logoutUser']),
    ...mapGetters(['getCurrentUser', 'getIsLogged', 'getDefaultUserImage']),

   /*  authUser() {
      return (
        this.getCurrentUser !== null && this.getCurrentUser.isAdmin == false
      )
    }, */
    authAdmin() {
      return this.getCurrentUser !== null && this.getCurrentUser.isAdmin == true
    }
  },

  methods: {
    showMenu() {
      this.displayMenu = !this.displayMenu
    },

    onResize() {
      if (window.innerWidth > 991) {
        this.burgerIcon = false
        this.displayMenu = true
      } else {
        this.displayMenu = false
        this.burgerIcon = true
      }
    },

    logout() {
      this.$store.dispatch('logoutUser')
      location.reload()
    }
  }
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
  z-index: 7;
  box-shadow: $shadowSmall;

  filter {
    position: absolute;
    background-color: rgba(15, 15, 15, 0.959);
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
      //animation: slideLeft 1.2s;
      @include fonts($size: 1.3rem);
    }

    li {
      border-bottom: 1px solid #fff;
      @include boxSize($width: 100%);
      @include alignment($justify: center, $align: center);

      &.active {
        background-color: rgba(250, 128, 114, 0.123);
      }

      a,
      button {
        padding: 0.8rem;
        // margin-left: 1rem;
        color: $white;
        @include boxSize($width: 100%);
        @include alignment($textAlign: left);
      }

      a {
        @include alignment($display: flex, $align: center);
      }

      img {
        display: inline-block;
        @include boxSize($width: 20px, $height: 20px);
        border-radius: 50%;
        margin-right: 10px;
      }

      .arrowDown {
        margin-left: 0.4rem;
        @include fonts($size: 0.8rem, $color: gray);
      }

      .userIcon {
        margin-right: 0.3rem;
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

@media (min-width: 992px) {
  header {
    @include alignment($direction: row, $justify: space-between);

    .menuWrapper {
      @include boxSize($width: 20%);
    }

    nav {
      @include boxSize($width: 80%, $height: 50px);
      @include alignment($justify: flex-end);

      ul {
        @include alignment($direction: row, $justify: flex-end);
        position: relative;
        @include fonts($size: 1rem);

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
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
