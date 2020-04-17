import { reactive, readonly } from 'vue'

export class Store {
  _state;

  constructor () {
    const data = this._data()
    this._setup(data)
    this._state = reactive(data)
  }

  _data () {}

  _setup (data) {}

  getState () {
    return readonly(this._state)
  }
}
