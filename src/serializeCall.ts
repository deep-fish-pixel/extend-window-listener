/**
 * 序列化调用 返回true 或 resolve(true) 调用链终止
 * @param handles
 */
export default function (handles: Array<Function>) {
  let index = -1;

  function next(...args: any[]): any {
    index++;

    if(handles[index]){
      const result = handles[index].call(window, ...args);

      if(!result){
        return next(...args);
      }

      if(result && result.then){
        return result.then((res: boolean) => {
          if(!res){
            return next(...args);
          }
          return true;
        });
      }
    }

    return false;
  }

  return next;
}
