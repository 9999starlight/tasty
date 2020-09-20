<template>
  <div class="userRecipe grid mgb1" v-animationscroll>
    <figure>
      <img
        v-if="recipe.image === undefined"
        :src="getDefaultImage"
        :alt="recipe.mealName"
        class="block"
        loading="lazy"
      />
      <img
        v-else
        :src="recipe.image"
        :alt="recipe.mealName"
        class="block"
        loading="lazy"
      />
    </figure>
    <h4>{{ recipe.mealName | titleCase }}</h4>
    <p class="lightItalic date">
      Published: {{ convertDate(recipe.createdAt) }}
    </p>
    <p class="rating">
      <font-awesome-icon :icon="['fa', 'star']" class="starIcon">
      </font-awesome-icon
      >&nbsp;&nbsp;{{ recipe.rating }} /
      <span class="lightItalic">{{
        recipe.rates.length ? recipe.rates.length + ' votes' : 'not rated'
      }}</span>
    </p>
    <router-link
      :to="{ name: 'SingleResult', params: { id: recipe._id } }"
      class="details"
      ><a>Details</a></router-link
    >
    <div class="editDelete flex">
      <button
        v-if="usersRecipes"
        @click="$emit('editing', recipe._id)"
        class="tooltipContainer"
        aria-label="edit recipe"
      >
        <font-awesome-icon
          :icon="['fa', 'edit']"
          class="edit"
        ></font-awesome-icon>
        <Tooltip :tooltipText="'Edit recipe'" />
      </button>
      <!-- user info conditonal render -->
      <p
        v-else
        class="userInfo flex flexCenter tooltipContainer"
        @click="allUserRecipes(recipe.author._id)"
      >
        <img
          v-if="recipe.author.image"
          :src="recipe.author.image"
          alt="user image"
          class="authorImage"
          loading="lazy"
        />
        <img
          v-else
          :src="getDefaultUserImage"
          alt="user image"
          class="authorImage"
          loading="lazy"
        />
        <span class="authorUsername">{{ recipe.author.username }}</span>
        <Tooltip :tooltipText="`See user's recipes`" />
      </p>
      <!-- end user info -->
      <button
        v-if="usersRecipes"
        @click="deleteUserRecipe"
        class="tooltipContainer"
        aria-label="delete recipe"
      >
        <font-awesome-icon
          :icon="['fa', 'trash-alt']"
          class="delete"
        ></font-awesome-icon>
        <Tooltip :tooltipText="'Delete this recipe'" />
      </button>
      <!-- remove from saved recipes button conditonal render -->
      <button
        v-else
        @click="removeFromFavorites"
        class="tooltipContainer"
        aria-label="remove from saved recipes"
      >
        <font-awesome-icon
          :icon="['fa', 'trash-alt']"
          class="delete"
        ></font-awesome-icon>
        <Tooltip :tooltipText="'Remove from the list'" />
      </button>
      <!-- end remove from saved -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dateFormat from '../../mixins/dateFormat'
import apiCalls from '../../mixins/apiCalls'
import titleCase from '../../filters/titleCase'
import Tooltip from '../sharedComponents/Tooltip'
import axios from 'axios'
import { recipesUrl, usersUrl } from '../../apiData'

export default {
  name: 'UserRecipe',

  components: {
    Tooltip
  },

  props: {
    recipe: {
      type: Object,
      required: true
    },

    usersRecipes: {
      type: Boolean,
      required: true
    }
  },

  mixins: [dateFormat, apiCalls],

  filters: {
    titleCase
  },

  computed: {
    ...mapGetters(['getDefaultImage', 'getDefaultUserImage', 'getCurrentUser'])
  },

  // patch: remove user's recipe, update current user, refresh user's recipes
  methods: {
    async deleteUserRecipe(recipeId) {
      try {
        recipeId = this.recipe._id
        if (confirm('Are you sure you want to delete this recipe?')) {
          const response = await axios.delete(`${recipesUrl}/${recipeId}`)
          if (response) {
            this.$store.dispatch('updateUser', response.data.userUpdate)
            this.$emit('del')
          }
        }
      } catch (error) {
        console.log(error.response.data.message)
      }
    },

    // patch: remove saved recipe, update current user, refresh saved recipes
    async removeFromFavorites() {
      try {
        if (confirm('Remove from your saved recipes?')) {
          const response = await axios.patch(
            `${usersUrl}/remove_favorite/${this.getCurrentUser.userId}`,
            { favoriteId: this.recipe._id }
          )
          if (response) {
            this.$store.dispatch('updateUser', response.data.updatedUser)
            this.$emit('deletedFromFavorites')
          }
        }
      } catch (error) {
        console.log(error.response.data.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.userRecipe {
  padding: 0.6rem;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 1fr 0.5fr 0.5fr 1fr;
  grid-template-areas: 'image mealName mealName' 'image details details' 'rating rating rating' 'date date date' 'editDelete editDelete editDelete';
  border: 1px solid lightgray;
  border-radius: 10px;
  background-color: $light;
  box-shadow: $shadowSmall;

  p {
    @include fonts($size: 0.9rem);
  }

  figure {
    grid-area: image;
    @include boxSize($width: 100px, $height: 80px);
    box-shadow: $shadowSmall;

    img {
      @include boxSize($width: 100%, $height: 100%);
      object-fit: cover;
    }
  }

  h4,
  .details {
    margin-left: 1rem;
    text-align: left;
  }

  h4 {
    grid-area: mealName;
    color: $golden;
  }
  .date {
    grid-area: date;
    @include fonts($size: 0.8rem);
  }
  .rating {
    grid-area: rating;
  }

  .details {
    grid-area: details;
    color: rgb(40, 53, 40);
    text-decoration: green underline;
  }
  .editDelete {
    grid-area: editDelete;
    @include alignment($justify: space-around);

    button {
      background-color: transparent;
      padding: 0.8rem;
      @include fonts($size: 1.5rem);
      .tooltipBox {
        bottom: 80%;
      }
      .edit {
        @include fonts($color: rgb(136, 187, 54));
        filter: drop-shadow(2px 1px #393b39);
      }

      .delete {
        @include fonts($color: rgba(220, 20, 60, 0.808));
      }
    }

    .authorImage {
      @include boxSize($width: 30px, $height: 30px);
      border-radius: 50%;
      margin-right: 0.5rem;
    }
  }
}

@media (min-width: 400px) {
  .userRecipe {
    grid-template-rows: 1fr 1fr 0.5fr 1fr;
    grid-template-areas: 'image mealName mealName' 'image details details' 'date date rating' 'editDelete editDelete editDelete';
    text-align: left;
  }
}

@media (min-width: 768px) {
  .userRecipe {
    @include boxSize($width: 100%);
    grid-template-columns: auto 1.7fr 1fr 0.5fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: 'image mealName rating editDelete' 'image details date editDelete';
    @include alignment($align: center);

    figure {
      @include boxSize($width: 120px, $height: 100px);
      justify-self: center;
    }

    h4,
    .details {
      margin-left: 1rem;
    }

    .editDelete {
      @include alignment($direction: column);

      button {
        @include boxSize($width: 60px, $height: 60px);
        align-self: flex-end;
      }

      .userInfo {
        justify-content: flex-start;
        cursor: pointer;
      }
    }
  }
}

@media (min-width: 992px) {
  .userRecipe {
    @include boxSize($width: 900px);
  }
}
</style>
