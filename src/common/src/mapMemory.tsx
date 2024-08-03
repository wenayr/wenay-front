import {ExRNDMap, mapResiReact} from "../../lib";
import {CashFuncMapCash} from "./src/cash";

const staticProps = new Map<string,object>()

export function staticSet(key: any, data: object) {
    if (!staticProps.has(key)) staticProps.set(key,data)
}

export function staticGet(key: any) {
    return staticProps.get(key)
}

export function staticGetAdd<T extends object>(key: any, def: T) {
    const t = (staticProps.get(key) || staticProps.set(key, def).get(key)!) as T
    return Object.assign(def, t) // t //
}

export const Cash = CashFuncMapCash(
    [
        ["mapResiReact", mapResiReact],
        ["ExRNDMap", ExRNDMap],
        ["staticProps", staticProps]
    ]
)

export const MemoryMap = {
    rnd: ExRNDMap,
    resize: mapResiReact,
    other: staticProps
}