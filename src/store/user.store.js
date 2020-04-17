import { Store } from './store'

class UserStore extends Store {
  _data () {
    const data = JSON.parse(localStorage.getItem('session')) || {
      loggedIn: false,
      data: null
    }
    return data
  }

  setUserData (data) {
    this._state.loggedIn = true
    this._state.data = data
    window.localStorage.setItem('session', JSON.stringify(this._state))
  }

  clearUserData () {
    this._state.loggedIn = false
    this._state.data = null
    localStorage.removeItem('session')
  }
}

export const userStore = new UserStore()
