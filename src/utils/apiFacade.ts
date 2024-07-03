// import {io} from "socket.io-client";
// import {CreatAPIFacadeClient} from "wenay-common";
// import type {tFacadeDBSym} from "../../../serverHistoryLoader/src/myDB/apiFacadeDB";
// import type {tFacadeLoader} from "../../../serverHistoryLoader/src/utils/api";
// import type {tFacadeTester} from "../../../serverHistoryLoader/src/tester/facadeTester";
// import type {tSaveKeyValue} from "../../../common/keyVolume/facade";
// import type {tApiClientExchanges, tApiClientStrategy} from "../../../serverHistoryLoader/src/exchangeBack/facade";
// import type {tApiClientBinance} from "../../../serverHistoryLoader/src/exchangeBack/binance/facadeBinance";
// import type {tApiClientBybit} from "../../../serverHistoryLoader/src/exchangeBack/bybit/facadeBybit";
// import type {tApiClientTinkoff} from "../../../serverHistoryLoader/src/exchangeBack/tinkoff/tinkoffRun";
// import type {FacadeServerSave} from "../../../serverAdmin/src/facade"
// import type {tApiClientGateio} from "../../../serverHistoryLoader/src/exchangeBack/gateio/facadeGateio";
//
// export const ApiFacade = (() => {
//     const {onConnect, ...facade} = InitFacadeClient()
//     return {facade, onConnect}
// })()
// export const ApiAccount = (() => {
//     const {onConnect, ...facade} = InitFacadeCAccount()
//     return {facade, onConnect}
// })()
//
//
// export const ApiSave = (() => {
//     const {onConnect, ...facade} = InitFacadeRemote()
//     return {facade, onConnect}
// })()
//
//
// export function InitFacadeClient() {
//     const fullUrl = location.protocol + '//' + location.hostname + ':4020'
//     // const fullUrl = "http://127.0.0.1:4020"
//     const socket = io(fullUrl, {
//         transports: ['websocket'],
//         autoConnect: true,
//         // forceBase64: true,
//         upgrade: true,
//         multiplex: true,
//
//         query: {
//             token: "JdnEf42bD9f3Fn"//this.auth.getToken()
//         },
//         timeout: 90000,
//         // forceNew: true
//     });
//     socket.on('disconnect', (reason) => {
//         console.log("disconnect")
//     });
//     socket.on('connect_error', (reason) => {
//         console.log("connect_error")
//     });
//     socket.on('toast', (data) => {
//         console.log("toast")
//     });
//     let connect: null | (() => void) = null;
//     socket.on('connect', () => {
//         console.log("connect InitFacadeCAccount")
//         connect?.()
//     });
//     const facadeDB2 = CreatAPIFacadeClient<tFacadeDBSym>({socketKey: "facadeDB", socket, limit: 100})
//
//     const facadeDB = facadeDB2 // {...facadeDB2, loadGen: loadGen}
//     const facadeLoader = CreatAPIFacadeClient<tFacadeLoader>({socketKey: "facadeLoader", socket, limit: 100})
//     const facadeTester = CreatAPIFacadeClient<tFacadeTester>({socketKey: "facadeTester", socket, limit: 100})
//     // const facadeRealtime2 = CreatAPIFacadeClient<tFacadeRealTime>({socketKey: "facadeRealTime2", socket, limit: 100})
//     const saveLoadPresets = CreatAPIFacadeClient<tSaveKeyValue>({socketKey: "saveLoadPresets", socket, limit: 100})
//     return {
//         facadeDB, facadeLoader, facadeTester, saveLoadPresets,
//         onConnect(func?: null | (() => void)) {
//             connect = func ?? null;
//         }
//     } // facadeRealtime2: facadeRealtime2,
// }
//
// export function InitFacadeCAccount() {
//     const fullUrl = location.protocol + '//' + location.hostname + ':4021'
//     // const fullUrl = "http://127.0.0.1:4021"
//     const socket = io(fullUrl, {
//         transports: ['websocket'],
//         query: {
//             token: "JdnEf42bD9f3Fn"//this.auth.getToken()
//         },
//         forceNew: true,
//         timeout: 90000,
//     });
//     const apiBinance = CreatAPIFacadeClient<tApiClientBinance>({socketKey: "binance", socket})
//     const apiBybit = CreatAPIFacadeClient<tApiClientBybit>({socketKey: "bybit", socket})
//     const apiGateio = CreatAPIFacadeClient<tApiClientGateio>({socketKey: "gateio", socket})
//     const apiTinkoff = CreatAPIFacadeClient<tApiClientTinkoff>({socketKey: "tinkoff", socket})
//     const apiStrategy = CreatAPIFacadeClient<tApiClientStrategy>({socketKey: "strategy", socket})
//     const apiExchanges = CreatAPIFacadeClient<tApiClientExchanges>({socketKey: "exchanges", socket})
//     socket.on('disconnect', (reason) => {
//         console.log("disconnect")
//     });
//     socket.on('connect_error', (reason) => {
//         console.log("connect_error")
//     });
//     socket.on('toast', (data) => {
//         console.log("toast")
//     });
//     let connect: null | (() => void) = null;
//     socket.on('connect', () => {
//         console.log("connect InitFacadeCAccount")
//         connect?.()
//     });
//     return {
//         apiBinance, apiBybit, apiGateio, apiTinkoff, apiStrategy, apiExchanges,
//         onConnect(func?: null | (() => void)) {
//             connect = func ?? null;
//         }
//     }
// }
//
// export function InitFacadeRemote() {
//     const fullUrl = 'http://79.174.82.54:4024'
//     // const fullUrl = "http://127.0.0.1:4021"
//     const socket = io(fullUrl, {
//         transports: ['websocket'],
//         query: {
//             token: "JdnEf42bD9f3Fn"//this.auth.getToken()
//         },
//         forceNew: true,
//         timeout: 90000,
//     });
//     // http://79.174.82.54/
//     const apiSave = CreatAPIFacadeClient<FacadeServerSave>({socketKey: "serverKeyValue", socket})
//
//     socket.on('disconnect', (reason) => {
//         console.log("disconnect")
//     });
//     socket.on('connect_error', (reason) => {
//         console.log("connect_error")
//     });
//     socket.on('toast', (data) => {
//         console.log("toast")
//     });
//     let connect: null | (() => void) = null;
//     socket.on('connect', () => {
//         console.log("connect InitFacadeCAccount")
//         connect?.()
//     });
//     return {
//         apiSave,//, apiBybit, apiTinkoff, apiStrategy, apiExchanges,
//         onConnect(func?: null | (() => void)) {
//             connect = func ?? null;
//         }
//     }
// }
