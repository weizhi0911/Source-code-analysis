let ARRAY_METHOD = [ // 数组的方法
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'splice',
  'reverse',
]

// 思路，原型链继承：修改原型链的结构
let array_methods = Object.create(Array.prototype) // 对象继承数组的方法,这里有数组的所有方法

ARRAY_METHOD.forEach(function (method) {
  // 便利收集方法，访问数组的方法时，会优先经过这边（函数的拦截）
  array_methods[method] = function () { // function为了使用this，arguments数组调用方法时的参数，例：{name:'ggg',value:2}
    console.log('调用的是原来的' + method + '方法')
    console.log(arguments)

    // 将用数组方法修改的数据进行响应式处理
    for (let i = 0; i < arguments.length; i++) {
      observe(arguments[i]) // 这里还是有一个问题，引入watcher以后解决
    }

    let res = Array.prototype[method].apply(this, arguments) // 给Array的方法添加一层拦截，并且附带参数传过去

    // Array.prototype[method].call(this, ...arguments) // call参数必须是真数组，arguments不是真数组
    return res
  }
})
// 简化后的版本
function defindeReactive(target, key, value, enumerable) {
  // 函数内部或是一个局部作用域，这个value就只在函数内使用的变量(闭包)

  let that = this // 此时的this为Vue实例
  if (Object.prototype.toString.call(value) === '[object Object]') {
    // 是非数组的引用类型
    observe(value) // 递归
  }
  console.log(target)
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: !!enumerable,
    get() {
      console.log(`读取${key}属性`)
      return value
    },
    set(newVal) {
      console.log(`设置${key}属性值为：${newVal}`)
      // 注意，这边如果原来值是数组并且将它赋值的化，是不会经过这层set的
      // 原因是defineProperty不能监听数组
      // 其他值可以响应式

      // 目的
      // 将重新赋值的数组变成响应式的，因此如果传入的是对象类型的，那么就需要使用observe将其转换为响应式
      if (typeof newVal === 'object' && newVal !== null) {
        observe(newVal, that) // 赋值使其响应式
      }
      value = newVal


      // 改变数据的时候模板刷新（现在是假的，只是演示，Vue中使用watcher实现）
      // 这里Vue的实例怎么获取（watcher就不会有这个问题）
      that.mountComonent()

    }
  })
}


function observe(obj, vm) {
  // 之前没有对o本身进行操作，这一次就直接对o进行判断
  if (Array.isArray(obj)) {
    // 对每一个元素进行处理
    obj.__proto__ = array_methods

    for (let i = 0; i < obj.length; i++) {
      observe(obj[i], vm)
      defindeReactive.call(vm, obj, i, obj[i], true)

    }
  } else {
    // 对其成员进行处理

    let keys = Object.keys(obj)

    for (let i = 0; i < keys.length; i++) {
      let prop = keys[i];

      defindeReactive.call(vm, obj, prop, obj[prop], true)
    }
  }
}


function proxy(target, prop, key) {
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return target[prop][key]
    },
    set(newVal) {
      target[prop][key] = newVal
    }
  })
}


JGVue.prototype.initData = function () {
  // 遍历 this._data 的成员，将属性转化为响应式，将属性代理到实例上
  let keys = Object.keys(this._data)
  // 响应式化
  // for (let i = 0; i < keys.length; i++) {
  //   // 这里将对象this._data[keys[i]]变成响应式
  //   console.log('ooo')
  //   console.log(this)
  //   reactity(this._data, this)
  // }

  observe(this._data, this) // 直接响应化


  // 代理
  for (let i = 0; i < keys.length; i++) {
    // 将this._data[keys[i]]映射到this[keys[i]]上
    // 就是要让this提供keys[i]这个属性
    // 在访问这个属性的时候相当于在访问this._data的这个属性

    // Object.defineProperty(this, keys[i], {
    //   enumerable: true,
    //   configurable: true,
    //   get() {
    //     return this._data[keys[i]]
    //   },
    //   set(newVal) {
    //     this._data[keys[i]] = newVal
    //   }
    // })

    proxy(this, '_data', keys[i])
  }
}