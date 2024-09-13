import axios from 'axios'

const baseUrl = "https://tyktyk.pythonanywhere.com/";
export default axios.create({baseURL:baseUrl})