// import React, {useEffect, useState} from "react";
// import {StyleOtherRow} from "../components/commonNew/commonFuncReact";
// import {FResizableReact} from "../components/common/Resizeble";
// import {ApiData, staticGetAdd} from "../../utils/sis";
// import {renderBy, updateBy} from "../updateBy";
// import {tMenuReact} from "../components/common/miniMenu";
// import {mouseAdd} from "../components/other/mouse";
// import {sleepAsync, TF, UnAwaited} from "wenay-common";
// import {CParams} from "wenay-common/lib/Exchange/CParams";
// import {ParametersReact} from "../components/other/Parameters2";
//
// const defMain = {
//     tableSym: true,
//     podval: true,
// }
//
// const getMenu = (datum: typeof defMain) => {
//     return [
//         {name: "style", next: ()=> [
//                 {name: "podval", onClick: ()=> {
//                         datum.podval = !datum.podval;
//                         renderBy(datum)
//                     }, active: ()=> datum.podval},
//                 {name: "tableSym", onClick: ()=> {
//                         datum.tableSym = !datum.tableSym;
//                         renderBy(datum)
//                     }, active: ()=> datum.tableSym},
//                 {name: "tableSym", onClick: ()=> {
//                         datum.tableSym = !datum.tableSym;
//                         renderBy(datum)
//                     }, active: ()=> datum.tableSym},
//                 {name: "tableSym", onClick: ()=> {
//                         datum.tableSym = !datum.tableSym;
//                         renderBy(datum)
//                     }, active: ()=> datum.tableSym}
//             ]}
//     ] satisfies tMenuReact[]
// }
//
// export function pageLoader() {
//     const datum = staticGetAdd("PageTest",defMain)
//
//     return <div className={"maxSize"} onMouseUp={(e)=>{if (e.button==2) {
//         mouseAdd.map.set("pageMain", getMenu(datum))
//     }}}>
//         <div className={"toSpaceColum"} style={{height: "100%"}}>
//             <div className={"toSpace"} style={{height: "100%", ...StyleOtherRow}}>
//             <Loader/>
//                 <StatisticLoad/>
//
//
//             </div>
//             {datum.podval && <FResizableReact
//                 keyForSave={"s1"}
//                 enable={{top: true}}
//                 size={{width: "100%", height: "20%"}}
//             >
//                 <div className={"toSpaceOther borderTop maxSize"}>
//                     тест
//                 </div>
//             </FResizableReact>}
//         </div>
//     </div>
// }
//
// type tr = UnAwaited<ReturnType<typeof ApiData.facade.facadeLoader.all.status>>
// const obj = {
//     data: {} as tr,
//     params: {
//         time: {name: "start time", value: new Date(2023, 1, 1), range: {min: new Date(2021, 1, 1), max: new Date()}},
//         tf: {name: "timeframe", value: TF.M15.name, range: [TF.M1, TF.M5, TF.M15, TF.H1, TF.H8].map(e=>e.name)}
//     } satisfies CParams
//
// }
// const SymbolsData = {
//     data: {} as {[exchange: string|number]: {[category: string|number]: {keyMap: (string|number)[], tfs: {[k: string|number]: number}}}}
// }
//
//
// type tObj<T extends object> = T extends {[k: string]: infer F} ? F : never
// function Loader() {
//     const [updateSize, updateSizeSet] = useState(0)
//     const api = ApiData.facade.facadeLoader.all
//
//     const data = obj
//     const [key, setKey] = useState<string[]>(Object.keys(data.data))
//     console.log(key.length)
//     updateBy(data, ()=>{
//         setKey(Object.keys(data.data))
//     })
//     useEffect(() => {
//         console.log("useEffect")
//         api.getCallback.callback((e)=>{
//             data.data[e.ex] = {loader: true, stop: !!e.status, info: e, status: e.status, error: e.error, tfS: e.tfS}
//             // data.data[e.ex].info = e
//             console.log(e)
//             // renderBy(data)
//             setKey(Object.keys(data.data))
//         })
//         api.status()
//             .then(e=>{
//                 obj.data = e
//
//                 renderBy(data)
//             })
//         return ()=>{
//             api.getCallback.removeCallback()
//         }
//     }, [true]);
//     //   {symbolError: number, symbolWorked: number, sym: number, size: number}
//
//     // updateBy(datum)
//     return <div style={{padding: 30}}>
//         <ParametersReact params={data.params} onChange={e => {
//             data.params = e;
//
//         }}/>
//         {
//
//             key.map(name=> {
//                 const t = data.data[name]
//                 const a = JSON.stringify(t.info ?? {})
//                 if (a!="{}") console.log(a)
//                 return <div className={"toLine"} key={name} style={{height: 30}}>
//                     <div className={"msTradeAlt msTradeAlt2"}
//                          style={{width: 250,
//                              // color: "#8c989d",
//                              // background: "rgba(31,39,45,0.21)"
//                     }}
//                          onClick={() => {
//                              console.log(data.params.time.value);
//                              api.loaderExchange({ex: name as any, params: {time1: new Date(data.params.time.value)}, tfs: [data.params.tf.value]})}}>{name}</div>
//                     <div style={{width: 150,}}>
//                         <div className={"toLine msTradeAlt"}
//                              style={{
//                                  color: "#8c989d",
//                                  background: "rgba(31,39,45,0.21)"}}>
//                             <div >{t.info?.sym}/{t.info?.size} {" " + (t.info?.tfS ? TF.fromSec(t.info.tfS)?.name : "")}</div>
//                             {t.info?.error && t.info.error!="0" && <div style={{color: "#ff0000"}}>{t.info?.error}</div>}
//                         </div>
//                         <div style={{marginTop: -5, paddingLeft: 5, paddingRight: 5}}>
//                             {t.info?.size && <div
//                                 style={{height: 2, width: (t.info.sym * 100/ t.info.size).toFixed(1) + "%", background: "#119a18"}}></div>}
//                             {!t.info?.symbolError ? null : <div
//                                 style={{height: 3, width: (t.info.symbolError * 100/ t.info.size).toFixed(1) + "%", background: "#ff0000"}}></div>}
//                         </div>
//                     </div>
//                     {!t.stop && <div className={"msTradeAlt"} onClick={() => {api.stopLoad({ex: name as any})}}>stop</div>}
//
//                     {/*{t.status && <div>{t.status}</div>}*/}
//                     {/*{t.info && <div>{JSON.stringify(t.info)}</div>}*/}
//                 </div>
//                 // return <GetElement key={e} stop={t.stop} name={e} loader={t.loader} info={t.info}/>
//             })
//         }
//     </div>
// }
//
// function StatisticLoad() {
//
//     const apiDB = ApiData.facade.facadeDB.all
//     const sym = SymbolsData
//     updateBy(sym)
//     async function initSymbols2() {
//         const exchanges =  await apiDB.findOther("exchange", {keyMap: ["time"]})
//         sym.data = {}
//         for (let exchange of exchanges) {
//             const e = sym.data[exchange] ??= {}
//             const categories =  await apiDB.findOther("category", {keyMap: ["time"], exchange: [exchange]})
//             for (let category of categories) {
//                 const keyMap =  await apiDB.findOther("keyMap", {exchange: [exchange], category: [category]})
//                 const c = e[category] ??= {
//                     keyMap,
//                     tfs: {}
//                 }
//                 // apiDB.symbols
//                 const tfs =  await apiDB.findOther("tfSec", {keyMap: ["time"], exchange: [exchange], category: [category]})
//                 for (let tf of tfs) {
//                     const symbols =  await apiDB.findOther("symbol", {keyMap: ["time"], tfSec: [tf], exchange: [exchange], category: [category]})
//                     c.tfs[tf] = symbols.length
//                     renderBy(sym)
//                 }
//                 console.log({tfs, category, exchange})
//             }
//         }
//         renderBy(sym)
//     }
//
//     useEffect(() => {
//         initSymbols2()
//     }, [true]);
//
//     return <div style={{padding: 30}}>
//         <div className={"msTradeAlt msTradeAlt2"} onClick={async ()=>{
//             await apiDB.refreshSymbols()
//             initSymbols2()
//         }}>refresh</div>
//         {
//             Object.entries(sym.data).map(([exc,v])=><div key={exc}>
//                 <div>{exc}</div>
//                 {
//                     Object.entries(v).map(([cat,v])=> <div key={cat} style={{paddingLeft: 30}}>
//                         <div>{cat}</div>
//                         <div style={{paddingLeft: 20}}>{v.keyMap.join(" ")}</div>
//                         {
//                             Object.entries(v.tfs).map(([tf, v]) => <div key={tf} style={{paddingLeft: 30, display: "flex"}}>
//                                 <div>{TF.fromSec(+tf)?.name}</div>
//                                 <div style={{paddingLeft: 10}}>{v}</div>
//                                 <div style={{paddingLeft: 10}}
//                                     onClick={async ()=> {
//                                         if (confirm("Press a button!\nEither OK or Cancel.") == true) {
//                                             const t = await apiDB.readFilesInfo()
//                                             let tt = +tf
//                                             const r = t.filter(({info})=> info.tfSec == tt && info.category == cat && info.exchange == exc)
//                                             console.log(r)
//                                             if (r.length > 1000) {
//                                                 while (r.length) {
//                                                     const t = r.length > 1000 ? r.splice(0, 1000) : r
//                                                     await sleepAsync(50)
//                                                     apiDB.delElements(t)
//                                                     if (t == r) break;
//                                                 }
//                                             }
//                                             else await apiDB.delElements(r)
//                                         }
//                                     }}
//                                 >del</div>
//                             </div>)
//                         }
//                     </div>)
//                 }
//             </div>)
//         }
//     </div>
// }