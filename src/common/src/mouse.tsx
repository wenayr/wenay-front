import {MenuR} from "./menuR";
// import {staticGetAdd} from "../../../utils/sis";
import {renderBy, updateBy} from "../updateBy";
import React from "react";
import {tMenuReact} from "./miniMenu";

export const mouse = {
    name: "mouse",
    value: {
        status: true,
        clicks: 0
    }
}

export const mouseAdd = {
    map: new Map<string, (tMenuReact|false)[]>
}



/**
 * Executes the MouseR method.
 *
 * This method takes multiple arguments of type MenuR and performs the following operations:
 * 1. Retrieves the mouse value from the mouse variable.
 * 2. Updates the data using the retrieved mouse value.
 * 3. Initializes the 'other' variable with an array of tMenuReact objects or false.
 * 4. If there are additional elements in the mouseAdd map, they are added to the 'other' array.
 * 5. Returns the result of invoking the MenuR method with the updated arguments.
 *
 * @param {...Parameters<typeof MenuR>} agr - An array of arguments for the MenuR method.
 * @returns {ReturnType<typeof MenuR>} - The result of invoking the MenuR method.
 */
export function MouseR(...agr: Parameters<typeof MenuR>) {
    const datum = mouse.value //staticGetAdd(mouse.name, mouse.value)
    updateBy(datum)
    let other:(tMenuReact|false)[]  = [...(agr[0]?.other! ?? [])]
    if (mouseAdd.map.size > 0) {
        if (mouseAdd.map.has("only")) other = mouseAdd.map.get("only")!
        else mouseAdd.map.forEach(e=>{
            other.unshift(...e)
        })

    }
    return MenuR({...(agr[0] ?? []), other, statusOn: datum.status, onUnClick: ()=> {mouseAdd.map.clear() }})
}

export const MouseApi = {
    info: mouse,
    map: mouseAdd.map,
    draw(){
        renderBy(mouse.value)
    },
    MouseReact: MouseR
}

export function MouseSwitch({}) {
    const datum = mouse.value //staticGetAdd(mouse.name, mouse.value)
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
