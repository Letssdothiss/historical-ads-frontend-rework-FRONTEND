import axios from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL
// Create an instance of axios with default configuration 
const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
