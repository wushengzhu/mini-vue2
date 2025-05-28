import { isPromise } from "util/types"
import { popTarget, pushTarget } from "../observer/dep"


export function handleError(err:Error,vm:any,info:string){
  pushTarget()

  popTarget()
}



export function invokeWithErrorHandling(handler:Function,context:any,args:null|any[],vm:any,info:string){
    let res
    try{
     res = args?handler.apply(context,args):handler.call(context)
     if(res && !res._isVue && isPromise(res) && !(res as any)._handled){
        res.catch(e => handleError(e,vm,info+`（Promise/async）`));
        (res as any)._handled = true
     }
    }catch(e:any){
       handleError(e,vm,info)
    }

    return res
}

