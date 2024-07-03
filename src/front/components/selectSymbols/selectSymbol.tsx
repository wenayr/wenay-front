import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button, ButtonOutClick, OutsideClick, StyleOtherColum} from "../commonNew/commonFuncReact";
import {AgGridReact} from "ag-grid-react";
import {ColDef, ColGroupDef, GridApi, GridReadyEvent} from "ag-grid-community";
import {DivRnd} from "../commonNew/RNDFunc";

import {const_Date, DblToStrAnd, Params, timeLocalToStr_yyyymmdd, waitRun} from "wenay-common";
import {StyleGridDefault} from "../common/styleGrid";
import {ApiData, staticGetAdd} from "../../../utils/sis";
import {mouseAdd} from "../other/mouse";
import {renderBy, updateBy} from "../../updateBy";
import {KeyDown} from "../other/addDownAnyKey";
import {MiniButton} from "../other/miniButton";
// import {RealTime} from "../../../utils/staticSocket";
import {
    dataRowSymbols,
    selectFilterSymbols,
    settingLoadSymbols,
    settingLoadSymbolsDef,
    tableSymbols,
    tRowsSymbols,
    tSymbolsRow
} from "./select";
import {loadDataSymbols} from "./utils";
import {LoadSelectRD} from "./utilsReact";
import {BSelectSymbols} from "./selectTable";
import {applyTransactionAsyncUpdate} from "../clientPage/applyTransactionAsyncUpdate";
import {ApiAccount} from "../../../utils/apiFacade";
import {ParametersReact} from "../other/Parameters2";


function normalizeDate(date :const_Date, step :number) { return new Date(Math.floor(date.valueOf() / step)*step); }

type trs<T> = {[P in keyof T]: (string)}


type ttt = trs<tRowsSymbols>

function selectRows(...e: ttt[]) {
    return e.map(e=>selectRow(e))
}

export type tMinSelectSymbols = ReturnType<typeof selectRow>
// минимальные набор данных для выбора символа на бэке
function selectRow(e: ttt) {
    return {symbol: e.symbol, category: e.category, type: e.type, tfSec: +e.tfSec, exchange: e.exchange}
}
export type selectSymbols = ReturnType<typeof selectRow>

export function creatSearchSym(keyDown: {key: string}) {
    let focus = false
    return function SearchSym({set, get}:{set: (e: string) => any, get: ()=>string}) {
        updateBy(keyDown, (e:typeof keyDown) => {
            if (!focus) {
                if (e.key.length == 1) set(get() + e.key)
                else {
                    if (e.key == "Escape")  set("")
                    if (e.key == "Backspace") set(get().slice(0,-1))
                }
            }
        })
        const inputText = <OutsideClick outsideClick={()=>{focus = false}}>
            <input style={{width: 70}} type={"text"} onChange={(e)=>{
                set(e.target.value)
            }} value={get()} onFocus={(e)=>{
                focus = true
            }}/>
        </OutsideClick>
        return <>
            <div style={{}}>{inputText}</div>
            <div style={{minWidth: 50}}>
                {
                    get().length > 0 &&
                    <div onClick={() => set("")}>del</div>
                }
            </div>
        </>
    }
}

export const SearchSym = creatSearchSym(KeyDown)

export function SelectFilter(){
    const datum = staticGetAdd("filter",selectFilterSymbols)
    updateBy(datum)
    updateBy(datum.show)
    updateBy(dataRowSymbols)
    return <div >
        <div style={{float: "right"}}>
            <SearchSym get={()=>datum.word} set={e=>{datum.word = e; renderBy(datum)}}/>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap"}}>

            <MiniButton name={"exchange"} arr={dataRowSymbols.exchange}
                        get={() => datum.obj.exchange ??= {}}
                        onClick={()=>{renderBy(datum)}}
            />
            <MiniButton name={"category"} arr={dataRowSymbols.category}
                        get={() => datum.obj.category ??= {}}
                        onClick={()=>{renderBy(datum)}}
            />
            <MiniButton name={"type"} arr={dataRowSymbols.type}
                        get={() => datum.obj.type ??= {}}
                        onClick={()=>{renderBy(datum)}}
            />
            <MiniButton name={"tfSec"} arr={dataRowSymbols.tfSec}
                        get={() => datum.obj.tfSec ??= {}}
                        onClick={()=>{renderBy(datum)}}
            />
            <MiniButton name={"show"} arr={Object.keys(datum.show)}
                        get={() => datum.show}
                        onClick={()=>{renderBy(datum)}}
            />
            <Button className={"newButtonSimple"} button={(e) => <div className={e ? "msTradeAlt msTradeActive" : "msTradeAlt"}>{"setting"}</div>}>
                <>
                    <div className={"maxSize"} style={{height: "auto", minWidth: 250, width: 300}}>
                        <ParametersReact params={settingLoadSymbolsDef}
                                         onChange={e=> {
                                                   console.log(e);
                                                   Object.assign(settingLoadSymbols, Params.GetSimpleParams(e))
                        }}/>
                    </div>
                </>
            </Button>

            <div
                className={datum.unique ? 'msTradeAlt msTradeActive' : 'msTradeAlt'}
                key={12121}
                onClick={() => {
                    datum.unique = !datum.unique
                    renderBy(datum)
                }}
            >unique</div>

        </div>
    </div>
}


function funcFilter(arr: trs<tRowsSymbols>[], objFilter: typeof selectFilterSymbols) {
    // buff?.apiGrid?.setFilterModel({symbol: {type:"contains", datum: e.word}})
    let arrNew = arr
    if (objFilter.word.length) arrNew = dataRowSymbols.AllSym.filter(z=> z.symbol.toUpperCase().indexOf(objFilter.word.toUpperCase()) >= 0 ||
        (z.category && z.category.toUpperCase().indexOf(objFilter.word.toUpperCase()) >= 0) ||
        (z.type && z.type.toUpperCase().indexOf(objFilter.word.toUpperCase()) >= 0) ||
        (z.exchange && z.exchange.toUpperCase().indexOf(objFilter.word.toUpperCase()) >= 0)
    )
    arrNew = arrNew.filter(z=> objFilter.obj.category[z.category??""] == true &&
        objFilter.obj.category[z.category??""] == true &&
        objFilter.obj.type[z.type??""] == true &&
        objFilter.obj.exchange[z.exchange??""] == true &&
        objFilter.obj.tfSec[z.tfSec??""] == true
    )

    if(objFilter.unique){
        const exArr = Object.keys(objFilter.obj.exchange)
        const catArr = Object.keys(objFilter.obj.category)

        const temp:{[sym:string]: {categories: string[], exchanges: string[]}} = {}
        arrNew.forEach(e=>{
            const sym = e.baseAsset! + e.quoteAsset!
            if(!temp[sym]) temp[sym] = {categories:[],exchanges:[]}
            temp[sym].categories.push(e.category)
            temp[sym].exchanges.push(e.exchange)
        })

        arrNew = arrNew.filter(e=> {
            const sym = e.baseAsset! + e.quoteAsset!
            return exArr.every(e => temp[sym].exchanges.includes(e)) &&
                   catArr.every(e => temp[sym].categories.includes(e))
        })
    }

    return arrNew
}

export const getRowIdSymbols = (e: {tfSec: number, exchange: string, category: string, symbol: string} |trs<tRowsSymbols>) => `${e.exchange}_${e.category}_${e.symbol}_${e.tfSec}`


export function SelectSymbol(data: Parameters<typeof SelectSymbol2>[0]) {
    // пока не понятно зачем мне эта функция
    return SelectSymbol2(data)
}

// меняем цвет при изменении
const cellColor = (() => {
    const map = new Map<string, number>()
    return (e: { value: string | number, data: { id: string } & any }) => {
        let last = map.get(e.data.id) ?? null
        if (last == null) last = e.value as number
        const st = last > +e.value
        map.set(e.data.id, +e.value)
        return {color: st ? "red" : "green", textAlign: "center"}
    }
})


const bufTable: any = {}
type tSelectSymbol = {id: number, update: number, filter: typeof selectFilterSymbols, selectSymbols: {[id: string] :any}}
export function SelectSymbol2({id, update, filter, selectSymbols}: tSelectSymbol) {
    const datum = filter
    const grid = useRef<tableSymbols|null>()
    const select = selectSymbols

    useEffect(()=> grid?.current?.api.sizeColumnsToFit?.(),[update])

    useEffect(()=>{
        loadFilters()
            .then(loaSymbols)
    },[true])

    const [rowData, setRows] =  useState([] as trs<tRowsSymbols>[])

    type tColum<TData extends any = any> = (ColDef<TData> | ColGroupDef<TData>)
    const columnsSymbols_: ColDef<any, any>[] = [
        {
            field: tSymbolsRow.symbols,
            headerName: "symbols"
        },
        {
            field: "select",
            width: 30,
            sortable: true,
            filter: false,
            valueFormatter: e => "",
            valueGetter: e=> select[getRowIdSymbols(e.data)],
            onCellClicked: (e) => {
                const id = getRowIdSymbols(e.data)
                if (select[id]) delete select[id]
                else select[id] = e.data
                // e.api.refreshCells()
                e.api.applyTransactionAsync({update: [{id, ...e.data, select: !!select[id]}]})
                renderBy(select)
            },
            cellStyle: e => {
                const id = getRowIdSymbols(e.data)
                return {background: select[id] ? "#8a8a8a" : "rgba(0,0,0,0)"}
            }
        },
        {
            field: tSymbolsRow.exchange,
        },
        {
            field: tSymbolsRow.category,
        },
        {
            field: "markets",
        },
        {
            field: tSymbolsRow.acc,
            hide: true
        },
        {
            field: tSymbolsRow.type,
            hide: true
        },
        {
            field: "price",
            enableValue: true,
            cellClass: 'number',
            cellStyle: cellColor(),
            hide: true
        },
        {
            field: tSymbolsRow.v24,
            comparator: (a,b, nodeA, nodeB, inv)=>(a!=undefined && b!=undefined && a!=0 && b!=0)? a-b : a==b ? 0 : (!!b)? (inv?-1:1) : (inv?1:-1),
        },
        {
            field: tSymbolsRow.start,
            hide: true
        },
        {field: "quoteAsset"},
        {
            field: tSymbolsRow.bars,
            comparator: (valueA, valueB, nodeA, nodeB, isDescending) => valueA - valueB
        },
        {
            field: tSymbolsRow.tfSec,
            comparator: (valueA, valueB, nodeA, nodeB, isDescending) => valueA - valueB
        },
    ] satisfies tColum[]
    const [columnsSymbols, setColumnsSymbols] =  useState(columnsSymbols_)


    const tfsRealtime = [900,60]
    useEffect(()=> {
        const api = ApiAccount.facade.apiBinance.all
        api.stream.spot.callback(e=>{
                if (typeof e == "string") return
            tfsRealtime.forEach(tfSec=>{
                    applyTransactionAsyncUpdate<any>(grid.current, e.map(e=>({
                        exchange: "binance", tfSec, symbol: e.s, category: "spot",
                        price: e.p, v24: DblToStrAnd(+((+e.q)/1000000),{digitsR:3})//+((+e.q)/1000000).toFixed(2)
                    })), getRowIdSymbols, bufTable)
                })
            })
        api.stream.futures.callback(e=>{
            if (typeof e == "string") return
            tfsRealtime.forEach(tfSec=>{
                applyTransactionAsyncUpdate<any>(grid.current, e.map(e=>({
                    exchange: "binance", tfSec, symbol: e.s, category: "futures",
                    price: e.p, v24: DblToStrAnd(+((+e.q)/1000000),{digitsR:3})//+((+e.q)/1000000).toFixed(2)
                })), getRowIdSymbols, bufTable)
            })
        })


        const apiBybit = ApiAccount.facade.apiBybit.all
        apiBybit.stream.spot.callback(e=>{
            if (typeof e == "string") return
            tfsRealtime.forEach(tfSec=>{
                applyTransactionAsyncUpdate<any>(grid.current, e.filter(e=>e.data.turnover24h).map(e=>({
                    exchange: "bybit", tfSec, symbol: e.data.symbol, category: "spot",
                    price: (e.data.bid1Price || e.data.lastPrice), v24: DblToStrAnd(+((+e.data.turnover24h)/1000000),{digitsR:3})//+((+e.data.turnover24h)/1000000).toFixed(2)
                })), getRowIdSymbols, bufTable)
            })
        })
        apiBybit.stream.futures.callback(e=>{
            if (typeof e == "string") return
            tfsRealtime.forEach(tfSec=>{
                applyTransactionAsyncUpdate<any>(grid.current, e.filter(e=>e.data.turnover24h).map(e=>({
                    exchange: "bybit", tfSec, symbol: e.data.symbol, category: "futures",
                    price: (e.data.bid1Price || e.data.lastPrice), v24: DblToStrAnd(+((+e.data.turnover24h)/1000000),{digitsR:3})//+((+e.data.turnover24h)/1000000).toFixed(2)
                })), getRowIdSymbols, bufTable)
            })
        })



        const apiGateio = ApiAccount.facade.apiGateio.all
        apiGateio.stream.spot.callback(e=>{
            if (typeof e == "string") return
            tfsRealtime.forEach(tfSec=>{
                applyTransactionAsyncUpdate<any>(grid.current, e.map(e=>({
                    exchange: "gateio", tfSec, symbol: e.result.currency_pair, category: "spot",
                    price: +e.result.last, v24: DblToStrAnd(+((+e.result.quote_volume)/1000000), {digitsR:3})//.toFixed(2)
                })), getRowIdSymbols, bufTable)
            })
        })
        apiGateio.stream.futures.callback(e=>{
            if (typeof e == "string") return
            tfsRealtime.forEach(tfSec=>{
                applyTransactionAsyncUpdate<any>(grid.current, e.map(e=>({
                    exchange: "gateio", tfSec, symbol: e.result[0].contract, category: "futures",
                    price: +e.result[0].last, v24: DblToStrAnd(+((+e.result[0].volume_24h_quote)/1000000), {digitsR:3})//.toFixed(2)
                })), getRowIdSymbols, bufTable)
            })
        })



        return ()=>{
            ApiAccount.facade.apiBinance.all.stream.spot.removeCallback()
            ApiAccount.facade.apiBinance.all.stream.futures.removeCallback()
            ApiAccount.facade.apiBybit.all.stream.spot.removeCallback()
            ApiAccount.facade.apiBybit.all.stream.futures.removeCallback()
            ApiAccount.facade.apiGateio.all.stream.spot.removeCallback()
            ApiAccount.facade.apiGateio.all.stream.futures.removeCallback()
        }
    },[true])

    useEffect(()=> {
        if (rowData.length) {
            const apiBinance = ApiAccount.facade.apiBinance.all
            apiBinance.getSymMemo()
                .then(e=>{
                    // console.log(e)
                    tfsRealtime.forEach(tfSec=> {
                        applyTransactionAsyncUpdate<any>(grid.current, e.map(e=>({
                            // @ts-ignore
                            exchange: e.exchange, tfSec, symbol: e.symbols, category: e.category, markets: e.categoryAcc ?? []
                        })), getRowIdSymbols, bufTable)
                    })

                    apiBinance.priceMemo("spot")
                        .then(e=>{
                            tfsRealtime.forEach(tfSec=>{
                                applyTransactionAsyncUpdate<any>(grid.current, Object.values(e).map(e=>({
                                    exchange: "binance", tfSec, symbol: e.s, category: "spot",
                                    price: e.p, v24: DblToStrAnd(+((+e.q)/1000000),{digitsR:3})
                                })), getRowIdSymbols, bufTable)
                            })
                        })
                    apiBinance.priceMemo("futures")
                        .then(e=>{
                            tfsRealtime.forEach(tfSec=>{
                                applyTransactionAsyncUpdate<any>(grid.current, Object.values(e).map(e=>({
                                    exchange: "binance", tfSec, symbol: e.s, category: "futures",
                                    price: e.p, v24: DblToStrAnd(+((+e.q)/1000000),{digitsR:3})//+((+e.q)/1000000).toFixed(2)
                                })), getRowIdSymbols, bufTable)
                            })
                        })

                })

            const apiBybit = ApiAccount.facade.apiBybit.all
            apiBybit.getSymMemo()
                .then(e=>{
                    tfsRealtime.forEach(tfSec=>{
                        applyTransactionAsyncUpdate<any>(grid.current, e.map(e=>({
                            // @ts-ignore
                            exchange: e.exchange, tfSec, symbol: e.symbols, category: e.category, markets: e.categoryAcc ?? []
                        })), getRowIdSymbols, bufTable)
                    })

                    apiBybit.priceMemo("spot")
                        .then(e=>{
                            tfsRealtime.forEach(tfSec=>{
                                applyTransactionAsyncUpdate<any>(grid.current, Object.values(e).filter(e=>e.turnover24h).map(e=>({
                                    exchange: "bybit", tfSec, symbol: e.symbol, category: "spot",
                                    price: (e.bid1Price || e.lastPrice), v24: DblToStrAnd(+((+e.turnover24h)/1000000),{digitsR:3})//+((+e.turnover24h)/1000000).toFixed(2)
                                })), getRowIdSymbols, bufTable)
                            })
                        })
                    apiBybit.priceMemo("futures")
                        .then(e=>{
                            tfsRealtime.forEach(tfSec=>{
                                applyTransactionAsyncUpdate<any>(grid.current, Object.values(e).filter(e=>e.turnover24h).map(e=>({
                                    exchange: "bybit", tfSec, symbol: e.symbol, category: "futures",
                                    price: (e.bid1Price || e.lastPrice), v24: DblToStrAnd(+((+e.turnover24h)/1000000),{digitsR:3})//+((+e.turnover24h)/1000000).toFixed(2)

                                })), getRowIdSymbols, bufTable)
                            })
                        })

                })


            const apiGateio = ApiAccount.facade.apiGateio.all
            apiGateio.getSymMemo()
                .then(e=>{
                    tfsRealtime.forEach(tfSec=>{
                        applyTransactionAsyncUpdate<any>(grid.current, e.map(e=>({
                            // @ts-ignore
                            exchange: e.exchange, tfSec, symbol: e.symbols, category: e.category, markets: e.categoryAcc ?? []
                        })), getRowIdSymbols, bufTable)
                    })

                    apiGateio.priceMemo("spot")
                        .then(e=>{
                            tfsRealtime.forEach(tfSec=>{
                                applyTransactionAsyncUpdate<any>(grid.current, Object.values(e).map(e=>({
                                    exchange: "gateio", tfSec, symbol: e.currency_pair, category: "spot",
                                    price: +e.last, v24: DblToStrAnd(+((+e.quote_volume)/1000000),{digitsR:3})//.toFixed(2)
                                })), getRowIdSymbols, bufTable)
                            })
                        })
                    apiGateio.priceMemo("futures")
                        .then(e=>{
                            tfsRealtime.forEach(tfSec=>{
                                applyTransactionAsyncUpdate<any>(grid.current, Object.values(e).map(e=>({
                                    exchange: "gateio", tfSec, symbol: e.contract, category: "futures",
                                    price: +e.last, v24: DblToStrAnd(+((+e.volume_24h_quote)/1000000),{digitsR:3})//.toFixed(2)
                                })), getRowIdSymbols, bufTable)
                            })
                        })
                })

            ApiAccount.facade.apiTinkoff.all.getSymMemo().then(e =>{
                console.log("apiTinkoff")
                tfsRealtime.forEach(tfSec=>{
                    applyTransactionAsyncUpdate<any>(grid.current, e.map(e=>({
                        // @ts-ignore
                        exchange: e.exchange, tfSec, symbol: e.symbols, quoteAsset: e.quoteAsset, category: e.category, markets: !e.shortEnabledFlag ? ['BUY'] : []
                    })), getRowIdSymbols, bufTable)
                })

            })
        }
    },[rowData])

    const fun = useCallback((e: typeof datum)=>{
        const r = Object.entries(datum.show)
        const r2 = r.map(e=>[...e, tSymbolsRow[e[0]]])
        const api = grid?.current?.api
        if (api) {
            const col = Object.fromEntries((api.getColumns() ?? []).map(e=>[e.getColId(),e]))
            const arr = r2.filter(e=>col[e[0]])
            api.setColumnsVisible(arr.filter(e=>e[1]).map(e=>e[2] ?? e[0]), true)
            api.setColumnsVisible(arr.filter(e=>!e[1]).map(e=>e[2] ?? e[0]), false)
        }
    },[])

    updateBy(datum, (e: typeof datum)=> {
        let arrNew = funcFilter(dataRowSymbols.AllSym, datum)
        fun(e)
        setRows(arrNew)
    })

    updateBy(select, ()=> {
        let arr: any[] = []
        if (!grid.current) return
        grid.current.api.forEachNode(e=>{
            if (select[e.data!.id!]) arr.push({...e.data, select: true})
            else if (e.data?.select) arr.push({...e.data, select: false})
        })
        // @ts-ignore
        grid.current?.api.applyTransactionAsync({update: arr})
    })

    const loadFilters = async ()=> {
        const apiDB = ApiData.facade.facadeDB.all
        const filters = await apiDB.getFiltersMemo()
        const names = Object.keys(filters)
        names.forEach(e=>{
                datum.show[e] ??= false
                datum.obj[e] ??= Object.fromEntries(filters[e].filter(e=> e != 'symbols').map(e=>[e, true]) )
        })
        /// на случай если колонка есть в программе, но, отсутствует в кэше
        Object.keys(filter.show).forEach(e=>{
            datum.show[e] ??= filter.show[e]
        })

        /// добавление новых колонок
        const keys = new Set(columnsSymbols.map(e=>e.field))
        const length = columnsSymbols.length
        names.forEach(e=>{
            // если такого элемента не было в таблице, то добавляем такой столбец
            if (!keys.has(e)) {
                columnsSymbols.push({field: e}) //, sortable: true, filter: true})
                setColumnsSymbols(columnsSymbols)
            }

        })

        if (length != columnsSymbols.length && grid?.current) {
            grid?.current?.api.setGridOption("columnDefs", columnsSymbols)
            // grid?.current?.api.setColumnDefs(columnsSymbols)
        }
    }

    const loaSymbols = async ()=> {
        const apiDB = ApiData.facade.facadeDB.all
        const symbolsAll  = await apiDB.find({keyMap:["close"]}) satisfies typeof tSymbolsRow[]

        const exchange = await apiDB.findOther(tSymbolsRow.exchange)
        const category = await apiDB.findOther(tSymbolsRow.category)

        // const tr = await apiDB.find({keyMap:["rate"]}) satisfies typeof tSymbolsRow[]
        // console.log(tr)
        console.log({exchange})
        console.log({category})
        const type = await apiDB.findOther(tSymbolsRow.type)
        const tfSec = await apiDB.findOther(tSymbolsRow.tfSec)


        const getId = (e: any) => `${e.symbol}_${e.exchange}`
        const map = {} as {[k: string]: Set<string>}
        symbolsAll.forEach(e=> {
            const a = map[getId(e)] ??= new Set()
            a.add(e.category)
        })
        console.log(symbolsAll);

        dataRowSymbols.AllSym = new Array(symbolsAll.length)
        dataRowSymbols.exchange = exchange
        dataRowSymbols.category = category
        dataRowSymbols.type = type
        dataRowSymbols.tfSec = tfSec

        fun(datum)

        symbolsAll.forEach((e,i)=>{
            dataRowSymbols.AllSym[i] = {...e, acc: [...(map[getId(e)]??[])], ...(bufTable[getId(e)]??{}), start: timeLocalToStr_yyyymmdd(new Date(e.start * 1000)), bars: String(e.bars)}
        })

        let arrNew = funcFilter(dataRowSymbols.AllSym, datum)

        renderBy(dataRowSymbols)
        setRows(arrNew)

    }


    const {symbol, start,...dataObj} = datum.obj

    const OtherEl = useCallback(()=><OtherElement
        gridData =
            {
                Object.entries(dataObj).map(e => ({name: e[0], info: Object.keys(e[1]).join(" "), info2: Object.keys(e[1]).join(" ")}))
            }
        onGridReady={(e) => {
        }}
        columnDefs={[
            {
                field: "name",
                width: 100,
                wrapText: true,
                cellStyle: ({...StyleGridDefault, 'paddingTop': '5px'}),
                cellRenderer: (e: { data: { name: string } }) => {
                    const t = <div className={"msTradeAlt"}>hi</div>
                    return <div className={"msTradeAlt"}>{e.data.name}</div>
                },
            },
            {
                field: "info",
                cellRenderer: (e: { data: { name: string } }) => {
                    const t = <div className={"msTradeAlt"}>hi</div>
                    return <div style={{display: "flex", flexWrap: "wrap"}}
                                onClick={c => {
                                    console.log(e);
                                }}
                    >
                        {
                            Object.entries(dataObj[e.data.name] ?? {}).map(([k, v]) => {
                                return <div
                                    className={v ? 'msTradeAlt msTradeActive' : 'msTradeAlt'}
                                    key={k}
                                    onClick={(r) => {
                                        dataObj[e.data.name][k] = !v
                                        renderBy(datum)
                                    }}
                                >{k}</div>
                            })
                        }
                    </div>
                },

                cellStyle: ({...StyleGridDefault, 'paddingTop': '5px'}),
                autoHeight: true,
                wrapText: true,
            }
        ]}
    />,[])

    const ButtonOther = useCallback(() => {
        return <ButtonOutClick key={"tt"}
                               keySave={"..."}
                               button={(s) =>
                             <div
                                 className={s ? 'msTradeAlt msTradeActive' : 'msTradeAlt'}
                                 key={"..."}
                             >...</div>
                         }
        >
            <OtherEl/>
        </ButtonOutClick>
    }, [])



    const buttonSelect = <BSelectSymbols objRows={select}/>

    const funcSelect = () => <LoadSelectRD
        getSelectRow = {()=> (Object.values(select)) as selectSymbols[]}
        load = {(e)=>{
            const add = e.map((e)=>{
                const id = getRowIdSymbols(e)
                return select[id] = {...grid.current?.api.getRowNode(id)?.data, select: true}
            })
            // @ts-ignore
            grid.current?.api.applyTransactionAsync({update: add})
            renderBy(select)
        }}
        loadOnly = {(e)=>{
            for (let k in select) {
                delete select[k]
            }
            e.forEach((e)=> select[getRowIdSymbols(e)] = e)
            renderBy(select)

            // const oldSelect = {...select}
            // const add = e.map((e)=>{
            //     const id = getRowIdSymbols(e)
            //     if (oldSelect[id]) delete oldSelect[id]
            //     return select[id] = {...grid.current?.api.getRowNode(id)?.data, select: true}
            // })
            // Object.keys(oldSelect).forEach(e=>delete select[e])
            // const unSelects = Object.entries(oldSelect).map(([id,v])=>({id, ...grid.current?.api.getRowNode(id)?.data, select: false}))
            // console.log({add, unSelects, select})
            // // @ts-ignore
            // grid.current?.api.applyTransactionAsync({update: [...add,...unSelects]})
            // renderBy(select)
        }}
    />

    return <div className={"maxSize"} style={{...StyleOtherColum}} >
        <div className={"maxSize"} style={{height: "auto", width: "100%"}}>
            <SelectFilter/>
            <div style={{display: "flex"}}>
                <ButtonOther/>
                <div
                    className={'msTradeAlt msTradeActive'}
                    key={"reff"}
                    onClick={async () => {
                        await ApiData.facade.facadeDB.all.refreshSymbols()
                        loaSymbols()

                    }}
                >ref
                </div>
                {buttonSelect}
            </div>
        </div>
        <div className={"maxSize"}>
            <AgGridReact
                className="ag-theme-alpine-dark ag-theme-alpine2"
                suppressCellFocus={true}
                onGridReady = {(a)=>{
                    grid.current = a
                    // a.api.set
                    a.api.sizeColumnsToFit()
                }}
                headerHeight = {30}
                onColumnVisible={(e)=>{
                    if (e.source == "api") {
                        grid.current?.api.sizeColumnsToFit()
                    } else {
                        const t = e.column?.getColId()
                        if (t) {
                            let r = Object.entries(tSymbolsRow).filter(([k,v]) => v == t)[0]
                            if (r) datum.show[r[0]] = e.visible ?? false
                        }
                        grid.current?.api.sizeColumnsToFit()
                        renderBy(datum.show)
                    }
                }}
                rowHeight = {26}
                autoSizePadding = {1}
                rowData = {rowData}
                columnDefs = {columnsSymbols}
                getRowId={(e)=>getRowIdSymbols(e.data)}
                // rowMultiSelectWithClick={true}
                rowSelection = {`multiple`}
                defaultColDef = {{
                    headerClass: ()=> ("gridTable-header"),
                    resizable: true,
                    cellStyle: {textAlign: "center"},
                    sortable: true,
                    filter: true
                }}
                onCellMouseDown={(e)=>{
                    // @ts-ignore
                    if (e.event.button == 2) {
                        mouseAdd.map.set("sym",[
                            // {name: "test222", func: ()=><LoadSelect2
                            //         getSelectRow = {()=>(grid.current?.api.getSelectedRows() ?? []) as selectSymbols[]}
                            //         api = {(a)=>{
                            //             console.log("load ", a)
                            //             // a.load({})
                            //         }}
                            //         load = {(e)=>{
                            //
                            //         }}
                            //     />, },
                            {name: "select" , next: ()=> [
                                    {name: "add ", onClick: async ()=> {
                                            const arr = e.api.getSelectedRows()
                                            arr.forEach(e=> select[getRowIdSymbols(e)] = e)
                                            // @ts-ignore
                                            grid.current?.api.applyTransactionAsync({update: arr.map(e=>({id: getRowIdSymbols(e),...e, select: true}))})

                                            renderBy(select)
                                        }},
                                    {name: "del" + grid.current?.api.getSelectedRows().length ?? 0, onClick: async ()=> {
                                            const arr = e.api.getSelectedRows()
                                            arr.forEach(e=> {
                                                delete select[getRowIdSymbols(e)]
                                            })
                                            // @ts-ignore
                                            e.api.applyTransactionAsync({update: arr.map(e=>({id: getRowIdSymbols(e), ...e, select: false}))})
                                            renderBy(select)
                                        }},
                                    {name: "del all", onClick: async ()=> {
                                            const arr = Object.entries(select).map(([k,v])=>({id: k, ...v, select: false}))
                                            for (let k in select) delete select[k]
                                            e.api.applyTransactionAsync({update: arr})

                                            renderBy(select)
                                        }},
                                    {name: "select All", onClick: async ()=> {
                                            e.api.selectAll()
                                        }},
                                    {name: "save/load", func: funcSelect},
                                ]},
                            {name: "loads" , onClick: async ()=> {
                                    if (grid.current?.api.getSelectedRows) {
                                        const rows = grid.current.api.getSelectedRows()
                                        await loadDataSymbols(selectRows(...rows), settingLoadSymbols)
                                            .catch(e=> {
                                                throw typeof e == "object" ? JSON.stringify(e) : e
                                            })
                                    }
                                }},
                            {name: "loadsAbs" , onClick: async ()=> {
                                    if (grid.current?.api.getSelectedRows) {
                                        const rows = grid.current.api.getSelectedRows()
                                        await loadDataSymbols(selectRows(...rows), settingLoadSymbols, ["close"], false)
                                            .catch(e=> {
                                                throw typeof e == "object" ? JSON.stringify(e) : e
                                            })
                                    }
                                }},
                            {name: "loadsRate" , onClick: async ()=> {
                                    if (grid.current?.api.getSelectedRows) {
                                        const rows = grid.current.api.getSelectedRows()
                                        await loadDataSymbols(selectRows(...rows), settingLoadSymbols, ["rate"])
                                            .catch(e=> {
                                                throw typeof e == "object" ? JSON.stringify(e) : e
                                            })
                                    }
                                }},
                        ])
                    }
                }}
            >
            </AgGridReact>
        </div>
    </div>
}

type tt1 =  {[k:string]:number|string}


function OtherElement<T extends tt1>({gridData, onGridReady, columnDefs, defaultColDef}: {
    gridData: T[],
    onGridReady?: (e:GridReadyEvent<T>) => void,
    columnDefs?: (ColDef<T> | ColGroupDef<T>)[] | null,
    defaultColDef?: ColDef<T>;
})
{
    const gridApi  = useRef<GridApi<any>|null>(null)

    useEffect(()=>{
        console.log("OtherElement")
        gridApi.current?.sizeColumnsToFit();
    })

    const Table = useCallback(()=><AgGridReact
        onGridReady={(e)=> {
            // gridApi(e.api)
                gridApi.current = e.api as GridApi<any>
            gridApi.current?.sizeColumnsToFit();
            onGridReady?.(e)
        }}
        className= "ag-theme-alpine-dark ag-theme-alpine2 fon"
        onGridSizeChanged={()=>{
            console.log("size")
        }}
        rowData = {gridData}
        headerHeight = {35}
        suppressCellFocus = {true}
        defaultColDef = {defaultColDef ?? {
            headerClass: ()=> ("gridTable-header"),
            resizable: true,
            cellClass: 'cell-wrap-text',
            cellStyle: ({...StyleGridDefault}),
            // sortable: true,
            // filter: true
        }}

        columnDefs={columnDefs}
    >
    </AgGridReact>,[])
    const wait = waitRun().refreshAsync2

    const RD = useCallback(()=><DivRnd keyForSave={"tt1"}
                                       size={{height: 200, width: 200}}
                                       className={"fon border fonLight"}
                                       moveOnlyHeader={true}
                                       onUpdate={()=>{
                                           console.log("ewew")
                                           wait(10, () => {
                                                   gridApi.current?.sizeColumnsToFit?.()
                                               }
                                           )
                                       }}
    >
        <Table/>
    </DivRnd>,[])

    return <div className={"maxSize"}
                // style={{background: "#131821"}}
        >
        <RD/>
    </div>
}
