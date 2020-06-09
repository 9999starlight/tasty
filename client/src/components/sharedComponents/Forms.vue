<template>
  <div class="searchContainer flex mgt2" id="searchContainer">
    <!-- basic Form -->
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
    <!-- optional form -->
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
      <div>
        <label for="">Difficulty</label>
        <Select
          :options="difficultyOptions"
          ref="difficultySelect"
          class="categories mgb1"
          id="difficulty"
        />
      </div>
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
          <span tabindex="0"></span>
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
          <span tabindex="0"></span>
        </label>
      </div>
      <button
        @click.prevent="findRecipes(configDetailedParams())"
        type="submit"
        class="btnAction mg1"
      >
        Search
      </button>
    </form>
  </div>
</template>

<script>
import Select from './Select'
import { mapActions } from 'vuex'

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

  props: {
    renderPage: {
      type: Boolean,
      default: true
    }
  },

  components: {
    Select
  },

  computed: {
    ...mapActions(['fetchQueriedRecipes']),

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
      //console.log(params)
      try {
        await this.$store.dispatch('fetchQueriedRecipes', params)
        // console.log(this.getQueriedRecipes)
        this.queryParams = {}
        if (this.renderPage) {
          this.$router.push({ name: 'render_results' })
        } else {
          this.$scrollTo('#searchResults', 200, { easing: 'linear', offset: -10 })
        }
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
  //overflow: auto;

  form {
    @include alignment($direction: column);
    @include boxSize($width: 100%);
    @include fonts($color: $graphite);
    border: 2px solid lightgray;
  }

  .basicForm {
    .basicSearchBox {
      @include boxSize($width: 260px);
      input {
        @include boxSize($width: 200px, $height: 2rem);
        padding: 0 0.4rem;
        border: 1px solid lightgray;
        border-radius: 6px 0 0 6px;
      }
      button {
        @include boxSize($width: 60px, $height: 2rem);
        background-color: #fbab7e;
        background: $orangeGradient;
        @include fonts($color: $light);
        border-radius: 0 6px 6px 0;
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
  }
}

@media (min-width: 768px) {
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

@media (min-width: 1200px) {
  .searchContainer {
    @include boxSize($width: 1100px);
    @include alignment($justify: space-evenly, $align: flex-start);
  }
}
</style>
