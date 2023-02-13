class Events {
  private message: { [key in string]: Function[] }
  constructor() {
    this.message = {}
  }
  $on(type, fn) {
    if (!this.message[type]) {
      this.message[type] = []
    }
    this.message[type].push(fn)
  }
  $off(type, fn) {
    if (!this.message[type]) return
    if (!fn) {
      this.message[type] = undefined
      return
    }
    this.message[type] = this.message[type].filter(item => item !== fn)
  }
  $emit(type) {
    if (!this.message[type]) return
    this.message[type].forEach(item => item())
  }
}

export const events = new Events()
