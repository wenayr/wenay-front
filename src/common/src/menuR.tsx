import React, {useRef} from "react";
import {FMenuRBase, tMenuReact, tMenuReactStrictly} from "./miniMenu";
import {DivOutsideClick} from "./commonFuncReact";

export function MenuR({children, other = [], statusOn = true, onUnClick, zIndex, className}: {
    children: React.ReactElement,
    zIndex?: number,
    other?: (tMenuReact)[],
    statusOn?: boolean,
    onUnClick?: (e: boolean) => void,
    className?: (active?: boolean) => string,
}) {
    const data = {x: 0, y: 0}
    const [show, setShow] = React.useState<{
        status: boolean,
        plusMenu?: tMenuReactStrictly[],
        coordinate?: {x: number, y: number}
    }>({status: false})
    const timeEvent = useRef(Date.now());
    let x = 0, y = 0
    const touchTime = useRef<null | number>(null);
    return <div className={"maxSize"} style={{position: "relative"}}
                onContextMenu={e => {
                    if (statusOn) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }}
                ref={(e) => {
                    if (e) {
                        const r = e.getBoundingClientRect()
                        data.x = r.x
                        data.y = r.y
                    }
                }}
                onTouchStart={(e) => {
                    if (x == 0) x = e.touches[0].screenX
                    if (y == 0) y = e.touches[0].screenY
                    touchTime.current = Date.now()
                }}
                onTouchMove={(e) => {
                    let x2 = e.touches[0].screenX
                    let y2 = e.touches[0].screenY
                    let pX = e.touches[0].pageX
                    let pY = e.touches[0].pageY
                    if ((Math.abs(x2 - x) / pX > 0.05) || (Math.abs(y2 - y) / pY > 0.05)) {
                        touchTime.current = null
                    }
                }}
                onTouchEnd={(e) => {
                    if (statusOn) {
                        if (touchTime.current && Date.now() - touchTime.current > 300) {
                            touchTime.current = null
                            x = y = 0
                            setShow({
                                status: true,
                                coordinate: {
                                    x: e.changedTouches[0].clientX - data.x,
                                    y: e.changedTouches[0].clientY - data.y
                                }
                            })
                        }
                    }
                }}
                onDoubleClick={(event) => {
                    timeEvent.current = Date.now()
                }}
                onMouseUp={(event) => {
                    if (statusOn) {
                        if (event.button == 2 || Date.now() - timeEvent.current < 300) {
                            setShow({status: true, coordinate: {x: event.clientX - data.x, y: event.clientY - data.y}})
                        }
                    }
                }}
    >
        {children}
        {show.status && statusOn &&
            <DivOutsideClick
                outsideClick={() => {
                    onUnClick?.(false)
                    setShow({status: false})
                }}
            >
                <FMenuRBase className={className} data={[...(show.plusMenu ?? []), ...(other.filter(e => e) as tMenuReactStrictly[])]}
                            coordinate={{...show.coordinate!}} zIndex={zIndex}/>
            </DivOutsideClick>
        }
    </div>
}

