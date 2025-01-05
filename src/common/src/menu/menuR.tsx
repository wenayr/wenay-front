import React, {useEffect, useRef} from "react";
import {MenuBase, tMenuReact, tMenuReactStrictly} from "./menu";
import { DivOutsideClick } from "../commonFuncReact";

// Функция-обёртка для создания компонента MenuR и управления глобальной переменной `bb`
export function GetMenuR(){
    let bb = false; // Глобальная переменная, предотвращающая множественное открытие меню (флаг активности)

    // Основной компонент MenuR
    function MenuR({children, other = () => [], statusOn = true, onUnClick, zIndex, className}: {
        children: React.ReactElement,                        // Дочерний компонент
        zIndex?: number,                                     // Значение z-index для контекстного меню
        other?: () => (tMenuReact)[],                        // Дополнительные элементы меню
        statusOn?: boolean,                                  // Включение/выключение меню
        onUnClick?: (e: boolean) => void,                    // Колбэк при закрытии меню
        className?: (active?: boolean) => string,            // CSS-класс для меню
    }) {
        const data = {x: 0, y: 0}; // Текущая позиция элемента, где происходит взаимодействие
        const [show, setShow] = React.useState<{
            status: boolean,                                 // Статус: показывать меню или нет
            plusMenu?: tMenuReactStrictly[],                 // Дополнительное меню
            menu?: tMenuReactStrictly[],                     // Основное меню
            coordinate?: {x: number, y: number}              // Координаты, где откроется меню
        }>({status: false});

        useEffect(() => {
            return () => {
                bb = false; // Сбрасываем флаг активности при размонтировании компонента
            };
        }, []);

        const timeEvent = useRef(Date.now()); // Временная метка для отслеживания двойных кликов
        let x = 0, y = 0;                     // Текущие координаты касания
        const touchTime = useRef<null | number>(null); // Время начала касания

        return (
            <div className={"maxSize"} style={{position: "relative"}}
                // Для отключения стандартного контекстного меню
                 onContextMenu={e => {
                     if (statusOn) {
                         e.preventDefault();
                         e.stopPropagation();
                     }
                 }}
                // Определение позиции взаимодействия для текущего элемента (например, контейнера)
                 ref={(e) => {
                     if (e) {
                         const r = e.getBoundingClientRect();
                         data.x = r.x;
                         data.y = r.y;
                     }
                 }}
                // Запоминаем начальные координаты касания
                 onTouchStart={(e) => {
                     if (x == 0) x = e.touches[0].screenX;
                     if (y == 0) y = e.touches[0].screenY;
                     touchTime.current = Date.now();
                 }}
                // Проверка на значительное смещение (чтобы не показывать меню при скролле)
                 onTouchMove={(e) => {
                     let x2 = e.touches[0].screenX;
                     let y2 = e.touches[0].screenY;
                     let pX = e.touches[0].pageX;
                     let pY = e.touches[0].pageY;
                     if ((Math.abs(x2 - x) / pX > 0.05) || (Math.abs(y2 - y) / pY > 0.05)) {
                         touchTime.current = null; // Если смещение слишком большое, отключаем показ меню
                     }
                 }}
                // Определяем долгое касание для вызова контекстного меню
                 onTouchEnd={(e) => {
                     if (statusOn) {
                         if (touchTime.current && Date.now() - touchTime.current > 300) {
                             // Если прошло больше 300 мс — считываем как долгое нажатие
                             touchTime.current = null;
                             x = y = 0;
                             if (bb) return; // Если меню уже активно, выходим
                             bb = true;
                             setShow({
                                 status: true,
                                 // Устанавливаем координаты меню относительно элемента
                                 coordinate: {
                                     x: e.changedTouches[0].clientX - data.x,
                                     y: e.changedTouches[0].clientY - data.y
                                 }
                             });
                         }
                     }
                 }}
                // Отслеживаем двойной клик
                 onDoubleClick={(event) => {
                     timeEvent.current = Date.now();
                 }}
                // Обрабатываем клик правой кнопкой мыши или двойной клик
                 onMouseUp={(event) => {
                     if (statusOn) {
                         if (event.button == 2 || Date.now() - timeEvent.current < 300) {
                             if (bb) return; // Если меню уже активно, ничего не делаем
                             bb = true;
                             setShow({status: true, coordinate: {x: event.clientX - data.x, y: event.clientY - data.y}});
                         }
                     }
                 }}
            >
                {children /* Дочерний элемент, внутри которого отслеживаются события */}
                {show.status && statusOn && (
                    // Показываем контекстное меню
                    <DivOutsideClick
                        outsideClick={() => {
                            onUnClick?.(false); // Вызов обработчика при закрытии меню
                            if (!bb) return;
                            bb = false; // Меню больше не активно
                            setShow({status: false}); // Скрываем меню
                        }}
                    >
                        <MenuBase
                            className={className}
                            data={[
                                ...(show.plusMenu ?? []),
                                ...(other().filter(e => e) as tMenuReactStrictly[])
                            ]}
                            coordinate={{...show.coordinate!}} // Указываем текущие координаты меню
                            zIndex={zIndex}                   // Передаём z-index
                        />
                    </DivOutsideClick>
                )}
            </div>
        );
    }

    return {
        /**
         * Управление глобальной переменной `bb`, предотвращающей множественное
         * открытие меню.
         */
        bb(b?: boolean) {
            if (b != undefined) {
                bb = b;
            } else return bb;
        },
        MenuR // Возвращаем созданный компонент
    };
}