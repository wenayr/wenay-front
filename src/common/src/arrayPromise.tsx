
export function ArrayPromise<T extends any = unknown>({arr, catchF, thenF}: {
    arr: (() => Promise<T>)[],
    thenF?: (data: T, i: number, countOk: number, countError: number, count: number) => any,
    catchF?: (error: any, i: number, countOk: number, countError: number, count: number) => any
}) {
    let ok = 0, error = 0
    const count = arr.length
    const a = (data: T, i: number) => {
        ++ok;
        return thenF?.(data, i, ok, error, count) ?? data
    }
    const b = (error: any, i: number) => {
        ++error;
        if (catchF) return catchF?.(error, i, ok, error, count)
        else throw error
    }
    return arr.map((e, i) => () => e().then(r => a(r, i)).catch((er: any) => b(er, i)))
}