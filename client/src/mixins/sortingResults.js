const sortingResults = {
  methods: {
    sortTitleAscending(arr) {
      const sortedArr = arr.sort((a, b) =>
        a.mealName.toLowerCase().localeCompare(b.mealName.toLowerCase())
      )
      // console.log('mixin title asc ', sortedArr)
      return sortedArr
    },

    sortTitleDescending(arr) {
      const sortedArr = arr.sort((a, b) =>
        b.mealName.toLowerCase().localeCompare(a.mealName.toLowerCase())
      )
      // console.log('mixin title desc ', sortedArr)
      return sortedArr
    },

    sortRatingAscending(arr) {
      const sortedArr = arr.sort((a, b) => a.rating - b.rating)
      // console.log('mixin rating asc ', sortedArr)
      return sortedArr
    },

    sortRatingDescending(arr) {
      const sortedArr = arr.sort((a, b) => b.rating - a.rating)
      // console.log('mixin rating desc ', sortedArr)
      return sortedArr
    },

    sortDateAscending(arr) {
      const sortedArr = arr.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      )
      // console.log('mixin date asc ', sortedArr)
      return sortedArr
    },

    sortDateDescending(arr) {
      const sortedArr = arr.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      // console.log('mixin rating desc ', sortedArr)
      return sortedArr
    }
  }
}

export default sortingResults
