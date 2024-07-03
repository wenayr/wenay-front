// import {CBar} from "wenay-common";
// import {tCanvasMini} from "./Canvas2Dmini";
//
//

export function Throw(text: string) {throw text}
export const CreateDom = {
    document: undefined as Document|undefined ,
    createElement(data: string) {return this.document?.createElement(data) ?? Throw("CreateDom.document = undefined")}
}
// // на бэке используется библиотека
CreateDom.document = document
//
export type ICContXY = {
    x: ()=> number;
    y: ()=> number;
    width: ()=> number;
    height: ()=> number;
    heightAbsolute?: ()=> number;
    widthAbsolute?: ()=> number;
}
//
// export function CCanvasBase({div, cor}: {div: HTMLDivElement, cor: ICContXY}) {
//     const element = CreateDom.createElement('canvas') as HTMLCanvasElement;
//     element.style.position = 'absolute';
//     div.appendChild(element);
//     const canvas = element.getContext('2d')! || Throw("element.getContext = error");
//     return {
//         element, canvas, cor,
//         Remove: ()=> element?.remove(),
//         RefreshCoor() {
//             element.style.left = cor.x().toString() + 'px';
//             element.style.top = cor.y().toString() + 'px';
//         },
//         RefreshSize() {
//             element.width = cor.width();
//             element.height = cor.height();
//         }
//     }
// }

// function CWinDisplayGraph({div, cor, arr: [widthD, heightD] = [60, 30]}: {div: HTMLDivElement, cor: ICContXY, arr?: [number, number]}) {
//     const fon = CCanvasBase({div, cor})
//     const size = {x: 0, y: 0, width: 0, height: 0}
//     const work3d = CCanvasBase({div, cor: {
//             ...cor,
//             width: () => cor.width() - widthD,
//             height: () => cor.height() - heightD
//         }});
//
//     function RefreshCoor() {
//         if (size.x != cor.x() || size.y != cor.y()) {
//             [size.x, size.y] = [cor.x(), cor.y()]
//             work3d.RefreshCoor()
//             fon.RefreshCoor()
//             return true
//         }
//         return false;
//     }
//
//     function RefreshSize() {
//         if (size.width != cor.width() || size.height != cor.height()) {
//             [size.width, size.height] = [cor.width(), cor.height()]
//             work3d.RefreshSize();
//             fon.RefreshSize();
//             return true;
//         }
//         return false;
//     }
//     // @ts-ignore
//     const Refresh = () =>(RefreshCoor() | RefreshSize()) > 0
//     return {
//         fon, work3d, Refresh
//     }
// }
//
// function corByDiv({div}: {div: HTMLDivElement}): ICContXY {
//     return {
//         height: () => div.getBoundingClientRect().height,
//         width: () => div.getBoundingClientRect().width,
//         x: ()=> 0,
//         y: ()=> 0,
//     }
// }
//
//
//
// type tBars2 = {close: number, time: Date}
// export type CanvasContext2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
//
// const styleCanvas = {
//     barType: "line" as "candle" | "bar" | "line",
//     colorLine: "#ffffff"
// }
//
// type tt = {bars: readonly (CBar|tBars2)[], canvas: CanvasContext2D, toX: (ibar: number) => number, toY: (price: number) => number, corX?: number, style: typeof styleCanvas}
// function DrawBars({bars, toY, toX, canvas, corX =0 , style: {barType, colorLine}}: tt) {
//     const lineTo = (ibar: number, price: number) => canvas.lineTo(toX(ibar + corX), toY(price));
//     const moveTo = (ibar: number, price: number) => canvas.moveTo(toX(ibar + corX), toY(price));
//     // const {x, y} = this._cwin.win;
//
//     // const _draw = ({show, data, color}: tCanvasMini) => {
//     //     if (show) {
//     //         if (!(data?.length)) return;
//     //         canvas.strokeStyle = color ?? "rgb(210,210,210)"
//     //         for (let i = 0; i < data.length; i++) {
//     //             lineTo(i, data[i]);
//     //         }
//     //         {
//     //             lineTo(data.length-1, data[data.length-1])
//     //             lineTo(data.length-1, y.minprice);
//     //             lineTo(0, y.minprice);
//     //             canvas.closePath();
//     //
//     //             const height = toY(y.minprice)//1000;
//     //             const gradient = canvas.createLinearGradient(0, 0, 0, height);
//     //             const  color1 = "rgba(243,186,47,0.73)"
//     //             const  color12 = "rgba(243,186,47,0.31)"
//     //             const  color15 = "rgba(112,89,255,0.11)"
//     //             const  color2 = "rgba(112,89,255,0)"
//     //             gradient.addColorStop(0, color1 )
//     //             gradient.addColorStop(0.3, color12 )
//     //             gradient.addColorStop(0.7, color15)
//     //             gradient.addColorStop(0.9, color2 )
//     //             canvas.fillStyle = gradient;
//     //             canvas.fill();
//     //             canvas.beginPath();
//     //
//     //             const  color3 = "rgb(243,186,47)"
//     //             const  color33 = "rgb(243,186,47)"
//     //             const  color4 = "rgb(112,89,255)"
//     //             const gradient2 = canvas.createLinearGradient(0, 0, 0, height*1.1);
//     //             gradient2.addColorStop(0, color3 ?? "rgb(243,186,47)")
//     //             // gradient2.addColorStop(0.5, color33)
//     //             gradient2.addColorStop(1, color4 ?? "rgb(112,89,255)")
//     //
//     //             for (let i = 0; i < data.length; i++) {
//     //                 lineTo(i, data[i]);
//     //             }
//     //             canvas.strokeStyle = gradient2;
//     //             canvas.stroke();
//     //         }
//     //         canvas.beginPath();
//     //     }
//     // }
//     //
//     // if (barType == "candle") {
//     //     function drawCandles(color: string, condition: (bar: CBar|tBars2) => boolean) {
//     //         canvas.fillStyle = color;
//     //         for (let [i, bar] of bars.entries()) {//вся функция отрисовки баров
//     //             if (condition(bar) == true) {
//     //                 canvas.fillRect(toX(i), toY(bar.low), 1, -(bar.high - bar.low) * y.scale);               //рисуем хвосты
//     //                 if (x.scale > 2) canvas.fillRect(toX(i) - corX, toY(bar.open), corX * 2, -(bar.close - bar.open) * y.scale);     //рисуем тело
//     //             }
//     //         }
//     //     }
//     //
//     //     // drawCandles(this.defaultColor.barDw.color, (bar) => bar.open > bar.close);
//     //     // drawCandles(this.defaultColor.barUp.color, (bar) => bar.open <= bar.close);
//     // }
//     // //рисуем бары
//     // if (barType == "bar") {
//     //     let width = x.scale * 0.1;
//     //     if (width < 1) width = 1;
//     //
//     //     function drawBars(color: string, condition: (bar: CBar|tBars2) => boolean) {
//     //         canvas.fillStyle = color; //
//     //         for (let [i, bar] of bars.entries()) { //let i=startBar; i<=endBar; i++){ bar=bars[i];//вся функция отрисовки баров
//     //             if (condition(bar) == true) {
//     //                 // canvas.fillRect(toX(i), toY(bar.low), width, -(bar.high - bar.low) * y.scale);               //рисуем хвосты
//     //                 //
//     //                 // if (x.scale > 2) {
//     //                 //     canvas.fillRect(toX(i) - corX, toY(bar.open), corX, -3);
//     //                 //     canvas.fillRect(toX(i), toY(bar.close), corX, -3);
//     //                 // }    //рисуем тело
//     //             }
//     //         }
//     //     }
//     //
//     //     // drawBars(this.defaultColor.barDw.color, (bar) => bar.open > bar.close)
//     //     // drawBars(this.defaultColor.barUp.color, (bar) => bar.open <= bar.close)
//     // }
//     //рисуем график линией
//     if (barType == "line") {
//         canvas.strokeStyle = colorLine;//disignnowT.barup;
//         if (bars.length > 0) moveTo(0, bars[0].close);//установить начальное положение для линии
//
//
//         if (bars.length > 0) moveTo(0, bars[0].close);//установить начальное положение для линии
//         // _draw({show: true, data: bars.map(e=>e.close)})
//
//         for (let i = 0; i < bars.length; i++) {
//             lineTo(i, bars[i].close);
//         }
//
//         // for (let [i, bar] of bars.entries()) { //for (let i=startBar; i<=endBar; i++){ bar=bars[i];//вся функция отрисовки баров
//         //     lineTo(i, bar.close);
//         // }
//         canvas.stroke();
//         canvas.beginPath();
//
//     }
// }
//
// function transform() {
//     const cr = new class {
//         x = 0
//         y = 0
//         // от центра
//         dx = 0
//         dy = 0
//         wightPx = 0
//         highPx = 0
//         // let scale = 1.0
//         showB = 50
//         priceMin = 0
//         priceMax = 0
//     }
//     const px = () => cr.wightPx / cr.showB
//     const py = () => cr.wightPx / (cr.priceMax - cr.priceMin)
//     // уровень в пикселях priceMin
//     // let y0 = 0
//     return {
//         cr,
//         getRangeBars(){
//             console.log(cr.showB, cr.wightPx, px())
//             return [(-cr.dx - cr.wightPx * 0.5)/px(), (-cr.dx + cr.wightPx * 0.5)/px()]
//         },
//         getBar(px: number) {
//             return px * cr.showB / cr.wightPx
//         },
//         getPrice(px: number) {
//             return 0
//         },
//         toX(bar: number) {
//             return bar * px() //+ cr.dx /// px()
//         },
//         toY(price: number) {
//             return (cr.priceMax - price) * py() + cr.dy /// py()
//         }
//     }
// }
//
// const searchMaxMin = <T extends object>(arr: T[], v1: (a: T) => number, v2: (a: T) => number) => ({
//     priceMax: arr.reduce((e1, e2)=> v1(e1) > v1(e2) ? e1 : e2, arr[0]),
//     priceMin: arr.reduce((e1, e2)=> v2(e1) < v2(e2) ? e1 : e2, arr[0]),
// })
//
// export function canvasAnd({div}: {div: HTMLDivElement}) {
//     const display = CWinDisplayGraph({div, cor: corByDiv({div})})
//     const style = styleCanvas
//     const ms = transform()
//     const canvas = display.work3d.canvas
//     const canvasFon = display.fon.canvas
//     display.Refresh()
//     ms.cr.wightPx = +display.work3d.cor.width()
//     ms.cr.highPx = +display.work3d.cor.height()
//     console.log(display.work3d.cor.width())
//     let bars: tBars2[] = [
//         { time: new Date('2019-04-11'), close: 80.01 },
//         { time: new Date('2019-04-12'), close: 96.63 },
//         { time: new Date('2019-04-13'), close: 76.64 },
//         { time: new Date('2019-04-14'), close: 81.89 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//         { time: new Date('2019-04-15'), close: 74.43 },
//         { time: new Date('2019-04-16'), close: 80.01 },
//         { time: new Date('2019-04-17'), close: 96.63 },
//         { time: new Date('2019-04-18'), close: 76.64 },
//         { time: new Date('2019-04-19'), close: 81.89 },
//         { time: new Date('2019-04-20'), close: 74.43 },
//     ]
//     const mousemove = (e: MouseEvent) => {
//         if (e.buttons == 1) {
//             ms.cr.dx -= ms.cr.x - e.x
//             ms.cr.dy -= ms.cr.y - e.y
//             const {max, min} = Math
//             const r = ms.getRangeBars().map(e=> e < 0 ? bars.length + Math.floor(e) : bars.length)
//             const corX = r[0]// max(r[0], 0)
//             const b = bars.slice(max(r[0], 0), max(r[1], 0))
//             console.log({...ms.cr}, r,b)
//             const price = searchMaxMin(b, e=> e.close , e=> e.close)
//             if (b.length) {
//                 ms.cr.priceMax = price.priceMax.close
//                 ms.cr.priceMin = price.priceMin.close
//             }
//             display.work3d.canvas.clearRect(0,0,500,500)
//             DrawBars({canvas, style, toX: ms.toX, toY: ms.toY, bars: b, corX})
//         }
//         ms.cr.x = e.x
//         ms.cr.y = e.y
//
//     }
//
//     const mousedown = (e: MouseEvent) => {
//
//     }
//     const mouseup = (e: MouseEvent) => {
//
//     }
//
//
//
//     div.addEventListener("mousemove", (e)=> {
//         mousemove(e)
//     })
//     div.addEventListener("mousedown", (e)=> {})
//     return {
//         getBars(a: tBars2[]){
//             bars = a
//         }
//     }
// }
