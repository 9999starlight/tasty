<template>
  <div class="searchContainer flex flexCenter mgt2">
    <form action="">
      <fieldset>
        <div class="basicSearchBox flex flexCenter">
          <input type="text" v-model="searchValue" placeholder="Search..."/>
          <Select :options="basicOptions" class="basicSelect" ref="basicSelect" />
        </div>
<!--         <div class="moreOptions" @click="toggleOptions">
          <span>More options</span>
          <font-awesome-icon
            :icon="['fa', 'chevron-down']"
            class="selectIcon"
          ></font-awesome-icon>
        </div> -->
      </fieldset>
      <fieldset class="detailedSearch">
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
      </fieldset>
      <div class="buttonsWrapper">
        <!-- <button @submit="queryParams" type="submit" class="submitSearch">Submit</button> -->
        <input @click="findRecipes" type="button" value="Submit" />
      </div>
    </form>
    <div class="tags">
      <figure class="tag">
        <img src="" alt="" />
        <figcaption>Easy to prepare</figcaption>
      </figure>
      <figure class="tag">
        <img src="" alt="" />
        <figcaption>Popular</figcaption>
      </figure>
      <figure class="tag">
        <img src="" alt="" />
        <figcaption>Latest</figcaption>
      </figure>
      <figure class="tag">
        <img src="" alt="" />
        <figcaption>Vegetarian</figcaption>
      </figure>
      <figure class="tag">
        <img src="" alt="" />
        <figcaption>Desserts</figcaption>
      </figure>
      <figure class="tag">
        <img src="" alt="" />
        <figcaption>Pastas</figcaption>
      </figure>
    </div>
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
      // additionalOptions: false,
      basicOptions: ['Any Category', 'Ingredient', 'Title', 'Regional'],
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
/*     toggleOptions() {
      this.additionalOptions = !this.additionalOptions
    }, */
  
    configParams() {
      if (this.basicSelected !== '') {
        if (this.basicSelected === 'title')
          this.queryParams['mealName'] = this.searchValue
        if (this.basicSelected === 'ingredient')
          this.queryParams['ingredients.ingredient'] = this.searchValue
        if (this.basicSelected === 'regional')
          this.queryParams['regional'] = this.searchValue
      }
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
    async findRecipes() {
      // set query params
      const params = this.configParams()

      try {
        await this.$store.dispatch('fetchQueriedRecipes', params)
        console.log(this.getQueriedRecipes)
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
  @include alignment($direction:column);
  flex: 1;
  overflow: auto;
  form, fieldset {
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
