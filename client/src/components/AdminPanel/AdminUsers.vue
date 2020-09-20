<template>
  <div
    :class="[
      editModal ? 'adminUsers mgt4 disableScrolling' : 'adminUsers mgt4'
    ]"
    v-if="!isLoading"
  >
    <transition name="fade" mode="out-in">
      <div class="modalOverlay" v-if="editModal" @click.self="closeUserEdit">
        <div class="modalWrapper" v-if="editModal">
          <header class="flex flexCenter">
            <h2>Edit User</h2>
            <button @click="closeUserEdit" class="del tooltipContainer">
              <font-awesome-icon :icon="['fa', 'times']"></font-awesome-icon>
              <Tooltip :tooltipText="'Close'" />
            </button>
          </header>
          <div class="editing flex flexCenter" v-if="editAdmin">
            <h3 class="slim">
              Admin permissions for {{ userForEdit.username }} are
              <strong v-if="userForEdit.isAdmin">enabled</strong
              ><strong v-else>disabled</strong>
            </h3>
            <div class="adminUserCheckBox">
              <label for="adminCheck" class="flex flexCenter">
                <input
                  type="checkbox"
                  id="adminCheck"
                  name="adminCheck"
                  value="Enable Admin"
                  :checked="userForEdit.isAdmin"
                  @change="(e) => (userForEdit.isAdmin = e.target.checked)"
                />
                <p class="flex flexCenter">
                  <font-awesome-icon
                    :icon="['fa', 'user-shield']"
                    :class="[
                      userForEdit.isAdmin ? 'user userSvg' : 'inactive userSvg'
                    ]"
                  ></font-awesome-icon>
                </p>
                <span
                  :class="[userForEdit.isAdmin ? 'rightPosition' : '']"
                ></span>
              </label>
            </div>
            <button @click="changeAdminStatus" class="btnAction">
              Submit Changes
            </button>
          </div>
          <div class="editing flex flexCenter" v-else>
            <h3 class="slim">
              User {{ userForEdit.username }} is
              <strong v-if="userForEdit.isDisabled">disabled</strong
              ><strong v-else>active</strong>
            </h3>
            <div class="adminUserCheckBox">
              <label for="disableCheck" class="flex flexCenter">
                <input
                  type="checkbox"
                  id="disableCheck"
                  name="disableCheck"
                  value="Change user status"
                  :checked="userForEdit.isDisabled"
                  @change="(e) => (userForEdit.isDisabled = e.target.checked)"
                />
                <p class="flex flexCenter">
                  <font-awesome-icon
                    :icon="['fa', 'user']"
                    :class="[
                      userForEdit.isDisabled
                        ? 'inactive userSvg'
                        : 'user userSvg'
                    ]"
                  ></font-awesome-icon>
                </p>
                <span
                  :class="[!userForEdit.isDisabled ? 'rightPosition' : '']"
                ></span>
              </label>
            </div>
            <button @click="changeDisableStatus" class="btnAction">
              Submit Changes
            </button>
          </div>
        </div>
      </div>
    </transition>
    <h1 class="slim" id="searchUsers">Users</h1>
    <p class="slim mgb2">Number of users: {{ usersCount }}</p>
    <section class="searchUsers">
      <SortingButtons
        :rating="false"
        @sortTitleAsc="sortUsernameAscending"
        @sortTitleDesc="sortUsernameDescending"
        @sortDateAsc="sortDateAscending(allUsers)"
        @sortDateDesc="sortDateDescending(allUsers)"
        class="sortingBtns"
      />
      <div class="usersContainer">
        <header class="flex flexCenter">
          <Select
            :options="adminUserOptions"
            class="adminUserSearch"
            ref="adminUserSearch"
          />
          <input
            type="text"
            v-model.trim="searchValue"
            placeholder="Search..."
          />
        </header>
        <div class="usersListWrapper flex">
          <div
            class="singleUser mgb1 grid"
            v-for="user in filteredUsers"
            :key="user.userId"
          >
            <figure>
              <img
                v-if="user.user_image"
                :src="user.user_image"
                :alt="user.username"
                class="imageFit"
                loading="lazy"
              />
              <img
                v-else
                :src="getDefaultUserImage"
                :alt="user.username"
                class="imageFit"
                loading="lazy"
              />
            </figure>
            <div class="userInfo">
              <p class="username flex flexCenter">
                {{ user.username
                }}<span class="adminUser" v-if="user.isAdmin">
                  <font-awesome-icon
                    :icon="['fa', 'user-shield']"
                    class="shieldIcon"
                  ></font-awesome-icon>
                  Admin</span
                >
                <span class="disabledUser" v-if="user.isDisabled">
                  <font-awesome-icon
                    :icon="['fa', 'user-slash']"
                    class="shieldIcon"
                  ></font-awesome-icon
                ></span>
              </p>
              <small class="userCreated"
                ><em>{{ convertDate(user.createdAt) }}</em></small
              >
              <small class="userId"
                ><strong>ID:</strong> {{ user.userId }}</small
              >
            </div>
            <div class="recipesFavorites flex flexCenter">
              <div class="grid" @click="allUserRecipes(user.userId)">
                <font-awesome-icon
                  :icon="['fa', 'book']"
                  class="iconBottom"
                ></font-awesome-icon>
                <span class="text">Created recipes</span>
                <span class="count">{{ user.createdRecipes.length }}</span>
              </div>
              <div class="grid">
                <font-awesome-icon
                  :icon="['fa', 'heart']"
                  class="iconBottom"
                ></font-awesome-icon>
                <span class="text">Saved recipes</span>
                <span class="count">{{ user.favorites.length }}</span>
              </div>
            </div>
            <div class="buttonsUser flex">
              <button
                @click="openUserEdit(user.userId)"
                class="tooltipContainer"
              >
                <font-awesome-icon
                  v-if="user.isDisabled"
                  :icon="['fa', 'user-slash']"
                  class="delete"
                ></font-awesome-icon>
                <font-awesome-icon
                  v-else
                  :icon="['fa', 'user']"
                  class="edit userEnabled"
                ></font-awesome-icon>
                <Tooltip
                  :tooltipText="
                    user.isDisabled ? 'Enable user' : 'Disable user'
                  "
                />
              </button>
              <button
                @click="adminEditing(user.userId)"
                class="tooltipContainer"
              >
                <font-awesome-icon
                  :icon="['fa', 'user-shield']"
                  class="edit"
                ></font-awesome-icon>
                <Tooltip :tooltipText="'Change admin status'" />
              </button>
            </div>
          </div>
        </div>
        <Pagination
          v-show="!searchValue"
          :resultsPerPage="resultsPerPage"
          :totalResults="allUsers.length"
          :currentPage="currentPage"
          @paginate="changePage"
          @prev="prevPage"
          @next="nextPage"
          @first="firstPage"
          @last="lastPage"
        />
      </div>
    </section>
  </div>
  <Loader v-else :bigLoader="true" class="loader" />
</template>

<script>
import { mapGetters } from 'vuex'
import Select from '../sharedComponents/Select'
import SortingButtons from '../sharedComponents/SortingButtons'
import Tooltip from '../sharedComponents/Tooltip'
import loaderMixin from '../../mixins/loaderMixin'
import apiCalls from '../../mixins/apiCalls'
import dateFormat from '../../mixins/dateFormat'
import sortingResults from '../../mixins/sortingResults'
import paginationOptions from '../../mixins/paginationOptions'
export default {
  name: 'admin_users',

  components: {
    Select,
    SortingButtons,
    Tooltip,
    Loader: () =>
      import(/* webpackPrefetch: true */ '../sharedComponents/Loader.vue'),
    Pagination: () =>
      import(/* webpackPrefetch: true */ '../sharedComponents/Pagination.vue')
  },

  mixins: [
    loaderMixin,
    apiCalls,
    dateFormat,
    sortingResults,
    paginationOptions
  ],

  data() {
    return {
      usersCount: 0,
      allUsers: [],
      searchValue: '',
      adminUserOptions: ['Username', 'User ID'],
      editModal: false,
      editAdmin: false,
      userForEdit: null
    }
  },

  created() {
    this.usersFetch()
  },

  computed: {
    ...mapGetters(['getDefaultUserImage', 'getQueriedRecipes']),

    selectedValueUsers() {
      return this.$refs.adminUserSearch.selected
    },

    filteredUsers() {
      // if there is no search set initial array for pagination
      if (!this.searchValue) {
        return this.allUsers.slice(this.firstResultIndex, this.lastResultIndex)
      }
      return this.allUsers.filter((user) => {
        if (this.selectedValueUsers === 'User ID') {
          return user.userId
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        } else {
          return user.username
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        }
      })
    },

    // pagination - page settings
    resultsPerPage() {
      // check if results are less than initial value of 3
      if (this.allUsers.length < 3) {
        return this.allUsers.length
      } else {
        return 3
      }
    }
  },

  methods: {
    async usersFetch() {
      try {
        this.toggleLoader()
        const fetchedUsers = await this.fetchUsers()
        if (fetchedUsers) {
          this.allUsers = [...fetchedUsers.usersArray]
          this.usersCount = fetchedUsers.count
          this.toggleLoader()
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    async changeDisableStatus() {
      try {
        if (window.confirm('Change status for this user?')) {
          const res = await this.editUser(
            this.userForEdit._id,
            'disableStatus',
            {
              disableStatus: this.userForEdit.isDisabled
            }
          )
          if (res) {
            this.closeUserEdit()
            this.usersFetch()
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    async changeAdminStatus() {
      try {
        if (window.confirm('Change Admin status for this user?')) {
          const res = await this.editUser(this.userForEdit._id, 'adminStatus', {
            adminStatus: this.userForEdit.isAdmin
          })
          if (res) {
            this.closeUserEdit()
            this.usersFetch()
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    async openUserEdit(id) {
      try {
        const user = await this.fetchSingleUser(id)
        this.userForEdit = user.data
        this.editModal = true
      } catch (error) {
        console.log(error.message)
      }
    },

    adminEditing(id) {
      this.editAdmin = true
      this.openUserEdit(id)
    },

    closeUserEdit() {
      this.userForEdit = null
      this.editAdmin = false
      this.editModal = false
    },

    sortUsernameAscending() {
      const sortByUser = this.allUsers.sort((a, b) =>
        a.username.toLowerCase().localeCompare(b.username.toLowerCase())
      )
      return sortByUser
    },

    sortUsernameDescending() {
      const sortByUser = this.allUsers.sort((a, b) =>
        b.username.toLowerCase().localeCompare(a.username.toLowerCase())
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

.modalWrapper {
  background-color: $light;
  @include boxSize($minWidth: 280px, $maxWidth: 400px, $maxHeight: 300px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .editing {
    @include alignment($direction: column, $justify: space-evenly);
    @include boxSize($height: calc(100% - 60px));
    label {
      position: relative;
      padding-left: 2rem;
      @include boxSize($height: 2rem);
      input {
        position: absolute;
        visibility: hidden;
        cursor: pointer;
        top: 0;
        left: 0;
      }
      p {
        position: absolute;
        top: 0;
        left: 0;
        height: 2.2rem;
        width: 4rem;
        background-color: lightgray;
        border-radius: 1rem;
        cursor: pointer;

        .userSvg {
          font-size: 1.2rem;
          position: absolute;
          @include fonts($color: rgb(178, 178, 189));
        }

        .user {
          @include fonts($color: rgb(136, 187, 54));
          left: 0.4rem;
        }

        .inactive {
          right: 0.4rem;
        }
      }
      span {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: 0.4s;
        transition: 0.4s;

        &.rightPosition {
          right: 0;
          left: initial;

          &.rightPosition:before {
            background-color: rgb(136, 187, 54);
          }
        }
      }
      span:before {
        position: absolute;
        content: '';
        height: 1.8rem;
        width: 1.8rem;
        left: 0;
        bottom: 0;
        background-color: rgb(178, 178, 189);
        -webkit-transition: 0.4s;
        transition: 0.4s;
        top: 0.2rem;
        border-radius: 50%;
      }
    }
  }
}

.usersContainer {
  @include boxSize($width: 280px);
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
  .usersListWrapper {
    overflow-y: auto;
    @include alignment($direction: column, $align: center);
    padding: 0.5rem;
  }
  .singleUser {
    background: $darkSteel;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: repeat(4, auto);
    grid-template-areas: 'userImage userInfo userInfo' 'userImage userInfo userInfo' 'buttonsUser buttonsUser buttonsUser' 'recipesFavorites recipesFavorites recipesFavorites';
    padding: 0.5rem;
    box-shadow: $shadowSmall;
    border-radius: 8px;
    color: $light;
    figure {
      grid-area: userImage;
      @include boxSize($width: 50px, $height: 70px);

      img {
        @include boxSize($width: 100%);
        box-shadow: $shadowSmall;
      }
    }
    .userInfo {
      grid-area: userInfo;
      text-align: left;
      margin-left: 0.5rem;
      .username {
        @include alignment($justify: flex-start);
        @include fonts($size: 0.9rem);
      }

      small {
        display: inline-block;
        color: $light;
      }
    }

    .adminUser {
      background-color: rgb(52, 111, 150);
      color: $light;
      padding: 0.2rem;
      margin-left: 0.5rem;
      @include fonts($size: 0.7rem, $color: rgb(235, 231, 231));
      .shieldIcon {
        @include fonts($size: 0.7rem, $color: rgb(235, 231, 231));
      }
    }

    .disabledUser {
      background-color: crimson;
      @include fonts($size: 0.7rem, $color: rgb(235, 231, 231));
      padding: 0.5rem;
      border-radius: 50%;
      margin-left: 0.5rem;
    }
    .recipesFavorites {
      grid-area: recipesFavorites;
      @include alignment($justify: space-evenly);
      margin-top: 0.5rem;
      div:first-of-type {
        border-right: 2px solid white;
        cursor: pointer;
      }
      div {
        grid-template-columns: repeat(2, auto);
        grid-template-rows: repeat(2, auto);
        grid-template-areas: 'icon text' 'icon count';
        width: 50%;

        .iconBottom,
        .text,
        .count {
          color: $light;
        }

        .iconBottom {
          grid-area: icon;
          margin: auto;
          @include fonts($size: 1.2rem);
        }

        .text,
        .count {
          @include fonts($size: 0.7rem);
        }

        .text {
          grid-area: text;
          margin: 0;
        }
        .count {
          grid-area: count;
          margin: 0;
        }
      }
    }
    .buttonsUser {
      @include alignment($align: center, $justify: space-evenly);
      grid-area: buttonsUser;
      padding: 0.5rem;

      button {
        background-color: transparent;
      }
      .edit,
      .delete {
        @include fonts($size: 1.2rem);
      }

      .edit {
        @include fonts($color: #45a0dd);
      }

      .userEnabled {
        @include fonts($color: rgb(136, 187, 54));
      }

      .delete {
        @include fonts($color: crimson);
      }
    }
  }
}

.paginationWrapper {
  margin: 1rem;
}

@media (min-width: 576px) {
  .adminUsers {
    @include boxSize($width: 100%);
  }
  .usersContainer {
    @include boxSize($width: 100%);

    header {
      @include boxSize($height: 60px);
      @include alignment($direction: row);
    }
    .usersListWrapper {
      @include alignment($direction: row, $justify: center);
      flex-wrap: wrap;
    }
    .singleUser {
      @include boxSize($width: 250px, $height: 320px);
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, auto);
      grid-template-areas: 'userImage' 'userInfo' 'buttonsUser' 'recipesFavorites';
      margin: 0.8rem;
      box-shadow: $shadowBox;
      figure {
        margin: auto;
        width: 80px;
        height: 80px;

        img {
          border-radius: 50%;
          border: 2px inset whitesmoke;
        }
      }

      .userInfo {
        margin: auto;
        text-align: center;

        .username {
          @include alignment($justify: center);
          @include fonts($size: 1.1rem);
          .adminUser {
            border: 1px solid w hite;
          }
        }
      }

      .recipesFavorites {
        div {
          .iconBottom {
            @include fonts($size: 1.5rem);
          }
          .count {
            @include fonts($size: 1.1rem);
          }
        }
      }

      .buttonsUser {
        @include boxSize($height: 100%);
      }
    }
  }
}
@media (min-width: 768px) {
  .adminUsers,
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
  .usersContainer {
    @include boxSize($maxWidth: 1000px);
  }
}
</style>
