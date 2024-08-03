// document.addEventListener('mousedown',
import {renderBy} from "../updateBy";
import {useEffect} from "react";

export const KeyDown = {
    key: "" as string
}

export function addDownAnyKey() {
    useEffect(()=>{
        const func :(this:Document, ev: KeyboardEvent) => any = (ev) =>{
            console.log(ev);
            KeyDown.key = ev.key
            renderBy(KeyDown)
        }
        document.addEventListener('keydown', func)
        return ()=> {
            document.removeEventListener('keydown', func)
        }
    }, [true])
}