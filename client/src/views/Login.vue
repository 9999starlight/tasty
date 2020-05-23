<template>
  <div class="formWrapper container">
    <form class="loginForm flex pd1" enctype="multipart/form-data">
      <div class="formHeader flex">
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
      <div class="formGroup flex flexCenter">
        <font-awesome-icon
          :icon="['fa', 'user']"
          class="userIcons"
        ></font-awesome-icon>
        <div class="labelWrapper">
          <input type="text" v-model.trim="username" id="username" required />
          <label for="username">Username</label>
        </div>
      </div>
      <div class="formGroup flex flexCenter">
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
  padding: 0;
  @include background(
    radial-gradient(
      ellipse at center,
      rgba(41, 35, 35, 0.349) 0%,
      rgba(27, 26, 26, 0.425) 100%
    ),
    url('../assets/table.jpg'),
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
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.459),
    0 5px 10px -3px rgba(0, 0, 0, 0.322);

  .formHeader {
    @include alignment($direction: column, $align: center);

    h1 {
      font-family: 'Lobster', cursive;
      color: lighten($graphite, 20%);
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
          border-bottom-color: $white;
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
        @include fonts($size: 0.7rem, $color: lighten($graphite, 80%));
        transform: translateY(0);
      }
    }
    .userIcons {
      @include fonts($size: 1.1rem, $color: lighten($graphite, 20%));
      margin-right: 10px;
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
    //@include boxSize($width: 400px);
    @include alignment($justify: center, $align: center);

    .loginForm {
      @include boxSize($width: 450px, $maxHeight: 600px);
    }

    /* button {
      @include boxSize($width: 300px);
    } */
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
          //color: #ee6e73;
          font-size: 0.9rem;
        }
      }
      /*     .userIcons {
      @include fonts($size: 1.1rem, $color: lighten($graphite, 20%));
      margin-right: 10px;
    } */
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
