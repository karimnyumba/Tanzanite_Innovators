import axios from 'axios'

const baseUrl = "https://fierylion.me/api/v1/";
export default axios.create({baseURL:baseUrl})