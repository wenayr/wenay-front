// import { CResizeObserver, setResizeableElement } from "../src/common/src/MyResizeObserver";
//
// describe("CResizeObserver", () => {
//     let resizeObserver: CResizeObserver;
//     let mockResizeObserverInstance: ResizeObserver;
//
//     beforeEach(() => {
//         // Mock ResizeObserver
//         global.ResizeObserver = jest.fn((callback) => {
//             mockResizeObserverInstance = {
//                 observe: jest.fn(),
//                 unobserve: jest.fn(),
//                 disconnect: jest.fn(),
//             } as unknown as ResizeObserver;
//             return mockResizeObserverInstance;
//         }) as unknown as jest.Mock;
//
//         resizeObserver = new CResizeObserver();
//     });
//
//     afterEach(() => {
//         jest.clearAllMocks();
//     });
//
//     test("add добавляет наблюдателя за элементом и вызывает функцию resize", () => {
//         const element = document.createElement("div");
//         const resizeCallback = jest.fn();
//
//         const id = resizeObserver.add(element, resizeCallback);
//
//         // Проверяем, что элемент был зарегистрирован и наблюдение началось
//         expect(mockResizeObserverInstance.observe).toHaveBeenCalledWith(element);
//
//         // Проверяем, что идентификатор создан
//         expect(id).toBeDefined();
//     });
//
//     test("delete удаляет наблюдателя за элементом", () => {
//         const element = document.createElement("div");
//         const resizeCallback = jest.fn();
//
//         const id = resizeObserver.add(element, resizeCallback);
//
//         // Удаляем наблюдение по ID
//         resizeObserver.delete(id);
//
//         // Проверяем, что элемент был удалён из наблюдения
//         expect(mockResizeObserverInstance.unobserve).toHaveBeenCalledWith(element);
//     });
//
//     test("delete не вызывает ошибку при удалении несуществующего ID", () => {
//         // Пробуем удалить несуществующий ID
//         expect(() => resizeObserver.delete({} as any)).not.toThrow();
//
//         // Убеждаемся, что unobserve не был вызван
//         expect(mockResizeObserverInstance.unobserve).not.toHaveBeenCalled();
//     });
//
//     test("delete корректно удаляет только одну функцию для одного элемента", () => {
//         const element = document.createElement("div");
//         const resizeCallback1 = jest.fn();
//         const resizeCallback2 = jest.fn();
//
//         const id1 = resizeObserver.add(element, resizeCallback1);
//         const id2 = resizeObserver.add(element, resizeCallback2);
//
//         // Удаляем первый callback
//         resizeObserver.delete(id1);
//
//         // Проверяем, что unobserve не был вызван (так как второй callback всё ещё существует)
//         expect(mockResizeObserverInstance.unobserve).not.toHaveBeenCalled();
//
//         // Удаляем второй callback
//         resizeObserver.delete(id2);
//
//         // Теперь проверяем, что элемент был полностью удалён из наблюдения
//         expect(mockResizeObserverInstance.unobserve).toHaveBeenCalledWith(element);
//     });
// });
//
// describe("setResizeableElement", () => {
//     let parent: HTMLElement;
//     let parentParent: HTMLElement;
//     let element: HTMLElement;
//     let lastChild: HTMLElement;
//
//     beforeEach(() => {
//         parentParent = document.createElement("div");
//         parent = document.createElement("div");
//         element = document.createElement("div");
//         lastChild = document.createElement("div");
//
//         parentParent.appendChild(parent);
//         parent.appendChild(element);
//         parent.appendChild(lastChild);
//
//         document.body.appendChild(parentParent);
//
//         // Устанавливаем размеры элементов
//         parentParent.getBoundingClientRect = jest.fn(() => ({
//             right: 500,
//         } as DOMRect));
//         lastChild.getBoundingClientRect = jest.fn(() => ({
//             right: 490,
//         } as DOMRect));
//         element.getBoundingClientRect = jest.fn(() => ({
//             right: 400,
//         } as DOMRect));
//     });
//
//     afterEach(() => {
//         document.body.innerHTML = ""; // Очищаем DOM
//         jest.clearAllMocks();
//     });
//
//     test("setResizeableElement корректно устанавливает слушателя на элемент", () => {
//         const result = setResizeableElement(element);
//
//         // Проверяем, что setResizeableElement возвращает переданный элемент
//         expect(result).toBe(element);
//     });
//
//     test("setResizeableElement ничего не делает, если родителя нет", () => {
//         // Убираем родителя
//         parentParent.removeChild(parent);
//
//         const result = setResizeableElement(element);
//
//         // Проверяем, что ничего не происходит
//         expect(result).toBeUndefined();
//     });
//
//     test("setResizeableElement ничего не делает, если у родителя нет родителя", () => {
//         // Убираем родителя родителя
//         parent.removeChild(element);
//
//         const result = setResizeableElement(element);
//
//         // Проверяем, что ничего не происходит
//         expect(result).toBeUndefined();
//     });
//
//     // test("setResizeableElement корректно изменяет ширину элемента в зависимости от состояния", () => {
//     //     const spy = jest.spyOn(global_resizeObserver, "add");
//     //
//     //     setResizeableElement(element);
//     //
//     //     // Проверяем, что add вызывается с parentParent и корректным callback
//     //     expect(spy).toHaveBeenCalledWith(parentParent, expect.any(Function));
//     //
//     //     // Вызываем callback, чтобы проверить логику изменения ширины
//     //     const callback = spy.mock.calls[0][1];
//     //     callback();
//     //
//     //     // Проверяем изменение ширины
//     //     expect(element.style.width).not.toBe(""); // Ширина должна быть установлена
//     // });
// });