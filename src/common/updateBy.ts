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
                t()})
    }
    else t()
}

export function renderByRevers(a: object, ms?: number, reverse = true) {
    const ar: ((a?: any) => void)[] = []
    map3.get(a)?.forEach(e=>ar.push(e))
    const t = reverse ? () => ar.reverse().forEach(e=>e(a))
        : () => ar.forEach(e=>e(a))
    if (ms) {
        (mapWait.get(a) || mapWait.set(a, waitRun()).get(a)!)
            .refreshAsync(ms, ()=> {
                mapWait.delete(a)
                t()})
    }
    else t()
}

export function renderByLast(a: object, ms?: number) {
    const ar: ((a?: any) => void)[] = []
    map3.get(a)?.forEach(e=>ar.push(e))
    const t =  () => ar.at(-1)?.()
    if (ms) {
        (mapWait.get(a) || mapWait.set(a, waitRun()).get(a)!)
            .refreshAsync(ms, ()=> {
                mapWait.delete(a)
                t()})
    }
    else t()
}

export function updateBy<T extends object>(a: T, f?: React.Dispatch<React.SetStateAction<T>> | ((a: T) => void)) {
    const t = useState(0)
    useLayoutEffect(() => {
        const func = f ?? ((a: T) =>{
            // без особых причин только для первого рендера - необходима два вызова, иначе - вызов не проходит
            if (t[0] == 0) {
                t[1](t[0]++)
                // t[1](t[0]++)
            }
            else t[1](t[0]++)
        })
        const r = (map3.get(a) || map3.set(a, new Map()).get(a)!)
        r.set(func, func)
        return ()=> {
            r?.delete(func)
        }
    },[true])
}
