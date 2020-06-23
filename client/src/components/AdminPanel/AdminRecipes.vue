<template>
  <div
    :class="[
      getEditState ? 'adminRecipes mgt3 disableScrolling' : 'adminRecipes mgt3'
    ]"
    v-if="!isLoading"
  >
    <transition name="fade" mode="out-in">
      <div class="modalOverlay" v-if="getEditState" @click.self="cancelEdit">
        <div class="modalWrapper" v-if="getEditState">
          <header class="flex flexCenter">
            <h2>Edit Recipe</h2>
            <button @click="cancelEdit" class="del">
              <font-awesome-icon
                :icon="['fa', 'times']"
                title="Cancel and close form"
              ></font-awesome-icon>
            </button>
          </header>
          <div class="editInner">
            <CreateEditForm class="editForm" />
          </div>
        </div>
      </div>
    </transition>
    <h1 class="mgb1 slim">Recipes</h1>
    <section class="recipesOverview center grid">
      <StatisticBox
        :title="'Level count'"
        :dataArray="levelArray"
        class="levelsStatistics"
      />
      <StatisticBox
        :title="'Vegetarian & Gluten free count'"
        :dataArray="vegetarianGlutenFree"
        class="otherStatistics"
      />
      <StatisticBox
        :title="'Dish Type count'"
        :dataArray="dishTypeOverview"
        class="dishTypeStatistics"
      />
    </section>
    <section class="searchSection flex flexCenter">
      <h2 class="slim">Browse {{ recipesCount }} recipes</h2>
      <SortingButtons
        @sortTitleAsc="sortTitleAscending(allRecipes)"
        @sortTitleDesc="sortTitleDescending(allRecipes)"
        @sortRatingAsc="sortRatingAscending(allRecipes)"
        @sortRatingDesc="sortRatingDescending(allRecipes)"
        @sortDateAsc="sortDateAscending(allRecipes)"
        @sortDateDesc="sortDateDescending(allRecipes)"
      />
      <div class="searchRecipes">
        <header class="flex flexCenter">
          <Select
            :options="adminRecipesOptions"
            class="adminRecipesSearch"
            ref="adminRecipeSearch"
          />
          <input
            type="text"
            v-model.trim="searchValue"
            placeholder="Search..."
          />
        </header>
        <div class="allRecipesContainer scrolling">
          <div
            class="recipeSingle grid"
            v-for="recipe in filteredRecipes"
            :key="recipe._id"
          >
            <figure>
              <img
                v-if="recipe.image === undefined"
                :src="getDefaultImage"
                :alt="recipe.mealName"
                class="imageFit"
              />
              <img
                v-else
                :src="recipe.image"
                :alt="recipe.mealName"
                class="imageFit"
              />
            </figure>
            <h5>{{ recipe.mealName }}</h5>
            <p class="lightItalic created">
              {{ convertDate(recipe.createdAt) }}
            </p>
            <p class="author">{{ recipe.author.username }}</p>
            <small class="rating">
              <font-awesome-icon :icon="['fa', 'star']" class="starIcon">
              </font-awesome-icon
              >&nbsp;{{ recipe.rating }} /
              {{
                recipe.rates.length
                  ? recipe.rates.length + ' votes'
                  : 'not rated'
              }}
            </small>
            <small class="recipeId slim">ID: {{ recipe._id }}</small>
            <div class="recipeButtons flex">
              <button @click="deleteRecipe(recipe._id)">
                <font-awesome-icon
                  :icon="['fa', 'trash-alt']"
                  class="delete"
                  title="Delete recipe"
                ></font-awesome-icon>
              </button>

              <router-link
                :to="{ name: 'SingleResult', params: { id: recipe._id } }"
                class="details"
                ><a>Details</a></router-link
              >
              <button @click="editFormSettings(recipe._id)">
                <font-awesome-icon
                  :icon="['fa', 'edit']"
                  class="edit"
                  title="Edit recipe"
                ></font-awesome-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Loader v-else :bigLoader="true" />
</template>

<script>
import StatisticBox from './StatisticBox/StatisticBox'
import Select from '../sharedComponents/Select'
import SortingButtons from '../sharedComponents/SortingButtons'
import CreateEditForm from '../sharedComponents/CreateEditForm'
import Loader from '../sharedComponents/Loader'
import { mapGetters } from 'vuex'
import dateFormat from '../../mixins/dateFormat'
import apiCalls from '../../mixins/apiCalls'
import sortingResults from '../../mixins/sortingResults'
import loaderMixin from '../../mixins/loaderMixin'
import { recipesUrl } from '../../apiData'
import axios from 'axios'

export default {
  name: 'admin_recipes',

  components: {
    Select,
    StatisticBox,
    SortingButtons,
    CreateEditForm,
    Loader
  },

  data() {
    return {
      //ready: false,
      allRecipes: [],
      recipesCount: 0,
      adminRecipesOptions: ['Meal Name', 'User', 'Recipe ID'],
      searchValue: '',
      levelArray: [],
      dishTypeOverview: [],
      vegetarianGlutenFree: []
    }
  },

  created() {
    this.recipeFetch()
  },

  mixins: [dateFormat, apiCalls, sortingResults, loaderMixin],

  computed: {
    ...mapGetters(['getDefaultImage', 'getEditState']),

    selectedSearchOption() {
      return this.$refs.adminRecipeSearch.selected
    },

    filteredRecipes() {
      if (!this.searchValue) return this.allRecipes
      return this.allRecipes.filter((recipe) => {
        if (this.selectedSearchOption === 'User') {
          return recipe.author.username
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        } else if (this.selectedSearchOption === 'Recipe ID') {
          return recipe._id
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        } else {
          return recipe.mealName
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        }
      })
    }
  },

  methods: {
    async recipeFetch() {
      try {
        this.toggleLoader()
        const fetchedRecipes = await this.fetchDbRecipes()
        if (fetchedRecipes) {
          this.allRecipes = [...fetchedRecipes.resultsArray]
          this.recipesCount = fetchedRecipes.count
          this.setStatisticBoxArrays()
          this.toggleLoader()
        }
      } catch (error) {
        console.log(error.message)
      }
    },

    setStatisticBoxArrays() {
      // sort recipes by level count
      let reduceLevels = this.allRecipes.reduce(
        (item, { level: key }) => ((item[key] = (item[key] || 0) + 1), item),
        {}
      )
      this.levelArray = []
      for (let i in reduceLevels) {
        this.levelArray.push({ name: i, value: reduceLevels[i] })
      }
      this.levelArray.sort((a, b) => b.value - a.value)
      // console.log(this.levelArray)

      // sort recipes by dishType count
      let reducedDishType = this.allRecipes.reduce(
        (item, { dishType: key }) => ((item[key] = (item[key] || 0) + 1), item),
        {}
      )
      this.dishTypeOverview = []
      for (let i in reducedDishType) {
        this.dishTypeOverview.push({ name: i, value: reducedDishType[i] })
      }
      this.dishTypeOverview.sort((a, b) => b.value - a.value)
      // console.log(this.dishTypeOverview)

      // all vegetarian & gluten free count
      const vegetarian = this.allRecipes.filter(
        (recipe) => recipe.vegetarian === true
      )
      const glutenFree = this.allRecipes.filter(
        (recipe) => recipe.glutenFree === true
      )
      const combineVegetarian = this.allRecipes.filter(
        (recipe) => recipe.vegetarian === true && recipe.glutenFree === true
      )
      this.vegetarianGlutenFree = []
      this.vegetarianGlutenFree.push(
        { name: 'Vegetarian', value: vegetarian.length },
        { name: 'Gluten Free', value: glutenFree.length },
        { name: 'Vegetarian & Gluten free', value: combineVegetarian.length }
      )
      this.vegetarianGlutenFree.sort((a, b) => b.value - a.value)
    },

    async deleteRecipe(recipeId) {
      try {
        // console.log(recipeId)
        if (confirm('Are you sure you want to delete this recipe?')) {
          const response = await axios.delete(`${recipesUrl}/${recipeId}`)
          if (response) {
            console.log(response.data)
            this.recipeFetch()
          }
        }
      } catch (error) {
        console.log(error.response.data.message)
      }
    },

    async editFormSettings(id) {
      try {
        await this.$store.dispatch('fetchSingleRecipe', id)
        await this.$store.dispatch('changeEditState', true)
      } catch (error) {
        console.log(error.message)
      }
    },

    async cancelEdit() {
      try {
        await this.$store.dispatch('changeEditState', false)
      } catch (error) {
        console.log(error)
      }
    }
  },

  beforeRouteLeave(to, from, next) {
    this.cancelEdit()
    next()
  }
}
</script>

<style lang="scss" scoped>
.searchSection {
  @include alignment($direction: column);
  h2 {
    margin: 2rem 0 1rem 0;
  }
}
.searchRecipes {
  @include boxSize($width: 280px, $height: 500px);
  border: 1px solid lightgray;
  position: relative;

  header {
    @include alignment($direction: column, $justify: space-evenly);
    background-color: lighten($graphite, 20%);
    @include fonts($color: $light);
    @include boxSize($width: 100%, $height: 100px);
    position: sticky;
    top: 0;

    input {
      @include boxSize($width: 260px);
      padding: 0.5rem 0.4rem;
      border-radius: 6px;
      box-shadow: $shadowSmall;
    }
  }

  .allRecipesContainer {
    overflow: auto;
    @include boxSize($height: calc(100% - 100px));
  }
  .recipeSingle {
    @include boxSize($width: 100%);
    @include alignment($align: center, $textAlign: left);
    border-bottom: 1px solid lighten($graphite, 40%);
    color: $graphite;
    grid-template-rows: repeat(5, auto);
    grid-template-columns: repeat(3, auto);
    grid-template-areas: 'image title title' 'image created created' 'user user rating' 'recipeId recipeId recipeId' 'recipeButtons recipeButtons recipeButtons';
    grid-column-gap: 0.5rem;
    padding: 0.4rem 0.2rem;

    h5 {
      grid-area: title;
    }

    figure {
      grid-area: image;

      img {
        @include boxSize($width: 60px);
      }
    }

    .created {
      grid-area: created;
      @include fonts($size: 0.7rem);
    }
    .author {
      grid-area: user;
      @include fonts($size: 0.8rem, $weight: 700);
      margin-top: 0.3rem;
    }

    .rating {
      grid-area: rating;
      text-align: right;
      margin-right: 0.5rem;
    }

    .recipeId {
      grid-area: recipeId;
    }

    .recipeButtons {
      grid-area: recipeButtons;
      @include alignment($justify: space-evenly, $align: center);
      .details {
        grid-area: details;
        color: rgb(40, 53, 40);
        text-decoration: green underline;
        justify-self: center;
      }

      button {
        background-color: transparent;
        padding: 0.8rem;
        @include fonts($size: 1.5rem);
        .edit,
        .delete {
          position: relative;
          z-index: -1;
        }
        .edit {
          @include fonts($color: rgb(136, 187, 54));
          filter: drop-shadow(2px 1px #393b39);
        }

        .delete {
          @include fonts($color: crimson);
          filter: drop-shadow(2px 1px #661313);
        }
      }
    }
  }
}

.recipesOverview {
  place-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid lightgray;
  .statisticBoxWrapper {
    @include boxSize($height: auto);
  }
}

@media (min-width: 576px) {
  .searchRecipes {
    @include boxSize($width: 500px);

    .recipeSingle {
      grid-template-rows: repeat(4, auto);
      grid-template-columns: 20% 1fr 1fr;
      grid-template-areas: 'image title rating' 'image created created' 'image user recipeId' 'recipeButtons recipeButtons recipeButtons';
      grid-column-gap: 0;

      .rating {
        margin-top: 0;
      }
    }
  }
}

@media (min-width: 768px) {
  .adminRecipes,
  .loaderContainer {
    margin-top: 0;
    @include boxSize($width: calc(100% - 4rem));
    align-self: flex-end;
  }

  .loaderContainer {
    margin: auto 0;
  }

  .searchRecipes {
    @include boxSize($width: 680px);
    margin: auto;

    header {
      @include alignment($direction: row);
      @include boxSize($height: 60px);

      input {
        padding: 0.4rem;
        @include boxSize($width: 300px);
      }
    }
    .allRecipesContainer {
      @include boxSize($height: calc(100% - 60px));
    }
    .recipeSingle {
      grid-template-rows: repeat(3, auto);
      grid-template-areas: 'image title recipeId rating' 'image created user user' 'recipeButtons recipeButtons recipeButtons recipeButtons';
      grid-template-columns: 15% 1fr 1fr;

      .recipeId,
      .author {
        margin-top: 0;
      }
    }
  }
  .recipesOverview {
    grid-template-columns: repeat(2, auto);
    grid-template-rows: repeat(2, auto);
    grid-template-areas: 'levels dishTypes' 'other dishTypes';

    .levelsStatistics {
      grid-area: levels;
    }
    .otherStatistics {
      grid-area: other;
    }
    .dishTypeStatistics {
      grid-area: dishTypes;
    }
  }

  .recipesOverview {
    justify-items: center;
    align-items: stretch;
  }
}

@media (min-width: 992px) {
  section {
    @include boxSize($width: 900px);
    margin: auto;
  }
  .searchRecipes {
    @include boxSize($width: 100%);
    .recipeSingle {
      grid-template-rows: repeat(2, auto);
      grid-template-areas: 'image title recipeId rating recipeButtons' 'image created user user recipeButtons';
      grid-template-columns: 10% 1fr 1fr 100px 1fr;

      .rating {
        text-align: left;
      }
    }
  }
}
</style>
