<template>
  <div class="searchContainer flex mgt2" id="searchContainer">
    <form class="basicForm flex flexCenter mg1">
      <h3 class="lightItalic pd1">Find Recipes</h3>
      <div class="basicSearchBox flex mg1">
        <input type="text" v-model="searchValue" placeholder="Search..." />
        <button @click.prevent="findRecipes(configBasicParams())" type="submit">
          <font-awesome-icon
            :icon="['fa', 'search']"
            class="search"
          ></font-awesome-icon>
        </button>
      </div>
      <Select
        :options="basicOptions"
        class="basicSelect mgb1"
        ref="basicSelect"
      />
    </form>
    <form class="optionalForm flex flexCenter mg1">
      <h3 class="lightItalic pd1">Search by Categories</h3>
      <div>
        <label for="dishType">Dish type</label>
        <Select
          :options="dishTypeOptions"
          ref="dishSelect"
          class="categories mgb1"
          id="dishType"
        />
      </div>
      <!--  -->
      <div>
        <label for="">Difficulty</label>
        <Select
          :options="difficultyOptions"
          ref="difficultySelect"
          class="categories mgb1"
          id="difficulty"
        />
      </div>
      <!--  -->
      <div class="checkBoxes flex">
        <label for="vegetarianCheck" class="block"
          >Vegetarian
          <input
            type="checkbox"
            id="vegetarianCheck"
            name="vegetarianCheck"
            value="vegetarian"
            v-model="vegetarian"
          />
          <span></span>
        </label>
        <label for="glutenCheck" class="block"
          >Gluten Free
          <input
            type="checkbox"
            id="glutenCheck"
            name="glutenCheck"
            value="glutenFree"
            v-model="glutenFree"
          />
          <span></span>
        </label>
      </div>
      <button
        @click.prevent="findRecipes(configDetailedParams())"
        type="submit"
        class="mg1"
      >
        Search
      </button>
    </form>
  </div>
</template>

<script>
import Select from '../sharedComponents/Select'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'BrowseRecipes',

  data() {
    return {
      searchValue: '',
      basicOptions: ['Ingredient', 'Title'],
      dishTypeOptions: [
        'Any Category',
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
      difficultyOptions: ['Any Category', 'Easy', 'Medium', 'Hard'],
      vegetarian: false,
      glutenFree: false,
      queryParams: {}
    }
  },

  components: {
    Select
  },

  computed: {
    ...mapActions(['fetchQueriedRecipes']),
    ...mapGetters(['getQueriedRecipes']),
    basicSelected() {
      if (this.$refs['basicSelect'].selected === 'Any Category') return ''
      else return this.$refs['basicSelect'].selected.toLowerCase()
    },

    dishSelected() {
      if (this.$refs['dishSelect'].selected === 'Any Category') return ''
      else return this.$refs['dishSelect'].selected.toLowerCase()
    },

    levelSelected() {
      if (this.$refs['difficultySelect'].selected === 'Any Category') return ''
      else return this.$refs['difficultySelect'].selected.toLowerCase()
    }
  },

  methods: {
    // set query params
    configBasicParams() {
      if (this.basicSelected !== '') {
        if (this.basicSelected === 'title')
          this.queryParams['mealName'] = this.searchValue
        if (this.basicSelected === 'ingredient')
          this.queryParams['ingredients.ingredient'] = this.searchValue
        if (this.basicSelected === 'regional')
          this.queryParams['regional'] = this.searchValue
      }
      return this.queryParams
    },
    configDetailedParams() {
      if (this.dishSelected || !this.dishSelected.length === 0) {
        this.queryParams['dishType'] = this.dishSelected
      }
      if (this.levelSelected || !this.levelSelected.length === 0) {
        this.queryParams['level'] = this.levelSelected
      }
      if (this.vegetarian) {
        this.queryParams['vegetarian'] = true
      }
      if (this.glutenFree) {
        this.queryParams['glutenFree'] = true
      }
      return this.queryParams
    },

    // call with query params
    async findRecipes(params) {
      console.log(params)
      try {
        await this.$store.dispatch('fetchQueriedRecipes', params)
        // console.log(this.getQueriedRecipes)
        this.queryParams = {}
        this.$scrollTo('#searchResults', 200, { easing: 'linear', offset: -10 })
      } catch (error) {
        console.log(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.searchContainer {
  @include alignment($direction: column, $justify: center, $align: center);
  grid-area: forms;
}

.searchContainer {
  @include boxSize($width: 100%);
  flex: 1;
  overflow: auto;

  form {
    @include alignment($direction: column);
    @include boxSize($width: 100%);
    // box-shadow: $shadowSmall;
    border: 2px solid lightgray;
  }

  .basicForm {
    .basicSearchBox {
      @include boxSize($width: 250px);
      input {
        @include boxSize($width: 210px, $height: 2rem);
        border: 1px solid lightgray;
      }
      button {
        @include boxSize($width: 40px, $height: 2rem);
        background-image: linear-gradient(to top, #44a8c9 0%, #76a9b8 100%);
        @include fonts($color: $white);
      }
    }
  }

  .optionalForm {
    @include alignment($textAlign: left);
    
    // checkboxes style
    label {
      display: inline-block;
      margin-bottom: 0.3rem;
    }
    .checkBoxes {
      @include alignment($justify: space-around);
      @include boxSize($width: 250px);
      margin: 0.5rem 0;
      label {
        position: relative;
        padding-left: 2rem;
        input {
          position: absolute;
          visibility: hidden;
          cursor: pointer;
        }

        span {
          position: absolute;
          top: 0;
          left: 0;
          height: 1.6rem;
          width: 1.6rem;
          background-color: lightgray;
          border-radius: 5px;

          &:after {
            content: ' \2714';
            position: absolute;
            visibility: hidden;
            color: white;
            font-size: 1.2rem;
            left: 0.4rem;
          }
        }
        input:checked ~ span:after {
          visibility: visible;
        }
        input:checked ~ span {
          background-color: rgba(74, 143, 74, 0.979);
        }
      }
    }
    button {
      @include boxSize($width: 250px, $height: 2rem);
      display: inline-block;
      background-image: linear-gradient(to top, #44a8c9 0%, #76a9b8 100%);
      @include fonts($color: $white, $size: 1rem);
    }
  }
}

@media (min-width: 776px) {
  .searchContainer {
    @include boxSize($width: 70%);
  }
}

@media (min-width: 992px) {
  .searchContainer {
    @include boxSize($width: 100%);
    @include alignment($direction: row, $align: flex-start);

    form {
      @include boxSize($width: 450px);
    }
  }
}
</style>
