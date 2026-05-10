import axios from 'axios'
import { http } from 'msw'

const BASE_URL = process.env.REACT_APP_BASE_URL
// Create an instance of axios with default configuration
const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a response interceptor to handle responses and errors.
httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Ett okänt fel inträffade'
    return Promise.reject(new Error(message))
  },
)

export default httpClient