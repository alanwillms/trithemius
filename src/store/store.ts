import { reactive, readonly } from 'vue'

export abstract class Store {
  _state: any

  constructor() {
    const data = this._data()
    this._setup(data)
    this._state = reactive(data)
  }

  abstract _data(): any

  _setup(_data: any) {}

  getState() {
    return readonly(this._state)
  }
}
