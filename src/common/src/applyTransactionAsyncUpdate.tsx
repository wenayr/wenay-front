import {ColDef, GridReadyEvent} from "ag-grid-community";

export function applyTransactionAsyncUpdate<T>(grid: GridReadyEvent<T, any> | null | undefined, newData: (Partial<T>)[], getId: (...a: any[]) => string, bufTable:{[id: string]: Partial<T>}) {
    if (grid?.api.getRowNode) {

        const arr = newData.map(e => {
            const id = getId(e)//dataTable
            const a = grid.api.getRowNode(id)?.data
            if(!a) return null
            bufTable[id] = {...a , ...(bufTable[id]??{}), ...e}
            return bufTable[id]
        }).filter(e => e) as T[]
        grid.api.applyTransactionAsync({update: arr})
    }
}


type UnUndefined<T extends (any | undefined)> = T extends undefined ? never : T
type t1<T = any> = ColDef<T>["comparator"]
type paramsCompare<TData = any> = Parameters<UnUndefined<t1>>

export function getComparatorGrid<T = any>(func?: (...param: paramsCompare<T>) => [a: number, b: number]): t1 {
    return (...param) => {
        const [a1, b1, modeA, modeB, inv] = param
        const [a, b] = func ? func(...param) : [a1, b1]
        return ((a != undefined && !Number.isNaN(a)) && (b != undefined && !Number.isNaN(b))) ? a - b : a == b ? 0 : (!Number.isNaN(b) && b != undefined) ? (inv ? -1 : 1) : (inv ? 1 : -1)
    }
}