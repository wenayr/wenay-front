import {Button, DivRnd, DivRnd3, mouseMenuApi, renderBy, updateBy} from "../api";
import {GridExample, tt} from "./useGrid";


const a = {}
export function TestMain() {
    return <div className={"maxSize"}>
        <ExampleUsage/>
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