import serializeCall from "./serializeCall";

type Listener = (evt: Event) => void;

const listeners: Record<string, {
  rootHandle: Listener;
  handles: Array<Listener>,
}> = {};
const addEventListenerOriginal = window.addEventListener;
const removeEventListenerOriginal = window.removeEventListener;

window.addEventListener = function extendAddEventListener(...params: any[]) {
  const eventName = params[0];
  const handle = params[1];

  if (!handle) {
    return;
  }

  const listener = listeners[eventName];

  if (listener) {
    // 添加句柄
    listener.handles.push(handle);
  } else {
    // @ts-ignore
    addEventListenerOriginal.apply(window, params);
  }
};

window.removeEventListener = function extendRemoveEventListener(...params: any[]) {
  const eventName = params[0];
  const handle = params[1];

  if (!handle) {
    return;
  }

  const listener = listeners[eventName];

  if (listener) {
    listener.handles.some((fn, index) => {
      if(fn === handle){
        // 剔除指定句柄
        listener.handles.splice(index, 1);
        return true;
      }
    });
  } else {
    // @ts-ignore
    removeEventListenerOriginal.apply(window, params);
  }
};

/**
 * 扩展window事件
 * @param extendEventNames 扩展事件名称
 * @example extendListeners('popstate', 'hashchange');
 */
export function extendListeners(...extendEventNames: string[]) {
  extendEventNames.forEach((eventName) => {
    // @ts-ignore
    addEventListenerOriginal.call(window, eventName, extendHandle);
    listeners[eventName] = {
      rootHandle: extendHandle,
      handles: [],
    };

    function extendHandle(event: Event) {
      const listener = listeners[eventName];

      const next = serializeCall(listener.handles);

      next(event);
    }
  });
}

/**
 * 移除扩展window事件
 * @param extendEventNames 需要移除的扩展事件名称
 * @example removeExtendListeners('popstate', 'hashchange');
 */
export function removeExtendListeners(...extendEventNames: string[]) {
  extendEventNames.forEach((eventName) => {
    const listener = listeners[eventName];

    if(listener){
      removeEventListenerOriginal.call(window, eventName, listener.rootHandle);
      delete listeners[eventName];
    }
  });
}
