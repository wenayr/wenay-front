// import {ApiData} from "../../../utils/sis";
// import {colorGenerator2, rgb, sleepAsync} from "wenay-common";
// import {dataGraph} from "../graph";
// import {UTCTimestamp} from "lightweight-charts";
// import {renderBy} from "../../updateBy";
// import type {selectSymbols} from "./selectSymbol";
// import {settingLoadSymbols} from "./select";
//
// export async function loadDataSymbols(a: selectSymbols[], settingLoad: typeof settingLoadSymbols, map = ["close"], filter = true) {
//     // const map = ["close"] // "time",
//     const r = a.map(info => ({info: {...info, tfSec: +info.tfSec}, map}))
//
//     const namesFull = r.flatMap(e => e.map.map(r => `${e.info.exchange} ${e.info.symbol} ${e.info.category} `))
//     const names = r.flatMap(e => e.map.map(r => `${e.info.symbol}`))
//
//     const start = Math.round(settingLoad.time1.valueOf() / 1000) // Math.round((Date.now() - 1000* 60 * 60 * 24 * 30) )
//     const end = Math.round(settingLoad.time2.valueOf() / 1000)
//     // - минимальный шаг отклонения, меньше которого цена не будет отправлена
//     const countB = (end - start) / (+a[0].tfSec) * a.length / 1000
//     const tr = Math.log2(countB)
//     const pricePercent = tr * 0.05
//
//     const last: number[] = []
//
//     const allDB = ApiData.facade.facadeDB.all
//     console.log("key for load = ", {r: r})
//     const key = await allDB.loads({data: r, start, end})
//
//     if (key) {
//         const color = colorGenerator2({min: 0, max: 255})
//         let arr2: typeof dataGraph.graphs = []
//         let req2 = await allDB.loadsNext(key)
//         console.log("req2 for load = ", {req2})
//         const next = async () => {
//             req2 = await allDB.loadsNext(key)
//         }
//         while (true) {
//             const req = req2
//             let t = next()
//             await sleepAsync(0)
//             if (req.done == true) break;
//             (req.volume ?? [])
//                 .forEach(e => {
//                     e.arr.forEach((z, i) => {
//                         arr2[i] ??= {bars: [], name: names[i], nameFull: namesFull[i], show: true}
//                         if (z && pricePercent && !last[i]) last[i] = z;
//                         if (filter) {
//                             if (z && (Math.abs(last[i] - z) > z * 0.01 * pricePercent))
//                             {
//                                 arr2[i].bars.push(({time: e.timeSec / 1000 as UTCTimestamp, value: z as number}))
//                                 last[i] = z
//                             }
//                         } else {
//                             arr2[i].bars.push(({time: e.timeSec / 1000 as UTCTimestamp, value: z as number}))
//                         }
//
//                     })
//                 })
//             await t
//         }
//         // dataGraph.graphs.length = arr2.length
//         dataGraph.graphs = new Array(arr2.length)
//         arr2.forEach(e => {
//             const c = color.next()
//             if (c.done == false) {
//                 e.color = rgb(...c.value)
//             }
//         })
//         arr2.forEach((e, i) => {
//             dataGraph.graphs[i] = e
//         })
//
//         renderBy(dataGraph)
//         // console.log({result: z});  initialData
//     }
// }