type UnPromise<T extends Promise<any>> = T extends Promise<infer R> ? R : never
// доступ к котировкам всегда имеет активное подключение
//
//
//
// function RealTime2() {
//     // const all = ApiData.facade.facadeRealtime2.all
//     // const callback = funcListen(all.callback, all.callbackRemove)
//     /*
//        const callback = funcListen((...a: any[])=> {
//         // @ts-ignore
//         all.callback(...a)
//     }, () => {
//         // @ts-ignore
//         all.callbackRemove()
//     })
//
//      */
//     // callback.addListen(e=>{
//     //    console.log(e);
//     // })
//     //
//     // const callbackConnect = () => {
//     //     callback.run()
//     // }
//     // const callbackOff = () => {
//     //     // tr.spot.close()
//     // }
//     // ApiData.socket.on("connect", callbackConnect)
//     // ApiData.socket.on("disconnect", callbackOff)
//
//     // return {all}
// }
//
// export const RealTime = RealTime2()