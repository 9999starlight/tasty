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
