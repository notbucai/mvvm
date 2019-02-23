class Compile {
  constructor(el, vm) {

    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;

    const fragment = this.node2fragment(this.el);

    this.compole(fragment);

  }

  // 核心
  /**
   * 文本节点处理
   * @param {Element} node 当前需要处理的
   */
  compileText(node) {
    const expr = node.textContent;
    const rex = /\{\{([^}]+)\}\}/g;
    if (rex.test(expr)) {
      CompileUtils['text'](node, this.vm, expr);
    }
  }
  /**
   * 元素节点
   * @param {Element} node 
   */
  compileElement(node) {
    const attrs = node.attributes;
    Array.from(attrs).forEach(attr => {

      if (this.isDirective(attr.name)) {
        const [, type] = attr.name.split('-');
        const expr = attr.value;

        CompileUtils[type] && CompileUtils[type](node, this.vm, expr);

      }
    });
  }

  /**
   *  模版 编译
   * @param {Element} fragment 
   */
  compole(fragment) {
    // 将所有子元素提取出来
    const childs = fragment.childNodes;

    Array.from(childs).forEach(node => {
      // 如果是 元素节点就再遍历一下他的子节点 
      if (this.isElementNode(node)) {
        this.compileElement(node);
        // 元素节点
        this.compole(node);

      } else {
        // 文本节点
        this.compileText(node);
      }
    })

    this.el.appendChild(fragment);

  }

  node2fragment(el) {
    const fragment = document.createDocumentFragment();
    let children;
    while (children = el.firstElementChild) {
      fragment.appendChild(children);
    }
    return fragment;
  }

  // 辅助功能

  isElementNode(el) {
    return el.nodeType === 1;
  }

  isDirective(str) {
    return str.indexOf("v-") === 0;
  }

}

const CompileUtils = {
  getVal(vm, expr) {
    expr = expr.split(".");

    return expr.reduce((prev, next) => {
      return prev[next];
    }, vm.$data);

  },
  setVal(vm, expr, value) {
    expr = expr.split(".");

    return expr.reduce((prev, next, currentIndex) => {
      if (currentIndex == expr.length - 1) {
        return prev[next] = value;
      }
      return prev[next];
    }, vm.$data);
  },
  getTextVal(vm, expr) {
    return expr.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      return this.getVal(vm, args[1]);
    });
  },
  text(node, vm, expr) {
    const textUpdater = this.updater['textUpdater'];

    const value = this.getTextVal(vm, expr);

    expr.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      new Warcher(vm, args[1], () => {
        textUpdater && textUpdater(node, this.getTextVal(vm, expr));
      });
    });

    textUpdater && textUpdater(node, value);

  },
  /**
   * 
   * @param {Element} node 
   * @param {MVVM} vm 
   * @param {String} expr 
   */
  model(node, vm, expr) {
    const value = this.getVal(vm, expr);
    const textUpdater = this.updater['modelUpdater'];
    node.addEventListener('input', (e) => {
      const newValue = e.target.value;
      this.setVal(vm, expr, newValue);
    });
    new Warcher(vm, expr, () => {
      textUpdater && textUpdater(node, this.getVal(vm, expr));
    });

    textUpdater && textUpdater(node, value);
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    }
  }
}