import React, {useCallback, useEffect, useRef} from "react";
import {DivRnd} from "../commonNew/RNDFunc";
import {AgGridReact} from "ag-grid-react";
import {GridApi} from "ag-grid-community";
import {StyleGridDefault} from "../common/styleGrid";
import {selectSymbols} from "./selectSymbol";


export function LoadSelectRD(...data: Parameters<typeof LoadSelect>) {
    return <DivRnd keyForSave={"4234"}
                   size={{height: 300, width: 500}}
                   className={"fon border fonLight"}
                   moveOnlyHeader={true}
                   onUpdate={()=>{
                       console.log("ewew")
                   }}
    >
        {(update)=>LoadSelect({...data[0], update})}
    </DivRnd>
}
export function LoadSelect2(...data: Parameters<typeof LoadSelect>) {
    const color = "rgba(159,159,159,0.93)"
    const colorBack = "rgba(19,19,19,0.93)"
    return <div style={{background: colorBack, position: "absolute",width: 400, height: 300, border: color + " 1px solid"}}>
        {LoadSelect(...data)}
    </div>
}


type tRowSelectSave = {
    rows: any[],
    tfSec: string[],
    exchanges: string[],
    categories: string[],
}

const saveSelect = {
    save: {} as {[key: string]: tRowSelectSave}
}

type ParamsLoadSelect = {
    getSelectRow: ()=>selectSymbols[],
    load: (row: selectSymbols[]) => void,
    loadOnly: (row: selectSymbols[]) => void,
    update?: number
}

export function LoadSelect({getSelectRow, load, loadOnly, update}: ParamsLoadSelect) {
    const defaultColDef = {}
    const datum = saveSelect
    const gridApi  = useRef<GridApi<any>|null>(null)
    const txtName = useRef("")

    useEffect(() => gridApi.current?.sizeColumnsToFit(), [update]);

    const rows = getSelectRow()

    const exchanges = new Set<string>
    const category = new Set<string>
    const tfSec = new Set<string>
    rows.forEach(e=>{
        exchanges.add(e.exchange)
        category.add(e.category)
        tfSec.add(String(e.tfSec))
    })

    const data = {
        rows: rows,
        exchanges: [...exchanges.values()],
        categories: [...category.values()],
        tfSec: [...tfSec.values()]
    } satisfies tRowSelectSave

    type tt = {
        name: any,
        category: any,
        exchange: any,
        date: any,
        load?: any,
        del?: any,
        loadOnly?: any
    }
    const convert = (name: string, a: tRowSelectSave) => ({
        name,
        exchange: a.exchanges.join(" "),
        category: a.categories.join(" "),
        date: a.tfSec.join(" "),
        load: a
    }) as tt

    const getRowsTable = () => (Object.entries(datum.save).map(([key,v])=>convert(key,v)))

    console.log({rowsTable: getRowsTable()})

    const getTable = ()=><AgGridReact
        onGridReady={(e)=> {

            gridApi.current = e.api as GridApi<any>
            gridApi.current?.sizeColumnsToFit();
        }}
        className= "ag-theme-alpine-dark ag-theme-alpine2 fon"
        onGridSizeChanged={()=>{
            console.log("size")
        }}
        rowData = {getRowsTable()}
        headerHeight = {35}
        suppressCellFocus = {true}
        defaultColDef = {defaultColDef ?? {
            headerClass: ()=> ("gridTable-header"),
            resizable: true,
            cellClass: 'cell-wrap-text',
            cellStyle: ({...StyleGridDefault}),
        }}

        columnDefs={[
            {
                field: "name",
            },
            {
                field: "date"
            },
            {
                field: "exchange"
            },
            {
                field: "category"
            },
            {
                field: "load",
                minWidth: 50,
                valueFormatter: e=>"load",
                onCellClicked: (e)=>{
                    if (e.data?.load.rows) load(e.data.load.rows)
                }
                // cellRenderer: (e)=><div className={"msTradeAlt"} style={{height: "60%", marginTop: "20%"}}>{"e"}</div>
            },
            {
                field: "loadOnly",
                minWidth: 70,
                valueFormatter: e=>"loadOnly",
                onCellClicked: (e)=>{
                    if (e.data?.load.rows) loadOnly(e.data.load.rows)
                }
                // cellRenderer: (e)=><div className={"msTradeAlt"} style={{height: "60%", marginTop: "20%"}}>{"e"}</div>
            },
            {
                field: "del",
                valueFormatter: e=>"",
                // cellRenderer: (e)=><div className={"msTradeAlt"} style={{height: "60%", marginTop: "20%"}}>{"e"}</div>
            },
        ]}
    >
    </AgGridReact>
    const Table = useCallback(getTable,[])
    const fName = (a: Set<any>, name: string) => a.size == 1 ? a.values().next().value : name + " " + a.size
    const name2 = "" + rows.length + fName(exchanges,"exchanges") + " " + fName(category,"category")  + " " + fName(tfSec,"tfSec")

    return <div className={"maxSize"} style={{padding: 10}}>
        <div className={"maxSize"} style={{height: "calc(100% - 40px)"}}>
            <Table/>
        </div>
        <div style={{height: 100}}>
            <div style={{display: "flex"}}>
                <input type={"text"} onChange={(e) => {
                    txtName.current = e.target.value ?? ""
                }}/>
                <div className={"msTradeAlt"}
                    onClick={()=> {
                        datum.save[txtName.current] = data
                        gridApi.current?.setRowData(getRowsTable())
                    }}
                >Save</div>
            </div>
            <div>{name2}</div>
        </div>
    </div>
}
