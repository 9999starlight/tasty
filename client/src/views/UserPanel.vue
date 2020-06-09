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
            <span>{{ convertDate(getCurrentUser.createdAt) }}</span>
          </p>
          <p>
            <span class="italic">Published recipes:</span>
            <span>{{ getCurrentUser.createdRecipes.length }}</span>
          </p>
        </div>
        <form enctype="multipart/form-data" class="changePhoto pd1">
          <label for="file" class="block center">Change profile image</label>
          <div class="upload flex">
            <div class="buttons flex">
              <div class="uploadBtnWrapper">
                <input type="file" ref="userImageUpload" @change="selectImageFile" />
                <button class="chooseImage">Browse image</button>
              </div>
              <button
                @click.prevent="removeSelectedImage"
                v-if="preview"
                class="cancelBtn"
              >
                Cancel image
              </button>
            </div>
            <figure v-if="preview" class="flex">
              <img :src="preview" alt="preview" class="imageFit" />
            </figure>
          </div>
          <div class="small">
            <small class="selected block">{{ filename }}</small>
            <small class="block">File formats accepted: jpg/jpeg/png/gif</small>
            <small>Maximum upload file size 2Mb</small>
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
import { usersUrl } from '../apiData'

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
      preview: null,
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
      this.image = this.$refs.userImageUpload.files[0]
      this.filename = this.$refs.userImageUpload.files[0].name
      this.preview = URL.createObjectURL(this.image)
    },

    removeSelectedImage() {
      this.$refs.userImageUpload.value = ''
      this.image = ''
      this.filename = ''
      this.preview = null
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
          this.messageStatus = false
          this.updateMessage(this.valMessage)
          return
        }
        this.toggleLoader()
        const formData = new FormData()
        formData.append('user_image', this.image)
        const response = await axios.patch(
          `${usersUrl}/${this.getCurrentUser.userId}`,
          formData,
          {
            timeout: 5000
          }
        )
        if (response) {
          // console.log(response.data.updatedUser)
          this.$store.dispatch('updateUser', response.data.updatedUser)
          this.toggleLoader()
          this.messageStatus = true
          this.updateMessage('Image uploaded successfully!')
        }
      } catch (error) {
        this.toggleLoader()
        if (error.response.status === 500) {
          this.updateMessage('Too large or unsupported file')
        } else {
          this.updateMessage(error.response.data.message)
        }
        console.log(error.message)
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

    label {
      color: lighten($graphite, 20%);
    }
  }
  .profile {
    @include alignment($display: flex, $direction: column, $align: center);
    @include boxSize($width: 250px);
    box-shadow: $shadowSmall;
    background-color: lighten($graphite, 20%);
    color: $light;

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
    .additionalInfo {
      span {
        margin-right: 0.5rem;
        @include fonts($size: 0.8rem);
      }
    }
    form {
      grid-area: form;
      background-color: white;
      color: $graphite;

      .imageSubmit {
        background: $orangeGradient;
        @include fonts($color: $light, $weight: 600);
        margin: 0 auto;
        padding: 0.4rem;
        @include boxSize($width: 150px);
        box-shadow: $shadowSmall;
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
          @include fonts($color: $light);
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

      .additionalInfo {
        span {
          @include fonts($size: 0.9rem);
        }
      }

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
  }
}

@media (min-width: 992px) {
  .userPanel {
    grid-template-columns: 2fr 1fr;

    .profile {
      @include alignment($display: grid);
      @include boxSize($height: 380px, $width: 600px);
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(3, auto);
      grid-template-areas: 'heading3 form' 'imageUsername form' 'additionalInfo form';

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
          margin-bottom: 1rem;
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
