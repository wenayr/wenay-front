// import {ApiData, staticGetAdd} from "../../utils/sis";
// import {renderBy, updateBy} from "../updateBy";
// import {StyleOtherColum} from "../components/commonNew/commonFuncReact";
// import {getRowIdSymbols, SelectSymbol, tMinSelectSymbols} from "../components/selectSymbols/selectSymbol";
// import React, {useEffect} from "react";
// import {SelectStrategy, tStrategy} from "../components/SelectStrategy";
// import {selectFilterSymbols} from "../components/selectSymbols/select";
// import {dataGraph} from "../components/graph";
// import type {ArrayUn} from "../../../../serverHistoryLoader/src/common/exchangesCommon/type";
// import {colorGenerator2, Params, rgb, waitRun} from "wenay-common";
// import {UnAwaited} from "wenay-common/lib/Common/commonsServer";
// import {UTCTimestamp} from "lightweight-charts";
// import {ObjectStringToDate} from "../../utils/cash";
// import {SaveDataTest, SelectHistoryRndB} from "../components/selectHistory";
// import {logsApi} from "../components/other/logs";
// import {ApiAccount} from "../../utils/apiFacade";
// import {ParametersReact} from "../components/other/Parameters2";
//
// export type tSymbols = tMinSelectSymbols
//
// type tKey = "symbols" | "strategy" | "setting" | "proba"
// type ty = { name: tKey, key: tKey, page?: (a?: any) => React.JSX.Element | null }
// const pages: ty[] = [
//     {name: "symbols", key: "symbols"},
//     {name: "strategy", key: "strategy"},
//     {name: "setting", key: "setting"},
//     {name: "proba", key: "proba"},
// ]
//
// const defPageBase: {keyPage: tKey} = {keyPage: "symbols"}
//
// const selectStrategy_: {strategy: tStrategy | null} = {strategy: null}
// export const strategyArray: {array: tStrategy[]} = {array: []}
//
// type tr = UnAwaited<ReturnType<typeof ApiData.facade.facadeTester.all.paramsTester>>
//
// const settingStrategy_: {paramsInfo: tr|null, params: tr|null} = {params: null, paramsInfo: null}
// // храним выделенные строки
// const selectSymbols_: {[id: string] :tSymbols} = {}
// export type tApiSelect = {selected: typeof selectSymbols_}
// export function LeftPanel({updateSize, getApi}: { updateSize: number, getApi?: (api: tApiSelect) => void}) {
//     const api = ApiData.facade.facadeTester.all
//     const selectStrategy = staticGetAdd("selectStrategy_", selectStrategy_)
//     const settingStrategy = staticGetAdd("settingStrategy_", settingStrategy_)
//     const selectSymbols = staticGetAdd("selectSymbols_", selectSymbols_)
//     const datum = staticGetAdd("pageLeftMenu", defPageBase)
//     const filter = staticGetAdd("filter",selectFilterSymbols)
//     useEffect(()=> {
//         getApi?.({selected: selectSymbols})
//     }, [true])
//     updateBy(datum)
// // mergeParamValuesToInfos
//
//     const RunTest = async () => {
//         const symbols = [...Object.values(selectSymbols)]
//         console.log({symbols});
//         if (!selectStrategy.strategy) return;
//         const strategy = {name: selectStrategy.strategy.name, simpleParams: Params.GetSimpleParams(selectStrategy.strategy.paramInfo) as Params.SimpleParams}
//         const params = Params.GetSimpleParams(settingStrategy.params!)
//         console.log({params})
//
//         const graph = dataGraph.graphs= [{name: "result", bars: [], color: "#ccb9b9", nameFull: "result"} as ArrayUn<typeof dataGraph.graphs>]
//         const genColor = colorGenerator2()
//         const next = () => {
//             const r  = genColor.next()
//             if (r.done == false) return rgb(...r.value)
//             return null
//         }
//         const addGraph = ({name, nameFull, symbolsInfo, bufferName, show}: {name: string, show?:boolean, nameFull?: string, symbolsInfo?: tSymbols, bufferName?: string, commonBuffer?: string}) => ({
//             name, bars: [],
//             color: next() ?? "#ccb9b9",
//             show: show,
//             nameFull: nameFull ?? name,
//             full: {symbolsInfo: symbolsInfo, buffer: bufferName}
//         }) as ArrayUn<typeof dataGraph.graphs>
//         const arrGraph: ReturnType<typeof addGraph>[] = []
//         dataGraph.graphs = arrGraph
//         // type tt = Parameters<typeof all.testerTest>[]
//         let t = 0
//         // renderBy(dataGraph)
//         const tr = waitRun()
//
//         // const finish = () => {
//         //     if (!arrGraph[0].bars.length) return
//         //     const arr = arrGraph[0].bars
//         //     const data: typeof arr = []
//         //     const step = Math.round(arr.length / Math.min(98, arr.length))
//         //     for (let i = 0; i < arr.length - step; i+=step) {
//         //         data.push(arr[i])
//         //     }
//         //     data.push(arr.at(-1)!)
//         //
//         //     SaveDataTest({symbols: symbols, name: "", time: new Date(), data: data, strategy: strategy, score: 0, top: 0, paramsTest: params})
//         // }
//
//         const obj: {[k: string]:number} = {}
//         let f = 0;
//         const getBuf = (k: string) => {
//             return obj[k] ??= f++
//         }
//         const type = params.type// == "simple" ? "mini" : params.type == "simple+" ? "mini2" : "maks"
//         const result = await api.testerTest(
//             params,
//             [
//                 {strategyParams: strategy.simpleParams, strategyName: strategy.name, selectSymbols: symbols}
//             ],
//             (e)=>{
//                 console.log(e)
//             },
//             type as any,
//             (e)=>{
//                 if (!e) return;
//                 // @ts-ignore
//                 if (e == "___STOP") {
//                     console.log(arrGraph);
//                     dataGraph.graphs = [...arrGraph]
//                     renderBy(dataGraph)
//                     return;
//                 }
//                 const time = (+e.time)/1000 as UTCTimestamp
//                 (arrGraph[getBuf("result")] ??= addGraph({show: true, name: "result", bufferName: "result all"}))
//                     .bars.push({time, value: e.result})
//
//                 if (e.symbols) {
//                     e.symbols.forEach(( v,nSym)=> {
//                         if (!v) {
//                             return
//                         }
//                         const profit = v.profit;
//                         if (!symbols[nSym]) {
//                             console.log({nSym, symbols, e});
//                         }
//                         (arrGraph[getBuf(nSym + "profit ")] ??= addGraph({show: true, name: "profit " + symbols[nSym].symbol, symbolsInfo: symbols[nSym], bufferName: "profit"}))
//                             .bars.push({time, value: profit});
//                         (arrGraph[getBuf(nSym + "volume ")] ??= addGraph({name: "volume " + symbols[nSym].symbol, symbolsInfo: symbols[nSym], bufferName: "volume"}))
//                             .bars.push({time, value: v.volume}) ;
//
//                         Object.entries(v.buffer ?? {}).forEach(([nameBuffer, dataBuffer])=>{
//                             (arrGraph[getBuf(nSym + nameBuffer)] ??= addGraph({
//                                 name: nameBuffer + " " + symbols[nSym].symbol,
//                                 symbolsInfo: symbols[nSym],
//                                 bufferName: nameBuffer,
//                             }))
//                                 .bars.push({time, value: dataBuffer as number})
//                         })
//                     })
//
//                     // console.log(arrGraph);
//                 }
//                 if (++tt && params.type == "simple") {
//                     let busy = false
//                     tr.refreshAsync2(params.type == "simple"  ? 1350 : 1450,()=>{
//                         dataGraph.graphs = [...arrGraph]
//                         renderBy(dataGraph)
//                     })
//                 }
//             }
//         )
//         SaveDataTest({name: "", time: new Date(), info: result.info, top: 0})
//         // SaveDataTest({symbols: symbols, name: "", time: new Date(), data: result.info.state.miniGraph, strategy: strategy, score: 0, top: 0, paramsTest: params})
//
//
//
//         console.log({result});
//         // finish();
//         renderBy(dataGraph);
//     }
//
//     useEffect(() => {
//         if (!settingStrategy.paramsInfo) {
//             ApiData.facade.facadeTester.all.paramsTester()
//                 .then(e=>{
//                     ObjectStringToDate(e)
//                     settingStrategy.paramsInfo = e
//                     settingStrategy.params = e
//                     renderBy(settingStrategy)
//                 })
//         }
//         if (!strategyArray.array.length) ApiData.facade.facadeTester.all.strategies()
//             .then((e)=>{
//                 strategyArray.array  = e
//                 renderBy(strategyArray)
//             })
//     }, [true]);
//
//     const rtt: {result: number}[] = []
//     let tt = 0
//     const ramLoad = ((e) => {
//         console.log(e);
//         const data = e.info.setting[0]
//         const st = strategyArray.array.find(s=>s.name == data.strategyName)
//         if (st) selectStrategy.strategy = st
//         else logsApi.addLogs({time: new Date(), var: 3, id: "tada", txt: "не удалось найти стратегию " + data.strategyName})
//         logsApi.addLogs({time: new Date(), var: 3, id: "tada", txt: " test " + data.strategyName})
//
//         console.log(data.strategyName)
//
//         if (selectStrategy.strategy) selectStrategy.strategy.paramInfo = Params.mergeParamValuesToInfos(selectStrategy.strategy.paramInfo, data.strategyParams)
//
//         if (e.info.paramsTester) {
//             settingStrategy.paramsInfo = Params.mergeParamValuesToInfos(settingStrategy.paramsInfo!, e.info.paramsTester)
//             settingStrategy.params = Params.mergeParamValuesToInfos(settingStrategy.params!, e.info.paramsTester)
//         }
//
//         for (let k in selectSymbols) {delete selectSymbols[k] }
//
//         data.selectSymbols.forEach(e=>{ selectSymbols[getRowIdSymbols(e)] = {...e, type: undefined} })
//
//         renderBy(selectStrategy)
//         renderBy(selectSymbols)
//         renderBy(settingStrategy)
//     }) satisfies Parameters<typeof SelectHistoryRndB>[0]["loadParams"]
//
//     if (datum.keyPage == "proba") {
//         const t = async () => {
//             // /sapi/v1/margin/allAssets /sapi/v1/margin/delist-schedule
//             {
//                 const api = ApiAccount.facade.apiBinance.all
//                 api.getSymDeList.getActualList()
//                     .then(e=>{console.log(e);})
//                 api.getSymDeList.getDeListCross()
//                     .then(e=>{console.log(e);})
//             //     const tt = await (await fetch("https://api.binance.com/sapi/v1/margin/allAssets")).json()
//             //     // const z = tt.symbols.filter(e => e.symbol == "OMGUSDT" || e.symbol == "BTCUSDT")
//             //     console.log(tt)
//             // }
//             // {
//             //     const tt = await (await fetch("https://api.binance.com/sapi/v1/margin/delist-schedule")).json()
//             //     // const z = tt.symbols.filter(e => e.symbol == "OMGUSDT" || e.symbol == "BTCUSDT")
//             //     console.log(tt)
//             }
//         }
//         t()
//     }
//
//     return <div className={"maxSize borderRight"} style={{...StyleOtherColum}}>
//         <div className={"borderBottom"} style={{height: 40, display: "flex"}}>
//             <div style={{width: "2%"}}></div>
//             <div style={{display: "flex"}}>
//                 {
//                     pages.map((e, i) => (
//                         <div key={i}
//                              onClick={(z) => {
//                                  datum.keyPage = e.key
//                                  renderBy(datum)
//                              }}
//                              className={datum.keyPage == e.key ? "toButtonA" : "toButton"}>{e.name}</div>
//                     ))
//                 }
//             </div>
//             <div className={"msTradeAlt"} onClick={RunTest}>Run</div>
//             <div className={"msTradeAlt"} onClick={()=>{
//                 api.stopTest()
//             }}>Stop</div>
//             <SelectHistoryRndB update={updateSize} loadParams={ramLoad} loadAndRun={async (e) => {
//                 ramLoad(e)
//                 await RunTest()
//             }}/>
//         </div>
//         {datum.keyPage == "symbols" &&
//             <SelectSymbol id={5} update={updateSize} filter={filter} selectSymbols={selectSymbols}/>}
//         {datum.keyPage == "strategy" && <SelectStrategy update={updateSize} selectStrategy={selectStrategy}/>}
//         {datum.keyPage == "setting" && <SettingTest settingStrategy={settingStrategy}/>}
//         {/*{datum.keyPage == "history" && <SelectHistory update={updateSize}/>}*/}
//         {/*<Page key = {datum.keyPage}></Page>*/}
//     </div>
// }
// let lastName = ""
// function SettingTest({settingStrategy}:{settingStrategy: typeof settingStrategy_}) {
//     updateBy(settingStrategy)
//     useEffect(() => {
//         lastName = settingStrategy.paramsInfo?.scoreBase.name ?? ""
//     }, [true]);
//     if (settingStrategy.params) settingStrategy.params.time2.range.max = new Date()
//     return <div>
//         <div className={"msTradeAlt"}
//              onClick={async () => {
//                  const e = await ApiData.facade.facadeTester.all.paramsTester()
//                  settingStrategy.paramsInfo = e
//                  ObjectStringToDate(e)
//                  settingStrategy.params = settingStrategy.paramsInfo
//                  renderBy(settingStrategy)
//              }}
//         >reload
//         </div>
//         {settingStrategy.paramsInfo && <ParametersReact params={settingStrategy.paramsInfo}
//                                                         onChange={async (e) => {
//                                                                   console.log(e);
//
//                                                                   settingStrategy.paramsInfo = e
//                                                                   settingStrategy.params = e
//                                                                   if (settingStrategy.params) settingStrategy.params.time2.range.max = new Date()
//                                                                   if (e.scoreBase.value.name.value != lastName) {
//                                                                       lastName = e.scoreBase.value.name.value
//                                                                       console.log(lastName)
//                                                                       console.log(e.scoreBase)
//                                                                       const pr = await ApiData.facade.facadeTester.all.score.byName[lastName].getParamsInfo()
//                                                                       console.log("121212")
//                                                                       e.scoreBase.value.params.value = pr
//                                                                       renderBy(settingStrategy)
//                                                                   }
//                                                               }}/>}
//     </div>
// }
