const ctx = '@@InfiniteScroll';

console.log('infinite scroll begins');

const throttle = (fn, delay) => {
  var now, lastExec, timer, context, args; //eslint-disable-line

  const execute = () => {
    fn.apply(context, args);
    lastExec = now;
  };

  return () => {
    context = this;
    args = arguments;

    now = Date.now();

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (lastExec) {
      const diff = delay - (now - lastExec);
      if (diff < 0) {
        execute();
      } else {
        timer = setTimeout(() => {
          execute();
        }, diff);
      }
    } else {
      execute();
    }
  };
};

const getScrollTop = (element) => {
  // console.log(element);
  // if (element === window) {
  //   return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
  // }

  return element.scrollTop;
};

// const getComputedStyle = document.defaultView.getComputedStyle;

const getScrollEventTarget = element => element;
// {
// console.log('getting scroll event target');
// console.log(element);
// let currentNode = element;
// // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
// while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
//   const overflowY = getComputedStyle(currentNode).overflowY;
//   if (overflowY === 'scroll' || overflowY === 'auto') {
//     console.log(currentNode);
//     return currentNode;
//   }
//   currentNode = currentNode.parentNode;
// }
// return window;
// };

const getVisibleHeight = element => element.clientHeight;
// {
// if (element === window) {
//   return document.documentElement.clientHeight;
// }
// return element.clientHeight;
// };

const getElementTop = element => element.getBoundingClientRect().top + getScrollTop(window);

// function (element) {
//   if (element === window) {
//     return getScrollTop(window);
//   }
//   return element.getBoundingClientRect().top + getScrollTop(window);
// };

const isAttached = (element) => {
  let currentNode = element.parentNode;
  while (currentNode) {
    if (currentNode.tagName === 'HTML') {
      return true;
    }
    if (currentNode.nodeType === 11) {
      return false;
    }
    currentNode = currentNode.parentNode;
  }
  return false;
};

const doBind = function () {
  if (this.binded) return; // eslint-disable-line
  this.binded = true;

  const directive = this;
  const element = directive.el;

  const throttleDelayExpr = element.getAttribute('infinite-scroll-throttle-delay');
  let throttleDelay = 200;
  if (throttleDelayExpr) {
    throttleDelay = Number(directive.vm[throttleDelayExpr] || throttleDelayExpr);
    if (isNaN(throttleDelay) || throttleDelay < 0) {
      throttleDelay = 200;
    }
  }
  directive.throttleDelay = throttleDelay;

  directive.scrollEventTarget = getScrollEventTarget(element);
  directive.scrollListener = throttle(doCheck.bind(directive), directive.throttleDelay);
  directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener);

  this.vm.$on('hook:beforeDestroy', () => {
    directive.scrollEventTarget.removeEventListener('scroll', directive.scrollListener);
  });

  const disabledExpr = element.getAttribute('infinite-scroll-disabled');
  let disabled = false;

  if (disabledExpr) {
    this.vm.$watch(disabledExpr, (value) => {
      directive.disabled = value;
      if (!value && directive.immediateCheck) {
        doCheck.call(directive);
      }
    });
    disabled = Boolean(directive.vm[disabledExpr]);
  }
  directive.disabled = disabled;

  const distanceExpr = element.getAttribute('infinite-scroll-distance');
  let distance = 0;
  if (distanceExpr) {
    distance = Number(directive.vm[distanceExpr] || distanceExpr);
    if (isNaN(distance)) {
      distance = 0;
    }
  }
  directive.distance = distance;

  const immediateCheckExpr = element.getAttribute('infinite-scroll-immediate-check');
  let immediateCheck = true;
  if (immediateCheckExpr) {
    immediateCheck = Boolean(directive.vm[immediateCheckExpr]);
  }
  directive.immediateCheck = immediateCheck;

  if (immediateCheck) {
    doCheck.call(directive);
  }

  const eventName = element.getAttribute('infinite-scroll-listen-for-event');
  if (eventName) {
    directive.vm.$on(eventName, () => {
      doCheck.call(directive);
    });
  }
};

var doCheck = function (force) {
  const scrollEventTarget = this.scrollEventTarget;
  const element = this.el;
  const distance = this.distance;

  if (force !== true && this.disabled) return; //eslint-disable-line
  const viewportScrollTop = getScrollTop(scrollEventTarget);
  const viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget);

  let shouldTrigger = false;

  if (scrollEventTarget === element) {
    shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance;
  } else {
    const elementBottom = getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight + viewportScrollTop;

    shouldTrigger = viewportBottom + distance >= elementBottom;
  }

  if (shouldTrigger && this.expression) {
    this.expression();
  }
};

export default {
  bind(el, binding, vnode) {
    el[ctx] = {
      el,
      vm: vnode.context,
      expression: binding.value,
    };
    const args = arguments;
    el[ctx].vm.$on('hook:mounted', () => {
      el[ctx].vm.$nextTick(() => {
        if (isAttached(el)) {
          doBind.call(el[ctx], args);
        }

        el[ctx].bindTryCount = 0;

        var tryBind = function () {
          if (el[ctx].bindTryCount > 10) return; //eslint-disable-line
          el[ctx].bindTryCount++;
          if (isAttached(el)) {
            doBind.call(el[ctx], args);
          } else {
            setTimeout(tryBind, 50);
          }
        };

        tryBind();
      });
    });
  },

  unbind(el) {
    if (el && el[ctx] && el[ctx].scrollEventTarget) {
      el[ctx].scrollEventTarget.removeEventListener('scroll', el[ctx].scrollListener);
    }
  },
};
