import {renderBy, renderByRevers, renderByLast, updateBy, map3, mapWait} from '../src/common/updateBy';
import { act, renderHook } from '@testing-library/react';
import {sleepAsync, waitRun} from "wenay-common";
jest.useFakeTimers(); // Для работы с таймерами через Jest
jest.mock('wenay-common', () => ({
    waitRun: jest.fn(() => ({
        refreshAsync: jest.fn((ms, callback) => setTimeout(callback, ms)),
    })),

}));

describe('Тесты: renderBy, renderByRevers, renderByLast', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mapWait.clear(); // Очищаем Map перед каждым тестом
        // WeakMap (map3) нельзя очистить явно, поэтому достаточно создавать новые объекты
    });

    test('renderBy: вызывает функции сразу при отсутствии таймера', () => {
        const obj = {};
        const func = jest.fn();
        const funcMap = new Map();
        funcMap.set(func, func);
        (map3 as any).set(obj, funcMap);

        // Вызываем renderBy без задержки
        renderBy(obj);

        expect(func).toHaveBeenCalledWith(obj); // Убедимся, что функция вызвана с `obj`
    });

    test('renderBy: вызывает функции с таймером', () => {
        const obj = {};
        const func = jest.fn();
        const funcMap = new Map();
        funcMap.set(func, func);
        (map3 as any).set(obj, funcMap);

        // Вызываем renderBy с задержкой
        renderBy(obj, 1000);

        expect(func).not.toHaveBeenCalled(); // Убедимся, что функция еще не вызвана
        jest.advanceTimersByTime(1000); // Перематываем время на 1000 мс
        expect(func).toHaveBeenCalledWith(obj); // Убедимся, что функция вызвана
    });

    test('renderBy: удаляет запись из mapWait после выполнения', () => {
        const obj = {};
        const func = jest.fn();
        const funcMap = new Map();
        funcMap.set(func, func);
        (map3 as any).set(obj, funcMap);

        renderBy(obj, 1000);

        expect(mapWait.has(obj)).toBe(true); // Запись добавлена
        jest.runOnlyPendingTimers(); // Выполняем таймеры
        expect(mapWait.has(obj)).toBe(false); // Запись должна удалиться
    });

    test('renderByRevers: вызовы функций происходят в обратном порядке', () => {
        const obj = {};
        const func1 = jest.fn();
        const func2 = jest.fn();
        const funcMap = new Map();
        funcMap.set(func1, func1);
        funcMap.set(func2, func2);
        (map3 as any).set(obj, funcMap);

        renderByRevers(obj);

        expect(func2).toHaveBeenCalledWith(obj); // Вызвана последняя функция первой
        expect(func1).toHaveBeenCalledWith(obj); // Вызвана первая функция второй
    });


    test('renderByLast: запись удаляется из mapWait после выполнения', () => {
        const obj = {};
        const func = jest.fn();
        const funcMap = new Map();
        funcMap.set(func, func);
        (map3 as any).set(obj, funcMap);

        renderByLast(obj, 500);

        expect(mapWait.has(obj)).toBe(true); // Запись должна быть добавлена
        jest.runOnlyPendingTimers();
        expect(mapWait.has(obj)).toBe(false); // После выполнения запись удаляется
    });
});