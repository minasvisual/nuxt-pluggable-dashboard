import axios from 'axios'
import _ from 'lodash'
// import { useAuth } from '~~/store/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
 
  const axiosInstance = axios.create({
    // baseURL:  config.VUE_APP_BASE_API,
    // app_key: process.env.APP_KEY
  })

  axiosInstance.interceptors.request.use(
    function (config) {

      if (process.client) {
        // const auth = useAuth()
        // console.log("axios useauth", auth.session)
        const token = sessionStorage.getItem('accessToken')
        if (token)
          config.headers['access-token'] = token;
      }

      // // APP KEY Required
      // if ( !config.headers['app-key'] )
      //   config.headers['app-key'] = process.env.VUE_APP_APP_KEY;

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  )

  axiosInstance.interceptors.response.use(
    (success) => {
      return success
    },
    (error) => {
      // if ( _.get(error, 'response.status', 0) === 401 && _.get(error, 'response.data.message') == 'TokenExpiredError' ) {
      //   localStorage.removeItem('token')
      //   location.href='/auth/login'
      // }

      // return Error object with Promise
      return Promise.reject(error);
    }
  )

  return {
    provide: {
      axios: axiosInstance
    }
  }
});