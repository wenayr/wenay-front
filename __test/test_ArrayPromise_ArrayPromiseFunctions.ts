import { ArrayPromise } from "../src/common/src/arrayPromise";

describe("ArrayPromise", () => {
    test("Все промисы разрешаются, вызов thenF", async () => {
        const mockPromises = [
            jest.fn(() => Promise.resolve("result1")),
            jest.fn(() => Promise.resolve("result2")),
            jest.fn(() => Promise.resolve("result3")),
        ];
        const thenF = jest.fn();

        const arrayPromiseFunctions = ArrayPromise({
            arr: mockPromises,
            thenF,
        });

        // Выполняем все функции
        const results = await Promise.all(arrayPromiseFunctions.map((fn) => fn()));

        // Проверяем результаты
        expect(results).toEqual(["result1", "result2", "result3"]);

        // Проверяем вызовы функций thenF
        expect(thenF).toHaveBeenCalledTimes(3);
        expect(thenF).toHaveBeenNthCalledWith(1, "result1", 0, 1, 0, 3);
        expect(thenF).toHaveBeenNthCalledWith(2, "result2", 0, 1, 0);
    });
});