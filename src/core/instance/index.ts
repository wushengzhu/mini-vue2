import { GlobalAPI } from "src/types/global-api";
import { warn } from "../util";
import { initMixin } from "./init";


// Vue 实例
function Vue(options){
    if(__DEV__ && !(this instanceof Vue)){
        warn('Vue is a constructor and should be called with the `new` keyword')
    }
    this._init(options)
}
// @ts-expect-error Vue has function type
initMixin(Vue)

export default Vue as unknown as GlobalAPI