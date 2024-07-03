// import {DivRnd} from "./commonNew/RNDFunc";
// import React, {useCallback, useEffect, useRef, useState} from "react";
// import {ApiData} from "../../utils/sis";
// import {AgGridReact} from "ag-grid-react";
// import {StyleGridDefault} from "./common/styleGrid";
// import {renderBy, updateBy} from "../updateBy";
// import {Button, ButtonOutClick} from "./commonNew/commonFuncReact";
// import {mouseAdd} from "./other/mouse";
// import {InputFileModal, InputPageModal} from "./other/input";
// import {logsApi} from "./other/logs";
// import {Time, UnAwaited} from "wenay-common";
// import {ApiSave} from "../../utils/apiFacade";
// import {CMiniGraph} from "../../canvas2d/miniGraph";
// import {ColDef, ColGroupDef, GridApi} from "ag-grid-community";
//
// type infoState = UnAwaited<ReturnType<typeof ApiData.facade.facadeTester.all.testerTest>>["info"]
// type tBaseRow = {
//     name: string,
//     time: Date,
//     chart?: any,
//     top?: number,
//     comment?: string
// }
// export type tHistoryTrade = tBaseRow & {
//     info: infoState
// }
// export type tRow = tBaseRow & {
//     strategy: string,
//     symbols: number,
//     time: Date,
//     data: number[]
//     score: number,
//     info: infoState
//     // info: infoState
// }
// const historyTrades = {
//     // arr: [] as tHistoryTrade[]
//     arr: new Map<string, tHistoryTrade>()
// }
// const saveTrades = {
//     // arr: [] as tHistoryTrade[]
//     arr: new Map<string, tHistoryTrade>()
// }
// const saveTradesNet = {
//     // arr: [] as tHistoryTrade[]
//     arr: new Map<string, tHistoryTrade>()
// }
// const getKey = (e: tHistoryTrade) => JSON.stringify(e.time)
// export const SaveDataTest = (result: tHistoryTrade) => {
//     console.log("SaveTest")
//     historyTrades.arr.set(getKey(result), result)
//     renderBy(historyTrades)
// }
//
// function inputModal({setModalJSX, func, name, txt}: {
//     txt?: string,
//     name?: string,
//     setModalJSX: React.Dispatch<React.SetStateAction<React.JSX.Element | null>>,
//     func: (txt: string) => void
// }) {
//     setModalJSX(<InputPageModal callback={txt => {
//         func(txt)
//         setModalJSX(null)
//     }} outClick={() => setModalJSX(null)} name={name ?? "name"} txt={txt}/>)
// }
//
// function confirmModal({setModalJSX, func}: {
//     setModalJSX: React.Dispatch<React.SetStateAction<React.JSX.Element | null>>,
//     func: () => any
// }) {
//     setModalJSX(<InputPageModal callback={txt => {
//         if (txt == "111") func()
//         setModalJSX(null)
//     }} outClick={() => setModalJSX(null)} name={"password 111"}/>)
// }
//
// export const saveToFile = (result: tHistoryTrade) => {
//     const x = JSON.stringify(result)
//     let file = new Blob([x], {type: '.txt'});
//     let a = document.createElement("a"),
//         url = URL.createObjectURL(file);
//     a.href = url;
//     a.download = result.name;
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(function() {
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(url);
//     }, 0);
// }
// export const CopyToClipboard = async(result: tHistoryTrade) => {
//     const x = JSON.stringify(result)
//     await navigator.clipboard.writeText(x)
// }
// export const SaveToTable2 = async (result: tHistoryTrade) => {
//     await ApiData.facade.saveLoadPresets.all.setElMap({keyEl: getKey(result), valueEl: JSON.stringify(result)})
//     console.log({result})
//     saveTrades.arr.set(getKey(result), result)
//     renderBy(saveTrades)
// }
// export const SaveToRemoteAll = (result: tHistoryTrade) => {
//     ApiSave.facade.apiSave.all.strategyTest.setElMap({keyEl: getKey(result), valueEl: JSON.stringify(result)})
//     // saveTrades.arr.set(getKey(result), result)
//     // renderBy(saveTrades)
// }
// export const DeleteElTable2 = (result: tHistoryTrade) => {
//     ApiData.facade.saveLoadPresets.all.delEl({keyEl: getKey(result)})
//     saveTrades.arr.delete(getKey(result))
//     renderBy(saveTrades)
// }
// export const LoadDataTest = async() => {
//     const all = ApiData.facade.saveLoadPresets.all
//     if (!await all.has()) return
//     const el = await all.get()
//     const obj = JSON.parse(el)
//     for (let k in obj) {
//         obj[k] = JSON.parse(obj[k])
//     }
//     saveTrades.arr = new Map(Object.entries(obj))
//     renderBy(saveTrades)
// }
//
//
// const columnDefs = [
//     {
//         field: "name",
//         width: 150,
//         filter: true
//     },
//     {
//         field: "symbols",
//         width: 100
//     },
//     {
//         field: "time",
//         valueFormatter: (e) => {
//             return Time.timeLocalToStr_yyyymmdd_hhmm(new Date(e.value))
//         },
//         width: 100
//     },
//     {
//         field: "strategy",
//         autoHeight: true,
//         wrapText: true,
//         filter: true
//     },
//     {
//         field: "score",
//         width: 100,
//         valueFormatter: (e)=> e.value.toFixed(2)
//     },
//     {
//         field: "chart",
//         cellStyle: {'paddingLeft': '0px', 'paddingRight': '0px'},
//         minWidth: 300,
//         cellRenderer: (e: any) => <div className={"maxSize"}>
//             <CMiniGraph Focus={false} gradient={{}} result={false} lines={[{
//                 color: "#d2d2d2",
//                 data: e.data.data,
//                 key: "x",
//                 show: true
//             }]}/>
//         </div>,
//     }
// ] as (ColDef<any> | ColGroupDef<any>)[]
//
// export function SelectHistoryRndB(data: Parameters<typeof SelectHistory>[0]) {
//     return <Button button={e => <div className={!e ? "msTradeAlt" : "msTradeAlt msTradeActive"}
//                                      style={{width: "max-content", display: "flex"}}>
//         {"history"}
//     </div>}>
//         {(api) => <DivRnd keyForSave={"tt312"}
//                           size={{height: 600, width: 1000}}
//                           className={"fon border fonLight"} // fon border fonLight
//                           moveOnlyHeader={true}
//                           onCLickClose={api.onClose}
//                           onUpdate={() => {
//                           }}>
//             {(update) => SelectHistory({...data, update})}
//         </DivRnd>
//         }
//     </Button>
// }
//
// // клиент???
// export function SelectTableBRndB2(data: Parameters<typeof TableB>[0]) {
//     return <ButtonOutClick button={e => <div className={!e ? "msTradeAlt" : "msTradeAlt msTradeActive"}
//                                              style={{width: "max-content", display: "flex"}}>
//         {"history"}
//     </div>}>
//         <DivRnd keyForSave={"tt3152"}
//                 size={{height: 600, width: 1000}}
//                 className={"fon border fonLight"} // fon border fonLight
//                 moveOnlyHeader={true}
//                 onUpdate={() => {
//                 }}>
//             {(update) => <TableB loadParams={data.loadParams} loadAndRun={data.loadAndRun} update={update}
//                                  key={"table22"}/>}
//
//         </DivRnd>
//     </ButtonOutClick>
// }
// export function SelectTableBRndB3(data: Parameters<typeof TableC>[0]) {
//     return <ButtonOutClick button={e => <div className={!e ? "msTradeAlt" : "msTradeAlt msTradeActive"}
//                                              style={{width: "max-content", display: "flex"}}>
//         {"remote"}
//     </div>}>
//         <DivRnd keyForSave={"tt3152"}
//                 size={{height: 600, width: 1000}}
//                 className={"fon border fonLight"} // fon border fonLight
//                 moveOnlyHeader={true}
//                 onUpdate={() => {
//                 }}>
//             {(update) => <TableC loadParams={data.loadParams} loadAndRun={data.loadAndRun} update={update}
//                                  key={"table22"}/>}
//
//         </DivRnd>
//     </ButtonOutClick>
// }
//
// export function SelectHistoryRnd(data: Parameters<typeof SelectHistory>[0]) {
//     return <DivRnd keyForSave={"tt1234"}
//                    size={{height: 300, width: 300}}
//                    className={"fon border fonLight"} // fon border fonLight
//                    moveOnlyHeader={true}
//                    limit={{x: {min: 0}, y: {min: 0}}}
//                    onUpdate={() => {
//                    }}>
//         {(update) => SelectHistory({...data, update})}
//     </DivRnd>
// }
// const selectHistoryObj = {
//     pageKey: "table1" as "table1" | "table2" | "table3"
// }
// export function SelectHistory(data: Parameters<typeof TableA>[0]) {
//     const datum = selectHistoryObj
//     const [pageKey, setPageKey] = useState<"table1" | "table2" | "table3">(datum.pageKey)
//     datum.pageKey = pageKey
//     return <div className={"maxSize toSpaceColum"}>
//         <div style={{display: "flex"}}>
//             <div className={"table1" == pageKey ? "msTradeAlt msTradeActive" : "msTradeAlt"}
//                  onClick={() => setPageKey("table1")}>temp
//             </div>
//             <div className={"table2" == pageKey ? "msTradeAlt msTradeActive" : "msTradeAlt"}
//                  onClick={() => setPageKey("table2")}>saved
//             </div>
//             <div className={"table3" == pageKey ? "msTradeAlt msTradeActive" : "msTradeAlt"}
//                  onClick={() => setPageKey("table3")}>remote all
//             </div>
//         </div>
//         <div className={"maxSize"}>
//             {pageKey == "table1" &&
//                 <TableA loadParams={data.loadParams} loadAndRun={data.loadAndRun} update={data.update} key={"table1"}/>}
//             {pageKey == "table2" &&
//                 <TableB loadParams={data.loadParams} loadAndRun={data.loadAndRun} update={data.update} key={"table2"}/>}
//             {pageKey == "table3" &&
//                 <TableC loadParams={data.loadParams} loadAndRun={data.loadAndRun} update={data.update} key={"table2"}/>}
//         </div>
//     </div>
// }
//
// const defaultColDef = {
//     headerClass: () => ("gridTable-header"),
//     resizable: true,
//     sortable: true,
//     cellClass: 'cell-wrap-text',
//     // flex: 1,
//     cellStyle: ({...StyleGridDefault}),
// } satisfies ColDef<any>
//
// export function TableA({update, loadParams, loadAndRun}: {
//     update: number,
//     loadParams: (e: tHistoryTrade) => void,
//     loadAndRun: (e: tHistoryTrade) => void
// }) {
//     const datum = historyTrades
//     console.log("TableA TableA TableA");
//     const getData: () => tRow[] = () => [...datum.arr.values()].map(({info, ...e}, i) =>
//         ({
//             ...e,
//             info,
//             score: info.state.score,
//             symbols: info.setting[0].selectSymbols.length,
//             strategy: info.setting[0].strategyName,
//             dataForLoad: e,
//             data: info.state.miniGraph
//         })) ?? [] //satisfies tRow[]
//     const [rows, setRows] = useState<tRow[]>(getData())
//     const [modalJSX, setModalJSX] = useState<null | React.JSX.Element>(null)
//     const gridApi = useRef<GridApi<any> | null>(null)
//     // useEffect(() => gridApi.current?.sizeColumnsToFit(), [update]);
//     updateBy(datum, () => {
//         console.log("updateBy")
//         setRows(getData())
//     })
//     const getTable = () => <AgGridReact
//         onGridReady={(e) => {
//             gridApi.current = e.api as GridApi<any>
//             // gridApi.current?.sizeColumnsToFit();
//         }}
//         className="ag-theme-alpine-dark ag-theme-alpine2 fon"
//         rowData={rows}
//         headerHeight={30}
//         suppressCellFocus={true}
//         defaultColDef={defaultColDef}
//         onRowClicked={e => {
//         }}
//         columnDefs={[...columnDefs ]}
//
//         onCellMouseDown={(e) => {
//             if (!e.data) return
//             const data = e.data
//             // @ts-ignore
//             if (e.event.button == 2) {
//                 mouseAdd.map.set("only", [
//                     {
//                         name: "load ", onClick: () => loadParams(data)
//                     },
//                     {
//                         name: "run ", onClick: () => loadAndRun(data)
//                     },
//                     {
//                         name: "save ", onClick: async() => {
//                             inputModal({
//                                 setModalJSX,
//                                 name: "name",
//                                 func: txt => {
//                                     SaveToTable2({...data, name: txt})
//                                     logsApi.addLogs({var: 3, txt: "save strategy", time: new Date(), id: "1"})
//                                 }
//                             })
//                         }
//                     },
//                     {
//                         name: "save remote ", onClick: async() => {
//                             inputModal({
//                                 setModalJSX,
//                                 name: "name",
//                                 func: txt => {
//                                     SaveToRemoteAll({...data, name: txt})
//                                     logsApi.addLogs({var: 3, txt: "save strategy", time: new Date(), id: "1"})
//                                 }
//                             })
//                         }
//                     },
//                     {
//                         name: "delete ", onClick: async() => {
//                             datum.arr.delete(getKey(data))
//                             renderBy(datum)
//                         }
//                     },
//                 ])
//             }
//         }}
//     >
//     </AgGridReact>
//     const Table = useCallback(getTable, [rows])
//     return <div className={"maxSize"}>
//         {modalJSX}
//         <Table/>
//     </div>
// }
//
// // таблица сохраненных результатов теста
// export function TableB({update, loadParams, loadAndRun}: {
//     update: number,
//     loadParams: (e: tHistoryTrade) => void, loadAndRun: (e: tHistoryTrade) => void
// }) {
//     const datum = saveTrades
//     // console.log([...datum.arr.values()]);
//     const getData: () => tRow[] = () => [...datum.arr.values()].map(({info, ...e}, i, ar) => {
//             return ({
//                 ...e,
//                 score: info.state.score,
//                 info,
//                 symbols: info.setting[0].selectSymbols.length,
//                 strategy: info.setting[0].strategyName,
//                 dataForLoad: e,
//                 data: info.state.miniGraph
//             })
//         }
//     ) ?? []
//     const [rows, setRows] = useState<tRow[]>(getData())
//     const gridApi = useRef<GridApi<any> | null>(null)
//     // useEffect(() => gridApi.current?.sizeColumnsToFit(), [update]);
//     const [modalJSX, setModalJSX] = useState<null | React.JSX.Element>(null)
//     useEffect(() => {
//         if (saveTrades.arr.size == 0) {
//             LoadDataTest()
//         }
//     }, [])
//     updateBy(datum, () => {
//         console.log("updateBy")
//         setRows(getData())
//     })
//     const getTable = () => <AgGridReact
//         onGridReady={(e) => {
//             gridApi.current = e.api as GridApi<any>
//             // gridApi.current?.sizeColumnsToFit();
//         }}
//         className="ag-theme-alpine-dark ag-theme-alpine2 fon"
//         rowData={rows}
//         headerHeight={30}
//         rowHeight={40}
//         suppressCellFocus={true}
//         defaultColDef={defaultColDef}
//         columnDefs={[...columnDefs,
//             {
//                 field: "comment",
//                 onCellClicked: (e)=>{
//                     inputModal({
//                         setModalJSX,
//                         name: "comment",
//                         txt: e.data?.comment ?? "",
//                         func: async(txt) => {
//                             await SaveToTable2({...e.data!, comment: txt})
//                             logsApi.addLogs({var: 3, txt: "save comment", time: new Date(), id: "1"})
//                         }
//                     })
//                 },
//                 cellStyle: {"lineHeight": "20px"},
//                 width: 350,
//                 autoHeight: true,
//                 wrapText: true,
//                 filter: true
//             },
//         ]}
//
//         onCellMouseDown={(e) => {
//             if (!e.data) return;
//             const data = e.data
//             // @ts-ignore
//             if (e.event.button == 2) {
//                 mouseAdd.map.set("only", [
//                     {
//                         name: "load ", onClick: () => loadParams(data)
//                     },
//                     {
//                         name: "run ", onClick: () => loadAndRun(data)
//                     },
//                     {
//                         name: "copy", onClick: () => CopyToClipboard(data)
//                     },
//                     {
//                         name: "save to file ", onClick: () => saveToFile(data)
//                     },
//                     {
//                         name: "save remote ", onClick: async() => {
//                             SaveToRemoteAll({...data})
//                             logsApi.addLogs({var: 3, txt: "save strategy", time: new Date(), id: "1"})
//                         }
//                     },
//                     {
//                         name: "delete ", onClick: async() => {
//                             DeleteElTable2(data)
//                             renderBy(datum)
//                         }
//                     },
//                     {
//                         name: "rename ", onClick: async() => {
//                             inputModal({
//                                 setModalJSX,
//                                 name: "name",
//                                 txt: data.name ?? '',
//                                 func: txt => {
//                                     SaveToTable2({...data, name: txt})
//                                     logsApi.addLogs({var: 3, txt: "save strategy", time: new Date(), id: "1"})
//                                 }
//                             })
//                         }
//                     },
//                 ])
//             }
//         }}
//     >
//     </AgGridReact>
//     const Table = useCallback(getTable, [rows])
//     return <div className={"maxSize toSpaceColum"}>
//         {modalJSX}
//         <div style={{display: "flex"}}>
//             <div className={"msTradeActive msTradeAlt"} onClick={() => {
//                 LoadDataTest()
//             }}>reload
//             </div>
//             <div className={"msTradeActive msTradeAlt"} onClick={async() => {
//                 const text = await navigator.clipboard.readText();
//                 if (!text) {
//                     logsApi.addLogs({var: 13, txt: 'no clipboard content', time: new Date(), id: "1"})
//                 }
//                 try {
//                     const data = JSON.parse(text)
//                     SaveToTable2(data)
//                     logsApi.addLogs({var: 3, txt: "save strategy", time: new Date(), id: "1"})
//                 } catch (e) {
//                     logsApi.addLogs({var: 13, txt: 'clipboard content incorrect', time: new Date(), id: "1"})
//                 }
//             }}>paste from clipboard
//             </div>
//             <div className={"msTradeActive msTradeAlt"} onClick={() => {
//                 setModalJSX(<InputFileModal callback={file => {
//                     if (file) {
//                         let fileReader = new FileReader();
//                         fileReader.onload = (e) => {
//                             const text = (fileReader.result as string);
//                             if (!text) {
//                                 logsApi.addLogs({var: 13, txt: 'no clipboard content', time: new Date(), id: "1"})
//                             }
//                             try {
//                                 const data = JSON.parse(text)
//                                 SaveToTable2(data)
//                                 logsApi.addLogs({var: 3, txt: "save strategy", time: new Date(), id: "1"})
//                             } catch (e) {
//                                 logsApi.addLogs({
//                                     var: 13,
//                                     txt: 'clipboard content incorrect',
//                                     time: new Date(),
//                                     id: "1"
//                                 })
//                             }
//                             setModalJSX(null)
//                         }
//                         fileReader.readAsText(file);
//                     }
//                     // else setModalJSX(null)
//                 }} outClick={() => setModalJSX(null)} name={"name"}/>)
//             }}>load from file
//             </div>
//         </div>
//         <Table/>
//     </div>
// }
//
// export const LoadDataNet = async() => {
//     ///
//     const all = ApiSave.facade.apiSave.all
//     const status = await all.status()
//     console.log(status)
//     const obj = JSON.parse(await all.strategyTest.get())
//     console.log(obj);
//     // if (!await all.has()) return
//     // const el = await all.get()
//     // const obj = JSON.parse(el)
//     for (let k in obj) {
//         obj[k] = JSON.parse(obj[k])
//     }
//     saveTradesNet.arr = new Map(Object.entries(obj))
//     renderBy(saveTradesNet)
// }
//
// // таблица сохраненных результатов теста
// export function TableC({update, loadParams, loadAndRun}: {
//     update: number,
//     loadParams: (e: tHistoryTrade) => void,
//     loadAndRun: (e: tHistoryTrade) => void
// }) {
//     const apiSave = ApiSave.facade.apiSave.all
//     const datum = saveTradesNet
//     // console.log([...datum.arr.values()]);
//     const getData: () => tRow[] = () => [...datum.arr.values()].map(({info, ...e}, i, ar) => {
//             return ({
//                 ...e,
//                 score: info.state.score,
//                 info,
//                 symbols: info.setting[0].selectSymbols.length,
//                 strategy: info.setting[0].strategyName,
//                 dataForLoad: e,
//                 data: info.state.miniGraph
//             })
//         }
//     ) ?? []
//     const [rows, setRows] = useState<tRow[]>(getData())
//     const gridApi = useRef<GridApi<any> | null>(null)
//     // useEffect(() => gridApi.current?.sizeColumnsToFit(), [update]);
//     const [modalJSX, setModalJSX] = useState<null | React.JSX.Element>(null)
//     useEffect(() => {
//         if (saveTradesNet.arr.size == 0) {
//             LoadDataNet()
//         }
//     }, [true])
//     updateBy(datum, () => {
//         console.log("updateBy")
//         setRows(getData())
//     })
//     const getTable = () => <AgGridReact
//         onGridReady={(e) => {
//             gridApi.current = e.api as GridApi<any>
//             // gridApi.current?.sizeColumnsToFit();
//             // e.api.autoSizeAllColumns(true)
//         }}
//         className="ag-theme-alpine-dark ag-theme-alpine2 fon"
//         rowData={rows}
//         headerHeight={30}
//         rowHeight={40}
//         suppressCellFocus={true}
//         defaultColDef={defaultColDef}
//         columnDefs={[...columnDefs,
//             {
//                 field: "top",
//                 width: 80,
//                 valueFormatter: (e)=> e.value ? '*' : '',
//                 onCellClicked: (e) => {
//                     if(!e.data) return
//                     const data = e.data
//                     confirmModal({setModalJSX, func: async ()=>{
//                             const obj = {...data, top: e.value ? 0 : 1}
//                             await apiSave.strategyTest.setElMap({
//                                 keyEl: getKey(data),
//                                 valueEl: JSON.stringify(obj)
//                             })
//                             datum.arr.set(getKey(obj), obj)
//                             renderBy(datum)
//                             logsApi.addLogs({var: 3, txt: "save strategy", time: new Date(), id: "1"})
//                         }})
//                 }
//             },
//             {
//                 field: "comment",
//                 onCellClicked: (e)=>{
//                     inputModal({
//                         setModalJSX,
//                         name: "comment",
//                         txt: e.data?.comment ?? "",
//                         func: async(txt) => {
//                             const obj = {...e.data!, comment: txt}
//                             await apiSave.strategyTest.setElMap({
//                                 keyEl: getKey(obj),
//                                 valueEl: JSON.stringify(obj)
//                             })
//                             datum.arr.set(getKey(obj), obj)
//                             renderBy(datum)
//                             logsApi.addLogs({var: 3, txt: "save strategy", time: new Date(), id: "1"})
//                         }
//                     })
//                 },
//                 cellStyle: {"lineHeight": "20px"},
//                 width: 350,
//                 autoHeight: true,
//                 wrapText: true,
//                 filter: true
//             },
//         ]}
//
//         onCellMouseDown={(e) => {
//             if (!e.data) return
//             const data = e.data
//             // @ts-ignore
//             if (e.event.button == 2) {
//                 mouseAdd.map.set("only", [
//                     {
//                         name: "load ", onClick: () => loadParams(data)
//                     },
//                     {
//                         name: "run ", onClick: () => loadAndRun(data)
//                     },
//                     {
//                         name: "copy", onClick: () => CopyToClipboard(data)
//                     },
//                     {
//                         name: "save to file ", onClick: () => saveToFile(data)
//                     },
//                     {
//                         name: "delete ", onClick: () =>
//                             confirmModal({
//                                 setModalJSX,
//                                 func: async() => {
//                                     await apiSave.strategyTest.delEl({keyEl: getKey(data)})
//                                     datum.arr.delete(getKey(data))
//                                     renderBy(datum)
//                                 }
//                             })
//                     },
//                     {
//                         name: "rename ", onClick: async() => {
//                             inputModal({
//                                 setModalJSX,
//                                 txt: data.name ?? '',
//                                 name: "new name",
//                                 func: async(txt) => {
//                                     const obj = {...data, name: txt}
//                                     await apiSave.strategyTest.setElMap({
//                                         keyEl: getKey(data),
//                                         valueEl: JSON.stringify(obj)
//                                     })
//                                     datum.arr.set(getKey(obj), obj)
//                                     renderBy(datum)
//                                     logsApi.addLogs({var: 3, txt: "save strategy", time: new Date(), id: "1"})
//                                 }
//                             })
//                         }
//                     },
//                 ])
//             }
//         }}
//     >
//     </AgGridReact>
//     const Table = useCallback(getTable, [rows])
//     return <div className={"maxSize toSpaceColum"}>
//         {modalJSX}
//         <div style={{display: "flex"}}>
//             <div className={"msTradeActive msTradeAlt"} onClick={() => {
//                 LoadDataNet()
//             }}>reload
//             </div>
//         </div>
//         <Table/>
//     </div>
// }
