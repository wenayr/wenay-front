import React, {useEffect, useMemo, useRef, useState} from "react";
import {Rnd} from "react-rnd";
import {renderBy, updateBy} from "../../updateBy";

type tPosition = {x: number, y: number}
type tSize = {height: number | string, width: number | string}
type tRND = {position: tPosition, size: tSize}
type tDivRndBase = {
    zIndex?: number,
    disableDragging?: () => boolean,
    keyForSave?: string,
    onUpdate?: (data: any) => void,
    position?: tPosition,
    size?: tSize,
    moveOnlyHeader?: boolean,
    onCLickClose?: () => void,
    header?: React.ReactElement,
    overflow?: boolean,
    limit?: {
        x?: {max?: number, min?: number},
        y?: {max?: number, min?: number},
    }
    // getApi?: (api: tExRNDApi)=> void
    children: React.ReactElement | ((update: number) => React.ReactElement),
    className?: string
}
// карта всех размеров всплывающих окон
export const ExRNDMap = new Map<string, tRND>();

// limit={{x:{min:0}, y:{min:0}}}
let k = 0
const openWindows: {ar: {k: number}[]} = {ar: []}

export const DivRnd: typeof DivRndBase = (a) => {
    const Base = ({update}: {update: number}) => typeof a.children == "function" ? a.children(update) : a.children
    const ff = (update: number) => useMemo(() => <Base update={update}/>, [update])

    return DivRndBase({...a, children: ff})
}

function DivRndBase({
                            children,
                            keyForSave: ks,
                            position,
                            size,
                            overflow = true,
                            zIndex = 9,
                            onUpdate,
                            disableDragging,
                            className,
                            header,
                            moveOnlyHeader,
                            limit,
                            onCLickClose
                        }: tDivRndBase) {
    if (onCLickClose && !limit) limit = {y: {min:0}}

    const positionDef: tPosition = {x: 0, y: 0, ...(position ?? {})}
    const sizeDef: tSize = {height: 0, width: 0, ...(size ?? {})}
    let map: tRND | undefined;
    if (ks) map = ExRNDMap.get(ks) ?? ExRNDMap.set(ks, {size: sizeDef, position: positionDef}).get(ks)
    position = map?.position ?? positionDef
    size = map?.size ?? sizeDef

    const id2 = useRef({k: k++});
    const id = id2.current
    const [zIndexX, setZIndexX] = useState(0)
    // const [id, setId] = useState({k: k++})
    const [x, setX] = React.useState(position?.x ?? 0)
    const [y, setY] = React.useState(position?.y ?? 30)
    const [width, setWidth] = React.useState(size?.width ?? 400)
    const [height, setHeight] = React.useState(size?.height ?? 400)
    const [drag, setDrag] = React.useState(true)
    const [update, setUpdate] = React.useState(0)
    const zindex = useRef(zIndexX);
    zindex.current = zIndexX
    updateBy(openWindows, ()=> {
        const z = openWindows.ar.findIndex((v) => v.k == id.k)
        if (z >= 0 && z != zindex.current) {
            setZIndexX(z)
        }
    })
    useEffect(() => {
        openWindows.ar.push(id)
        renderBy(openWindows)
        return () => {
            const z = openWindows.ar.findIndex((v) => v.k == id.k)
            if (z>=0) {
                openWindows.ar.splice(z, 1)
                renderBy(openWindows)
            }
        }
    },[true])

    size.height = height
    size.width = width
    position.x = x
    position.y = y

    const headerD =
        <div onMouseLeave={() => {
            setDrag(true)
        }}
             onMouseEnter={() => {
                 setDrag(false)
             }}
        >
            {header ?? <div style={{
                height: 20, width: "100%",
                backgroundImage: "repeating-linear-gradient(139deg, hsla(0,0%,100%,.1), hsla(0,0%,100%,.1) 15px, transparent 0, transparent 30px)"
            }}></div>}
        </div>

    return <Rnd disableDragging={(disableDragging?.() || (moveOnlyHeader && drag)) ?? false}
                style={{
                    zIndex: zIndexX * 2 + zIndex
                }}
                className={className as string}
                onDragStop={(e, {x, y}) => {
                    if (limit) {
                        if (limit.x?.min != undefined && limit.x.min > x) x = limit.x.min
                        if (limit.x?.max != undefined && limit.x.max < x) x = limit.x.max

                        if (limit.y?.min != undefined && limit.y.min > y) y = limit.y.min
                        if (limit.y?.max != undefined && limit.y.max < y) y = limit.y.max

                    }
                    setX(x)
                    setY(y)
                }}
                onResizeStop={(e, dir, elementRef, delta, {x, y}) => {
                    setX(x)
                    setY(y)
                    setHeight(+height + delta.height)
                    setWidth(+width + delta.width)
                    setUpdate(update + 1)
                }}
                onResize={(e, dir, elementRef, delta, position) => {
                    onUpdate?.({e, dir, elementRef, delta, position});
                }}
                position={position}
                size={{width, height}}
                default={{...position, ...size}}
    >
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            flex: "auto"
        }}
             onMouseDown={()=>{
                 // ставим на макс высот - если мы не на ней
                 const z = openWindows.ar.findIndex((v) => v == id)
                 if (z != openWindows.ar.length - 1 || zindex.current != z) {
                     const buf = openWindows.ar[z]
                     openWindows.ar.splice(z,1)
                     openWindows.ar.push(buf)
                     renderBy(openWindows)
                 }
             }}
        >
            {
                moveOnlyHeader || header ? headerD : null
            }
            {
                <div className={"maxSize"}
                     style={{overflow: overflow ? "auto" : undefined}}>
                    {typeof children == "function" ? children(update) : children}
                </div>
            }
            {
                onCLickClose && <div key={"323"} className={"msTradeAlt"}
                                     style={{position: "absolute", right: -15, top: -15,  fontSize: "32px", zIndex: zIndexX * 2 + zIndex + 1 }}
                                     onClick={onCLickClose}>x</div>
            }
        </div>
    </Rnd>
}
