import {ColDef, GridReadyEvent} from "ag-grid-community";
type options = {update?: boolean, add?: boolean, updateBuffer?: boolean}
const optionsDef = {
    update: true,
    add: true,
    updateBuffer: true,
}
export function applyTransactionAsyncUpdate<T>(
    grid: GridReadyEvent<T, any> | null | undefined,
    newData: (Partial<T>)[],
    getId: (...a: any[]) => string,
    bufTable: { [id: string]: Partial<T> },
    option?: options
) {
    // Установка параметров (объединение переданных опций с настройками по умолчанию)
    const op = {...optionsDef, ...(option ?? {})};

    // Проверка наличия сетки и доступа к данным через API
    if (grid?.api.getRowNode) {
        const arrNew: T[] = []; // Массив для новых данных (добавляемые строки)

        // Основная обработка данных (map используется для обновления или создания записей)
        const arr = newData.map(e => {
            // Получение ID для текущей строки
            const id = getId(e);

            const newData= { ...(bufTable[id] ?? {}), ...e } as T
            if (op.updateBuffer) bufTable[id] = newData
            // Попытка найти существующую строку по ID
            const a = grid.api.getRowNode(id)?.data;

            if (!a) {
                // Если строка не найдена - добавить в массив для добавления
                arrNew.push(newData);
                return null; // Новая строка обрабатывается отдельно
            }

            // Если строка найдена - обновить данные в буфере
            return newData;
        }) // Убираем `null` и оставляем только существующие строки
            .filter(e => e) as T[];

        // Добавление новых строк (если есть элементы)
        if (arrNew.length && op.update) {
            // добавление элементов должно быть синхронно, т.к. может прейти его update до исполнения
            grid.api.applyTransaction({ add: arrNew });
        }

        // Асинхронное обновление существующих строк
        if (arr.length && op.add) {
            grid.api.applyTransactionAsync({ update: arr });
        }
    }
}

type UnUndefined<T extends (any | undefined)> = T extends undefined ? never : T
type t1<T = any> = ColDef<T>["comparator"]
type paramsCompare<TData = any> = Parameters<UnUndefined<t1>>

export function getComparatorGrid<T = any>(func?: (...param: paramsCompare<T>) => [a: number, b: number]): t1 {
    return (...param) => {
        const [a1, b1, modeA, modeB, inv] = param; // Распаковка параметров в функцию
        const [a, b] = func ? func(...param) : [a1, b1]; // Использование преобразующей функции func, если передана
        return (
            (typeof a == "number" && !Number.isNaN(a)) &&
            (typeof b == "number" && !Number.isNaN(b))
        ) // Если оба a и b - валидные числа
            ? a - b // Разница между числами
            : a == b
                ? 0 // Если значения равны, возвращаем 0
                : (!Number.isNaN(b) && b != undefined)
                    ? (inv ? -1 : 1) // Если b существует: порядок определяется inv
                    : (inv ? 1 : -1); // Если b отсутствует: порядок определяется inv
    }
}