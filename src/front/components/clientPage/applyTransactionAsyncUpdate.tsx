import {GridReadyEvent} from "ag-grid-community";

export function applyTransactionAsyncUpdate<T>(grid: GridReadyEvent<T, any> | null | undefined, newData: (Partial<T>)[], getId: (...a: any[]) => string, bufTable:{[id: string]: Partial<T>}) {

    if (grid?.api?.getRowNode) {
        const arr = newData.map(e => {
            const id = getId(e)//dataTable
            const a = grid.api?.getRowNode?.(id)?.data
            if(!a) return null
            bufTable[id] = {...a , ...(bufTable[id]??{}), ...e}
            return bufTable[id]
        }).filter(e => e) as T[]
        if (arr.length) grid.api?.applyTransactionAsync?.({update: arr})
    }
}
