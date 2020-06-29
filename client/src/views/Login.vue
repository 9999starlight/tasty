<template>
  <div class="formWrapper container">
    <form class="loginForm flex pd1" enctype="multipart/form-data">
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
        <font-awesome-icon
          :icon="['fa', 'user']"
          class="userIcons"
        ></font-awesome-icon>
        <div class="labelWrapper">
          <input type="text" v-model.trim="username" id="username" required />
          <label for="username">Username</label>
        </div>
      </div>
      <div class="formGroup flex flexCenter mgb1">
        <font-awesome-icon
          :icon="['fa', 'lock']"
          class="userIcons"
        ></font-awesome-icon>
        <div class="labelWrapper">
          <input
            type="password"
            v-model.trim="password"
            id="password"
            required
          />
          <label for="password">Password</label>
        </div>
      </div>
      <!--  -->
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
      <!--  -->
      <div class="messageWrapper center">
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

    // toggle login/sign up forms
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
        const res = this.$store.dispatch('signUpUser', formData)
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
.loginForm {
  flex: 1;
  @include alignment(
    $direction: column,
    $justify: space-evenly,
    $align: center
  );
  @include boxSize($minHeight: 400px, $width: 100%);
  box-shadow: $shadowBox;
  background-color: rgba(255, 255, 255, 0.49);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.459),
    0 5px 10px -3px rgba(0, 0, 0, 0.322);

  .formHeader {
    @include alignment($direction: column, $align: center);

    h1 {
      font-family: 'Lobster', cursive;
      color: lighten($graphite, 20%);
      text-shadow: -1px -1px 1px rgba(255, 254, 254, 0.65),
        1px 1px 1px rgba(0, 0, 0, 0.91);
    }
    p {
      color: lighten($graphite, 5%);
    }

    .signupLink {
      @include fonts($color: rgb(14, 92, 122), $weight: 700);
      cursor: pointer;
      text-decoration: underline;
      //margin: 0 auto;
    }
  }

  // floating labels & input style
  .formGroup {
    @include alignment($textAlign: left);
    .labelWrapper {
      position: relative;
      input {
        @include boxSize($width: 250px);
        padding: 0.3rem 0;
        background-color: transparent;
        border-bottom: 1px solid darken($color: $graphite, $amount: 20%);
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
          $color: lighten($graphite, 10%),
          $weight: 100
        );
        top: -25px;
        left: 0;
        pointer-events: none;
        transform: translateY(30px);
        transition: all 0.3s ease-in-out;
      }

      input:valid + label,
      input:focus + label {
        @include fonts($size: 0.7rem, $color: lighten($graphite, 15%));
        transform: translateY(0);
      }
    }
    .userIcons {
      @include fonts($size: 1.1rem, $color: lighten($graphite, 20%));
      margin-right: 10px;
    }
  }

  // additional style for upload section
  .uploadSection {
    @include alignment($direction: column);
    @include boxSize($width: 280px);
    background-color: rgba(255, 255, 255, 0.3);

    h4 {
      color: lighten($graphite, 13%);
    }

    .upload {
      @include boxSize($height: auto);
    }

    .small {
      text-align: center;
    }
  }

  .messageWrapper {
    @include boxSize($height: 40px);
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

    .loginForm {
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
  .loginForm {
    .formHeader {
      .signupLink:hover {
        filter: brightness(60%);
      }
    }
  }
}

@media (min-width: 992px) {
  .loginForm {
    .cancelBtn {
      width: 110px;
      padding: 0.4rem;
    }
  }
}
</style>
