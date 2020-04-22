<template>
  <div class="searchContainer flex flexCenter mgt2">
    <form>
      <h3>Find recipes</h3>
      <div class="basicSearchBox flex flexCenter">
        <input type="text" v-model="searchValue" placeholder="Search..." />
        <Select :options="basicOptions" class="basicSelect" ref="basicSelect" />
      </div>
      <input @click="findRecipes(configBasicParams())" type="button" value="Search" />
    </form>
    <form>
      <h3>Find with options</h3>
      <span>Dish type</span>
      <Select :options="dishTypeOptions" ref="dishSelect" />
      <!--  -->
      <span>Difficulty</span>
      <Select :options="difficultyOptions" ref="difficultySelect" />
      <!--  -->
      <label for="vegetarianCheck">Vegetarian</label>
      <input
        type="checkbox"
        id="vegetarianCheck"
        name="vegetarianCheck"
        value="vegetarian"
        v-model="vegetarian"
      />
      <label for="glutenCheck">Gluten Free</label>
      <input
        type="checkbox"
        id="glutenCheck"
        name="glutenCheck"
        value="glutenFree"
        v-model="glutenFree"
      />
      <input @click="findRecipes(configDetailedParams())" type="button" value="Submit" />
    </form>
  </div>
</template>

<script>
import Select from '../Select'
// import { recipesUrl } from '../../apiData'
// import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'BrowseRecipes',

  data() {
    return {
      searchValue: '',
      basicOptions: ['Ingredient', 'Title', 'Regional'],
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
      // briši iz basicSelect any category ako su dve forme
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
      } catch (error) {
        console.log(error.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.searchContainer {
  @include boxSize($width: 100%);
  @include alignment($direction: column);
  flex: 1;
  overflow: auto;
  form {
    @include boxSize($width: 100%);
  }
  .basicSearchBox {
    input {
      @include boxSize($width: 50%);
    }
    .basicSelect {
      width: 50%;
    }
  }
}
</style>
