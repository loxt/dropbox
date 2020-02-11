import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-omnistack-week6.herokuapp.com'
});

export default api;
