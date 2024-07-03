import React, {useEffect, useRef, useState} from "react";
import {FResizableReact} from "../components/common/Resizeble";
import {staticGetAdd} from "../../utils/sis";
import {renderBy, updateBy} from "../updateBy";
import {tMenuReact} from "../components/common/miniMenu";
import {mouseAdd} from "../components/other/mouse";
import {AppGraph} from "../components/graph";
import {LeftPanel, tApiSelect} from "../partPages/leftPanel";
import {getRowIdSymbols} from "../components/selectSymbols/selectSymbol";

const defMain = {
    tableSym: true,
    podval: true,
}

const getMenu = (datum: typeof defMain) => {
    return [
        {name: "style", next: ()=> [
                {name: "podval", onClick: ()=> {
                        datum.podval = !datum.podval;
                        renderBy(datum)
                    }, active: ()=> datum.podval},
                {name: "tableSym", onClick: ()=> {
                        datum.tableSym = !datum.tableSym;
                        renderBy(datum)
                    }, active: ()=> datum.tableSym},
                {name: "tableSym", onClick: ()=> {
                        datum.tableSym = !datum.tableSym;
                        renderBy(datum)
                    }, active: ()=> datum.tableSym},
                {name: "tableSym", onClick: ()=> {
                        datum.tableSym = !datum.tableSym;
                        renderBy(datum)
                    }, active: ()=> datum.tableSym}
            ]}
    ] satisfies tMenuReact[]
}
let updateSize1 = 0
export function PageTester() {
    const [updateSize, updateSizeSet] = useState(0)
    const [showGraph, setShowGraph] = useState(true)
    const updateF = () => {
        updateSizeSet(updateSize + 1)
        setShowGraph(true)
    }

    useEffect(() => {
        const callback = () => updateF()
        window.addEventListener("resize", callback)
        return ()=> window.removeEventListener("resize", callback)
    });

    const datum = staticGetAdd("defMain",defMain)
    updateBy(datum)
    updateBy(datum, () => updateSizeSet(updateSize + 1))
    const apiSelect = useRef<tApiSelect|null>(null);
    return <div className={"maxSize"} onMouseUp={(e)=>{if (e.button==2) {
        mouseAdd.map.set("pageMain", getMenu(datum))
    }}}>
            <div className={"toSpaceColum"} style={{height: "100%", overflow: "auto"}}>
                <div className={"toSpace"} style={{height: "100%"}}>
                    {datum.tableSym && <FResizableReact
                        keyForSave={"s2"}
                        moveHeight={false}
                        enable={{right: true}}
                        size={{width: "20%", height: "100%"}}
                        onResizeStop={updateF}
                        onResize={()=>{
                            if (showGraph) setShowGraph(false)
                        }}
                    >
                        <LeftPanel updateSize={updateSize} getApi={(api)=>{
                            apiSelect.current = api
                        }}/>
                    </FResizableReact>}
                    <div className={"maxSize toSpaceOther"}>
                        <div className={"maxSize"}  style={{
                            height: "calc(100% - 20px)"}}>
                            {showGraph && <div className={"maxSize"} style={{position: "relative"}}>
                                <AppGraph reSize={updateSize} select={a => {
                                    const selected = apiSelect.current?.selected
                                    if (selected) {
                                        Object.keys(selected).forEach(e=>{delete selected[e]})
                                        a.forEach(e => {
                                            selected[getRowIdSymbols(e)] = {...e}
                                        })
                                        renderBy(selected)
                                    }
                                }}/>
                                {/*<div className={"maxSize"} style={{position: "absolute", overflow: "auto"}}>*/}
                                {/*    */}
                                {/*</div>*/}
                            </div>}
                        </div>
                    </div>
                </div>
                {datum.podval && <FResizableReact
                    keyForSave={"s1"}
                    enable={{top: true}}
                    size={{width: "100%", height: "20%"}}
                    onResize={()=>{
                        if (showGraph) setShowGraph(false)
                    }}
                    onResizeStop={updateF}
                >
                    <div className={"toSpaceOther borderTop maxSize"}>

                    </div>
                </FResizableReact>}
            </div>
    </div>
}
