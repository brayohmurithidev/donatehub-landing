import axios from "axios";

const BaseURL = 'http://localhost:8000/api/v1'

const API = axios.create({
    baseURL: BaseURL,
})

export default API;