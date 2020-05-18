<template>
  <div class="createRecipe flex flexCenter">
    <h1 id="createRecipeHeading" class="mg1">Create new recipe</h1>
    <form enctype="multipart/form-data" class="flex pd1">
      <div class="inputsWrapper flex flexCenter">
        <div class="inner">
          <!-- mealName -->
          <label for="mealName"
            ><span class="required">*</span> Meal Name</label
          >
          <input
            type="text"
            v-model="mealName"
            id="mealName"
            required
            placeholder="Meal Name, 4-50 characters"
            minlength="4"
            maxlength="50"
            @blur="validateMealName"
          />
          <p class="warn" v-show="!mealNameWarn">
            Title: 4-50 characters required!
          </p>
          <!-- description -->
          <label for="intro"><span class="required">*</span> Description</label>
          <textarea
            v-model="intro"
            id="intro"
            required
            placeholder="Description, 4-150 characters"
            minlength="4"
            maxlength="150"
            @blur="validateIntro"
          ></textarea>
          <p class="warn" v-show="!introWarn">
            Description: 4-150 characters required!
          </p>
          <!-- select options -->
          <label for="dishType"
            ><span class="required">*</span> Dish Type</label
          >
          <Select
            :options="dishTypeOptions"
            id="dishType"
            ref="dishType"
            @checkValue="validateDishType"
          />
          <p class="warn" v-show="!dishTypeWarn">
            Please select dish type from menu!
          </p>
          <label for="level">Difficulty</label>
          <Select :options="difficultyOptions" id="level" ref="level" />
          <!-- timing -->
          <label for="timing"
            ><span class="required">*</span> Preparation Time (in
            minutes)</label
          >
          <input
            type="number"
            v-model="timing"
            id="timing"
            title="Preparation time in minutes"
            @blur="validateTiming"
          />
          <p class="warn" v-show="!timingWarn">Minutes (number) is required!</p>
          <!-- persons -->
          <label for="persons"
            ><span class="required">*</span> Number of persons</label
          >
          <input
            v-model="persons"
            type="number"
            id="persons"
            required
            title="Amount is enough for entered number of persons"
            @blur="validatePersons"
          />
          <p class="warn" v-show="!personsWarn">
            Number of persons is required!
          </p>
          <!-- regional -->
          <label for="regional">Regional</label>
          <input
            v-model="regional"
            type="text"
            id="regional"
            placeholder="Regional"
            title="Enter country or region"
          />
          <!-- checkBoxes -->
          <div class="checkBoxes flex">
            <label for="vegetarian" class="block"
              >Vegetarian
              <input
                type="checkbox"
                id="vegetarian"
                name="vegetarian"
                value="vegetarian"
                v-model="vegetarian"
              />
              <span tabindex="0"></span>
            </label>
            <label for="gluten" class="block"
              >Gluten Free
              <input
                type="checkbox"
                id="gluten"
                name="gluten"
                value="gluten"
                v-model="glutenFree"
              />
              <span tabindex="0"></span>
            </label>
          </div>
        </div>
      </div>
      <!-- Upload photo -->
      <div class="photoUpload mgt1 flex flexCenter">
        <div class="inner">
          <figure>
            <img v-if="preview" :src="preview" />
          </figure>
          <small class="block selected" v-show="filename"
            >Image preview: {{ filename }}</small
          >
          <label for="file" class="block">Select recipe image</label>
          <div class="uploadBtnWrapper">
            <input type="file" ref="recipeImage" @change="selectRecipeImage" />
            <button class="chooseImage">Choose image</button>
          </div>
          <div class="small">
            <small class="block">File formats accepted: jpg/jpeg/png/gif</small>
            <small>Maximum upload file size 2Mb</small>
          </div>
          <p class="warn" v-if="!valImg">{{ valMessage }}</p>
        </div>
      </div>
      <!-- ingredients -->
      <div class="ingredients mgt1 flex flexCenter">
        <div class="inner">
          <h4>Ingredients</h4>
          <div
            class="singleIngredient"
            v-for="(ingred, index) in ingredients"
            :key="index"
          >
            <label :for="'ingred' + index"
              ><span class="required">*</span> Ingredient</label
            >
            <input
              type="text"
              placeholder="At least one ingredient required"
              required
              title="Enter ingredient"
              :id="'ingred' + index"
              v-model="ingred.ingredient"
              @blur="validateIngredients"
            />
            <label :for="'amount' + index">Amount</label>
            <input
              type="text"
              :id="'amount' + index"
              placeholder="Ingredient Amount"
              title="Enter amount of this ingredient"
              v-model="ingred.amount"
            />
            <button
              @click="removeIngredient(index)"
              :disabled="ingredients.length === 1"
            >
              Remove ingr
            </button>
          </div>
          <button @click="addIngredient">Add another ingredient</button>
          <p class="warn" v-show="!ingredientsWarn">
            At least one ingredient entry is required!
          </p>
        </div>
      </div>
      <!-- steps -->
      <div class="steps mgt1 flex flexCenter mgb1">
        <div class="inner">
          <h4>Preparation steps</h4>
          <div class="singleStep" v-for="(st, index) in steps" :key="index">
            <label :for="'step' + index"
              ><span class="required">*</span> Step {{ index + 1 }}</label
            >
            <textarea
              :id="'step' + index"
              required
              v-model="st.step"
              placeholder="At least one preparation step required"
              title="Enter the step of preparation"
              @blur="validateSteps"
            ></textarea>
            <button @click="removeStep(index)" :disabled="steps.length === 1">Remove step</button>
          </div>
          <button @click="addStep" class="mgt1">Add next step</button>
          <p class="warn" v-show="!stepsWarn">
            At least one preparation step required!
          </p>
        </div>
      </div>
      <!-- message -->
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
      <Loader :bigLoader="bigLoader" v-show="isLoading" />
      <button @click.prevent="validation" class="submitBtn">
        Submit Recipe
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Select from '../sharedComponents/Select'
import InfoMessage from '../sharedComponents/InfoMessage'
import Loader from '../sharedComponents/Loader'
import fileValidation from '../../mixins/fileValidation'
import loaderMixin from '../../mixins/loaderMixin'
import axios from 'axios'
import { recipesUrl, source } from '../../apiData'
export default {
  name: 'create_recipe',

  components: {
    Select,
    InfoMessage,
    Loader
  },

  data() {
    return {
      message: '',
      messageStatus: false,
      bigLoader: false,
      dishTypeOptions: [
        'Select Dish Type',
        'Bread',
        'Pasta',
        'Salad',
        'Soup',
        'Side Dish',
        'Main',
        'Roast',
        'Pizza',
        'Stew',
        'Sandwich',
        'Pastry',
        'Sauce',
        'Cookie',
        'Dessert',
        'Drink',
        'Snack'
      ],

      difficultyOptions: ['Easy', 'Medium', 'Hard'],
      filename: '',
      recipeImage: '',
      preview: null,
      mealName: '',
      intro: '',
      timing: '',
      persons: '',
      regional: '',
      vegetarian: false,
      glutenFree: false,
      ingredients: [{ ingredient: '', amount: '' }],
      steps: [{ step: '' }],
      mealNameWarn: true,
      introWarn: true,
      dishTypeWarn: true,
      timingWarn: true,
      personsWarn: true,
      ingredientsWarn: true,
      stepsWarn: true,
      isValid: false
    }
  },

  mixins: [fileValidation, loaderMixin],

  mounted() {
    this.$scrollTo('#createRecipeHeading', 200, {
      easing: 'linear',
      offset: 0
    })
  },

  computed: {
    ...mapGetters(['getCurrentUser']),

    dishTypeSelected() {
      return this.$refs['dishType'].selected.toLowerCase()
    },
    difficultySelected() {
      return this.$refs['level'].selected.toLowerCase()
    },

    valImg() {
      if (this.preview && !this.imageValidation(this.recipeImage)) {
        return false
      } else {
        return true
      }
    }
  },

  methods: {
    updateMessage(message) {
      this.message = message
    },

    selectRecipeImage() {
      this.recipeImage = this.$refs.recipeImage.files[0]
      this.filename = this.$refs.recipeImage.files[0].name
      this.preview = URL.createObjectURL(this.recipeImage)
    },

    addIngredient() {
      this.ingredients.push({
        ingredient: '',
        amount: ''
      })
    },

    removeIngredient(index) {
      this.ingredients.splice(index, 1)
    },

    addStep() {
      this.steps.push({ step: '' })
    },

    removeStep(index) {
      this.steps.splice(index, 1)
    },

    // validations

    validateMealName() {
      const nameTest = /^(?!\s*$).{4,50}/i
      if (!nameTest.test(this.mealName)) {
        this.mealNameWarn = false
        return false
      } else {
        this.mealNameWarn = true
        return true
      }
    },

    validateIntro() {
      const decriptionTest = /^(?!\s*$).{4,150}/i
      if (!decriptionTest.test(this.intro)) {
        this.introWarn = false
        return false
      } else {
        this.introWarn = true
        return true
      }
    },

    validateDishType() {
      if (this.dishTypeSelected === 'select dish type') {
        this.dishTypeWarn = false
        return false
      } else {
        this.dishTypeWarn = true
        return true
      }
    },

    validateTiming() {
      const numberTest = /^[0-9]+$/g
      if (!numberTest.test(this.timing)) {
        this.timingWarn = false
        return false
      } else {
        this.timingWarn = true
        return true
      }
    },

    validatePersons() {
      const numberTest = /^[0-9]+$/g
      if (!numberTest.test(this.persons)) {
        this.personsWarn = false
        return false
      } else {
        this.personsWarn = true
        return true
      }
    },

    validateIngredients() {
      const findEmpty = this.ingredients.find((ingr) => ingr.ingredient === '')
      // console.log('ingr', findEmpty)
      if (!this.ingredients.length || findEmpty) {
        this.ingredientsWarn = false
        return false
      } else {
        this.ingredientsWarn = true
        return true
      }
    },

    validateSteps() {
      const findEmpty = this.steps.find((st) => st.step === '')
      // console.log('steps', findEmpty)
      if (!this.steps.length || findEmpty) {
        this.stepsWarn = false
        return false
      } else {
        this.stepsWarn = true
        return true
      }
    },
    
    // validate fields
    validation() {
      if (
        this.validateMealName() &&
        this.validateIntro() &&
        this.validateDishType() &&
        this.validateTiming() &&
        this.validatePersons() &&
        this.validateIngredients() &&
        this.validateSteps()
      ) {
        this.isValid = true
      }
      if (this.isValid && this.valImg) {
        this.updateMessage('')
        this.submitRecipe()
      } else {
        this.isValid = false
        this.messageStatus = false
        this.updateMessage(`Please check and fill in required fields!`)
        return
      }
    },

    async submitRecipe() {
      try {
        this.toggleLoader()
        const formData = new FormData()
        if (this.recipeImage) {
          formData.append('image', this.recipeImage)
        }
        formData.append('mealName', this.mealName)
        formData.append('author', this.getCurrentUser.userId)
        formData.append('intro', this.intro)
        formData.append('dishType', this.dishTypeSelected)
        formData.append('level', this.difficultySelected)
        formData.append('timing', this.timing)
        formData.append('persons', this.persons)
        if (this.regional) {
          formData.append('regional', this.regional)
        }
        formData.append('vegetarian', this.vegetarian)
        formData.append('glutenFree', this.glutenFree)
        // form data - append arrays of objects (ingredients and steps)
        for (let i = 0; i < this.ingredients.length; i++) {
          for (let prop in this.ingredients[i]) {
            formData.append(`ingredients[${i}][${prop}]`, this.ingredients[i][prop])
          }
        }
        for (let i = 0; i < this.steps.length; i++) {
          for (let prop in this.steps[i]) {
            formData.append(`steps[${i}][${prop}]`, this.steps[i][prop])
          }
        }
        // post recipe
        const response = await axios.post(`${recipesUrl}`, formData, {
          cancelToken: source.token,
          timeout: 5000
        })
        if (response) {
          console.log(response)
          this.$store.dispatch('updateUser', response.data.updatedUser)
          this.toggleLoader()
          this.messageStatus = true
          this.updateMessage(response.data.message)
        }
      } catch (error) {
         (thrown) => {
          this.messageStatus = false
          if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message)
          }
        }
        this.toggleLoader()
        if (error.response) {
          this.updateMessage(error.response.data.message)
          console.log(error.response.data.message)
        } else {
          this.updateMessage(error.message)
          console.log(error.message)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.createRecipe {
  @include alignment($direction: column);
  @include boxSize($width: 100%);
  h1 {
    font-family: 'Lobster', cursive;
    color: lighten($graphite, 20%);
    //color: $white;
  }
}

form {
  // @include boxSize($width: 100%);
  @include alignment(
    $direction: column,
    $justify: space-evenly,
    $align: center,
    $textAlign: left
  );
  @include boxSize($width: 100%);
  // background-color: lighten($graphite, 10%);
  color: lighten($graphite, 10%);
  padding: 1rem 0;

  input,
  label,
  textarea,
  button {
    @include alignment($display: block);
  }

  input[type='text'],
  input[type='number'],
  textarea {
    padding: 0.3rem;
    @include fonts($color: $graphite);
    @include boxSize($width: 100%, $maxWidth: 300px);
    border: 1px solid lighten($graphite, 55%);
    border-radius: 6px;
  }

  label {
    margin: 1rem 0 0.3rem 0;
  }

  textarea {
    resize: none;
    overflow: auto;
    @include boxSize($height: 120px);
    border: 1px solid lightgray;
    padding: 0.7rem;
  }

  .inputsWrapper,
  .photoUpload,
  .ingredients,
  .steps {
    border: 1px solid lightgray;
    padding: 0.6rem;
    @include boxSize($width: 100%);
  }

  .inner {
    @include boxSize($width: 100%);
  }

  button {
    padding: 0.3rem;
    width: 100px;
  }

  .warn {
    @include fonts($color: crimson, $size: 0.9rem);
    padding: 0.4rem;
  }

  // upload
  .photoUpload {
    //@include alignment($direction: column, $textAlign: left);
    img {
      @include boxSize($maxWidth: 100%, $height: 250px);
      margin: 1rem auto;
    }
    .uploadBtnWrapper {
      position: relative;
      overflow: hidden;
      display: inline-block;
      box-shadow: $shadowSmall;
      margin: 0.8rem 0;
      button {
        background: lighten($graphite, 40%);
        @include fonts($color: $white);
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
  }

  .submitBtn {
    background: $orangeGradient;
    @include fonts($color: $white, $weight: 600);
    padding: 0.4rem;
    @include boxSize($width: 150px);
    box-shadow: $shadowSmall;
  }
}

@media (min-width: 576px) {
  form {
    .inputsWrapper,
    .photoUpload,
    .ingredients,
    .steps {
      @include boxSize($width: 550px);
    }

    .inner {
      @include boxSize($width: 500px);

      input[type='text'],
      input[type='number'],
      textarea {
        @include fonts($color: $graphite);
        @include boxSize($maxWidth: initial);
      }
    }
  }
}
</style>
