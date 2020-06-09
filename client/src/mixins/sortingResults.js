const sortingResults = {
  methods: {
    sortTitleAscending(arr) {
      const sortedArr = arr.sort((a, b) =>
        a.mealName.toLowerCase().localeCompare(b.mealName.toLowerCase())
      )
      return sortedArr
    },

    sortTitleDescending(arr) {
      const sortedArr = arr.sort((a, b) =>
        b.mealName.toLowerCase().localeCompare(a.mealName.toLowerCase())
      )
      return sortedArr
    },

    sortRatingAscending(arr) {
      const sortedArr = arr.sort((a, b) => a.rating - b.rating)
      return sortedArr
    },

    sortRatingDescending(arr) {
      const sortedArr = arr.sort((a, b) => b.rating - a.rating)
      return sortedArr
    },

    sortDateAscending(arr) {
      const sortedArr = arr.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      )
      return sortedArr
    },

    sortDateDescending(arr) {
      const sortedArr = arr.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      return sortedArr
    }
  }
}

export default sortingResults
