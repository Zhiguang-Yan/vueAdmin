import axios from 'axios'
const MyHttpServer = {}

MyHttpServer.install = Vue => {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
  const AUTH_TOKEN = sessionStorage.getItem('token')
  axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
  Vue.prototype.$axios = axios
}
export default MyHttpServer
