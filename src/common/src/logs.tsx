import {AgGridReact} from "ag-grid-react";
import React, {useCallback, useEffect, useRef} from "react";
import {copyToClipboard, timeLocalToStr_hhmmss, UnArray} from "wenay-common";
import {renderBy, updateBy} from "../updateBy";
import {ColDef, ColGroupDef, GridReadyEvent} from "ag-grid-community";
import {ParametersReact} from "./Parameters2";
import {staticGetAdd} from "./mapMemory";
import {mouseMenuApi} from "./menu/menuMouse";

type tLogsInput<T extends object> = T & {id : string, var?: number, time: Date, txt: string}
type tLogs<T extends object = {}> = tLogsInput<T> & {num: number}
const cashLogs = new Map<string, tLogs<any>[]>()

const datumConst = {
    map: cashLogs,
}
const datumMiniConst = {
    last: [] as tLogs[]
}

const settingLogs = {
    // минимальная важность
    minVarLogs: 0,
    minVarMessage: 0
}

type tColum2<TData extends any = any> = (ColDef<TData> | ColGroupDef<TData>)
// varMin - минимальная важность
export function getLogsApi<T extends object = {}>(setting: {limit?: number, limitPer: number, varMin?: number}) {
    function addToArr<T>(arr: T[], data: T, limit: number){
        arr.unshift(data)
        if (arr.length > limit) arr.length = limit
    }
    let num = 0
    return {
        addLogs(a: tLogsInput<T>){
            addToArr(datumMiniConst.last, {...a, num: num++}, 50)
            addToArr(datumConst.map.get(a.id) ?? datumConst.map.set(a.id,[]).get(a.id)!, {...a, num: num++}, setting.limitPer)
            renderBy(datumConst)
            renderBy(datumMiniConst)
        }
    }
}
export const logsApi = getLogsApi<{}>({limitPer: 500})

function InputSettingLogs({}:{update?: number}) {
    const datum = staticGetAdd("settingLogs",settingLogs)
    return <ParametersReact
        params={{
            fd1: {name:"мин. важность для оповещения", range: {min: 0 , max: 25, step: 1}, value: datum.minVarMessage},
            fd2: {name:"мин. важность для таблицы логов", range: {min: 0 , max: 25, step: 1}, value: datum.minVarLogs},
        }}
        onChange = {(e)=>{
            datum.minVarMessage = e.fd1.value
            datum.minVarLogs = e.fd2.value
            renderBy(datum)
        }}/>
}

export function PageLogs({update}: {update?: number}) {
    const datumFull = datumConst
    const rowData = [...datumFull.map.values()].flatMap(e=>e.map(e=>({
        ...e,
        time: (e.time)
    })))
    type el = UnArray<typeof rowData >
    const datum = datumMiniConst
    const setting = staticGetAdd("settingLogs",settingLogs)
    const apiGrid = useRef<GridReadyEvent<el>|null>(null)
    useEffect(()=> {
        apiGrid.current?.api.sizeColumnsToFit()
    },[update])
    updateBy(setting, ()=>{
        if (setting.minVarLogs) {
            apiGrid.current?.api.setFilterModel({
                var: {
                    filterType: 'number',
                    type: 'greaterThanOrEqual',
                    filter: setting.minVarLogs
                }})
        } else {
            apiGrid.current?.api.destroyFilter("var")
        }
    })

    updateBy(datum, ()=>{
        const data = datum.last[0]
        console.log({data})
        if (data) { // data.time timeLocalToStr_yyyymmdd_hhmmss_ms
            apiGrid.current?.api.applyTransactionAsync({
                add: [
                    {
                        ...data,
                        time: data.time
                    }
                ]
            })
        }
    })

    const Main = useCallback(()=>{
        const columns = [
            {
                field: "time",
                sort: "desc",
                width: 50,
                valueFormatter: (e)=>e.value.time ? timeLocalToStr_hhmmss(e.value.time) : e.value.time
            },
            {
                field: "id",
                width: 20,
            },
            {
                field: "var",
                width: 50,
            },
            {
                field: "type1",
                width: 50,
            },
            {
                field: "type2",
                width: 50,
            },
            {
                field: "type3",
                width: 50,
            },
            {
                field: "txt",
                wrapText: true,
                autoHeight: true,
                width: 350
            },
            {
                field: "address",
                width: 150,
            },
        ] satisfies tColum2<el>[]
        return <div className={"maxSize"}>
            <AgGridReact
                className = "ag-theme-alpine-dark ag-theme-alpine2" // ag-theme-alpine-dark3
                suppressCellFocus = {true}
                onGridReady = {(a)=>{
                    apiGrid.current = a  //as GridReadyEvent<tColum>
                    apiGrid.current.api.sizeColumnsToFit()
                    if (setting.minVarLogs) {
                        apiGrid.current.api.setFilterModel({
                            var: {
                                filterType: 'number',
                                type: 'greaterThanOrEqual',
                                filter: setting.minVarLogs
                            }})
                    }
                }}
                onSortChanged={(e)=>{

                }}
                defaultColDef = {{
                    headerClass: ()=> ("gridTable-header"),
                    resizable: true,
                    cellStyle: {textAlign: "center"},
                    sortable: true,
                    filter: true,
                    wrapText: true,
                }}
                headerHeight = {30}
                rowHeight = {26}
                autoSizePadding = {1}
                rowData = {rowData}
                columnDefs = {columns}
                onCellMouseDown = {(e)=>{
                    // @ts-ignore
                    if (e.event?.button == 2) {
                        // copyToClipboard(e.value)
                        mouseMenuApi.map.set("sym",[
                            {
                                name: "copy", onClick: ()=> {copyToClipboard(e.value)}
                            }
                        ])
                    }
                }}
            >

            </AgGridReact>
        </div>
    },[true])

    return <Main/>
}

function Fff({logs}: {logs: tLogs}) {
    let red = (logs.var ?? 0) * 10
    if (red > 255) red = 255
    return <div className={"testAnime"}
                style={{ width:"200px", color:"rgb(255,255,255)", height:"auto", marginTop:"10px", borderRight:"5px solid #5D9FFA", background: `rgb(${red},73,35)`}}
        //key={id}
    >
        <p style = {{textAlign:"center", fontSize: "10px", marginBottom:"1px"}}>{"оповещение"}</p>
        <hr style = {{
            backgroundImage: "linear-gradient(to right, transparent, rgba(255, 255, 255, 1), transparent)",
            border: 0,
            height: "1px",
            margin: "0 0 0 0",
            boxSizing: "content-box",
            display: "block"
        }}/>
        <div style={{textAlign:"right", marginRight:"10px", height:"auto", overflowWrap: "break-word", textOverflow: "ellipsis"}}>{typeof logs.txt == "object" ? JSON.stringify(logs.txt) : logs.txt}</div>
        <p style={{float:"inline-end", textAlign:"right",  marginRight:"10px"}}>{(new Date()).toLocaleDateString()}</p>
    </div>
}

const tt: {[key: string]: React.ReactElement} = {}
let r = 0
export function MessageEventLogs({zIndex} :{zIndex?: number}) {
    let max = 10

    const setting = staticGetAdd("settingLogs",settingLogs)
    updateBy(tt)
    updateBy(datumMiniConst, ()=>{
        const last = datumMiniConst.last[0]
        if (setting.minVarMessage && (!last.var || last.var < setting.minVarMessage)) return;

        let key = String(r++)
        tt[key] = <div className={"example-exit"} key = {key}>
            <Fff logs = {last} />
        </div>
        setTimeout(()=>{
            if (tt[key]) {
                delete tt[key];
                if (Object.values(tt).length < max) renderBy(tt)
            }
        }, 8000)
        renderBy(tt)
    })
    return <div style={{maxHeight: "99%", position: "absolute", right: "20px", zIndex}}>
        {[...Object.values(tt)].reverse().slice(0,10)}
    </div>
}

type ty = {name: string, key: string, page: (a?: any) => React.JSX.Element | null}

const defPageBase = {
    keyPage: "PageLogs"
}

const pages   = [
    {name: "message", key: "PageLogs", page: PageLogs},
    {name: "setting", key: "InputSettingLogs", page: InputSettingLogs},
] satisfies ty[]

const map = Object.fromEntries(pages.map(e=>[e.key,e.page]))
export function PageLogs2({update}: {update?: number}) {
    const datum = defPageBase
    updateBy(datum)

    const Page = map[datum.keyPage]
    return <div className={"maxSize"} style={{display: "flex", flexDirection: "column"}}>
        <div style={{width: "100%"}}>
            <div style={{display: "flex", justifyContent: "center"}}>
                {
                    pages.map((e,i) => (
                        <div key = {i}
                             onClick = {(z)=> {
                                 datum.keyPage = e.key
                                 renderBy(datum)
                             }}
                             className = {datum.keyPage == e.key ? "msTradeAlt msTradeActive" : "msTradeAlt"}>{e.name}</div>
                    ))
                }
            </div>
        </div>
        <div className={"maxSize"}>
            {Page && <Page key={datum.keyPage} update={update}/>}
        </div>

    </div>
}