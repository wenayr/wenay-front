// import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
// import { Drag2Props } from "./RNDFunc3";
//
//
// // Хук для обработки логики перетаскивания
// const useDragHandlers = ({
//                              onStart,
//                              onStop,
//                              last,
//                             y: y_, x: x_
//                          }: {
//     x?: number,
//     y?: number,
//     onStart?: Drag2Props["onStart"]
//     onStop?: Drag2Props["onStop"]
//     last?: React.MutableRefObject<{ x: number; y: number }>
// }) => {
//
//
//     const [x, setX] = useState(x_ ?? 0);
//     const [y, setY] = useState(y_ ?? 0);
//     const offsetMouse = useRef({ x, y});
//     const offsetTouch = useRef<{ x: number; y: number; id: number } | null>(null);
//     const [draggingMouse, setDraggingMouse] = useState(false)
//     const [draggingTouch, setDraggingTouch] = useState(false)
//     const posRef = useRef<{ x: number; y: number }>(last?.current ?? { x, y });
//
//     useEffect(() => {
//         if (!draggingMouse && !draggingTouch) {
//             onStop?.();
//             return;
//         }
//
//         let cleanupMouse = () => {};
//         let cleanupTouch = () => {};
//
//         if (draggingMouse) {
//             const handleMouseMove = (e: MouseEvent) => {
//                 const newX = e.clientX + offsetMouse.current.x;
//                 const newY = e.clientY + offsetMouse.current.y;
//                 posRef.current = { x: newX, y: newY };
//                 setX((l)=> newX)
//                 setY((l)=> newX)
//             };
//
//             const handleMouseUp = () => {
//                 document.removeEventListener("mousemove", handleMouseMove);
//                 document.removeEventListener("mouseup", handleMouseUp);
//                 setDraggingMouse(false);
//             };
//
//             document.addEventListener("mousemove", handleMouseMove);
//             document.addEventListener("mouseup", handleMouseUp);
//             onStart?.();
//
//             cleanupMouse = () => {
//                 document.removeEventListener("mousemove", handleMouseMove);
//                 document.removeEventListener("mouseup", handleMouseUp);
//             };
//         }
//
//         if (draggingTouch) {
//             const handleTouchMove = (e: TouchEvent) => {
//                 if (!offsetTouch.current) return;
//                 const t = Array.from(e.changedTouches).find(
//                     (touch) => touch.identifier === offsetTouch.current!.id
//                 );
//
//                 if (t) {
//                     const newX = t.clientX + offsetTouch.current.x;
//                     const newY = t.clientY + offsetTouch.current.y;
//                     posRef.current = { x: newX, y: newY };
//                     setX((l)=> newX)
//                     setY((l)=> newX)
//                 }
//             };
//
//             const handleTouchEnd = (e: TouchEvent) => {
//                 if (!offsetTouch.current) return;
//                 const ended = Array.from(e.changedTouches).find(
//                     (touch) => touch.identifier === offsetTouch.current!.id
//                 );
//
//                 if (ended) {
//                     offsetTouch.current = null;
//                     document.removeEventListener("touchmove", handleTouchMove);
//                     document.removeEventListener("touchend", handleTouchEnd);
//                     setDraggingTouch(false);
//                 }
//             };
//
//             document.addEventListener("touchmove", handleTouchMove);
//             document.addEventListener("touchend", handleTouchEnd);
//             onStart?.();
//
//             cleanupTouch = () => {
//                 document.removeEventListener("touchmove", handleTouchMove);
//                 document.removeEventListener("touchend", handleTouchEnd);
//             };
//         }
//
//         return () => {
//             cleanupMouse();
//             cleanupTouch();
//         };
//     }, [draggingMouse, draggingTouch, onStart, onStop]);
//     return [x, y, draggingMouse, draggingTouch] as const
// };
//
//
//
//
//
//
// export function Drag33({
//                            children,
//                            onX,
//                            onY,
//                            x: x_ = 0,
//                            y: y_ = 0,
//                            right = false,
//                            last,
//                            onStart,
//                            onStop
//                        }: Drag2Props) {
//
//
//     const [x, y, draggingMouse, draggingTouch] = useDragHandlers({ onStart, onStop, last, y: y_, x: x_})
//
//     useLayoutEffect(() => {
//         if (last) last.current = posRef.current;
//     });
//
//     const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         offsetMouse.current = {
//             x: posRef.current.x - e.clientX,
//             y: posRef.current.y - e.clientY
//         };
//         setDraggingMouse(true);
//     };
//
//     const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
//         const t = e.changedTouches[0];
//         if (t) {
//             offsetTouch.current = {
//                 x: posRef.current.x - t.clientX,
//                 y: posRef.current.y - t.clientY,
//                 id: t.identifier
//             };
//             setDraggingTouch(true);
//         }
//     };
//
//     return (
//         <div
//             style={{
//                 position: "absolute",
//                 left: right ? undefined : x,
//                 right: right ? -x : undefined,
//                 top: posRef.current.y
//             }}
//             onMouseDown={handleMouseDown}
//             onTouchStart={handleTouchStart}
//         >
//             {children}
//         </div>
//     );
// }