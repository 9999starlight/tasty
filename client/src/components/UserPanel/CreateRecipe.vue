<template>
  <div class="createRecipe flex flexCenter">
    <h1 id="createRecipeHeading" class="mg1">
      {{ !getEditState ? 'Create new recipe' : 'Edit recipe' }}
    </h1>
    <form class="flex pd1">
      <fieldset class="inputsWrapper mgb1">
        <legend>Basic Data</legend>
        <div class="inner center">
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
          <div class="warnWrapper">
            <p class="warn" v-show="!mealNameWarn">
              Title: 4-50 characters required!
            </p>
          </div>
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
          <div class="warnWrapper">
            <p class="warn" v-show="!introWarn">
              Description: 4-150 characters required!
            </p>
          </div>
          <!-- select options -->
          <label for="dishType"
            ><span class="required">*</span> Dish Type</label
          >
          <Select
            :options="dishTypeOptions"
            :preloaded="preloadedDishType"
            id="dishType"
            ref="dishType"
            @checkValue="validateDishType"
          />
          <div class="warnWrapper">
            <p class="warn" v-show="!dishTypeWarn">
              Please select dish type from menu!
            </p>
          </div>
          <label for="level">Difficulty</label>
          <Select
            :options="difficultyOptions"
            :preloaded="preloadedLevel"
            id="level"
            ref="level"
          />
          <!-- timing -->
          <label for="timing" class="timingLabel"
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
          <div class="warnWrapper">
            <p class="warn" v-show="!timingWarn">
              Minutes (number) is required!
            </p>
          </div>
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
          <div class="warnWrapper">
            <p class="warn" v-show="!personsWarn">
              Number of persons is required!
            </p>
          </div>
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
      </fieldset>
      <!-- Upload photo -->
      <fieldset class="photoUpload mgb1">
        <legend>Image Upload</legend>
        <div class="inner center">
          <div class="images flex">
            <figure v-if="preview" class="flex flexCenter">
              <img :src="preview" :alt="filename" />
              <figcaption>Image preview: {{ filename }}</figcaption>
            </figure>
            <figure
              v-if="getEditState && getSingleRecipe.image"
              class="flex flexCenter"
            >
              <img
                :src="getSingleRecipe.image.url"
                :alt="getSingleRecipe.mealName"
              />
              <figcaption>Current image</figcaption>
            </figure>
            <p v-if="getEditState && getSingleRecipe.image === undefined">
              No current image
            </p>
            <!-- </div> -->
          </div>
          <label for="file" class="block">Select recipe image</label>
          <div class="uploadBtnWrapper">
            <input type="file" ref="recipeImage" @change="selectRecipeImage" />
            <button class="chooseImage">Choose image</button>
          </div>
          <button @click.prevent="removeSelectedImage">Cancel</button>
          <div class="small">
            <small class="block">File formats accepted: jpg/jpeg/png/gif</small>
            <small>Maximum upload file size 2Mb</small>
          </div>
          <div class="warnWrapper">
            <p class="warn" v-if="!valImg">{{ valMessage }}</p>
          </div>
        </div>
      </fieldset>
      <!-- ingredients -->
      <fieldset class="ingredients mgb1">
        <legend>Ingredients</legend>
        <div class="inner center">
          <transition-group name="scale-in-tl">
            <div
              class="singleIngredient"
              v-for="(ingred, index) in ingredients"
              :key="'ing' + index"
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
                @click.prevent="removeIngredient(index)"
                :disabled="ingredients.length === 1"
              >
                Remove ingr
              </button>
            </div>
          </transition-group>
          <button @click="addIngredient">Add ingredient</button>
          <div class="warnWrapper">
            <p class="warn" v-show="!ingredientsWarn">
              At least one ingredient entry is required!
            </p>
          </div>
        </div>
      </fieldset>
      <!-- steps -->
      <fieldset class="steps">
        <legend>Preparation</legend>
        <div class="inner center">
          <transition-group name="scale-in-tl">
            <div class="singleStep" v-for="(st, index) in steps" :key="'st'+index">
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
              <button
                @click.prevent="removeStep(index)"
                :disabled="steps.length === 1"
              >
                Remove step
              </button>
            </div>
          </transition-group>
          <button @click="addStep" class="mgt1">Add step</button>
          <div class="warnWrapper">
            <p class="warn" v-show="!stepsWarn">
              At least one preparation step required!
            </p>
          </div>
        </div>
      </fieldset>
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
      <button
        v-if="!getEditState"
        @click.prevent="validation"
        class="submitBtn"
      >
        Submit Recipe
      </button>
      <button v-else @click.prevent="validation" class="submitBtn">
        Submit Changes
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
import { recipesUrl } from '../../apiData'
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
      preloadedDishType: 0,
      preloadedLevel: 0,
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

  beforeMount() {
    // console.log(this.getEditState, this.getSingleRecipe)
    if (this.getEditState) {
      this.mealName = this.getSingleRecipe.mealName
      this.intro = this.getSingleRecipe.intro
      this.timing = this.getSingleRecipe.timing
      this.persons = this.getSingleRecipe.persons
      this.regional = this.getSingleRecipe.regional
      this.vegetarian = this.getSingleRecipe.vegetarian
      this.glutenFree = this.getSingleRecipe.glutenFree
      this.ingredients = JSON.parse(
        JSON.stringify(this.getSingleRecipe.ingredients)
      )
      this.steps = JSON.parse(JSON.stringify(this.getSingleRecipe.steps))
      const recipeDishType = this.dishTypeOptions.findIndex(
        (op) => op.toLowerCase() === this.getSingleRecipe.dishType
      )
      this.preloadedDishType = recipeDishType
      const recipeLevel = this.difficultyOptions.findIndex(
        (op) => op.toLowerCase() === this.getSingleRecipe.level
      )
      this.preloadedLevel = recipeLevel
    }
  },

  mounted() {
    this.$scrollTo('#createRecipeHeading', 200, {
      easing: 'linear',
      offset: 0
    })
  },

  computed: {
    ...mapGetters(['getCurrentUser', 'getEditState', 'getSingleRecipe']),

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

    removeSelectedImage() {
      this.$refs.recipeImage.value = ''
      this.recipeImage = ''
      this.filename = ''
      this.preview = null
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

    // @blur validations
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

    // validate all fields
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
        if (!this.getEditState) {
          this.submitRecipe()
        } else {
          this.submitChanges()
        }
      } else {
        this.isValid = false
        this.messageStatus = false
        this.updateMessage(`Please check and fill in required fields!`)
        return
      }
    },

    configureFormData() {
      const formData = new FormData()
      if (this.recipeImage) {
        formData.append('image', this.recipeImage)
      }
      formData.append('mealName', this.mealName)
      if (!this.getEditState) {
        formData.append('author', this.getCurrentUser.userId)
      }
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
          formData.append(
            `ingredients[${i}][${prop}]`,
            this.ingredients[i][prop]
          )
        }
      }
      for (let i = 0; i < this.steps.length; i++) {
        for (let prop in this.steps[i]) {
          formData.append(`steps[${i}][${prop}]`, this.steps[i][prop])
        }
      }
      return formData
    },

    async submitRecipe() {
      try {
        this.toggleLoader()
        const fd = this.configureFormData()
        const response = await axios.post(`${recipesUrl}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 7000
        })
        if (response) {
          console.log(response)
          this.$store.dispatch('updateUser', response.data.updatedUser)
          this.toggleLoader()
          this.messageStatus = true
          this.updateMessage(response.data.message)
        }
      } catch (error) {
        this.toggleLoader()
        if (error.response === undefined) {
          this.updateMessage(`Please check and fill in required fields!`)
        } else if (error.response.status === 500) {
          this.updateMessage('Something went wrong, try again later!')
          console.log(error.response.data.message)
        } else {
          this.updateMessage(error.message)
          console.log(error.message)
        }
      }
    },

    // patch recipe
    async submitChanges() {
      try {
        this.toggleLoader()
        const fd = this.configureFormData()
        const response = await axios.patch(
          `${recipesUrl}/${this.getSingleRecipe._id}`,
          fd,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 7000
          }
        )
        if (response) {
          console.log(response.data)
          this.toggleLoader()
          this.$router.push(`/userpanel/user_recipes`)
        }
      } catch (error) {
        this.toggleLoader()
        if (error.response === undefined) {
          this.updateMessage(`Please check and fill in required fields!`)
        } else if (error.response.status === 500) {
          this.updateMessage('Something went wrong, try again later!')
          console.log(error.response.data.message)
        } else {
          this.updateMessage(error.message)
          console.log(error.message)
        }
      }
    }
  },

  async beforeRouteLeave(to, from, next) {
    try {
      await this.$store.dispatch('changeEditState', false)
      await this.$store.dispatch('clearSingleRecipe', '')
      next()
    } catch (error) {
      console.log(error)
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

    &.timingLabel {
      margin: 2rem 0 0.3rem 0;
    }
  }

  textarea {
    resize: none;
    overflow: auto;
    @include boxSize($height: 120px);
    border: 1px solid lightgray;
    padding: 0.7rem;
  }

  fieldset {
    border: 1px solid lightgray;
    padding: 0.6rem;
    @include boxSize($width: 100%, $minWidth: 280px);

    legend {
      margin: 0 auto;
      border: 2px inset white;
      background-color: complement($gray);
      color: white;
      padding: 0.5rem;
      border-radius: 30%;
      font-family: 'Lobster', cursive;
    }
  }

  .inner {
    @include boxSize($width: 100%);
  }

  button {
    padding: 0.3rem;
    width: 100px;
  }

  .warnWrapper {
    @include boxSize($width: 100%, $height: 1rem);
    padding: 0.2rem 0;
    .warn {
      @include fonts($color: crimson, $size: 0.9rem);
    }
  }

  // upload
  .photoUpload {

    .images {
      @include alignment($justify: center, $align: flex-start);
      figure {
        @include alignment($direction: column);
        img {
          @include boxSize($maxWidth: 100%, $height: 100px);
          //margin: 1rem auto;
        }

        figcaption {
          @include fonts($size: 0.8rem);
        }
      }
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
    fieldset {
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

      .images {
        @include alignment($justify: space-evenly);
        figure {
          //@include alignment($direction: column);
          img {
            @include boxSize($height: 200px);
            //margin: 1rem auto;
          }

          figcaption {
            @include fonts($size: 0.9rem);
          }
        }
      }
    }
  }
}
</style>
