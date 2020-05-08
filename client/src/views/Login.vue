<template>
  <div class="formWrapper container">
    <form class="loginForm flex pd1" enctype="multipart/form-data">
      <div class="formHeader flex mgb2">
        <h2 v-if="!showSignUp" class="mgb1">Login</h2>
        <h2 v-else class="mgb1">Sign Up</h2>
        <p v-if="!showSignUp">
          Dont'have an account?&nbsp;
          <span @click="toggleSignUp" class="signupLink">Sign Up</span>
        </p>
        <p v-if="showSignUp">
          Already have an account?&nbsp;
          <span @click="toggleSignUp" class="signupLink">Sign in</span>
        </p>
      </div>
      <div class="formGroup center">
        <label for="username" class="block">Username</label>
        <input type="text" v-model.trim="username" id="username" />
      </div>
      <div class="formGroup center">
        <label for="password" class="block">Password</label>
        <input type="password" v-model.trim="password" id="password" />
      </div>
      <div v-if="showSignUp" class="formGroup center">
        <label for="file" class="block">Upload Image</label>
        <input type="file" ref="image" @change="selectFile" />
      </div>
      <div class="messageWrapper center">
        <transition name="expand" mode="out-in">
          <InfoMessage
            v-if="errorMessage !== ''"
            :message="errorMessage"
            :messageStatus="messageStatus"
            @clear="updateMessage('')"
          />
        </transition>
      </div>
      <button
        v-if="!showSignUp"
        type="submit"
        class="btn loginBtn"
        @click.prevent="login"
      >
        Login
      </button>
      <button
        v-if="showSignUp"
        type="submit"
        class="btn signUpBtn"
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
export default {
  name: 'login',

  components: {
    InfoMessage
  },

  data() {
    return {
      showSignUp: false,
      username: '',
      password: '',
      image: '',
      errorMessage: '',
      messageStatus: false
    }
  },

  computed: {
    ...mapActions(['loginUser', 'signUpUser']),
    ...mapGetters(['getUserToken', 'getErrorMessage', 'getIsLogged'])
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
    },

    // DODATI REFRESH TOKEN
    signUp() {
      const isValid = this.validation()
      if (!isValid) return
      const formData = new FormData()
      if (this.image) {
        formData.append('user_image', this.image)
      }
      formData.append('username', this.username)
      formData.append('password', this.password)
      this.$store
        .dispatch('signUpUser', formData)
        .then((res) => {
          if (res) {
            //console.log(res)
            location.reload()
            //this.$router.push("home")
          } else {
            this.errorMessage = this.getErrorMessage
            this.updateMessage(this.errorMessage)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    },

    login() {
      const isValid = this.validation()
      if (!isValid) return
      this.$store
        .dispatch('loginUser', {
          username: this.username,
          password: this.password
        })
        .then((res) => {
          if (res) {
            // console.log(res);
            location.reload()
          } else {
            this.errorMessage = this.getErrorMessage
            this.updateMessage(this.errorMessage)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.formWrapper {
  margin: 0;
  /*   @include alignment($direction: column);
  @include boxSize($minHeight: 100%, $width: 100%);
  flex: 1; */
}
.loginForm {
  flex: 1;
  @include alignment($direction: column, $justify: space-evenly);
  @include boxSize($minHeight: 400px, $width: 100%);
  box-shadow: $shadowBox;

  .formHeader {
    @include alignment($direction: column, $align: center);

    .signupLink {
      @include fonts($color: rgb(14, 92, 122), $weight: 700);
      cursor: pointer;
      text-decoration: underline;
      //margin: 0 auto;
    }
  }

  input {
    @include boxSize($width: 250px);
    padding: 0.3rem 0;
    background-color: transparent;
    border-bottom: 1px solid darken($color: $graphite, $amount: 20%);
    @include fonts(
      $size: 0.9rem,
      $color: darken($color: $graphite, $amount: 30%)
    );
    /*       -webkit-transition: all 2s ease-in-out;
      transition: all 0.2s ease-in-out;
      &:-webkit-autofill,
      &:focus:-webkit-autofill {
        box-shadow: 0 0 0 100px rgb(250, 255, 189) inset;
        -webkit-box-shadow: 0 0 0 100px rgb(250, 255, 189) inset;
      } */
  }

  .messageWrapper {
    @include boxSize($height: 40px);
  }
}

@media (min-width: 600px) {
  .formWrapper {
    //@include boxSize($width: 400px);
    @include alignment($justify: center, $align: center);

    .loginForm {
      @include boxSize($width: 450px, $maxHeight: 600px);
    }

    button {
      @include boxSize($width: 300px);
    }
    .formGroup {
      input {
        @include boxSize($width: 300px);
      }
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
</style>
