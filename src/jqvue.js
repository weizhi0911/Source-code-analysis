function JGVue(option) {
  this._data = option.data
  let elm = document.querySelector(option.el) // Vue中是字符串，这里是DOM
  this._template = elm
  this._parent = elm.parentNode


  this.initData() //
  this.mount()
}