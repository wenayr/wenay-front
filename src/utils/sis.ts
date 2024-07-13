// import {ApiFacade} from "./apiFacade";
import {CashFuncMapCash} from "./cash";
import {mapResiReact} from "../front/components/common/Resizeble";
import {ExRNDMap} from "../front/components/commonNew/RNDFunc";


/// создаем объект состояния фронта
const staticProps = new Map<string,object>()

export function staticSet(key: any, data: object) {
    if (!staticProps.has(key)) staticProps.set(key,data)
}

export function staticGet(key: any) {
    return staticProps.get(key)
}

export function staticGetAdd<T extends object>(key: any, def: T) {
    const t = (staticProps.get(key) || staticProps.set(key, def).get(key)!) as T
    return t //Object.assign(def, t)
}

export const Cash = CashFuncMapCash(
    [
        ["mapResiReact", mapResiReact],
        ["ExRNDMap", ExRNDMap],
        ["staticProps", staticProps]
    ]
)

