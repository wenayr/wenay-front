import {Params} from "wenay-common";
import {GridReadyEvent} from "ag-grid-community";
import type {tInfoSymDB} from "../../../../../serverHistoryLoader/src/myDB/interface";
// import type {tRealtimeData} from "../../../../../serverHistoryLoader/src/common/exchangesCommon/type";

export const selectFilterSymbols = {
    word: "" as string,
    obj: {} as { [key: string]: { [key: string]: boolean } },
    unique: false as boolean,
    show: {
        symbol: true,
        exchange: true,
        category: true,
        // type: true,
        v24: true,
        // start: true,
        // acc: true,
        bars: true,
        tfSec: true,
        // price: true,
        quoteAsset: true,
        select: true,
    } as { [key: string]: boolean }
}
// описание полей в получаем классе с АПИ
// то как они называются чтобы потом если что переименовывать в одном месте
export const tSymbolsRow = {
    symbols: "symbol",
    exchange: "exchange",
    category: "category",
    type: "type",
    start: "start",
    bars: "bars",
    tfSec: "tfSec",
    v24: "v24",
    acc: "acc"
}

export const settingLoadSymbolsDef = {
    time1: {
        name: "С",
        value: new Date(2023, 1, 1),
        range: {min: new Date(2020, 1, 1), max: new Date(), step: 60 * 1000}
    },
    time2: {
        name: "По",
        value: new Date(Date.now() - (Date.now() % (60 * 1000)) + 60 * 1000),
        range: {min: new Date(2020, 1, 1), max: new Date(Date.now() + 60 * 1000), step: 60 * 1000}
    },
} satisfies Params.CParams
export const settingLoadSymbols = {
    ...Params.GetSimpleParams(settingLoadSymbolsDef)
}

type trs<T> = {[P in keyof T]: (string)}
export type tableSymbols = GridReadyEvent<trs<tRowsSymbols>, any>
export type tRowsSymbols = tInfoSymDB & { start: Date, bars: number } // & Partial<tRealtimeData>

export const dataRowSymbols = {
    AllSym: [] as trs<tRowsSymbols>[],
    exchange: [] as (string | number)[],
    category: [] as (string | number)[],
    type: [] as (string | number)[],
    tfSec: [] as (string | number)[],
}
