import React, {ReactElement, useEffect, useRef, useState} from "react";

export const StyleOtherRow: React.CSSProperties = {display: "flex", flexDirection: "row", flex: "auto 1 1"}
export const StyleOtherColum: React.CSSProperties = {display: "flex", flexDirection: "column", flex: "auto 0 1"}

export function useOutside(ref: React.RefObject<HTMLDivElement>, outsideClicked: () => void, status: boolean = true) {
    useEffect(() => {
        if (status) {
            function handleClickOutside(event: any) {
                if (ref.current && !ref.current.contains(event.target)) outsideClicked();
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [ref, status]);
}

type key = React.Key | null | undefined
type tChildrenFunc = (api: {onClose: () => void}) => ReactElement | React.JSX.Element
type tChildrenEl = ReactElement | React. ReactNode
type tChildren = tChildrenEl | tChildrenFunc
type tButtonBase = {
    children: tChildren,
    button: ReactElement | ((status: boolean) => ReactElement),
    style?: React.CSSProperties,
    className?: string
}
type tButton = tButtonBase & {
    statusDef?: boolean, keySave?: string,
    outClick?: boolean | (() => void), zIndex?: number,
}
type tState = {
    state: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
}

export function OutsideClick({children, outsideClick, zIndex, key, status = true}: {
    outsideClick: () => void,
    zIndex?: number,
    key?: key,
    children: tChildrenEl,
    status?: boolean
}) {
    const ref = useRef<HTMLDivElement>(null);
    useOutside(ref, outsideClick, status);
    return <div ref={ref} key={key} style={{width: "min-content", zIndex}}>{children}</div>;
}

function ButtonBase({children, button, style = {}, className = "", state: [a, setA]}: tButtonBase & tState) {
    return <div style={{position: "relative", width: "min-content", ...style}} className={className}>
        <div onClick={() => setA(!a)}>
            {typeof button == "function" ? button(a) : button}
        </div>
        {a && (typeof children == "function" ? children({onClose: () => setA(!a)}) : children)}
    </div>
}

const saveStatus: {[key: string]: boolean} = {}
export function Button({keySave, statusDef, outClick, ...data}: tButton) {
    if (keySave && saveStatus[keySave]) statusDef = saveStatus[keySave]
    const state = useState(statusDef ?? false)
    return outClick ? OutsideClick({
            status: state[0],
            children: ButtonBase({...data, state}),
            outsideClick: () => {
                state[1](false);
                if (typeof outClick == "function") outClick()
            }
        })
        : ButtonBase({...data, state})
}

export const ButtonOutClick: typeof Button = ({outClick = true, ...a}) => Button({...a, outClick})

export function ButtonAbs(...a: Parameters<typeof Button>) {
    const children: typeof a[0]["children"] = (api) =>
        <div style={{position: "relative"}}>
            <div style={{
                position: "absolute",
                zIndex: a[0].zIndex ?? 9
            }}>{typeof a[0].children == "function" ? a[0].children(api) : a[0].children}</div>
        </div>
    return Button({...a[0], children})
}