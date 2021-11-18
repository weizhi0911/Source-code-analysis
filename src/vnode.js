class VNode { // 精简版
  constructor(tag, data, value, type) { // tag元素，value文本
    this.tag = tag && tag.toLowerCase()
    this.data = data
    this.value = value
    this.type = type
    this.children = []
  }

  appendChild(vnode) {
    this.children.push(vnode)
  }
}