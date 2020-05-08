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
      <span class="lightItalic">{{ recipe.rates.length ? recipe.rates.length + ' votes' : 'not rated' }}</span>
    </p>
    <router-link
      :to="{ name: 'SingleResult', params: { id: recipe._id } }"
      class="details"
      ><a>Details</a></router-link
    >
    <div class="editDelete flex">
      <button>
        <font-awesome-icon
          :icon="['fa', 'edit']"
          class="edit"
          title="Edit recipe"
        ></font-awesome-icon>
      </button>
      <button>
        <font-awesome-icon
          :icon="['fa', 'trash-alt']"
          class="delete"
          title="Delete recipe"
        ></font-awesome-icon>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dateFormat from '../../../mixins/dateFormat'
export default {
  name: 'UserRecipe',

  props: {
    recipe: {
      type: Object,
      required: true
    }
  },

  mixins: [dateFormat],

  computed: {
    ...mapGetters(['getDefaultImage'])
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
      }

      .delete {
        @include fonts($color: crimson);
      }
    }
  }
}

@media (min-width: 768px) {
  .userRecipe {
  grid-template-columns: 1fr 1.5fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas: 'image mealName rating editDelete' 'image details date editDelete';
  @include alignment($align: center);

    .editDelete {
      @include alignment($direction: column);

        button {
          @include boxSize($width: 60px, $height: 60px);
          align-self: end;
        }
    }
  }
}
</style>
