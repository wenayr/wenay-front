import React, {
    memo,
    ReactNode,
    useEffect, useLayoutEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { Rnd } from "react-rnd";
import { renderBy, updateBy } from "../updateBy";

type tPosition = { x: number; y: number };
type tSize = { height: number | string; width: number | string };
type tRND = { position: tPosition; size: tSize };
type tDivRndBase = {
    zIndex?: number;
    disableDragging?: () => boolean;
    keyForSave?: string;
    onUpdate?: (data: any) => void;
    position?: tPosition;
    size?: tSize;
    moveOnlyHeader?: boolean;
    onCLickClose?: () => void;
    header?: React.ReactElement | boolean;
    overflow?: boolean;
    sizeByWindow?: boolean;
    limit?: {
        x?: { max?: number; min?: number };
        y?: { max?: number; min?: number };
    };
    children: React.ReactElement | ((update: number) => React.ReactElement);
    className?: string;
};

// Карта всех размеров всплывающих окон
export const ExRNDMap3 = new Map<string, tRND>();

// limit={{x:{min:0}, y:{min:0}}}
let k = 0;
const openWindows: { ar: { k: number }[] } = { ar: [] };

export const DivRnd3: typeof DivRndBase3 = (a) => {
    // const Base = ({ update }: { update: number }) => {
    //     console.log(update)
    //     return typeof a.children === "function" ? a.children(update) : a.children;
    // }
    const Base2 = ({ update }: { update: number }) => {
        return typeof a.children === "function" ? a.children(update) : a.children;
    }
    // const ff = (update: number) => useMemo(() => <Base update={update} />, [update]);
    const ff = (update: number) => useMemo(() => <Base2 update={update} />, [typeof a.children === "function"  ? update : true]);

    return DivRndBase3({ ...a, children: ff });
};


/**
 * Компонент-обёртка над react-rnd.
 * Обеспечивает перетаскивание и изменение размеров, опциональный заголовок и кнопку закрытия.
 */
export function DivRndBase3({
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
                                onCLickClose,
                                sizeByWindow = true
                            }: tDivRndBase) {
    if (onCLickClose && !limit) {
        limit = { y: { min: 0 } };
    }

    const positionDef: tPosition = { x: 0, y: 0, ...(position ?? {}) };
    const sizeDef: tSize = { height: 0, width: 0, ...(size ?? {}) };

    // Если есть ключ — данные положения и размера храним в карте
    let map: tRND | undefined;
    if (ks) {
        map = ExRNDMap3.get(ks) ?? ExRNDMap3.set(ks, { size: sizeDef, position: positionDef }).get(ks);
    }
    position = map?.position ?? positionDef;
    size = map?.size ?? sizeDef;

    // Если нужно вписаться в окно по размеру
    if (sizeByWindow) {
        // ...здесь можно добавить логику проверки/коррекции на window.innerWidth, window.innerHeight и т.д.
    }

    const id2 = useRef({ k: k++ });
    const id = id2.current;
    const [zIndexX, setZIndexX] = useState(0);

    const lastC = useRef<{ x: number; y: number } | null>(null);
    const lastT = useRef<{ x: number; y: number; id: number } | null>(null);
    const [a, setA] = useState(false);
    const [b, setB] = useState(false);

    const [x, setX] = useState(position?.x ?? 0);
    const [y, setY] = useState(position?.y ?? 30);
    const [width, setWidth] = useState(size?.width ?? 400);
    const [height, setHeight] = useState(size?.height ?? 400);
    const [update, setUpdate] = useState(0);

    const zindex = useRef(zIndexX);
    zindex.current = zIndexX;

    // Обновляем zIndex окна, если оно поднято сверху
    updateBy(openWindows, () => {
        const z = openWindows.ar.findIndex((v) => v.k === id.k);
        if (z >= 0 && z !== zindex.current) {
            setZIndexX(z);
        }
    });

    /**
     * Хук для перетаскивания мышкой (a) и перетаскивания на тач-устройствах (b).
     * Снимаем подписки при размонтировании и при изменении зависимостей (a/b).
     */
    useEffect(() => {
        // Мышь
        const mouseMoveHandler = (e: MouseEvent) => {
            e.stopPropagation();
            if (lastC.current == null) {
                lastC.current = {
                    x: e.clientX,
                    y: e.clientY
                };
            }
            const data = lastC.current;
            if (e.buttons === 1) {
                let newX = e.clientX + data.x;
                let newY = e.clientY + data.y;
                if (limit) {
                    if (limit.x?.min !== undefined && limit.x.min > newX) newX = limit.x.min;
                    if (limit.x?.max !== undefined && limit.x.max < newX) newX = limit.x.max;

                    if (limit.y?.min !== undefined && limit.y.min > newY) newY = limit.y.min;
                    if (limit.y?.max !== undefined && limit.y.max < newY) newY = limit.y.max;
                }
                setX(newX);
                setY(newY);
            } else {
                mouseUpHandler();
            }
        };
        const mouseUpHandler = () => {
            document.removeEventListener("mouseup", mouseUpHandler);
            document.removeEventListener("mousemove", mouseMoveHandler);
            lastC.current = null;
            setA(false);
        };

        // Тач
        const touchMoveHandler = (e: TouchEvent) => {
            const data = lastT.current;
            if (!data) return touchEndHandler(e);

            let t: Touch | null = null;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const zz = e.changedTouches[i];
                if (zz.identifier === data.id) t = zz;
            }
            if (!t) return;

            let newX = t.clientX + data.x;
            let newY = t.clientY + data.y;
            if (limit) {
                if (limit.x?.min !== undefined && limit.x.min > newX) newX = limit.x.min;
                if (limit.x?.max !== undefined && limit.x.max < newX) newX = limit.x.max;

                if (limit.y?.min !== undefined && limit.y.min > newY) newY = limit.y.min;
                if (limit.y?.max !== undefined && limit.y.max < newY) newY = limit.y.max;
            }
            setX(newX);
            setY(newY);
        };
        const touchEndHandler = (e: TouchEvent) => {
            const data = lastT.current;
            if (data) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    const zz = e.changedTouches[i];
                    if (zz.identifier === data.id) {
                        lastT.current = null;
                    }
                }
            }
            if (lastT.current == null) {
                document.removeEventListener("touchend", touchEndHandler);
                document.removeEventListener("touchmove", touchMoveHandler);
                setB(false);
            }
        };

        // Если активирован режим перетаскивания мышью
        if (a) {
            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        }
        // Если активирован режим перетаскивания для тач-событий
        if (b) {
            document.addEventListener("touchmove", touchMoveHandler);
            document.addEventListener("touchend", touchEndHandler);
        }

        // Возвращаем функцию очистки для размонтирования и при изменениях a/b:
        return () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
            document.removeEventListener("touchmove", touchMoveHandler);
            document.removeEventListener("touchend", touchEndHandler);
        };
    }, [a, b, limit, x, y]);

    // При первой отрисовке добавляем "окно" в массив, при размонтировании — удаляем
    useEffect(() => {
        openWindows.ar.push(id);
        renderBy(openWindows);
        return () => {
            const z = openWindows.ar.findIndex((v) => v.k === id.k);
            if (z >= 0) {
                openWindows.ar.splice(z, 1);
                renderBy(openWindows);
            }
        };
    }, []);

    // Обновляем в карте координаты и размер, если задан keyForSave
    if (size) {
        size.height = height;
        size.width = width;
    }
    if (position) {
        position.x = x;
        position.y = y;
    }

    const headerD = (
        <div
            ref={(el) => {
                if (el && sizeByWindow) {
                    const rect = el.getBoundingClientRect();
                    if (rect.x < 0) setX(x - rect.x);
                    if (rect.y < 0) setY(y - rect.y);

                    // Пример небольшой коррекции, если окно слишком большое
                    if (typeof width === "number" && width > window.innerWidth) {
                        setWidth(window.innerWidth);
                    }
                    if (typeof height === "number" && height > window.innerHeight) {
                        setHeight(window.innerHeight);
                    }
                }
            }}
            onTouchStart={(e) => {
                const t = e.changedTouches[0];
                if (t) {
                    lastT.current = {
                        x: x - t.clientX,
                        y: y - t.clientY,
                        id: t.identifier
                    };
                }
                setB(true);
            }}
            onMouseDown={(e) => {
                lastC.current = {
                    x: x - e.clientX,
                    y: y - e.clientY
                };
                setA(true);
            }}
            style={{
                userSelect: "none",
                cursor: "grabbing"
            }}
        >
            {header ?? (
                <div
                    style={{
                        height: 20,
                        width: "100%",
                        backgroundImage:
                            "repeating-linear-gradient(139deg, hsla(0,0%,100%,.1), hsla(0,0%,100%,.1) 15px, transparent 0, transparent 30px)"
                    }}
                ></div>
            )}
        </div>
    );

    return (
        <Rnd
            disableDragging={true}
            style={{
                zIndex: zIndexX * 2 + zIndex
            }}
            className={className}
            onResizeStop={(e, dir, elementRef, delta, { x: nx, y: ny }) => {
                setX(nx);
                setY(ny);
                setHeight(+height + delta.height);
                setWidth(+width + delta.width);
                setUpdate(update + 1);
            }}
            onResize={(e, dir, elementRef, delta, pos) => {
                onUpdate?.({ e, dir, elementRef, delta, position: pos });
            }}
            position={{ x, y }}
            size={{ width, height }}
            default={{
                ...position,
                ...size
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    flex: "auto"
                }}
                onMouseDown={() => {
                    // Поднимаем окно наверх
                    const z = openWindows.ar.findIndex((v) => v === id);
                    if (z !== openWindows.ar.length - 1 || zindex.current !== z) {
                        const buf = openWindows.ar[z];
                        openWindows.ar.splice(z, 1);
                        openWindows.ar.push(buf);
                        renderBy(openWindows);
                    }
                }}
            >
                {moveOnlyHeader || header ? headerD : null}
                <div className="maxSize" style={{ overflow: overflow ? "auto" : undefined }}>
                    {(a || b) && (
                        <div
                            className="maxSize"
                            style={{
                                position: "absolute",
                                zIndex: zIndexX * 2 + zIndex + 1
                            }}
                        ></div>
                    )}
                    {typeof children === "function" ? children(update) : children}
                </div>
                {onCLickClose && (
                    <div
                        key="323"
                        className="msTradeAlt"
                        style={{
                            position: "absolute",
                            right: -15,
                            top: -15,
                            fontSize: "32px",
                            zIndex: zIndexX * 2 + zIndex + 1,
                            cursor: "pointer"
                        }}
                        onClick={onCLickClose}
                    >
                        x
                    </div>
                )}
            </div>
        </Rnd>
    );
}

/**
 * Пример простого перетаскивания (Drag2) без react-rnd
 */
export function Drag3() {
    const lastC = useRef<{ x: number; y: number } | null>(null);
    const [a, setA] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useEffect(() => {
        const mouseMoveHandler = (e: MouseEvent) => {
            e.stopPropagation();
            if (lastC.current == null) {
                lastC.current = { x: e.clientX, y: e.clientY };
            }
            const data = lastC.current;
            if (e.buttons === 1) {
                setY((prev) => prev + e.clientY - data.y);
                setX((prev) => prev + e.clientX - data.x);
            } else {
                mouseUpHandler();
            }
        };

        const mouseUpHandler = () => {
            document.removeEventListener("mouseup", mouseUpHandler);
            document.removeEventListener("mousemove", mouseMoveHandler);
            lastC.current = null;
            setA(false);
        };

        if (a) {
            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        }

        return () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        };
    }, [a]);

    return (
        <div
            style={{
                background: "red",
                width: 100,
                height: 100,
                position: "absolute",
                left: x,
                top: y
            }}
            onMouseDown={() => {
                setA(true);
            }}
        ></div>
    );
}

/**
 * Пример более «раскачанного» перетаскивания (Drag) без react-rnd, с поддержкой touch
 */
export function DragBig3() {
    const lastC = useRef<{ x: number; y: number } | null>(null);
    const lastT = useRef<{ x: number; y: number; id: number } | null>(null);
    const [a, setA] = useState(false);
    const [b, setB] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    useEffect(() => {
        // Мышка
        const mouseMoveHandler = (e: MouseEvent) => {
            e.stopPropagation();
            if (lastC.current == null) {
                lastC.current = { x: e.clientX, y: e.clientY };
            }
            const data = lastC.current;
            if (e.buttons === 1) {
                setY(e.clientY + data.y);
                setX(e.clientX + data.x);
            } else {
                mouseUpHandler();
            }
        };

        const mouseUpHandler = () => {
            document.removeEventListener("mouseup", mouseUpHandler);
            document.removeEventListener("mousemove", mouseMoveHandler);
            lastC.current = null;
            setA(false);
        };

        // Тач
        const touchMoveHandler = (e: TouchEvent) => {
            const data = lastT.current;
            if (!data) return touchEndHandler(e);

            let t: Touch | null = null;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const zz = e.changedTouches[i];
                if (zz.identifier === data.id) t = zz;
            }
            if (!t) return;

            setY(t.clientY + data.y);
            setX(t.clientX + data.x);
        };

        const touchEndHandler = (e: TouchEvent) => {
            const data = lastT.current;
            if (data) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    const z = e.changedTouches[i];
                    if (z.identifier === data.id) {
                        lastT.current = null;
                    }
                }
            }
            if (lastT.current == null) {
                document.removeEventListener("touchend", touchEndHandler);
                document.removeEventListener("touchmove", touchMoveHandler);
                setB(false);
            }
        };

        // Подписываемся при a/b === true
        if (a) {
            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        }
        if (b) {
            document.addEventListener("touchmove", touchMoveHandler);
            document.addEventListener("touchend", touchEndHandler);
        }

        // Очищаем подписки при размонтировании и смене a/b
        return () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
            document.removeEventListener("touchmove", touchMoveHandler);
            document.removeEventListener("touchend", touchEndHandler);
        };
    }, [a, b, x, y]);

    return (
        <div
            style={{
                background: "rgb(84,6,6)",
                width: 200,
                height: 200,
                position: "absolute",
                left: x,
                top: y
            }}
            onTouchStart={(e) => {
                const t = e.changedTouches[0];
                if (t) {
                    lastT.current = {
                        x: x - t.clientX,
                        y: y - t.clientY,
                        id: t.identifier
                    };
                }
                setB(true);
            }}
            onMouseDown={(e) => {
                lastC.current = {
                    x: x - e.clientX,
                    y: y - e.clientY
                };
                setA(true);
            }}
        ></div>
    );
}

export type Drag2Props = {
    /** Элемент-«ребёнок», который хотим сделать перетаскиваемым */
    children: ReactNode;

    /** Коллбек при изменении координаты X */
    onX?: (val: number) => void;

    /** Коллбек при изменении координаты Y */
    onY?: (val: number) => void;

    /** Начальное (или контролируемое) значение X */
    x?: number;

    /** Начальное (или контролируемое) значение Y */
    y?: number;
    /** вести отчет с правого края*/
    right?: boolean;
    /**
     * Внешний ref для хранения координат.
     * Если передан, компонент будет обновлять ref при каждом движении.
     */
    last?: React.RefObject<{ x: number; y: number }>;

    /** Вызывается при начале перетаскивания (мышь или touch) */
    onStart?: () => void;

    /** Вызывается при окончании перетаскивания (мышь и touch) */
    onStop?: () => void;
};





/**
 * Компонент-обёртка, позволяющий перетаскивать вложенный элемент
 * как мышью, так и касаниями (touch).
 */
export function Drag22({
                          children,
                          onX,
                          onY,

                          x = 0,
                          y = 0,
                          right = false,
                          last,
                          onStart,
                          onStop
                      }: Drag2Props) {
    /**
     * Храним текущий «смещающий» вектор для мыши:
     * (позиция блока - позиция курсора), чтобы при mousemove легко считать новые координаты.
     */
    const offsetMouse = useRef({ x: 0, y: 0 });

    /**
     * Храним аналогичное «смещение» для тач-событий (при touchstart).
     * Плюс identifier, чтобы понять, каким пальцем двигаем.
     */
    const offsetTouch = useRef<{ x: number; y: number; id: number } | null>(null);

    /** Булевы флаги, показывающие, идёт ли сейчас перетаскивание мышью или через touch */
    const [draggingMouse, setDraggingMouse] = useState(false);
    const [draggingTouch, setDraggingTouch] = useState(false);

    /**
     * Внутренняя ref для «текущей» позиции элемента.
     * Если передан внешний `last`, то инициализируемся им, иначе берём { x, y }.
     */
    const posRef = useRef<{ x: number; y: number }>(
        last?.current ?? { x, y }
    );

    /**
     * Синхронизуем posRef с входящими x/y при их изменении извне.
     * (Например, если координаты контролируются родителем.)
     */
    useLayoutEffect(() => {
        posRef.current.x = x;
        posRef.current.y = y;
    }, [x, y]);

    /**
     * Основной эффект, который «реагирует» на включение/выключение перетаскивания.
     * Если ни мышь, ни touch не активны (draggingMouse = false и draggingTouch = false),
     * вызываем onStop и ничего больше не делаем.
     *
     * Если draggingMouse = true — навешиваем события mousemove / mouseup и при каждом движении
     * вычисляем новые координаты. По mouseup снимаем слушатели и сбрасываем draggingMouse.
     *
     * Аналогично для draggingTouch = true — навешиваем touchmove / touchend и следим за конкретным пальцем.
     */
    useEffect(() => {
        // Если мы не тащим ни мышью, ни пальцем, значит перетаскивание закончилось.
        if (!draggingMouse && !draggingTouch) {
            onStop?.();
            return;
        }

        if (draggingMouse) {
            const handleMouseMove = (e: MouseEvent) => {
                // Новая позиция = текущая координата курсора + сохранённое смещение
                const newX = e.clientX + offsetMouse.current.x;
                const newY = e.clientY + offsetMouse.current.y;
                posRef.current = { x: newX, y: newY };
                onX?.(newX);
                onY?.(newY);
            };

            const handleMouseUp = () => {
                offsetMouse.current.x = 0
                offsetMouse.current.y = 0
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                setDraggingMouse(false);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

            // Уведомляем, что началось перетаскивание
            onStart?.();

            // Функция очистки, если Effect пере-вызовется или компонент демонтируется
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };
        }

        if (draggingTouch) {
            const handleTouchMove = (e: TouchEvent) => {
                if (!offsetTouch.current) return;
                // Ищем наш палец по identifier
                const theTouch = Array.from(e.changedTouches).find(
                    (t) => t.identifier === offsetTouch.current?.id
                );
                if (!theTouch) return;

                const newX = theTouch.clientX + offsetTouch.current.x;
                const newY = theTouch.clientY + offsetTouch.current.y;
                posRef.current = { x: newX, y: newY };
                onX?.(newX);
                onY?.(newY);
            };

            const handleTouchEnd = (e: TouchEvent) => {
                if (!offsetTouch.current) return;
                // Проверяем, отпущен ли наш «целевой» палец
                const ended = Array.from(e.changedTouches).find(
                    (t) => t.identifier === offsetTouch.current?.id
                );
                if (ended) {

                    // if (offsetTouch.current) {
                    //     offsetTouch.current.x = 0
                    //     offsetTouch.current.y = 0
                    // }
                    offsetTouch.current = null;
                    document.removeEventListener("touchmove", handleTouchMove);
                    document.removeEventListener("touchend", handleTouchEnd);
                    setDraggingTouch(false);
                }
            };

            document.addEventListener("touchmove", handleTouchMove);
            document.addEventListener("touchend", handleTouchEnd);

            onStart?.();

            return () => {
                document.removeEventListener("touchmove", handleTouchMove);
                document.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [draggingMouse, draggingTouch, onX, onY, onStart, onStop]);

    /**
     * Если передан внешний ref (last), синхронизируем его с текущей позицией
     * при каждом рендере/обновлении (useLayoutEffect или useEffect).
     */
    useLayoutEffect(() => {
        if (last) {
            last.current = posRef.current;
        }
    });

    /**
     * Обработчик мыши:
     * При mousedown вычисляем смещение (текущая позиция - позиция курсора).
     * Ставим флаг draggingMouse = true.
     */
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        posRef.current.x = 0
        posRef.current.y = 0
        offsetMouse.current = {
            x: posRef.current.x - e.clientX,
            y: posRef.current.y - e.clientY
        };
        console.log("xxx")
        console.log(offsetMouse.current.x, posRef.current.x, e.clientX)
        setDraggingMouse(true);
    };

    /**
     * Обработчик touch:
     * Аналогично, берём первый палец, считаем смещение.
     * Ставим draggingTouch = true.
     */
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const t = e.changedTouches[0];
        if (!t) return;

        offsetTouch.current = {
            x: posRef.current.x - t.clientX,
            y: posRef.current.y - t.clientY,
            id: t.identifier
        };
        setDraggingTouch(true);
    };

    /**
     * Рендерим контейнер, в котором лежит `children`.
     * Стили указываем позиционирование (left, top) по текущим координатам.
     * Вешаем обработчики onMouseDown / onTouchStart.
     */
    return <div
        style={{
            position: "absolute",
            left: right? undefined: 0, //undefined: posRef.current.x,
            right: right? 0 : undefined, //,
            top: 0 //posRef.current.y
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
    >
        {children}
    </div>
}

