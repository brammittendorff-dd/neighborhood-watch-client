import config from '../config'
import TokenService from './token-service'
import IdleService from './idle-service'

const UsersApiService =  {
    registerAccount (user) {
        return fetch(`${config.API_ENDPOINT}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        //forgot to json the response
        .then(res => {
            // console.log('initial res', res)
            if (!res.ok) {
                console.log('fetch error resp', res)
                return res.json()
                    .then(e => Promise.reject(e))
            }
            return res.json()
        })
        
    },

    updateUserInfo (userInfo, userId) {
        return fetch(`${config.API_ENDPOINT}/users/register/${userId}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(res => {
          // console.log('res auth token', res.authToken)
          TokenService.saveAuthToken(res.authToken)
          IdleService.registerIdleTimerResets()
          TokenService.queueCallbackBeforeExpiry(() => {
            UsersApiService.postRefreshToken()
          })
          return res
        })
    },


    postLogin(user) {
        return fetch(`${config.API_ENDPOINT}/users/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(responseJson => {
            TokenService.saveAuthToken(responseJson.authToken)
            console.log('bearer token', responseJson.authToken)
            /*
              whenever a login is performed:
              1. save the token in local storage
              2. queue auto logout when the user goes idle
              3. queue a call to the refresh endpoint based on the JWT's exp value
            */
            IdleService.registerIdleTimerResets()
            TokenService.queueCallbackBeforeExpiry(() => {
              UsersApiService.postRefreshToken()
            })
            return responseJson
        })
    },
    postRefreshToken() {
        return fetch(`${config.API_ENDPOINT}/users/refresh`, {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${TokenService.getAuthToken()}`,
          },
        })
          .then(res =>
            (!res.ok)
              ? res.json().then(e => Promise.reject(e))
              : res.json()
          )
          .then(res => {
             /*
              similar logic to whenever a user logs in, the only differences are:
              - we don't need to queue the idle timers again as the user is already logged in.
              - we'll catch the error here as this refresh is happening behind the scenes
            */
            TokenService.saveAuthToken(res.authToken)
            TokenService.queueCallbackBeforeExpiry(() => {
              UsersApiService.postRefreshToken()
            })
            return res
          })
          .catch(err => {
            console.error(err)
          })
      }
}

export default UsersApiService