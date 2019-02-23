class Observer {
  constructor(data) {
    this.observer(data);
  }
  observer(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach(key => {
      // 先绑定深层次的 key 再 绑定上一层的 否则会导致 被替换
      this.observer(data[key]);
      this.defineReactive(data, key, data[key]);
    });
  }
  defineReactive(data, key, val) {

    const that = this;

    const dep = new Dep(); //每个 变化的

    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 秀啊 秀啊 秀啊  胸die 
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newVal) {

        if (val !== newVal) {
          that.observer(newVal);
          val = newVal;
          dep.notify(); // 通知订阅者
        }
      }
    });

  }
}


class Dep {
  constructor() {
    this.sub = [];
  }
  addSub(warcher) {
    this.sub.push(warcher);
  }
  notify() {
    this.sub.forEach(warcher => {
      warcher.updater();
    });
  }
}