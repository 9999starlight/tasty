<template>
  <div class="userRecipe grid mgb1">
    <figure>
      <img
        v-if="recipe.image === undefined"
        :src="getDefaultImage"
        :alt="recipe.mealName"
        class="block"
      />
      <img v-else :src="recipe.image" :alt="recipe.mealName" class="block" />
    </figure>
    <h4>{{ recipe.mealName }}</h4>
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
      <button v-if="usersRecipes" @click="$emit('editing', recipe._id)">
        <font-awesome-icon
          :icon="['fa', 'edit']"
          class="edit"
          title="Edit recipe"
        ></font-awesome-icon>
      </button>
      <!-- user info conditonal render -->
      <p v-else class="userInfo flex flexCenter">
        <img
          v-if="recipe.author.image"
          :src="recipe.author.image"
          alt="user image"
          class="authorImage"
        />
        <img
          v-else
          :src="getDefaultUserImage"
          alt="user image"
          class="authorImage"
        />
        <span class="authorUsername">{{ recipe.author.username }}</span>
      </p>
      <!-- end user info -->
      <button v-if="usersRecipes" @click="deleteUserRecipe">
        <font-awesome-icon
          :icon="['fa', 'trash-alt']"
          class="delete"
          title="Delete your recipe"
        ></font-awesome-icon>
      </button>
      <!-- remove from saved recipes button conditonal render -->
      <button v-else @click="removeFromFavorites">
        <font-awesome-icon
          :icon="['fa', 'trash-alt']"
          class="delete"
          title="Remove from saved recipes"
        ></font-awesome-icon>
      </button>
      <!-- end remove from saved -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dateFormat from '../../mixins/dateFormat'
import axios from 'axios'
import { recipesUrl, usersUrl } from '../../apiData'

export default {
  name: 'UserRecipe',

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

  mixins: [dateFormat],

  computed: {
    ...mapGetters([
      'getDefaultImage',
      'getDefaultUserImage',
      'getCurrentUser'
    ])
  },

  // patch: remove user's recipe, update current user, refresh user's recipes
  methods: {
    async deleteUserRecipe(recipeId) {
      try {
        recipeId = this.recipe._id
        if (confirm('Are you sure you want to delete this recipe?')) {
          const response = await axios.delete(`${recipesUrl}/${recipeId}`)
          if (response) {
            console.log(response.data)
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
            console.log(response.data.message)
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
  grid-template-rows: 1.2fr 1.2fr 0.8fr 0.8fr 1fr;
  grid-template-areas: 'image mealName mealName' 'image details details' 'date date date' 'rating rating rating' 'editDelete editDelete editDelete';
  box-shadow: $shadowSmall;
  border: 1px solid lightgray;

  p {
    @include fonts($size: 0.9rem);
    text-align: center;
  }

  figure {
    grid-area: image;
    @include boxSize($width: 120px, $height: 100px);
    box-shadow: $shadowBox;

    img {
      @include boxSize($width: 100%, $height: 100%);
      object-fit: cover;
    }
  }

  h4 {
    grid-area: mealName;
  }
  .date {
    grid-area: date;
    margin: 0.5rem auto;
    @include fonts($size: 0.8rem);
  }
  .rating {
    grid-area: rating;
  }

  .details {
    grid-area: details;
    color: rgb(40, 53, 40);
    text-decoration: green underline;
    justify-self: center;
  }
  .editDelete {
    grid-area: editDelete;
    @include alignment($justify: space-around);

    button {
      background-color: transparent;
      padding: 0.8rem;
      @include fonts($size: 1.5rem);
      .edit {
        @include fonts($color: rgb(136, 187, 54));
        filter: drop-shadow(2px 1px #393b39);
      }

      .delete {
        @include fonts($color: crimson);
        filter: drop-shadow(2px 1px #661313);
      }
    }

    .authorImage {
      @include boxSize($width: 30px, $height: 30px);
      border-radius: 50%;
      margin-right: 0.5rem;
    }
  }
}

@media (min-width: 768px) {
  .userRecipe {
    @include boxSize($width: 100%);
    grid-template-columns: 1fr 1.5fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: 'image mealName rating editDelete' 'image details date editDelete';
    @include alignment($align: center);

    .editDelete {
      @include alignment($direction: column);

      button {
        @include boxSize($width: 60px, $height: 60px);
        align-self: flex-end;
      }

      .userInfo {
        justify-content: flex-end;
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
