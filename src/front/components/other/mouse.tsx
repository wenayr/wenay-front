import {MenuR} from "../common/menuR";
import {staticGetAdd} from "../../../utils/sis";
import {renderBy, updateBy} from "../../updateBy";
import React from "react";
import {tMenuReact} from "../common/miniMenu";

export const mouse = {
    name: "mouse",
    value: {
        status: true,
        clicks: 0
    }
}

export const mouseAdd = {
    map: new Map<string, tMenuReact[]>
}

export function MouseR(...agr: Parameters<typeof MenuR>) {
    const datum = staticGetAdd(mouse.name, mouse.value)
    updateBy(datum)
    let other = [...agr[0].other!]
    if (mouseAdd.map.size > 0) {
        if (mouseAdd.map.has("only")) other = mouseAdd.map.get("only")!
        else mouseAdd.map.forEach(e=>{
            other.unshift(...e)
        })

    }
    return MenuR({...agr[0], other, statusOn: datum.status, onUnClick: ()=> {mouseAdd.map.clear() }})
}

export function MouseSwitch({}) {
    const datum = staticGetAdd(mouse.name, mouse.value)
    updateBy(datum)
    return <div
            className={'msTradeAlt msTradeActive'}
            onClick={async ()=>{
                datum.status = !datum.status
                datum.clicks += 1
                renderBy(datum)
            }}
        >{(datum.status ? " mause On " :  " mause Off ") + datum.clicks}</div>
}