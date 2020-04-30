import axios from 'axios'

export const recipesUrl = 'http://localhost:5000/recipes'
// export const recipesUrl = '/recipes'
export const usersUrl = 'http://localhost:5000/users'
// export const usersUrl = '/users'
export const commentsUrl = 'http://localhost:5000/comments'
// export const commentsUrl = '/comments'

// cancel token for axios requests
const CancelToken = axios.CancelToken
export const source = CancelToken.source()
