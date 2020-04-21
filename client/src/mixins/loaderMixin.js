const loaderMixin = {
    data () {
      return {
        isLoading: false
      }
    },
    methods: {
      toggleLoader () {
        this.isLoading = !this.isLoading
      }
    }
  }
  
  export default loaderMixin