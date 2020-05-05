const paginationOptions = {
  data() {
    return {
      currentPage: 1
      // resultsPerPage: 2
    }
  },

  computed: {
    // page settings
    lastResultIndex() {
      return this.currentPage * this.resultsPerPage
    },

    firstResultIndex() {
      return this.lastResultIndex - this.resultsPerPage
    }
  },

  methods: {
    changePage(num) {
      this.currentPage = num
      // console.log(this.currentPage)
    },

    nextPage(pageNumbers) {
      if (this.currentPage < pageNumbers[pageNumbers.length - 1])
        this.currentPage++
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    },

    firstPage() {
      this.currentPage = 1
    },

    lastPage(pageNumbers) {
      this.currentPage = pageNumbers[pageNumbers.length - 1]
    }
  }
}

export default paginationOptions
