import {Button, DivRnd3, mouseMenuApi, renderBy, updateBy} from "../api";
import {GridExample, tt} from "./useGrid";
import {ChartDemo} from "../src/myChart/1/myChartTest";
import {MyChartEngine} from "../src/myChart/chartEngine/chartEngineReact";
import {MegaWebGLChart} from "../src/myChart/3d/3d";
import {TestParams} from "./testParams";


const a = {}
const b = {}
export function TestMain() {
    updateBy(b)
    return <div className={"maxSize"}>
        <ExampleUsage/>
        <ButtonChart/>
        <ButtonChart3d/>
        <ButtonParams/>
        <div className={"msTradeAlt"}
            onClick={()=>{
                renderBy(tt)
            }}
        >menu</div>
        <div className={"msTradeAlt"}
            onClick={()=>{
                renderBy(a)
            }}
        >update</div>
        <mouseMenuApi.ReactMouse>
            <GridExample/>
        </mouseMenuApi.ReactMouse>
    </div>
}

const Container = () => {
    console.log(Date.now())
    updateBy(a)
    return <div className={"maxSize"}>
        <GridExample/>
    </div>
}
const ExampleUsage = () => {
    return <Button button={e => <div className={!e ? "msTradeAlt" : "msTradeAlt msTradeActive"}>menu</div>}>
        {(api) => {
            return <DivRnd3 keyForSave={"tt1232"}
                           key={"sds"}
                           size={{height: 300, width: 300}}
                           className={"fon border fonLight"} // fon border fonLight
                           moveOnlyHeader={true}
                           onCLickClose={api.onClose}
                           limit={{y: {min: 0}}}
                           onUpdate={() => {
                               // setUpdate(update + 1)
                           }}>
                <div className={"maxSize"}>
                    <Container/>
                </div>
                {/*<MenuSeries update={update} key={"2323"}/>*/}
            </DivRnd3>
        }}
    </Button>
};
const ButtonChart = () => {
    return <Button button={e => <div className={!e ? "msTradeAlt" : "msTradeAlt msTradeActive"}>chart</div>}>
        {(api) => {
            return <DivRnd3 keyForSave={"tt123322"}
                           key={"sds2"}
                           size={{height: 300, width: 300}}
                           className={"fon border fonLight"} // fon border fonLight
                           moveOnlyHeader={true}
                           onCLickClose={api.onClose}
                           limit={{y: {min: 0}}}
                           onUpdate={() => {
                               // setUpdate(update + 1)
                           }}>
                <div className={"maxSize"}>
                    <MyChartEngine/>
                </div>
                {/*<MenuSeries update={update} key={"2323"}/>*/}
            </DivRnd3>
        }}
    </Button>
};
const ButtonChart3d = () => {
    return <Button button={e => <div className={!e ? "msTradeAlt" : "msTradeAlt msTradeActive"}>chart</div>}>
        {(api) => {
            return <DivRnd3 keyForSave={"tt123322"}
                           key={"sds2"}
                           size={{height: 300, width: 300}}
                           className={"fon border fonLight"} // fon border fonLight
                           moveOnlyHeader={true}
                           onCLickClose={api.onClose}
                           limit={{y: {min: 0}}}
                           onUpdate={() => {
                               // setUpdate(update + 1)
                           }}>
                <div className={"maxSize"}>
                    <MegaWebGLChart/>
                </div>
                {/*<MenuSeries update={update} key={"2323"}/>*/}
            </DivRnd3>
        }}
    </Button>
};
const ButtonParams = () => {
    return <Button button={e => <div className={!e ? "msTradeAlt" : "msTradeAlt msTradeActive"}>chart</div>}>
        {(api) => {
            return <DivRnd3 keyForSave={"tt123322"}
                           key={"sds2"}
                           size={{height: 300, width: 300}}
                           className={"fon border fonLight"} // fon border fonLight
                           moveOnlyHeader={true}
                           onCLickClose={api.onClose}
                           limit={{y: {min: 0}}}
                           onUpdate={() => {
                               // setUpdate(update + 1)
                           }}>
                <div className={"maxSize"}>
                    <TestParams/>
                </div>
                {/*<MenuSeries update={update} key={"2323"}/>*/}
            </DivRnd3>
        }}
    </Button>
};