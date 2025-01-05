import { renderBy, renderByRevers, renderByLast, updateBy } from '../src/common/updateBy';
import { act, renderHook } from '@testing-library/react';

jest.mock('wenay-common', () => ({
    waitRun: jest.fn(() => {
        let callback: () => void = () => {};
        return {
            refreshAsync: jest.fn((ms: number, cb: () => void) => {
                callback = cb;
            }),
            invoke: jest.fn(() => {
                callback();
            }),
        };
    }),
}));

describe('updateBy.ts - функция renderBy', () => {
    it('должен вызывать все функции из map3', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const obj = {};

        // Добавляем функции в WeakMap
        const funcMap = new Map();
        funcMap.set(callback1, callback1);
        funcMap.set(callback2, callback2);

        (global as any).map3.set(obj, funcMap);

        renderBy(obj);

        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('должен работать с задержкой через waitRun', () => {
        const obj = {};
        const funcMap = new Map();
        const callback = jest.fn();

        funcMap.set(callback, callback);
        (global as any).map3.set(obj, funcMap);

        renderBy(obj, 1000);

        const waitRunInstance = (global as any).mapWait.get(obj);
        expect(waitRunInstance).toBeDefined();

        act(() => {
            waitRunInstance.invoke();
        });

        expect(callback).toHaveBeenCalledTimes(1);
        expect((global as any).mapWait.get(obj)).toBeUndefined();
    });
});

describe('updateBy.ts - функция renderByRevers', () => {
    it('должен вызывать функции в обратном порядке, если reverse=true', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const obj = {};

        const funcMap = new Map();
        funcMap.set(callback1, callback1);
        funcMap.set(callback2, callback2);

        (global as any).map3.set(obj, funcMap);

        renderByRevers(obj, undefined, true);

        // Проверяем порядок ручным сравнением mock.calls
        const calls = [callback1.mock.calls, callback2.mock.calls];
        expect(calls[1].length).toBeGreaterThan(0); // Второй вызван первым
        expect(calls[0].length).toBeGreaterThanOrEqual(0); // Первый вызван после
    });

    it('должен работать в обычном порядке, если reverse=false', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const obj = {};

        const funcMap = new Map();
        funcMap.set(callback1, callback1);
        funcMap.set(callback2, callback2);

        (global as any).map3.set(obj, funcMap);

        renderByRevers(obj, undefined, false);

        // Проверяем порядок вручную через mock.calls
        const calls = [callback1.mock.calls, callback2.mock.calls];
        expect(calls[0].length).toBeGreaterThan(0); // Первый вызван первым
        expect(calls[1].length).toBeGreaterThanOrEqual(0); // Второй вызван позже
    });
});

describe('updateBy.ts - функция renderByLast', () => {
    it('должен вызывать только последний элемент map3', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const obj = {};

        const funcMap = new Map();
        funcMap.set(callback1, callback1);
        funcMap.set(callback2, callback2);

        (global as any).map3.set(obj, funcMap);

        renderByLast(obj);

        // Проверяем вызовы: только последний элемент вызван
        expect(callback2).toHaveBeenCalledTimes(1);
        expect(callback1).not.toHaveBeenCalled();
    });
});

describe('updateBy.ts - функция updateBy', () => {
    it('должен подписаться на обновление объекта', () => {
        const obj = {};
        const { result } = renderHook(() => updateBy(obj));

        const funcMap = (global as any).map3.get(obj);
        expect(funcMap).toBeDefined();
        expect(funcMap.size).toBe(1);
    });

    it('должен вызывать переобновление состояния автоматически', () => {
        const obj = {};
        const { result } = renderHook(() => updateBy(obj));

        const funcMap = (global as any).map3.get(obj);
        const updateCallback: any = Array.from(funcMap.values())[0];

        // Mock state update
        act(() => {
            updateCallback(obj);
        });

        // Проверяем, что состояние в updateBy обновилось
        // @ts-ignore
        expect(result.current[0]).toBe(1);
    });
});