<template>
  <form class="flex pd1">
    <fieldset class="inputsWrapper mgb1">
      <legend>Basic Data</legend>
      <div class="inner center">
        <!-- mealName -->
        <label for="mealName"><span class="required">*</span> Meal Name</label>
        <input
          type="text"
          v-model.trim="mealName"
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
          v-model.trim="intro"
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
        <label for="dishType"><span class="required">*</span> Dish Type</label>
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
          ><span class="required">*</span> Preparation Time (in minutes)</label
        >
        <div class="numberWrapper flex">
          <button
            @click.prevent="timing >= 2 ? timing-- : (timing = 1)"
            class="plusMinus"
          >
            <font-awesome-icon :icon="['fa', 'minus']"></font-awesome-icon>
          </button>
          <input
            type="number"
            min="1"
            v-model.number="timing"
            id="timing"
            @blur="validateTiming"
          />
          <button @click.prevent="timing++" class="plusMinus">
            <font-awesome-icon :icon="['fa', 'plus']"></font-awesome-icon>
          </button>
        </div>
        <div class="warnWrapper">
          <p class="warn" v-show="!timingWarn">
            Minutes (number) is required!
          </p>
        </div>
        <!-- persons -->
        <label for="persons"
          ><span class="required">*</span> Number of persons</label
        >
        <div class="numberWrapper flex">
          <button
            @click.prevent="persons >= 2 ? persons-- : (persons = 1)"
            class="plusMinus"
          >
            <font-awesome-icon :icon="['fa', 'minus']"></font-awesome-icon>
          </button>
          <input
            v-model.number="persons"
            type="number"
            min="1"
            id="persons"
            required
            @blur="validatePersons"
          />
          <button @click.prevent="persons++" class="plusMinus">
            <font-awesome-icon :icon="['fa', 'plus']"></font-awesome-icon>
          </button>
        </div>
        <div class="warnWrapper">
          <p class="warn" v-show="!personsWarn">
            Number of persons is required!
          </p>
        </div>
        <!-- regional -->
        <label for="regional">Regional</label>
        <input
          v-model.trim="regional"
          type="text"
          id="regional"
          placeholder="Enter country or region"
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
            <img :src="preview" :alt="filename" loading="lazy" />
            <figcaption>Image preview: {{ filename }}</figcaption>
          </figure>
          <figure
            v-if="getEditState && getSingleRecipe.image"
            class="flex flexCenter"
          >
            <img
              :src="getSingleRecipe.image.url"
              :alt="getSingleRecipe.mealName"
              loading="lazy"
            />
            <figcaption>Current image</figcaption>
          </figure>
          <p v-if="getEditState && getSingleRecipe.image === undefined">
            No current image
          </p>
        </div>
        <h4 class="block mgt1">Select recipe image</h4>
        <label for="recipeImage" class="uploadBtnWrapper hovEffect">
          <input
            type="file"
            ref="recipeImage"
            id="recipeImage"
            @change="selectRecipeImage"
          />
          Browse image
        </label>
        <button
          v-if="preview"
          @click.prevent="removeSelectedImage"
          class="remove hovEffect"
        >
          Cancel
        </button>
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
        <transition-group name="scale-in-tl" tag="ul">
          <li
            class="singleIngredient"
            v-for="(ingred, index) in ingredients"
            :key="'ing' + index"
          >
            <label :for="'ingred' + index"
              ><span class="required">*</span> Ingredient</label
            >
            <input
              type="text"
              placeholder="Enter ingredient"
              required
              :id="'ingred' + index"
              v-model.trim="ingred.ingredient"
              @blur="validateIngredients"
            />
            <label :for="'amount' + index">Amount</label>
            <input
              type="text"
              :id="'amount' + index"
              placeholder="Enter amount of this ingredient"
              v-model.trim="ingred.amount"
            />
            <button
              @click.prevent="removeIngredient(index)"
              class="remove mgt1 tooltipContainer"
              :disabled="ingredients.length === 1"
            >
              Remove
              <font-awesome-icon
                :icon="['fa', 'minus']"
                class="icons"
              ></font-awesome-icon>
              <Tooltip
                v-if="ingredients.length !== 1"
                :tooltipText="'Remove this ingredient'"
              />
            </button>
          </li>
        </transition-group>
        <button @click="addIngredient" class="mgt1 add tooltipContainer">
          Add
          <font-awesome-icon
            :icon="['fa', 'plus']"
            class="icons"
          ></font-awesome-icon>
          <Tooltip :tooltipText="'Add new ingredient'" />
        </button>
        <div class="warnWrapper">
          <p class="warn" v-show="!ingredientsWarn">
            At least one ingredient entry is required!
          </p>
        </div>
      </div>
    </fieldset>
    <!-- steps -->
    <fieldset class="steps">
      <legend>Preparation steps</legend>
      <div class="inner center">
        <transition-group name="scale-in-tl" tag="ul">
          <li
            class="singleStep"
            v-for="(st, index) in steps"
            :key="'st' + index"
          >
            <label :for="'step' + index"
              ><span class="required">*</span> Step {{ index + 1 }}</label
            >
            <textarea
              :id="'step' + index"
              required
              v-model.trim="st.step"
              placeholder="Enter the step of preparation"
              @blur="validateSteps"
            ></textarea>
            <button
              @click.prevent="removeStep(index)"
              :disabled="steps.length === 1"
              class="remove mgt1 tooltipContainer"
            >
              Remove<font-awesome-icon
                :icon="['fa', 'minus']"
                class="icons"
              ></font-awesome-icon>
              <Tooltip
                v-if="steps.length !== 1"
                :tooltipText="'Remove this step'"
              />
            </button>
          </li>
        </transition-group>
        <button @click="addStep" class="mgt1 add tooltipContainer">
          Add<font-awesome-icon
            :icon="['fa', 'plus']"
            class="icons"
          ></font-awesome-icon>
          <Tooltip :tooltipText="'Add preparation step'" />
        </button>
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
      class="submitBtn hovEffect"
    >
      Submit Recipe
    </button>
    <button v-else @click.prevent="validation" class="submitBtn hovEffect">
      Submit Changes
    </button>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'
import Select from './Select'
import Tooltip from './Tooltip'
import fileValidation from '../../mixins/fileValidation'
import loaderMixin from '../../mixins/loaderMixin'
import titleCase from '../../filters/titleCase'
import sentenceCase from '../../filters/sentenceCase'
import axios from 'axios'
import { recipesUrl } from '../../apiData'
export default {
  name: 'create_recipe',

  components: {
    Select,
    Tooltip,
    InfoMessage: () => import('./InfoMessage.vue'),
    Loader: () => import('./Loader.vue')
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
      timing: 1,
      persons: 1,
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

  filters: {
    sentenceCase,
    titleCase
  },

  beforeMount() {
    if (this.getEditState) {
      this.mealName = this.$options.filters.titleCase(
        this.getSingleRecipe.mealName
      )
      this.intro = this.$options.filters.sentenceCase(
        this.getSingleRecipe.intro
      )
      this.timing = this.getSingleRecipe.timing
      this.persons = this.getSingleRecipe.persons
      this.regional = this.$options.filters.titleCase(
        this.getSingleRecipe.regional
      )
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
      const numberTest = /^[1-9]\d*$/g
      if (!numberTest.test(this.timing)) {
        this.timingWarn = false
        return false
      } else {
        this.timingWarn = true
        return true
      }
    },

    validatePersons() {
      const numberTest = /^[1-9]\d*$/g
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
          this.$store.dispatch('updateUser', response.data.updatedUser)
          this.toggleLoader()
          this.$router.push(`/SingleResult/${response.data.createdRecipe._id}`)
        }
      } catch (error) {
        console.log(error.message)
        this.toggleLoader()
        this.updateMessage(error.response.data.message)
        console.log(error.response.data.message)
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
          this.toggleLoader()
          await this.$store.dispatch('changeEditState', false)
          this.$router.push(`/SingleResult/${this.getSingleRecipe._id}`)
        }
      } catch (error) {
        this.toggleLoader()
        this.updateMessage(error.response.data.message)
        console.log(error.response.data.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  @include alignment(
    $direction: column,
    $justify: space-evenly,
    $align: center,
    $textAlign: left
  );
  @include boxSize($width: 100%);
  background: #ada996;
  background: $zinc;
  color: lighten($graphite, 10%);
  padding: 1rem 0;

  input,
  label,
  textarea,
  button {
    @include alignment($display: block);
  }

  input[type='text'],
  textarea {
    padding: 0.5rem 0.3rem;
    @include fonts($color: $graphite);
    @include boxSize($width: 100%);
    border: 1px solid lighten($graphite, 55%);
    border-radius: 6px;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    //-webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
    @include fonts($color: $graphite, $weight: 700);
    text-align: center;
    border-radius: 0;
    @include boxSize($width: 4rem, $height: 2rem);
  }

  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  .plusMinus {
    box-shadow: none;
    @include boxSize($width: 2rem, $height: 2rem);
    border-radius: 0;
    background-color: #8396c7;
    background: $blueGradient;
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
    background-color: rgba(255, 255, 255, 0.3);

    legend {
      margin: 0 auto;
      border: 2px inset $light;
      background-color: complement($midTone);
      color: $light;
      padding: 0.5rem;
      border-radius: 30%;
      font-size: 1.1rem;
      font-family: 'Lobster', cursive;
      text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.3),
        0px -1px 0px rgba(0, 0, 0, 0.7);
    }
  }

  .inner {
    @include boxSize($width: 100%);
  }

  .uploadBtnWrapper {
    border-radius: 4px;
    width: 120px;
  }

  button {
    padding: 0.4rem;
    width: 120px;
    color: $light;
    box-shadow: $shadowSmall;
    border-width: 0;
    border-radius: 4px;
    &.add {
      background-color: #8396c7;
      background: $blueGradient;
    }
    &.remove {
      background: linear-gradient(180deg, #776d6de0, #322628ba);
    }
    .icons {
      margin-left: 0.5rem;
    }
  }

  .numberWrapper {
    width: max-content;
    border: 1px solid lighten($midTone, 30%);
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
        }

        figcaption {
          @include fonts($size: 0.8rem);
        }
      }
    }

    .small {
      @include boxSize($height: 70px);
    }
  }

  .ingredients .add,
  .steps .add {
    margin: 1rem auto;
  }

  .singleIngredient,
  .singleStep {
    width: 100%;
    padding: 0.5rem;
    border: 2px solid lightgray;
    margin-bottom: 1rem;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .submitBtn {
    background: $orangeGradient;
    @include fonts($color: $light, $weight: 600, $size: 1.1rem);
    padding: 0.6rem 0.4rem;
    width: 200px;
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
          img {
            @include boxSize($height: 200px);
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
