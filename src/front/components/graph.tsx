import {ColorType, createChart, IChartApi, UTCTimestamp} from 'lightweight-charts';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {renderBy, updateBy} from "../updateBy";
import {Button} from "./commonNew/commonFuncReact";
import {DivRnd} from "./commonNew/RNDFunc";
import {UnArray} from "wenay-common";
import {GridApi} from "ag-grid-community";
import {AgGridReact} from "ag-grid-react";
import {StyleGridDefault} from "./common/styleGrid";
import {tMenuReact} from "./common/miniMenu";
import {mouseAdd} from "./other/mouse";

type colorGraph = {
    backgroundColor : string,
    lineColor : string,
    textColor : string,
    areaTopColor? : string,
    areaBottomColor? : string,
}
export type tBarTW = {
    time: UTCTimestamp | string //| number,
    value: number
}
type symbolsInfo = {
    symbol: string,
    exchange?: string,
    category?: string,
}
type tDataGraph = {
    style?: colorGraph,
    status: Readonly<{event: string|null}>,
    readonly updateData: {
        ar?: number[]
    }
    graphs: {
        name?: string,
        full?: {
            symbolsInfo: symbolsInfo
            buffer?: string
        },
        nameFull?: string,
        color?: string,
        show?: boolean,
        bars: tBarTW[]
    }[],
    reSize?: number
}
const defStyle = {
    lineColor: "#c2c2c2",
    textColor: "#8c8c8c",
    areaBottomColor: "rgba(0,0,0,0)",
    areaTopColor: "rgba(0,0,0,0)",
    backgroundColor: "rgba(0,0,0,0)",
} satisfies  colorGraph

const tt78 = {ds: "ds"}

function Info({color, name, show, onCLickShow}:{color: string, name: string, show: boolean, onCLickShow: ()=>void}) {
    console.log(show);
    return <div style={{display: "flex"}} onClick={onCLickShow} className={"msTradeAlt"}>
        <div style={{display:"block", width: 16, height: 8, background: color}}></div>
        <div>{name+" visible: " + show}</div>
    </div>
}
let b = 0
export const ChartComponent = ({graphs, style = defStyle, reSize, status, updateData}: tDataGraph) => {

    const chartContainerRef = useRef<HTMLDivElement|null>(null);
    const graphSeries = useRef<ReturnType<IChartApi["addAreaSeries"]>[]|null >();
    const chartRef = useRef<IChartApi|null>(null);
    const infoR = useRef<{color: string, name: string, status: boolean}|null>(null);
    const [up, setUp] = useState(b)
    if (b != up) b = up
    const [info, setInfo] = useState<{index: number, color: string|undefined, name: string|undefined, status: boolean|undefined}|null>(null)

    useEffect(
        () => {
            if (chartContainerRef.current) {
                const chart = chartRef.current = createChart(chartContainerRef.current, {
                    grid: {
                        horzLines: {color: "rgba(255,255,255,0.15)"},
                        vertLines: {color: "rgba(255,255,255,0.15)"},
                    },
                    layout: {
                        background: { type: ColorType.Solid, color: style.backgroundColor },
                        textColor: style.textColor,
                    },
                    width: chartContainerRef.current.clientWidth,
                    height: undefined,
                    timeScale: {
                        minBarSpacing: 0.005,
                        timeVisible: true,

                    }
                });
                chart.subscribeClick((e)=>{
                    const tt: {value: number, index: number}[] = []
                    e.seriesData.forEach((w: any, api)=>{
                        const r = w as {value: number}
                        const trr = Math.abs((api.priceToCoordinate(r.value??0) as number) - (e.point?.y??0 as number))
                        const index = +(api.options().title.split(" ").at(-1) ?? "0")
                        tt.push({value: trr, index: index})
                    })
                    if (!tt.length) {
                        setInfo(null)
                    } else {
                        const best = tt.reduce((e,b)=>e.value < b.value ? e : b)
                        const el = dataGraph.graphs![best.index]
                        setInfo({name: el.nameFull, status: el.show, color: el.color, index: best.index})
                    }
                })
                chart.timeScale().fitContent();
            }
            return () => {
                // window.removeEventListener('resize', handleResize);
                graphSeries.current?.forEach(e=>chartRef.current?.removeSeries(e))
                graphSeries.current = null
                chartRef.current?.remove();
                chartRef.current = null
                infoR.current = null
                setInfo(null)
            };
        },
        [true]
    );

    updateBy(tt78, ()=>setUp(b + 1))

    useEffect(  // overflow-y
        () => {
            let arr: ReturnType<IChartApi["addAreaSeries"]>[] = []
            if (chartRef.current) {
                const chart = chartRef.current
                graphs.forEach((e,i)=> {
                    if (!e.show) return
                    const newSeries = chart.addAreaSeries({
                        lineWidth: 1,
                        lineColor: e.color ?? style.lineColor, topColor: style.areaTopColor, bottomColor: style.areaBottomColor, visible: e.show ?? false, title: e.name + " " + String(i) });

                    (graphSeries.current??=[]).push(newSeries)
                    newSeries.setData(e.bars.filter(e=> e.value));
                    // console.log(Score(e.bars.map(e => e.value)));
                })



            }
            return () => {
                graphSeries.current?.forEach(e=>chartRef.current?.removeSeries(e))
                graphSeries.current = null
                infoR.current = null
                setInfo(null)
            };
        },
        [graphs, chartRef.current, up]
    );


    useEffect(() => {
        if (chartContainerRef.current) {
            chartRef.current?.applyOptions({
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight
            });
        }
        return ()=>{}
    }, [reSize]);

    return (
        <div
            ref={chartContainerRef}
            style={{width: "100%", height: "100%"}}
        >
            <div style={{position: "absolute", zIndex: 3, left: 50, top: 0}}>
                {info && <Info color={info.color??""} name={info.name??""} show={info.status??false} onCLickShow={()=>{
                    dataGraph.graphs[info.index].show = !info.status
                    renderBy(tt78)
                    setInfo({...info, status: !info.status})
                }}/>}
            </div>
        </div>
    );
};

export const initialData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
].map(e=>({time: new Date(e.time).valueOf()/1000 as UTCTimestamp, value: e.value}));


export const dataGraph: tDataGraph  = {
    updateData: {},
    status: {event: null},
    graphs: [],
}
dataGraph.graphs = [{bars: initialData}]


function Mini({data}: {data: UnArray<typeof dataGraph.graphs> }) {
    const [vis, setVis] = useState(data.show ?? false)
    updateBy(tt78, ()=>{
        setVis(data.show ?? false)
    })
    return <div
        className={vis ? 'msTradeAlt msTradeActive' : 'msTradeAlt'}
        style={{display: "flex"}}
        onClick={() => {
            data.show = !vis
            setVis(!vis)
            renderBy(tt78)
        }}
    >
        <div style={{display:"block", width: 12, height: 6, background: data.color}}></div>
        <div>{(data.name??"none")+ " " + (data.show == false ? "off" : "on" )}</div>
    </div>
}



function MenuSeriesRND({select}: {select?: funcSelectSymbols}) {
    const rt = dataGraph.graphs.map((k, i) =><Mini data={k} key={i}/>)
    const [update, setUpdate] = useState(0)

    const tr2 = useCallback( (update: number)=> {
        return <MenuSeries update={update} key={"2323"} select={select}/>
    },[1])
    const tr3 = useCallback(()=> {
        return <Button button={e => <div className={!e ? "msTradeAlt" : "msTradeAlt msTradeActive"}>menu</div>}>
            {(api) => {
                return <DivRnd keyForSave={"tt1232"}
                               key={"sds"}
                               size={{height: 300, width: 300}}
                               className={"fon border fonLight"} // fon border fonLight
                               moveOnlyHeader={true}
                               onCLickClose={api.onClose}
                               limit={{y: {min: 0}}}
                               onUpdate={() => {
                                   // setUpdate(update + 1)
                               }}>
                    {tr2}
                    {/*<MenuSeries update={update} key={"2323"}/>*/}
                </DivRnd>
            }}
        </Button>
    },[13])
    return tr3()
}

function MenuSeriesOld() {
    const rt = dataGraph.graphs.map((k, i) =><Mini data={k} key={i}/>)
    return <div className={"maxSize fon"} style={{display: "flex", flexWrap: "wrap", overflowY: "auto"}}>
        {rt}
    </div>
}

const pageMenuGraph: {page: "old"|"new"} = {page: "old"}
function MenuSeries({update, select}: {update: number, select?: funcSelectSymbols}) {

    const datum = pageMenuGraph
    updateBy(datum)
    return <div className={"maxSize toSpaceColum"}>
        <div style={{display: "flex"}}>
            <div className={datum.page == "old" ? "msTradeActive msTradeAlt" : "msTradeAlt"} onClick={()=>{datum.page = "old"; renderBy(datum)}}>old</div>
            <div className={datum.page == "new" ? "msTradeActive msTradeAlt" : "msTradeAlt"} onClick={()=>{datum.page = "new"; renderBy(datum)}}>new</div>
        </div>
        <div className={"maxSize"}>
            {datum.page=="old" && <MenuSeriesOld key={"MenuSeriesOld"}/>}
            {datum.page=="new" && <MenuSeriesNew update={update} select={select} key={"MenuSeriesNew"}/>}
        </div>
    </div>
}


type funcSelectSymbols = (a : any) => void
const cash = new WeakMap<object, any>()

function MenuSeriesNew({update, select}:{update: number, select?: funcSelectSymbols}) {
    const rt = dataGraph.graphs.map((k, i) =><Mini data={k} key={i}/>)

    const gridSymbols  = useRef<GridApi<any>|null>(null)
    const gridBuffer  = useRef<GridApi<any>|null>(null)

    useMemo(() => {
        gridSymbols.current?.sizeColumnsToFit()
        gridBuffer.current?.sizeColumnsToFit()
    }, [update]);

    const getRowNodeID = ({symbol, exchange, category}: symbolsInfo) => symbol + (category??"") + (exchange??"")
    const getRows = () => {

        const obj = Object.fromEntries(dataGraph.graphs.filter(e=>e.full?.symbolsInfo).map(({full})=> {
            return [
                    (getRowNodeID(full!.symbolsInfo)),
                    {
                        ...full!.symbolsInfo,
                        select: false as boolean,
                        score: 0
                    },
                ]
            }
        ))
        dataGraph.graphs.filter(e=>e.full?.symbolsInfo).forEach(({full, bars})=> {
            // full.buffer
            if (full?.buffer == "profit") obj[getRowNodeID(full!.symbolsInfo)].score = Score(bars.map(e=>e.value))})
        const score = {}
        return {obj, arr: Object.values(obj)}
    }
    type tRowBuffer = {select: boolean, name: string}
    const getRowsBuffer = () => {
        const obj: {[key: string]: tRowBuffer} = {}
        dataGraph.graphs.forEach(e=> {
            if (e.full?.buffer) obj[e.full.buffer] ??= {name: e.full.buffer, select: false}
        })
        return {obj, arr: Object.values(obj)}
    }
    const getData = (()=> {
        const r = cash.get(dataGraph.graphs)
        if (!r) {
            const symbolFilter = getRows()
            const bufferFilter = getRowsBuffer()

            symbolFilter.arr.forEach(e=>e.select = true)
            if (bufferFilter.obj["profit"]) bufferFilter.obj["profit"].select = true
            if (bufferFilter.obj["result all"]) bufferFilter.obj["result all"].select = true

            const d = {symbolFilter, bufferFilter}
            cash.set(dataGraph.graphs, d)
            return d
        }
        return  r
    }) as ()=> {symbolFilter: ReturnType<typeof getRows>, bufferFilter: ReturnType<typeof getRowsBuffer>}

    updateBy(dataGraph,()=>{
        const r = getData()

        gridSymbols.current?.setRowData(r.symbolFilter.arr)
        gridBuffer.current?.setRowData(r.bufferFilter.arr)

        {
            const obj = getData().symbolFilter.obj
            Object.entries(obj).forEach(([id, {select}]) => {
                gridSymbols.current?.getRowNode(id)?.setSelected(select)
            })
        }

        {
            const obj = getData().bufferFilter.obj
            Object.entries(obj).forEach(([id, {select}]) => {
                gridBuffer.current?.getRowNode(id)?.setSelected(select)
            })
        }
    })

    const func = () => {
        const {symbolFilter: {obj: sym}, bufferFilter: {obj: buf}}  = getData()

        dataGraph.graphs.forEach(e=>{
            if (e.full) {
                if (buf[e.full?.buffer ?? ""]?.select && e.full && (
                    !e.full.symbolsInfo || sym[getRowNodeID(e.full.symbolsInfo)]?.select
                )) e.show = true
                else {
                    e.show = false
                }
            }
            else e.show = true
        })

        renderBy(tt78)
    }

    const getTableSymbols = useMemo(()=><AgGridReact
        onGridReady={(e)=> {
            gridSymbols.current = e.api
            gridSymbols.current?.sizeColumnsToFit();

            const obj = getData().symbolFilter.obj
            Object.entries(obj).forEach(([id,{select}])=>{
                gridSymbols.current?.getRowNode(id)?.setSelected(select)
            })

        }}
        className="ag-theme-alpine-dark ag-theme-alpine2 fon"
        headerHeight={20}
        rowData = {getData().symbolFilter.arr}
        suppressCellFocus = {true}
        rowSelection = {`multiple`}
        getRowId={e=>getRowNodeID(e.data)}
        onRowClicked={(e)=>{
            const {obj, arr} = getData().symbolFilter
            arr.forEach(e=>e.select = false)
            e.api.getSelectedNodes()
                .forEach(r=>{
                    if (r.id) obj[r.id].select = true
                })
            func()

            const serverMenu: (tMenuReact)[] = [
                {name: "select", onClick: ()=> {
                    const ar = gridSymbols.current?.getSelectedRows() ?? [e.data];
                        select?.(ar)
                },
                }
            ]
            mouseAdd.map.set("only", serverMenu)


            renderBy(dataGraph)
        }}
        defaultColDef = {{
            headerClass: ()=> ("gridTable-header"),
            resizable: true,
            cellClass: 'cell-wrap-text',
            cellStyle: ({...StyleGridDefault}),
        }}

        columnDefs={[
            {
                field: "symbol"
            },
            {
                field: "exchange"
            },
            {
                field: "category"
            },
            {
                field: "score",
                sortable: true
            }
        ]}
    />, [])

    const getTableBuffer = useMemo(()=><AgGridReact
        onGridReady={(e)=> {
            gridBuffer.current = e.api
            gridBuffer.current?.sizeColumnsToFit();

            const obj = getData().bufferFilter.obj
            Object.entries(obj).forEach(([id,{select}])=>{
                gridBuffer.current?.getRowNode(id)?.setSelected(select)
            })

        }}
        className="ag-theme-alpine-dark ag-theme-alpine2 fon"
        headerHeight={20}
        rowData = {getData().bufferFilter.arr}
        suppressCellFocus = {true}
        rowSelection = {`multiple`}
        getRowId={e=>e.data.name}
        onRowClicked={(e)=>{
            const {obj, arr} = getData().bufferFilter
            arr.forEach(e=>e.select = false)
            e.api.getSelectedRows()
                .forEach(r=>{
                    if (r.name) obj[r.name].select = true
                })
            func()
            renderBy(dataGraph)
        }}
        defaultColDef = {{
            headerClass: ()=> ("gridTable-header"),
            resizable: true,
            cellClass: 'cell-wrap-text',
            cellStyle: ({...StyleGridDefault}),
        }}

        columnDefs={[
            {
                field: "name",
                headerName: ""
            }
        ]}
    />, [])




    const [symbolAll, setSymbolsAll] = useState(false)
    const [bufferAll, setBufferAll] = useState(false)

    return <div className={"maxSize"} style={{padding: 10, display: "flex", flex: "1 1 auto"}}>
        <div className={"maxSize toSpaceColum"} style={{width: "70%"}}>
            <div className={symbolAll? "msTradeAlt msTradeActive" : "msTradeAlt"} onClick={()=>{
                getData().symbolFilter.arr.forEach(e=>e.select=!symbolAll)
                setSymbolsAll(!symbolAll)
                func()
                renderBy(dataGraph)
            }}>all</div>
            {getTableSymbols}
        </div>
        <div style={{width: 10}}></div>
        <div className={"maxSize toSpaceColum"} style={{width: "30%"}}>
            <div className={bufferAll? "msTradeAlt msTradeActive" : "msTradeAlt"} onClick={()=>{
                getData().bufferFilter.arr.forEach(e=>e.select=!bufferAll)
                setBufferAll(!bufferAll)
                func()
                renderBy(dataGraph)
            }}>all</div>
            {getTableBuffer}
        </div>
    </div>
}

export function AppGraph({reSize, select}: { reSize: number, select?: funcSelectSymbols}) {
    updateBy(dataGraph)
    const Buf = useCallback(()=> {
        return <div className={"maxSize"}>
            <div style={{position: "absolute", zIndex: 4}}>
                <MenuSeriesRND select={select}/>
            </div>
            <div className={"maxSize"} style={{position: "absolute", overflow: "auto"}}>
                <ChartComponent graphs={dataGraph.graphs} reSize={reSize} status={dataGraph.status} updateData={dataGraph.updateData}></ChartComponent>
            </div>
        </div>
    },[reSize])
    return (
        <Buf/>
    );
}

type tData = number
function Score(a: tData[]) {
    const compare = (a: number, b: number) => a - b
    const arr = [1,1,1,1,1]
    let min = a.at(-1)!
    let max = min
    let [maxT, minT] = [min, min]
    let b = 1
    let r = 0
    let data = min
    for (let i = a.length - 1; i >= 0; i--) {
        data = a[i]
        if (maxT < data) maxT = data
        if (minT > data) minT = data
        if (data >= min) {
            b++
            if (max < data) max = data
        }
        else {
            if (r < max - min) r = max - min
            max = min = data
            if (b > arr[0]) {
                arr[0] = b
                arr.sort(compare)
            }
            b = 1
        }
    }
    if (maxT < data) maxT = data
    if (minT > data) minT = data
    if (r < max - min) r = max - min
    if (b > arr[0]) {
        arr[0] = b
        arr.sort(compare)
    }

    const res = arr.reduce((l,n) => l * (1 -  n / a.length), 1)
    // console.log({t: maxT - minT, r, res})
    return res * (maxT - minT) / r
}