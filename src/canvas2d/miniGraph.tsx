import React from "react";
import {ColorString} from "wenay-common";
import {ICContXY} from "./Canvas2D";
import {CCanvas2DMini, ICCanvas2DMini, tSetEventByOnFocus} from "./Canvas2Dmini";


export type tMiniGraph = {key?:string|number,show: true, color: ColorString, data: number[]}
type CMiniGraphProps = {
    lines?: tMiniGraph[],
    cor?: ICContXY,
    getApi?: (api:ICCanvas2DMini)=>void,
    result?: boolean,
    style?: React.CSSProperties,
    onFocus?: (data: any)=>void
    Focus?: boolean, // показывать выделение при наведении мышкой
    gradient?: {color1?: ColorString, color2?: ColorString}
}
type sCMiniGraph = {
    focus: boolean
}

type tInfo = tSetEventByOnFocus & { flag: boolean}
type tDivApi = {info: (data: tInfo) => void}
function FByCMiniGraph(data:{getApi:(api:any)=>void, timOut?: number}) {


    const [up,setUp] = React.useState({x: 10, y: 20, flag:false} as tInfo)

    // const buf = {time: 0}
    // const funcTimeOut = async (ms?: number)=>{
    //     if (ms && ms >buf.time) {
    //         if (buf.time>0) {
    //             buf.time = ms;
    //             return;
    //         }
    //         buf.time = ms;
    //     }
    //     if (buf.time<=0) {
    //         console.log(0)
    //         setUp({...up, flag: false})
    //         return;
    //     }
    //     else {
    //         console.log(12121)
    //         buf.time-=200
    //         await sleepAsync(200)
    //         funcTimeOut()
    //     }
    // }

    let info: tInfo|undefined
    const api = {
        info: (datum: tInfo) => {
           // console.log(datum);
            info = {...datum, x:Math.round(datum.x), y:Math.round(datum.y)};
            setUp(datum)
            // funcTimeOut(data.timOut?? 7000)
        },
    }
    // console.log(info);<div class="bubble speech">Выноска в стиле комиксов для иллюстрации речи персонажа, напоминающая «облачко».</div>
    // console.log(up);
    data.getApi(api)
    return up.flag ? <div className={""} style={{position:"absolute", left: (up.x??0)+20, top: up?.y??0, height:"auto", width:120, padding: 10, background: "rgba(0,0,0,0.71)", zIndex:999 }}>
        {(up.name??up.key) + (up.nowData? ": "+up.nowData.toFixed(2):"")}
    </div> : null
}

export class CMiniGraph extends React.Component<CMiniGraphProps, any>{
    ref: HTMLDivElement | null = null
    api: ICCanvas2DMini = new CCanvas2DMini()
    state: sCMiniGraph = {
        focus: false
    }
    constructor(p: CMiniGraphProps) {
        super(p);
        this.api = new CCanvas2DMini()
        this.api.setEventByOnFocus((data)=>{
            this.divApi?.info({...data, flag: true})
            // this.setState({focus: true})
        })
    }

    componentDidMount() {
        this.api?.clean();
        if (this.props.lines) {
            this.DrawMiniCanvas(this.props.lines)
        }
        this.props.getApi?.(this.api)
    }

    componentDidUpdate(prevProps: Readonly<{ lines?: tMiniGraph[]; getApi?: (api: ICCanvas2DMini) => void }>, prevState: Readonly<any>, snapshot?: any) {
        this.api?.clean();
        if (this.props.lines?.length) {
            this.DrawMiniCanvas(this.props.lines)
        }
        else {this.api?.clean()}
    }

    DrawMiniCanvas (lines: tMiniGraph[]) {
        lines.forEach((line,i)=> this.api?.addData2(line.key ?? i, line))
        this.api?.Draw()
    }
    divApi: tDivApi | undefined
    render() {
        if (this.props.gradient) this.api?.setGradient({...this.props.gradient})
        else this.api?.offGradient()

        return <div
            ref = {(ref) => {
                if (this.ref != ref && ref) {
                    this.ref = ref;
                    this.api?.setHtml({html: ref, cor: this.props.cor, result: this.props.result})
                }
            }}
            className = {"maxSize"}
            onResize={()=>{this.api?.display.RefreshSize()}}
            style = {{...this.props.style, position:"relative"}}
            onMouseLeave={()=>{this.divApi?.info({flag:false, x:10, y: 10} as tInfo)}}
        >
            {/*<FByCMiniGraph getApi={(api)=>{this.divApi = api}}/>*/}
            {/*{this.state.focus && <div style={{position:"absolute", left:0, top:0, height:100, width:100, background: "rgb(225,225,225)", zIndex:999 }}>*/}
            {/*    dsssssssssss*/}
            {/*</div>}*/}
        </div>;
    }
}


