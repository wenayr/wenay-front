import React, {useEffect, useMemo, useRef, useState} from "react";
import {Rnd} from "react-rnd";
import {renderBy, updateBy} from "../../common/updateBy";

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
    header?: React.ReactElement | boolean,
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

/**
 * This method is used to render a resizable and draggable component with optional header and close button.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content inside the component.
 * @param {string} props.keyForSave - The key used to save the component's position and size.
 * @param {Object} props.position - The initial position of the component.
 * @param {Object} props.size - The initial size of the component.
 * @param {boolean} [props.overflow=true] - Whether to enable overflow scrolling on the component.
 * @param {number} [props.zIndex=9] - The z-index of the component.
 * @param {Function} [props.onUpdate] - Callback function called when the component is resized.
 * @param {Function} [props.disableDragging] - Callback function to disable dragging.
 * @param {string} [props.className] - The CSS class name for the component.
 * @param {React.ReactNode} [props.header] - The header component to be displayed. If not provided, a default header will be used.
 * @param {boolean} [props.moveOnlyHeader] - Whether to allow moving the component only by dragging the header.
 * @param {Object} [props.limit] - The limits for the component's position.
 * @param {Object} [props.limit.x] - The x-axis limits for the component's position.
 * @param {number} [props.limit.x.min] - The minimum x-axis limit.
 * @param {number} [props.limit.x.max] - The maximum x-axis limit.
 * @param {Object} [props.limit.y] - The y-axis limits for the component's position.
 * @param {number} [props.limit.y.min] - The minimum y-axis limit.
 * @param {number} [props.limit.y.max] - The maximum y-axis limit.
 * @param {Function} [props.onCLickClose] - Callback function called when the close button is clicked.
 * @returns {React.ReactNode} - The rendered component.
 */
export function DivRndBase({
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
        const t = id
        openWindows.ar.push(t)
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
