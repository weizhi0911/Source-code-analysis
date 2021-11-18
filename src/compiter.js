    /**
     * 由HTML DOM -> VNode将这个函数当成compiler
     */
    function getVNode(node) {
      let nodeType = node.nodeType
      let _vnode = null
      if (nodeType === 1) { // 元素
        let nodeName = node.nodeName
        let attrs = node.attributes // 伪数组
        let _attrObj = {}
        for (let i = 0; i < attrs.length; i++) { // attrs[i]属性节点
          _attrObj[attrs[i].nodeName] = attrs[i].nodeValue
        }

        _vnode = new VNode(nodeName, _attrObj, undefined, nodeType)

        // 还需要考虑node（真正的元素） 的子元素
        let childNodes = node.childNodes
        for (let i = 0; i < childNodes.length; i++) {
          _vnode.appendChild(getVNode(childNodes[i])) // 递归, appendChild构造函数里的方法
        }
      } else if (nodeType === 3) { // 文本
        _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType)
      }
      return _vnode
    }


    function parseVNode(vnode) {
      // 创建真实的DOM
      let type = vnode.type
      let _node = null
      if (type === 3) {
        return document.createTextNode(vnode.value) // 创建文本节点
      } else if (type === 1) {
        _node = document.createElement(vnode.tag)

        // 属性
        let data = vnode.data; // 现在这个data是键值对

        Object.keys(data).forEach(key => {
          let attrName = key
          let attrValue = data[key]
          _node.setAttribute(attrName, attrValue)
        })

        // 子元素
        let children = vnode.children
        children.forEach(subvnode => { // subvnode为虚拟DOM
          // 注意：这里的appendChild是元素里的方法不是构造函数的方法
          _node.appendChild(parseVNode(subvnode)) // 递归转换子元素（虚拟DOM）
        })
        return _node
      }
    }


    let brackets = /\{\{(.+?)\}\}/g // g全局，判断多个{}

    // 柯里化函数
    function getValueByPath(obj, path) {
      let paths = path.split('.') // [xxx,yyy,zzz]
      // return function getValueByPath(obj) {
      let res = obj
      let prop;
      while (prop = paths.shift()) { // shift取数组第一个，取一次少一个值，因为原数组被改
        res = res[prop]
      }
      return res
      // }
    }


    // 将带有坑的VNode与数据data结合，得到填充数据的VNode,模拟 AST -> VNode
    function combine(vnode, data) {
      let _type = vnode.type
      let _data = vnode.data
      let _value = vnode.value
      let _tag = vnode.tag
      let _children = vnode.children

      let _vnode = null

      if (_type === 3) { // 文本节点
        _value = _value.replace(brackets, function (_, g) {
          return getValueByPath(data, g.trim())
        })
        _vnode = new VNode(_tag, _data, _value, _type)

      } else if (_type === 1) { // 元素节点
        _vnode = new VNode(_tag, _data, _value, _type);
        _children.forEach(_subvnode => _vnode.appendChild(combine(_subvnode, data)));
      }
      return _vnode
    }