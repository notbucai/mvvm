# 前端 mvvm 实现

## 2019-08-30 更新proxy实现
>[MDN 元编程](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Meta_programming),[MDN Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy),[MDN Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect),

> 个人感觉 mvvm还是 proxy(解决数组) 和 Object.defineProperty (对象每个key监听)  
> 如果监听数组的话还是需要监听一下`length`属性的  
> 单独proxy实现mvvm资源太浪费的

#### 代码在 [mvvm-proxy.html](./mvvm-proxy.html)

## 放上一张图

![mvvm](2.png)

`数据劫持`: vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。


1.对数据进行劫持
2.getter 添加订阅 setter 通知订阅者 更新视图
3.解析指令 绑定订阅者 第一次更新视图
  创建订阅者 获取(getter)当前value 触发（添加订阅）
4.当setter发生改变 就通知订阅者