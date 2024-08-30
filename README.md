# extend-window-listener

扩展window.addEventListener，增加异步和打断机制

## 使用

```bash
npm install extend-window-listener
```

```ts
// 第一步添加扩展
import { extendListeners, } from "extend-window-listener";

extendListeners("popstate");

// 使用场景
window.addEventListener("popstate", function (event: PopStateEvent) {
  const state = event.state || {};

  return new Promise((resolve, reject) => {
    if(state.name === '阻断'){
      // 跳出执行所有事件句柄
      resolve(true);
    } else {
      // 通过后执行下一个事件句柄
      resolve(false);
    }
  });
});
```

```ts
// 移除扩展
import { removeExtendListeners, } from "extend-window-listener";

removeExtendListeners("popstate");
```

