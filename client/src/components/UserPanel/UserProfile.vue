<template>
  <div class="container profileContainer">
    <div class="profile">
      <h3 class="italic">Profile</h3>
      <div class="imageUsername flex">
        <img
          v-if="getCurrentUser.user_image"
          :src="getCurrentUser.user_image"
          :alt="getCurrentUser.username"
        />
        <img v-else :src="getDefaultUserImage" :alt="getCurrentUser.username" />
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
      <form enctype="multipart/form-data" class="flex flexCenter pd1">
        <h3 class="center">Change profile image</h3>
        <div class="upload flex">
          <div class="buttons flex">
            <label for="userImageUpload" class="uploadBtnWrapper hovEffect">
              <input
                type="file"
                id="userImageUpload"
                ref="userImageUpload"
                @change="selectImageFile"
              />
              Browse image
            </label>
            <button
              @click.prevent="removeSelectedImage"
              v-if="preview"
              class="cancelBtn hovEffect"
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
        <Loader :bigLoader="false" v-show="isLoading" />
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
          class="btnAction mg1 hovEffect"
          @click.prevent="submitImage"
        >
          Upload image
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dateFormat from '../../mixins/dateFormat'
import fileValidation from '../../mixins/fileValidation'
import loaderMixin from '../../mixins/loaderMixin'
import InfoMessage from '../../components/sharedComponents/InfoMessage'
import Loader from '../../components/sharedComponents/Loader'
import axios from 'axios'
import { usersUrl } from '../../apiData'

export default {
  name: 'user_profile',

  components: {
    InfoMessage,
    Loader
  },

  data() {
    return {
      message: '',
      messageStatus: false,
      filename: '',
      preview: null,
      image: ''
    }
  },

  mixins: [dateFormat, loaderMixin, fileValidation],

  computed: {
    ...mapGetters([
      'getIsLogged',
      'getCurrentUser',
      'getDefaultUserImage',
      'getEditState'
    ])
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
.profileContainer {
  background-color: rgb(238, 236, 236);
}

section div,
form {
  @include alignment($textAlign: left);

  p,
  span {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  h3 {
    color: $golden;
    text-align: center;
  }
}
.profile {
  @include alignment($display: flex, $direction: column, $align: center);
  @include boxSize($width: 100%, $maxWidth: 400px);
  box-shadow: $shadowSmall;
  background-color: lighten($graphite, 20%);
  color: $light;
  border-radius: 10px;
  border: 2px solid lightgray;

  .italic {
    @include fonts($color: rgb(214, 212, 212), $style: italic, $weight: 400);
  }

  h1,
  h3,
  .additionalInfo,
  form {
    padding: 0.5rem 0.8rem;
    @include boxSize($width: 100%);
  }

  .imageUsername {
    @include alignment($align: center);
    padding: 0.5rem 0.8rem;

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
    flex-direction: column;
    grid-area: form;
    background-color: white;
    color: $graphite;
    border-radius: 0 0 10px 10px;
    .btnAction.hovEffect {
      @include fonts($color: $light, $weight: 600);
      @include boxSize($width: 180px);
      border-radius: 0;
    }

    .small {
      text-align: center;
    }

    .messageWrapper {
      @include boxSize($height: 40px);
      margin-top: 1rem;
    }
  }
}

@media (min-width: 576px) {
  .profile {
    @include alignment($display: grid);
    @include boxSize($height: 450px, $width: 560px, $maxWidth: initial);
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, auto);
    grid-template-areas: 'heading3 form' 'imageUsername form' 'additionalInfo form';

    .profile div {
      text-align: center;
    }

    h3 {
      grid-area: heading3;
    }

    .imageUsername {
      grid-area: imageUsername;
      @include alignment($direction: column, $justify: center, $align: center);

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
      border-radius: 0 10px 10px 0;

      .small {
        text-align: left;
      }
    }
  }
}

@media (min-width: 768px) {
  .profile {
    width: 650px;
  }
}

@media (min-width: 992px) {
  .profileContainer {
    background-image: $zinc;
  }
}
</style>
