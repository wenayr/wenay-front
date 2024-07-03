import {useLayoutEffect, useState} from "react";
import {waitRun} from "wenay-common";

type tFunc2 = Map<object, (a?: any) => void>
const map3 = new WeakMap<object, tFunc2>();
const mapWait = new Map<object, ReturnType<typeof waitRun>>();


export function renderBy(a: object, ms?: number) {
    const t = () => map3.get(a)?.forEach(e=>e(a))
    if (ms) {
        (mapWait.get(a) || mapWait.set(a, waitRun()).get(a)!)
            .refreshAsync(ms, ()=> {
                mapWait.delete(a)
                t()
            })
    }
    else t()
}

export function useUpdate(){
    const t = useState(0)
    return ()=>t[1](t[0]++)
}

export function updateBy<T extends object>(a: T, f?: React.Dispatch<React.SetStateAction<T>> | ((a: T) => void)) {
    const t = f ? null : useUpdate()
    useLayoutEffect(() => {
        const func = f ?? t!
        const r = (map3.get(a) || map3.set(a, new Map()).get(a)!)
        r.set(func, func)
        return ()=> {
            r?.delete(func)
        }
    },[true])
}
