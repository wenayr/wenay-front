import { useRef, useState, useEffect } from "react";

export interface Position {
    x: number;
    y: number;
}

export interface UseDraggableReturn {
    position: Position;
    dragProps: {
        onMouseDown: React.MouseEventHandler<HTMLDivElement>;
        onTouchStart: React.TouchEventHandler<HTMLDivElement>;
    };
}

type DragEndCallback = (finalPosition: Position) => void;

export function useDraggable(
    initialX: number = 0,
    initialY: number = 0,
    timeOut: number = 500,
    onDragEnd?: DragEndCallback
): UseDraggableReturn {
    const [position, setPosition] = useState<Position>({ x: initialX, y: initialY });
    const offsetMouse = useRef<Position>({ x: 0, y: 0 });
    const offsetTouch = useRef<{ x: number; y: number; id: number } | null>(null);
    const [draggingMouse, setDraggingMouse] = useState(false);
    const [draggingTouch, setDraggingTouch] = useState(false);

    // Таймеры для определения длинного нажатия
    const holdTimerMouse = useRef<number | null>(null);
    const holdTimerTouch = useRef<number | null>(null);

    const cancelMouseHold = () => {
        if (holdTimerMouse.current) {
            clearTimeout(holdTimerMouse.current);
            holdTimerMouse.current = null;
        }
        document.removeEventListener("mouseup", handleMouseUpForHold);
    };

    const handleMouseUpForHold = () => {
        cancelMouseHold();
    };

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        offsetMouse.current = {
            x: position.x - e.clientX,
            y: position.y - e.clientY,
        };
        if (timeOut) {
            holdTimerMouse.current = window.setTimeout(() => {
                setDraggingMouse(true);
                holdTimerMouse.current = null;
                document.removeEventListener("mouseup", handleMouseUpForHold);
            }, timeOut);
            document.addEventListener("mouseup", handleMouseUpForHold);
        }
    };

    const cancelTouchHold = () => {
        if (holdTimerTouch.current) {
            clearTimeout(holdTimerTouch.current);
            holdTimerTouch.current = null;
        }
        document.removeEventListener("touchend", handleTouchEndForHold);
    };

    const handleTouchEndForHold = () => {
        cancelTouchHold();
    };

    const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
        const touch = e.changedTouches[0];
        if (!touch) return;
        offsetTouch.current = {
            x: position.x - touch.clientX,
            y: position.y - touch.clientY,
            id: touch.identifier,
        };
        if (timeOut) {
            holdTimerTouch.current = window.setTimeout(() => {
                setDraggingTouch(true);
                holdTimerTouch.current = null;
                document.removeEventListener("touchend", handleTouchEndForHold);
            }, timeOut);
            document.addEventListener("touchend", handleTouchEndForHold);
        }
    };

    useEffect(() => {
        if (draggingMouse) {
            const handleMouseMove = (e: MouseEvent) => {
                const newX = e.clientX + offsetMouse.current.x;
                const newY = e.clientY + offsetMouse.current.y;
                setPosition({ x: newX, y: newY });
            };

            const handleMouseUp = (e: MouseEvent) => {
                // Остальные действия по завершению перетаскивания мышью
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                setDraggingMouse(false);
                if (onDragEnd) {
                    onDragEnd({ ...position });
                }
                // Сбрасываем смещение
                offsetMouse.current = { x: 0, y: 0 };
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [draggingMouse, onDragEnd, position]);

    useEffect(() => {
        if (draggingTouch) {
            const handleTouchMove = (e: TouchEvent) => {
                if (!offsetTouch.current) return;
                const theTouch = Array.from(e.changedTouches).find(
                    (t) => t.identifier === offsetTouch.current?.id
                );
                if (!theTouch) return;
                const newX = theTouch.clientX + offsetTouch.current.x;
                const newY = theTouch.clientY + offsetTouch.current.y;
                setPosition({ x: newX, y: newY });
            };

            const handleTouchEnd = (e: TouchEvent) => {
                if (!offsetTouch.current) return;
                const ended = Array.from(e.changedTouches).find(
                    (t) => t.identifier === offsetTouch.current?.id
                );
                if (ended) {
                    document.removeEventListener("touchmove", handleTouchMove);
                    document.removeEventListener("touchend", handleTouchEnd);
                    setDraggingTouch(false);
                    if (onDragEnd) {
                        onDragEnd({ ...position });
                    }
                    offsetTouch.current = null;
                }
            };

            document.addEventListener("touchmove", handleTouchMove);
            document.addEventListener("touchend", handleTouchEnd);

            return () => {
                document.removeEventListener("touchmove", handleTouchMove);
                document.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [draggingTouch, onDragEnd, position]);

    return {
        position,
        dragProps: {
            onMouseDown: handleMouseDown,
            onTouchStart: handleTouchStart,
        },
    };
}

export function DraggableComponent() {
    const {position, dragProps} = useDraggable(0, 0);

    return (
        <div
            style={{
                position: "absolute",
                left: position.x,
                top: position.y,
            }}
        >
            <div

                {...dragProps}
                style={{
                    width: 100,
                    height: 100,
                    background: "lightblue",
                    cursor: "grab",
                }}
            >
                Перемещаемый элемент
            </div>
        </div>
    );
}
