import {ApiData} from "../../utils/sis";
import {Params, UnArray, UnAwaited} from "wenay-common";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {renderBy, updateBy} from "../updateBy";
import {ButtonOutClick, StyleOtherColum} from "./commonNew/commonFuncReact";
import {DivRnd} from "./commonNew/RNDFunc";
import {GridApi} from "ag-grid-community";
import {AgGridReact} from "ag-grid-react";
import {StyleGridDefault} from "./common/styleGrid";
import {strategyArray} from "../partPages/leftPanel";
import {ParametersReact} from "./other/Parameters2";

export type tStrategy = UnArray<UnAwaited<ReturnType<typeof ApiData.facade.facadeTester.all.strategies>>>

export function SelectStrategy({update, selectStrategy}: {update: number, selectStrategy: {strategy: tStrategy | null}}) {
    const strategy = selectStrategy
    console.log({strategy})
    updateBy(strategy)
    updateBy(selectStrategy, ()=>{
        console.log("selectStrategy update")
        console.log(selectStrategy.strategy?.name)
    })
    return <div className={"maxSize"} style={{...StyleOtherColum}}>
        <div style={{display: "flex"}}>
            <div className={"toPTextIndicator"} style={{marginLeft: 10}}>strategy:</div>
            <ButtonOutClick key={"strategy"}
                            keySave={"strategy"}
                            button={(s) =>
                          <div className={'msTradeAlt msTradeActive'}
                               key={"strategy"}
                               style={{width: "max-content"}}
                          >{strategy.strategy?.name ?? "press for select"}</div>
                      }
            >
                <StrategyTableRnd update={update} selectStrategy={e => {
                    selectStrategy.strategy = e
                    renderBy(selectStrategy)
                }}/>
            </ButtonOutClick>
            <div className={"msTradeAlt"}
                 onClick={async () => {
                     if (strategy.strategy) {
                         const name = strategy.strategy.name
                         const rt = await ApiData.facade.facadeTester.all.strategies()
                         strategy.strategy = rt.find(e => e.name == name) ?? null
                         renderBy(strategy)
                     }
                 }}
            >reload
            </div>
        </div>
        {strategy.strategy && <FF params={strategy.strategy.paramInfo}
                                  onChange={(e) => {
                                      if (selectStrategy.strategy?.paramInfo) selectStrategy.strategy.paramInfo = e
                                  }}/>}
    </div>
}

type tF<TParams extends Params.IParamsExpandableReadonly = Params.IParamsExpandableReadonly> = {
    //object?:api.CIndicatorAND,
    params: TParams,
    //expandParamPaths : string[]
    expandStatus?: boolean,
    expandStatusLvl?: number,
    onChange: (params: TParams) => void,  // при изменении значения
    onExpand?: (params: TParams) => void  // при развёртывании
}
function FF<TParams extends Params.IParamsExpandableReadonly = Params.IParamsExpandableReadonly>(a:tF<TParams>) {
    return <div className={"maxSize"} style={{position: "relative"}}>
        <div className={"maxSize"} style={{overflow: "auto",position: "absolute"}}>

            <ParametersReact params={a.params}
                             onChange={a.onChange}/>
        </div>
    </div>
}

function StrategyTableRnd(data: Parameters<typeof StrategyTable>[0]) {
    return <DivRnd keyForSave={"tt123"}
                   size={{height: 300, width: 300}}
                   className={"fon border fonLight"} // fon border fonLight
                   moveOnlyHeader={true}
                   onUpdate={()=>{

                        }}>
            {(update)=>StrategyTable({...data, update})}
        </DivRnd>
}

type tRow = {name: string, id: number}
function StrategyTable({update, selectStrategy}: {update: number, selectStrategy: (strategy : tStrategy) => void}) {
    const datum = strategyArray
    const getData = () => datum.array.map((e, i)=>({name: e.name, id: i})) ?? []
    const [rows, setRows] = useState<tRow[]>(getData())
    updateBy(datum, ()=>{
        setRows(getData())
    })
    const gridApi  = useRef<GridApi<any>|null>(null)
    useEffect(() => {
        ApiData.facade.facadeTester.all.strategies()
            .then((e)=>{
                datum.array  = e
                renderBy(datum)
            })
    }, []);
    useEffect(() => gridApi.current?.sizeColumnsToFit(), [update]);

    const getTable = ()=><AgGridReact
        onGridReady={(e)=> {
            gridApi.current = e.api as GridApi<any>
            gridApi.current?.sizeColumnsToFit();
        }}
        className= "ag-theme-alpine-dark ag-theme-alpine2 fon"
        rowData = {rows}
        headerHeight = {20}
        suppressCellFocus = {true}
        defaultColDef = {{
            headerClass: ()=> ("gridTable-header"),
            resizable: false,
            cellClass: 'cell-wrap-text',
            cellStyle: ({...StyleGridDefault}),
        }}
        onRowClicked={e=>{
            selectStrategy(datum.array[+e.data!.id])
        }}
        columnDefs={[
            {
                field: "name",
                headerName: "",
            },
        ]}
    >
    </AgGridReact>
    const Table = useCallback(getTable,[rows])


    return <div className={"maxSize"}>
        <Table/>
    </div>
}