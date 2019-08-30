class    {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    this.value = this.get();

  }
  getVal(vm, expr) {
    expr = expr.split('.');
    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);
  }
  // 每个实例 执行一次
  get() {
    Dep.target = this;	// 将当前订阅者指向自己 
    var value = this.getVal(this.vm, this.expr);	// 触发getter，添加自己到属性订阅器中 当执行这个的时候 会触发getter 然后将Dep.target = this; 添加到 Dep
    Dep.target = null;	// 添加完毕，重置 防止其他 操作触发 getter 导致重复添加
    return value;

  }
  updater() {
    const newVal = this.getVal(this.vm, this.expr);
    if (newVal != this.value) {
      this.cb(newVal, this.value);
    }
  }
}
