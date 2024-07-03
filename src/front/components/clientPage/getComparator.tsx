import {ColDef} from "ag-grid-community";

type UnUndefined<T extends (any | undefined)> = T extends undefined ? never : T
type t1<T = any> = ColDef<T>["comparator"]
type paramsCompare<TData = any> = Parameters<UnUndefined<t1>>

export function getComparatorGrid<T = any>(func?: (...param: paramsCompare<T>) => [a: number, b: number]): t1 {
    return (...param) => {
        const [a1, b1, modeA, modeB, inv] = param
        const [a, b] = func ? func(...param) : [a1, b1]
        return (a != undefined && b != undefined && a != 0 && b != 0) ? a - b : a == b ? 0 : (!!b) ? (inv ? -1 : 1) : (inv ? 1 : -1)
    }
}