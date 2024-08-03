import React from "react";
import {InputPageModal} from "./input";

export function inputModal({setModalJSX, func, name, txt}: {
    txt?: string,
    name?: string,
    setModalJSX: React.Dispatch<React.SetStateAction<React.JSX.Element | null>>,
    func: (txt: string) => void
}) {
    setModalJSX(<InputPageModal callback={txt => {
        func(txt)
        setModalJSX(null)
    }} outClick={() => setModalJSX(null)} name={name ?? "name"} txt={txt}/>)
}

export function confirmModal({setModalJSX, func}: {
    setModalJSX: React.Dispatch<React.SetStateAction<React.JSX.Element | null>>,
    func: () => any
}) {
    setModalJSX(<InputPageModal callback={txt => {
        if (txt == "111") func()
        setModalJSX(null)
    }} outClick={() => setModalJSX(null)} name={"password 111"}/>)
}
