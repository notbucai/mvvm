# 前端 mvvm 实现

## 放上一张图

![mvvm](2.png)

`数据劫持`: vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
