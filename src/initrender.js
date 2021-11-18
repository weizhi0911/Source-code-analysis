JGVue.prototype.mount = function () {
  // 需要提供一个render方法：生成虚拟DMO
  this.render = this.createRenderFn()

  this.mountComonent()
}

JGVue.prototype.mountComonent = function () {
  // 执行mountComponent() 函数

  let mount = () => {
    this.uptate(this.render())
  }

  mount.call(this) // 本质应该交给watcher来调用，之后讲
}

// 这里是生成render函数，目的是缓存抽象语法树（我们使用虚拟DOM来模拟）
JGVue.prototype.createRenderFn = function () {
  // 缓存AST
  let ast = getVNode(this._template)

  // 将 AST + data => VNode
  // 我们将带有坑的VNode + data => 含有数据的VNode （之前是模拟的AST）
  return function render() {
    // 将带坑的VNode转换为带数据的VNode
    let _tmp = combine(ast, this._data)
    return _tmp
  }

}

// 将虚拟DOM渲染到页面中，diff就在这里
JGVue.prototype.uptate = function (vnode) {
  // 简化，直接生成HTML DOM replaceChild 到页面中
  // 父元素replaceChild(新元素，旧元素)
  let realDOM = parseVNode(vnode)

  this._parent.replaceChild(realDOM, document.querySelector('#root'))
  // 这个算法是不负责任的
  // 每次会将页面中的DOM全部替换
}