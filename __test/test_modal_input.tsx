// import React from "react";
// import { render, screen, fireEvent } from "@testing-library/react";
// import { GetModalJSX, inputModal, confirmModal } from "../src/common/src/modal";
// import { InputPageModal } from "../src/common/src/input";
//
// // Моки для renderBy и updateBy
// jest.mock("../src/common/updateBy", () => ({
//     renderBy: jest.fn(),
//     updateBy: jest.fn(),
// }));
//
// describe("inputModal", () => {
//     test("Рендерит InputPageModal с корректным состоянием и данными", () => {
//         const setModalJSX = jest.fn();
//         const func = jest.fn();
//
//         inputModal({
//             setModalJSX,
//             func,
//             name: "testName",
//             txt: "testText"
//         });
//
//         // Проверяем, что было вызвано обновление JSX-модали
//         expect(setModalJSX).toHaveBeenCalledTimes(1);
//         const modalElement = setModalJSX.mock.calls[0][0];
//         render(modalElement);
//
//         // Проверяем отрисовку модального окна
//         expect(screen.getByText("testName")).not.toBeNull();
//         expect(screen.getByDisplayValue("testText")).not.toBeNull();
//     });
//
//     test("Выполняет обработчик callback и закрывает модальное окно", () => {
//         const setModalJSX = jest.fn();
//         const func = jest.fn();
//
//         inputModal({
//             setModalJSX,
//             func,
//             name: "testName",
//             txt: "testText"
//         });
//
//         // Проверяем логику выполнения callback'а
//         const modalElement = setModalJSX.mock.calls[0][0];
//         render(modalElement);
//
//         fireEvent.change(screen.getByTestId("input"), { target: { value: "newText" } });
//         fireEvent.click(screen.getByText("Submit")); // Клик на отправку
//
//         expect(func).toHaveBeenCalledWith("newText"); // Проверяем выполнение основного callback
//         expect(setModalJSX).toHaveBeenLastCalledWith(null); // Модальное окно закрывается
//     });
//
//     test("Закрывает модальное окно при клике вне модали", () => {
//         const setModalJSX = jest.fn();
//         const func = jest.fn();
//
//         inputModal({
//             setModalJSX,
//             func,
//             name: "testName",
//             txt: "testText"
//         });
//
//         const modalElement = setModalJSX.mock.calls[0][0];
//         render(modalElement);
//
//         fireEvent.click(screen.getByTestId("overlay")); // Клик по фону
//
//         expect(setModalJSX).toHaveBeenLastCalledWith(null); // Модальное окно закрывается
//         expect(func).not.toHaveBeenCalled(); // Callback не вызывается
//     });
// });
//
// describe("confirmModal", () => {
//     test("Рендерит InputPageModal для подтверждения", () => {
//         const setModalJSX = jest.fn();
//         const func = jest.fn();
//
//         confirmModal({ setModalJSX, func });
//
//         // Проверяем вызов модального JSX
//         expect(setModalJSX).toHaveBeenCalledTimes(1);
//         const modalElement = setModalJSX.mock.calls[0][0];
//         render(modalElement);
//
//         // Проверяем отрисовку контента модали
//         expect(screen.getByText("password 111")).not.toBeNull();
//     });
//
//     test("Выполняет func при вводе корректного пароля", () => {
//         const setModalJSX = jest.fn();
//         const func = jest.fn();
//
//         confirmModal({ setModalJSX, func });
//
//         const modalElement = setModalJSX.mock.calls[0][0];
//         render(modalElement);
//
//         fireEvent.change(screen.getByTestId("input"), { target: { value: "111" } });
//         fireEvent.click(screen.getByText("Submit")); // Клик на "Submit"
//
//         expect(func).toHaveBeenCalled(); // Функция вызывается
//         expect(setModalJSX).toHaveBeenLastCalledWith(null); // Модальное окно закрывается
//     });
//
//     test("Закрывает модальное окно, если пароль некорректный", () => {
//         const setModalJSX = jest.fn();
//         const func = jest.fn();
//
//         confirmModal({ setModalJSX, func });
//
//         const modalElement = setModalJSX.mock.calls[0][0];
//         render(modalElement);
//
//         fireEvent.change(screen.getByTestId("input"), { target: { value: "incorrect" } });
//         fireEvent.click(screen.getByText("Submit")); // Клик на "Submit"
//
//         expect(func).not.toHaveBeenCalled(); // Callback не вызывается
//         expect(setModalJSX).toHaveBeenLastCalledWith(null); // Модальное окно закрывается
//     });
// });
//
// describe("GetModalJSX", () => {
//     test("JSX устанавливается и обновляется", () => {
//         const modalManager = GetModalJSX();
//
//         const TestComponent = <div data-testid="test-modal">Test Modal</div>;
//         modalManager.JSX = TestComponent;
//
//         // Проверяем, что renderBy был вызван
//         expect(require("../updateBy").renderBy).toHaveBeenCalledWith(modalManager);
//
//         expect(modalManager.JSX).toBe(TestComponent); // Проверяем установленный JSX
//     });
//
//     test("Добавление нового JSX - addJSX", () => {
//         const modalManager = GetModalJSX();
//
//         const TestComponent1 = <div>Modal 1</div>;
//         const TestComponent2 = <div>Modal 2</div>;
//
//         modalManager.addJSX(TestComponent1);
//         modalManager.addJSX(TestComponent2);
//
//         const renderedArray = modalManager.RenderArr();
//         expect(renderedArray).toHaveLength(2); // Два объекта в массиве
//     });
//
//     test("Удаление JSX - dellBy", () => {
//         const modalManager = GetModalJSX();
//
//         const TestComponent1 = <div>Modal 1</div>;
//         const TestComponent2 = <div>Modal 2</div>;
//
//         modalManager.addJSX(TestComponent1);
//         modalManager.addJSX(TestComponent2);
//
//         modalManager.dellBy(TestComponent1); // Удаляем первый компонент
//
//         const renderedArray = modalManager.RenderArr();
//         expect(renderedArray).toHaveLength(1); // В массиве остался только один элемент
//         expect(renderedArray[0].props.children).toBe("Modal 2");
//     });
//
//     test("RenderArr создает массив JSX элементов", () => {
//         const modalManager = GetModalJSX();
//
//         const TestComponent1 = <div>Modal 1</div>;
//         const TestComponent2 = <div>Modal 2</div>;
//
//         modalManager.addJSX(TestComponent1);
//         modalManager.addJSX(TestComponent2);
//
//         expect(modalManager.RenderArr()).toMatchSnapshot();
//     });
// });