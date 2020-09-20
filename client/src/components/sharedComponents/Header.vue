<template>
  <header class="flex">
    <div
      :class="displayMenu && burgerIcon ? 'filter open' : 'filter'"
      @click.self="showMenu"
    ></div>
    <div class="menuWrapper flex">
      <router-link :to="{ name: 'home' }" class="flex">
        <h2
          :class="[
            displayMenu && burgerIcon
              ? 'flex flexCenter white'
              : 'flex flexCenter'
          ]"
        >
          <img
            src="@/assets/small_pngs/pot-flowery.png"
            alt="flowery pot"
            loading="lazy"
          />Tasty
        </h2>
      </router-link>
      <button
        v-show="
          $route.name === 'home' ||
            $route.name === 'render_results' ||
            $route.name === 'SingleResult'
        "
        class="headerSearch"
        @click="setOpenSearch"
        aria-label="search for recipes"
      >
        <font-awesome-icon
          :icon="['fa', 'search']"
          class="search"
        ></font-awesome-icon>
      </button>
      <div v-if="burgerIcon" class="menu flex flexCenter" @click="showMenu">
        <div :class="!displayMenu ? 'line' : 'line transformMenu'"></div>
        <div :class="!displayMenu ? 'line' : 'line transformMenu'"></div>
        <div :class="!displayMenu ? 'line' : 'line transformMenu'"></div>
      </div>
    </div>
    <nav class="flex">
      <ul v-if="displayMenu" class="links flex">
        <li>
          <router-link
            :to="{ name: 'home' }"
            class="flex"
            active-class="active"
            exact
            >Home</router-link
          >
        </li>
        <!-- dropdown user menu -->
        <li
          v-if="getIsLogged"
          class="userPanelMenu"
          @mouseover="showDropdown = true"
          @mouseleave="showDropdown = false"
        >
          <span class="flex flexCenter">
            <img
              v-if="getCurrentUser.user_image"
              :src="getCurrentUser.user_image"
              :alt="getCurrentUser.username"
              loading="lazy"
            />
            <img
              v-else
              :src="getDefaultUserImage"
              :alt="getCurrentUser.username"
              loading="lazy"
            />
            {{ getCurrentUser.username }}
            <font-awesome-icon
              :icon="['fa', 'chevron-down']"
              :class="showDropdown ? 'arrowDown rotate' : 'arrowDown'"
            ></font-awesome-icon>
          </span>
          <transition name="slide-menu" mode="out-in">
            <ul class="userDropdown" v-show="showDropdown">
              <li>
                <router-link
                  :to="{ name: 'user_profile' }"
                  active-class="active"
                  exact
                  class="flex"
                  ><font-awesome-icon
                    :icon="['fa', 'user']"
                    class="userIcon"
                  ></font-awesome-icon
                  >&nbsp;Profile</router-link
                >
              </li>
              <li>
                <router-link
                  :to="{ name: 'user_recipes' }"
                  active-class="active"
                  exact
                  class="flex"
                  ><font-awesome-icon
                    :icon="['fa', 'book']"
                    class="userIcon"
                  ></font-awesome-icon
                  >&nbsp;My recipes</router-link
                >
              </li>
              <li>
                <router-link
                  :to="{ name: 'create_recipe' }"
                  active-class="active"
                  class="flex"
                  ><font-awesome-icon
                    :icon="['fa', 'edit']"
                    class="userIcon"
                  ></font-awesome-icon
                  >&nbsp;Create recipe</router-link
                >
              </li>
              <li>
                <router-link
                  :to="{ name: 'saved_recipes' }"
                  active-class="active"
                  class="flex"
                  ><font-awesome-icon
                    :icon="['fa', 'heart']"
                    class="userIcon"
                  ></font-awesome-icon
                  >&nbsp;Saved recipes</router-link
                >
              </li>
            </ul>
          </transition>
        </li>
        <!-- end dropdown -->
        <li v-if="authAdmin == true">
          <router-link
            :to="{ name: 'overview' }"
            active-class="active"
            class="flex"
            >&nbsp;
            <font-awesome-icon :icon="['fa', 'user-shield']" class="userIcon">
            </font-awesome-icon
            >Admin Panel
          </router-link>
        </li>
        <li class="flex" v-if="getIsLogged">
          <button @click="logout">
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="userIcon">
            </font-awesome-icon>
            Logout
          </button>
        </li>
        <!-- end logged in -->
        <!-- if !loggedIn -->
        <li v-if="!getIsLogged">
          <router-link
            :to="{ name: 'login' }"
            class="flex"
            active-class="active"
            ><font-awesome-icon :icon="['fas', 'sign-in-alt']" class="userIcon">
            </font-awesome-icon
            >&nbsp; Login
          </router-link>
        </li>
        <!-- end logged out -->
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'app-header',
  data() {
    return {
      displayMenu: false,
      burgerIcon: true,
      showDropdown: false
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
      this.onResize()
    }
  },

  computed: {
    ...mapActions(['logoutUser']),
    ...mapGetters(['getCurrentUser', 'getIsLogged', 'getDefaultUserImage']),

    authAdmin() {
      return this.getCurrentUser !== null && this.getCurrentUser.isAdmin == true
    }
  },

  methods: {
    showMenu() {
      this.displayMenu = !this.displayMenu
    },

    ...mapMutations(['setOpenSearch']),
    setOpenSearch() {
      this.$store.commit('setOpenSearch')
      window.scrollTo(0, 0)
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

    async logout() {
      try {
        await this.$store.dispatch('logoutUser')
      } catch (error) {
        console.log(error.response.data.message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
header {
  @include alignment($direction: column);
  position: sticky;
  width: 100%;
  top: 0;
  background-color: $light;
  z-index: 7;
  box-shadow: $shadowSmall;

  .open,
  .dropdownOverlay {
    @include boxSize($width: 100%, $minHeight: 100vh);
    top: 0;
    left: 0;
    position: absolute;
    z-index: 2;
    background: rgba(15, 15, 15, 0.9);
  }

  .dropdownOverlay {
    background-color: transparent;
  }

  .menuWrapper {
    @include alignment($justify: space-between, $align: center);
    z-index: 3;

    h2 {
      padding-left: 0.8rem;
      font-family: 'Berkshire Swash', 'Lobster', cursive;
      @include fonts($size: 2rem, $color: lighten($graphite, 10%));

      img {
        height: 45px;
        margin-right: 5px;
      }
    }

    .white {
      color: white;
    }

    .headerSearch {
      position: absolute;
      right: 90px;
      bottom: 20%;
      font-size: 1.7rem;
      background-color: transparent;
      color: $midTone;
      display: inline-block;
      outline: none;
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
          background-color: $light;
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
        color: $light;
        @include boxSize($width: 100%);
        @include alignment($textAlign: left);
      }

      a {
        @include alignment($display: flex, $align: center);
      }

      .userIcon {
        margin-right: 0.3rem;
        color: whitesmoke;
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

    // dropdown
    .userPanelMenu {
      color: $light;
      position: relative;
      cursor: pointer;
      span {
        padding: 0.8rem;
        justify-content: flex-start;

        img {
          display: inline-block;
          @include boxSize($width: 20px, $height: 20px);
          border-radius: 50%;
          margin-right: 10px;
        }

        .arrowDown {
          margin-left: 0.5rem;
          @include fonts($size: 0.8rem, $color: gray);

          &.rotate {
            transform: rotate(180deg);
            transition: 0.5s;
          }
        }
      }
    }
    .userDropdown {
      position: relative;
      transition: all 0.2s ease;
      left: 0;
      z-index: 5;
      width: 100%;
      li {
        z-index: 5;
        padding: 0;
      }
    }
  }
}

@media (min-width: 992px) {
  header {
    height: 50px;
    @include alignment($direction: row, $justify: space-between);

    .menuWrapper {
      flex-grow: 2;

      h2:hover {
        color: $golden;
      }

      .headerSearch {
        position: static;
        margin-right: 1rem;

        &:hover {
          transform: scale(1.1);
          transition: 0.5s ease-in-out;
        }
      }
    }

    nav {
      @include boxSize($height: 50px);
      @include alignment($justify: flex-end);

      ul {
        @include alignment($direction: row, $justify: flex-end);
        position: relative;
        @include fonts($size: 1rem);

        li {
          border: none;
          padding: 0 0.5rem;
          @include boxSize($width: initial, $height: 100%);

          .userIcon {
            color: lighten($graphite, 20%);
          }

          &.active {
            background-color: transparent;
          }

          &.active a {
            border-bottom: 2px solid $golden;
          }

          &:hover {
            box-shadow: $shadowSmall;
          }

          &:hover a,
          &:hover span,
          &:hover button,
          &:hover .userIcon,
          &:hover .arrowDown {
            color: $golden;
          }

          a,
          button {
            color: lighten($graphite, 5%);
            margin: 0;
          }

          button:hover {
            filter: brightness(100%);
          }
        }
      }

      .userPanelMenu {
        color: $graphite;
        display: flex;

        .userDropdown {
          position: absolute;
          box-shadow: $shadowSmall;
          top: 50px;
          left: 0;
          min-width: 170px;
          li a {
            background-color: $light;
            color: darken($golden, 10%);
            border-bottom: 1px solid lightgray;
          }

          li a svg {
            color: darken($golden, 10%);
          }

          li:hover a {
            background-color: lighten($golden, 10%);
            color: $light;
          }

          li:hover a svg {
            color: $light;
          }
        }
      }
    }
  }
}
</style>
