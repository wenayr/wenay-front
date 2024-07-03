import {GridApi} from "ag-grid-community";
import {StyleGridDefault} from "../common/styleGrid";
import React, {useCallback, useEffect, useRef} from "react";
import {AgGridReact} from "ag-grid-react";
import {DivRnd} from "../commonNew/RNDFunc";
import {updateBy} from "../../updateBy";
import {Button} from "../commonNew/commonFuncReact";


type ParamsSelectSymbolsTable = {
    update?: number,
    objRows: {[key: string]: any}//tObjRows
}
export function SelectSymbolsTable(data: ParamsSelectSymbolsTable) {
    const gridApi  = useRef<GridApi<any>|null>(null)
    useEffect(() => gridApi.current?.sizeColumnsToFit(), [data.update]);
    const getRows = () => {
        return [...Object.values(data.objRows)]
    }
    updateBy(data.objRows, ()=>{
        console.log("SelectSymbolsTable ")
        gridApi.current?.setRowData(getRows())
    })
    updateBy(data.objRows, ()=>{
        gridApi.current?.setRowData(getRows())
    })
    const getTable = ()=><AgGridReact
        onGridReady={(e)=> {
            gridApi.current = e.api as GridApi<any>
            gridApi.current?.sizeColumnsToFit();
        }}
        className= "ag-theme-alpine-dark ag-theme-alpine2 fon"
        onGridSizeChanged={()=>{
            console.log("size")
        }}
        rowData = {getRows()}
        headerHeight = {35}
        suppressCellFocus = {true}
        defaultColDef = {{
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
        ]}
    />

    const cal = useCallback(()=>getTable(),[])
    return <div className={"maxSize"}>
        {cal()}
    </div>
}

export function BSelectSymbols(data: Parameters<typeof SelectSymbolsTable>[0]) {
    updateBy(data.objRows)

    const length = Object.keys(data.objRows).length
    return <Button button={e=> <div className={!e ? "msTradeAlt" : "msTradeAlt msTradeActive"}
                                    style={{width: "max-content", display: "flex"}}>
        {"Select" + ((length? (" " + length) :""))}
    </div>}>
        {(api)=><DivRnd keyForSave={"tt12"}
                        size={{height: 300, width: 300}}
                        className={"fon border fonLight"} // fon border fonLight
                        moveOnlyHeader={true}
                        onCLickClose={api.onClose}
                        onUpdate={()=>{

                        }}>
            {(update)=>SelectSymbolsTable({...data, update})}
        </DivRnd>
        }
    </Button>
}
