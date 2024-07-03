import React, {useState} from "react";
import {StyleOtherRow} from "../components/commonNew/commonFuncReact";
import {FResizableReact} from "../components/common/Resizeble";
import {staticGetAdd} from "../../utils/sis";
import {updateBy} from "../updateBy";
import {AppGraph} from "../components/graph";
import {StatusRestApi} from "../components/statusRestApi";

const defMain = {
    tableSym: true,
    podval: true,
}

export function PageAdmin() {
    const [updateSize, updateSizeSet] = useState(0)

    const datum = staticGetAdd("defMain",defMain)
    updateBy(datum)

    return <div className={"maxSize"} onMouseUp={(e)=>{if (e.button==2) {
        // mouseAdd.map.set("pageMain", getMenu(datum))
    }}}>
        <div className={"toSpaceColum"} style={{height: "100%"}}>
            <div className={"toSpace"} style={{height: "100%", width: "100vw", ...StyleOtherRow}}>
                {datum.tableSym && <FResizableReact
                    keyForSave={"s2"}
                    enable={{right: true}}
                    size={{width: "20%", height: "100%"}}
                    onResizeStop={()=>{updateSizeSet(updateSize+1)}}
                >
                    <div className={"borderRight"} style={{width: "100%", height: "100%"}}>
                        <StatusRestApi/>
                    </div>
                </FResizableReact>}
                <div className={""} style={{width: "100%", height: "100%"}}>
                    админ
                    <AppGraph reSize={updateSize}/>
                </div>
            </div>
            {datum.podval && <FResizableReact
                keyForSave={"s1"}
                enable={{top: true}}
                size={{width: "100%", height: "20%"}}
            >
                <div className={"toSpaceOther borderTop maxSize"}>
                    админ
                </div>
            </FResizableReact>}
        </div>
    </div>
}
