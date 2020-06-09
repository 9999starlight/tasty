import { recipesUrl, usersUrl, commentsUrl } from '../apiData'

import axios from 'axios'
const apiCalls = {
  methods: {
    async fetchDbRecipes(payload) {
      try {
        const results = await axios.get(`${recipesUrl}`, {
          params: payload
        })
        return {
          resultsArray: results.data.response.recipes,
          count: results.data.docsCount
        }
      } catch (error) {
        console.log(error.results.data.message)
      }
    },

    async fetchUsers(payload) {
      try {
        const results = await axios.get(`${usersUrl}`, {
          params: payload
        })
        return {
          usersArray: results.data.response.users,
          count: results.data.docsCount
        }
      } catch (error) {
        console.log(error.results.data.message)
      }
    },

    async allUserRecipes(id) {
      //console.log(params)
      try {
        const params = {
          author: id
        }
        await this.$store.dispatch('fetchQueriedRecipes', params)
        //console.log(res)
        this.$router.push({name: 'render_results'})
      } catch (error) {
        console.log(error.message)
      }
    },

    async fetchSingleUser(id) {
      try {
        const singleUser = await axios.get(`${usersUrl}/${id}`)
        //console.log(singleUser)
        return singleUser
      } catch (error) {
        console.log(error.message)
      }
    },

    async editUser(id, endpoint, payload) {
      try {
        const response = await axios.patch(`${usersUrl}/${endpoint}/${id}`, payload)
        return response
      } catch (error) {
        console.log(error.message)
        console.log(error.response.data.message)
      }
    },

    async fetchComments(payload) {
      try {
        const results = await axios.get(`${commentsUrl}`, {
          params: payload
        })
        return {
          commentsArray: results.data.response.comments,
          count: results.data.docsCount
        }
      } catch (error) {
        console.log(error.results.data.message)
      }
    }
  }
}

export default apiCalls
