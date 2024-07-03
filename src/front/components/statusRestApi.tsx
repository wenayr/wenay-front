import {ApiFacade} from "../../utils/apiFacade";
import {useState} from "react";

export function StatusRestApi(a: {update?: number}) {
    const tr = useState(0)
    const ar = Object.entries(ApiFacade.facade ?? {})
    const div = ar.map(([k,v],i)=><div key={i} className={"msTradeAlt"}>
        {`${k} ${v.api.callbackTotal()} ${v.api.promiseTotal()}` }
    </div>)
    return <div>
        <div className={"msTradeAlt"} onClick={()=>{tr[1](tr[0]+1)}}>ref</div>
        {div}
        <div className={"msTradeAlt"} onClick={async ()=>{
            console.log("start")
            // await apiFacade.facade.facadeTester.all.subscribeLogs((e)=>{
            //     logsApi.addLogs({time: new Date(), var: 5, id: "23", txt: e})
            // })
            console.log("final")
        }}>test callback</div>
        <div className={"msTradeAlt"} onClick={async ()=>{
        }}>test callback</div>
    </div>
}