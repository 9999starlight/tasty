<template>
  <div class="loggedInContainer" v-if="getCurrentUser !== null">
    <div class="userPanel grid mgt2 pd1 center">
      <h1 class="mgb1">Welcome {{ getCurrentUser.username }}</h1>
      <section class="profile">
        <h3 class="italic">Profile</h3>
        <div class="imageUsername flex">
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
          <span>{{ getCurrentUser.username }}</span>
        </div>
        <div class="additionalInfo">
          <p>
            <span class="italic">Member since:</span>
            {{ convertDate(getCurrentUser.createdAt).substr(0, 11) }}
          </p>
          <p>
            <span class="italic">Published recipes:</span>
            {{ getCurrentUser.createdRecipes.length }}
          </p>
        </div>
        <form enctype="multipart/form-data" class="changePhoto pd1">
          <label for="file" class="block">Change profile image</label>
          <div class="uploadBtnWrapper">
            <input type="file" ref="image" @change="selectImageFile" />
            <button class="chooseImage">Choose image</button>
          </div>
          <div class="small">
            <small class="block">File formats accepted: jpg/jpeg/png/gif</small>
            <small>Maximum upload file size 2Mb</small>
            <small class="block selected" v-show="filename"
              >Selected image: {{ filename }}</small
            >
          </div>
          <Loader :bigLoader="bigLoader" v-show="isLoading" />
          <div class="messageWrapper center">
            <transition name="expand" mode="out-in">
              <InfoMessage
                v-if="message"
                :message="message"
                :messageStatus="messageStatus"
                @clear="updateMessage('')"
              />
            </transition>
          </div>
          <button
            type="submit"
            class="imageSubmit block mg1"
            @click.prevent="submitImage"
          >
            Upload image
          </button>
        </form>
      </section>
      <nav>
        <ul class="flex flexCenter">
          <router-link
            class="block"
            :to="{ name: 'user_recipes' }"
            tag="li"
            active-class="active"
            exact
          >
            <a class="block">
              My Recipes
            </a>
          </router-link>
          <router-link
            class="block"
            :to="{ name: 'create_recipe' }"
            tag="li"
            active-class="active"
          >
            <a class="block">
              Create new recipe
            </a>
          </router-link>
          <router-link
            class="block"
            :to="{ name: 'saved_recipes' }"
            tag="li"
            active-class="active"
          >
            <a class="block">
              Saved recipes
            </a>
          </router-link>
        </ul>
      </nav>
      <div class="routerViewContainer container" id="routerViewContainer">
        <router-view></router-view>
      </div>
    </div>
  </div>
  <NotFound v-else :message="'User Not Found'" />
</template>

<script>
import { mapGetters } from 'vuex'
import dateFormat from '../mixins/dateFormat'
import fileValidation from '../mixins/fileValidation'
import loaderMixin from '../mixins/loaderMixin'
import InfoMessage from '../components/sharedComponents/InfoMessage'
import NotFound from '../components/sharedComponents/NotFound'
import Loader from '../components/sharedComponents/Loader'
import axios from 'axios'
import { usersUrl, source } from '../apiData'

export default {
  name: 'userpanel',

  components: {
    InfoMessage,
    NotFound,
    Loader
  },

  data() {
    return {
      bigLoader: false,
      message: '',
      messageStatus: false,
      filename: '',
      image: ''
    }
  },

  mixins: [dateFormat, loaderMixin, fileValidation],

  computed: {
    ...mapGetters(['getCurrentUser', 'getDefaultUserImage'])
  },

  methods: {
    updateMessage(message) {
      this.message = message
    },

    selectImageFile() {
      this.image = this.$refs.image.files[0]
      this.filename = this.$refs.image.files[0].name
    },

    async submitImage() {
      try {
        this.messageStatus = false
        if (!this.image) {
          this.updateMessage('Please select image for upload')
          return
        }
        //console.log(this.imageValidation(this.image))
        if (!this.imageValidation(this.image)) {
          return
        }
        this.toggleLoader()
        const formData = new FormData()
        formData.append('user_image', this.image)
        const response = await axios.patch(
          `${usersUrl}/${this.getCurrentUser.userId}`,
          formData,
          {
            cancelToken: source.token
          }
        )
        if (response) {
          console.log(response.data.updatedUser)
          this.$store.dispatch('updateUser', response.data.updatedUser)
          this.toggleLoader()
          this.messageStatus = true
          this.updateMessage('Image uploaded successfully!')
        }
      } catch {
         (thrown, error) => {
          this.messageStatus = false
          if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message)
          } else {
            if (
              error.response &&
              (error.response.status === 401 || error.response.status === 409)
            ) {
              // console.log(error.response.data.message)

              this.messageStatus = false
              this.updateMessage(error.response.data.message)
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.loggedInContainer {
  @include boxSize($width: 100%);
}

.userPanel {
  @include alignment($justifyGrid: center, $textAlign: center);
  @include boxSize($width: 100%);

  h1 {
    font-family: 'Lobster', cursive;
    color: lighten($graphite, 20%);
  }

  section {
    border: 2px solid lightgray;

    .italic {
      @include fonts($color: rgb(214, 212, 212), $style: italic, $weight: 400);
    }
  }

  section div,
  form {
    @include alignment($textAlign: left);

    p,
    span,
    label {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
  }
  .profile {
    @include alignment($display: flex, $direction: column, $align: center);
    @include boxSize($width: 250px);
    box-shadow: $shadowSmall;
    background-color: lighten($graphite, 20%);
    color: $white;

    h1,
    h3,
    .imageUsername,
    .additionalInfo,
    form {
      padding: 0.5rem 0.8rem;
      @include boxSize($width: 100%);
    }

    .imageUsername {
      @include alignment($align: center);

      img {
        display: inline-block;
        @include boxSize($width: 40px, $height: 40px);
        border-radius: 50%;
        margin-right: 10px;
        box-shadow: $shadowBox;
      }
    }
    .additionalInfo span {
      margin-right: 0.5rem;
    }
    form {
      grid-area: form;
      background-color: white;
      color: $graphite;

      // hide default upload button and change style
      .uploadBtnWrapper {
        position: relative;
        overflow: hidden;
        display: inline-block;
        box-shadow: $shadowSmall;

        button {
          background: lighten($graphite, 40%);
          @include fonts($color: $white);
          padding: 0.3rem;
          width: 100px;
          //border: 2px solid lighten($graphite, 10%);
          //border-radius: 8px;
        }

        input[type='file'] {
          font-size: 2rem;
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
        }
      }
      .small {
        @include boxSize($height: 70px);
      }

      .imageSubmit {
        background: $orangeGradient;
        @include fonts($color: $white, $weight: 600);
        margin: 0 auto;
        padding: 0.4rem;
        @include boxSize($width: 150px);
        box-shadow: $shadowSmall;
      }
      small {
        margin-top: 0.5rem;
        @include fonts($color: $graphite, $size: 0.7rem);
      }

      .selected {
        @include fonts($color: rgb(46, 7, 189));
      }

      .messageWrapper {
        @include boxSize($height: 40px);
        margin-top: 1rem;
      }
    }
  }

  nav {
    margin-top: 1rem;
    ul {
      @include alignment($direction: column);
      li {
        @include boxSize($width: 150px);
        @include fonts($size: 0.8rem);
        background-color: lighten($graphite, 10%);
        box-shadow: $shadowSmall;
        margin-top: 0.6rem;

        &.active {
          background-color: $graphite, 10%;
          outline: 2px inset saturate($lightOrange, 80%);
          box-shadow: 0 5px gray;

          a {
            color: $lightOrange;
          }
        }

        a {
          @include boxSize($width: 100%);
          padding: 0.3rem 0.8rem;
          @include fonts($color: $white);
        }
      }
    }
  }
  .routerViewContainer {
    @include alignment($direction: column);
    @include boxSize($width: 100%);
    padding: 0;
  }
}

@media (min-width: 768px) {
  .loggedInContainer {
    @include boxSize($width: 100%);
  }
  .userPanel {
    align-items: center;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 70px 400px auto;
    grid-template-areas: 'heading heading' 'profile nav' 'router router';

    h1 {
      grid-area: heading;
    }

    .profile {
      grid-area: profile;
      @include boxSize($minWidth: 350px);

      .imageUsername {
        img {
          width: 70px;
          height: auto;
        }
      }
    }

    nav {
      grid-area: nav;
    }

    .routerViewContainer {
      grid-area: router;
    }
    nav ul li {
      @include boxSize($width: 200px);
      @include fonts($size: 1rem);
      margin-top: 1rem;

      &:hover {
        background-color: lighten($graphite, 15%);
      }

      a {
        padding: 0.8rem 1rem;
      }
    }

    form div {
      &:hover {
        filter: brightness(80%);
      }
    }
  }
}

@media (min-width: 992px) {
  .userPanel {
    grid-template-columns: 2fr 1fr;

    .profile {
      @include alignment($display: grid);
      @include boxSize($height: 350px, $width: 600px);
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 40px 200px 70px auto;
      grid-template-areas: 'heading3 form' 'imageUsername form' 'additionalInfo form' '. form';

      h3,
      span,
      p {
        font-size: 105%;
      }

      h3 {
        grid-area: heading3;
      }

      .imageUsername {
        grid-area: imageUsername;
        @include alignment($direction: column);

        img {
          width: 140px;
          height: auto;
          border-radius: 0;
          margin-bottom: 0.8rem;
        }
      }

      .additionalInfo {
        grid-area: additionalInfo;
      }

      form {
        @include boxSize($height: 100%);
        @include alignment(
          $display: flex,
          $direction: column,
          $justify: space-evenly
        );

        label {
          @include fonts($size: 1.2rem);
          margin-bottom: 1.5rem;
        }
        .uploadBtnWrapper {
          width: 120px;
          button {
            @include fonts($size: 0.9rem);
            padding: 0.5rem;
            width: 120px;
          }
        }
        small {
          @include fonts($size: 0.8rem);
        }

        .imageSubmit {
          //margin: 2rem auto;
          padding: 0.6rem;
          @include fonts($size: 1rem);
        }
      }
    }
  }
}

@media (min-width: 1200px) {
  .userPanel {
    @include boxSize($maxWidth: 1200px);
  }
}
</style>
