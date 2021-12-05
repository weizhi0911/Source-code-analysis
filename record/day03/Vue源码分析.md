# vue 源码解读

1. 各个文件的作用
2. Vue 的初始化流程

## vue-src 各个文件夹的作用

1. compiler 编译用的

- vue 使用**字符串**作为模板的
- 在编译文件中存放对模板字符串的解析的算法，抽象语法树，优化等

2. core 核心，vue 构造函数，算法，以及生命周期等方法的部分

3. platforms 平台

- 针对运行的环境（设备），有不同的实现
- 也是 vue 的入口

4. server 服务端，主要是将 vue 用在服务端的处理代码（略）

5. sfc, 单文件组件（略）

6. shared 公共工具，方法

## core/observer 文件中各个文件的作用

- array.js 创建含有重写数组方法的数组，让所有的响应式数据数组继承自该数组

- dep.js Dep 类

- index.js Observer 类，observe 的工厂函数

- scheduler.js vue 中的任务调度工具，watcher 执行的核心

- traverse.js 递归遍历响应式数据，目的是触发依赖收集

- watcher.js Watcher 类

## 面试题（对数组的去重）

```js
let arr = [2, 3, 1, 3, 2, 1, 2, 3, 1, 2, 1, 5];

// 一般情况
// let newArr = [];
arr.forEach((v) => newArr.indexOf(v) === -1 && newArr.push(v)); // indexOf 本身隐含着循环的

// 利用集合思想来简化实现（ES6 Set）
let _set = {};
let _newarr = [];
arr.forEach((v) => _set[v] || ((_set[v] = true), _newarr.push(v))); // 减少赋值行为

// 终极去重方法，如何判同

```
