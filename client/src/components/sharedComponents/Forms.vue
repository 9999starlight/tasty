<template>
  <div class="searchContainer flex mgt2" id="searchContainer">
    <!-- basic Form -->
    <form class="basicForm flex flexCenter mg1">
      <h3 class="pd1">Search Recipes</h3>
      <div class="basicSearchBox flex mg1">
        <input type="text" v-model="searchValue" placeholder="Search..." />
        <button
          @click.prevent="findRecipes(configBasicParams())"
          type="submit"
          class="hovEffect"
        >
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
    <form class="optionalForm mg1">
      <h3 class="pd1">Search By Categories</h3>
      <div class="dishTypes">
        <label for="dishType">Dish type</label>
        <Select
          :options="dishTypeOptions"
          ref="dishSelect"
          class="categories mgb1"
          id="dishType"
        />
      </div>
      <div class="difficulty">
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
        class="btnAction mg1 hovEffect"
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
          this.queryParams['mealName'] = this.searchValue.toLowerCase()
        if (this.basicSelected === 'ingredient') {
          this.queryParams[
            'ingredients.ingredient'
          ] = this.searchValue.toLowerCase()
        }
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

    // api call with query params
    async findRecipes(params) {
      try {
        await this.$store.dispatch('fetchQueriedRecipes', params)
        this.queryParams = {}
        if (this.renderPage) {
          this.$router.push({ name: 'render_results' })
        } else {
          this.$scrollTo('#searchResults', 200, {
            easing: 'linear',
            offset: -10
          })
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
}

.searchContainer {
  @include boxSize($width: 100%);
  h3 {
    color: $golden;
  }
  form {
    @include alignment($direction: column);
    @include boxSize($width: 100%);
    @include fonts($color: $graphite);
    border: 2px solid lightgray;
    background-image: $zinc;
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
    @include alignment(
      $display: flex,
      $direction: column,
      $justify: center,
      $align: center,
      $textAlign: left
    );

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
    @include boxSize($width: 900px);
    @include alignment($align: flex-start);
    margin: 2rem 0;

    .basicForm,
    .optionalForm {
      padding: 1rem;
      width: 100%;
      box-shadow: 0 4px 9px 0 rgba(41, 40, 40, 0.08),
        0 3px 10px 0 rgba(0, 0, 0, 0.41);
    }

    .basicForm {
      @include alignment($direction: row, $justify: space-evenly);
      margin: 0 0 2rem 0;
      .basicSearchBox {
        order: 3;
      }

      .selectBox {
        order: 2;
        grid-area: selectBox;
        margin: 0;
      }
    }

    .optionalForm {
      @include alignment(
        $display: grid,
        $justify: unset,
        $justifyGrid: center,
        $textAlign: left
      );
      margin: 0;
      grid-template-columns: repeat(3, auto);
      grid-template-rows: repeat(3, auto);
      grid-template-areas: 'title title title' 'dishTypes difficulty checkBoxes' 'btn btn btn';

      h3 {
        grid-area: title;
      }
      .dishTypes {
        grid-area: dishTypes;
      }

      .difficulty {
        grid-area: difficulty;
      }

      .checkBoxes {
        grid-area: checkBoxes;
        margin: 0.6rem 0 0 0;
      }

      button {
        grid-area: btn;
        @include fonts($size: 1.1rem, $weight: 700);
        letter-spacing: 0.2rem;
      }
    }
  }
}

@media (min-width: 1200px) {
  .searchContainer {
    @include alignment($justify: space-evenly, $align: flex-start);
  }
}
</style>
