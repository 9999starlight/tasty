<template>
  <div class="formWrapper container">
    <form class="flex pd1" enctype="multipart/form-data">
      <div class="formHeader flex mgb1">
        <h1 v-if="!showSignUp" class="mgb1">Login</h1>
        <h1 v-else class="mgb1">Sign Up</h1>
        <p v-if="!showSignUp">
          Dont'have an account?&nbsp;
          <span @click="toggleSignUp" class="signupLink">Sign Up</span>
        </p>
        <p v-if="showSignUp">
          Already have an account?&nbsp;
          <span @click="toggleSignUp" class="signupLink">Sign in</span>
        </p>
      </div>
      <div class="formGroup flex flexCenter mgb1">
        <div class="labelWrapper">
          <font-awesome-icon
            :icon="['fa', 'user']"
            class="userIcons"
          ></font-awesome-icon>
          <input type="text" v-model.trim="username" id="username" required />
          <label for="username">Username</label>
        </div>
      </div>
      <div class="formGroup flex flexCenter mgb1">
        <div class="labelWrapper">
          <font-awesome-icon
            :icon="['fa', 'lock']"
            class="userIcons"
          ></font-awesome-icon>
          <input
            type="password"
            v-model.trim="password"
            id="password"
            required
          />
          <label for="password">Password</label>
        </div>
      </div>
      <!-- signup options -->
      <div v-if="showSignUp" class="formGroup flex flexCenter uploadSection">
        <h4 class="block mgb1">Upload profile image</h4>
        <div class="upload flex">
          <div class="buttons flex">
            <div class="uploadBtnWrapper">
              <input type="file" ref="image" @change="selectFile" />
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
      </div>
      <!-- end signup options -->
      <div
        :class="[
          errorMessage !== ''
            ? 'messageWrapper flex flexCenter messageBackground'
            : 'messageWrapper center'
        ]"
      >
        <transition name="expand" mode="out-in">
          <InfoMessage
            v-if="errorMessage !== ''"
            :message="errorMessage"
            :messageStatus="messageStatus"
            @clear="updateMessage('')"
          />
        </transition>
        <Loader :bigLoader="false" v-show="isLoading" />
      </div>
      <button
        v-if="!showSignUp"
        type="submit"
        class="btnAction loginBtn"
        @click.prevent="login"
      >
        Login
      </button>
      <button
        v-if="showSignUp"
        type="submit"
        class="btnAction signUpBtn"
        @click.prevent="signUp"
      >
        Create Account
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import InfoMessage from '../components/sharedComponents/InfoMessage'
import Loader from '../components/sharedComponents/Loader'
import fileValidation from '../mixins/fileValidation'
import loaderMixin from '../mixins/loaderMixin'
export default {
  name: 'login',

  components: {
    InfoMessage,
    Loader
  },

  data() {
    return {
      showSignUp: false,
      username: '',
      password: '',
      image: '',
      filename: '',
      preview: null,
      errorMessage: '',
      messageStatus: false
    }
  },

  mixins: [fileValidation, loaderMixin],

  computed: {
    ...mapActions(['loginUser', 'signUpUser']),
    ...mapGetters(['getUserToken', 'getErrorMessage', 'getIsLogged']),

    valImg() {
      if (this.preview && !this.imageValidation(this.image)) {
        return false
      } else {
        return true
      }
    }
  },

  methods: {
    updateMessage(message) {
      this.errorMessage = message
    },

    // toggle login/signup forms
    toggleSignUp() {
      this.showSignUp = !this.showSignUp
    },

    validation() {
      const regexUsername = /^[a-z0-9_-]{4,20}$/i
      if (!regexUsername.test(this.username) || this.password.length < 6) {
        this.updateMessage('Invalid username or password, please try again!')
        return false
      }
      return true
    },

    selectFile() {
      this.image = this.$refs.image.files[0]
      this.filename = this.$refs.image.files[0].name
      this.preview = URL.createObjectURL(this.image)
    },

    removeSelectedImage() {
      this.$refs.image.value = ''
      this.image = ''
      this.filename = ''
      this.preview = null
    },

    async signUp() {
      try {
        const isValid = this.validation()
        if (!isValid) return
        if (isValid && !this.valImg) {
          this.messageStatus = false
          this.errorMessage = this.valMessage
          return
        }
        this.toggleLoader()
        const formData = new FormData()
        if (this.image && this.valImg) {
          formData.append('user_image', this.image)
        }
        formData.append('username', this.username)
        formData.append('password', this.password)
        const res = await this.$store.dispatch('signUpUser', formData)
        this.toggleLoader()
        if (res) {
          this.$router.push('/')
        } else {
          this.errorMessage = this.getErrorMessage
          this.updateMessage(this.errorMessage)
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    async login() {
      try {
        const isValid = this.validation()
        if (!isValid) return
        this.toggleLoader()
        const res = await this.$store.dispatch('loginUser', {
          username: this.username,
          password: this.password
        })
        this.toggleLoader()
        if (res) {
          this.$router.push('/')
        } else {
          this.errorMessage = this.getErrorMessage
          this.updateMessage(this.errorMessage)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.formWrapper {
  margin: 0;
  padding: 0;
  @include background(
    $lightFilter,
    url('../assets/backgrounds/wood-back.jpg'),
    $backConfig
  );
  background-attachment: fixed;
}
form {
  flex: 1;
  @include alignment(
    $direction: column,
    $justify: space-evenly,
    $align: center
  );
  @include boxSize($height: 100%, $width: 100%);
  box-shadow: $shadowBox;
  background-color: rgba(255, 255, 255, 0.22);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.459),
    0 5px 10px -3px rgba(0, 0, 0, 0.322);
  p,
  label,
  h1,
  input {
    text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.3),
      0px -1px 0px rgba(0, 0, 0, 0.7);
  }

  .formHeader {
    @include alignment($direction: column, $align: center);

    h1 {
      font-family: 'Lobster', cursive;
      color: lighten($graphite, 10%);
    }
    p {
      color: $graphite;
    }

    .signupLink {
      @include fonts($color: rgb(14, 92, 122), $weight: 700);
      cursor: pointer;
      text-decoration: underline;
    }
  }

  // floating labels & input style
  .formGroup {
    @include alignment($textAlign: left);
    .labelWrapper {
      position: relative;

      input {
        @include boxSize($width: 220px);
        padding: 0.3rem 0;
        background-color: transparent;
        border-bottom: 1px solid darken($color: $graphite, $amount: 10%);
        @include fonts($size: 0.9rem, $color: lighten($graphite, 5%));

        &:valid,
        &:focus {
          border-bottom-color: $light;
          outline: none;
        }
      }

      label {
        position: absolute;
        @include fonts(
          $size: 0.9rem,
          $color: lighten($graphite, 5%),
          $weight: 100
        );
        top: -25px;
        left: 25px;
        pointer-events: none;
        transform: translateY(30px);
        transition: all 0.3s ease-in-out;
      }

      input:valid + label,
      input:focus + label {
        @include fonts($size: 0.7rem, $color: lighten($graphite, 10%));
        transform: translateY(0);
      }

      .userIcons {
        @include fonts($size: 1.1rem, $color: lighten($graphite, 10%));
        margin-right: 10px;
      }
    }
  }

  // additional style for upload section
  .uploadSection {
    @include alignment($direction: column);
    @include boxSize($width: 280px);
    background-color: rgba(255, 255, 255, 0.3);
    padding: 0.5rem;

    h4 {
      color: lighten($graphite, 13%);
    }

    .upload {
      @include boxSize($height: auto);
    }

    button {
      font-size: 0.8rem;
    }

    .small {
      text-align: center;
    }

    .uploadBtnWrapper {
      box-shadow: none;
    }
  }

  .messageWrapper {
    @include boxSize($height: 40px);
    padding: 0.5rem;
  }

  .messageBackground {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .btnAction {
    @include fonts($size: 1.2rem);
    border-radius: initial;
  }

  .loginBtn {
    background: $blueGradient;
  }

  .signUpBtn {
    background-image: $greenGradient;
  }
}

@media (min-width: 576px) {
  .formWrapper {
    @include alignment($justify: center, $align: center);

    form {
      @include boxSize($width: 450px, $maxHeight: 600px);
    }

    .formGroup {
      .labelWrapper {
        input {
          @include boxSize($width: 300px);
          @include fonts($size: 1.1rem);
        }

        label {
          font-size: 1rem;
        }

        input:valid + label,
        input:focus + label {
          font-size: 0.9rem;
        }
      }
    }
    .uploadSection {
      @include boxSize($width: 350px);
    }
  }
}

@media (min-width: 768px) {
  form {
    .formHeader {
      .signupLink:hover {
        filter: brightness(60%);
      }
    }
  }
}

@media (min-width: 992px) {
  form {
    .cancelBtn {
      width: 110px;
      padding: 0.4rem;
    }
  }
}

@media (orientation: landscape) {
  form {
    min-height: 600px;
  }
}
</style>
